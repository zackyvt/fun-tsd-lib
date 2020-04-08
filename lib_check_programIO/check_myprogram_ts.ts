// requires deno
const Deno_createSync = Deno.createSync;
const Deno_removeSync = Deno.removeSync;
const Deno_readdirSync = Deno.readdirSync;
const Deno_exit = Deno.exit;
const Deno_openSync = Deno.openSync;
declare type Deno_Process = Deno.Process;
const Deno_run = Deno.run;
const Deno_readFileSync = Deno.readFileSync;
const Deno_build_os = Deno.build.os;


const descendantFilesPaths = (
    baseDirPath: string[],
    fileNamesToFind?: string[]
): string[][] => {
    const filesDirsPathsHere: string[][] = [];
    const filesDirsHere = Deno_readdirSync(baseDirPath.join("/"));
    for (let i: number = 0; i < filesDirsHere.length; ++i) {
        const fileOrDir = filesDirsHere[i];
        if (fileOrDir.isDirectory()) {
            const subDirPath = baseDirPath.concat(
                fileOrDir.name ? fileOrDir.name : ""
            );
            const enclosedFilesDirsPaths: string[][] = descendantFilesPaths(
                subDirPath,
                fileNamesToFind
            );
            filesDirsPathsHere.push(...enclosedFilesDirsPaths);
        } else if (fileOrDir.isFile() &&
            fileOrDir.name &&
            (!fileNamesToFind ||
                fileNamesToFind.find((val) => {
                    return val === fileOrDir.name;
                }))) {
            const filePath = baseDirPath.concat(
                fileOrDir.name ? fileOrDir.name : ""
            );
            filesDirsPathsHere.push(filePath);
        }
        // not dealing with symlinks
    }
    return filesDirsPathsHere;
};

const descendantFilesPathsStrs = (
    descendantFilesPathsArr: string[][]
): string[] => {
    return descendantFilesPathsArr.reduce((prev, val) => {
        return prev.concat(val.join("/"));
    }, []);
};


const diffStudentOutputVsExpected = async (firstMyprogramBaseDirStr: string, inFilename: string, outFilename: string, outExpectedFilename: string) => {

    const txtDec = new TextDecoder("utf-8");
    const inFile = Deno_openSync(inFilename);

    const studentProgram: Deno_Process = Deno_run(
        {
            cmd: ["/bin/sh", "run_program_bash.sh"],
            cwd: firstMyprogramBaseDirStr,
            stdout: "piped",
            stdin: inFile.rid
        }
    );
    let studentProgramOut: string = txtDec.decode(await studentProgram.output());
    inFile.close();

    // strip out first line if it should be "Using deno"...
    if (0 === studentProgramOut.indexOf("Using deno")) {
        const reMatch = /\r?\n/.exec(studentProgramOut);
        const firstNewlineIdx = reMatch?.index == null ? 0 : reMatch?.index;
        studentProgramOut = studentProgramOut.substring(firstNewlineIdx + 1);
    }

    Deno_createSync(outFilename).close();
    Deno_removeSync(outFilename);
    const stuProOutFile = Deno_createSync(outFilename);
    // const stuProOutFile = Deno_openSync(outFilename, { read: true, write: true });
    stuProOutFile.writeSync(new TextEncoder().encode(studentProgramOut));
    stuProOutFile.close();

    let diffProcessArg = [
        "diff",
        "-Z",
        "-b",
        "-d",
        // "--color=always", // no color on old diff
        outExpectedFilename,
        outFilename
    ];
    if (Deno_build_os == "win") {
        diffProcessArg = ["FC", outExpectedFilename, outFilename];
    }

    const diffPro: Deno_Process = Deno_run(
        {
            cmd: diffProcessArg,
            stdout: "piped"
        }
    );
    const diffRes: string = txtDec.decode(await diffPro.output());
    if (diffRes == "") {
        console.log(
            "Good job!!  No difference from expected output for this example input."
        );
        return true;
    } else {
        console.log("Unexpected output for this example input:");
        const outExpected: string = txtDec.decode(Deno_readFileSync(inFilename));
        console.log(outExpected);
        console.log("Expected < but got >");
        console.log(diffRes);
        return false;
    }
}


export const main = async () => {
    const allPaths = descendantFilesPaths(["."], ["myprogram.ts"]);
    if (allPaths.length <= 0) {
        console.log("No myprogram.ts found!  Nothing to check.");
        Deno_exit();
    }

    const firstMyprogramBaseDir: string[] = allPaths[0];
    if (firstMyprogramBaseDir.length <= 2) {
        console.log("myprogram.ts found in: " + firstMyprogramBaseDir.join("/"));
        console.log(
            "myprogram.ts is not in proper project folder.\nFix project folder before checking again!"
        );
        Deno_exit();
    }

    firstMyprogramBaseDir.splice(firstMyprogramBaseDir.length - 1, 1);
    const firstMyprogramBaseDirStr = firstMyprogramBaseDir.join("/");
    console.log("Checking program in: " + firstMyprogramBaseDirStr);

    const studentProjectRequiredFiles = [
        "cs10-txt-lib-0.6.ts",
        "myprogram.ts",
        "run_program_bash.sh",
        "run_program_macs.command"
    ];
    for (let f of studentProjectRequiredFiles) {
        try {
            const requiredFile = Deno_openSync(
                firstMyprogramBaseDirStr + "/" + f,
                { read: true }
            );
            requiredFile.close();
        } catch (e) {
            console.log("Error! Missing file: " + f);
            Deno_exit();
        }
    }

    let correctCount = 0;
    for (let idx: number = 0; idx < 100; ++idx) {
        try {
            const inFilename = "in"+(idx === 0? "" : idx) + ".txt";
            const outFilename = "out"+(idx === 0? "" : idx) + ".txt";
            const outExpectedFilename = "outExpected"+(idx === 0? "" : idx) + ".txt";
            Deno_openSync(inFilename).close();
            Deno_openSync(outExpectedFilename).close();
            console.log("\nChecking test case " + idx);
            const perfect = await diffStudentOutputVsExpected(firstMyprogramBaseDirStr, inFilename, outFilename, outExpectedFilename);
            if (perfect){
                ++correctCount;
            }
        } catch (e){
            break;
        }
    }
    if (correctCount > 0){
        console.log("\nRemember just because your program worked ok for " + correctCount + " test " + (correctCount > 1? "cases" : "case") + ", it doesn't mean it's perfect!  Your program must work for *all* input as specified in the assigned program specifications!");
    }
};