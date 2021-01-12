"use strict";

var addLoopGuard = function (code: any) {
    var codeMat = code.match(/((while|for)\s*\([^)]*\))/);
    var codePt = code.search(/((while|for)\s*\([^)]*\))/);
    if (codePt < 0) {
        return { code: code, rest: code.length };
    }

    var openingBracePtDelta = code.substring(codePt + codeMat[0].length).match(/\W*/);
    var openingBracePtDelta2 = code.substring(codePt + codeMat[0].length).match(/[^a-zA-Z0-9_{]*/);
    if (openingBracePtDelta2 && openingBracePtDelta
        && openingBracePtDelta2[0].length < openingBracePtDelta[0].length) {
        openingBracePtDelta = code.substring(codePt + codeMat[0].length).indexOf("{");
    } else {
        openingBracePtDelta = 0;
    }

    var codeNewLinePt = codePt + codeMat[0].length + openingBracePtDelta + 1;

    //	print(code.substring(0,codeNewLinePt));

    var varIdx = 0;
    var newVar = "_Some_Random_Var_" + varIdx + "_" + Math.floor(Math.random() * 1000);
    var preLoop = "var " + newVar + " = 0;\n";
    var inLoop = "\n" + newVar + "++;\n";
    inLoop += "if (" + newVar + "> 1000) break;\n";

    code = code.substring(0, codeNewLinePt) + inLoop + code.substring(codeNewLinePt);
    code = code.replace(/((while|for)\s*\([^)]*\))/, preLoop + "$1");

    var inLoopPt = code.indexOf(inLoop);
    var restOfCodePt = inLoopPt + inLoop.length;

    return { code: code, rest: restOfCodePt };
}

export var scrubCode = function (code: string): string {
    //code = code.replace(/quit\s*\([^)]*\)/g, "\n/*quit()*/\n"); // get rid of quit()s
    code = code.replace(/Fun.javaSleep\s*\(\s*\d+\s*[^)]*\)/g, "\n/*Fun javaSleep(...)*/\n"); // get rid of javaSleep(...)s
    code = code.replace(/Fun.threadSleep\s*\(\s*\d+\s*[^)]*\)/g, "\n/*Fun threadSleep(...)*/\n"); // get rid of javaSleep(...)s
    code = code.replace(/javaSleep\s*\(\s*\d+\s*[^)]*\)/g, "\n/*javaSleep(...)*/\n"); // get rid of javaSleep(...)s
    code = code.replace(/threadSleep\s*\(\s*\d+\s*[^)]*\)/g, "\n/*threadSleep(...)*/\n"); // get rid of javaSleep(...)s
    //code = code.replace(/java\.lang\.Thread\.sleep\s*\(\s*\d+\s*[^)]*\)/g, "\n/*java.lang.Thread.sleep(...)*/\n"); // get rid of java.lang.Thread.sleep(...)s

    var tempCode = code;
    var finalCode = "";
    var restPt = 0;
    while (tempCode.length > 0) {
        var guarded = addLoopGuard(tempCode);
        restPt = guarded["rest"]
        finalCode += guarded["code"].substring(0, restPt);
        tempCode = guarded["code"].substring(restPt);
    }
    code = finalCode;

    //	g = addWhileGuard(code);
    //	code = addWhileGuard(code)["code"]

    //	print(code);//.substring(0, g["rest"]));
    return code;
}

var arrayToString = function (anArr: any[]) {
    var theStr = "";
    for (var i = 0; i < anArr.length; i++) {
        theStr += anArr[i] + "\n";
    }
    return theStr;
};

var arrayOfStringIndexOf = function (anArr: string[], aStr: string) {
    for (var i = 0; i < anArr.length; i++) {
        if (anArr[i].indexOf(aStr) > -1) {
            return i;
        }
    }
    return -1;
};

var arrayOfStringReIndexOf = function (anArr: string[], re: string) {
    for (var i = 0; i < anArr.length; i++) {
        if (anArr[i].match(re) !== null) {
            return i;
        }
    }
    return -1;
};

