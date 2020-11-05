"use strict";
const Deno_openSync = Deno.openSync;
const Deno_readFileSync = Deno.readFileSync;
const Deno_createSync = Deno.createSync;
const Deno_removeSync = Deno.removeSync;
declare type Deno_Process = Deno.Process;
const Deno_run = Deno.run;

import * as paths_util from "./paths_util.ts";
import * as logging_util from "./logging_util.ts";

const textDecoderUtf8 = new TextDecoder("utf-8");
const textEncoder = new TextEncoder();

export type studentProgramAttrQuality = {
    name: string,
    featureCount: number,
    maxFeatureCount: number,
    log: string
};

export type inOutExpectedFilesPair = { inFilePath: paths_util.path, outExpectedFilePath: paths_util.path };

export type studentProgramQuality = {
    myprogramBaseDir: paths_util.path,
    checkerMessageToStudent: string,
    inOutExpFilesCount: number,
    folderStructure: studentProgramAttrQuality,
    diffResults: studentProgramAttrQuality[],
    inOutExpNullDiffCount: number,
    myprogramOutActual: string[],
    myprogramStdErrActual: string[]
};

/**
 * 
 * @returns array of pairs of in/outExpected paths
 */
export const inOutExpectedFilesPaths = (baseDir: paths_util.path): inOutExpectedFilesPair[] => {
    const paths: inOutExpectedFilesPair[] = [];
    const maxFilePairsCount: number = 100;
    for (let idx: number = 0; idx < maxFilePairsCount; ++idx) {
        const inFilename: string = "in" + (idx === 0 ? "" : idx) + ".txt";
        const inFilePath: paths_util.path = baseDir.concat(inFilename);

        const outExpectedFilename: string = "outExpected" + (idx === 0 ? "" : idx) + ".txt";
        const outExpectedFilePath: paths_util.path = baseDir.concat(outExpectedFilename);

        try {
            const inFileInfo = Deno_openSync(inFilePath.join("/"));
            try {
                const outExpFileInfo = Deno_openSync(outExpectedFilePath.join("/"));
                paths.push({ inFilePath, outExpectedFilePath });
            } catch (e) {
                inFileInfo.close();
                break;
            }
        } catch (e) {
            break;
        }
    }
    return paths;
}


export const checkStudentProjectFolderStructure = (myprogramRelativeBaseDir: paths_util.path): studentProgramAttrQuality => {
    let ret: studentProgramAttrQuality = {
        name: "student project folder structure",
        featureCount: 0,
        maxFeatureCount: 1,
        log: ""
    };
    if (myprogramRelativeBaseDir[0] !== ".") {
        myprogramRelativeBaseDir.splice(0, 0, ".");
    }
    if (myprogramRelativeBaseDir.length < 2) {
        let log = "";
        log += "myprogram.ts found in: " + myprogramRelativeBaseDir.join("/") + "\n";
        log += "myprogram.ts is not in proper project folder.\nFix project folder before checking again!";
        ret.featureCount = 0;
        ret.log = log;
        return ret;
    }

    const studentProjectRequiredFiles = [
        "cs10-txt-lib-0.6.ts",
        "myprogram.ts",
        "run_program_bash.sh",
        "run_program_macs.command"
    ];
    const firstMyprogramBaseDirStr = myprogramRelativeBaseDir.join("/");
    for (let f of studentProjectRequiredFiles) {
        try {
            const requiredFile = Deno_openSync(
                firstMyprogramBaseDirStr + "/" + f,
                { read: true }
            );
            requiredFile.close();
        } catch (e) {
            ret.featureCount = 0;
            ret.log = "Error! Missing file: " + f;
            return ret;
        }
    }
    ret.featureCount = ret.maxFeatureCount;
    ret.log = "";
    return ret;
};

export const writeStudentProgramOutputFile = (outFilename: string, studentProgramOut: string): void => {
    Deno_createSync(outFilename).close();
    Deno_removeSync(outFilename);
    const stuProOutFile = Deno_createSync(outFilename);
    // const stuProOutFile = Deno_openSync(outFilename, { read: true, write: true });
    stuProOutFile.writeSync(textEncoder.encode(studentProgramOut));
    stuProOutFile.close();
}

