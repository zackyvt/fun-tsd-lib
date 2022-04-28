import {
    print,
    currentDate,
    pr
} from "./mod.ts";

// ***********************************************************************
// ***********************************************************************
//             Advanced Console Cursor Manipulation - unstable
// ***********************************************************************
// ***********************************************************************
// see: https://docs.microsoft.com/en-us/windows/console/console-virtual-terminal-sequences

export const getCursorPos = function (): { row: number, col: number } {
    Deno.setRaw(Deno.stdin.rid, true);
    // setRaw requires --unstable, which requires changing in deno_std/path/{_util,win32,posix}.ts the 
    // import { ...etc... } from "./_interface.ts";
    // to import type { ...etc... } from "./_interface.ts";

    pr("\u001B[6n"); // emit cursor position in form of ^[[r;cR where r is row and c is col and ^[ is ESC
    // cursor position gets emitted to stdin, which gets echoed to stdout if stdin is not raw
    // if stdin is setRaw'ed, then it gets echoed to stdout when raw is unset --- unless the stdin buffer is consumed by readSync first!

    const data = new Uint8Array(10);
    const nread = Deno.stdin.readSync(data); // blocks here until there's data in stdin (which there is now! the cursor position!)
    Deno.setRaw(Deno.stdin.rid, false);
    //print("\nunset raw");

    if (!nread) {
        Deno.exit();
    }
    const rawStr = new TextDecoder().decode(data.slice(0, nread));
    const str = new TextDecoder().decode(data.slice(2, nread - 1)); // note cursor position begins with ESC keycode, which must be cut or else print will show nothing
    //print("cursor position after printing 'setRaw now' was (row;col): " + str);
    const coord = str.split(";");
    //print(`That's row ${coord[0]} and col ${coord[1]}`);
    //print("char code of ESC is: " + rawStr.charCodeAt(0)); // char code of ESC is: 27
    return {
        row: parseInt(coord[0]),
        col: parseInt(coord[1])
    };
};


// ***********************************************************************
// ***********************************************************************
//             Advanced Real Time Processing of Keyboard Input - unstable
// ***********************************************************************
// ***********************************************************************

// Requires deno run --unstable
// Async functions below are:
// - best used with Bash on Macs and Linux
// - on Windows
//   - best used with Bash in WSL2
//   - if using Git Bash, must run deno as: winpty deno run --unstable
//     - winpty does NOT support unicode, so no fancy extended-ASCII art
// 
// Many in this family of functions depend on a user supplied string processing function.
// An example is:
//
// const exampleProcessFunction: stringProc = function (letter: string) {
//     switch (letter) {
//         case "a":
//             print("aaa");
//             break;
//         case "b":
//             print("bbbbbb");
//             break;
//         case "c":
//             print("ccccccccc");
//             break;
//         default:
//             print(letter.charCodeAt(0));
//             break;
//     }
// };

export type stringProc = (s: string) => boolean;
export const whenKeypressTimedMaybeSync = function (isSync: boolean, process: stringProc, msecondsTotal: number, msecondsPerKey: number, charCountPerKey: number = 1): string | Promise<string> {
    // sync will NOT early terminate upon reaching TimeLimited --- msecondsTotal or msecondsPerKey --- but only after user input after TimeLimited reached
    // async WILL early terminate upon reaching TimeLimited: msecondsTotal or msecondsPerKey
    const sync = isSync;
    const processFn = process;
    const msecTotal = msecondsTotal; // if <= 0, then no limit
    const msecPerKey = msecondsPerKey; // if <= 0, then no limit
    const charCntPerKey = charCountPerKey;
    const myTextDecoder = new TextDecoder();

    if (sync) {
        Deno.setRaw(Deno.stdin.rid, true);
    }

    const startTime = currentDate();
    type loopRecurReturnType = (() => loopRecurReturnType) | string | Promise<string>;
    const loopRecur = (inputAcc: string): loopRecurReturnType => {
        const input = inputAcc;
        const keyStartTime = currentDate();

        let strOrProm: string | Promise<string> = "";
        if (sync) {
            const data = new Uint8Array(charCntPerKey);
            const nread = Deno.stdin.readSync(data);
            if (!nread) {
                Deno.setRaw(Deno.stdin.rid, false);
                return input;
            }
            strOrProm = myTextDecoder.decode(data.slice(0, nread));
        } else {
            strOrProm = readInputTimedAsync(msecPerKey <= 0 ? 1000 : msecPerKey, false, charCntPerKey).then((strOrNull: string | null) => {
                let str = strOrNull ?? "";
                if (str.length > 1 && str.charAt(str.length - 1) == "\n") {
                    str = str.slice(0, str.length - 1);
                }
                if (str.length > 1 && str.charAt(str.length - 1) == "\r") {
                    str = str.slice(0, str.length - 1);
                }
                return str;
            });
        }

        const _processKeyStr = (str: string, inputAccum: string): { result: string, done: boolean } => {//string | null => {
            const endTime = currentDate();
            if (msecTotal > 0 && endTime - startTime > msecTotal
                || msecPerKey > 0 && endTime - keyStartTime > msecPerKey) {
                //console.log("times up!");
                return { result: inputAccum, done: true }//null;
            }

            for (const char of str) {
                switch (char) {
                    case "\u0003": // ETX End of Text
                    case "\u0004": // EOT End of Transmission
                    case "\r":
                    case "\n":
                        // "msecPerKey" + msecPerKey + " actual " + (endTime - keyStartTime) + "msecTotal:" + msecTotal + " actal " + (endTime - startTime) + "EOL "
                        return { result: inputAccum, done: true }//null; //input;//base case

                    case "\u0008": // backspace
                    case "\u007F": // delete
                        inputAccum = inputAccum.slice(0, inputAccum.length - 1);
                        break;

                    default:
                        let ret = processFn(char);
                        inputAccum += char;
                        if (ret){
                            return { result: inputAccum, done: true };
                        }
                        break;
                }
            }

            return { result: inputAccum, done: false }; //not base case
        };

        if (sync) {
            const doneOrStr = _processKeyStr(strOrProm as string, input);
            if (doneOrStr.done === true) {
                Deno.setRaw(Deno.stdin.rid, false);
                return doneOrStr.result;
            } else {
                return () => loopRecur(doneOrStr.result); // infty loop, no base case
            }
        } else {
            const ret: Promise<string> = (strOrProm as Promise<string>).then((s) => _processKeyStr(s, input)).then((doneOrStr: { result: string, done: boolean }) => {
                if (doneOrStr.done === true) {
                    return doneOrStr.result;
                } else {
                    return loopRecur(doneOrStr.result) as Promise<string>;
                }
            });
            return ret;
        }
    };

    if (sync) {
        let f = loopRecur(""); // trampoline
        while (typeof f === "function") {
            f = f();
        }
        return f;
    } else {
        return loopRecur("") as Promise<string>;
    }
};



