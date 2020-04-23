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
    myprogramOutActual: string[]
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
    const diffProcessArg = [
        "diff",
        // "--color=always", // no color on old diff on Macs
        outExpectedFilename,
        outFilename
    ];

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
    if (diffRes == "") {
        ret.featureCount = 1;
        ret.log = "Good job!!  No difference from expected output for this example input.";
        return ret;
    } else {
        let log: string = "";
        log += "Unexpected output for this example input:" + "\n";
        log += textDecoderUtf8.decode(Deno_readFileSync(inFilename)) + "\n";
        log += "Expected < but got >" + "\n";
        log += diffRes;
        ret.featureCount = 0;
        ret.log = log;
        return ret;
    }
}


export const runStudentMyProgram = async (inFilename: string, myprogramBaseDir: string): Promise<string> => {
    const inFile = Deno_openSync(inFilename);
    const studentProgram: Deno_Process = Deno_run({
        cmd: ["sh", "run_program_bash.sh"],
        cwd: myprogramBaseDir,
        stdout: "piped",
        stdin: inFile.rid
    });
    let studentProgramOut: string = textDecoderUtf8.decode(await studentProgram.output());
    inFile.close();
    return studentProgramOut;
};

export const checkMyprogramAtBaseDir = async ({ myprogramBaseDir, inOutExpFilePairs, outFileDir, scribe }
    : { myprogramBaseDir: paths_util.path; inOutExpFilePairs: inOutExpectedFilesPair[]; outFileDir: paths_util.path; scribe: logging_util.Logger })
    : Promise<studentProgramQuality> => {
    const myprogramBaseDirStr = myprogramBaseDir.join("/");
    scribe.log("Checking program in: " + myprogramBaseDirStr);

    const folderStructResult = checkStudentProjectFolderStructure(myprogramBaseDir);

    const ret: studentProgramQuality = {
        myprogramBaseDir: myprogramBaseDir,
        checkerMessageToStudent: "",
        inOutExpFilesCount: inOutExpFilePairs.length,
        inOutExpNullDiffCount: 0,
        diffResults: [],
        folderStructure: folderStructResult,
        myprogramOutActual: []
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
            const stuProgOut: string = await runStudentMyProgram(inFilePath, myprogramBaseDirStr);
            ret.myprogramOutActual[idx] = stuProgOut
            writeStudentProgramOutputFile(outFilePath, postProcessStudentProgramOutput(stuProgOut));
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