export const postProcessStudentProgramOutput = (studentProgramOut: string): string => {
    if (Deno.build.os == "windows"){
        studentProgramOut = studentProgramOut.replaceAll("\r\n", "\n");

        const headerTag: string = "deno run -A myprogram.ts";
        studentProgramOut = studentProgramOut.substring(studentProgramOut.indexOf(headerTag) + headerTag.length);
        let cutIdx = 0;
        while (cutIdx < studentProgramOut.length){
            if (studentProgramOut[cutIdx] !== "\n"){
                ++cutIdx;
            } else {
                ++cutIdx;
                break;
            }
        }
        studentProgramOut = studentProgramOut.substring(cutIdx);

        cutIdx = studentProgramOut.lastIndexOf(">pause");
        while (cutIdx >= 0){
            if (studentProgramOut[cutIdx] !== "\n"){
                --cutIdx;
            } else {
                --cutIdx;
                break;
            }
        }
        studentProgramOut = studentProgramOut.substring(0, cutIdx + 1);
    }

    // strip out first line if it should be "Using deno"...
    if (0 === studentProgramOut.indexOf("Using deno")) {
        const reMatch = /\r?\n/.exec(studentProgramOut);
        const firstNewlineIdx = reMatch?.index == null ? -1 : reMatch?.index;
        studentProgramOut = studentProgramOut.substring(firstNewlineIdx + 1);
        if (studentProgramOut.substring(0, 1) === "\n") {
            studentProgramOut = studentProgramOut.substring(1);
        }
    }
    return studentProgramOut;
};


export const diffStudentVsExpectedOutput = async (inFilename: string, outFilename: string, outExpectedFilename: string): Promise<studentProgramAttrQuality> => {
    if (Deno.build.os == "windows"){
        outFilename = (outFilename.substring(0, 2) === "./") ? outFilename.substring(2) : outFilename;
        outExpectedFilename = (outExpectedFilename.substring(0, 2) === "./") ? outExpectedFilename.substring(2) : outExpectedFilename;
    }
    const winFcCmd = [
        "fc",
        outExpectedFilename,
        outFilename
    ];
    const diffCmd = [
        "diff",
        "-du",
        // "--color=always", // no color on old diff on Macs
        outExpectedFilename,
        outFilename
    ];
    const diffProcessArg = (Deno.build.os == "windows") ? winFcCmd: diffCmd;

    const diffPro: Deno_Process = Deno_run({
        cmd: diffProcessArg,
        stdout: "piped"
    });
    const diffRes: string = textDecoderUtf8.decode(await diffPro.output());

    let ret: studentProgramAttrQuality = {
        name: "student program output diff",
        featureCount: 0,
        maxFeatureCount: 1,
        log: ""
    };
    if (diffRes == "" || (Deno.build.os == "windows" && diffRes.indexOf("FC: no differences encountered") > -1)) {
        ret.featureCount = 1;
        ret.log = "Good job!!  No difference from expected output for this example input.";
        return ret;
    } else {
        let log: string = "";
        log += "Unexpected output for this example input:" + "\n";
        log += textDecoderUtf8.decode(Deno_readFileSync(inFilename)) + "\n";
        log += (Deno.build.os == "windows") ? "See differences below\n" 
            : "See differences below (Expected - but got +)\n"; // "Expected < but got >\n"
        log += diffRes;
        ret.featureCount = 0;
        ret.log = log;
        return ret;
    }
}


