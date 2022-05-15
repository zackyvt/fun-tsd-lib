"use strict";
/*
 * Copyright 2012, 2016, 2017, 2019, 2020 Carson Cheng
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
/*
 * GQGuardrail v0.8.0 is a wrapper around gameQuery rev. 0.7.1.
 * Makes things more procedural, with a bit of functional.
 * Adds in helpful error messages for students.
 * load this after gameQuery.
 */

export type spriteDomObject = {
    width: (n: number) => spriteDomObject;
    height: (n: number) => spriteDomObject;
    setAnimation: (o?: object, f?: Function) => any;
    css: (attr: string, val: string | number) => spriteDomObject;
    playground: (o: object) => any;
    html: (htmlText: string) => spriteDomObject;
    text: (text: string) => spriteDomObject;
};
declare var $: any;
declare var Cookies: {
    set: (arg0: string, arg1: object) => void;
    getJSON: (arg0: string) => object;
    remove: (arg0: string) => void;
};

// students are not supposed to use GQG_ variables
let GQG_DEBUG: boolean = true;
export const setGqDebugFlag = (debug: boolean): void => {
    if (debug) {
        GQG_DEBUG = true;
    } else {
        console.log(GQG_WARNING_IN_MYPROGRAM_MSG + "debug mode disabled and your code is now running in unsafe mode.");
        GQG_DEBUG = false;
    }
};

const GQG_SPRITE_GROUP_NAME_FORMAT_REGEX = /[a-zA-Z0-9_]+[a-zA-Z0-9_-]*/;
export const spriteGroupNameFormatIsValid = (
    spriteOrGroupName: string | number
): boolean => {
    if (typeof spriteOrGroupName !== "string" &&
        typeof spriteOrGroupName !== "number") {
        return false;
    }
    spriteOrGroupName = spriteOrGroupName.toString();
    let nameMatches = spriteOrGroupName.match(GQG_SPRITE_GROUP_NAME_FORMAT_REGEX);
    nameMatches = (nameMatches ? nameMatches : []);
    if (nameMatches.length === 0) {
        return false;
    }

    return (spriteOrGroupName === nameMatches[0]);
};

const GQG_SIGNALS: Record<string, boolean> = {};
let GQG_UNIQUE_ID_COUNTER = 0;

let GQG_PLAYGROUND_WIDTH = 640;
let GQG_PLAYGROUND_HEIGHT = 480;
export let PLAYGROUND_WIDTH = GQG_PLAYGROUND_WIDTH; // students are not supposed to use GQG_ variables
export let PLAYGROUND_HEIGHT = GQG_PLAYGROUND_HEIGHT;

export const ANIMATION_HORIZONTAL: number = $.gQ.ANIMATION_HORIZONTAL;
export const ANIMATION_VERTICAL: number = $.gQ.ANIMATION_VERTICAL;
export const ANIMATION_ONCE: number = $.gQ.ANIMATION_ONCE;
export const ANIMATION_PINGPONG: number = $.gQ.ANIMATION_PINGPONG;
export const ANIMATION_CALLBACK: number = $.gQ.ANIMATION_CALLBACK;
export const ANIMATION_MULTI: number = $.gQ.ANIMATION_MULTI;


// Max/Min Safe Playground Integers found by experimenting with GQ 0.7.1 in Firefox 41.0.2 on Mac OS X 10.10.5
const GQG_MIN_SAFE_PLAYGROUND_INTEGER = -(Math.pow(2, 24) - 1); // cf. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER
const GQG_MAX_SAFE_PLAYGROUND_INTEGER = (Math.pow(2, 24) - 1); // cf. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER


const GQG_getUniqueId = (): string => {
    return Date.now() + "_" + GQG_UNIQUE_ID_COUNTER++;
};

export const setGqPlaygroundDimensions = (
    width: number,
    height: number
): void => {
    // this must be executed outside of setup and draw functions
    GQG_PLAYGROUND_HEIGHT = height;
    PLAYGROUND_HEIGHT = height;
    GQG_PLAYGROUND_WIDTH = width;
    PLAYGROUND_WIDTH = width;
    sprite("playground").width(width).height(height);
};

export const currentDate = (): number => {
    return Date.now();
};

export const consolePrint = (...txt: any): void => {
    // might work only in Chrome or if some development add-ons are installed
    console.log(...txt);
};


const GQG_IN_MYPROGRAM_MSG = 'in "myprogram.ts"- ';
const GQG_ERROR_IN_MYPROGRAM_MSG = "Error " + GQG_IN_MYPROGRAM_MSG;
const GQG_WARNING_IN_MYPROGRAM_MSG = 'Warning ' + GQG_IN_MYPROGRAM_MSG;

const printErrorToConsoleOnce = (() => {
    var throwConsoleError_printed: Record<string, boolean> = {};
    return (msg: string) => {
        // Firefox wouldn't print uncaught exceptions with file name/line number
        // but adding "new Error()" to the throw below fixed it...
        if (!throwConsoleError_printed[msg]) {
            console.error("Error: " + msg);
            throwConsoleError_printed[msg] = true;
        }
    };
})();
const throwConsoleErrorInMyprogram = (msg: string): never => {
    // Firefox wouldn't print uncaught exceptions with file name/line number
    // but adding "new Error()" to the throw below fixed it...
    throw new Error(GQG_IN_MYPROGRAM_MSG + msg);
};

const throwIfSpriteNameInvalid = (spriteName: string): void => {
    if (typeof spriteName !== "string") {
        throwConsoleErrorInMyprogram("Sprite name must be a String, not: " + spriteName);
    } else if (!spriteExists(spriteName)) {
        throwConsoleErrorInMyprogram("Sprite doesn't exist: " + spriteName);
    }
};
Number.isFinite = Number.isFinite || function (value: any): boolean {
    // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
    return typeof value === 'number' && isFinite(value);
};
const throwIfNotFiniteNumber = (msg: string, val: any): void => { // e.g. throw if NaN, Infinity, null
    if (!Number.isFinite(val)) {
        msg = msg || "Expected a number.";
        msg += " You used";
        if (typeof val === "string") {
            msg += " the String: \"" + val + "\"";
        } else {
            msg += ": " + val;
        }
        throwConsoleErrorInMyprogram(msg);
    }
};

export const throwOnImgLoadError = (imgUrl: string): void => {
    // what this function throws must not be caught by caller tho...
    if (imgUrl.substring(imgUrl.length - ".gif".length).toLowerCase() === ".gif") {
        throwConsoleErrorInMyprogram("image file format not supported: GIF");
    }
    let throwableErr = new Error("image file not found: " + imgUrl);
    $("<img/>").on("error", function () {
        if (!!throwableErr && throwableErr.stack &&
            throwableErr.stack.toString().indexOf("myprogram.js") >= 0) {
            throwableErr.message = GQG_ERROR_IN_MYPROGRAM_MSG + throwableErr.message;
        }
        throw throwableErr;
    }).attr("src", imgUrl);
};



type NewGQAnimationFn = {
    (
        this: void,
        urlOrMap: string,
        numberOfFrame: number,
        delta: number,
        rate: number,
        type: number
    ): SpriteAnimation;
    (this: void, urlOrMap: string): SpriteAnimation;
    (this: void, urlOrMap: object): SpriteAnimation;
};
export const newGQAnimation: NewGQAnimationFn = (() => {
    let memoAnims: Map<string | object, SpriteAnimation> = new Map<object, SpriteAnimation>();
    return function (
        this: void,
        urlOrMap: string | object,
        numberOfFrame?: number,
        delta?: number,
        rate?: number,
        type?: number
    ): SpriteAnimation {
        if (GQG_DEBUG) {
            if (arguments.length === 5) {
                if (typeof (urlOrMap) !== "string") {
                    throwConsoleErrorInMyprogram("First argument for newGQAnimation must be a String. Instead found: " + urlOrMap);
                }
                if (typeof urlOrMap === "string") throwOnImgLoadError(urlOrMap);
                throwIfNotFiniteNumber("Number of frame argument for newGQAnimation must be numeric. ", numberOfFrame);
                throwIfNotFiniteNumber("Delta argument for newGQAnimation must be numeric. ", delta);
                throwIfNotFiniteNumber("Rate argument for newGQAnimation must be numeric. ", rate);
                if (type != null && (type & ANIMATION_VERTICAL) && (type & ANIMATION_HORIZONTAL)) {
                    throwConsoleErrorInMyprogram("Type argument for newGQAnimation cannot be both ANIMATION_VERTICAL and ANIMATION_HORIZONTAL - use one or the other but not both!");
                } else if (type != null && !(type & ANIMATION_VERTICAL) && !(type & ANIMATION_HORIZONTAL)) {
                    throwConsoleErrorInMyprogram("Type argument for newGQAnimation is missing both ANIMATION_VERTICAL and ANIMATION_HORIZONTAL - must use one or the other!");
                }
            } else if (arguments.length === 1) {
                if (typeof (urlOrMap) === "string") {
                    throwOnImgLoadError(urlOrMap);
                } // else hope it's a proper options map to pass on to GameQuery directly
            } else {
                throwConsoleErrorInMyprogram("Wrong number of arguments used for newGQAnimation. Check API documentation for details of parameters.");
            }
        }


        if (arguments.length === 5) {
            let key = [urlOrMap, numberOfFrame, delta, rate, type];
            let multiframeAnim: SpriteAnimation | undefined = memoAnims.get(key);
            if (multiframeAnim != null) {
                return multiframeAnim;
            } else {
                let multiframeAnim: SpriteAnimation = new $.gQ.Animation({
                    imageURL: urlOrMap,
                    numberOfFrame: numberOfFrame,
                    delta: delta,
                    rate: rate,
                    type: type
                });
                memoAnims.set(key, multiframeAnim);
                return multiframeAnim;
            }
        } else if (arguments.length === 1) {
            let singleframeAnim: SpriteAnimation | undefined = memoAnims.get(urlOrMap);
            if (singleframeAnim != null) {
                return singleframeAnim;
            } else {
                let singleframeAnim: SpriteAnimation;
                if (typeof (urlOrMap) === "string") {
                    singleframeAnim = new $.gQ.Animation({ imageURL: urlOrMap });
                } else {
                    singleframeAnim = new $.gQ.Animation(urlOrMap);
                }
                memoAnims.set(urlOrMap, singleframeAnim);
                return singleframeAnim;
            }
        } else {
            throwConsoleErrorInMyprogram("Wrong number of arguments used for newGQAnimation. Check API documentation for details of parameters.");
            return new $.gQ.Animation({ imageURL: "" });
        }
    };
})();

