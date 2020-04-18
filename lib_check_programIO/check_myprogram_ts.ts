"use strict";
const Deno_openSync = Deno.openSync;
//const Deno_build_os = Deno.build.os;

import * as paths_util from "./paths_util.ts";
import * as checker from "./myprogram_checker_util.ts";
import * as logging_util from "./logging_util.ts";

export const main = async (): Promise<string> => {
    const scribe: logging_util.Logger = new logging_util.Logger(true);
    const allPaths = paths_util.relativePathsOfFilesInDir(["."], ["myprogram.ts"]);
    if (allPaths.length <= 0) {
        scribe.log("No myprogram.ts found!  Nothing to check.");
        return scribe.messagesStr();
    }

    const firstMyprogramBaseDir: paths_util.path = allPaths[0];
    firstMyprogramBaseDir.splice(firstMyprogramBaseDir.length - 1, 1);
    return (await checker.checkMyprogramAtBaseDir({
        myprogramBaseDir: firstMyprogramBaseDir,
        inOutExpFilePairs: checker.inOutExpectedFilesPaths(["."]),
        outFileDir: ["."],
        scribe
    })).checkerMessageToStudent;
};


