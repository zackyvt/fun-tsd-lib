/*
 * Copyright 2020 Carson Cheng
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// on first run of new program from template, forces program to update once on second run only
const forceUpdateOnce = () => {
    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoder();
    const shScriptName = "compile_myprogram_bash.sh";
    const batScriptName = "compile_myprogram_windows.bat";
    const updatedFlagFilePath = "libs/update1.txt";
    const updateFlatFileContent = "update flag: updated1";
    const reloadFlag = "--reload ";

    try { // check for updated marker
        let x = Deno.readFileSync(updatedFlagFilePath);

        let shScript = textDecoder.decode(Deno.readFileSync(shScriptName));
        shScript = shScript.replace(reloadFlag, "");
        Deno.writeFileSync(shScriptName, textEncoder.encode(shScript));

        let batScript = textDecoder.decode(Deno.readFileSync(batScriptName));
        batScript = batScript.replace(reloadFlag, "");
        Deno.writeFileSync(batScriptName, textEncoder.encode(batScript));
    } catch (c) {
        try { // if not updated:
            const runCmd = " run ";

            let shScript = textDecoder.decode(Deno.readFileSync(shScriptName));
            const shScriptCutIdx = shScript.indexOf(runCmd) + runCmd.length;
            shScript = shScript.substring(0, shScriptCutIdx) + reloadFlag + shScript.substring(shScriptCutIdx);
            Deno.writeFileSync(shScriptName, textEncoder.encode(shScript));

            let batScript = textDecoder.decode(Deno.readFileSync(batScriptName));
            const batScriptCutIdx = batScript.indexOf(runCmd) + runCmd.length;
            batScript = batScript.substring(0, batScriptCutIdx) + reloadFlag + batScript.substring(batScriptCutIdx);
            Deno.writeFileSync(batScriptName, textEncoder.encode(batScript));

            // insert updated marker
            Deno.writeFileSync(updatedFlagFilePath, textEncoder.encode(updateFlatFileContent));
        } catch (c) {
            return;
        }
    }
}

export const main = async () => {
    forceUpdateOnce();
    const compOpts: Deno.CompilerOptions = {
        alwaysStrict: true,
        sourceMap: false,
        inlineSourceMap: true,
        inlineSources: true,
        removeComments: false,
        outDir: "build" // only works if compilation src doesn't import Deno libs
    };

    for (let i = 0; i < Deno.args.length; ++i) {
        // e.g. deno --allow-read --allow-write libs/compiler_driver.ts --build "build" src/myprogram.ts
        // account for: "--build" "build_path_for_rest_of_files_until_next_build_param_but_default_is_build" "file1" "file2"
        // build_path only works if compilation src doesn't import Deno libs (if it does, then UB)

        const arg = Deno.args[i];
        if (arg == "--build") {
            ++i;
            compOpts.outDir = Deno.args[i]; // only works if compilation src doesn't import Deno libs
            continue;
        }

        if (arg == "--myprogram") {
            ++i;
            const filename = Deno.args[i];
            await compileStrippingModuleSyntax(filename, compOpts, "myprogram.js");
            continue;
        }

        if (arg == "--emitByFilenameOnly") {
            ++i;
            const filename = Deno.args[i]; // filenames must not contain "/"
            await compileStrippingModuleSyntax(filename, compOpts, "");
            continue;
        }

        const filename = Deno.args[i];
        // let file = await Deno.open(filename);
        // await Deno.copy(Deno.stdout, file);
        await compileStrippingModuleSyntax(filename, compOpts);
    }
};


export const compileStrippingModuleSyntax = async (
    filename: string,
    compOpts: Deno.CompilerOptions,
    emitOnlyFile?: string | undefined
): Promise<void> => {
    const textEncoder = new TextEncoder();

    const [diagnostics, emitMap] = await Deno.compile(
        filename,
        undefined,
        compOpts
    );

    if (diagnostics) {
        console.log("\nWarnings and Errors from compiling " + filename);
        console.log("===============================================");
        for (let diag of diagnostics ? diagnostics : []) {
            let msg = "";
            msg += Deno.formatDiagnostics([diag]);
            msg += "\n\n";
            msg += "    see line " + (diag.start?.line ? diag.start.line + 1 : 0) +
                " from column " + (diag.start?.character ? diag.start.character + 1 : 0) +
                " to line " + (diag.end?.line ? diag.end.line + 1 : 0) +
                " column " + (diag.end?.character ? diag.end.character + 1 : 0) +
                ".";
            msg += "\n";
            msg += "    in file: " + diag.fileName;
            msg += "\n";
            msg += ("\n-------------------\n");
            console.log(msg);
        }

        console.log(
            "Building despite warnings and errors.  You've been warned..."
        );
    }
    for (let path in emitMap) {
        let emitCode: string = emitMap[path];

        if (emitOnlyFile != null) {
            if (emitOnlyFile === "") {
                path = (compOpts["outDir"] ? compOpts["outDir"] : ".") + "/" + path.substring(path.lastIndexOf("/") + 1);
            } else if (path.indexOf(emitOnlyFile) >= 0) {
                path = (compOpts["outDir"] ? compOpts["outDir"] : ".") + "/" + emitOnlyFile;
            } else {
                continue;
            }
        }

        console.log("\nCompiling: " + filename);
        console.log(" Building: " + path);

        emitCode = stripImportStatements(emitCode);
        emitCode = stripExportSyntax(emitCode);

        Deno.mkdirSync(path.substring(0, path.lastIndexOf("/")), { recursive: true });
        Deno.writeFileSync(path, textEncoder.encode(emitCode));
    }
};

const stripImportStatements = (emitCode: string): string => {
    let importStrippedWarned = false;
    const matches = emitCode.matchAll(/ *(import|export) *\{?[a-zA-Z0-9_*, ]*\}? *(as)? *[a-zA-Z0-9_]* *(from)? *"[^"]+"/g);
    for (let match of matches) {
        if (!importStrippedWarned) {
            importStrippedWarned = true;
            console.log("Note: import syntax is not supported. That's ok. Attempting removal and compiling anyway.");
        }
        const idx = emitCode.indexOf(match[0]);
        emitCode = emitCode.substring(0, idx) + "//" + emitCode.substring(idx);
    }
    return emitCode;
}

const stripExportSyntax = (emitCode: string): string => {
    let exportStrippedWarned = false;
    const exportMatches = emitCode.matchAll(/export (let|const|var)/g);
    for (let match of exportMatches) {
        if (!exportStrippedWarned) {
            exportStrippedWarned = true;
            console.log("Note: export syntax is not supported. That's ok. Attempting removal and compiling anyway.");
        }
        const idx = emitCode.indexOf(match[0]);
        emitCode = emitCode.substring(0, idx) + "      " + emitCode.substring(idx + 6);
    }
    return emitCode;
}