type CreateGroupInPlaygroundFn = {
    (
        this: void,
        groupName: string,
        theWidth: number,
        theHeight: number,
        thePosx: number,
        thePosy: number
    ): void;
    (this: void, groupName: string, theWidth: number, theHeight: number): void;
    (this: void, groupName: string): void;
    (this: void, groupName: string, optMap: object): void;
};
export const createGroupInPlayground: CreateGroupInPlaygroundFn = function (
    this: void,
    groupName: string,
    theWidth?: number | object,
    theHeight?: number,
    thePosx?: number,
    thePosy?: number
): void {
    if (GQG_DEBUG) {
        if (typeof (groupName) !== "string") {
            throwConsoleErrorInMyprogram("First argument for createGroupInPlayground must be a String. Instead found: " + groupName);
        }
        if (!spriteGroupNameFormatIsValid(groupName)) {
            throwConsoleErrorInMyprogram("Group name given to createGroupInPlayground is in wrong format: " + groupName);
        }
        if (spriteExists(groupName)) {
            throwConsoleErrorInMyprogram("createGroupInPlayground cannot create duplicate group with name: " + groupName);
        }

        if (arguments.length === 3) {
            throwIfNotFiniteNumber("Width argument for createGroupInPlayground must be numeric. ", theWidth);
            throwIfNotFiniteNumber("Height argument for createGroupInPlayground must be numeric. ", theHeight);
        } else if (arguments.length === 5) {
            throwIfNotFiniteNumber("Width argument for createGroupInPlayground must be numeric. ", theWidth);
            throwIfNotFiniteNumber("Height argument for createGroupInPlayground must be numeric. ", theHeight);
            throwIfNotFiniteNumber("X location argument for createGroupInPlayground must be numeric. ", thePosx);
            throwIfNotFiniteNumber("Y location argument for createGroupInPlayground must be numeric. ", thePosy);
        } else if (arguments.length === 2) { // treats arguments[1] as a standard options map
            if (typeof arguments[1] !== "object") {
                throwConsoleErrorInMyprogram("Second argument for createGroupInPlayground expected to be a dictionary. Instead found: " + arguments[1]);
            } // else hope it's a proper standard options map
        } else if (arguments.length !== 1) {
            throwConsoleErrorInMyprogram("Wrong number of arguments used for createGroupInPlayground. Check API documentation for details of parameters.");
        }
    }

    if (arguments.length === 1) {
        $.playground().addGroup(
            groupName,
            { width: $.playground().width(), height: $.playground().height() }
        );
    } else if (arguments.length === 3) {
        if (typeof theWidth !== "number") {
            throwConsoleErrorInMyprogram("theWidth must be a number but instead got: " + theWidth);
        }
        $.playground().addGroup(groupName, { width: theWidth, height: theHeight });
    } else if (arguments.length === 5) {
        if (typeof theWidth !== "number") {
            throwConsoleErrorInMyprogram("theWidth must be a number but instead got: " + theWidth);
        }
        $.playground().addGroup(
            groupName,
            { width: theWidth, height: theHeight, posx: thePosx, posy: thePosy }
        );
    } else if (arguments.length === 2) { // treats arguments[1] as a standard options map
        if (typeof theWidth !== "object") {
            throwConsoleErrorInMyprogram("Second argument must be a number but instead got: " + theWidth);
        }
        $.playground().addGroup(groupName, arguments[1]);
    }
};

export type SpriteAnimation = { imageURL: string };
type CreateSpriteInGroupFn = {
    (
        this: void,
        groupName: string,
        spriteName: string,
        theAnimation: SpriteAnimation,
        theWidth: number,
        theHeight: number,
        thePosx: number,
        thePosy: number
    ): void;
    (
        this: void,
        groupName: string,
        spriteName: string,
        theAnimation: SpriteAnimation,
        theWidth: number,
        theHeight: number
    ): void;
    (
        this: void,
        groupName: string,
        spriteName: string,
        optionsMap: object
    ): void;
};
export const createSpriteInGroup: CreateSpriteInGroupFn = function (
    this: void,
    groupName: string,
    spriteName: string,
    theAnimation: SpriteAnimation | object,
    theWidth?: number,
    theHeight?: number,
    thePosx?: number,
    thePosy?: number
): void {
    if (GQG_DEBUG) {
        if (typeof (groupName) !== "string") {
            throwConsoleErrorInMyprogram("First argument for createSpriteInGroup must be a String. Instead found: " + groupName);
        }
        if (!spriteExists(groupName)) {
            throwConsoleErrorInMyprogram("createSpriteInGroup cannot find group (doesn't exist?): " + groupName);
        }

        if (typeof (spriteName) !== "string") {
            throwConsoleErrorInMyprogram("Second argument for createSpriteInGroup must be a String. Instead found: " + spriteName);
        }
        if (!spriteGroupNameFormatIsValid(spriteName)) {
            throwConsoleErrorInMyprogram("Sprite name given to createSpriteInGroup is in wrong format: " + spriteName);
        }
        if (spriteExists(spriteName)) {
            throwConsoleErrorInMyprogram("createSpriteInGroup cannot create duplicate sprite with name: " + spriteName);
        }

        if (arguments.length === 5 || arguments.length === 7) {
            if (typeof (theAnimation) !== "object" || (theAnimation instanceof Object
                && (!("imageURL" in theAnimation) || typeof (theAnimation["imageURL"]) !== "string"))) {
                throwConsoleErrorInMyprogram("createSpriteInGroup cannot use this as an animation: " + theAnimation
                    + "\nAnimation must be of type SpriteAnimation but you provided a: " + typeof (theAnimation));
            }
            throwIfNotFiniteNumber("Width argument for createSpriteInGroup must be numeric. ", theWidth);
            throwIfNotFiniteNumber("Height argument for createSpriteInGroup must be numeric. ", theHeight);


            if (arguments.length === 7) {
                throwIfNotFiniteNumber("X location argument for createSpriteInGroup must be numeric. ", thePosx);
                throwIfNotFiniteNumber("Y location argument for createSpriteInGroup must be numeric. ", thePosy);
            }
        } else if (arguments.length === 3) {
            if (typeof arguments[2] !== "object") {
                throwConsoleErrorInMyprogram("Third argument for createSpriteInGroup expected to be a dictionary. Instead found: " + arguments[2]);
            } else if (theAnimation instanceof Object && (!("imageURL" in theAnimation) || typeof (theAnimation["imageURL"]) !== "string")) {
                throwConsoleErrorInMyprogram("Third argument for createSpriteInGroup expected to be a dictionary. Instead found this animation: " + theAnimation + ". Maybe wrong number of arguments provided? Check API documentation for details of parameters.");
            } // else hope it's a proper standard options map
        } else {
            throwConsoleErrorInMyprogram("Wrong number of arguments used for createSpriteInGroup. Check API documentation for details of parameters.");
        }
    }

    if (arguments.length === 5) {
        $("#" + groupName).addSprite(
            spriteName,
            { animation: theAnimation, width: theWidth, height: theHeight }
        );
    } else if (arguments.length === 7) {
        $("#" + groupName).addSprite(
            spriteName,
            {
                animation: theAnimation,
                width: theWidth,
                height: theHeight,
                posx: thePosx,
                posy: thePosy
            }
        );
    } else if (arguments.length === 3) { // treats arguments[2] as a standard options map
        $("#" + groupName).addSprite(spriteName, arguments[2]);
    }
};

