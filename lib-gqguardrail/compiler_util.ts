/*
 * Copyright 2020 Carson Cheng
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const forceUpdate = () => {
    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoder();
    const shScriptName = "compile_myprogram_bash.sh";
    const updatedFlagFilePath = "libs/update1.txt";
    const reloadFlag = "--reload ";

    try { // check for updated marker
        let x = Deno.readFileSync(updatedFlagFilePath);
        let shScript = textDecoder.decode(Deno.readFileSync(shScriptName));
        shScript = shScript.replace(reloadFlag, "");
        //console.log(shScript);
        Deno.writeFileSync(shScriptName, textEncoder.encode(shScript));
    } catch (c) {
        try { // if not updated:
            let shScript = textDecoder.decode(Deno.readFileSync(shScriptName));
            const idx = shScript.indexOf("--allow-read");
            shScript = shScript.substring(0, idx) + reloadFlag + shScript.substring(idx);
            //console.log(shScript);
            Deno.writeFileSync(shScriptName, textEncoder.encode(shScript));
            // insert updated marker
            Deno.writeFileSync(updatedFlagFilePath, textEncoder.encode("updated1"));
        } catch (c) {
            return;
        }
    }
}

export const main = async () => {
    forceUpdate();
    const compOpts: Deno.CompilerOptions = {
        alwaysStrict: true,
        sourceMap: false,
        inlineSourceMap: true,
        inlineSources: true,
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
            msg += diag.message;
            msg += "\n";
            msg += "See line " + (diag.lineNumber ? diag.lineNumber + 1 : 0) +
                " maybe between columns " + (diag.startColumn
                    ? diag.startColumn + 1
                    : 0) +
                " and " + (diag.endColumn ? diag.endColumn + 1 : 0);
            msg += "\n";
            msg += "In file: " + diag.scriptResourceName;
            msg += "\n";
            msg += "Context: " + diag.sourceLine;
            msg += "\n";
            msg += ("-------------------");
            console.log(msg);
        }

        console.log(
            "\nBuilding despite warnings and errors.  You've been warned..."
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