export const readInputTimedAsync = async function (msec: number, echo: boolean = true, count: number = -1) {
    // timed input without helper script, requires bash
    // returns null if time limit reached without successful user input (i.e. user supplied \n)
    // if count > 0, successful user input occurs only if user supplies count number of characters
    const sec = msec > 0 && msec <= 1000 ? 1 : Math.floor(msec / 1000); // mac bash only supports integer sec
    // TODO: instead of using bash, maybe can use Deno can run Deno instead?
    const p1 = Deno.run({
        // read -t 1 x; if [[ $? -eq 0 ]]; then echo b $x; else echo $? 1>&2; fi;
        cmd: ["bash", "-c", `read ${echo ? "" : "-s"} ${count <= 0 ? "" : `-n ${count}`} ${msec <= 0 ? "" : `-t ${sec}`} a; if [[ \$? -eq 0 ]]; then echo \$a; else echo \$? 1>&2; fi;`],
        stdout: 'piped',
        stderr: 'piped',
        //stdin: 'piped' 
    });
    let timedInput1 = await p1.output();
    let errorCode = new TextDecoder().decode(await p1.stderrOutput());
    Deno.close(p1.rid);
    return errorCode == "" ? new TextDecoder().decode(timedInput1) : null;
};


export const whenKeypress = function (process: stringProc): string {
    return whenKeypressTimedMaybeSync(true, process, -1, -1, 1) as string;
};

export const whenKeypressTimed = function (process: stringProc, msecondsTotal: number, msecondsPerKey: number): string {
    // for msecondsTotal and msecondsPerKey, if <= 0, then no limit
    // sync will NOT early terminate upon reaching TimeLimited --- msecondsTotal or msecondsPerKey --- but only after user input after TimeLimited reached
    return whenKeypressTimedMaybeSync(true, process, msecondsTotal, msecondsPerKey, 1) as string;
};

export const whenKeypressTimedAsync = async function (process: stringProc, msecondsTotal: number, msecondsPerKey: number): Promise<string> {
    // for msecondsTotal and msecondsPerKey, if <= 0, then no limit
    // async WILL early terminate upon reaching TimeLimited: msecondsTotal or msecondsPerKey
    // requires bash, as this will use readInputTimedAsync
    return whenKeypressTimedMaybeSync(false, process, msecondsTotal, msecondsPerKey, 1);
};

export const getInputTimed = function (msecondsTotal: number): string {
    // for msecondsTotal, if <= 0, then no limit
    // sync will NOT early terminate upon reaching TimeLimited --- msecondsTotal --- but only after user input after TimeLimited reached
    return whenKeypressTimedMaybeSync(true, (s: string) => { }, msecondsTotal, -1, 1) as string;
};

export const getInputTimedAsync = async function (msecondsTotal: number): Promise<string> {
    // for msecondsTotal, if <= 0, then no limit
    // async WILL early terminate upon reaching TimeLimited: msecondsTotal
    // requires bash, as this will use readInputTimedAsync
    return whenKeypressTimedMaybeSync(false, (s: string) => { }, msecondsTotal, -1, 1) as string;
};