type CreateTextSpriteInGroupFn = {
    (
        this: void,
        groupName: string,
        spriteName: string,
        theWidth: number,
        theHeight: number,
        thePosx: number,
        thePosy: number
    ): void;
    (
        this: void,
        groupName: string,
        spriteName: string,
        theWidth: number,
        theHeight: number
    ): void;
};
export const createTextSpriteInGroup: CreateTextSpriteInGroupFn = function (
    this: void,
    groupName: string,
    spriteName: string,
    theWidth: number,
    theHeight: number,
    thePosx?: number,
    thePosy?: number
): void {
    // to be used like sprite("textBox").text("hi"); // or .html("<b>hi</b>");
    if (GQG_DEBUG) {
        if (typeof (groupName) !== "string") {
            throwConsoleErrorInMyprogram("First argument for createTextSpriteInGroup must be a String. Instead found: " + groupName);
        }
        if (!spriteExists(groupName)) {
            throwConsoleErrorInMyprogram("createTextSpriteInGroup cannot find group (doesn't exist?): " + groupName);
        }

        if (typeof (spriteName) !== "string") {
            throwConsoleErrorInMyprogram("Second argument for createTextSpriteInGroup must be a String. Instead found: " + spriteName);
        }
        if (!spriteGroupNameFormatIsValid(spriteName)) {
            throwConsoleErrorInMyprogram("Sprite name given to createTextSpriteInGroup is in wrong format: " + spriteName);
        }
        if (spriteExists(spriteName)) {
            throwConsoleErrorInMyprogram("createTextSpriteInGroup cannot create duplicate sprite with name: " + spriteName);
        }

        if (arguments.length === 4 || arguments.length === 6) {
            throwIfNotFiniteNumber("Width argument for createTextSpriteInGroup must be numeric. ", theWidth);
            throwIfNotFiniteNumber("Height argument for createTextSpriteInGroup must be numeric. ", theHeight);

            if (arguments.length === 6) {
                throwIfNotFiniteNumber("X location argument for createTextSpriteInGroup must be numeric. ", thePosx);
                throwIfNotFiniteNumber("Y location argument for createTextSpriteInGroup must be numeric. ", thePosy);
            }
        } else {
            throwConsoleErrorInMyprogram("Wrong number of arguments used for createTextSpriteInGroup. Check API documentation for details of parameters.");
        }
    }

    if (arguments.length === 4) {
        $("#" + groupName).addSprite(spriteName, {
            width: theWidth,
            height: theHeight
        });
    } else if (arguments.length === 6) {
        $("#" + groupName).addSprite(spriteName, {
            width: theWidth,
            height: theHeight,
            posx: thePosx,
            posy: thePosy
        });
    }
    if (arguments.length === 4 || arguments.length === 6) {
        $("#" + spriteName).css("background-color", "white") // default to white background for ease of use
            .css("user-select", "none");
    }
};

const textInputSpriteTextAreaId = (spriteName: string): string => {
    return spriteName + "-textarea";
};
const textInputSpriteSubmitButtonId = (spriteName: string): string => {
    return spriteName + "-button";
};
const textInputSpriteGQG_SIGNALS_Id = (spriteName: string): string => {
    return spriteName + "-submitted";
};
type CreateTextInputSpriteInGroupFn = {
    (
        this: void,
        groupName: string,
        spriteName: string,
        theWidth: number,
        theHeight: number,
        rows: number,
        cols: number,
        thePosx: number,
        thePosy: number,
        submitHandler: SubmitHandlerFn
    ): void;
    (
        this: void,
        groupName: string,
        spriteName: string,
        theWidth: number,
        theHeight: number,
        rows: number,
        cols: number,
        thePosx: number,
        thePosy: number
    ): void;
    (
        this: void,
        groupName: string,
        spriteName: string,
        theWidth: number,
        theHeight: number,
        rows: number,
        cols: number
    ): void;
};
export const createTextInputSpriteInGroup: CreateTextInputSpriteInGroupFn =
    function (
        this: void,
        groupName: string,
        spriteName: string,
        theWidth: number,
        theHeight: number,
        rows: number,
        cols: number,
        thePosx?: number,
        thePosy?: number,
        submitHandler?: SubmitHandlerFn
    ): void {
        if (arguments.length === 6) {
            createTextSpriteInGroup(groupName, spriteName, theWidth, theHeight);
        } else if ((arguments.length === 8 || arguments.length === 9) && thePosx &&
            thePosy) {
            createTextSpriteInGroup(
                groupName,
                spriteName,
                theWidth,
                theHeight,
                thePosx,
                thePosy
            );
        }
        if (arguments.length === 6 || arguments.length === 8 ||
            arguments.length === 9) {
            $("#" + spriteName).css("background-color", "white"); // default to white background for ease of use

            var textareaHtml = '<textarea id="' +
                textInputSpriteTextAreaId(spriteName) + '" rows="' + rows +
                '" cols="' + cols + '">hi</textarea>';
            $("#" + spriteName).append(textareaHtml);

            var buttonId = textInputSpriteSubmitButtonId(spriteName);
            var buttonHtml = '<button id="' + buttonId +
                '" type="button">Submit</button>';
            $("#" + spriteName).append(buttonHtml);
        }

        if (arguments.length === 9) {
            textInputSpriteSetHandler(spriteName, submitHandler);
        } else {
            textInputSpriteSetHandler(spriteName);
        }
    };
export type SubmitHandlerFn = (s: string) => void;
export const textInputSpriteSetHandler = function (
    this: void,
    spriteName: string,
    submitHandler?: SubmitHandlerFn
): void {
    var realSubmitHandler;
    if (arguments.length === 2) {
        realSubmitHandler = function () {
            if (submitHandler) submitHandler(textInputSpriteString(spriteName));
            GQG_SIGNALS[textInputSpriteGQG_SIGNALS_Id(spriteName)] = true;
        };
    } else {
        realSubmitHandler = function () {
            GQG_SIGNALS[textInputSpriteGQG_SIGNALS_Id(spriteName)] = true;
        };
    }
    $("#" + textInputSpriteSubmitButtonId(spriteName)).click(realSubmitHandler);
};

export const textInputSpriteString = (spriteName: string): string => {
    return String($("#" + textInputSpriteTextAreaId(spriteName))[0].value);
};
export const textInputSpriteSetString = (
    spriteName: string,
    str: string
): void => {
    $("#" + textInputSpriteTextAreaId(spriteName))[0].value = str;
};

export const textInputSpriteReset = function (
    this: void,
    spriteName: string,
    textPrompt?: string
) {
    if (arguments.length === 1) {
        textInputSpriteSetString(spriteName, "");
    } else if (arguments.length === 2 && textPrompt) {
        textInputSpriteSetString(spriteName, textPrompt);
    }
    GQG_SIGNALS[textInputSpriteGQG_SIGNALS_Id(spriteName)] = false;
};

export const textInputSpriteSubmitted = (spriteName: string): boolean => {
    if (GQG_SIGNALS[textInputSpriteGQG_SIGNALS_Id(spriteName)] === true) {
        return true;
    }
    return false;
};

export const removeSprite = (spriteNameOrObj: string | object): void => {
    if (typeof (spriteNameOrObj) !== "object") {
        if (GQG_DEBUG) {
            throwIfSpriteNameInvalid(spriteNameOrObj);
        };
        $("#" + spriteNameOrObj).remove();
    } else {
        $(spriteNameOrObj).remove();
    }
};

export const sprite = (spriteName: string): spriteDomObject => {
    return $("#" + spriteName);
};

export const spriteExists = (spriteName: string): boolean => {
    return (spriteName == $("#" + spriteName).attr("id")); // spriteName could be given as an int by a student
};

export const spriteObject = (
    spriteNameOrObj: string | object
): spriteDomObject => {
    if (typeof (spriteNameOrObj) !== "object") {
        return $("#" + spriteNameOrObj);
    } else {
        return $(spriteNameOrObj);
    }
};

export const spriteId = (spriteNameOrObj: string | object): string => {
    if (typeof (spriteNameOrObj) !== "object") {
        return String($("#" + spriteNameOrObj).attr("id"));
    } else {
        return String($(spriteNameOrObj).attr("id"));
    }
};