var arrayOfStringReStrBetween = function (anArr: string[], leftReBoundary: string, rightReBoundary: string) { // untested...
    if (rightReBoundary == null) {
        rightReBoundary = leftReBoundary;
    }

    var leftBoundFound = false;
    for (var i = 0; i < anArr.length; i++) {
        if (anArr[i].match(leftReBoundary) !== null) {
            leftBoundFound = true;
            anArr = anArr.slice(i);
            break;
        }
    }

    if (leftBoundFound == true) {
        for (var i = 0; i < anArr.length; i++) {
            if (anArr[i].match(rightReBoundary) !== null) {
                anArr = anArr.slice(0, i + 1);
                break;
            }
        }
    }

    if (leftBoundFound == true) {
        return arrayToString(anArr);
    } else {
        return null;
    }
}

var normalizeStr2 = function (str: string) {
    // make lower case
    // collapse multiple of any whitespace into a single space
    str = str.toLowerCase();
    str = str.replace(/\s+/g, " "); // collapse whitespaces

    //str = str.replace(/\W/g, "");
    str = str.replace(/[^ a-zA-Z0-9]/g, ""); // delete non-alpha-numeric
    //str = str.replace(/\s+/g, ""); // delete whitespaces
    //str = str.replace(/"/g, "'");     // double quotes turned to single quotes
    return str;
}

var normalizeStrNoSpaces = function (str: string) {
    // make lower case
    // collapse multiple of any whitespace into a single space
    // double quotes turned to single quotes
    str = str.toLowerCase();
    str = str.replace(/\s+/g, " "); // collapse whitespaces
    //str = str.replace(/\W/g, "");
    str = str.replace(/[^ a-zA-Z0-9]/g, ""); // delete non-alpha-numeric
    str = str.replace(/\s+/g, ""); // delete whitespaces
    //str = str.replace(/"/g, "'");
    return str;
}

var charWisePercentEqual = function (src: string, tgt: string) {
    var count = 0;
    var i = 0;
    var j = 0;
    for (; i < src.length && j < tgt.length; i++, j++) {
        if (src[i] == tgt[j]) {
            count++
        } else if (src[i + 1] == tgt[j]) {
            i++;
            count++;
        } else if (src[i] == tgt[j + 1]) {
            j++;
            count++;
        }
    }
    return (count / tgt.length);
}



var stringComp = function (src: string, tgt: string) {
    // 0 if src == tgt
    // 1 if src != tgt

    src = normalizeStr2(src);
    tgt = normalizeStr2(tgt);

    var charPctComp = getEditDistance(src, tgt) / Math.max(src.length, tgt.length);
    return charPctComp;
}

export var getEditDistanceNormalized = function (src: string, tgt: string) {
    // 0 if src == tgt
    // 1 if src != tgt

    return getEditDistance(src, tgt) / Math.max(src.length, tgt.length);
}

var stringCompOldHack = function (src: string, tgt: string) {
    // 0 if src == tgt
    // 1 if src != tgt
    //java.lang.System.out.println(src); //debug
    //java.lang.System.out.println(tgt); //debug

    src = normalizeStr2(src);
    tgt = normalizeStr2(tgt);

    var charPctComp = 1 - charWisePercentEqual(src, tgt);

    /*if (tgt.indexOf(src) >= 0){
        return 0;
        } else {
        java.lang.System.out.println("src:\n" + src); // debug
        java.lang.System.out.println("tgt:\n" + tgt); // debug
        return 1;
    }*/

    if (charPctComp < 0.1) {
        return charPctComp;
    } else {
        console.log("charPctComp:\n" + charPctComp); // debug
        console.log("src:\n" + src); // debug
        console.log("tgt:\n" + tgt); // debug
        return charPctComp;
    }

    /*
    var srcArr = src.split(/\s/);
    var score = 0;
    
    for (var i = 0; i < src.length; i++){
        if (tgt.indexOf(src[i]) >= 0){
            score++;
        }
    }
    
    var pctScore = score/src.length;
    //java.lang.System.out.println(pctScore); //debug
    
    return 1-pctScore;
    */
};


var getEditDistance = function (a: string, b: string) {
    // Levenshtein Edit Distance
    /*
    Copyright (c) 2011 Andrei Mackenzie
  
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    */

    if (a.length == 0) return b.length;
    if (b.length == 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1)); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
};