export const runStudentMyProgram = async (inFilename: string, myprogramBaseDir: string, useStudentRunProgramShScript: boolean)
    : Promise<{
        stdout: string,
        stderr: string
    }> => {
    const inFile = Deno_openSync(inFilename);
    const winCmd = ["cmd", "/C", "run_program_windows.bat"];
    const shellCmd = ["sh", "run_program_bash.sh"];
    const directCmd = ["deno", "run", "myprogram.ts"];
    const cmd = !useStudentRunProgramShScript ? directCmd :
        (Deno.build.os == "windows" ? winCmd : shellCmd);
    
    if (!useStudentRunProgramShScript) {
        const echoProgram: Deno_Process = Deno_run({
            cmd: ["which", "deno"],
            stdout: "piped"
        });
        const denoExecPath: string = textDecoderUtf8.decode(await echoProgram.output());
        console.log("Using deno at: " + denoExecPath.substring(0, denoExecPath.length-1));
        console.log("Running student program with: " + "[" + cmd.join(", ") + "]");
    }

    const studentProgram: Deno_Process = Deno_run({
        cmd,
        cwd: myprogramBaseDir,
        stdout: "piped",
        stdin: inFile.rid,
        stderr: "piped"
    });
    let studentProgramOut: string = textDecoderUtf8.decode(await studentProgram.output());
    const studentProgramErr: string = textDecoderUtf8.decode(await studentProgram.stderrOutput());
    console.log(studentProgramErr);
    inFile.close();
    return {
        stdout: studentProgramOut,
        stderr: studentProgramErr
    };
};

export const checkMyprogramAtBaseDir = async ({
    myprogramBaseDir,
    inOutExpFilePairs,
    outFileDir,
    useStudentRunProgramShScript
}: {
    myprogramBaseDir: paths_util.path;
    inOutExpFilePairs: inOutExpectedFilesPair[];
    outFileDir: paths_util.path;
    useStudentRunProgramShScript: boolean;
}): Promise<studentProgramQuality> => {
    const scribe: logging_util.Logger = new logging_util.Logger(true);
    const myprogramBaseDirStr = myprogramBaseDir.join("/");
    console.log("===========================================");
    scribe.log("Checking program in: " + myprogramBaseDirStr);

    const folderStructResult = checkStudentProjectFolderStructure(myprogramBaseDir);

    const ret: studentProgramQuality = {
        myprogramBaseDir: myprogramBaseDir,
        checkerMessageToStudent: "",
        inOutExpFilesCount: inOutExpFilePairs.length,
        inOutExpNullDiffCount: 0,
        diffResults: [],
        folderStructure: folderStructResult,
        myprogramOutActual: [],
        myprogramStdErrActual: []
    }

    if (folderStructResult.featureCount !== folderStructResult.maxFeatureCount) {
        scribe.log(folderStructResult.log);
    } else if (inOutExpFilePairs.length === 0) {
        scribe.log("Error: checker is missing in.txt or outExpected.txt file(s).");
    } else {
        let correctCount = 0;
        for (let idx: number = 0; idx < inOutExpFilePairs.length; ++idx) {
            const inFilePath: string = inOutExpFilePairs[idx].inFilePath.join("/");
            const outExpectedFilePath: string = inOutExpFilePairs[idx].outExpectedFilePath.join("/");
            scribe.log("\nChecking test case " + idx);

            const outFilePath: string = outFileDir.join("/") + "/out" + (idx === 0 ? "" : idx) + ".txt";
            const stuProgOutErr: {
                stdout: string,
                stderr: string
            } = await runStudentMyProgram(inFilePath, myprogramBaseDirStr, useStudentRunProgramShScript);
            ret.myprogramOutActual[idx] = stuProgOutErr.stdout;
            ret.myprogramStdErrActual[idx] = stuProgOutErr.stderr;
            scribe.log(stuProgOutErr.stderr);
            writeStudentProgramOutputFile(outFilePath, postProcessStudentProgramOutput(stuProgOutErr.stdout));
            const diffResult: studentProgramAttrQuality = await diffStudentVsExpectedOutput(inFilePath, outFilePath, outExpectedFilePath);
            if (diffResult.featureCount === diffResult.maxFeatureCount) {
                ++correctCount;
            }
            scribe.log(diffResult.log);
            ret.diffResults[idx] = diffResult;
        }
        ret.inOutExpNullDiffCount = correctCount;
        if (correctCount > 0) {
            scribe.log("\nRemember just because your program worked ok for " + correctCount + " test " + (correctCount > 1 ? "cases" : "case") + ", it doesn't mean it's perfect!  Your program must work for *all* input as specified in the assigned program specifications!");
        }
    }
    ret.checkerMessageToStudent = scribe.messagesStr();
    return ret;
}