export const spriteGetX = (spriteName: string): number => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
    };
    return $("#" + spriteName).x();
};
export const spriteGetY = (spriteName: string): number => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
    };
    return $("#" + spriteName).y();
};
export const spriteGetZ = (spriteName: string): number => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
    };
    return $("#" + spriteName).z();
};
export const spriteSetX = (spriteName: string, xval: number): void => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("X location must be a number.", xval);
    };
    $("#" + spriteName).x(xval);
};
export const spriteSetY = (spriteName: string, yval: number): void => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Y location must be a number.", yval);
    };
    $("#" + spriteName).y(yval);
};
export const spriteSetZ = (spriteName: string, zval: number): void => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Z location must be a number.", zval);
    };
    $("#" + spriteName).z(zval);
};
export const spriteSetXY = (
    spriteName: string,
    xval: number,
    yval: number
): void => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("X location must be a number.", xval);
        throwIfNotFiniteNumber("Y location must be a number.", yval);
    };
    $("#" + spriteName).xy(xval, yval);
};
export const spriteSetXYZ = (
    spriteName: string,
    xval: number,
    yval: number,
    zval: number
): void => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("X location must be a number.", xval);
        throwIfNotFiniteNumber("Y location must be a number.", yval);
        throwIfNotFiniteNumber("Z location must be a number.", zval);
    };
    $("#" + spriteName).xyz(xval, yval, zval);
};

export const spriteGetWidth = (spriteName: string): number => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
    };
    return $("#" + spriteName).w();
};
export const spriteGetHeight = (spriteName: string): number => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
    };
    return $("#" + spriteName).h();
};
export const spriteSetWidth = (spriteName: string, wval: number): void => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Width must be a number.", wval);
    }
    $("#" + spriteName).w(wval);
};
export const spriteSetHeight = (spriteName: string, hval: number): void => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Height must be a number.", hval);
    }
    $("#" + spriteName).h(hval);
};
export const spriteSetWidthHeight = (
    spriteName: string,
    wval: number,
    hval: number
): void => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Width must be a number.", wval);
        throwIfNotFiniteNumber("Height must be a number.", hval);
    }
    $("#" + spriteName).wh(wval, hval);
};

export const spriteRotate = (
    spriteName: string,
    angleDegrees: number
): void => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Angle must be a number.", angleDegrees);
    }
    $("#" + spriteName).rotate(angleDegrees);
};

const GQG_SPRITES_PROPS: { [x: string]: { [y: string]: any } } = {};
export const spriteScale = (spriteName: string, ratio: number): void => {
    // Scales the sprite's width/height with ratio, 
    // and set its anim to 100% fit it.
    //
    // NOTE: We assume that the width/height of the sprite 
    // upon first call to this function is the "original" width/height of the sprite.
    // This and all subsequent calls to this function calculates ratio
    // relative to that original width/height.

    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Ratio must be a number.", ratio);
    }

    let spriteProp = GQG_SPRITES_PROPS[spriteName];
    if (spriteProp == null) {
        spriteProp = {
            widthOriginal: spriteGetWidth(spriteName),
            heightOriginal: spriteGetHeight(spriteName)
        };
        GQG_SPRITES_PROPS[spriteName] = spriteProp;
    }
    const newWidth = spriteProp.widthOriginal * ratio;
    const newHeight = spriteProp.heightOriginal * ratio;

    //$("#" + spriteName).scale(ratio); // GQ scale is very broken.
    // GQ's scale() will scale the anim image (which is a background-image in the div) properly
    // and even scale the div's width/height properly
    // but somehow the in-game width/height that GQ stores for it remains the original size
    // and worse, the hit box's width/height that GQ uses to calculate collision detection with 
    // is in between the div's and the sprite's width/height (about halfway between? don't know).

    //$("#" + spriteName).css("transform-origin", "top left"); // do NOT change transform-origin, else breaks collision and rotate
    $("#" + spriteName).css("background-size", "100% 100%"); // stretches width/height independently to width/height of div
    spriteSetWidthHeight(spriteName, newWidth, newHeight);
};

export const spriteSetAnimation = function (
    this: void,
    spriteNameOrObj: string | object,
    aGQAnimation?: object,
    callbackFunction?: Function
) {
    if (arguments.length === 2 && aGQAnimation != null) {
        spriteObject(spriteNameOrObj).setAnimation(aGQAnimation);
    } else if (arguments.length === 3 && aGQAnimation != null && typeof callbackFunction === "function") {
        spriteObject(spriteNameOrObj).setAnimation(aGQAnimation, callbackFunction);
    } else if (arguments.length === 1) {
        spriteObject(spriteNameOrObj).setAnimation();
    }
};
export const spritePauseAnimation = (spriteName: string): void => {
    $("#" + spriteName).pauseAnimation();
};
export const spriteResumeAnimation = (spriteName: string): void => {
    $("#" + spriteName).resumeAnimation();
};

type JQObject = {
    offset: () => { left: number, top: number };
    outerWidth: (x: boolean) => number;
    outerHeight: (x: boolean) => number;
};
const jqObjsCollideAxisAligned = function (obj1: JQObject, obj2: JQObject) {
    // obj1/2 must be axis aligned jQuery objects
    const d1Left = obj1.offset().left;
    const d1Right = d1Left + obj1.outerWidth(true);
    const d1Top = obj1.offset().top;
    const d1Bottom = d1Top + obj1.outerHeight(true);

    const d2Left = obj2.offset().left;
    const d2Right = d2Left + obj2.outerWidth(true);
    const d2Top = obj2.offset().top;
    const d2Bottom = d2Top + obj2.outerHeight(true);

    return !(d1Bottom < d2Top || d1Top > d2Bottom || d1Right < d2Left || d1Left > d2Right);
};

type DOMObject = {
    getBoundingClientRect: () => { left: number, top: number, right: number, bottom: number };
};
const domObjsCollideAxisAligned = function (obj1: DOMObject, obj2: DOMObject) {
    // obj1/2 are DOM objects, possibly rotated
    // collision is checked via axis aligned bounding rects
    const r1 = obj1.getBoundingClientRect();
    const r2 = obj2.getBoundingClientRect();
    return !(r1.bottom < r2.top || r1.top > r2.bottom || r1.right < r2.left || r1.left > r2.right);
};

type GameQueryObject = {
    angle: number,
    animation: object,
    boundingCircle: object,
    currentFrame: number,
    factor: number,
    factorh: number,
    factorv: number,
    frameIncrement: number,
    geometry: number,
    height: number,
    idleCounter: number,
    playing: boolean,
    posOffsetX: number,
    posOffsetY: number,
    posx: number,
    posy: number,
    posz: number,
    width: number
};
const gqObjsCollideAxisAligned = function (obj1: { gameQuery: GameQueryObject }, obj2: { gameQuery: GameQueryObject }) {
    // obj1/2 must be axis aligned GQ DOM objects
    // turns out this is not really faster than domObjsCollideAxisAligned
    const r1 = obj1.gameQuery;
    const r1_bottom = r1.posy + r1.height;
    const r1_right = r1.posx + r1.width;

    const r2 = obj2.gameQuery;
    const r2_bottom = r2.posy + r2.height;
    const r2_right = r2.posx + r2.width;
    return !(r1_bottom < r2.posy || r1.posy > r2_bottom || r1_right < r2.posx || r1.posx > r2_right);
};

export type CollisionHandlingFn = (collIndex: number, hitSprite: object) =>
    void;
export const forEachSpriteSpriteCollisionDo = (
    sprite1Name: string,
    sprite2Name: string,
    collisionHandlingFunction: CollisionHandlingFn
): void => {
    $(spriteFilteredCollision(sprite1Name, ".gQ_group, #" + sprite2Name)).each(collisionHandlingFunction);
    // collisionHandlingFunction can optionally take two arguments: collIndex, hitSprite
    // see http://api.jquery.com/jQuery.each
};
export const forEach2SpritesHit = (() => {
    var printed = false;
    return (sprite1Name: string, sprite2Name: string, collisionHandlingFunction: CollisionHandlingFn) => {
        if (!printed) {
            printed = true;
            throwConsoleErrorInMyprogram("Deprecated function used: forEach2SpritesHit.  Use when2SpritesHit instead for better performance.");
        }
        forEachSpriteSpriteCollisionDo(sprite1Name, sprite2Name, collisionHandlingFunction);
    };
})();
export const when2SpritesHit = forEachSpriteSpriteCollisionDo; // NEW

export const forEachSpriteGroupCollisionDo = (
    sprite1Name: string,
    groupName: string,
    collisionHandlingFunction: CollisionHandlingFn
): void => {
    $(spriteFilteredCollision(sprite1Name, "#" + groupName + ", .gQ_sprite")).each(collisionHandlingFunction);
    // collisionHandlingFunction can optionally take two arguments: collIndex, hitSprite
    // see http://api.jquery.com/jQuery.each
};
export const forEachSpriteGroupHit = forEachSpriteGroupCollisionDo;

export const forEachSpriteFilteredCollisionDo = (
    sprite1Name: string,
    filterStr: string,
    collisionHandlingFunction: CollisionHandlingFn
): void => {
    $(spriteFilteredCollision(sprite1Name, filterStr)).each(collisionHandlingFunction);
    // see http://gamequeryjs.com/documentation/api/#collision for filterStr spec
    // collisionHandlingFunction can optionally take two arguments: collIndex, hitSprite
    // see http://api.jquery.com/jQuery.each
};
export const forEachSpriteFilteredHit = forEachSpriteFilteredCollisionDo;

