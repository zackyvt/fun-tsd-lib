"use strict";
const Deno_openSync = Deno.openSync;
const Deno_readFileSync = Deno.readFileSync;
const Deno_createSync = Deno.createSync;
const Deno_removeSync = Deno.removeSync;
declare type Deno_Process = Deno.Process;
const Deno_run = Deno.run;

import * as paths_util from "./paths_util.ts";

const textDecoderUtf8 = new TextDecoder("utf-8");
const textEncoder = new TextEncoder();

export type studentProgramAttrQuality = {
    name: string,
    score: number,
    maxScore: number,
    log: string
};

export const checkStudentProjectFolderStructure = (myprogramRelativeBaseDir: paths_util.path): studentProgramAttrQuality => {
    let ret = {
        name: "student project folder structure",
        score: 0,
        maxScore: 1,
        log: ""
    };
    if (myprogramRelativeBaseDir[0] !== "."){
        myprogramRelativeBaseDir.splice(0, 0, ".");
    }
    if (myprogramRelativeBaseDir.length < 2) {
        let log = "";
        log += "myprogram.ts found in: " + myprogramRelativeBaseDir.join("/") + "\n";
        log += "myprogram.ts is not in proper project folder.\nFix project folder before checking again!";
        ret.score = 0;
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
            ret.score = 0;
            ret.log = "Error! Missing file: " + f;
            return ret;
        }
    }
    ret.score = ret.maxScore;
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


export const diffStudentOutputVsExpected = async (inFilename: string, outFilename: string, outExpectedFilename: string): Promise<studentProgramAttrQuality> => {
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

    let ret = {
        name: "student program output diff",
        score: 0,
        maxScore: 1,
        log: ""
    };
    if (diffRes == "") {
        ret.score = 1;
        ret.log = "Good job!!  No difference from expected output for this example input.";
        return ret;
    } else {
        let log: string = "";
        log += "Unexpected output for this example input:" + "\n";
        log += textDecoderUtf8.decode(Deno_readFileSync(inFilename)) + "\n";
        log += "Expected < but got >" + "\n";
        log += diffRes;
        ret.score = 0;
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
