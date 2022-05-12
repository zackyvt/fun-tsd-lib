"use strict";
// students are not supposed to use GQG_ variables
let GQG_DEBUG = true;
       const setGqDebugFlag = (debug) => {
    if (debug) {
        GQG_DEBUG = true;
    }
    else {
        console.log(GQG_WARNING_IN_MYPROGRAM_MSG + "debug mode disabled and your code is now running in unsafe mode.");
        GQG_DEBUG = false;
    }
};
const GQG_SPRITE_GROUP_NAME_FORMAT_REGEX = /[a-zA-Z0-9_]+[a-zA-Z0-9_-]*/;
       const spriteGroupNameFormatIsValid = (spriteOrGroupName) => {
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
const GQG_SIGNALS = {};
let GQG_UNIQUE_ID_COUNTER = 0;
let GQG_PLAYGROUND_WIDTH = 640;
let GQG_PLAYGROUND_HEIGHT = 480;
       let PLAYGROUND_WIDTH = GQG_PLAYGROUND_WIDTH; // students are not supposed to use GQG_ variables
       let PLAYGROUND_HEIGHT = GQG_PLAYGROUND_HEIGHT;
       const ANIMATION_HORIZONTAL = $.gQ.ANIMATION_HORIZONTAL;
       const ANIMATION_VERTICAL = $.gQ.ANIMATION_VERTICAL;
       const ANIMATION_ONCE = $.gQ.ANIMATION_ONCE;
       const ANIMATION_PINGPONG = $.gQ.ANIMATION_PINGPONG;
       const ANIMATION_CALLBACK = $.gQ.ANIMATION_CALLBACK;
       const ANIMATION_MULTI = $.gQ.ANIMATION_MULTI;
// Max/Min Safe Playground Integers found by experimenting with GQ 0.7.1 in Firefox 41.0.2 on Mac OS X 10.10.5
const GQG_MIN_SAFE_PLAYGROUND_INTEGER = -(Math.pow(2, 24) - 1); // cf. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER
const GQG_MAX_SAFE_PLAYGROUND_INTEGER = (Math.pow(2, 24) - 1); // cf. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
const GQG_getUniqueId = () => {
    return Date.now() + "_" + GQG_UNIQUE_ID_COUNTER++;
};
       const setGqPlaygroundDimensions = (width, height) => {
    // this must be executed outside of setup and draw functions
    GQG_PLAYGROUND_HEIGHT = height;
    PLAYGROUND_HEIGHT = height;
    GQG_PLAYGROUND_WIDTH = width;
    PLAYGROUND_WIDTH = width;
    sprite("playground").width(width).height(height);
};
       const currentDate = () => {
    return Date.now();
};
       const consolePrint = (...txt) => {
    // might work only in Chrome or if some development add-ons are installed
    console.log(...txt);
};
const GQG_IN_MYPROGRAM_MSG = 'in "myprogram.ts"- ';
const GQG_ERROR_IN_MYPROGRAM_MSG = "Error " + GQG_IN_MYPROGRAM_MSG;
const GQG_WARNING_IN_MYPROGRAM_MSG = 'Warning ' + GQG_IN_MYPROGRAM_MSG;
const printErrorToConsoleOnce = (() => {
    var throwConsoleError_printed = {};
    return (msg) => {
        // Firefox wouldn't print uncaught exceptions with file name/line number
        // but adding "new Error()" to the throw below fixed it...
        if (!throwConsoleError_printed[msg]) {
            console.error("Error: " + msg);
            throwConsoleError_printed[msg] = true;
        }
    };
})();
const throwConsoleErrorInMyprogram = (msg) => {
    // Firefox wouldn't print uncaught exceptions with file name/line number
    // but adding "new Error()" to the throw below fixed it...
    throw new Error(GQG_IN_MYPROGRAM_MSG + msg);
};
const throwIfSpriteNameInvalid = (spriteName) => {
    if (typeof spriteName !== "string") {
        throwConsoleErrorInMyprogram("Sprite name must be a String, not: " + spriteName);
    }
    else if (!spriteExists(spriteName)) {
        throwConsoleErrorInMyprogram("Sprite doesn't exist: " + spriteName);
    }
};
Number.isFinite = Number.isFinite || function (value) {
    // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
    return typeof value === 'number' && isFinite(value);
};
const throwIfNotFiniteNumber = (msg, val) => {
    if (!Number.isFinite(val)) {
        msg = msg || "Expected a number.";
        msg += " You used";
        if (typeof val === "string") {
            msg += " the String: \"" + val + "\"";
        }
        else {
            msg += ": " + val;
        }
        throwConsoleErrorInMyprogram(msg);
    }
};
       const throwOnImgLoadError = (imgUrl) => {
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
       const newGQAnimation = (() => {
    let memoAnims = new Map();
    return function (urlOrMap, numberOfFrame, delta, rate, type) {
        if (GQG_DEBUG) {
            if (arguments.length === 5) {
                if (typeof (urlOrMap) !== "string") {
                    throwConsoleErrorInMyprogram("First argument for newGQAnimation must be a String. Instead found: " + urlOrMap);
                }
                if (typeof urlOrMap === "string")
                    throwOnImgLoadError(urlOrMap);
                throwIfNotFiniteNumber("Number of frame argument for newGQAnimation must be numeric. ", numberOfFrame);
                throwIfNotFiniteNumber("Delta argument for newGQAnimation must be numeric. ", delta);
                throwIfNotFiniteNumber("Rate argument for newGQAnimation must be numeric. ", rate);
                if (type != null && (type & ANIMATION_VERTICAL) && (type & ANIMATION_HORIZONTAL)) {
                    throwConsoleErrorInMyprogram("Type argument for newGQAnimation cannot be both ANIMATION_VERTICAL and ANIMATION_HORIZONTAL - use one or the other but not both!");
                }
                else if (type != null && !(type & ANIMATION_VERTICAL) && !(type & ANIMATION_HORIZONTAL)) {
                    throwConsoleErrorInMyprogram("Type argument for newGQAnimation is missing both ANIMATION_VERTICAL and ANIMATION_HORIZONTAL - must use one or the other!");
                }
            }
            else if (arguments.length === 1) {
                if (typeof (urlOrMap) === "string") {
                    throwOnImgLoadError(urlOrMap);
                } // else hope it's a proper options map to pass on to GameQuery directly
            }
            else {
                throwConsoleErrorInMyprogram("Wrong number of arguments used for newGQAnimation. Check API documentation for details of parameters.");
            }
        }
        if (arguments.length === 5) {
            let key = [urlOrMap, numberOfFrame, delta, rate, type];
            let multiframeAnim = memoAnims.get(key);
            if (multiframeAnim != null) {
                return multiframeAnim;
            }
            else {
                let multiframeAnim = new $.gQ.Animation({
                    imageURL: urlOrMap,
                    numberOfFrame: numberOfFrame,
                    delta: delta,
                    rate: rate,
                    type: type
                });
                memoAnims.set(key, multiframeAnim);
                return multiframeAnim;
            }
        }
        else if (arguments.length === 1) {
            let singleframeAnim = memoAnims.get(urlOrMap);
            if (singleframeAnim != null) {
                return singleframeAnim;
            }
            else {
                let singleframeAnim;
                if (typeof (urlOrMap) === "string") {
                    singleframeAnim = new $.gQ.Animation({ imageURL: urlOrMap });
                }
                else {
                    singleframeAnim = new $.gQ.Animation(urlOrMap);
                }
                memoAnims.set(urlOrMap, singleframeAnim);
                return singleframeAnim;
            }
        }
        else {
            throwConsoleErrorInMyprogram("Wrong number of arguments used for newGQAnimation. Check API documentation for details of parameters.");
            return new $.gQ.Animation({ imageURL: "" });
        }
    };
})();
       const createGroupInPlayground = function (groupName, theWidth, theHeight, thePosx, thePosy) {
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
        }
        else if (arguments.length === 5) {
            throwIfNotFiniteNumber("Width argument for createGroupInPlayground must be numeric. ", theWidth);
            throwIfNotFiniteNumber("Height argument for createGroupInPlayground must be numeric. ", theHeight);
            throwIfNotFiniteNumber("X location argument for createGroupInPlayground must be numeric. ", thePosx);
            throwIfNotFiniteNumber("Y location argument for createGroupInPlayground must be numeric. ", thePosy);
        }
        else if (arguments.length === 2) { // treats arguments[1] as a standard options map
            if (typeof arguments[1] !== "object") {
                throwConsoleErrorInMyprogram("Second argument for createGroupInPlayground expected to be a dictionary. Instead found: " + arguments[1]);
            } // else hope it's a proper standard options map
        }
        else if (arguments.length !== 1) {
            throwConsoleErrorInMyprogram("Wrong number of arguments used for createGroupInPlayground. Check API documentation for details of parameters.");
        }
    }
    if (arguments.length === 1) {
        $.playground().addGroup(groupName, { width: $.playground().width(), height: $.playground().height() });
    }
    else if (arguments.length === 3) {
        if (typeof theWidth !== "number") {
            throwConsoleErrorInMyprogram("theWidth must be a number but instead got: " + theWidth);
        }
        $.playground().addGroup(groupName, { width: theWidth, height: theHeight });
    }
    else if (arguments.length === 5) {
        if (typeof theWidth !== "number") {
            throwConsoleErrorInMyprogram("theWidth must be a number but instead got: " + theWidth);
        }
        $.playground().addGroup(groupName, { width: theWidth, height: theHeight, posx: thePosx, posy: thePosy });
    }
    else if (arguments.length === 2) { // treats arguments[1] as a standard options map
        if (typeof theWidth !== "object") {
            throwConsoleErrorInMyprogram("Second argument must be a number but instead got: " + theWidth);
        }
        $.playground().addGroup(groupName, arguments[1]);
    }
};
       const createSpriteInGroup = function (groupName, spriteName, theAnimation, theWidth, theHeight, thePosx, thePosy) {
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
        }
        else if (arguments.length === 3) {
            if (typeof arguments[2] !== "object") {
                throwConsoleErrorInMyprogram("Third argument for createSpriteInGroup expected to be a dictionary. Instead found: " + arguments[2]);
            }
            else if (theAnimation instanceof Object && (!("imageURL" in theAnimation) || typeof (theAnimation["imageURL"]) !== "string")) {
                throwConsoleErrorInMyprogram("Third argument for createSpriteInGroup expected to be a dictionary. Instead found this animation: " + theAnimation + ". Maybe wrong number of arguments provided? Check API documentation for details of parameters.");
            } // else hope it's a proper standard options map
        }
        else {
            throwConsoleErrorInMyprogram("Wrong number of arguments used for createSpriteInGroup. Check API documentation for details of parameters.");
        }
    }
    if (arguments.length === 5) {
        $("#" + groupName).addSprite(spriteName, { animation: theAnimation, width: theWidth, height: theHeight });
    }
    else if (arguments.length === 7) {
        $("#" + groupName).addSprite(spriteName, {
            animation: theAnimation,
            width: theWidth,
            height: theHeight,
            posx: thePosx,
            posy: thePosy
        });
    }
    else if (arguments.length === 3) { // treats arguments[2] as a standard options map
        $("#" + groupName).addSprite(spriteName, arguments[2]);
    }
};
       const createTextSpriteInGroup = function (groupName, spriteName, theWidth, theHeight, thePosx, thePosy) {
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
        }
        else {
            throwConsoleErrorInMyprogram("Wrong number of arguments used for createTextSpriteInGroup. Check API documentation for details of parameters.");
        }
    }
    if (arguments.length === 4) {
        $("#" + groupName).addSprite(spriteName, {
            width: theWidth,
            height: theHeight
        });
    }
    else if (arguments.length === 6) {
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
const textInputSpriteTextAreaId = (spriteName) => {
    return spriteName + "-textarea";
};
const textInputSpriteSubmitButtonId = (spriteName) => {
    return spriteName + "-button";
};
const textInputSpriteGQG_SIGNALS_Id = (spriteName) => {
    return spriteName + "-submitted";
};
       const createTextInputSpriteInGroup = function (groupName, spriteName, theWidth, theHeight, rows, cols, thePosx, thePosy, submitHandler) {
    if (arguments.length === 6) {
        createTextSpriteInGroup(groupName, spriteName, theWidth, theHeight);
    }
    else if ((arguments.length === 8 || arguments.length === 9) && thePosx &&
        thePosy) {
        createTextSpriteInGroup(groupName, spriteName, theWidth, theHeight, thePosx, thePosy);
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
    }
    else {
        textInputSpriteSetHandler(spriteName);
    }
};
       const textInputSpriteSetHandler = function (spriteName, submitHandler) {
    var realSubmitHandler;
    if (arguments.length === 2) {
        realSubmitHandler = function () {
            if (submitHandler)
                submitHandler(textInputSpriteString(spriteName));
            GQG_SIGNALS[textInputSpriteGQG_SIGNALS_Id(spriteName)] = true;
        };
    }
    else {
        realSubmitHandler = function () {
            GQG_SIGNALS[textInputSpriteGQG_SIGNALS_Id(spriteName)] = true;
        };
    }
    $("#" + textInputSpriteSubmitButtonId(spriteName)).click(realSubmitHandler);
};
       const textInputSpriteString = (spriteName) => {
    return String($("#" + textInputSpriteTextAreaId(spriteName))[0].value);
};
       const textInputSpriteSetString = (spriteName, str) => {
    $("#" + textInputSpriteTextAreaId(spriteName))[0].value = str;
};
       const textInputSpriteReset = function (spriteName, textPrompt) {
    if (arguments.length === 1) {
        textInputSpriteSetString(spriteName, "");
    }
    else if (arguments.length === 2 && textPrompt) {
        textInputSpriteSetString(spriteName, textPrompt);
    }
    GQG_SIGNALS[textInputSpriteGQG_SIGNALS_Id(spriteName)] = false;
};
       const textInputSpriteSubmitted = (spriteName) => {
    if (GQG_SIGNALS[textInputSpriteGQG_SIGNALS_Id(spriteName)] === true) {
        return true;
    }
    return false;
};
       const removeSprite = (spriteNameOrObj) => {
    if (typeof (spriteNameOrObj) !== "object") {
        if (GQG_DEBUG) {
            throwIfSpriteNameInvalid(spriteNameOrObj);
        }
        ;
        $("#" + spriteNameOrObj).remove();
    }
    else {
        $(spriteNameOrObj).remove();
    }
};
       const sprite = (spriteName) => {
    return $("#" + spriteName);
};
       const spriteExists = (spriteName) => {
    return (spriteName == $("#" + spriteName).attr("id")); // spriteName could be given as an int by a student
};
       const spriteObject = (spriteNameOrObj) => {
    if (typeof (spriteNameOrObj) !== "object") {
        return $("#" + spriteNameOrObj);
    }
    else {
        return $(spriteNameOrObj);
    }
};
       const spriteId = (spriteNameOrObj) => {
    if (typeof (spriteNameOrObj) !== "object") {
        return String($("#" + spriteNameOrObj).attr("id"));
    }
    else {
        return String($(spriteNameOrObj).attr("id"));
    }
};
       const spriteGetX = (spriteName) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
    }
    ;
    return $("#" + spriteName).x();
};
       const spriteGetY = (spriteName) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
    }
    ;
    return $("#" + spriteName).y();
};
       const spriteGetZ = (spriteName) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
    }
    ;
    return $("#" + spriteName).z();
};
       const spriteSetX = (spriteName, xval) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("X location must be a number.", xval);
    }
    ;
    $("#" + spriteName).x(xval);
};
       const spriteSetY = (spriteName, yval) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Y location must be a number.", yval);
    }
    ;
    $("#" + spriteName).y(yval);
};
       const spriteSetZ = (spriteName, zval) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Z location must be a number.", zval);
    }
    ;
    $("#" + spriteName).z(zval);
};
       const spriteSetXY = (spriteName, xval, yval) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("X location must be a number.", xval);
        throwIfNotFiniteNumber("Y location must be a number.", yval);
    }
    ;
    $("#" + spriteName).xy(xval, yval);
};
       const spriteSetXYZ = (spriteName, xval, yval, zval) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("X location must be a number.", xval);
        throwIfNotFiniteNumber("Y location must be a number.", yval);
        throwIfNotFiniteNumber("Z location must be a number.", zval);
    }
    ;
    $("#" + spriteName).xyz(xval, yval, zval);
};
       const spriteGetWidth = (spriteName) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        // 
        // const tMatrixStr = $("#" + spriteName).css("transform");
        // const tMatArr = tMatrixStr.substring(tMatrixStr.indexOf("(") + 1, tMatrixStr.length - 1).split(", ");
        // if (!(tMatArr[0] === 1 && tMatArr[1] === 0 && tMatArr[2] === 0 && tMatArr[3] === 1)){
        //     console.log(GQG_WARNING_IN_MYPROGRAM_MSG
        //         + "sprite graphic scaled or transformed- spriteGetWidth possibly wrong for sprite: "
        //         + spriteName
        //         + ".  You should use the width in the sprite dictionaries whenever possible instead.");
        // }
    }
    ;
    return $("#" + spriteName).w();
};
       const spriteGetHeight = (spriteName) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        //       
        // const tMatrixStr = $("#" + spriteName).css("transform");
        // const tMatArr = tMatrixStr.substring(tMatrixStr.indexOf("(") + 1, tMatrixStr.length - 1).split(", ");
        // if (!(tMatArr[0] === 1 && tMatArr[1] === 0 && tMatArr[2] === 0 && tMatArr[3] === 1)){
        //     console.log(GQG_WARNING_IN_MYPROGRAM_MSG
        //         + "sprite graphic scaled or transformed- spriteGetHeight possibly wrong for sprite: "
        //         + spriteName
        //         + ".  You should use the height in the sprite dictionaries whenever possible instead.");
        // } 
    }
    ;
    return $("#" + spriteName).h();
};
       const spriteSetWidth = (spriteName, wval) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Width must be a number.", wval);
    }
    $("#" + spriteName).w(wval);
};
       const spriteSetHeight = (spriteName, hval) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Height must be a number.", hval);
    }
    $("#" + spriteName).h(hval);
};
       const spriteSetWidthHeight = (spriteName, wval, hval) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Width must be a number.", wval);
        throwIfNotFiniteNumber("Height must be a number.", hval);
    }
    $("#" + spriteName).wh(wval, hval);
};
       const spriteRotate = (spriteName, angleDegrees) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Angle must be a number.", angleDegrees);
    }
    $("#" + spriteName).rotate(angleDegrees);
};
const GQG_SPRITES_PROPS = {};
       const spriteScale = (spriteName, ratio) => {
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
//$("#" + spriteName).css("background-size", "150px 150px"); // width height --- but need to store original size!!!
// or maybe just abandon this fn - make it print it's broken
// write a new fn:   spriteScaleWidthHeight that
// transform-origin top left
// background-size set to given width height (then don't need to store original, that's the user's job lol)
// also spriteSetWidth/Height to that given
// or make this a polymorphic fn?
       const spriteSetAnimation = function (spriteNameOrObj, aGQAnimation, callbackFunction) {
    if (arguments.length === 2 && aGQAnimation != null) {
        spriteObject(spriteNameOrObj).setAnimation(aGQAnimation);
    }
    else if (arguments.length === 3 && aGQAnimation != null && typeof callbackFunction === "function") {
        spriteObject(spriteNameOrObj).setAnimation(aGQAnimation, callbackFunction);
    }
    else if (arguments.length === 1) {
        spriteObject(spriteNameOrObj).setAnimation();
    }
};
       const spritePauseAnimation = (spriteName) => {
    $("#" + spriteName).pauseAnimation();
};
       const spriteResumeAnimation = (spriteName) => {
    $("#" + spriteName).resumeAnimation();
};
const jqDivsHit = function (div1, div2) {
    const d1Left = div1.offset().left;
    const d1Right = d1Left + div1.outerWidth(true);
    const d1Top = div1.offset().top;
    const d1Bottom = d1Top + div1.outerHeight(true);
    const d2Left = div2.offset().left;
    const d2Right = d2Left + div2.outerWidth(true);
    const d2Top = div2.offset().top;
    const d2Bottom = d2Top + div2.outerHeight(true);
    return !(d1Bottom < d2Top || d1Top > d2Bottom || d1Right < d2Left || d1Left > d2Right);
};
const divsHit = function (div1, div2) {
    const r1 = div1.getBoundingClientRect();
    const r2 = div2.getBoundingClientRect();
    return !(r1.bottom < r2.top || r1.top > r2.bottom || r1.right < r2.left || r1.left > r2.right);
};
       const forEachSpriteSpriteCollisionDo = (sprite1Name, sprite2Name, collisionHandlingFunction) => {
    $(spriteFilterHitAxisAlignedRect(sprite1Name, ".gQ_group, #" + sprite2Name)).each(collisionHandlingFunction);
    // collisionHandlingFunction can optionally take two arguments: collIndex, hitSprite
    // see http://api.jquery.com/jQuery.each
};
       const forEach2SpritesHit = (() => {
    var printed = false;
    return (sprite1Name, sprite2Name, collisionHandlingFunction) => {
        if (!printed) {
            printed = true;
            throwConsoleErrorInMyprogram("Deprecated function used: forEach2SpritesHit.  Use when2SpritesHit instead for better performance.");
        }
        forEachSpriteSpriteCollisionDo(sprite1Name, sprite2Name, collisionHandlingFunction);
    };
})();
       const when2SpritesHit = forEachSpriteSpriteCollisionDo; // NEW
       const forEachSpriteGroupCollisionDo = (sprite1Name, groupName, collisionHandlingFunction) => {
    $(spriteFilterHitAxisAlignedRect(sprite1Name, "#" + groupName + ", .gQ_sprite")).each(collisionHandlingFunction);
    // collisionHandlingFunction can optionally take two arguments: collIndex, hitSprite
    // see http://api.jquery.com/jQuery.each
};
       const forEachSpriteGroupHit = forEachSpriteGroupCollisionDo;
       const forEachSpriteFilteredCollisionDo = (sprite1Name, filterStr, collisionHandlingFunction) => {
    $(spriteFilterHitAxisAlignedRect(sprite1Name, filterStr)).each(collisionHandlingFunction);
    // see http://gamequeryjs.com/documentation/api/#collision for filterStr spec
    // collisionHandlingFunction can optionally take two arguments: collIndex, hitSprite
    // see http://api.jquery.com/jQuery.each
};
       const forEachSpriteFilteredHit = forEachSpriteFilteredCollisionDo;
const spriteFilterHitAxisAlignedRect = function (sprite1Name, filterStr) {
    // Fixes GQ's collision function, because GQ's collide function is badly broken when sprites are rotated/scaled
    // The fix is to check collision using axis aligned rectangular hit boxes.
    // Not great for rotated sprites, but good enough for now.
    const s1 = $("#" + sprite1Name);
    const filter = filterStr;
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
                        // Check real collision
                        if (divsHit(s1[0], elementToCheck)) {
                            //if (collide(gameQuery, { x: offsetX, y: offsetY }, elementToCheck.gameQuery, { x: elementsToCheck[i].offsetX, y: elementsToCheck[i].offsetY })) {
                            // GQ's collide is very broken if rotation applied
                            // Add to the result list if collision detected
                            resultList.push(elementsToCheck[i][subLen]);
                        }
                        //}
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
       const spriteHitDirection = (sprite1Id, sprite1X, sprite1Y, sprite1XSpeed, sprite1YSpeed, sprite1Width, sprite1Height, sprite2Id, sprite2X, sprite2Y, sprite2XSpeed, sprite2YSpeed, sprite2Width, sprite2Height) => {
    var sprite1Info = {
        "id": sprite1Id,
        "xPos": sprite1X,
        "yPos": sprite1Y,
        "xSpeed": sprite1XSpeed,
        "ySpeed": sprite1YSpeed,
        "height": sprite1Height,
        "width": sprite1Width
    };
    var sprite2Info = {
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
const spritesSpeedSamples = {};
const checkSpriteSpeedUsageCommonErrors = (spriteInfo) => {
    // A heuristic check for common errors from learners.
    // Check if sprite speeds ever change.  If not, probably doing it wrong.
    if (!spritesSpeedSamples[spriteInfo["id"]]) {
        spritesSpeedSamples[spriteInfo["id"]] = {
            sampleSize: 0,
            xSpeedSamples: [],
            ySpeedSamples: [],
            checked: false
        };
    }
    else {
        const sprite1Sampling = spritesSpeedSamples[spriteInfo["id"]];
        const maxSampleSize = 10;
        if (sprite1Sampling.sampleSize < maxSampleSize) {
            ++sprite1Sampling.sampleSize;
            sprite1Sampling.xSpeedSamples.push(spriteInfo["xSpeed"]);
            sprite1Sampling.ySpeedSamples.push(spriteInfo["ySpeed"]);
        }
        else if (!sprite1Sampling.checked) {
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
       const spriteHitDir = (sprite1Info, sprite2Info) => {
    if (GQG_DEBUG) {
        checkSpriteSpeedUsageCommonErrors(sprite1Info);
        checkSpriteSpeedUsageCommonErrors(sprite2Info);
    }
    return spriteHitDirImpl(sprite1Info, sprite2Info);
};
const spriteHitDirImpl = (sprite1Info, sprite2Info) => {
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
    var dir = {
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
       const getKeyState = (key) => {
    return !!$.gQ.keyTracker[key];
};
       const getMouseX = () => {
    return $.gQ.mouseTracker.x;
};
       const getMouseY = () => {
    return $.gQ.mouseTracker.y;
};
       const getMouseButton1 = () => {
    return !!$.gQ.mouseTracker[1];
};
       const getMouseButton2 = () => {
    return !!$.gQ.mouseTracker[2];
};
       const getMouseButton3 = () => {
    return !!$.gQ.mouseTracker[3];
};
       const disableContextMenu = () => {
    // see also: https://stackoverflow.com/questions/4920221/jquery-js-prevent-right-click-menu-in-browsers
    // $("#playground").contextmenu(function(){return false;});
    $("#playground").on("contextmenu", function () {
        return false;
    });
};
       const enableContextMenu = () => {
    // see also: https://stackoverflow.com/questions/4920221/jquery-js-prevent-right-click-menu-in-browsers
    $("#playground").off("contextmenu");
};
       const hideMouseCursor = () => {
    $("#playground").css("cursor", "none");
};
       const showMouseCursor = () => {
    $("#playground").css("cursor", "default");
};
       const saveDictionaryAs = (saveAs, dictionary) => {
    // requires js-cookie: https://github.com/js-cookie/js-cookie/tree/v2.0.4
    Cookies.set("GQG_" + saveAs, dictionary);
};
       const getSavedDictionary = (savedAs) => {
    return Cookies.getJSON("GQG_" + savedAs);
};
       const deleteSavedDictionary = (savedAs) => {
    Cookies.remove("GQG_" + savedAs);
};
       const createOvalInGroup = (groupName, id, x, y, w, h, color, rotdeg, rotOriginX, rotOriginY) => {
    // rotdeg in degrees clockwise on screen (recall y-axis points downwards!)
    if (!color) {
        color = "gray";
    }
    if (!groupName) {
        $.playground().addSprite(id, { width: 1, height: 1 });
    }
    else {
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
       const createOval = (id, x, y, w, h, color, rotdeg, rotOriginX, rotOriginY) => {
    createOvalInGroup(null, id, x, y, w, h, color, rotdeg, rotOriginX, rotOriginY);
};
       const drawOval = (x, y, w, h, color, rotdeg, rotOriginX, rotOriginY) => {
    createOval("GQG_oval_" + GQG_getUniqueId(), x, y, w, h, color, rotdeg, rotOriginX, rotOriginY);
};
       const createCircleInGroup = (groupName, id, x, y, r, color, rotdeg, rotOriginX, rotOriginY) => {
    createOvalInGroup(groupName, id, x, y, r, r, color, rotdeg, rotOriginX, rotOriginY);
};
       const createCircle = (id, x, y, r, color, rotdeg, rotOriginX, rotOriginY) => {
    createCircleInGroup(null, id, x, y, r, color, rotdeg, rotOriginX, rotOriginY);
};
       const drawCircle = (x, y, r, color, rotdeg, rotOriginX, rotOriginY) => {
    createCircle("GQG_circle_" + GQG_getUniqueId(), x, y, r, color, rotdeg, rotOriginX, rotOriginY);
};
       const createRectInGroup = (groupName, id, x, y, w, h, color, rotdeg, rotOriginX, rotOriginY) => {
    // rotdeg in degrees clockwise on screen (recall y-axis points downwards!)
    // rotOrigin{X,Y} must be within range of wide w and height h, and relative to coordinate (x,y).
    if (!color) {
        color = "gray";
    }
    if (!groupName) {
        $.playground().addSprite(id, { width: 1, height: 1 });
    }
    else {
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
       const createRect = (id, x, y, w, h, color, rotdeg, rotOriginX, rotOriginY) => {
    createRectInGroup(null, id, x, y, w, h, color, rotdeg, rotOriginX, rotOriginY);
};
       const drawRect = (x, y, w, h, color, rotdeg, rotOriginX, rotOriginY) => {
    createRect("GQG_rect_" + GQG_getUniqueId(), x, y, w, h, color, rotdeg, rotOriginX, rotOriginY);
};
       const createLineInGroup = (groupName, id, x1, y1, x2, y2, color, thickness) => {
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
    createRectInGroup(groupName, id, x1, drawY1, dist, thickness, color, rotdeg, 0, halfThick);
};
       const createLine = (id, x1, y1, x2, y2, color, thickness) => {
    createLineInGroup(null, id, x1, y1, x2, y2, color, thickness);
};
       const drawLine = (x1, y1, x2, y2, color, thickness) => {
    createLine("GQG_line_" + GQG_getUniqueId(), x1, y1, x2, y2, color, thickness);
};
       const createContainerIterator = function (f, start, end, stepsize) {
    if (arguments.length === 1 && typeof f === "object") {
        const fOwnPropNames = Object.getOwnPropertyNames(f);
        const it = {
            current: 0,
            end: fOwnPropNames.length,
            _keys: fOwnPropNames,
            next: function () {
                const itemIdx = this._keys[this.current];
                const item = [Number(itemIdx), f[itemIdx]];
                this.current++;
                return item;
            },
            hasNext: function () {
                return (this.current < this.end);
            }
        };
        return it;
    }
    else {
        throwIfNotFiniteNumber("start must be a number.", start);
        throwIfNotFiniteNumber("end must be a number.", end);
        throwIfNotFiniteNumber("stepsize must be a number.", stepsize);
        if (start == null || end == null || stepsize == null) {
            throw "TS type hint";
        }
        const fx = (typeof f === "function"
            ? f
            : (x) => {
                return Number(f[x]);
            });
        const it = {
            next: function () {
                const item = [this.current, fx(this.current)];
                this.current += stepsize;
                return item;
            },
            hasNext: function () {
                return (this.current < this.end);
            },
            current: start,
            end: end,
            _keys: typeof f !== "function" ? Object.getOwnPropertyNames(f) : (() => {
                let k = [];
                for (let i = start; i < end; i += stepsize) {
                    k.push(String(i));
                }
                return k;
            })()
        };
        return it;
    }
};
       const createGraphWithOptions = function (groupName, id, f, moreOpts) {
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
    let iter;
    if (arguments.length >= 4 && arguments.length <= 6 &&
        "object" === typeof (f)) {
        color = arguments[4];
        radius_thickness = arguments[5];
        iter = createContainerIterator(f);
    }
    else if (arguments.length >= 7 && arguments.length <= 9) {
        var start = arguments[4];
        var end = arguments[5];
        var stepsize = arguments[6];
        color = arguments[7];
        radius_thickness = arguments[8];
        iter = createContainerIterator(f, start, end, stepsize);
    }
    else {
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
        }
        else if (fxi === -Infinity) {
            fxi = GQG_MIN_SAFE_PLAYGROUND_INTEGER;
        }
        if (currY === null && fxi != undefined) {
            currX = i;
            currY = fxi;
            if (!interpolated) {
                createCircleInGroup(group_id["group"], group_id["id"] + "_graph_pt_" + i, i, fxi, radius_thickness, color);
            }
        }
        else if (fxi != undefined) {
            if (!interpolated) {
                createCircleInGroup(group_id["group"], group_id["id"] + "_graph_pt_" + i, i, fxi, radius_thickness, color);
            }
            else {
                createLineInGroup(group_id["group"], group_id["id"] + "_graph_line_" + currX + "-" + i, currX, currY, i, fxi, color, radius_thickness);
            }
            currX = i;
            currY = fxi;
        }
    }
    return group_id;
};
       const createGraphInGroup = function (groupName, id, f) {
    // fn signature: (groupName, id, f, start, end, stepsize, color, dotRadius)
    // fn signature: (groupName, id, f, start, end, stepsize, color)
    // fn signature: (groupName, id, f, start, end, stepsize)
    // fn signature: (groupName, id, f, color, dotRadius)
    // fn signature: (groupName, id, f, color)
    // fn signature: (groupName, id, f)
    var args = Array.prototype.slice.call(arguments);
    args.splice(3, 0, { "interpolated": false });
    return createGraphWithOptions.apply(this, args);
};
       const createGraph = function () {
    // fn signature: (id, f, start, end, stepsize, color, dotRadius)
    // fn signature: (id, f, start, end, stepsize, color)
    // fn signature: (id, f, start, end, stepsize)
    // fn signature: (id, f, color, dotRadius)
    // fn signature: (id, f, color)
    // fn signature: (id, f)
    var opts = Array.prototype.slice.call(arguments);
    opts.splice(0, 0, null);
    opts.splice(3, 0, { "interpolated": false });
    return createGraphWithOptions.apply(this, opts);
};
       const drawGraph = function drawGraph() {
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
    return createGraphWithOptions.apply(this, opts);
};
       const createInterpolatedGraphInGroup = function (groupName, id, f) {
    // fn signature: (groupName, id, f, start, end, stepsize, color, thickness)
    // fn signature: (groupName, id, f, start, end, stepsize, color)
    // fn signature: (groupName, id, f, start, end, stepsize)
    // fn signature: (groupName, id, f, color, thickness)
    // fn signature: (groupName, id, f, color)
    // fn signature: (groupName, id, f)
    var args = Array.prototype.slice.call(arguments);
    args.splice(3, 0, { "interpolated": true });
    return createGraphWithOptions.apply(this, args);
};
       const createInterpolatedGraph = function () {
    // fn signature: (id, f, start, end, stepsize, color, thickness)
    // fn signature: (id, f, start, end, stepsize, color)
    // fn signature: (id, f, start, end, stepsize)
    // fn signature: (id, f, color, thickness)
    // fn signature: (id, f, color)
    // fn signature: (id, f)
    var opts = Array.prototype.slice.call(arguments);
    opts.splice(0, 0, null);
    opts.splice(3, 0, { "interpolated": true });
    return createGraphWithOptions.apply(this, opts);
    // return createInterpolatedGraphInGroup.apply(this, opts);
};
       const drawInterpolatedGraph = function () {
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
    return createGraphWithOptions.apply(this, opts);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3FnLW1vZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9jaGVuZy9EZXNrdG9wL1RTLWRldi9mdW4tdHNkLWxpYi5naXRyZXBvL2xpYi1ncWd1YXJkcmFpbC9zcmMvZ3FnLW1vZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUE4QmIsa0RBQWtEO0FBQ2xELElBQUksU0FBUyxHQUFZLElBQUksQ0FBQztBQUM5QixNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsQ0FBQyxLQUFjLEVBQVEsRUFBRTtJQUNuRCxJQUFJLEtBQUssRUFBRTtRQUNQLFNBQVMsR0FBRyxJQUFJLENBQUM7S0FDcEI7U0FBTTtRQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEdBQUcsa0VBQWtFLENBQUMsQ0FBQztRQUMvRyxTQUFTLEdBQUcsS0FBSyxDQUFDO0tBQ3JCO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsTUFBTSxrQ0FBa0MsR0FBRyw2QkFBNkIsQ0FBQztBQUN6RSxNQUFNLENBQUMsTUFBTSw0QkFBNEIsR0FBRyxDQUN4QyxpQkFBa0MsRUFDM0IsRUFBRTtJQUNULElBQUksT0FBTyxpQkFBaUIsS0FBSyxRQUFRO1FBQ3JDLE9BQU8saUJBQWlCLEtBQUssUUFBUSxFQUFFO1FBQ3ZDLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBQ0QsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDakQsSUFBSSxXQUFXLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7SUFDOUUsV0FBVyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDMUIsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFFRCxPQUFPLENBQUMsaUJBQWlCLEtBQUssV0FB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MkQ7QUFDL0QsQ0FBQyxDQUFDO0FBd0NGLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUE0QjtJQUcxRCw0REFBNEQ7SUFDNUQsaURBQWlEO0lBQ2pELDBDQUEwQztJQUMxQyxzQ0FBc0M7SUFDdEMsMkJBQTJCO0lBQzNCLG9CQUFvQjtJQUNwQixJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM1QyxPQUFPLHNCQUFzQixDQUFDLEtBQUssQ0FDL0IsSUFBSSxFQUNKLElBQTBDLENBQzdDLENBQUM7QUFDTixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbi8qXG4gKiBDb3B5cmlnaHQgMjAxMiwgMjAxNiwgMjAxNywgMjAxOSwgMjAyMCBDYXJzb24gQ2hlbmdcbiAqIFRoaXMgU291cmNlIENvZGUgRm9ybSBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBvZiB0aGUgTW96aWxsYSBQdWJsaWNcbiAqIExpY2Vuc2UsIHYuIDIuMC4gSWYgYSBjb3B5IG9mIHRoZSBNUEwgd2FzIG5vdCBkaXN0cmlidXRlZCB3aXRoIHRoaXNcbiAqIGZpbGUsIFlvdSBjYW4gb2J0YWluIG9uZSBhdCBodHRwczovL21vemlsbGEub3JnL01QTC8yLjAvLlxuICovXG4vKlxuICogR1FHdWFyZHJhaWwgdjAuOC4wIGlzIGEgd3JhcHBlciBhcm91bmQgZ2FtZVF1ZXJ5IHJldi4gMC43LjEuXG4gKiBNYWtlcyB0aGluZ3MgbW9yZSBwcm9jZWR1cmFsLCB3aXRoIGEgYml0IG9mIGZ1bmN0aW9uYWwuXG4gKiBBZGRzIGluIGhlbHBmdWwgZXJyb3IgbWVzc2FnZXMgZm9yIHN0dWRlbnRzLlxuICogbG9hZCB0aGlzIGFmdGVyIGdhbWVRdWVyeS5cbiAqL1xuXG5leHBvcnQgdHlwZSBzcHJpdGVEb21PYmplY3QgPSB7XG4gICAgd2lkdGg6IChuOiBudW1iZXIpID0+IHNwcml0ZURvbU9iamVjdDtcbiAgICBoZWlnaHQ6IChuOiBudW1iZXIpID0+IHNwcml0ZURvbU9iamVjdDtcbiAgICBzZXRBbmltYXRpb246IChvPzogb2JqZWN0LCBmPzogRnVuY3Rpb24pID0+IGFueTtcbiAgICBjc3M6IChhdHRyOiBzdHJpbmcsIHZhbDogc3RyaW5nIHwgbnVtYmVyKSA9PiBzcHJpdGVEb21PYmplY3Q7XG4gICAgcGxheWdyb3VuZDogKG86IG9iamVjdCkgPT4gYW55O1xuICAgIGh0bWw6IChodG1sVGV4dDogc3RyaW5nKSA9PiBzcHJpdGVEb21PYmplY3Q7XG4gICAgdGV4dDogKHRleHQ6IHN0cmluZykgPT4gc3ByaXRlRG9tT2JqZWN0O1xufTtcbmRlY2xhcmUgdmFyICQ6IGFueTtcbmRlY2xhcmUgdmFyIENvb2tpZXM6IHtcbiAgICBzZXQ6IChhcmcwOiBzdHJpbmcsIGFyZzE6IG9iamVjdCkgPT4gdm9pZDtcbiAgICBnZXRKU09OOiAoYXJnMDogc3RyaW5nKSA9PiBvYmplY3Q7XG4gICAgcmVtb3ZlOiAoYXJnMDogc3RyaW5nKSA9PiB2b2lkO1xufTtcblxuLy8gc3R1ZGVudHMgYXJlIG5vdCBzdXBwb3NlZCB0byB1c2UgR1FHXyB2YXJpYWJsZXNcbmxldCBHUUdfREVCVUc6IGJvb2xlYW4gPSB0cnVlO1xuZXhwb3J0IGNvbnN0IHNldEdxRGVidWdGbGFnID0gKGRlYnVnOiBib29sZWFuKTogdm9pZCA9PiB7XG4gICAgaWYgKGRlYnVnKSB7XG4gICAgICAgIEdRR19ERUJVRyA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coR1FHX1dBUk5JTkdfSU5fTVlQUk9HUkFNX01TRyArIFwiZGVidWcgbW9kZSBkaXNhYmxlZCBhbmQgeW91ciBjb2RlIGlzIG5vdyBydW5uaW5nIGluIHVuc2FmZSBtb2RlLlwiKTtcbiAgICAgICAgR1FHX0RFQlVHID0gZmFsc2U7XG4gICAgfVxufTtcblxuY29uc3QgR1FHX1NQUklURV9HUk9VUF9OQU1FX0ZPUk1BVF9SRUdFWCA9IC9bYS16QS1aMC05X10rW2EtekEtWjAtOV8tXSovO1xuZXhwb3J0IGNvbnN0IHNwcml0ZUdyb3VwTmFtZUZvcm1hdElzVmFsaWQgPSAoXG4gICAgc3ByaXRlT3JHcm91cE5hbWU6IHN0cmluZyB8IG51bWJlclxuKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKHR5cGVvZiBzcHJpdGVPckdyb3VwTmFtZSAhPT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICB0eXBlb2Ygc3ByaXRlT3JHcm91cE5hbWUgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBzcHJpdGVPckdyb3VwTmFtZSA9IHNwcml0ZU9yR3JvdXBOYW1lLnRvU3RyaW5nKCk7XG4gICAgbGV0IG5hbWVNYXRjaGVzID0gc3ByaXRlT3JHcm91cE5hbWUubWF0Y2goR1FHX1NQUklURV9HUk9VUF9OQU1FX0ZPUk1BVF9SRUdFWCk7XG4gICAgbmFtZU1hdGNoZXMgPSAobmFtZU1hdGNoZXMgPyBuYW1lTWF0Y2hlcyA6IFtdKTtcbiAgICBpZiAobmFtZU1hdGNoZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gKHNwcml0ZU9yR3JvdXBOYW1lID09PSBuYW1lTWF0Y2hlc1swXSk7XG59O1xuXG5jb25zdCBHUUdfU0lHTkFMUzogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gPSB7fTtcbmxldCBHUUdfVU5JUVVFX0lEX0NPVU5URVIgPSAwO1xuXG5sZXQgR1FHX1BMQVlHUk9VTkRfV0lEVEggPSA2NDA7XG5sZXQgR1FHX1BMQVlHUk9VTkRfSEVJR0hUID0gNDgwO1xuZXhwb3J0IGxldCBQTEFZR1JPVU5EX1dJRFRIID0gR1FHX1BMQVlHUk9VTkRfV0lEVEg7IC8vIHN0dWRlbnRzIGFyZSBub3Qgc3VwcG9zZWQgdG8gdXNlIEdRR18gdmFyaWFibGVzXG5leHBvcnQgbGV0IFBMQVlHUk9VTkRfSEVJR0hUID0gR1FHX1BMQVlHUk9VTkRfSEVJR0hUO1xuXG5leHBvcnQgY29uc3QgQU5JTUFUSU9OX0hPUklaT05UQUw6IG51bWJlciA9ICQuZ1EuQU5JTUFUSU9OX0hPUklaT05UQUw7XG5leHBvcnQgY29uc3QgQU5JTUFUSU9OX1ZFUlRJQ0FMOiBudW1iZXIgPSAkLmdRLkFOSU1BVElPTl9WRVJUSUNBTDtcbmV4cG9ydCBjb25zdCBBTklNQVRJT05fT05DRTogbnVtYmVyID0gJC5nUS5BTklNQVRJT05fT05DRTtcbmV4cG9ydCBjb25zdCBBTklNQVRJT05fUElOR1BPTkc6IG51bWJlciA9ICQuZ1EuQU5JTUFUSU9OX1BJTkdQT05HO1xuZXhwb3J0IGNvbnN0IEFOSU1BVElPTl9DQUxMQkFDSzogbnVtYmVyID0gJC5nUS5BTklNQVRJT05fQ0FMTEJBQ0s7XG5leHBvcnQgY29uc3QgQU5JTUFUSU9OX01VTFRJOiBudW1iZXIgPSAkLmdRLkFOSU1BVElPTl9NVUxUSTtcblxuXG4vLyBNYXgvTWluIFNhZmUgUGxheWdyb3VuZCBJbnRlZ2VycyBmb3VuZCBieSBleHBlcmltZW50aW5nIHdpdGggR1EgMC43LjEgaW4gRmlyZWZveCA0MS4wLjIgb24gTWFjIE9TIFggMTAuMTAuNVxuY29uc3QgR1FHX01JTl9TQUZFX1BMQVlHUk9VTkRfSU5URUdFUiA9IC0oTWF0aC5wb3coMiwgMjQpIC0gMSk7IC8vIGNmLiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9OdW1iZXIvTUlOX1NBRkVfSU5URUdFUlxuY29uc3QgR1FHX01BWF9TQUZFX1BMQVlHUk9VTkRfSU5URUdFUiA9IChNYXRoLnBvdygyLCAyNCkgLSAxKTsgLy8gY2YuIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL051bWJlci9NQVhfU0FGRV9JTlRFR0VSXG5cblxuY29uc3QgR1FHX2dldFVuaXF1ZUlkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIERhdGUubm93KCkgKyBcIl9cIiArIEdRR19VTklRVUVfSURfQ09VTlRFUisrO1xufTtcblxuZXhwb3J0IGNvbnN0IHNldEdxUGxheWdyb3VuZERpbWVuc2lvbnMgPSAoXG4gICAgd2lkdGg6IG51bWJlcixcbiAgICBoZWlnaHQ6IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgLy8gdGhpcyBtdXN0IGJlIGV4ZWN1dGVkIG91dHNpZGUgb2Ygc2V0dXAgYW5kIGRyYXcgZnVuY3Rpb25zXG4gICAgR1FHX1BMQVlHUk9VTkRfSEVJR0hUID0gaGVpZ2h0O1xuICAgIFBMQVlHUk9VTkRfSEVJR0hUID0gaGVpZ2h0O1xuICAgIEdRR19QTEFZR1JPVU5EX1dJRFRIID0gd2lkdGg7XG4gICAgUExBWUdST1VORF9XSURUSCA9IHdpZHRoO1xuICAgIHNwcml0ZShcInBsYXlncm91bmRcIikud2lkdGgod2lkdGgpLmhlaWdodChoZWlnaHQpO1xufTtcblxuZXhwb3J0IGNvbnN0IGN1cnJlbnREYXRlID0gKCk6IG51bWJlciA9PiB7XG4gICAgcmV0dXJuIERhdGUubm93KCk7XG59O1xuXG5leHBvcnQgY29uc3QgY29uc29sZVByaW50ID0gKC4uLnR4dDogYW55KTogdm9pZCA9PiB7XG4gICAgLy8gbWlnaHQgd29yayBvbmx5IGluIENocm9tZSBvciBpZiBzb21lIGRldmVsb3BtZW50IGFkZC1vbnMgYXJlIGluc3RhbGxlZFxuICAgIGNvbnNvbGUubG9nKC4uLnR4dCk7XG59O1xuXG5cbmNvbnN0IEdRR19JTl9NWVBST0dSQU1fTVNHID0gJ2luIFwibXlwcm9ncmFtLnRzXCItICc7XG5jb25zdCBHUUdfRVJST1JfSU5fTVlQUk9HUkFNX01TRyA9IFwiRXJyb3IgXCIgKyBHUUdfSU5fTVlQUk9HUkFNX01TRztcbmNvbnN0IEdRR19XQVJOSU5HX0lOX01ZUFJPR1JBTV9NU0cgPSAnV2FybmluZyAnICsgR1FHX0lOX01ZUFJPR1JBTV9NU0c7XG5cbmNvbnN0IHByaW50RXJyb3JUb0NvbnNvbGVPbmNlID0gKCgpID0+IHtcbiAgICB2YXIgdGhyb3dDb25zb2xlRXJyb3JfcHJpbnRlZDogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gPSB7fTtcbiAgICByZXR1cm4gKG1zZzogc3RyaW5nKSA9PiB7XG4gICAgICAgIC8vIEZpcmVmb3ggd291bGRuJ3QgcHJpbnQgdW5jYXVnaHQgZXhjZXB0aW9ucyB3aXRoIGZpbGUgbmFtZS9saW5lIG51bWJlclxuICAgICAgICAvLyBidXQgYWRkaW5nIFwibmV3IEVycm9yKClcIiB0byB0aGUgdGhyb3cgYmVsb3cgZml4ZWQgaXQuLi5cbiAgICAgICAgaWYgKCF0aHJvd0NvbnNvbGVFcnJvcl9wcmludGVkW21zZ10pIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjogXCIgKyBtc2cpO1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JfcHJpbnRlZFttc2ddID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuY29uc3QgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbSA9IChtc2c6IHN0cmluZyk6IG5ldmVyID0+IHtcbiAgICAvLyBGaXJlZm94IHdvdWxkbid0IHByaW50IHVuY2F1Z2h0IGV4Y2VwdGlvbnMgd2l0aCBmaWxlIG5hbWUvbGluZSBudW1iZXJcbiAgICAvLyBidXQgYWRkaW5nIFwibmV3IEVycm9yKClcIiB0byB0aGUgdGhyb3cgYmVsb3cgZml4ZWQgaXQuLi5cbiAgICB0aHJvdyBuZXcgRXJyb3IoR1FHX0lOX01ZUFJPR1JBTV9NU0cgKyBtc2cpO1xufTtcblxuY29uc3QgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGlmICh0eXBlb2Ygc3ByaXRlTmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU3ByaXRlIG5hbWUgbXVzdCBiZSBhIFN0cmluZywgbm90OiBcIiArIHNwcml0ZU5hbWUpO1xuICAgIH0gZWxzZSBpZiAoIXNwcml0ZUV4aXN0cyhzcHJpdGVOYW1lKSkge1xuICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU3ByaXRlIGRvZXNuJ3QgZXhpc3Q6IFwiICsgc3ByaXRlTmFtZSk7XG4gICAgfVxufTtcbk51bWJlci5pc0Zpbml0ZSA9IE51bWJlci5pc0Zpbml0ZSB8fCBmdW5jdGlvbiAodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICAgIC8vIHNlZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTnVtYmVyL2lzRmluaXRlXG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUodmFsdWUpO1xufTtcbmNvbnN0IHRocm93SWZOb3RGaW5pdGVOdW1iZXIgPSAobXNnOiBzdHJpbmcsIHZhbDogYW55KTogdm9pZCA9PiB7IC8vIGUuZy4gdGhyb3cgaWYgTmFOLCBJbmZpbml0eSwgbnVsbFxuICAgIGlmICghTnVtYmVyLmlzRmluaXRlKHZhbCkpIHtcbiAgICAgICAgbXNnID0gbXNnIHx8IFwiRXhwZWN0ZWQgYSBudW1iZXIuXCI7XG4gICAgICAgIG1zZyArPSBcIiBZb3UgdXNlZFwiO1xuICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgbXNnICs9IFwiIHRoZSBTdHJpbmc6IFxcXCJcIiArIHZhbCArIFwiXFxcIlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbXNnICs9IFwiOiBcIiArIHZhbDtcbiAgICAgICAgfVxuICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKG1zZyk7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHRocm93T25JbWdMb2FkRXJyb3IgPSAoaW1nVXJsOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAvLyB3aGF0IHRoaXMgZnVuY3Rpb24gdGhyb3dzIG11c3Qgbm90IGJlIGNhdWdodCBieSBjYWxsZXIgdGhvLi4uXG4gICAgaWYgKGltZ1VybC5zdWJzdHJpbmcoaW1nVXJsLmxlbmd0aCAtIFwiLmdpZlwiLmxlbmd0aCkudG9Mb3dlckNhc2UoKSA9PT0gXCIuZ2lmXCIpIHtcbiAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcImltYWdlIGZpbGUgZm9ybWF0IG5vdCBzdXBwb3J0ZWQ6IEdJRlwiKTtcbiAgICB9XG4gICAgbGV0IHRocm93YWJsZUVyciA9IG5ldyBFcnJvcihcImltYWdlIGZpbGUgbm90IGZvdW5kOiBcIiArIGltZ1VybCk7XG4gICAgJChcIjxpbWcvPlwiKS5vbihcImVycm9yXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCEhdGhyb3dhYmxlRXJyICYmIHRocm93YWJsZUVyci5zdGFjayAmJlxuICAgICAgICAgICAgdGhyb3dhYmxlRXJyLnN0YWNrLnRvU3RyaW5nKCkuaW5kZXhPZihcIm15cHJvZ3JhbS5qc1wiKSA+PSAwKSB7XG4gICAgICAgICAgICB0aHJvd2FibGVFcnIubWVzc2FnZSA9IEdRR19FUlJPUl9JTl9NWVBST0dSQU1fTVNHICsgdGhyb3dhYmxlRXJyLm1lc3NhZ2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgdGhyb3dhYmxlRXJyO1xuICAgIH0pLmF0dHIoXCJzcmNcIiwgaW1nVXJsKTtcbn07XG5cblxuXG50eXBlIE5ld0dRQW5pbWF0aW9uRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICB1cmxPck1hcDogc3RyaW5nLFxuICAgICAgICBudW1iZXJPZkZyYW1lOiBudW1iZXIsXG4gICAgICAgIGRlbHRhOiBudW1iZXIsXG4gICAgICAgIHJhdGU6IG51bWJlcixcbiAgICAgICAgdHlwZTogbnVtYmVyXG4gICAgKTogU3ByaXRlQW5pbWF0aW9uO1xuICAgICh0aGlzOiB2b2lkLCB1cmxPck1hcDogc3RyaW5nKTogU3ByaXRlQW5pbWF0aW9uO1xuICAgICh0aGlzOiB2b2lkLCB1cmxPck1hcDogb2JqZWN0KTogU3ByaXRlQW5pbWF0aW9uO1xufTtcbmV4cG9ydCBjb25zdCBuZXdHUUFuaW1hdGlvbjogTmV3R1FBbmltYXRpb25GbiA9ICgoKSA9PiB7XG4gICAgbGV0IG1lbW9BbmltczogTWFwPHN0cmluZyB8IG9iamVjdCwgU3ByaXRlQW5pbWF0aW9uPiA9IG5ldyBNYXA8b2JqZWN0LCBTcHJpdGVBbmltYXRpb24+KCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgdXJsT3JNYXA6IHN0cmluZyB8IG9iamVjdCxcbiAgICAgICAgbnVtYmVyT2ZGcmFtZT86IG51bWJlcixcbiAgICAgICAgZGVsdGE/OiBudW1iZXIsXG4gICAgICAgIHJhdGU/OiBudW1iZXIsXG4gICAgICAgIHR5cGU/OiBudW1iZXJcbiAgICApOiBTcHJpdGVBbmltYXRpb24ge1xuICAgICAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHVybE9yTWFwKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiRmlyc3QgYXJndW1lbnQgZm9yIG5ld0dRQW5pbWF0aW9uIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgdXJsT3JNYXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHVybE9yTWFwID09PSBcInN0cmluZ1wiKSB0aHJvd09uSW1nTG9hZEVycm9yKHVybE9yTWFwKTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiTnVtYmVyIG9mIGZyYW1lIGFyZ3VtZW50IGZvciBuZXdHUUFuaW1hdGlvbiBtdXN0IGJlIG51bWVyaWMuIFwiLCBudW1iZXJPZkZyYW1lKTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiRGVsdGEgYXJndW1lbnQgZm9yIG5ld0dRQW5pbWF0aW9uIG11c3QgYmUgbnVtZXJpYy4gXCIsIGRlbHRhKTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiUmF0ZSBhcmd1bWVudCBmb3IgbmV3R1FBbmltYXRpb24gbXVzdCBiZSBudW1lcmljLiBcIiwgcmF0ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgIT0gbnVsbCAmJiAodHlwZSAmIEFOSU1BVElPTl9WRVJUSUNBTCkgJiYgKHR5cGUgJiBBTklNQVRJT05fSE9SSVpPTlRBTCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlR5cGUgYXJndW1lbnQgZm9yIG5ld0dRQW5pbWF0aW9uIGNhbm5vdCBiZSBib3RoIEFOSU1BVElPTl9WRVJUSUNBTCBhbmQgQU5JTUFUSU9OX0hPUklaT05UQUwgLSB1c2Ugb25lIG9yIHRoZSBvdGhlciBidXQgbm90IGJvdGghXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSAhPSBudWxsICYmICEodHlwZSAmIEFOSU1BVElPTl9WRVJUSUNBTCkgJiYgISh0eXBlICYgQU5JTUFUSU9OX0hPUklaT05UQUwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJUeXBlIGFyZ3VtZW50IGZvciBuZXdHUUFuaW1hdGlvbiBpcyBtaXNzaW5nIGJvdGggQU5JTUFUSU9OX1ZFUlRJQ0FMIGFuZCBBTklNQVRJT05fSE9SSVpPTlRBTCAtIG11c3QgdXNlIG9uZSBvciB0aGUgb3RoZXIhXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHVybE9yTWFwKSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvd09uSW1nTG9hZEVycm9yKHVybE9yTWFwKTtcbiAgICAgICAgICAgICAgICB9IC8vIGVsc2UgaG9wZSBpdCdzIGEgcHJvcGVyIG9wdGlvbnMgbWFwIHRvIHBhc3Mgb24gdG8gR2FtZVF1ZXJ5IGRpcmVjdGx5XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIHVzZWQgZm9yIG5ld0dRQW5pbWF0aW9uLiBDaGVjayBBUEkgZG9jdW1lbnRhdGlvbiBmb3IgZGV0YWlscyBvZiBwYXJhbWV0ZXJzLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDUpIHtcbiAgICAgICAgICAgIGxldCBrZXkgPSBbdXJsT3JNYXAsIG51bWJlck9mRnJhbWUsIGRlbHRhLCByYXRlLCB0eXBlXTtcbiAgICAgICAgICAgIGxldCBtdWx0aWZyYW1lQW5pbTogU3ByaXRlQW5pbWF0aW9uIHwgdW5kZWZpbmVkID0gbWVtb0FuaW1zLmdldChrZXkpO1xuICAgICAgICAgICAgaWYgKG11bHRpZnJhbWVBbmltICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbXVsdGlmcmFtZUFuaW07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBtdWx0aWZyYW1lQW5pbTogU3ByaXRlQW5pbWF0aW9uID0gbmV3ICQuZ1EuQW5pbWF0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VVUkw6IHVybE9yTWFwLFxuICAgICAgICAgICAgICAgICAgICBudW1iZXJPZkZyYW1lOiBudW1iZXJPZkZyYW1lLFxuICAgICAgICAgICAgICAgICAgICBkZWx0YTogZGVsdGEsXG4gICAgICAgICAgICAgICAgICAgIHJhdGU6IHJhdGUsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IHR5cGVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBtZW1vQW5pbXMuc2V0KGtleSwgbXVsdGlmcmFtZUFuaW0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBtdWx0aWZyYW1lQW5pbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBsZXQgc2luZ2xlZnJhbWVBbmltOiBTcHJpdGVBbmltYXRpb24gfCB1bmRlZmluZWQgPSBtZW1vQW5pbXMuZ2V0KHVybE9yTWFwKTtcbiAgICAgICAgICAgIGlmIChzaW5nbGVmcmFtZUFuaW0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzaW5nbGVmcmFtZUFuaW07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBzaW5nbGVmcmFtZUFuaW06IFNwcml0ZUFuaW1hdGlvbjtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mICh1cmxPck1hcCkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2luZ2xlZnJhbWVBbmltID0gbmV3ICQuZ1EuQW5pbWF0aW9uKHsgaW1hZ2VVUkw6IHVybE9yTWFwIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNpbmdsZWZyYW1lQW5pbSA9IG5ldyAkLmdRLkFuaW1hdGlvbih1cmxPck1hcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1lbW9Bbmltcy5zZXQodXJsT3JNYXAsIHNpbmdsZWZyYW1lQW5pbSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpbmdsZWZyYW1lQW5pbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIHVzZWQgZm9yIG5ld0dRQW5pbWF0aW9uLiBDaGVjayBBUEkgZG9jdW1lbnRhdGlvbiBmb3IgZGV0YWlscyBvZiBwYXJhbWV0ZXJzLlwiKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgJC5nUS5BbmltYXRpb24oeyBpbWFnZVVSTDogXCJcIiB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG50eXBlIENyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3g6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeTogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAodGhpczogdm9pZCwgZ3JvdXBOYW1lOiBzdHJpbmcsIHRoZVdpZHRoOiBudW1iZXIsIHRoZUhlaWdodDogbnVtYmVyKTogdm9pZDtcbiAgICAodGhpczogdm9pZCwgZ3JvdXBOYW1lOiBzdHJpbmcpOiB2b2lkO1xuICAgICh0aGlzOiB2b2lkLCBncm91cE5hbWU6IHN0cmluZywgb3B0TWFwOiBvYmplY3QpOiB2b2lkO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVHcm91cEluUGxheWdyb3VuZDogQ3JlYXRlR3JvdXBJblBsYXlncm91bmRGbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgIHRoZVdpZHRoPzogbnVtYmVyIHwgb2JqZWN0LFxuICAgIHRoZUhlaWdodD86IG51bWJlcixcbiAgICB0aGVQb3N4PzogbnVtYmVyLFxuICAgIHRoZVBvc3k/OiBudW1iZXJcbik6IHZvaWQge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiAoZ3JvdXBOYW1lKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIkZpcnN0IGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBtdXN0IGJlIGEgU3RyaW5nLiBJbnN0ZWFkIGZvdW5kOiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzcHJpdGVHcm91cE5hbWVGb3JtYXRJc1ZhbGlkKGdyb3VwTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJHcm91cCBuYW1lIGdpdmVuIHRvIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIGlzIGluIHdyb25nIGZvcm1hdDogXCIgKyBncm91cE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzcHJpdGVFeGlzdHMoZ3JvdXBOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcImNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIGNhbm5vdCBjcmVhdGUgZHVwbGljYXRlIGdyb3VwIHdpdGggbmFtZTogXCIgKyBncm91cE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlV2lkdGgpO1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkhlaWdodCBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlSGVpZ2h0KTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA1KSB7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiV2lkdGggYXJndW1lbnQgZm9yIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZVdpZHRoKTtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJIZWlnaHQgYXJndW1lbnQgZm9yIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZUhlaWdodCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWCBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlUG9zeCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlUG9zeSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgeyAvLyB0cmVhdHMgYXJndW1lbnRzWzFdIGFzIGEgc3RhbmRhcmQgb3B0aW9ucyBtYXBcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzFdICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlNlY29uZCBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgZXhwZWN0ZWQgdG8gYmUgYSBkaWN0aW9uYXJ5LiBJbnN0ZWFkIGZvdW5kOiBcIiArIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgICAgICB9IC8vIGVsc2UgaG9wZSBpdCdzIGEgcHJvcGVyIHN0YW5kYXJkIG9wdGlvbnMgbWFwXG4gICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIldyb25nIG51bWJlciBvZiBhcmd1bWVudHMgdXNlZCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQuIENoZWNrIEFQSSBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzIG9mIHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgJC5wbGF5Z3JvdW5kKCkuYWRkR3JvdXAoXG4gICAgICAgICAgICBncm91cE5hbWUsXG4gICAgICAgICAgICB7IHdpZHRoOiAkLnBsYXlncm91bmQoKS53aWR0aCgpLCBoZWlnaHQ6ICQucGxheWdyb3VuZCgpLmhlaWdodCgpIH1cbiAgICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGVXaWR0aCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcInRoZVdpZHRoIG11c3QgYmUgYSBudW1iZXIgYnV0IGluc3RlYWQgZ290OiBcIiArIHRoZVdpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRHcm91cChncm91cE5hbWUsIHsgd2lkdGg6IHRoZVdpZHRoLCBoZWlnaHQ6IHRoZUhlaWdodCB9KTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGVXaWR0aCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcInRoZVdpZHRoIG11c3QgYmUgYSBudW1iZXIgYnV0IGluc3RlYWQgZ290OiBcIiArIHRoZVdpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRHcm91cChcbiAgICAgICAgICAgIGdyb3VwTmFtZSxcbiAgICAgICAgICAgIHsgd2lkdGg6IHRoZVdpZHRoLCBoZWlnaHQ6IHRoZUhlaWdodCwgcG9zeDogdGhlUG9zeCwgcG9zeTogdGhlUG9zeSB9XG4gICAgICAgICk7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7IC8vIHRyZWF0cyBhcmd1bWVudHNbMV0gYXMgYSBzdGFuZGFyZCBvcHRpb25zIG1hcFxuICAgICAgICBpZiAodHlwZW9mIHRoZVdpZHRoICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU2Vjb25kIGFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXIgYnV0IGluc3RlYWQgZ290OiBcIiArIHRoZVdpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRHcm91cChncm91cE5hbWUsIGFyZ3VtZW50c1sxXSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHR5cGUgU3ByaXRlQW5pbWF0aW9uID0geyBpbWFnZVVSTDogc3RyaW5nIH07XG50eXBlIENyZWF0ZVNwcml0ZUluR3JvdXBGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHRoZUFuaW1hdGlvbjogU3ByaXRlQW5pbWF0aW9uLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeDogbnVtYmVyLFxuICAgICAgICB0aGVQb3N5OiBudW1iZXJcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlQW5pbWF0aW9uOiBTcHJpdGVBbmltYXRpb24sXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIG9wdGlvbnNNYXA6IG9iamVjdFxuICAgICk6IHZvaWQ7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVNwcml0ZUluR3JvdXA6IENyZWF0ZVNwcml0ZUluR3JvdXBGbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICB0aGVBbmltYXRpb246IFNwcml0ZUFuaW1hdGlvbiB8IG9iamVjdCxcbiAgICB0aGVXaWR0aD86IG51bWJlcixcbiAgICB0aGVIZWlnaHQ/OiBudW1iZXIsXG4gICAgdGhlUG9zeD86IG51bWJlcixcbiAgICB0aGVQb3N5PzogbnVtYmVyXG4pOiB2b2lkIHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIGlmICh0eXBlb2YgKGdyb3VwTmFtZSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJGaXJzdCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIGEgU3RyaW5nLiBJbnN0ZWFkIGZvdW5kOiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzcHJpdGVFeGlzdHMoZ3JvdXBOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcImNyZWF0ZVNwcml0ZUluR3JvdXAgY2Fubm90IGZpbmQgZ3JvdXAgKGRvZXNuJ3QgZXhpc3Q/KTogXCIgKyBncm91cE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiAoc3ByaXRlTmFtZSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTZWNvbmQgYXJndW1lbnQgZm9yIGNyZWF0ZVNwcml0ZUluR3JvdXAgbXVzdCBiZSBhIFN0cmluZy4gSW5zdGVhZCBmb3VuZDogXCIgKyBzcHJpdGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNwcml0ZUdyb3VwTmFtZUZvcm1hdElzVmFsaWQoc3ByaXRlTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTcHJpdGUgbmFtZSBnaXZlbiB0byBjcmVhdGVTcHJpdGVJbkdyb3VwIGlzIGluIHdyb25nIGZvcm1hdDogXCIgKyBzcHJpdGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3ByaXRlRXhpc3RzKHNwcml0ZU5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiY3JlYXRlU3ByaXRlSW5Hcm91cCBjYW5ub3QgY3JlYXRlIGR1cGxpY2F0ZSBzcHJpdGUgd2l0aCBuYW1lOiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDUgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gNykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiAodGhlQW5pbWF0aW9uKSAhPT0gXCJvYmplY3RcIiB8fCAodGhlQW5pbWF0aW9uIGluc3RhbmNlb2YgT2JqZWN0XG4gICAgICAgICAgICAgICAgJiYgKCEoXCJpbWFnZVVSTFwiIGluIHRoZUFuaW1hdGlvbikgfHwgdHlwZW9mICh0aGVBbmltYXRpb25bXCJpbWFnZVVSTFwiXSkgIT09IFwic3RyaW5nXCIpKSkge1xuICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJjcmVhdGVTcHJpdGVJbkdyb3VwIGNhbm5vdCB1c2UgdGhpcyBhcyBhbiBhbmltYXRpb246IFwiICsgdGhlQW5pbWF0aW9uXG4gICAgICAgICAgICAgICAgICAgICsgXCJcXG5BbmltYXRpb24gbXVzdCBiZSBvZiB0eXBlIFNwcml0ZUFuaW1hdGlvbiBidXQgeW91IHByb3ZpZGVkIGE6IFwiICsgdHlwZW9mICh0aGVBbmltYXRpb24pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVXaWR0aCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiSGVpZ2h0IGFyZ3VtZW50IGZvciBjcmVhdGVTcHJpdGVJbkdyb3VwIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZUhlaWdodCk7XG5cblxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDcpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWCBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N4KTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1syXSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJUaGlyZCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBleHBlY3RlZCB0byBiZSBhIGRpY3Rpb25hcnkuIEluc3RlYWQgZm91bmQ6IFwiICsgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhlQW5pbWF0aW9uIGluc3RhbmNlb2YgT2JqZWN0ICYmICghKFwiaW1hZ2VVUkxcIiBpbiB0aGVBbmltYXRpb24pIHx8IHR5cGVvZiAodGhlQW5pbWF0aW9uW1wiaW1hZ2VVUkxcIl0pICE9PSBcInN0cmluZ1wiKSkge1xuICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJUaGlyZCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBleHBlY3RlZCB0byBiZSBhIGRpY3Rpb25hcnkuIEluc3RlYWQgZm91bmQgdGhpcyBhbmltYXRpb246IFwiICsgdGhlQW5pbWF0aW9uICsgXCIuIE1heWJlIHdyb25nIG51bWJlciBvZiBhcmd1bWVudHMgcHJvdmlkZWQ/IENoZWNrIEFQSSBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzIG9mIHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICAgICAgfSAvLyBlbHNlIGhvcGUgaXQncyBhIHByb3BlciBzdGFuZGFyZCBvcHRpb25zIG1hcFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIldyb25nIG51bWJlciBvZiBhcmd1bWVudHMgdXNlZCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cC4gQ2hlY2sgQVBJIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMgb2YgcGFyYW1ldGVycy5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgICAkKFwiI1wiICsgZ3JvdXBOYW1lKS5hZGRTcHJpdGUoXG4gICAgICAgICAgICBzcHJpdGVOYW1lLFxuICAgICAgICAgICAgeyBhbmltYXRpb246IHRoZUFuaW1hdGlvbiwgd2lkdGg6IHRoZVdpZHRoLCBoZWlnaHQ6IHRoZUhlaWdodCB9XG4gICAgICAgICk7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA3KSB7XG4gICAgICAgICQoXCIjXCIgKyBncm91cE5hbWUpLmFkZFNwcml0ZShcbiAgICAgICAgICAgIHNwcml0ZU5hbWUsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiB0aGVBbmltYXRpb24sXG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoZVdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhlSGVpZ2h0LFxuICAgICAgICAgICAgICAgIHBvc3g6IHRoZVBvc3gsXG4gICAgICAgICAgICAgICAgcG9zeTogdGhlUG9zeVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykgeyAvLyB0cmVhdHMgYXJndW1lbnRzWzJdIGFzIGEgc3RhbmRhcmQgb3B0aW9ucyBtYXBcbiAgICAgICAgJChcIiNcIiArIGdyb3VwTmFtZSkuYWRkU3ByaXRlKHNwcml0ZU5hbWUsIGFyZ3VtZW50c1syXSk7XG4gICAgfVxufTtcblxudHlwZSBDcmVhdGVUZXh0U3ByaXRlSW5Hcm91cEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3g6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeTogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyXG4gICAgKTogdm9pZDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXA6IENyZWF0ZVRleHRTcHJpdGVJbkdyb3VwRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICB0aGVQb3N4PzogbnVtYmVyLFxuICAgIHRoZVBvc3k/OiBudW1iZXJcbik6IHZvaWQge1xuICAgIC8vIHRvIGJlIHVzZWQgbGlrZSBzcHJpdGUoXCJ0ZXh0Qm94XCIpLnRleHQoXCJoaVwiKTsgLy8gb3IgLmh0bWwoXCI8Yj5oaTwvYj5cIik7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICBpZiAodHlwZW9mIChncm91cE5hbWUpICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiRmlyc3QgYXJndW1lbnQgZm9yIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgZ3JvdXBOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNwcml0ZUV4aXN0cyhncm91cE5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgY2Fubm90IGZpbmQgZ3JvdXAgKGRvZXNuJ3QgZXhpc3Q/KTogXCIgKyBncm91cE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiAoc3ByaXRlTmFtZSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTZWNvbmQgYXJndW1lbnQgZm9yIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgc3ByaXRlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzcHJpdGVHcm91cE5hbWVGb3JtYXRJc1ZhbGlkKHNwcml0ZU5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU3ByaXRlIG5hbWUgZ2l2ZW4gdG8gY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgaXMgaW4gd3JvbmcgZm9ybWF0OiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzcHJpdGVFeGlzdHMoc3ByaXRlTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBjYW5ub3QgY3JlYXRlIGR1cGxpY2F0ZSBzcHJpdGUgd2l0aCBuYW1lOiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDQgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gNikge1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIldpZHRoIGFyZ3VtZW50IGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVXaWR0aCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiSGVpZ2h0IGFyZ3VtZW50IGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVIZWlnaHQpO1xuXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNikge1xuICAgICAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIGFyZ3VtZW50IGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N4KTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlUG9zeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50cyB1c2VkIGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cC4gQ2hlY2sgQVBJIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMgb2YgcGFyYW1ldGVycy5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNCkge1xuICAgICAgICAkKFwiI1wiICsgZ3JvdXBOYW1lKS5hZGRTcHJpdGUoc3ByaXRlTmFtZSwge1xuICAgICAgICAgICAgd2lkdGg6IHRoZVdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGVIZWlnaHRcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA2KSB7XG4gICAgICAgICQoXCIjXCIgKyBncm91cE5hbWUpLmFkZFNwcml0ZShzcHJpdGVOYW1lLCB7XG4gICAgICAgICAgICB3aWR0aDogdGhlV2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoZUhlaWdodCxcbiAgICAgICAgICAgIHBvc3g6IHRoZVBvc3gsXG4gICAgICAgICAgICBwb3N5OiB0aGVQb3N5XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNCB8fCBhcmd1bWVudHMubGVuZ3RoID09PSA2KSB7XG4gICAgICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIFwid2hpdGVcIikgLy8gZGVmYXVsdCB0byB3aGl0ZSBiYWNrZ3JvdW5kIGZvciBlYXNlIG9mIHVzZVxuICAgICAgICAgICAgLmNzcyhcInVzZXItc2VsZWN0XCIsIFwibm9uZVwiKTtcbiAgICB9XG59O1xuXG5jb25zdCB0ZXh0SW5wdXRTcHJpdGVUZXh0QXJlYUlkID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIHNwcml0ZU5hbWUgKyBcIi10ZXh0YXJlYVwiO1xufTtcbmNvbnN0IHRleHRJbnB1dFNwcml0ZVN1Ym1pdEJ1dHRvbklkID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIHNwcml0ZU5hbWUgKyBcIi1idXR0b25cIjtcbn07XG5jb25zdCB0ZXh0SW5wdXRTcHJpdGVHUUdfU0lHTkFMU19JZCA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIHJldHVybiBzcHJpdGVOYW1lICsgXCItc3VibWl0dGVkXCI7XG59O1xudHlwZSBDcmVhdGVUZXh0SW5wdXRTcHJpdGVJbkdyb3VwRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICAgICAgcm93czogbnVtYmVyLFxuICAgICAgICBjb2xzOiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3g6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeTogbnVtYmVyLFxuICAgICAgICBzdWJtaXRIYW5kbGVyOiBTdWJtaXRIYW5kbGVyRm5cbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHJvd3M6IG51bWJlcixcbiAgICAgICAgY29sczogbnVtYmVyLFxuICAgICAgICB0aGVQb3N4OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3k6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICAgICAgcm93czogbnVtYmVyLFxuICAgICAgICBjb2xzOiBudW1iZXJcbiAgICApOiB2b2lkO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVUZXh0SW5wdXRTcHJpdGVJbkdyb3VwOiBDcmVhdGVUZXh0SW5wdXRTcHJpdGVJbkdyb3VwRm4gPVxuICAgIGZ1bmN0aW9uIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHJvd3M6IG51bWJlcixcbiAgICAgICAgY29sczogbnVtYmVyLFxuICAgICAgICB0aGVQb3N4PzogbnVtYmVyLFxuICAgICAgICB0aGVQb3N5PzogbnVtYmVyLFxuICAgICAgICBzdWJtaXRIYW5kbGVyPzogU3VibWl0SGFuZGxlckZuXG4gICAgKTogdm9pZCB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA2KSB7XG4gICAgICAgICAgICBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cChncm91cE5hbWUsIHNwcml0ZU5hbWUsIHRoZVdpZHRoLCB0aGVIZWlnaHQpO1xuICAgICAgICB9IGVsc2UgaWYgKChhcmd1bWVudHMubGVuZ3RoID09PSA4IHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDkpICYmIHRoZVBvc3ggJiZcbiAgICAgICAgICAgIHRoZVBvc3kpIHtcbiAgICAgICAgICAgIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwKFxuICAgICAgICAgICAgICAgIGdyb3VwTmFtZSxcbiAgICAgICAgICAgICAgICBzcHJpdGVOYW1lLFxuICAgICAgICAgICAgICAgIHRoZVdpZHRoLFxuICAgICAgICAgICAgICAgIHRoZUhlaWdodCxcbiAgICAgICAgICAgICAgICB0aGVQb3N4LFxuICAgICAgICAgICAgICAgIHRoZVBvc3lcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDYgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gOCB8fFxuICAgICAgICAgICAgYXJndW1lbnRzLmxlbmd0aCA9PT0gOSkge1xuICAgICAgICAgICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLmNzcyhcImJhY2tncm91bmQtY29sb3JcIiwgXCJ3aGl0ZVwiKTsgLy8gZGVmYXVsdCB0byB3aGl0ZSBiYWNrZ3JvdW5kIGZvciBlYXNlIG9mIHVzZVxuXG4gICAgICAgICAgICB2YXIgdGV4dGFyZWFIdG1sID0gJzx0ZXh0YXJlYSBpZD1cIicgK1xuICAgICAgICAgICAgICAgIHRleHRJbnB1dFNwcml0ZVRleHRBcmVhSWQoc3ByaXRlTmFtZSkgKyAnXCIgcm93cz1cIicgKyByb3dzICtcbiAgICAgICAgICAgICAgICAnXCIgY29scz1cIicgKyBjb2xzICsgJ1wiPmhpPC90ZXh0YXJlYT4nO1xuICAgICAgICAgICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLmFwcGVuZCh0ZXh0YXJlYUh0bWwpO1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9uSWQgPSB0ZXh0SW5wdXRTcHJpdGVTdWJtaXRCdXR0b25JZChzcHJpdGVOYW1lKTtcbiAgICAgICAgICAgIHZhciBidXR0b25IdG1sID0gJzxidXR0b24gaWQ9XCInICsgYnV0dG9uSWQgK1xuICAgICAgICAgICAgICAgICdcIiB0eXBlPVwiYnV0dG9uXCI+U3VibWl0PC9idXR0b24+JztcbiAgICAgICAgICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5hcHBlbmQoYnV0dG9uSHRtbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gOSkge1xuICAgICAgICAgICAgdGV4dElucHV0U3ByaXRlU2V0SGFuZGxlcihzcHJpdGVOYW1lLCBzdWJtaXRIYW5kbGVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRleHRJbnB1dFNwcml0ZVNldEhhbmRsZXIoc3ByaXRlTmFtZSk7XG4gICAgICAgIH1cbiAgICB9O1xuZXhwb3J0IHR5cGUgU3VibWl0SGFuZGxlckZuID0gKHM6IHN0cmluZykgPT4gdm9pZDtcbmV4cG9ydCBjb25zdCB0ZXh0SW5wdXRTcHJpdGVTZXRIYW5kbGVyID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHN1Ym1pdEhhbmRsZXI/OiBTdWJtaXRIYW5kbGVyRm5cbik6IHZvaWQge1xuICAgIHZhciByZWFsU3VibWl0SGFuZGxlcjtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICByZWFsU3VibWl0SGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChzdWJtaXRIYW5kbGVyKSBzdWJtaXRIYW5kbGVyKHRleHRJbnB1dFNwcml0ZVN0cmluZyhzcHJpdGVOYW1lKSk7XG4gICAgICAgICAgICBHUUdfU0lHTkFMU1t0ZXh0SW5wdXRTcHJpdGVHUUdfU0lHTkFMU19JZChzcHJpdGVOYW1lKV0gPSB0cnVlO1xuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlYWxTdWJtaXRIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgR1FHX1NJR05BTFNbdGV4dElucHV0U3ByaXRlR1FHX1NJR05BTFNfSWQoc3ByaXRlTmFtZSldID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgJChcIiNcIiArIHRleHRJbnB1dFNwcml0ZVN1Ym1pdEJ1dHRvbklkKHNwcml0ZU5hbWUpKS5jbGljayhyZWFsU3VibWl0SGFuZGxlcik7XG59O1xuXG5leHBvcnQgY29uc3QgdGV4dElucHV0U3ByaXRlU3RyaW5nID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIFN0cmluZygkKFwiI1wiICsgdGV4dElucHV0U3ByaXRlVGV4dEFyZWFJZChzcHJpdGVOYW1lKSlbMF0udmFsdWUpO1xufTtcbmV4cG9ydCBjb25zdCB0ZXh0SW5wdXRTcHJpdGVTZXRTdHJpbmcgPSAoXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHN0cjogc3RyaW5nXG4pOiB2b2lkID0+IHtcbiAgICAkKFwiI1wiICsgdGV4dElucHV0U3ByaXRlVGV4dEFyZWFJZChzcHJpdGVOYW1lKSlbMF0udmFsdWUgPSBzdHI7XG59O1xuXG5leHBvcnQgY29uc3QgdGV4dElucHV0U3ByaXRlUmVzZXQgPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgdGV4dFByb21wdD86IHN0cmluZ1xuKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGV4dElucHV0U3ByaXRlU2V0U3RyaW5nKHNwcml0ZU5hbWUsIFwiXCIpO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiAmJiB0ZXh0UHJvbXB0KSB7XG4gICAgICAgIHRleHRJbnB1dFNwcml0ZVNldFN0cmluZyhzcHJpdGVOYW1lLCB0ZXh0UHJvbXB0KTtcbiAgICB9XG4gICAgR1FHX1NJR05BTFNbdGV4dElucHV0U3ByaXRlR1FHX1NJR05BTFNfSWQoc3ByaXRlTmFtZSldID0gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3QgdGV4dElucHV0U3ByaXRlU3VibWl0dGVkID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGlmIChHUUdfU0lHTkFMU1t0ZXh0SW5wdXRTcHJpdGVHUUdfU0lHTkFMU19JZChzcHJpdGVOYW1lKV0gPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn07XG5cbmV4cG9ydCBjb25zdCByZW1vdmVTcHJpdGUgPSAoc3ByaXRlTmFtZU9yT2JqOiBzdHJpbmcgfCBvYmplY3QpOiB2b2lkID0+IHtcbiAgICBpZiAodHlwZW9mIChzcHJpdGVOYW1lT3JPYmopICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lT3JPYmopO1xuICAgICAgICB9O1xuICAgICAgICAkKFwiI1wiICsgc3ByaXRlTmFtZU9yT2JqKS5yZW1vdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKHNwcml0ZU5hbWVPck9iaikucmVtb3ZlKCk7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZSA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBzcHJpdGVEb21PYmplY3QgPT4ge1xuICAgIHJldHVybiAkKFwiI1wiICsgc3ByaXRlTmFtZSk7XG59O1xuXG5leHBvcnQgY29uc3Qgc3ByaXRlRXhpc3RzID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiAoc3ByaXRlTmFtZSA9PSAkKFwiI1wiICsgc3ByaXRlTmFtZSkuYXR0cihcImlkXCIpKTsgLy8gc3ByaXRlTmFtZSBjb3VsZCBiZSBnaXZlbiBhcyBhbiBpbnQgYnkgYSBzdHVkZW50XG59O1xuXG5leHBvcnQgY29uc3Qgc3ByaXRlT2JqZWN0ID0gKFxuICAgIHNwcml0ZU5hbWVPck9iajogc3RyaW5nIHwgb2JqZWN0XG4pOiBzcHJpdGVEb21PYmplY3QgPT4ge1xuICAgIGlmICh0eXBlb2YgKHNwcml0ZU5hbWVPck9iaikgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lT3JPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAkKHNwcml0ZU5hbWVPck9iaik7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZUlkID0gKHNwcml0ZU5hbWVPck9iajogc3RyaW5nIHwgb2JqZWN0KTogc3RyaW5nID0+IHtcbiAgICBpZiAodHlwZW9mIChzcHJpdGVOYW1lT3JPYmopICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcoJChcIiNcIiArIHNwcml0ZU5hbWVPck9iaikuYXR0cihcImlkXCIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gU3RyaW5nKCQoc3ByaXRlTmFtZU9yT2JqKS5hdHRyKFwiaWRcIikpO1xuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVHZXRYID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgfTtcbiAgICByZXR1cm4gJChcIiNcIiArIHNwcml0ZU5hbWUpLngoKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlR2V0WSA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBudW1iZXIgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgIH07XG4gICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lKS55KCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZUdldFogPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogbnVtYmVyID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICB9O1xuICAgIHJldHVybiAkKFwiI1wiICsgc3ByaXRlTmFtZSkueigpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRYID0gKHNwcml0ZU5hbWU6IHN0cmluZywgeHZhbDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHh2YWwpO1xuICAgIH07XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLngoeHZhbCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVNldFkgPSAoc3ByaXRlTmFtZTogc3RyaW5nLCB5dmFsOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlkgbG9jYXRpb24gbXVzdCBiZSBhIG51bWJlci5cIiwgeXZhbCk7XG4gICAgfTtcbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkueSh5dmFsKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0WiA9IChzcHJpdGVOYW1lOiBzdHJpbmcsIHp2YWw6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWiBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB6dmFsKTtcbiAgICB9O1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS56KHp2YWwpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRYWSA9IChcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgeHZhbDogbnVtYmVyLFxuICAgIHl2YWw6IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHh2YWwpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB5dmFsKTtcbiAgICB9O1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS54eSh4dmFsLCB5dmFsKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0WFlaID0gKFxuICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICB4dmFsOiBudW1iZXIsXG4gICAgeXZhbDogbnVtYmVyLFxuICAgIHp2YWw6IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHh2YWwpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB5dmFsKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlogbG9jYXRpb24gbXVzdCBiZSBhIG51bWJlci5cIiwgenZhbCk7XG4gICAgfTtcbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkueHl6KHh2YWwsIHl2YWwsIHp2YWwpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZUdldFdpZHRoID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIC8vIFxuICAgICAgICAvLyBjb25zdCB0TWF0cml4U3RyID0gJChcIiNcIiArIHNwcml0ZU5hbWUpLmNzcyhcInRyYW5zZm9ybVwiKTtcbiAgICAgICAgLy8gY29uc3QgdE1hdEFyciA9IHRNYXRyaXhTdHIuc3Vic3RyaW5nKHRNYXRyaXhTdHIuaW5kZXhPZihcIihcIikgKyAxLCB0TWF0cml4U3RyLmxlbmd0aCAtIDEpLnNwbGl0KFwiLCBcIik7XG4gICAgICAgIC8vIGlmICghKHRNYXRBcnJbMF0gPT09IDEgJiYgdE1hdEFyclsxXSA9PT0gMCAmJiB0TWF0QXJyWzJdID09PSAwICYmIHRNYXRBcnJbM10gPT09IDEpKXtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKEdRR19XQVJOSU5HX0lOX01ZUFJPR1JBTV9NU0dcbiAgICAgICAgLy8gICAgICAgICArIFwic3ByaXRlIGdyYXBoaWMgc2NhbGVkIG9yIHRyYW5zZm9ybWVkLSBzcHJpdGVHZXRXaWR0aCBwb3NzaWJseSB3cm9uZyBmb3Igc3ByaXRlOiBcIlxuICAgICAgICAvLyAgICAgICAgICsgc3ByaXRlTmFtZVxuICAgICAgICAvLyAgICAgICAgICsgXCIuICBZb3Ugc2hvdWxkIHVzZSB0aGUgd2lkdGggaW4gdGhlIHNwcml0ZSBkaWN0aW9uYXJpZXMgd2hlbmV2ZXIgcG9zc2libGUgaW5zdGVhZC5cIik7XG4gICAgICAgIC8vIH1cbiAgICB9O1xuICAgIHJldHVybiAkKFwiI1wiICsgc3ByaXRlTmFtZSkudygpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVHZXRIZWlnaHQgPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogbnVtYmVyID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgLy8gICAgICAgXG4gICAgICAgIC8vIGNvbnN0IHRNYXRyaXhTdHIgPSAkKFwiI1wiICsgc3ByaXRlTmFtZSkuY3NzKFwidHJhbnNmb3JtXCIpO1xuICAgICAgICAvLyBjb25zdCB0TWF0QXJyID0gdE1hdHJpeFN0ci5zdWJzdHJpbmcodE1hdHJpeFN0ci5pbmRleE9mKFwiKFwiKSArIDEsIHRNYXRyaXhTdHIubGVuZ3RoIC0gMSkuc3BsaXQoXCIsIFwiKTtcbiAgICAgICAgLy8gaWYgKCEodE1hdEFyclswXSA9PT0gMSAmJiB0TWF0QXJyWzFdID09PSAwICYmIHRNYXRBcnJbMl0gPT09IDAgJiYgdE1hdEFyclszXSA9PT0gMSkpe1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coR1FHX1dBUk5JTkdfSU5fTVlQUk9HUkFNX01TR1xuICAgICAgICAvLyAgICAgICAgICsgXCJzcHJpdGUgZ3JhcGhpYyBzY2FsZWQgb3IgdHJhbnNmb3JtZWQtIHNwcml0ZUdldEhlaWdodCBwb3NzaWJseSB3cm9uZyBmb3Igc3ByaXRlOiBcIlxuICAgICAgICAvLyAgICAgICAgICsgc3ByaXRlTmFtZVxuICAgICAgICAvLyAgICAgICAgICsgXCIuICBZb3Ugc2hvdWxkIHVzZSB0aGUgaGVpZ2h0IGluIHRoZSBzcHJpdGUgZGljdGlvbmFyaWVzIHdoZW5ldmVyIHBvc3NpYmxlIGluc3RlYWQuXCIpO1xuICAgICAgICAvLyB9IFxuICAgIH07XG4gICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5oKCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVNldFdpZHRoID0gKHNwcml0ZU5hbWU6IHN0cmluZywgd3ZhbDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBtdXN0IGJlIGEgbnVtYmVyLlwiLCB3dmFsKTtcbiAgICB9XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLncod3ZhbCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVNldEhlaWdodCA9IChzcHJpdGVOYW1lOiBzdHJpbmcsIGh2YWw6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiSGVpZ2h0IG11c3QgYmUgYSBudW1iZXIuXCIsIGh2YWwpO1xuICAgIH1cbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkuaChodmFsKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0V2lkdGhIZWlnaHQgPSAoXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHd2YWw6IG51bWJlcixcbiAgICBodmFsOiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiV2lkdGggbXVzdCBiZSBhIG51bWJlci5cIiwgd3ZhbCk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJIZWlnaHQgbXVzdCBiZSBhIG51bWJlci5cIiwgaHZhbCk7XG4gICAgfVxuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS53aCh3dmFsLCBodmFsKTtcbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVSb3RhdGUgPSAoXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIGFuZ2xlRGVncmVlczogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkFuZ2xlIG11c3QgYmUgYSBudW1iZXIuXCIsIGFuZ2xlRGVncmVlcyk7XG4gICAgfVxuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5yb3RhdGUoYW5nbGVEZWdyZWVzKTtcbn07XG5cbmNvbnN0IEdRR19TUFJJVEVTX1BST1BTOiB7IFt4OiBzdHJpbmddOiB7IFt5OiBzdHJpbmddOiBhbnkgfSB9ID0ge307XG5leHBvcnQgY29uc3Qgc3ByaXRlU2NhbGUgPSAoc3ByaXRlTmFtZTogc3RyaW5nLCByYXRpbzogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgLy8gU2NhbGVzIHRoZSBzcHJpdGUncyB3aWR0aC9oZWlnaHQgd2l0aCByYXRpbywgXG4gICAgLy8gYW5kIHNldCBpdHMgYW5pbSB0byAxMDAlIGZpdCBpdC5cbiAgICAvL1xuICAgIC8vIE5PVEU6IFdlIGFzc3VtZSB0aGF0IHRoZSB3aWR0aC9oZWlnaHQgb2YgdGhlIHNwcml0ZSBcbiAgICAvLyB1cG9uIGZpcnN0IGNhbGwgdG8gdGhpcyBmdW5jdGlvbiBpcyB0aGUgXCJvcmlnaW5hbFwiIHdpZHRoL2hlaWdodCBvZiB0aGUgc3ByaXRlLlxuICAgIC8vIFRoaXMgYW5kIGFsbCBzdWJzZXF1ZW50IGNhbGxzIHRvIHRoaXMgZnVuY3Rpb24gY2FsY3VsYXRlcyByYXRpb1xuICAgIC8vIHJlbGF0aXZlIHRvIHRoYXQgb3JpZ2luYWwgd2lkdGgvaGVpZ2h0LlxuXG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJSYXRpbyBtdXN0IGJlIGEgbnVtYmVyLlwiLCByYXRpbyk7XG4gICAgfVxuXG4gICAgbGV0IHNwcml0ZVByb3AgPSBHUUdfU1BSSVRFU19QUk9QU1tzcHJpdGVOYW1lXTtcbiAgICBpZiAoc3ByaXRlUHJvcCA9PSBudWxsKSB7XG4gICAgICAgIHNwcml0ZVByb3AgPSB7XG4gICAgICAgICAgICB3aWR0aE9yaWdpbmFsOiBzcHJpdGVHZXRXaWR0aChzcHJpdGVOYW1lKSxcbiAgICAgICAgICAgIGhlaWdodE9yaWdpbmFsOiBzcHJpdGVHZXRIZWlnaHQoc3ByaXRlTmFtZSlcbiAgICAgICAgfTtcbiAgICAgICAgR1FHX1NQUklURVNfUFJPUFNbc3ByaXRlTmFtZV0gPSBzcHJpdGVQcm9wO1xuICAgIH1cbiAgICBjb25zdCBuZXdXaWR0aCA9IHNwcml0ZVByb3Aud2lkdGhPcmlnaW5hbCAqIHJhdGlvO1xuICAgIGNvbnN0IG5ld0hlaWdodCA9IHNwcml0ZVByb3AuaGVpZ2h0T3JpZ2luYWwgKiByYXRpbztcblxuICAgIC8vJChcIiNcIiArIHNwcml0ZU5hbWUpLnNjYWxlKHJhdGlvKTsgLy8gR1Egc2NhbGUgaXMgdmVyeSBicm9rZW4uXG4gICAgLy8gR1EncyBzY2FsZSgpIHdpbGwgc2NhbGUgdGhlIGFuaW0gaW1hZ2UgKHdoaWNoIGlzIGEgYmFja2dyb3VuZC1pbWFnZSBpbiB0aGUgZGl2KSBwcm9wZXJseVxuICAgIC8vIGFuZCBldmVuIHNjYWxlIHRoZSBkaXYncyB3aWR0aC9oZWlnaHQgcHJvcGVybHlcbiAgICAvLyBidXQgc29tZWhvdyB0aGUgaW4tZ2FtZSB3aWR0aC9oZWlnaHQgdGhhdCBHUSBzdG9yZXMgZm9yIGl0IHJlbWFpbnMgdGhlIG9yaWdpbmFsIHNpemVcbiAgICAvLyBhbmQgd29yc2UsIHRoZSBoaXQgYm94J3Mgd2lkdGgvaGVpZ2h0IHRoYXQgR1EgdXNlcyB0byBjYWxjdWxhdGUgY29sbGlzaW9uIGRldGVjdGlvbiB3aXRoIFxuICAgIC8vIGlzIGluIGJldHdlZW4gdGhlIGRpdidzIGFuZCB0aGUgc3ByaXRlJ3Mgd2lkdGgvaGVpZ2h0IChhYm91dCBoYWxmd2F5IGJldHdlZW4/IGRvbid0IGtub3cpLlxuXG4gICAgLy8kKFwiI1wiICsgc3ByaXRlTmFtZSkuY3NzKFwidHJhbnNmb3JtLW9yaWdpblwiLCBcInRvcCBsZWZ0XCIpOyAvLyBkbyBOT1QgY2hhbmdlIHRyYW5zZm9ybS1vcmlnaW4sIGVsc2UgYnJlYWtzIGNvbGxpc2lvbiBhbmQgcm90YXRlXG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLmNzcyhcImJhY2tncm91bmQtc2l6ZVwiLCBcIjEwMCUgMTAwJVwiKTsgLy8gc3RyZXRjaGVzIHdpZHRoL2hlaWdodCBpbmRlcGVuZGVudGx5IHRvIHdpZHRoL2hlaWdodCBvZiBkaXZcbiAgICBzcHJpdGVTZXRXaWR0aEhlaWdodChzcHJpdGVOYW1lLCBuZXdXaWR0aCwgbmV3SGVpZ2h0KTtcbn07XG5cbi8vJChcIiNcIiArIHNwcml0ZU5hbWUpLmNzcyhcImJhY2tncm91bmQtc2l6ZVwiLCBcIjE1MHB4IDE1MHB4XCIpOyAvLyB3aWR0aCBoZWlnaHQgLS0tIGJ1dCBuZWVkIHRvIHN0b3JlIG9yaWdpbmFsIHNpemUhISFcbi8vIG9yIG1heWJlIGp1c3QgYWJhbmRvbiB0aGlzIGZuIC0gbWFrZSBpdCBwcmludCBpdCdzIGJyb2tlblxuLy8gd3JpdGUgYSBuZXcgZm46ICAgc3ByaXRlU2NhbGVXaWR0aEhlaWdodCB0aGF0XG4vLyB0cmFuc2Zvcm0tb3JpZ2luIHRvcCBsZWZ0XG4vLyBiYWNrZ3JvdW5kLXNpemUgc2V0IHRvIGdpdmVuIHdpZHRoIGhlaWdodCAodGhlbiBkb24ndCBuZWVkIHRvIHN0b3JlIG9yaWdpbmFsLCB0aGF0J3MgdGhlIHVzZXIncyBqb2IgbG9sKVxuLy8gYWxzbyBzcHJpdGVTZXRXaWR0aC9IZWlnaHQgdG8gdGhhdCBnaXZlblxuLy8gb3IgbWFrZSB0aGlzIGEgcG9seW1vcnBoaWMgZm4/XG5cblxuZXhwb3J0IGNvbnN0IHNwcml0ZVNldEFuaW1hdGlvbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIHNwcml0ZU5hbWVPck9iajogc3RyaW5nIHwgb2JqZWN0LFxuICAgIGFHUUFuaW1hdGlvbj86IG9iamVjdCxcbiAgICBjYWxsYmFja0Z1bmN0aW9uPzogRnVuY3Rpb25cbikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyICYmIGFHUUFuaW1hdGlvbiAhPSBudWxsKSB7XG4gICAgICAgIHNwcml0ZU9iamVjdChzcHJpdGVOYW1lT3JPYmopLnNldEFuaW1hdGlvbihhR1FBbmltYXRpb24pO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyAmJiBhR1FBbmltYXRpb24gIT0gbnVsbCAmJiB0eXBlb2YgY2FsbGJhY2tGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHNwcml0ZU9iamVjdChzcHJpdGVOYW1lT3JPYmopLnNldEFuaW1hdGlvbihhR1FBbmltYXRpb24sIGNhbGxiYWNrRnVuY3Rpb24pO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBzcHJpdGVPYmplY3Qoc3ByaXRlTmFtZU9yT2JqKS5zZXRBbmltYXRpb24oKTtcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVBhdXNlQW5pbWF0aW9uID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5wYXVzZUFuaW1hdGlvbigpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVSZXN1bWVBbmltYXRpb24gPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLnJlc3VtZUFuaW1hdGlvbigpO1xufTtcblxudHlwZSBKUU9iamVjdCA9IHtcbiAgICBvZmZzZXQ6ICgpID0+IHsgbGVmdDogbnVtYmVyLCB0b3A6IG51bWJlciB9O1xuICAgIG91dGVyV2lkdGg6ICh4OiBib29sZWFuKSA9PiBudW1iZXI7XG4gICAgb3V0ZXJIZWlnaHQ6ICh4OiBib29sZWFuKSA9PiBudW1iZXI7XG59O1xuY29uc3QganFEaXZzSGl0ID0gZnVuY3Rpb24gKGRpdjE6IEpRT2JqZWN0LCBkaXYyOiBKUU9iamVjdCkgeyAvLyBheGlzIGFsaWduZWQsIGRpdjEvMiBhcmUgalF1ZXJ5IG9iamVjdHNcbiAgICBjb25zdCBkMUxlZnQgPSBkaXYxLm9mZnNldCgpLmxlZnQ7XG4gICAgY29uc3QgZDFSaWdodCA9IGQxTGVmdCArIGRpdjEub3V0ZXJXaWR0aCh0cnVlKTtcbiAgICBjb25zdCBkMVRvcCA9IGRpdjEub2Zmc2V0KCkudG9wO1xuICAgIGNvbnN0IGQxQm90dG9tID0gZDFUb3AgKyBkaXYxLm91dGVySGVpZ2h0KHRydWUpO1xuXG4gICAgY29uc3QgZDJMZWZ0ID0gZGl2Mi5vZmZzZXQoKS5sZWZ0O1xuICAgIGNvbnN0IGQyUmlnaHQgPSBkMkxlZnQgKyBkaXYyLm91dGVyV2lkdGgodHJ1ZSk7XG4gICAgY29uc3QgZDJUb3AgPSBkaXYyLm9mZnNldCgpLnRvcDtcbiAgICBjb25zdCBkMkJvdHRvbSA9IGQyVG9wICsgZGl2Mi5vdXRlckhlaWdodCh0cnVlKTtcblxuICAgIHJldHVybiAhKGQxQm90dG9tIDwgZDJUb3AgfHwgZDFUb3AgPiBkMkJvdHRvbSB8fCBkMVJpZ2h0IDwgZDJMZWZ0IHx8IGQxTGVmdCA+IGQyUmlnaHQpO1xufTtcblxudHlwZSBET01PYmplY3QgPSB7XG4gICAgZ2V0Qm91bmRpbmdDbGllbnRSZWN0OiAoKSA9PiB7IGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyIH07XG59O1xuY29uc3QgZGl2c0hpdCA9IGZ1bmN0aW9uIChkaXYxOiBET01PYmplY3QsIGRpdjI6IERPTU9iamVjdCkgeyAvLyBheGlzIGFsaWduZWQsIGRpdjEvMiBhcmUgRE9NIG9iamVjdHNcbiAgICBjb25zdCByMSA9IGRpdjEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgcjIgPSBkaXYyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiAhKHIxLmJvdHRvbSA8IHIyLnRvcCB8fCByMS50b3AgPiByMi5ib3R0b20gfHwgcjEucmlnaHQgPCByMi5sZWZ0IHx8IHIxLmxlZnQgPiByMi5yaWdodCk7XG59O1xuXG5leHBvcnQgdHlwZSBDb2xsaXNpb25IYW5kbGluZ0ZuID0gKGNvbGxJbmRleDogbnVtYmVyLCBoaXRTcHJpdGU6IG9iamVjdCkgPT5cbiAgICB2b2lkO1xuZXhwb3J0IGNvbnN0IGZvckVhY2hTcHJpdGVTcHJpdGVDb2xsaXNpb25EbyA9IChcbiAgICBzcHJpdGUxTmFtZTogc3RyaW5nLFxuICAgIHNwcml0ZTJOYW1lOiBzdHJpbmcsXG4gICAgY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbjogQ29sbGlzaW9uSGFuZGxpbmdGblxuKTogdm9pZCA9PiB7XG4gICAgJChzcHJpdGVGaWx0ZXJIaXRBeGlzQWxpZ25lZFJlY3Qoc3ByaXRlMU5hbWUsIFwiLmdRX2dyb3VwLCAjXCIgKyBzcHJpdGUyTmFtZSkpLmVhY2goY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbik7XG4gICAgLy8gY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbiBjYW4gb3B0aW9uYWxseSB0YWtlIHR3byBhcmd1bWVudHM6IGNvbGxJbmRleCwgaGl0U3ByaXRlXG4gICAgLy8gc2VlIGh0dHA6Ly9hcGkuanF1ZXJ5LmNvbS9qUXVlcnkuZWFjaFxufTtcbmV4cG9ydCBjb25zdCBmb3JFYWNoMlNwcml0ZXNIaXQgPSAoKCkgPT4ge1xuICAgIHZhciBwcmludGVkID0gZmFsc2U7XG4gICAgcmV0dXJuIChzcHJpdGUxTmFtZTogc3RyaW5nLCBzcHJpdGUyTmFtZTogc3RyaW5nLCBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uOiBDb2xsaXNpb25IYW5kbGluZ0ZuKSA9PiB7XG4gICAgICAgIGlmICghcHJpbnRlZCkge1xuICAgICAgICAgICAgcHJpbnRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiRGVwcmVjYXRlZCBmdW5jdGlvbiB1c2VkOiBmb3JFYWNoMlNwcml0ZXNIaXQuICBVc2Ugd2hlbjJTcHJpdGVzSGl0IGluc3RlYWQgZm9yIGJldHRlciBwZXJmb3JtYW5jZS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgZm9yRWFjaFNwcml0ZVNwcml0ZUNvbGxpc2lvbkRvKHNwcml0ZTFOYW1lLCBzcHJpdGUyTmFtZSwgY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbik7XG4gICAgfTtcbn0pKCk7XG5leHBvcnQgY29uc3Qgd2hlbjJTcHJpdGVzSGl0ID0gZm9yRWFjaFNwcml0ZVNwcml0ZUNvbGxpc2lvbkRvOyAvLyBORVdcblxuZXhwb3J0IGNvbnN0IGZvckVhY2hTcHJpdGVHcm91cENvbGxpc2lvbkRvID0gKFxuICAgIHNwcml0ZTFOYW1lOiBzdHJpbmcsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbjogQ29sbGlzaW9uSGFuZGxpbmdGblxuKTogdm9pZCA9PiB7XG4gICAgJChzcHJpdGVGaWx0ZXJIaXRBeGlzQWxpZ25lZFJlY3Qoc3ByaXRlMU5hbWUsIFwiI1wiICsgZ3JvdXBOYW1lICsgXCIsIC5nUV9zcHJpdGVcIikpLmVhY2goY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbik7XG4gICAgLy8gY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbiBjYW4gb3B0aW9uYWxseSB0YWtlIHR3byBhcmd1bWVudHM6IGNvbGxJbmRleCwgaGl0U3ByaXRlXG4gICAgLy8gc2VlIGh0dHA6Ly9hcGkuanF1ZXJ5LmNvbS9qUXVlcnkuZWFjaFxufTtcbmV4cG9ydCBjb25zdCBmb3JFYWNoU3ByaXRlR3JvdXBIaXQgPSBmb3JFYWNoU3ByaXRlR3JvdXBDb2xsaXNpb25EbztcblxuZXhwb3J0IGNvbnN0IGZvckVhY2hTcHJpdGVGaWx0ZXJlZENvbGxpc2lvbkRvID0gKFxuICAgIHNwcml0ZTFOYW1lOiBzdHJpbmcsXG4gICAgZmlsdGVyU3RyOiBzdHJpbmcsXG4gICAgY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbjogQ29sbGlzaW9uSGFuZGxpbmdGblxuKTogdm9pZCA9PiB7XG4gICAgJChzcHJpdGVGaWx0ZXJIaXRBeGlzQWxpZ25lZFJlY3Qoc3ByaXRlMU5hbWUsIGZpbHRlclN0cikpLmVhY2goY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbik7XG4gICAgLy8gc2VlIGh0dHA6Ly9nYW1lcXVlcnlqcy5jb20vZG9jdW1lbnRhdGlvbi9hcGkvI2NvbGxpc2lvbiBmb3IgZmlsdGVyU3RyIHNwZWNcbiAgICAvLyBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uIGNhbiBvcHRpb25hbGx5IHRha2UgdHdvIGFyZ3VtZW50czogY29sbEluZGV4LCBoaXRTcHJpdGVcbiAgICAvLyBzZWUgaHR0cDovL2FwaS5qcXVlcnkuY29tL2pRdWVyeS5lYWNoXG59O1xuZXhwb3J0IGNvbnN0IGZvckVhY2hTcHJpdGVGaWx0ZXJlZEhpdCA9IGZvckVhY2hTcHJpdGVGaWx0ZXJlZENvbGxpc2lvbkRvO1xuXG5jb25zdCBzcHJpdGVGaWx0ZXJIaXRBeGlzQWxpZ25lZFJlY3QgPSBmdW5jdGlvbiAoc3ByaXRlMU5hbWU6IHN0cmluZywgZmlsdGVyU3RyOiBzdHJpbmcpOiBET01PYmplY3RbXSB7XG4gICAgLy8gRml4ZXMgR1EncyBjb2xsaXNpb24gZnVuY3Rpb24sIGJlY2F1c2UgR1EncyBjb2xsaWRlIGZ1bmN0aW9uIGlzIGJhZGx5IGJyb2tlbiB3aGVuIHNwcml0ZXMgYXJlIHJvdGF0ZWQvc2NhbGVkXG4gICAgLy8gVGhlIGZpeCBpcyB0byBjaGVjayBjb2xsaXNpb24gdXNpbmcgYXhpcyBhbGlnbmVkIHJlY3Rhbmd1bGFyIGhpdCBib3hlcy5cbiAgICAvLyBOb3QgZ3JlYXQgZm9yIHJvdGF0ZWQgc3ByaXRlcywgYnV0IGdvb2QgZW5vdWdoIGZvciBub3cuXG4gICAgY29uc3QgczEgPSAkKFwiI1wiICsgc3ByaXRlMU5hbWUpO1xuICAgIGNvbnN0IGZpbHRlciA9IGZpbHRlclN0cjtcblxuICAgIHZhciByZXN1bHRMaXN0ID0gW107XG5cbiAgICAvL2lmICh0aGlzICE9PSAkLmdhbWVRdWVyeS5wbGF5Z3JvdW5kKSB7XG4gICAgLy8gV2UgbXVzdCBmaW5kIGFsbCB0aGUgZWxlbWVudHMgdGhhdCB0b3VjaGUgJ3RoaXMnXG4gICAgdmFyIGVsZW1lbnRzVG9DaGVjayA9IG5ldyBBcnJheSgpO1xuICAgIGVsZW1lbnRzVG9DaGVjay5wdXNoKCQuZ2FtZVF1ZXJ5LnNjZW5lZ3JhcGguY2hpbGRyZW4oZmlsdGVyKS5nZXQoKSk7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZWxlbWVudHNUb0NoZWNrLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHZhciBzdWJMZW4gPSBlbGVtZW50c1RvQ2hlY2tbaV0ubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoc3ViTGVuLS0pIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50VG9DaGVjayA9IGVsZW1lbnRzVG9DaGVja1tpXVtzdWJMZW5dO1xuICAgICAgICAgICAgLy8gSXMgaXQgYSBnYW1lUXVlcnkgZ2VuZXJhdGVkIGVsZW1lbnQ/XG4gICAgICAgICAgICBpZiAoZWxlbWVudFRvQ2hlY2suZ2FtZVF1ZXJ5KSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgZG9uJ3Qgd2FudCB0byBjaGVjayBncm91cHNcbiAgICAgICAgICAgICAgICBpZiAoIWVsZW1lbnRUb0NoZWNrLmdhbWVRdWVyeS5ncm91cCAmJiAhZWxlbWVudFRvQ2hlY2suZ2FtZVF1ZXJ5LnRpbGVTZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRG9lcyBpdCB0b3VjaGUgdGhlIHNlbGVjdGlvbj9cbiAgICAgICAgICAgICAgICAgICAgaWYgKHMxWzBdICE9IGVsZW1lbnRUb0NoZWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBib3VuZGluZyBjaXJjbGUgY29sbGlzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAvKnZhciBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhvZmZzZXRZICsgZ2FtZVF1ZXJ5LmJvdW5kaW5nQ2lyY2xlLnkgLSBlbGVtZW50c1RvQ2hlY2tbaV0ub2Zmc2V0WSAtIGVsZW1lbnRUb0NoZWNrLmdhbWVRdWVyeS5ib3VuZGluZ0NpcmNsZS55LCAyKSArIE1hdGgucG93KG9mZnNldFggKyBnYW1lUXVlcnkuYm91bmRpbmdDaXJjbGUueCAtIGVsZW1lbnRzVG9DaGVja1tpXS5vZmZzZXRYIC0gZWxlbWVudFRvQ2hlY2suZ2FtZVF1ZXJ5LmJvdW5kaW5nQ2lyY2xlLngsIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSAtIGdhbWVRdWVyeS5ib3VuZGluZ0NpcmNsZS5yYWRpdXMgLSBlbGVtZW50VG9DaGVjay5nYW1lUXVlcnkuYm91bmRpbmdDaXJjbGUucmFkaXVzIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayByZWFsIGNvbGxpc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRpdnNIaXQoczFbMF0sIGVsZW1lbnRUb0NoZWNrKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaWYgKGNvbGxpZGUoZ2FtZVF1ZXJ5LCB7IHg6IG9mZnNldFgsIHk6IG9mZnNldFkgfSwgZWxlbWVudFRvQ2hlY2suZ2FtZVF1ZXJ5LCB7IHg6IGVsZW1lbnRzVG9DaGVja1tpXS5vZmZzZXRYLCB5OiBlbGVtZW50c1RvQ2hlY2tbaV0ub2Zmc2V0WSB9KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdRJ3MgY29sbGlkZSBpcyB2ZXJ5IGJyb2tlbiBpZiByb3RhdGlvbiBhcHBsaWVkXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBZGQgdG8gdGhlIHJlc3VsdCBsaXN0IGlmIGNvbGxpc2lvbiBkZXRlY3RlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdExpc3QucHVzaChlbGVtZW50c1RvQ2hlY2tbaV1bc3ViTGVuXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvL31cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIGNoaWxkcmVuIG5vZGVzIHRvIHRoZSBsaXN0XG4gICAgICAgICAgICAgICAgdmFyIGVsZUNoaWxkcmVuID0gJChlbGVtZW50VG9DaGVjaykuY2hpbGRyZW4oZmlsdGVyKTtcbiAgICAgICAgICAgICAgICBpZiAoZWxlQ2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzVG9DaGVjay5wdXNoKGVsZUNoaWxkcmVuLmdldCgpKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHNUb0NoZWNrW2xlbl0ub2Zmc2V0WCA9IGVsZW1lbnRUb0NoZWNrLmdhbWVRdWVyeS5wb3N4ICsgZWxlbWVudHNUb0NoZWNrW2ldLm9mZnNldFg7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzVG9DaGVja1tsZW5dLm9mZnNldFkgPSBlbGVtZW50VG9DaGVjay5nYW1lUXVlcnkucG9zeSArIGVsZW1lbnRzVG9DaGVja1tpXS5vZmZzZXRZO1xuICAgICAgICAgICAgICAgICAgICBsZW4rKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0TGlzdDtcbn07XG5cbmV4cG9ydCB0eXBlIFNwcml0ZUhpdERpcmVjdGlvbmFsaXR5ID0ge1xuICAgIFwibGVmdFwiOiBib29sZWFuO1xuICAgIFwicmlnaHRcIjogYm9vbGVhbjtcbiAgICBcInVwXCI6IGJvb2xlYW47XG4gICAgXCJkb3duXCI6IGJvb2xlYW47XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZUhpdERpcmVjdGlvbiA9IChcbiAgICBzcHJpdGUxSWQ6IHN0cmluZyxcbiAgICBzcHJpdGUxWDogbnVtYmVyLFxuICAgIHNwcml0ZTFZOiBudW1iZXIsXG4gICAgc3ByaXRlMVhTcGVlZDogbnVtYmVyLFxuICAgIHNwcml0ZTFZU3BlZWQ6IG51bWJlcixcbiAgICBzcHJpdGUxV2lkdGg6IG51bWJlcixcbiAgICBzcHJpdGUxSGVpZ2h0OiBudW1iZXIsXG4gICAgc3ByaXRlMklkOiBzdHJpbmcsXG4gICAgc3ByaXRlMlg6IG51bWJlcixcbiAgICBzcHJpdGUyWTogbnVtYmVyLFxuICAgIHNwcml0ZTJYU3BlZWQ6IG51bWJlcixcbiAgICBzcHJpdGUyWVNwZWVkOiBudW1iZXIsXG4gICAgc3ByaXRlMldpZHRoOiBudW1iZXIsXG4gICAgc3ByaXRlMkhlaWdodDogbnVtYmVyXG4pOiBTcHJpdGVIaXREaXJlY3Rpb25hbGl0eSA9PiB7XG4gICAgdmFyIHNwcml0ZTFJbmZvOiBTcHJpdGVEaWN0ID0ge1xuICAgICAgICBcImlkXCI6IHNwcml0ZTFJZCxcbiAgICAgICAgXCJ4UG9zXCI6IHNwcml0ZTFYLFxuICAgICAgICBcInlQb3NcIjogc3ByaXRlMVksXG4gICAgICAgIFwieFNwZWVkXCI6IHNwcml0ZTFYU3BlZWQsXG4gICAgICAgIFwieVNwZWVkXCI6IHNwcml0ZTFZU3BlZWQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHNwcml0ZTFIZWlnaHQsXG4gICAgICAgIFwid2lkdGhcIjogc3ByaXRlMVdpZHRoXG4gICAgfTtcbiAgICB2YXIgc3ByaXRlMkluZm86IFNwcml0ZURpY3QgPSB7XG4gICAgICAgIFwiaWRcIjogc3ByaXRlMklkLFxuICAgICAgICBcInhQb3NcIjogc3ByaXRlMlgsXG4gICAgICAgIFwieVBvc1wiOiBzcHJpdGUyWSxcbiAgICAgICAgXCJ4U3BlZWRcIjogc3ByaXRlMlhTcGVlZCxcbiAgICAgICAgXCJ5U3BlZWRcIjogc3ByaXRlMllTcGVlZCxcbiAgICAgICAgXCJoZWlnaHRcIjogc3ByaXRlMkhlaWdodCxcbiAgICAgICAgXCJ3aWR0aFwiOiBzcHJpdGUyV2lkdGhcbiAgICB9O1xuICAgIHJldHVybiBzcHJpdGVIaXREaXIoc3ByaXRlMUluZm8sIHNwcml0ZTJJbmZvKTtcbn07XG5cbmV4cG9ydCB0eXBlIFNwcml0ZVBoeXNpY2FsRGltZW5zaW9ucyA9IHtcbiAgICBcInhQb3NcIjogbnVtYmVyO1xuICAgIFwieVBvc1wiOiBudW1iZXI7XG4gICAgXCJ4U3BlZWRcIjogbnVtYmVyOyAvLyBtb3ZlbWVudCBtdXN0IGJlIGJ5IGRpY3Rpb25hcnksXG4gICAgXCJ5U3BlZWRcIjogbnVtYmVyOyAvLyB3aXRoIHNvbWV0aGluZyBsaWtlIHggPSB4ICsgeFNwZWVkXG4gICAgXCJ3aWR0aFwiOiBudW1iZXI7XG4gICAgXCJoZWlnaHRcIjogbnVtYmVyO1xufTtcbmV4cG9ydCB0eXBlIFNwcml0ZURpY3QgPSBTcHJpdGVQaHlzaWNhbERpbWVuc2lvbnMgJiB7XG4gICAgXCJpZFwiOiBzdHJpbmc7XG4gICAgW3M6IHN0cmluZ106IGFueTtcbn07XG5jb25zdCBzcHJpdGVzU3BlZWRTYW1wbGVzOiB7IFtrOiBzdHJpbmddOiB7IHNhbXBsZVNpemU6IG51bWJlciwgeFNwZWVkU2FtcGxlczogbnVtYmVyW10sIHlTcGVlZFNhbXBsZXM6IG51bWJlcltdLCBjaGVja2VkOiBib29sZWFuIH0gfSA9IHt9O1xuY29uc3QgY2hlY2tTcHJpdGVTcGVlZFVzYWdlQ29tbW9uRXJyb3JzID0gKHNwcml0ZUluZm86IFNwcml0ZURpY3QpID0+IHtcbiAgICAvLyBBIGhldXJpc3RpYyBjaGVjayBmb3IgY29tbW9uIGVycm9ycyBmcm9tIGxlYXJuZXJzLlxuICAgIC8vIENoZWNrIGlmIHNwcml0ZSBzcGVlZHMgZXZlciBjaGFuZ2UuICBJZiBub3QsIHByb2JhYmx5IGRvaW5nIGl0IHdyb25nLlxuICAgIGlmICghc3ByaXRlc1NwZWVkU2FtcGxlc1tzcHJpdGVJbmZvW1wiaWRcIl1dKSB7XG4gICAgICAgIHNwcml0ZXNTcGVlZFNhbXBsZXNbc3ByaXRlSW5mb1tcImlkXCJdXSA9IHtcbiAgICAgICAgICAgIHNhbXBsZVNpemU6IDAsXG4gICAgICAgICAgICB4U3BlZWRTYW1wbGVzOiBbXSxcbiAgICAgICAgICAgIHlTcGVlZFNhbXBsZXM6IFtdLFxuICAgICAgICAgICAgY2hlY2tlZDogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzcHJpdGUxU2FtcGxpbmcgPSBzcHJpdGVzU3BlZWRTYW1wbGVzW3Nwcml0ZUluZm9bXCJpZFwiXV07XG4gICAgICAgIGNvbnN0IG1heFNhbXBsZVNpemUgPSAxMDtcbiAgICAgICAgaWYgKHNwcml0ZTFTYW1wbGluZy5zYW1wbGVTaXplIDwgbWF4U2FtcGxlU2l6ZSkge1xuICAgICAgICAgICAgKytzcHJpdGUxU2FtcGxpbmcuc2FtcGxlU2l6ZTtcbiAgICAgICAgICAgIHNwcml0ZTFTYW1wbGluZy54U3BlZWRTYW1wbGVzLnB1c2goc3ByaXRlSW5mb1tcInhTcGVlZFwiXSk7XG4gICAgICAgICAgICBzcHJpdGUxU2FtcGxpbmcueVNwZWVkU2FtcGxlcy5wdXNoKHNwcml0ZUluZm9bXCJ5U3BlZWRcIl0pO1xuICAgICAgICB9IGVsc2UgaWYgKCFzcHJpdGUxU2FtcGxpbmcuY2hlY2tlZCkge1xuICAgICAgICAgICAgc3ByaXRlMVNhbXBsaW5nLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgY29uc3Qgc3MgPSBzcHJpdGUxU2FtcGxpbmcuc2FtcGxlU2l6ZTtcbiAgICAgICAgICAgIGNvbnN0IHN4U2FtcGxlcyA9IHNwcml0ZTFTYW1wbGluZy54U3BlZWRTYW1wbGVzO1xuICAgICAgICAgICAgY29uc3Qgc3lTYW1wbGVzID0gc3ByaXRlMVNhbXBsaW5nLnlTcGVlZFNhbXBsZXM7XG5cbiAgICAgICAgICAgIGxldCBzYW1lWHNwZWVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc3M7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChzeFNhbXBsZXNbaV0gIT09IHN4U2FtcGxlc1tpIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgc2FtZVhzcGVlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2FtZVhzcGVlZCAmJiBzeFNhbXBsZXNbMF0gIT09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhHUUdfV0FSTklOR19JTl9NWVBST0dSQU1fTVNHXG4gICAgICAgICAgICAgICAgICAgICsgXCJzcHJpdGUgaGl0IGRpcmVjdGlvbiBmdW5jdGlvbmFsaXR5LSBwb3NzaWJseSB3cm9uZyB4UG9zIGNhbGN1bGF0aW9uIGZvciBzcHJpdGU6IFwiXG4gICAgICAgICAgICAgICAgICAgICsgc3ByaXRlSW5mb1tcImlkXCJdXG4gICAgICAgICAgICAgICAgICAgICsgXCIuICBFbnN1cmUgeFNwZWVkIHVzZWQgdmFsaWRseSBpZiBzcHJpdGUgaGl0IGRpcmVjdGlvbmFsaXR5IHNlZW1zIHdyb25nLlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHNhbWVZc3BlZWQgPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBzczsgKytpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN5U2FtcGxlc1tpXSAhPT0gc3lTYW1wbGVzW2kgLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICBzYW1lWXNwZWVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzYW1lWXNwZWVkICYmIHN5U2FtcGxlc1swXSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKEdRR19XQVJOSU5HX0lOX01ZUFJPR1JBTV9NU0dcbiAgICAgICAgICAgICAgICAgICAgKyBcInNwcml0ZSBoaXQgZGlyZWN0aW9uIGZ1bmN0aW9uYWxpdHktIHBvc3NpYmx5IHdyb25nIHlQb3MgY2FsY3VsYXRpb24gZm9yIHNwcml0ZTogXCJcbiAgICAgICAgICAgICAgICAgICAgKyBzcHJpdGVJbmZvW1wiaWRcIl1cbiAgICAgICAgICAgICAgICAgICAgKyBcIi4gIEVuc3VyZSB5U3BlZWQgdXNlZCB2YWxpZGx5IGlmIHNwcml0ZSBoaXQgZGlyZWN0aW9uYWxpdHkgc2VlbXMgd3JvbmcuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZUhpdERpciA9IChcbiAgICBzcHJpdGUxSW5mbzogU3ByaXRlRGljdCxcbiAgICBzcHJpdGUySW5mbzogU3ByaXRlRGljdFxuKTogU3ByaXRlSGl0RGlyZWN0aW9uYWxpdHkgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgY2hlY2tTcHJpdGVTcGVlZFVzYWdlQ29tbW9uRXJyb3JzKHNwcml0ZTFJbmZvKTtcbiAgICAgICAgY2hlY2tTcHJpdGVTcGVlZFVzYWdlQ29tbW9uRXJyb3JzKHNwcml0ZTJJbmZvKTtcbiAgICB9XG4gICAgcmV0dXJuIHNwcml0ZUhpdERpckltcGwoc3ByaXRlMUluZm8sIHNwcml0ZTJJbmZvKTtcbn1cbmNvbnN0IHNwcml0ZUhpdERpckltcGwgPSAoXG4gICAgc3ByaXRlMUluZm86IFNwcml0ZVBoeXNpY2FsRGltZW5zaW9ucyxcbiAgICBzcHJpdGUySW5mbzogU3ByaXRlUGh5c2ljYWxEaW1lbnNpb25zXG4pOiBTcHJpdGVIaXREaXJlY3Rpb25hbGl0eSA9PiB7XG4gICAgLypcbiAgICAgICBSZXR1cm5zIHRoZSBkaXJlY3Rpb24gdGhhdCBzcHJpdGUgMSBoaXRzIHNwcml0ZSAyIGZyb20uXG4gICAgICAgc3ByaXRlIDEgaXMgcmVsYXRpdmVseSBsZWZ0L3JpZ2h0L3VwL2Rvd24gb2Ygc3ByaXRlIDJcbiAgICAgICBcbiAgICAgICBIaXQgZGlyZWN0aW9uIHJldHVybmVkIGNvdWxkIGJlIG11bHRpcGxlIHZhbHVlcyAoZS5nLiBsZWZ0IGFuZCB1cCksXG4gICAgICAgYW5kIGlzIHJldHVybmVkIGJ5IHRoaXMgZnVuY3Rpb24gYXMgYSBkaWN0aW9uYXJ5IGFzLCBlLmcuXG4gICAgICAge1xuICAgICAgIFwibGVmdFwiOiBmYWxzZSxcbiAgICAgICBcInJpZ2h0XCI6IGZhbHNlLFxuICAgICAgIFwidXBcIjogZmFsc2UsXG4gICAgICAgXCJkb3duXCI6IGZhbHNlXG4gICAgICAgfVxuICAgICAgIFxuICAgICAgIFBhcmFtZXRlcnMgc3ByaXRlezEsMn1JbmZvIGFyZSBkaWN0aW9uYXJpZXMgd2l0aCBhdCBsZWFzdCB0aGVzZSBrZXlzOlxuICAgICAgIHtcbiAgICAgICBcImlkXCI6IFwiYWN0dWFsU3ByaXRlTmFtZVwiLFxuICAgICAgIFwieFBvc1wiOiA1MDAsXG4gICAgICAgXCJ5UG9zXCI6IDIwMCxcbiAgICAgICBcInhTcGVlZFwiOiAtOCwgIC8vIG1vdmVtZW50IG11c3QgYmUgYnkgZGljdGlvbmFyeSxcbiAgICAgICBcInlTcGVlZFwiOiAwLCAgIC8vIHdpdGggc29tZXRoaW5nIGxpa2UgeCA9IHggKyB4U3BlZWRcbiAgICAgICBcImhlaWdodFwiOiA3NCxcbiAgICAgICBcIndpZHRoXCI6IDc1XG4gICAgICAgfVxuICAgICAgICovXG5cbiAgICB2YXIgcGVyY2VudE1hcmdpbiA9IDEuMTsgLy8gcG9zaXRpdmUgcGVyY2VudCBpbiBkZWNpbWFsXG4gICAgdmFyIGRpcjogU3ByaXRlSGl0RGlyZWN0aW9uYWxpdHkgPSB7XG4gICAgICAgIFwibGVmdFwiOiBmYWxzZSxcbiAgICAgICAgXCJyaWdodFwiOiBmYWxzZSxcbiAgICAgICAgXCJ1cFwiOiBmYWxzZSxcbiAgICAgICAgXCJkb3duXCI6IGZhbHNlXG4gICAgfTtcblxuICAgIC8vIGN1cnJlbnQgaG9yaXpvbnRhbCBwb3NpdGlvblxuICAgIHZhciBzMWxlZnQgPSBzcHJpdGUxSW5mb1tcInhQb3NcIl07XG4gICAgdmFyIHMxcmlnaHQgPSBzMWxlZnQgKyBzcHJpdGUxSW5mb1tcIndpZHRoXCJdO1xuXG4gICAgdmFyIHMybGVmdCA9IHNwcml0ZTJJbmZvW1wieFBvc1wiXTtcbiAgICB2YXIgczJyaWdodCA9IHMybGVmdCArIHNwcml0ZTJJbmZvW1wid2lkdGhcIl07XG5cbiAgICAvLyByZXZlcnNlIGhvcml6b250YWwgcG9zaXRpb24gYnkgeFNwZWVkIHdpdGggcGVyY2VudCBtYXJnaW5cbiAgICB2YXIgc3ByaXRlMVhTcGVlZCA9IHNwcml0ZTFJbmZvW1wieFNwZWVkXCJdICogcGVyY2VudE1hcmdpbjtcbiAgICBzMWxlZnQgPSBzMWxlZnQgLSBzcHJpdGUxWFNwZWVkO1xuICAgIHMxcmlnaHQgPSBzMXJpZ2h0IC0gc3ByaXRlMVhTcGVlZDtcblxuICAgIHZhciBzcHJpdGUyWFNwZWVkID0gc3ByaXRlMkluZm9bXCJ4U3BlZWRcIl0gKiBwZXJjZW50TWFyZ2luO1xuICAgIHMybGVmdCA9IHMybGVmdCAtIHNwcml0ZTJYU3BlZWQ7XG4gICAgczJyaWdodCA9IHMycmlnaHQgLSBzcHJpdGUyWFNwZWVkO1xuXG4gICAgaWYgKHMxcmlnaHQgPD0gczJsZWZ0KSB7XG4gICAgICAgIGRpcltcImxlZnRcIl0gPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoczJyaWdodCA8PSBzMWxlZnQpIHtcbiAgICAgICAgZGlyW1wicmlnaHRcIl0gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIGN1cnJlbnQgdmVydGljYWwgcG9zaXRpb25cbiAgICB2YXIgczF0b3AgPSBzcHJpdGUxSW5mb1tcInlQb3NcIl07XG4gICAgdmFyIHMxYm90dG9tID0gczF0b3AgKyBzcHJpdGUxSW5mb1tcImhlaWdodFwiXTtcblxuICAgIHZhciBzMnRvcCA9IHNwcml0ZTJJbmZvW1wieVBvc1wiXTtcbiAgICB2YXIgczJib3R0b20gPSBzMnRvcCArIHNwcml0ZTJJbmZvW1wiaGVpZ2h0XCJdO1xuXG4gICAgLy8gcmV2ZXJzZSB2ZXJ0aWNhbCBwb3NpdGlvbiBieSB5U3BlZWQgd2l0aCBwZXJjZW50IG1hcmdpblxuICAgIHZhciBzcHJpdGUxWVNwZWVkID0gc3ByaXRlMUluZm9bXCJ5U3BlZWRcIl0gKiBwZXJjZW50TWFyZ2luO1xuICAgIHMxdG9wID0gczF0b3AgLSBzcHJpdGUxWVNwZWVkO1xuICAgIHMxYm90dG9tID0gczFib3R0b20gLSBzcHJpdGUxWVNwZWVkO1xuXG4gICAgdmFyIHNwcml0ZTJZU3BlZWQgPSBzcHJpdGUySW5mb1tcInlTcGVlZFwiXSAqIHBlcmNlbnRNYXJnaW47XG4gICAgczJ0b3AgPSBzMnRvcCAtIHNwcml0ZTJZU3BlZWQ7XG4gICAgczJib3R0b20gPSBzMmJvdHRvbSAtIHNwcml0ZTJZU3BlZWQ7XG5cbiAgICBpZiAoczFib3R0b20gPD0gczJ0b3ApIHtcbiAgICAgICAgZGlyW1widXBcIl0gPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoczJib3R0b20gPD0gczF0b3ApIHtcbiAgICAgICAgZGlyW1wiZG93blwiXSA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpcjtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRLZXlTdGF0ZSA9IChrZXk6IG51bWJlcik6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiAhISQuZ1Eua2V5VHJhY2tlcltrZXldO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldE1vdXNlWCA9ICgpOiBudW1iZXIgPT4ge1xuICAgIHJldHVybiAkLmdRLm1vdXNlVHJhY2tlci54O1xufTtcbmV4cG9ydCBjb25zdCBnZXRNb3VzZVkgPSAoKTogbnVtYmVyID0+IHtcbiAgICByZXR1cm4gJC5nUS5tb3VzZVRyYWNrZXIueTtcbn07XG5leHBvcnQgY29uc3QgZ2V0TW91c2VCdXR0b24xID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiAhISQuZ1EubW91c2VUcmFja2VyWzFdO1xufTtcbmV4cG9ydCBjb25zdCBnZXRNb3VzZUJ1dHRvbjIgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgcmV0dXJuICEhJC5nUS5tb3VzZVRyYWNrZXJbMl07XG59O1xuZXhwb3J0IGNvbnN0IGdldE1vdXNlQnV0dG9uMyA9ICgpOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gISEkLmdRLm1vdXNlVHJhY2tlclszXTtcbn07XG5cbmV4cG9ydCBjb25zdCBkaXNhYmxlQ29udGV4dE1lbnUgPSAoKTogdm9pZCA9PiB7XG4gICAgLy8gc2VlIGFsc286IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ5MjAyMjEvanF1ZXJ5LWpzLXByZXZlbnQtcmlnaHQtY2xpY2stbWVudS1pbi1icm93c2Vyc1xuICAgIC8vICQoXCIjcGxheWdyb3VuZFwiKS5jb250ZXh0bWVudShmdW5jdGlvbigpe3JldHVybiBmYWxzZTt9KTtcbiAgICAkKFwiI3BsYXlncm91bmRcIikub24oXCJjb250ZXh0bWVudVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbn07XG5leHBvcnQgY29uc3QgZW5hYmxlQ29udGV4dE1lbnUgPSAoKTogdm9pZCA9PiB7XG4gICAgLy8gc2VlIGFsc286IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ5MjAyMjEvanF1ZXJ5LWpzLXByZXZlbnQtcmlnaHQtY2xpY2stbWVudS1pbi1icm93c2Vyc1xuICAgICQoXCIjcGxheWdyb3VuZFwiKS5vZmYoXCJjb250ZXh0bWVudVwiKTtcbn07XG5cbmV4cG9ydCBjb25zdCBoaWRlTW91c2VDdXJzb3IgPSAoKTogdm9pZCA9PiB7XG4gICAgJChcIiNwbGF5Z3JvdW5kXCIpLmNzcyhcImN1cnNvclwiLCBcIm5vbmVcIik7XG59O1xuZXhwb3J0IGNvbnN0IHNob3dNb3VzZUN1cnNvciA9ICgpOiB2b2lkID0+IHtcbiAgICAkKFwiI3BsYXlncm91bmRcIikuY3NzKFwiY3Vyc29yXCIsIFwiZGVmYXVsdFwiKTtcbn07XG5cbmV4cG9ydCBjb25zdCBzYXZlRGljdGlvbmFyeUFzID0gKHNhdmVBczogc3RyaW5nLCBkaWN0aW9uYXJ5OiBvYmplY3QpOiB2b2lkID0+IHtcbiAgICAvLyByZXF1aXJlcyBqcy1jb29raWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qcy1jb29raWUvanMtY29va2llL3RyZWUvdjIuMC40XG4gICAgQ29va2llcy5zZXQoXCJHUUdfXCIgKyBzYXZlQXMsIGRpY3Rpb25hcnkpO1xufTtcbmV4cG9ydCBjb25zdCBnZXRTYXZlZERpY3Rpb25hcnkgPSAoc2F2ZWRBczogc3RyaW5nKTogb2JqZWN0ID0+IHtcbiAgICByZXR1cm4gQ29va2llcy5nZXRKU09OKFwiR1FHX1wiICsgc2F2ZWRBcyk7XG59O1xuZXhwb3J0IGNvbnN0IGRlbGV0ZVNhdmVkRGljdGlvbmFyeSA9IChzYXZlZEFzOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBDb29raWVzLnJlbW92ZShcIkdRR19cIiArIHNhdmVkQXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZU92YWxJbkdyb3VwID0gKFxuICAgIGdyb3VwTmFtZTogc3RyaW5nIHwgbnVsbCxcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICAvLyByb3RkZWcgaW4gZGVncmVlcyBjbG9ja3dpc2Ugb24gc2NyZWVuIChyZWNhbGwgeS1heGlzIHBvaW50cyBkb3dud2FyZHMhKVxuXG4gICAgaWYgKCFjb2xvcikge1xuICAgICAgICBjb2xvciA9IFwiZ3JheVwiO1xuICAgIH1cblxuICAgIGlmICghZ3JvdXBOYW1lKSB7XG4gICAgICAgICQucGxheWdyb3VuZCgpLmFkZFNwcml0ZShpZCwgeyB3aWR0aDogMSwgaGVpZ2h0OiAxIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNyZWF0ZVNwcml0ZUluR3JvdXAoZ3JvdXBOYW1lLCBpZCwgeyB3aWR0aDogMSwgaGVpZ2h0OiAxIH0pO1xuICAgIH1cblxuICAgIHZhciBib3JkZXJfcmFkaXVzID0gKHcgLyAyICsgXCJweCAvIFwiICsgaCAvIDIgKyBcInB4XCIpO1xuICAgIHNwcml0ZShpZClcbiAgICAgICAgLmNzcyhcImJhY2tncm91bmRcIiwgY29sb3IpXG4gICAgICAgIC5jc3MoXCJib3JkZXItcmFkaXVzXCIsIGJvcmRlcl9yYWRpdXMpXG4gICAgICAgIC5jc3MoXCItbW96LWJvcmRlci1yYWRpdXNcIiwgYm9yZGVyX3JhZGl1cylcbiAgICAgICAgLmNzcyhcIi13ZWJraXQtYm9yZGVyLXJhZGl1c1wiLCBib3JkZXJfcmFkaXVzKTtcblxuICAgIHNwcml0ZVNldFdpZHRoSGVpZ2h0KGlkLCB3LCBoKTtcbiAgICBzcHJpdGVTZXRYWShpZCwgeCwgeSk7XG5cbiAgICBpZiAocm90ZGVnKSB7XG4gICAgICAgIGlmIChyb3RPcmlnaW5YICYmIHJvdE9yaWdpblkpIHtcbiAgICAgICAgICAgIHZhciByb3RPcmlnaW4gPSByb3RPcmlnaW5YICsgXCJweCBcIiArIHJvdE9yaWdpblkgKyBcInB4XCI7XG4gICAgICAgICAgICBzcHJpdGUoaWQpXG4gICAgICAgICAgICAgICAgLmNzcyhcIi13ZWJraXQtdHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pXG4gICAgICAgICAgICAgICAgLmNzcyhcIi1tb3otdHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pXG4gICAgICAgICAgICAgICAgLmNzcyhcIi1tcy10cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbilcbiAgICAgICAgICAgICAgICAuY3NzKFwiLW8tdHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pXG4gICAgICAgICAgICAgICAgLmNzcyhcInRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKTtcbiAgICAgICAgfVxuICAgICAgICBzcHJpdGVSb3RhdGUoaWQsIHJvdGRlZyk7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVPdmFsID0gKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICB3OiBudW1iZXIsXG4gICAgaDogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHJvdGRlZz86IG51bWJlcixcbiAgICByb3RPcmlnaW5YPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblk/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZU92YWxJbkdyb3VwKFxuICAgICAgICBudWxsLFxuICAgICAgICBpZCxcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgdyxcbiAgICAgICAgaCxcbiAgICAgICAgY29sb3IsXG4gICAgICAgIHJvdGRlZyxcbiAgICAgICAgcm90T3JpZ2luWCxcbiAgICAgICAgcm90T3JpZ2luWVxuICAgICk7XG59O1xuZXhwb3J0IGNvbnN0IGRyYXdPdmFsID0gKFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVPdmFsKFxuICAgICAgICBcIkdRR19vdmFsX1wiICsgR1FHX2dldFVuaXF1ZUlkKCksXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHcsXG4gICAgICAgIGgsXG4gICAgICAgIGNvbG9yLFxuICAgICAgICByb3RkZWcsXG4gICAgICAgIHJvdE9yaWdpblgsXG4gICAgICAgIHJvdE9yaWdpbllcbiAgICApO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVDaXJjbGVJbkdyb3VwID0gKFxuICAgIGdyb3VwTmFtZTogc3RyaW5nIHwgbnVsbCxcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgcjogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHJvdGRlZz86IG51bWJlcixcbiAgICByb3RPcmlnaW5YPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblk/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZU92YWxJbkdyb3VwKFxuICAgICAgICBncm91cE5hbWUsXG4gICAgICAgIGlkLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICByLFxuICAgICAgICByLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlQ2lyY2xlID0gKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICByOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgY3JlYXRlQ2lyY2xlSW5Hcm91cChcbiAgICAgICAgbnVsbCxcbiAgICAgICAgaWQsXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHIsXG4gICAgICAgIGNvbG9yLFxuICAgICAgICByb3RkZWcsXG4gICAgICAgIHJvdE9yaWdpblgsXG4gICAgICAgIHJvdE9yaWdpbllcbiAgICApO1xufTtcbmV4cG9ydCBjb25zdCBkcmF3Q2lyY2xlID0gKFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgcjogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHJvdGRlZz86IG51bWJlcixcbiAgICByb3RPcmlnaW5YPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblk/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZUNpcmNsZShcbiAgICAgICAgXCJHUUdfY2lyY2xlX1wiICsgR1FHX2dldFVuaXF1ZUlkKCksXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHIsXG4gICAgICAgIGNvbG9yLFxuICAgICAgICByb3RkZWcsXG4gICAgICAgIHJvdE9yaWdpblgsXG4gICAgICAgIHJvdE9yaWdpbllcbiAgICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVJlY3RJbkdyb3VwID0gKFxuICAgIGdyb3VwTmFtZTogc3RyaW5nIHwgbnVsbCxcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICAvLyByb3RkZWcgaW4gZGVncmVlcyBjbG9ja3dpc2Ugb24gc2NyZWVuIChyZWNhbGwgeS1heGlzIHBvaW50cyBkb3dud2FyZHMhKVxuICAgIC8vIHJvdE9yaWdpbntYLFl9IG11c3QgYmUgd2l0aGluIHJhbmdlIG9mIHdpZGUgdyBhbmQgaGVpZ2h0IGgsIGFuZCByZWxhdGl2ZSB0byBjb29yZGluYXRlICh4LHkpLlxuXG4gICAgaWYgKCFjb2xvcikge1xuICAgICAgICBjb2xvciA9IFwiZ3JheVwiO1xuICAgIH1cblxuICAgIGlmICghZ3JvdXBOYW1lKSB7XG4gICAgICAgICQucGxheWdyb3VuZCgpLmFkZFNwcml0ZShpZCwgeyB3aWR0aDogMSwgaGVpZ2h0OiAxIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNyZWF0ZVNwcml0ZUluR3JvdXAoZ3JvdXBOYW1lLCBpZCwgeyB3aWR0aDogMSwgaGVpZ2h0OiAxIH0pO1xuICAgIH1cblxuICAgIHNwcml0ZShpZCkuY3NzKFwiYmFja2dyb3VuZFwiLCBjb2xvcik7XG5cbiAgICBzcHJpdGVTZXRXaWR0aEhlaWdodChpZCwgdywgaCk7XG4gICAgc3ByaXRlU2V0WFkoaWQsIHgsIHkpO1xuXG4gICAgaWYgKHJvdGRlZykge1xuICAgICAgICBpZiAocm90T3JpZ2luWCAmJiByb3RPcmlnaW5ZKSB7XG4gICAgICAgICAgICB2YXIgcm90T3JpZ2luID0gcm90T3JpZ2luWCArIFwicHggXCIgKyByb3RPcmlnaW5ZICsgXCJweFwiO1xuICAgICAgICAgICAgc3ByaXRlKGlkKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItd2Via2l0LXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItbW96LXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItbXMtdHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pXG4gICAgICAgICAgICAgICAgLmNzcyhcIi1vLXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCJ0cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbik7XG4gICAgICAgIH1cbiAgICAgICAgc3ByaXRlUm90YXRlKGlkLCByb3RkZWcpO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgY3JlYXRlUmVjdCA9IChcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVSZWN0SW5Hcm91cChcbiAgICAgICAgbnVsbCxcbiAgICAgICAgaWQsXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHcsXG4gICAgICAgIGgsXG4gICAgICAgIGNvbG9yLFxuICAgICAgICByb3RkZWcsXG4gICAgICAgIHJvdE9yaWdpblgsXG4gICAgICAgIHJvdE9yaWdpbllcbiAgICApO1xufTtcbmV4cG9ydCBjb25zdCBkcmF3UmVjdCA9IChcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHc6IG51bWJlcixcbiAgICBoOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgY3JlYXRlUmVjdChcbiAgICAgICAgXCJHUUdfcmVjdF9cIiArIEdRR19nZXRVbmlxdWVJZCgpLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICB3LFxuICAgICAgICBoLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVMaW5lSW5Hcm91cCA9IChcbiAgICBncm91cE5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgaWQ6IHN0cmluZyxcbiAgICB4MTogbnVtYmVyLFxuICAgIHkxOiBudW1iZXIsXG4gICAgeDI6IG51bWJlcixcbiAgICB5MjogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHRoaWNrbmVzcz86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgaWYgKCFjb2xvcikge1xuICAgICAgICBjb2xvciA9IFwiZ3JheVwiO1xuICAgIH1cbiAgICBpZiAoIXRoaWNrbmVzcykge1xuICAgICAgICB0aGlja25lc3MgPSAyO1xuICAgIH1cbiAgICB2YXIgeGQgPSB4MiAtIHgxO1xuICAgIHZhciB5ZCA9IHkyIC0geTE7XG4gICAgdmFyIGRpc3QgPSBNYXRoLnNxcnQoeGQgKiB4ZCArIHlkICogeWQpO1xuXG4gICAgdmFyIGFyY0NvcyA9IE1hdGguYWNvcyh4ZCAvIGRpc3QpO1xuICAgIGlmICh5MiA8IHkxKSB7XG4gICAgICAgIGFyY0NvcyAqPSAtMTtcbiAgICB9XG4gICAgdmFyIHJvdGRlZyA9IGFyY0NvcyAqIDE4MCAvIE1hdGguUEk7XG5cbiAgICB2YXIgaGFsZlRoaWNrID0gdGhpY2tuZXNzIC8gMjtcbiAgICB2YXIgZHJhd1kxID0geTEgLSBoYWxmVGhpY2s7XG5cbiAgICBjcmVhdGVSZWN0SW5Hcm91cChcbiAgICAgICAgZ3JvdXBOYW1lLFxuICAgICAgICBpZCxcbiAgICAgICAgeDEsXG4gICAgICAgIGRyYXdZMSxcbiAgICAgICAgZGlzdCxcbiAgICAgICAgdGhpY2tuZXNzLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICAwLFxuICAgICAgICBoYWxmVGhpY2tcbiAgICApO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVMaW5lID0gKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgeDE6IG51bWJlcixcbiAgICB5MTogbnVtYmVyLFxuICAgIHgyOiBudW1iZXIsXG4gICAgeTI6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICB0aGlja25lc3M/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZUxpbmVJbkdyb3VwKG51bGwsIGlkLCB4MSwgeTEsIHgyLCB5MiwgY29sb3IsIHRoaWNrbmVzcyk7XG59O1xuZXhwb3J0IGNvbnN0IGRyYXdMaW5lID0gKFxuICAgIHgxOiBudW1iZXIsXG4gICAgeTE6IG51bWJlcixcbiAgICB4MjogbnVtYmVyLFxuICAgIHkyOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgdGhpY2tuZXNzPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVMaW5lKFwiR1FHX2xpbmVfXCIgKyBHUUdfZ2V0VW5pcXVlSWQoKSwgeDEsIHkxLCB4MiwgeTIsIGNvbG9yLCB0aGlja25lc3MpO1xufTtcblxuZXhwb3J0IHR5cGUgQ29udGFpbmVySXRlcmF0b3IgPSB7XG4gICAgbmV4dDogKCkgPT4gW251bWJlciwgbnVtYmVyXTtcbiAgICBoYXNOZXh0OiAoKSA9PiBib29sZWFuO1xuICAgIGN1cnJlbnQ6IG51bWJlcjtcbiAgICBlbmQ6IG51bWJlcjtcbiAgICBfa2V5czogc3RyaW5nW107XG59O1xuZXhwb3J0IHR5cGUgTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4gPSAobjogbnVtYmVyKSA9PiBudW1iZXIgfCBSZWNvcmQ8XG4gICAgbnVtYmVyLFxuICAgIG51bWJlclxuPjtcbmV4cG9ydCB0eXBlIENyZWF0ZUNvbnRhaW5lckl0ZXJhdG9yRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXJcbiAgICApOiBDb250YWluZXJJdGVyYXRvcjtcbiAgICAodGhpczogdm9pZCwgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4pOiBDb250YWluZXJJdGVyYXRvcjtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlQ29udGFpbmVySXRlcmF0b3I6IENyZWF0ZUNvbnRhaW5lckl0ZXJhdG9yRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICBzdGFydD86IG51bWJlcixcbiAgICBlbmQ/OiBudW1iZXIsXG4gICAgc3RlcHNpemU/OiBudW1iZXJcbik6IENvbnRhaW5lckl0ZXJhdG9yIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgZiA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBjb25zdCBmT3duUHJvcE5hbWVzOiBzdHJpbmdbXSA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGYpO1xuICAgICAgICBjb25zdCBpdDogQ29udGFpbmVySXRlcmF0b3IgPSB7XG4gICAgICAgICAgICBjdXJyZW50OiAwLFxuICAgICAgICAgICAgZW5kOiBmT3duUHJvcE5hbWVzLmxlbmd0aCxcbiAgICAgICAgICAgIF9rZXlzOiBmT3duUHJvcE5hbWVzLFxuICAgICAgICAgICAgbmV4dDogZnVuY3Rpb24gKHRoaXM6IENvbnRhaW5lckl0ZXJhdG9yKTogW251bWJlciwgbnVtYmVyXSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbUlkeCA9IHRoaXMuX2tleXNbdGhpcy5jdXJyZW50XTtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtOiBbbnVtYmVyLCBudW1iZXJdID0gW051bWJlcihpdGVtSWR4KSwgZltpdGVtSWR4XV07XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Kys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGFzTmV4dDogZnVuY3Rpb24gKHRoaXM6IENvbnRhaW5lckl0ZXJhdG9yKTogYm9vbGVhbiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLmN1cnJlbnQgPCB0aGlzLmVuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBpdDtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwic3RhcnQgbXVzdCBiZSBhIG51bWJlci5cIiwgc3RhcnQpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiZW5kIG11c3QgYmUgYSBudW1iZXIuXCIsIGVuZCk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJzdGVwc2l6ZSBtdXN0IGJlIGEgbnVtYmVyLlwiLCBzdGVwc2l6ZSk7XG4gICAgICAgIGlmIChzdGFydCA9PSBudWxsIHx8IGVuZCA9PSBudWxsIHx8IHN0ZXBzaXplID09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IFwiVFMgdHlwZSBoaW50XCI7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmeDogKG46IG51bWJlcikgPT4gbnVtYmVyID0gKHR5cGVvZiBmID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICAgID8gKGYgYXMgKHg6IG51bWJlcikgPT4gbnVtYmVyKVxuICAgICAgICAgICAgOiAoeDogbnVtYmVyKTogbnVtYmVyID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTnVtYmVyKGZbeF0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGl0OiBDb250YWluZXJJdGVyYXRvciA9IHtcbiAgICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uICh0aGlzOiBDb250YWluZXJJdGVyYXRvcik6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW06IFtudW1iZXIsIG51bWJlcl0gPSBbdGhpcy5jdXJyZW50LCBmeCh0aGlzLmN1cnJlbnQpXTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQgKz0gc3RlcHNpemU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGFzTmV4dDogZnVuY3Rpb24gKHRoaXM6IENvbnRhaW5lckl0ZXJhdG9yKTogYm9vbGVhbiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLmN1cnJlbnQgPCB0aGlzLmVuZCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3VycmVudDogc3RhcnQsXG4gICAgICAgICAgICBlbmQ6IGVuZCxcbiAgICAgICAgICAgIF9rZXlzOiB0eXBlb2YgZiAhPT0gXCJmdW5jdGlvblwiID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZikgOiAoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBrOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IHN0ZXBzaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIGsucHVzaChTdHJpbmcoaSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaztcbiAgICAgICAgICAgIH0pKClcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGl0O1xuICAgIH1cbn07XG5leHBvcnQgdHlwZSBHcmFwaENyZWF0aW9uT3B0aW9ucyA9IHtcbiAgICBpbnRlcnBvbGF0ZWQ6IGJvb2xlYW47XG59O1xuZXhwb3J0IHR5cGUgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnMsXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICByYWRpdXNfdGhpY2tuZXNzOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgbW9yZU9wdHM6IEdyYXBoQ3JlYXRpb25PcHRpb25zLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnMsXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIG1vcmVPcHRzOiBHcmFwaENyZWF0aW9uT3B0aW9ucyxcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgcmFkaXVzX3RoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIG1vcmVPcHRzOiBHcmFwaENyZWF0aW9uT3B0aW9ucyxcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnNcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbn07XG5leHBvcnQgdHlwZSBHcm91cE5hbWVBbmRJZFByZWZpeCA9IHtcbiAgICBcImlkXCI6IHN0cmluZztcbiAgICBcImdyb3VwXCI6IHN0cmluZztcbn07XG50eXBlIENyZWF0ZUdyYXBoV2l0aE9wdGlvbnNGblBhcmFtVHlwZXMgPSBbXG4gICAgc3RyaW5nLFxuICAgIHN0cmluZyxcbiAgICBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICBHcmFwaENyZWF0aW9uT3B0aW9uc1xuXTtcbmV4cG9ydCBjb25zdCBjcmVhdGVHcmFwaFdpdGhPcHRpb25zOiBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICBpZDogc3RyaW5nLFxuICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgIG1vcmVPcHRzOiBHcmFwaENyZWF0aW9uT3B0aW9uc1xuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXgge1xuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIG1vcmVPcHRzLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIHJhZGl1c190aGlja25lc3MpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgbW9yZU9wdHMsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBtb3JlT3B0cywgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgbW9yZU9wdHMsIGNvbG9yLCByYWRpdXNfdGhpY2tuZXNzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIG1vcmVPcHRzLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBtb3JlT3B0cylcbiAgICAvLyBtb3JlT3B0cyA9IHtcImludGVycG9sYXRlZFwiOiB0cnVlT3JGYWxzZX1cbiAgICB2YXIgaW50ZXJwb2xhdGVkID0gbW9yZU9wdHNbXCJpbnRlcnBvbGF0ZWRcIl07XG5cbiAgICBpZiAoIWlkKSB7XG4gICAgICAgIGlkID0gXCJHUUdfZ3JhcGhfXCIgKyBHUUdfZ2V0VW5pcXVlSWQoKTtcbiAgICB9XG4gICAgaWYgKCFncm91cE5hbWUpIHtcbiAgICAgICAgZ3JvdXBOYW1lID0gaWQgKyBcIl9ncm91cFwiO1xuICAgICAgICBjcmVhdGVHcm91cEluUGxheWdyb3VuZChncm91cE5hbWUpO1xuICAgIH1cbiAgICB2YXIgZ3JvdXBfaWQgPSB7XG4gICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgIFwiZ3JvdXBcIjogZ3JvdXBOYW1lXG4gICAgfTtcblxuICAgIHZhciBjb2xvcjtcbiAgICB2YXIgcmFkaXVzX3RoaWNrbmVzcztcbiAgICBsZXQgaXRlcjogQ29udGFpbmVySXRlcmF0b3I7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCAmJiBhcmd1bWVudHMubGVuZ3RoIDw9IDYgJiZcbiAgICAgICAgXCJvYmplY3RcIiA9PT0gdHlwZW9mIChmKSkge1xuICAgICAgICBjb2xvciA9IGFyZ3VtZW50c1s0XTtcbiAgICAgICAgcmFkaXVzX3RoaWNrbmVzcyA9IGFyZ3VtZW50c1s1XTtcbiAgICAgICAgaXRlciA9IGNyZWF0ZUNvbnRhaW5lckl0ZXJhdG9yKGYpO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA3ICYmIGFyZ3VtZW50cy5sZW5ndGggPD0gOSkge1xuICAgICAgICB2YXIgc3RhcnQgPSBhcmd1bWVudHNbNF07XG4gICAgICAgIHZhciBlbmQgPSBhcmd1bWVudHNbNV07XG4gICAgICAgIHZhciBzdGVwc2l6ZSA9IGFyZ3VtZW50c1s2XTtcbiAgICAgICAgY29sb3IgPSBhcmd1bWVudHNbN107XG4gICAgICAgIHJhZGl1c190aGlja25lc3MgPSBhcmd1bWVudHNbOF07XG4gICAgICAgIGl0ZXIgPSBjcmVhdGVDb250YWluZXJJdGVyYXRvcihmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIkZ1bmN0aW9uIHVzZWQgd2l0aCB3cm9uZyBudW1iZXIgb2YgYXJndW1lbnRzXCIpO1xuICAgICAgICB0aHJvdyBcIlRTIHR5cGUgaGludFwiO1xuICAgIH1cblxuICAgIGlmIChjb2xvciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29sb3IgPSBcImdyYXlcIjtcbiAgICB9XG4gICAgaWYgKHJhZGl1c190aGlja25lc3MgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJhZGl1c190aGlja25lc3MgPSAyO1xuICAgIH1cblxuICAgIHZhciBjdXJyWCA9IG51bGw7XG4gICAgdmFyIGN1cnJZID0gbnVsbDtcbiAgICB3aGlsZSAoaXRlci5oYXNOZXh0KCkpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBpdGVyLm5leHQoKTtcbiAgICAgICAgdmFyIGkgPSBpdGVtWzBdO1xuICAgICAgICB2YXIgZnhpID0gaXRlbVsxXTtcblxuICAgICAgICBpZiAoZnhpID09PSBJbmZpbml0eSkge1xuICAgICAgICAgICAgZnhpID0gR1FHX01BWF9TQUZFX1BMQVlHUk9VTkRfSU5URUdFUjtcbiAgICAgICAgfSBlbHNlIGlmIChmeGkgPT09IC1JbmZpbml0eSkge1xuICAgICAgICAgICAgZnhpID0gR1FHX01JTl9TQUZFX1BMQVlHUk9VTkRfSU5URUdFUjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdXJyWSA9PT0gbnVsbCAmJiBmeGkgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjdXJyWCA9IGk7XG4gICAgICAgICAgICBjdXJyWSA9IGZ4aTtcbiAgICAgICAgICAgIGlmICghaW50ZXJwb2xhdGVkKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlQ2lyY2xlSW5Hcm91cChcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBfaWRbXCJncm91cFwiXSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBfaWRbXCJpZFwiXSArIFwiX2dyYXBoX3B0X1wiICsgaSxcbiAgICAgICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICAgICAgZnhpLFxuICAgICAgICAgICAgICAgICAgICByYWRpdXNfdGhpY2tuZXNzLFxuICAgICAgICAgICAgICAgICAgICBjb2xvclxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZnhpICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKCFpbnRlcnBvbGF0ZWQpIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVDaXJjbGVJbkdyb3VwKFxuICAgICAgICAgICAgICAgICAgICBncm91cF9pZFtcImdyb3VwXCJdLFxuICAgICAgICAgICAgICAgICAgICBncm91cF9pZFtcImlkXCJdICsgXCJfZ3JhcGhfcHRfXCIgKyBpLFxuICAgICAgICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICAgICAgICBmeGksXG4gICAgICAgICAgICAgICAgICAgIHJhZGl1c190aGlja25lc3MsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlTGluZUluR3JvdXAoXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwX2lkW1wiZ3JvdXBcIl0sXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwX2lkW1wiaWRcIl0gKyBcIl9ncmFwaF9saW5lX1wiICsgY3VyclggKyBcIi1cIiArIGksXG4gICAgICAgICAgICAgICAgICAgIGN1cnJYIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgY3VyclkgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICAgICAgICBmeGksXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yLFxuICAgICAgICAgICAgICAgICAgICByYWRpdXNfdGhpY2tuZXNzXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1cnJYID0gaTtcbiAgICAgICAgICAgIGN1cnJZID0gZnhpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGdyb3VwX2lkO1xufTtcblxudHlwZSBDcmVhdGVHcmFwaEluR3JvdXBGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm5cbiAgICApOiB2b2lkO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVHcmFwaEluR3JvdXA6IENyZWF0ZUdyYXBoSW5Hcm91cEZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgaWQ6IHN0cmluZyxcbiAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGblxuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXgge1xuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvciwgZG90UmFkaXVzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSlcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBjb2xvciwgZG90UmFkaXVzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYpXG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIGFyZ3Muc3BsaWNlKDMsIDAsIHsgXCJpbnRlcnBvbGF0ZWRcIjogZmFsc2UgfSk7XG4gICAgcmV0dXJuIGNyZWF0ZUdyYXBoV2l0aE9wdGlvbnMuYXBwbHkoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIGFyZ3MgYXMgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuUGFyYW1UeXBlc1xuICAgICk7XG59O1xuXG50eXBlIENyZWF0ZUdyYXBoRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgICh0aGlzOiB2b2lkLCBpZDogc3RyaW5nLCBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbik6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVHcmFwaDogQ3JlYXRlR3JhcGhGbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkXG4pOiBHcm91cE5hbWVBbmRJZFByZWZpeCB7XG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvciwgZG90UmFkaXVzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBjb2xvciwgZG90UmFkaXVzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZilcbiAgICB2YXIgb3B0cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgb3B0cy5zcGxpY2UoMCwgMCwgbnVsbCk7XG4gICAgb3B0cy5zcGxpY2UoMywgMCwgeyBcImludGVycG9sYXRlZFwiOiBmYWxzZSB9KTtcbiAgICByZXR1cm4gY3JlYXRlR3JhcGhXaXRoT3B0aW9ucy5hcHBseShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgb3B0cyBhcyBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzXG4gICAgKTtcbn07XG5cbnR5cGUgRHJhd0dyYXBoRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgICh0aGlzOiB2b2lkLCBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbik6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xufTtcbmV4cG9ydCBjb25zdCBkcmF3R3JhcGg6IERyYXdHcmFwaEZuID0gZnVuY3Rpb24gZHJhd0dyYXBoKFxuICAgIHRoaXM6IHZvaWRcbik6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmKVxuICAgIHZhciBvcHRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBvcHRzLnNwbGljZSgwLCAwLCBudWxsKTtcbiAgICBvcHRzLnNwbGljZSgwLCAwLCBudWxsKTtcbiAgICBvcHRzLnNwbGljZSgzLCAwLCB7IFwiaW50ZXJwb2xhdGVkXCI6IGZhbHNlIH0pO1xuICAgIHJldHVybiBjcmVhdGVHcmFwaFdpdGhPcHRpb25zLmFwcGx5KFxuICAgICAgICB0aGlzLFxuICAgICAgICBvcHRzIGFzIENyZWF0ZUdyYXBoV2l0aE9wdGlvbnNGblBhcmFtVHlwZXNcbiAgICApO1xufTtcblxudHlwZSBDcmVhdGVJbnRlcnBvbGF0ZWRHcmFwaEluR3JvdXBGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIHRoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIHRoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGblxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVJbnRlcnBvbGF0ZWRHcmFwaEluR3JvdXA6IENyZWF0ZUludGVycG9sYXRlZEdyYXBoSW5Hcm91cEZuID1cbiAgICBmdW5jdGlvbiAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGblxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAgICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yLCB0aGlja25lc3MpXG4gICAgICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvcilcbiAgICAgICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIGNvbG9yLCB0aGlja25lc3MpXG4gICAgICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIGNvbG9yKVxuICAgICAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmKVxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIGFyZ3Muc3BsaWNlKDMsIDAsIHsgXCJpbnRlcnBvbGF0ZWRcIjogdHJ1ZSB9KTtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUdyYXBoV2l0aE9wdGlvbnMuYXBwbHkoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgYXJncyBhcyBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzXG4gICAgICAgICk7XG4gICAgfTtcblxudHlwZSBDcmVhdGVJbnRlcnBvbGF0ZWRHcmFwaEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICB0aGlja25lc3M6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICB0aGlja25lc3M6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAodGhpczogdm9pZCwgaWQ6IHN0cmluZywgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4pOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlSW50ZXJwb2xhdGVkR3JhcGg6IENyZWF0ZUludGVycG9sYXRlZEdyYXBoRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZFxuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXgge1xuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIHRoaWNrbmVzcylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSlcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgY29sb3IsIHRoaWNrbmVzcylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYpXG4gICAgdmFyIG9wdHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIG9wdHMuc3BsaWNlKDAsIDAsIG51bGwpO1xuICAgIG9wdHMuc3BsaWNlKDMsIDAsIHsgXCJpbnRlcnBvbGF0ZWRcIjogdHJ1ZSB9KTtcbiAgICByZXR1cm4gY3JlYXRlR3JhcGhXaXRoT3B0aW9ucy5hcHBseShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgb3B0cyBhcyBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzXG4gICAgKTtcbiAgICAvLyByZXR1cm4gY3JlYXRlSW50ZXJwb2xhdGVkR3JhcGhJbkdyb3VwLmFwcGx5KHRoaXMsIG9wdHMpO1xufTtcblxudHlwZSBEcmF3SW50ZXJwb2xhdGVkR3JhcGhGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgdGhpY2tuZXNzOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgdGhpY2tuZXNzOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKHRoaXM6IHZvaWQsIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG59O1xuZXhwb3J0IGNvbnN0IGRyYXdJbnRlcnBvbGF0ZWRHcmFwaDogRHJhd0ludGVycG9sYXRlZEdyYXBoRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZFxuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXgge1xuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvciwgdGhpY2tuZXNzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSlcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBjb2xvciwgdGhpY2tuZXNzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYpXG4gICAgdmFyIG9wdHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIG9wdHMuc3BsaWNlKDAsIDAsIG51bGwpO1xuICAgIG9wdHMuc3BsaWNlKDAsIDAsIG51bGwpO1xuICAgIG9wdHMuc3BsaWNlKDMsIDAsIHsgXCJpbnRlcnBvbGF0ZWRcIjogdHJ1ZSB9KTtcbiAgICByZXR1cm4gY3JlYXRlR3JhcGhXaXRoT3B0aW9ucy5hcHBseShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgb3B0cyBhcyBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzXG4gICAgKTtcbn07XG4iXX0=