const spriteFilteredCollision = function (sprite1Name: string, filter: string): DOMObject[] {
    // Fixes GQ's collision function, because GQ's collide function is badly broken when sprites are rotated/scaled
    // The fix is to check collision using axis aligned rectangular hit boxes.
    // Not great for rotated sprites, but good enough for now.
    const s1 = $("#" + sprite1Name);
    var resultList = [];

    //if (this !== $.gameQuery.playground) {
    // We must find all the elements that touche 'this'
    var elementsToCheck = new Array();
    elementsToCheck.push($.gameQuery.scenegraph.children(filter).get());

    for (var i = 0, len = elementsToCheck.length; i < len; i++) {
        var subLen = elementsToCheck[i].length;
        while (subLen--) {
            var elementToCheck = elementsToCheck[i][subLen];
            // Is it a gameQuery generated element?
            if (elementToCheck.gameQuery) {
                // We don't want to check groups
                if (!elementToCheck.gameQuery.group && !elementToCheck.gameQuery.tileSet) {
                    // Does it touche the selection?
                    if (s1[0] != elementToCheck) {
                        // Check bounding circle collision
                        /*var distance = Math.sqrt(Math.pow(offsetY + gameQuery.boundingCircle.y - elementsToCheck[i].offsetY - elementToCheck.gameQuery.boundingCircle.y, 2) + Math.pow(offsetX + gameQuery.boundingCircle.x - elementsToCheck[i].offsetX - elementToCheck.gameQuery.boundingCircle.x, 2));
                        if (distance - gameQuery.boundingCircle.radius - elementToCheck.gameQuery.boundingCircle.radius <= 0) {
                        */
                        const s1Rect = s1[0].getBoundingClientRect();
                        const e2Rect = elementToCheck.getBoundingClientRect();
                        if (!(s1Rect.bottom < e2Rect.top || s1Rect.top > e2Rect.bottom
                            || s1Rect.right < e2Rect.left || s1Rect.left > e2Rect.right)) {
                            // Check real collision
                            //if (collide(gameQuery, { x: offsetX, y: offsetY }, elementToCheck.gameQuery, { x: elementsToCheck[i].offsetX, y: elementsToCheck[i].offsetY })) {
                            // GQ's collide is very broken if rotation applied

                                // Add to the result list if collision detected
                                resultList.push(elementsToCheck[i][subLen]);
                        }
                    }
                }
                // Add the children nodes to the list
                var eleChildren = $(elementToCheck).children(filter);
                if (eleChildren.length) {
                    elementsToCheck.push(eleChildren.get());
                    elementsToCheck[len].offsetX = elementToCheck.gameQuery.posx + elementsToCheck[i].offsetX;
                    elementsToCheck[len].offsetY = elementToCheck.gameQuery.posy + elementsToCheck[i].offsetY;
                    len++;
                }
            }
        }
    }

    return resultList;
};

export type SpriteHitDirectionality = {
    "left": boolean;
    "right": boolean;
    "up": boolean;
    "down": boolean;
};
export const spriteHitDirection = (
    sprite1Id: string,
    sprite1X: number,
    sprite1Y: number,
    sprite1XSpeed: number,
    sprite1YSpeed: number,
    sprite1Width: number,
    sprite1Height: number,
    sprite2Id: string,
    sprite2X: number,
    sprite2Y: number,
    sprite2XSpeed: number,
    sprite2YSpeed: number,
    sprite2Width: number,
    sprite2Height: number
): SpriteHitDirectionality => {
    var sprite1Info: SpriteDict = {
        "id": sprite1Id,
        "xPos": sprite1X,
        "yPos": sprite1Y,
        "xSpeed": sprite1XSpeed,
        "ySpeed": sprite1YSpeed,
        "height": sprite1Height,
        "width": sprite1Width
    };
    var sprite2Info: SpriteDict = {
        "id": sprite2Id,
        "xPos": sprite2X,
        "yPos": sprite2Y,
        "xSpeed": sprite2XSpeed,
        "ySpeed": sprite2YSpeed,
        "height": sprite2Height,
        "width": sprite2Width
    };
    return spriteHitDir(sprite1Info, sprite2Info);
};

export type SpritePhysicalDimensions = {
    "xPos": number;
    "yPos": number;
    "xSpeed": number; // movement must be by dictionary,
    "ySpeed": number; // with something like x = x + xSpeed
    "width": number;
    "height": number;
};
export type SpriteDict = SpritePhysicalDimensions & {
    "id": string;
    [s: string]: any;
};
const spritesSpeedSamples: { [k: string]: { sampleSize: number, xSpeedSamples: number[], ySpeedSamples: number[], checked: boolean } } = {};
const checkSpriteSpeedUsageCommonErrors = (spriteInfo: SpriteDict) => {
    // A heuristic check for common errors from learners.
    // Check if sprite speeds ever change.  If not, probably doing it wrong.
    if (!spritesSpeedSamples[spriteInfo["id"]]) {
        spritesSpeedSamples[spriteInfo["id"]] = {
            sampleSize: 0,
            xSpeedSamples: [],
            ySpeedSamples: [],
            checked: false
        };
    } else {
        const sprite1Sampling = spritesSpeedSamples[spriteInfo["id"]];
        const maxSampleSize = 10;
        if (sprite1Sampling.sampleSize < maxSampleSize) {
            ++sprite1Sampling.sampleSize;
            sprite1Sampling.xSpeedSamples.push(spriteInfo["xSpeed"]);
            sprite1Sampling.ySpeedSamples.push(spriteInfo["ySpeed"]);
        } else if (!sprite1Sampling.checked) {
            sprite1Sampling.checked = true;
            const ss = sprite1Sampling.sampleSize;
            const sxSamples = sprite1Sampling.xSpeedSamples;
            const sySamples = sprite1Sampling.ySpeedSamples;

            let sameXspeed = true;
            for (let i = 1; i < ss; ++i) {
                if (sxSamples[i] !== sxSamples[i - 1]) {
                    sameXspeed = false;
                    break;
                }
            }
            if (sameXspeed && sxSamples[0] !== 0) {
                console.log(GQG_WARNING_IN_MYPROGRAM_MSG
                    + "sprite hit direction functionality- possibly wrong xPos calculation for sprite: "
                    + spriteInfo["id"]
                    + ".  Ensure xSpeed used validly if sprite hit directionality seems wrong.");
            }

            let sameYspeed = true;
            for (let i = 1; i < ss; ++i) {
                if (sySamples[i] !== sySamples[i - 1]) {
                    sameYspeed = false;
                    break;
                }
            }
            if (sameYspeed && sySamples[0] !== 0) {
                console.log(GQG_WARNING_IN_MYPROGRAM_MSG
                    + "sprite hit direction functionality- possibly wrong yPos calculation for sprite: "
                    + spriteInfo["id"]
                    + ".  Ensure ySpeed used validly if sprite hit directionality seems wrong.");
            }
        }
    }
};

export const spriteHitDir = (
    sprite1Info: SpriteDict,
    sprite2Info: SpriteDict
): SpriteHitDirectionality => {
    if (GQG_DEBUG) {
        checkSpriteSpeedUsageCommonErrors(sprite1Info);
        checkSpriteSpeedUsageCommonErrors(sprite2Info);
    }
    return spriteHitDirImpl(sprite1Info, sprite2Info);
}
const spriteHitDirImpl = (
    sprite1Info: SpritePhysicalDimensions,
    sprite2Info: SpritePhysicalDimensions
): SpriteHitDirectionality => {
    /*
       Returns the direction that sprite 1 hits sprite 2 from.
       sprite 1 is relatively left/right/up/down of sprite 2
       
       Hit direction returned could be multiple values (e.g. left and up),
       and is returned by this function as a dictionary as, e.g.
       {
       "left": false,
       "right": false,
       "up": false,
       "down": false
       }
       
       Parameters sprite{1,2}Info are dictionaries with at least these keys:
       {
       "id": "actualSpriteName",
       "xPos": 500,
       "yPos": 200,
       "xSpeed": -8,  // movement must be by dictionary,
       "ySpeed": 0,   // with something like x = x + xSpeed
       "height": 74,
       "width": 75
       }
       */

    var percentMargin = 1.1; // positive percent in decimal
    var dir: SpriteHitDirectionality = {
        "left": false,
        "right": false,
        "up": false,
        "down": false
    };

    // current horizontal position
    var s1left = sprite1Info["xPos"];
    var s1right = s1left + sprite1Info["width"];

    var s2left = sprite2Info["xPos"];
    var s2right = s2left + sprite2Info["width"];

    // reverse horizontal position by xSpeed with percent margin
    var sprite1XSpeed = sprite1Info["xSpeed"] * percentMargin;
    s1left = s1left - sprite1XSpeed;
    s1right = s1right - sprite1XSpeed;

    var sprite2XSpeed = sprite2Info["xSpeed"] * percentMargin;
    s2left = s2left - sprite2XSpeed;
    s2right = s2right - sprite2XSpeed;

    if (s1right <= s2left) {
        dir["left"] = true;
    }
    if (s2right <= s1left) {
        dir["right"] = true;
    }

    // current vertical position
    var s1top = sprite1Info["yPos"];
    var s1bottom = s1top + sprite1Info["height"];

    var s2top = sprite2Info["yPos"];
    var s2bottom = s2top + sprite2Info["height"];

    // reverse vertical position by ySpeed with percent margin
    var sprite1YSpeed = sprite1Info["ySpeed"] * percentMargin;
    s1top = s1top - sprite1YSpeed;
    s1bottom = s1bottom - sprite1YSpeed;

    var sprite2YSpeed = sprite2Info["ySpeed"] * percentMargin;
    s2top = s2top - sprite2YSpeed;
    s2bottom = s2bottom - sprite2YSpeed;

    if (s1bottom <= s2top) {
        dir["up"] = true;
    }
    if (s2bottom <= s1top) {
        dir["down"] = true;
    }

    return dir;
};

