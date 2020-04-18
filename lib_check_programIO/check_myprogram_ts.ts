"use strict";
const Deno_openSync = Deno.openSync;
//const Deno_build_os = Deno.build.os;

import * as paths_util from "./paths_util.ts";
import * as checker from "./myprogram_checker_util.ts";
import * as logging_util from "./logging_util.ts";

const scribe: logging_util.Logger = new logging_util.Logger(true);

const checkMyprogramAtBaseDir = async (myprogramBaseDir: paths_util.path): Promise<string> => {
    const myprogramBaseDirStr = myprogramBaseDir.join("/");
    scribe.log("Checking program in: " + myprogramBaseDirStr);

    const folderStructResult = checker.checkStudentProjectFolderStructure(myprogramBaseDir);
    if (folderStructResult.score !== folderStructResult.maxScore) {
        scribe.log(folderStructResult.log);
        return scribe.messagesStr();
    }

    let correctCount = 0;

    // TODO:  factor out in/outExpected files to be fed in via an array param
    for (let idx: number = 0; idx < 100; ++idx) {
        const inFilename = "in" + (idx === 0 ? "" : idx) + ".txt";
        const outExpectedFilename = "outExpected" + (idx === 0 ? "" : idx) + ".txt";
        try {
            Deno_openSync(inFilename).close();
        } catch (e) {
            if (idx === 0) {
                scribe.log("Error: checker is missing " + inFilename);
            }
            break;
        }
        try {
            Deno_openSync(outExpectedFilename).close();
        } catch (e) {
            if (idx === 0) {
                scribe.log("Error: checker is missing " + outExpectedFilename);
            }
            break;
        }
        scribe.log("\nChecking test case " + idx);

        const outFilename = "out" + (idx === 0 ? "" : idx) + ".txt";
        checker.writeStudentProgramOutputFile(outFilename, checker.postProcessStudentProgramOutput(await checker.runStudentMyProgram(inFilename, myprogramBaseDirStr)));
        const diffResult: checker.studentProgramAttrQuality = await checker.diffStudentOutputVsExpected(inFilename, outFilename, outExpectedFilename);
        if (diffResult.score === diffResult.maxScore) {
            ++correctCount;
        }
        scribe.log(diffResult.log);
    }
    if (correctCount > 0) {
        scribe.log("\nRemember just because your program worked ok for " + correctCount + " test " + (correctCount > 1 ? "cases" : "case") + ", it doesn't mean it's perfect!  Your program must work for *all* input as specified in the assigned program specifications!");
    }
    return scribe.messagesStr();
}

export const main = async (): Promise<string> => {
    const allPaths = paths_util.relativePathsOfFilesInDir(["."], ["myprogram.ts"]);
    if (allPaths.length <= 0) {
        scribe.log("No myprogram.ts found!  Nothing to check.");
        return scribe.messagesStr();
    }

    const firstMyprogramBaseDir: paths_util.path = allPaths[0];
    firstMyprogramBaseDir.splice(firstMyprogramBaseDir.length - 1, 1);
    return checkMyprogramAtBaseDir(firstMyprogramBaseDir);
};