export const getKeyState = (key: number): boolean => {
    return !!$.gQ.keyTracker[key];
};

export const getMouseX = (): number => {
    return $.gQ.mouseTracker.x;
};
export const getMouseY = (): number => {
    return $.gQ.mouseTracker.y;
};
export const getMouseButton1 = (): boolean => {
    return !!$.gQ.mouseTracker[1];
};
export const getMouseButton2 = (): boolean => {
    return !!$.gQ.mouseTracker[2];
};
export const getMouseButton3 = (): boolean => {
    return !!$.gQ.mouseTracker[3];
};

export const disableContextMenu = (): void => {
    // see also: https://stackoverflow.com/questions/4920221/jquery-js-prevent-right-click-menu-in-browsers
    // $("#playground").contextmenu(function(){return false;});
    $("#playground").on("contextmenu", function () {
        return false;
    });
};
export const enableContextMenu = (): void => {
    // see also: https://stackoverflow.com/questions/4920221/jquery-js-prevent-right-click-menu-in-browsers
    $("#playground").off("contextmenu");
};

export const hideMouseCursor = (): void => {
    $("#playground").css("cursor", "none");
};
export const showMouseCursor = (): void => {
    $("#playground").css("cursor", "default");
};

export const saveDictionaryAs = (saveAs: string, dictionary: object): void => {
    // requires js-cookie: https://github.com/js-cookie/js-cookie/tree/v2.0.4
    Cookies.set("GQG_" + saveAs, dictionary);
};
export const getSavedDictionary = (savedAs: string): object => {
    return Cookies.getJSON("GQG_" + savedAs);
};
export const deleteSavedDictionary = (savedAs: string): void => {
    Cookies.remove("GQG_" + savedAs);
};

export const createOvalInGroup = (
    groupName: string | null,
    id: string,
    x: number,
    y: number,
    w: number,
    h: number,
    color?: string,
    rotdeg?: number,
    rotOriginX?: number,
    rotOriginY?: number
): void => {
    // rotdeg in degrees clockwise on screen (recall y-axis points downwards!)

    if (!color) {
        color = "gray";
    }

    if (!groupName) {
        $.playground().addSprite(id, { width: 1, height: 1 });
    } else {
        createSpriteInGroup(groupName, id, { width: 1, height: 1 });
    }

    var border_radius = (w / 2 + "px / " + h / 2 + "px");
    sprite(id)
        .css("background", color)
        .css("border-radius", border_radius)
        .css("-moz-border-radius", border_radius)
        .css("-webkit-border-radius", border_radius);

    spriteSetWidthHeight(id, w, h);
    spriteSetXY(id, x, y);

    if (rotdeg) {
        if (rotOriginX && rotOriginY) {
            var rotOrigin = rotOriginX + "px " + rotOriginY + "px";
            sprite(id)
                .css("-webkit-transform-origin", rotOrigin)
                .css("-moz-transform-origin", rotOrigin)
                .css("-ms-transform-origin", rotOrigin)
                .css("-o-transform-origin", rotOrigin)
                .css("transform-origin", rotOrigin);
        }
        spriteRotate(id, rotdeg);
    }
};
export const createOval = (
    id: string,
    x: number,
    y: number,
    w: number,
    h: number,
    color?: string,
    rotdeg?: number,
    rotOriginX?: number,
    rotOriginY?: number
): void => {
    createOvalInGroup(
        null,
        id,
        x,
        y,
        w,
        h,
        color,
        rotdeg,
        rotOriginX,
        rotOriginY
    );
};
export const drawOval = (
    x: number,
    y: number,
    w: number,
    h: number,
    color?: string,
    rotdeg?: number,
    rotOriginX?: number,
    rotOriginY?: number
): void => {
    createOval(
        "GQG_oval_" + GQG_getUniqueId(),
        x,
        y,
        w,
        h,
        color,
        rotdeg,
        rotOriginX,
        rotOriginY
    );
};
export const createCircleInGroup = (
    groupName: string | null,
    id: string,
    x: number,
    y: number,
    r: number,
    color?: string,
    rotdeg?: number,
    rotOriginX?: number,
    rotOriginY?: number
): void => {
    createOvalInGroup(
        groupName,
        id,
        x,
        y,
        r,
        r,
        color,
        rotdeg,
        rotOriginX,
        rotOriginY
    );
};
export const createCircle = (
    id: string,
    x: number,
    y: number,
    r: number,
    color?: string,
    rotdeg?: number,
    rotOriginX?: number,
    rotOriginY?: number
): void => {
    createCircleInGroup(
        null,
        id,
        x,
        y,
        r,
        color,
        rotdeg,
        rotOriginX,
        rotOriginY
    );
};
export const drawCircle = (
    x: number,
    y: number,
    r: number,
    color?: string,
    rotdeg?: number,
    rotOriginX?: number,
    rotOriginY?: number
): void => {
    createCircle(
        "GQG_circle_" + GQG_getUniqueId(),
        x,
        y,
        r,
        color,
        rotdeg,
        rotOriginX,
        rotOriginY
    );
};

export const createRectInGroup = (
    groupName: string | null,
    id: string,
    x: number,
    y: number,
    w: number,
    h: number,
    color?: string,
    rotdeg?: number,
    rotOriginX?: number,
    rotOriginY?: number
): void => {
    // rotdeg in degrees clockwise on screen (recall y-axis points downwards!)
    // rotOrigin{X,Y} must be within range of wide w and height h, and relative to coordinate (x,y).

    if (!color) {
        color = "gray";
    }

    if (!groupName) {
        $.playground().addSprite(id, { width: 1, height: 1 });
    } else {
        createSpriteInGroup(groupName, id, { width: 1, height: 1 });
    }

    sprite(id).css("background", color);

    spriteSetWidthHeight(id, w, h);
    spriteSetXY(id, x, y);

    if (rotdeg) {
        if (rotOriginX && rotOriginY) {
            var rotOrigin = rotOriginX + "px " + rotOriginY + "px";
            sprite(id)
                .css("-webkit-transform-origin", rotOrigin)
                .css("-moz-transform-origin", rotOrigin)
                .css("-ms-transform-origin", rotOrigin)
                .css("-o-transform-origin", rotOrigin)
                .css("transform-origin", rotOrigin);
        }
        spriteRotate(id, rotdeg);
    }
};
export const createRect = (
    id: string,
    x: number,
    y: number,
    w: number,
    h: number,
    color?: string,
    rotdeg?: number,
    rotOriginX?: number,
    rotOriginY?: number
): void => {
    createRectInGroup(
        null,
        id,
        x,
        y,
        w,
        h,
        color,
        rotdeg,
        rotOriginX,
        rotOriginY
    );
};
export const drawRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    color?: string,
    rotdeg?: number,
    rotOriginX?: number,
    rotOriginY?: number
): void => {
    createRect(
        "GQG_rect_" + GQG_getUniqueId(),
        x,
        y,
        w,
        h,
        color,
        rotdeg,
        rotOriginX,
        rotOriginY
    );
};

export const createLineInGroup = (
    groupName: string | null,
    id: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color?: string,
    thickness?: number
): void => {
    if (!color) {
        color = "gray";
    }
    if (!thickness) {
        thickness = 2;
    }
    var xd = x2 - x1;
    var yd = y2 - y1;
    var dist = Math.sqrt(xd * xd + yd * yd);

    var arcCos = Math.acos(xd / dist);
    if (y2 < y1) {
        arcCos *= -1;
    }
    var rotdeg = arcCos * 180 / Math.PI;

    var halfThick = thickness / 2;
    var drawY1 = y1 - halfThick;

    createRectInGroup(
        groupName,
        id,
        x1,
        drawY1,
        dist,
        thickness,
        color,
        rotdeg,
        0,
        halfThick
    );
};
export const createLine = (
    id: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color?: string,
    thickness?: number
): void => {
    createLineInGroup(null, id, x1, y1, x2, y2, color, thickness);
};
export const drawLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color?: string,
    thickness?: number
): void => {
    createLine("GQG_line_" + GQG_getUniqueId(), x1, y1, x2, y2, color, thickness);
};

export type ContainerIterator = {
    next: () => [number, number];
    hasNext: () => boolean;
    current: number;
    end: number;
    _keys: string[];
};
export type NumberToNumberMappingFn = (n: number) => number | Record<
    number,
    number
>;
export type CreateContainerIteratorFn = {
    (
        this: void,
        f: NumberToNumberMappingFn,
        start: number,
        end: number,
        stepsize: number
    ): ContainerIterator;
    (this: void, f: NumberToNumberMappingFn): ContainerIterator;
};
export const createContainerIterator: CreateContainerIteratorFn = function (
    this: void,
    f: NumberToNumberMappingFn,
    start?: number,
    end?: number,
    stepsize?: number
): ContainerIterator {
    if (arguments.length === 1 && typeof f === "object") {
        const fOwnPropNames: string[] = Object.getOwnPropertyNames(f);
        const it: ContainerIterator = {
            current: 0,
            end: fOwnPropNames.length,
            _keys: fOwnPropNames,
            next: function (this: ContainerIterator): [number, number] {
                const itemIdx = this._keys[this.current];
                const item: [number, number] = [Number(itemIdx), f[itemIdx]];
                this.current++;
                return item;
            },
            hasNext: function (this: ContainerIterator): boolean {
                return (this.current < this.end);
            }
        };
        return it;
    } else {
        throwIfNotFiniteNumber("start must be a number.", start);
        throwIfNotFiniteNumber("end must be a number.", end);
        throwIfNotFiniteNumber("stepsize must be a number.", stepsize);
        if (start == null || end == null || stepsize == null) {
            throw "TS type hint";
        }

        const fx: (n: number) => number = (typeof f === "function"
            ? (f as (x: number) => number)
            : (x: number): number => {
                return Number(f[x]);
            });
        const it: ContainerIterator = {
            next: function (this: ContainerIterator): [number, number] {
                const item: [number, number] = [this.current, fx(this.current)];
                this.current += stepsize;
                return item;
            },
            hasNext: function (this: ContainerIterator): boolean {
                return (this.current < this.end);
            },
            current: start,
            end: end,
            _keys: typeof f !== "function" ? Object.getOwnPropertyNames(f) : (() => {
                let k: string[] = [];
                for (let i: number = start; i < end; i += stepsize) {
                    k.push(String(i));
                }
                return k;
            })()
        };
        return it;
    }
};
export type GraphCreationOptions = {
    interpolated: boolean;
};
export type CreateGraphWithOptionsFn = {
    (
        this: void,
        groupName: string,
        id: string,
        f: NumberToNumberMappingFn,
        moreOpts: GraphCreationOptions,
        start: number,
        end: number,
        stepsize: number,
        color: string,
        radius_thickness: number
    ): GroupNameAndIdPrefix;
    (
        this: void,
        groupName: string,
        id: string,
        f: NumberToNumberMappingFn,
        moreOpts: GraphCreationOptions,
        start: number,
        end: number,
        stepsize: number,
        color: string
    ): GroupNameAndIdPrefix;
    (
        this: void,
        groupName: string,
        id: string,
        f: NumberToNumberMappingFn,
        moreOpts: GraphCreationOptions,
        start: number,
        end: number,
        stepsize: number
    ): GroupNameAndIdPrefix;
    (
        this: void,
        groupName: string,
        id: string,
        f: NumberToNumberMappingFn,
        moreOpts: GraphCreationOptions,
        color: string,
        radius_thickness: number
    ): GroupNameAndIdPrefix;
    (
        this: void,
        groupName: string,
        id: string,
        f: NumberToNumberMappingFn,
        moreOpts: GraphCreationOptions,
        color: string
    ): GroupNameAndIdPrefix;
    (
        this: void,
        groupName: string,
        id: string,
        f: NumberToNumberMappingFn,
        moreOpts: GraphCreationOptions
    ): GroupNameAndIdPrefix;
};
export type GroupNameAndIdPrefix = {
    "id": string;
    "group": string;
};
type CreateGraphWithOptionsFnParamTypes = [
    string,
    string,
    NumberToNumberMappingFn,
    GraphCreationOptions
];
export const createGraphWithOptions: CreateGraphWithOptionsFn = function (
    this: void,
    groupName: string,
    id: string,
    f: NumberToNumberMappingFn,
    moreOpts: GraphCreationOptions
): GroupNameAndIdPrefix {
    // fn signature: (groupName, id, f, moreOpts, start, end, stepsize, color, radius_thickness)
    // fn signature: (groupName, id, f, moreOpts, start, end, stepsize, color)
    // fn signature: (groupName, id, f, moreOpts, start, end, stepsize)
    // fn signature: (groupName, id, f, moreOpts, color, radius_thickness)
    // fn signature: (groupName, id, f, moreOpts, color)
    // fn signature: (groupName, id, f, moreOpts)
    // moreOpts = {"interpolated": trueOrFalse}
    var interpolated = moreOpts["interpolated"];

    if (!id) {
        id = "GQG_graph_" + GQG_getUniqueId();
    }
    if (!groupName) {
        groupName = id + "_group";
        createGroupInPlayground(groupName);
    }
    var group_id = {
        "id": id,
        "group": groupName
    };

    var color;
    var radius_thickness;
    let iter: ContainerIterator;
    if (arguments.length >= 4 && arguments.length <= 6 &&
        "object" === typeof (f)) {
        color = arguments[4];
        radius_thickness = arguments[5];
        iter = createContainerIterator(f);
    } else if (arguments.length >= 7 && arguments.length <= 9) {
        var start = arguments[4];
        var end = arguments[5];
        var stepsize = arguments[6];
        color = arguments[7];
        radius_thickness = arguments[8];
        iter = createContainerIterator(f, start, end, stepsize);
    } else {
        throwConsoleErrorInMyprogram("Function used with wrong number of arguments");
        throw "TS type hint";
    }

    if (color == undefined) {
        color = "gray";
    }
    if (radius_thickness == undefined) {
        radius_thickness = 2;
    }

    var currX = null;
    var currY = null;
    while (iter.hasNext()) {
        var item = iter.next();
        var i = item[0];
        var fxi = item[1];

        if (fxi === Infinity) {
            fxi = GQG_MAX_SAFE_PLAYGROUND_INTEGER;
        } else if (fxi === -Infinity) {
            fxi = GQG_MIN_SAFE_PLAYGROUND_INTEGER;
        }

        if (currY === null && fxi != undefined) {
            currX = i;
            currY = fxi;
            if (!interpolated) {
                createCircleInGroup(
                    group_id["group"],
                    group_id["id"] + "_graph_pt_" + i,
                    i,
                    fxi,
                    radius_thickness,
                    color
                );
            }
        } else if (fxi != undefined) {
            if (!interpolated) {
                createCircleInGroup(
                    group_id["group"],
                    group_id["id"] + "_graph_pt_" + i,
                    i,
                    fxi,
                    radius_thickness,
                    color
                );
            } else {
                createLineInGroup(
                    group_id["group"],
                    group_id["id"] + "_graph_line_" + currX + "-" + i,
                    currX as number,
                    currY as number,
                    i,
                    fxi,
                    color,
                    radius_thickness
                );
            }
            currX = i;
            currY = fxi;
        }
    }

    return group_id;
};

type CreateGraphInGroupFn = {
    (
        this: void,
        groupName: string,
        id: string,
        f: NumberToNumberMappingFn,
        start: number,
        end: number,
        stepsize: number,
        color: string,
        dotRadius: number
    ): void;
    (
        this: void,
        groupName: string,
        id: string,
        f: NumberToNumberMappingFn,
        start: number,
        end: number,
        stepsize: number,
        color: string
    ): void;
    (
        this: void,
        groupName: string,
        id: string,
        f: NumberToNumberMappingFn,
        start: number,
        end: number,
        stepsize: number
    ): void;
    (
        this: void,
        groupName: string,
        id: string,
        f: NumberToNumberMappingFn,
        color: string,
        dotRadius: number
    ): void;
    (
        this: void,
        groupName: string,
        id: string,
        f: NumberToNumberMappingFn,
        color: string
    ): void;
    (
        this: void,
        groupName: string,
        id: string,
        f: NumberToNumberMappingFn
    ): void;
};
export const createGraphInGroup: CreateGraphInGroupFn = function (
    this: void,
    groupName: string,
    id: string,
    f: NumberToNumberMappingFn
): GroupNameAndIdPrefix {
    // fn signature: (groupName, id, f, start, end, stepsize, color, dotRadius)
    // fn signature: (groupName, id, f, start, end, stepsize, color)
    // fn signature: (groupName, id, f, start, end, stepsize)
    // fn signature: (groupName, id, f, color, dotRadius)
    // fn signature: (groupName, id, f, color)
    // fn signature: (groupName, id, f)
    var args = Array.prototype.slice.call(arguments);
    args.splice(3, 0, { "interpolated": false });
    return createGraphWithOptions.apply(
        this,
        args as CreateGraphWithOptionsFnParamTypes
    );
};

type CreateGraphFn = {
    (
        this: void,
        id: string,
        f: NumberToNumberMappingFn,
        start: number,
        end: number,
        stepsize: number,
        color: string,
        dotRadius: number
    ): GroupNameAndIdPrefix;
    (
        this: void,
        id: string,
        f: NumberToNumberMappingFn,
        start: number,
        end: number,
        stepsize: number,
        color: string
    ): GroupNameAndIdPrefix;
    (
        this: void,
        id: string,
        f: NumberToNumberMappingFn,
        start: number,
        end: number,
        stepsize: number
    ): GroupNameAndIdPrefix;
    (
        this: void,
        id: string,
        f: NumberToNumberMappingFn,
        color: string,
        dotRadius: number
    ): GroupNameAndIdPrefix;
    (
        this: void,
        id: string,
        f: NumberToNumberMappingFn,
        color: string
    ): GroupNameAndIdPrefix;
    (this: void, id: string, f: NumberToNumberMappingFn): GroupNameAndIdPrefix;
};
export const createGraph: CreateGraphFn = function (
    this: void
): GroupNameAndIdPrefix {
    // fn signature: (id, f, start, end, stepsize, color, dotRadius)
    // fn signature: (id, f, start, end, stepsize, color)
    // fn signature: (id, f, start, end, stepsize)
    // fn signature: (id, f, color, dotRadius)
    // fn signature: (id, f, color)
    // fn signature: (id, f)
    var opts = Array.prototype.slice.call(arguments);
    opts.splice(0, 0, null);
    opts.splice(3, 0, { "interpolated": false });
    return createGraphWithOptions.apply(
        this,
        opts as CreateGraphWithOptionsFnParamTypes
    );
};

type DrawGraphFn = {
    (
        this: void,
        f: NumberToNumberMappingFn,
        start: number,
        end: number,
        stepsize: number,
        color: string,
        dotRadius: number
    ): GroupNameAndIdPrefix;
    (
        this: void,
        f: NumberToNumberMappingFn,
        start: number,
        end: number,
        stepsize: number,
        color: string
    ): GroupNameAndIdPrefix;
    (
        this: void,
        f: NumberToNumberMappingFn,
        start: number,
        end: number,
        stepsize: number
    ): GroupNameAndIdPrefix;
    (
        this: void,
        f: NumberToNumberMappingFn,
        color: string,
        dotRadius: number
    ): GroupNameAndIdPrefix;
    (
        this: void,
        f: NumberToNumberMappingFn,
        color: string
    ): GroupNameAndIdPrefix;
    (this: void, f: NumberToNumberMappingFn): GroupNameAndIdPrefix;
};
export const drawGraph: DrawGraphFn = function drawGraph(
    this: void
): GroupNameAndIdPrefix {
    // fn signature: (f, start, end, stepsize, color, dotRadius)
    // fn signature: (f, start, end, stepsize, color)
    // fn signature: (f, start, end, stepsize)
    // fn signature: (f, color, dotRadius)
    // fn signature: (f, color)
    // fn signature: (f)
    var opts = Array.prototype.slice.call(arguments);
    opts.splice(0, 0, null);
    opts.splice(0, 0, null);
    opts.splice(3, 0, { "interpolated": false });
    return createGraphWithOptions.apply(
        this,
        opts as CreateGraphWithOptionsFnParamTypes
    );
};

type CreateInterpolatedGraphInGroupFn = {
    (
        this: void,
        groupName: string,
        id: string,
        f: NumberToNumberMappingFn,
        start: number,
        end: number,
        stepsize: number,
        color: string,
        thickness: number
    ): GroupNameAndIdPrefix;
    (
        this: void,
        groupName: string,
        id: string,
        f: NumberToNumberMappingFn,
        start: number,
        end: number,
        stepsize: number,
        color: string
    ): GroupNameAndIdPrefix;
    (
        this: void,
        groupName: string,
        id: string,
        f: NumberToNumberMappingFn,
        start: number,
        end: number,
        stepsize: number
    ): GroupNameAndIdPrefix;
    (
        this: void,
        groupName: string,
        id: string,
        f: NumberToNumberMappingFn,
        color: string,
        thickness: number
    ): GroupNameAndIdPrefix;
    (
        this: void,
        groupName: string,
        id: string,
        f: NumberToNumberMappingFn,
        color: string
    ): GroupNameAndIdPrefix;
    (
        this: void,
        groupName: string,
        id: string,
        f: NumberToNumberMappingFn
    ): GroupNameAndIdPrefix;
};
export const createInterpolatedGraphInGroup: CreateInterpolatedGraphInGroupFn =
    function (
        this: void,
        groupName: string,
        id: string,
        f: NumberToNumberMappingFn
    ): GroupNameAndIdPrefix {
        // fn signature: (groupName, id, f, start, end, stepsize, color, thickness)
        // fn signature: (groupName, id, f, start, end, stepsize, color)
        // fn signature: (groupName, id, f, start, end, stepsize)
        // fn signature: (groupName, id, f, color, thickness)
        // fn signature: (groupName, id, f, color)
        // fn signature: (groupName, id, f)
        var args = Array.prototype.slice.call(arguments);
        args.splice(3, 0, { "interpolated": true });
        return createGraphWithOptions.apply(
            this,
            args as CreateGraphWithOptionsFnParamTypes
        );
    };

type CreateInterpolatedGraphFn = {
    (
        this: void,
        id: string,
        f: NumberToNumberMappingFn,
        start: number,
        end: number,
        stepsize: number,
        color: string,
        thickness: number
    ): GroupNameAndIdPrefix;
    (
        this: void,
        id: string,
        f: NumberToNumberMappingFn,
        start: number,
        end: number,
        stepsize: number,
        color: string
    ): GroupNameAndIdPrefix;
    (
        this: void,
        id: string,
        f: NumberToNumberMappingFn,
        start: number,
        end: number,
        stepsize: number
    ): GroupNameAndIdPrefix;
    (
        this: void,
        id: string,
        f: NumberToNumberMappingFn,
        color: string,
        thickness: number
    ): GroupNameAndIdPrefix;
    (
        this: void,
        id: string,
        f: NumberToNumberMappingFn,
        color: string
    ): GroupNameAndIdPrefix;
    (this: void, id: string, f: NumberToNumberMappingFn): GroupNameAndIdPrefix;
};
export const createInterpolatedGraph: CreateInterpolatedGraphFn = function (
    this: void
): GroupNameAndIdPrefix {
    // fn signature: (id, f, start, end, stepsize, color, thickness)
    // fn signature: (id, f, start, end, stepsize, color)
    // fn signature: (id, f, start, end, stepsize)
    // fn signature: (id, f, color, thickness)
    // fn signature: (id, f, color)
    // fn signature: (id, f)
    var opts = Array.prototype.slice.call(arguments);
    opts.splice(0, 0, null);
    opts.splice(3, 0, { "interpolated": true });
    return createGraphWithOptions.apply(
        this,
        opts as CreateGraphWithOptionsFnParamTypes
    );
    // return createInterpolatedGraphInGroup.apply(this, opts);
};

type DrawInterpolatedGraphFn = {
    (
        this: void,
        f: NumberToNumberMappingFn,
        start: number,
        end: number,
        stepsize: number,
        color: string,
        thickness: number
    ): GroupNameAndIdPrefix;
    (
        this: void,
        f: NumberToNumberMappingFn,
        start: number,
        end: number,
        stepsize: number,
        color: string
    ): GroupNameAndIdPrefix;
    (
        this: void,
        f: NumberToNumberMappingFn,
        start: number,
        end: number,
        stepsize: number
    ): GroupNameAndIdPrefix;
    (
        this: void,
        f: NumberToNumberMappingFn,
        color: string,
        thickness: number
    ): GroupNameAndIdPrefix;
    (
        this: void,
        f: NumberToNumberMappingFn,
        color: string
    ): GroupNameAndIdPrefix;
    (this: void, f: NumberToNumberMappingFn): GroupNameAndIdPrefix;
};
export const drawInterpolatedGraph: DrawInterpolatedGraphFn = function (
    this: void
): GroupNameAndIdPrefix {
    // fn signature: (f, start, end, stepsize, color, thickness)
    // fn signature: (f, start, end, stepsize, color)
    // fn signature: (f, start, end, stepsize)
    // fn signature: (f, color, thickness)
    // fn signature: (f, color)
    // fn signature: (f)
    var opts = Array.prototype.slice.call(arguments);
    opts.splice(0, 0, null);
    opts.splice(0, 0, null);
    opts.splice(3, 0, { "interpolated": true });
    return createGraphWithOptions.apply(
        this,
        opts as CreateGraphWithOptionsFnParamTypes
    );
};
