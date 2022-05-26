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
            else if (theAnimation instanceof Object && "imageURL" in theAnimation && typeof theAnimation["imageURL"] === "string") {
                throwConsoleErrorInMyprogram("Third argument for createSpriteInGroup expected to be a dictionary. Instead found this animation: " + theAnimation + " with imageURL: " + theAnimation["imageURL"] + ". Maybe wrong number of arguments provided? Check API documentation for details of parameters.");
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
    }
    ;
    return $("#" + spriteName).w();
};
       const spriteGetHeight = (spriteName) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
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
       const spriteFlipVertical = (spriteName, flipped) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
    }
    $("#" + spriteName).flipv(flipped);
};
       const spriteFlipHorizontal = (spriteName, flipped) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
    }
    $("#" + spriteName).fliph(flipped);
};
       const spriteGetFlipVertical = (spriteName) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
    }
    return $("#" + spriteName).flipv();
};
       const spriteGetFlipHorizontal = (spriteName) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
    }
    return $("#" + spriteName).fliph();
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
const jqObjsCollideAxisAligned = function (obj1, obj2) {
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
const domObjsCollideAxisAligned = function (obj1, obj2) {
    // obj1/2 are DOM objects, possibly rotated
    // collision is checked via axis aligned bounding rects
    const r1 = obj1.getBoundingClientRect();
    const r2 = obj2.getBoundingClientRect();
    return !(r1.bottom < r2.top || r1.top > r2.bottom || r1.right < r2.left || r1.left > r2.right);
};
const gqObjsCollideAxisAligned = function (obj1, obj2) {
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
/**
 * Utility function returns radius of rectangular geometry
 *
 * @param elem
 * @param angle the angle in degrees
 * @return .x, .y radius of geometry
 */
const projectGqObj = function (elem, angle) {
    // based on a GQ fn.
    const b = angle * Math.PI / 180;
    const Rx = Math.abs(Math.cos(b) * elem.width / 2 * elem.factor) + Math.abs(Math.sin(b) * elem.height / 2 * elem.factor);
    const Ry = Math.abs(Math.cos(b) * elem.height / 2 * elem.factor) + Math.abs(Math.sin(b) * elem.width / 2 * elem.factor);
    return { x: Rx, y: Ry };
};
/**
 * Utility function returns whether two non-axis aligned rectangular objects are colliding
 *
 * @param elem1
 * @param elem1CenterX x-coord of center of bounding circle/rect of elem1
 * @param elem1CenterY y-coord of center of bounding circle/rect of elem1
 * @param elem2
 * @param elem2CenterX x-coord of center of bounding circle/rect of elem2
 * @param elem2CenterY y-coord of center of bounding circle/rect of elem2
 * @return {boolean} if the two elements collide or not
 */
const gqObjsCollide = function (elem1, elem1CenterX, elem1CenterY, elem2, elem2CenterX, elem2CenterY) {
    // test real collision (only for two rectangles; could be rotated)
    // based on and fixes a broken GQ fn.
    const dx = elem2CenterX - elem1CenterX; // GQ uses its boundingCircle to calculate these, but
    const dy = elem2CenterY - elem1CenterY; // GQ boundingCircles are broken when sprites are scaled
    const a = Math.atan(dy / dx);
    let Dx = Math.abs(Math.cos(a - elem1.angle * Math.PI / 180) / Math.cos(a) * dx);
    let Dy = Math.abs(Math.sin(a - elem1.angle * Math.PI / 180) / Math.sin(a) * dy);
    let R = projectGqObj(elem2, elem2.angle - elem1.angle);
    if ((elem1.width / 2 * elem1.factor + R.x <= Dx) || (elem1.height / 2 * elem1.factor + R.y <= Dy)) {
        return false;
    }
    else {
        Dx = Math.abs(Math.cos(a - elem2.angle * Math.PI / 180) / Math.cos(a) * -dx);
        Dy = Math.abs(Math.sin(a - elem2.angle * Math.PI / 180) / Math.sin(a) * -dy);
        R = projectGqObj(elem1, elem1.angle - elem2.angle);
        if ((elem2.width / 2 * elem2.factor + R.x <= Dx) || (elem2.height / 2 * elem2.factor + R.y <= Dy)) {
            return false;
        }
        else {
            return true;
        }
    }
};
       const forEachSpriteSpriteCollisionDo = (sprite1Name, sprite2Name, collisionHandlingFunction) => {
    $(spriteFilteredCollision(sprite1Name, ".gQ_group, #" + sprite2Name)).each(collisionHandlingFunction);
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
    $(spriteFilteredCollision(sprite1Name, "#" + groupName + ", .gQ_sprite")).each(collisionHandlingFunction);
    // collisionHandlingFunction can optionally take two arguments: collIndex, hitSprite
    // see http://api.jquery.com/jQuery.each
};
       const forEachSpriteGroupHit = forEachSpriteGroupCollisionDo;
       const forEachSpriteFilteredCollisionDo = (sprite1Name, filterStr, collisionHandlingFunction) => {
    $(spriteFilteredCollision(sprite1Name, filterStr)).each(collisionHandlingFunction);
    // see http://gamequeryjs.com/documentation/api/#collision for filterStr spec
    // collisionHandlingFunction can optionally take two arguments: collIndex, hitSprite
    // see http://api.jquery.com/jQuery.each
};
       const forEachSpriteFilteredHit = forEachSpriteFilteredCollisionDo;
const spriteFilteredCollision = function (sprite1Name, filter) {
    // Based on and fixes GQ's collision function, because GQ's collide 
    // function is badly broken when sprites are rotated/scaled
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
                            if (s1[0].gameQuery.angle % 90 === 0 && elementToCheck.gameQuery.angle % 90 === 0) {
                                // axis aligned collision
                                // Add to the result list if collision detected
                                resultList.push(elementsToCheck[i][subLen]);
                            }
                            else { // not axis aligned collision
                                const s1CenterX = s1Rect.left + (s1Rect.right - s1Rect.left) / 2;
                                const s1CenterY = s1Rect.top + (s1Rect.bottom - s1Rect.top) / 2;
                                const e2CenterX = e2Rect.left + (e2Rect.right - e2Rect.left) / 2;
                                const e2CenterY = e2Rect.top + (e2Rect.bottom - e2Rect.top) / 2;
                                if (gqObjsCollide(s1[0].gameQuery, s1CenterX, s1CenterY, elementToCheck.gameQuery, e2CenterX, e2CenterY)) {
                                    // Add to the result list if collision detected
                                    resultList.push(elementsToCheck[i][subLen]);
                                }
                            }
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
    if (rotdeg != null) {
        if (rotOriginX != null && rotOriginY != null) {
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
    if (rotdeg != null) {
        if (rotOriginX != null && rotOriginY != null) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3FnLW1vZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9jaGVuZy9EZXNrdG9wL1RTLWRldi9mdW4tdHNkLWxpYi5naXRyZXBvL2xpYi1ncWd1YXJkcmFpbC9zcmMvZ3FnLW1vZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUE4QmIsa0RBQWtEO0FBQ2xELElBQUksU0FBUyxHQUFZLElBQUksQ0FBQztBQUM5QixNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsQ0FBQyxLQUFjLEVBQVEsRUFBRTtJQUNuRCxJQUFJLEtBQUssRUFBRTtRQUNQLFNBQVMsR0FBRyxJQUFJLENBQUM7S0FDcEI7U0FBTTtRQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEdBQUcsa0VBQWtFLENBQUMsQ0FBQztRQUMvRyxTQUFTLEdBQUcsS0FBSyxDQUFDO0tBQ3JCO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsTUFBTSxrQ0FBa0MsR0FBRyw2QkFBNkIsQ0FBQztBQUN6RSxNQUFNLENBQUMsTUFBTSw0QkFBNEIsR0FBRyxDQUN4QyxpQkFBa0MsRUFDM0IsRUFBRTtJQUNULElBQUksT0FBTyxpQkFBaUIsS0FBSyxRQUFRO1FBQ3JDLE9BQU8saUJBQWlCLEtBQUssUUFBUSxFQUFFO1FBQ3ZDLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBQ0QsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDakQsSUFBSSxXQUFXLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7SUFDOUUsV0FBVyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDMUIsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFFRCxPQUFPLENBQUMsaUJBQWlCLEtBQUssV0FB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QUMvRCxDQUFDLENBQUM7QUF3Q0YsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQTRCO0lBRzFELDREQUE0RDtJQUM1RCxpREFBaUQ7SUFDakQsMENBQTBDO0lBQzFDLHNDQUFzQztJQUN0QywyQkFBMkI7SUFDM0Isb0JBQW9CO0lBQ3BCLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqRCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLE9BQU8sc0JBQXNCLENBQUMsS0FBSyxDQUMvQixJQUFJLEVBQ0osSUFBMEMsQ0FDN0MsQ0FBQztBQUNOLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuLypcbiAqIENvcHlyaWdodCAyMDEyLCAyMDE2LCAyMDE3LCAyMDE5LCAyMDIwIENhcnNvbiBDaGVuZ1xuICogVGhpcyBTb3VyY2UgQ29kZSBGb3JtIGlzIHN1YmplY3QgdG8gdGhlIHRlcm1zIG9mIHRoZSBNb3ppbGxhIFB1YmxpY1xuICogTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpc1xuICogZmlsZSwgWW91IGNhbiBvYnRhaW4gb25lIGF0IGh0dHBzOi8vbW96aWxsYS5vcmcvTVBMLzIuMC8uXG4gKi9cbi8qXG4gKiBHUUd1YXJkcmFpbCB2MC44LjAgaXMgYSB3cmFwcGVyIGFyb3VuZCBnYW1lUXVlcnkgcmV2LiAwLjcuMS5cbiAqIE1ha2VzIHRoaW5ncyBtb3JlIHByb2NlZHVyYWwsIHdpdGggYSBiaXQgb2YgZnVuY3Rpb25hbC5cbiAqIEFkZHMgaW4gaGVscGZ1bCBlcnJvciBtZXNzYWdlcyBmb3Igc3R1ZGVudHMuXG4gKiBsb2FkIHRoaXMgYWZ0ZXIgZ2FtZVF1ZXJ5LlxuICovXG5cbmV4cG9ydCB0eXBlIHNwcml0ZURvbU9iamVjdCA9IHtcbiAgICB3aWR0aDogKG46IG51bWJlcikgPT4gc3ByaXRlRG9tT2JqZWN0O1xuICAgIGhlaWdodDogKG46IG51bWJlcikgPT4gc3ByaXRlRG9tT2JqZWN0O1xuICAgIHNldEFuaW1hdGlvbjogKG8/OiBvYmplY3QsIGY/OiBGdW5jdGlvbikgPT4gYW55O1xuICAgIGNzczogKGF0dHI6IHN0cmluZywgdmFsOiBzdHJpbmcgfCBudW1iZXIpID0+IHNwcml0ZURvbU9iamVjdDtcbiAgICBwbGF5Z3JvdW5kOiAobzogb2JqZWN0KSA9PiBhbnk7XG4gICAgaHRtbDogKGh0bWxUZXh0OiBzdHJpbmcpID0+IHNwcml0ZURvbU9iamVjdDtcbiAgICB0ZXh0OiAodGV4dDogc3RyaW5nKSA9PiBzcHJpdGVEb21PYmplY3Q7XG59O1xuZGVjbGFyZSB2YXIgJDogYW55O1xuZGVjbGFyZSB2YXIgQ29va2llczoge1xuICAgIHNldDogKGFyZzA6IHN0cmluZywgYXJnMTogb2JqZWN0KSA9PiB2b2lkO1xuICAgIGdldEpTT046IChhcmcwOiBzdHJpbmcpID0+IG9iamVjdDtcbiAgICByZW1vdmU6IChhcmcwOiBzdHJpbmcpID0+IHZvaWQ7XG59O1xuXG4vLyBzdHVkZW50cyBhcmUgbm90IHN1cHBvc2VkIHRvIHVzZSBHUUdfIHZhcmlhYmxlc1xubGV0IEdRR19ERUJVRzogYm9vbGVhbiA9IHRydWU7XG5leHBvcnQgY29uc3Qgc2V0R3FEZWJ1Z0ZsYWcgPSAoZGVidWc6IGJvb2xlYW4pOiB2b2lkID0+IHtcbiAgICBpZiAoZGVidWcpIHtcbiAgICAgICAgR1FHX0RFQlVHID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhHUUdfV0FSTklOR19JTl9NWVBST0dSQU1fTVNHICsgXCJkZWJ1ZyBtb2RlIGRpc2FibGVkIGFuZCB5b3VyIGNvZGUgaXMgbm93IHJ1bm5pbmcgaW4gdW5zYWZlIG1vZGUuXCIpO1xuICAgICAgICBHUUdfREVCVUcgPSBmYWxzZTtcbiAgICB9XG59O1xuXG5jb25zdCBHUUdfU1BSSVRFX0dST1VQX05BTUVfRk9STUFUX1JFR0VYID0gL1thLXpBLVowLTlfXStbYS16QS1aMC05Xy1dKi87XG5leHBvcnQgY29uc3Qgc3ByaXRlR3JvdXBOYW1lRm9ybWF0SXNWYWxpZCA9IChcbiAgICBzcHJpdGVPckdyb3VwTmFtZTogc3RyaW5nIHwgbnVtYmVyXG4pOiBib29sZWFuID0+IHtcbiAgICBpZiAodHlwZW9mIHNwcml0ZU9yR3JvdXBOYW1lICE9PSBcInN0cmluZ1wiICYmXG4gICAgICAgIHR5cGVvZiBzcHJpdGVPckdyb3VwTmFtZSAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHNwcml0ZU9yR3JvdXBOYW1lID0gc3ByaXRlT3JHcm91cE5hbWUudG9TdHJpbmcoKTtcbiAgICBsZXQgbmFtZU1hdGNoZXMgPSBzcHJpdGVPckdyb3VwTmFtZS5tYXRjaChHUUdfU1BSSVRFX0dST1VQX05BTUVfRk9STUFUX1JFR0VYKTtcbiAgICBuYW1lTWF0Y2hlcyA9IChuYW1lTWF0Y2hlcyA/IG5hbWVNYXRjaGVzIDogW10pO1xuICAgIGlmIChuYW1lTWF0Y2hlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiAoc3ByaXRlT3JHcm91cE5hbWUgPT09IG5hbWVNYXRjaGVzWzBdKTtcbn07XG5cbmNvbnN0IEdRR19TSUdOQUxTOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiA9IHt9O1xubGV0IEdRR19VTklRVUVfSURfQ09VTlRFUiA9IDA7XG5cbmxldCBHUUdfUExBWUdST1VORF9XSURUSCA9IDY0MDtcbmxldCBHUUdfUExBWUdST1VORF9IRUlHSFQgPSA0ODA7XG5leHBvcnQgbGV0IFBMQVlHUk9VTkRfV0lEVEggPSBHUUdfUExBWUdST1VORF9XSURUSDsgLy8gc3R1ZGVudHMgYXJlIG5vdCBzdXBwb3NlZCB0byB1c2UgR1FHXyB2YXJpYWJsZXNcbmV4cG9ydCBsZXQgUExBWUdST1VORF9IRUlHSFQgPSBHUUdfUExBWUdST1VORF9IRUlHSFQ7XG5cbmV4cG9ydCBjb25zdCBBTklNQVRJT05fSE9SSVpPTlRBTDogbnVtYmVyID0gJC5nUS5BTklNQVRJT05fSE9SSVpPTlRBTDtcbmV4cG9ydCBjb25zdCBBTklNQVRJT05fVkVSVElDQUw6IG51bWJlciA9ICQuZ1EuQU5JTUFUSU9OX1ZFUlRJQ0FMO1xuZXhwb3J0IGNvbnN0IEFOSU1BVElPTl9PTkNFOiBudW1iZXIgPSAkLmdRLkFOSU1BVElPTl9PTkNFO1xuZXhwb3J0IGNvbnN0IEFOSU1BVElPTl9QSU5HUE9ORzogbnVtYmVyID0gJC5nUS5BTklNQVRJT05fUElOR1BPTkc7XG5leHBvcnQgY29uc3QgQU5JTUFUSU9OX0NBTExCQUNLOiBudW1iZXIgPSAkLmdRLkFOSU1BVElPTl9DQUxMQkFDSztcbmV4cG9ydCBjb25zdCBBTklNQVRJT05fTVVMVEk6IG51bWJlciA9ICQuZ1EuQU5JTUFUSU9OX01VTFRJO1xuXG5cbi8vIE1heC9NaW4gU2FmZSBQbGF5Z3JvdW5kIEludGVnZXJzIGZvdW5kIGJ5IGV4cGVyaW1lbnRpbmcgd2l0aCBHUSAwLjcuMSBpbiBGaXJlZm94IDQxLjAuMiBvbiBNYWMgT1MgWCAxMC4xMC41XG5jb25zdCBHUUdfTUlOX1NBRkVfUExBWUdST1VORF9JTlRFR0VSID0gLShNYXRoLnBvdygyLCAyNCkgLSAxKTsgLy8gY2YuIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL051bWJlci9NSU5fU0FGRV9JTlRFR0VSXG5jb25zdCBHUUdfTUFYX1NBRkVfUExBWUdST1VORF9JTlRFR0VSID0gKE1hdGgucG93KDIsIDI0KSAtIDEpOyAvLyBjZi4gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTnVtYmVyL01BWF9TQUZFX0lOVEVHRVJcblxuXG5jb25zdCBHUUdfZ2V0VW5pcXVlSWQgPSAoKTogc3RyaW5nID0+IHtcbiAgICByZXR1cm4gRGF0ZS5ub3coKSArIFwiX1wiICsgR1FHX1VOSVFVRV9JRF9DT1VOVEVSKys7XG59O1xuXG5leHBvcnQgY29uc3Qgc2V0R3FQbGF5Z3JvdW5kRGltZW5zaW9ucyA9IChcbiAgICB3aWR0aDogbnVtYmVyLFxuICAgIGhlaWdodDogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICAvLyB0aGlzIG11c3QgYmUgZXhlY3V0ZWQgb3V0c2lkZSBvZiBzZXR1cCBhbmQgZHJhdyBmdW5jdGlvbnNcbiAgICBHUUdfUExBWUdST1VORF9IRUlHSFQgPSBoZWlnaHQ7XG4gICAgUExBWUdST1VORF9IRUlHSFQgPSBoZWlnaHQ7XG4gICAgR1FHX1BMQVlHUk9VTkRfV0lEVEggPSB3aWR0aDtcbiAgICBQTEFZR1JPVU5EX1dJRFRIID0gd2lkdGg7XG4gICAgc3ByaXRlKFwicGxheWdyb3VuZFwiKS53aWR0aCh3aWR0aCkuaGVpZ2h0KGhlaWdodCk7XG59O1xuXG5leHBvcnQgY29uc3QgY3VycmVudERhdGUgPSAoKTogbnVtYmVyID0+IHtcbiAgICByZXR1cm4gRGF0ZS5ub3coKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjb25zb2xlUHJpbnQgPSAoLi4udHh0OiBhbnkpOiB2b2lkID0+IHtcbiAgICAvLyBtaWdodCB3b3JrIG9ubHkgaW4gQ2hyb21lIG9yIGlmIHNvbWUgZGV2ZWxvcG1lbnQgYWRkLW9ucyBhcmUgaW5zdGFsbGVkXG4gICAgY29uc29sZS5sb2coLi4udHh0KTtcbn07XG5cblxuY29uc3QgR1FHX0lOX01ZUFJPR1JBTV9NU0cgPSAnaW4gXCJteXByb2dyYW0udHNcIi0gJztcbmNvbnN0IEdRR19FUlJPUl9JTl9NWVBST0dSQU1fTVNHID0gXCJFcnJvciBcIiArIEdRR19JTl9NWVBST0dSQU1fTVNHO1xuY29uc3QgR1FHX1dBUk5JTkdfSU5fTVlQUk9HUkFNX01TRyA9ICdXYXJuaW5nICcgKyBHUUdfSU5fTVlQUk9HUkFNX01TRztcblxuY29uc3QgcHJpbnRFcnJvclRvQ29uc29sZU9uY2UgPSAoKCkgPT4ge1xuICAgIHZhciB0aHJvd0NvbnNvbGVFcnJvcl9wcmludGVkOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiA9IHt9O1xuICAgIHJldHVybiAobXNnOiBzdHJpbmcpID0+IHtcbiAgICAgICAgLy8gRmlyZWZveCB3b3VsZG4ndCBwcmludCB1bmNhdWdodCBleGNlcHRpb25zIHdpdGggZmlsZSBuYW1lL2xpbmUgbnVtYmVyXG4gICAgICAgIC8vIGJ1dCBhZGRpbmcgXCJuZXcgRXJyb3IoKVwiIHRvIHRoZSB0aHJvdyBiZWxvdyBmaXhlZCBpdC4uLlxuICAgICAgICBpZiAoIXRocm93Q29uc29sZUVycm9yX3ByaW50ZWRbbXNnXSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yOiBcIiArIG1zZyk7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvcl9wcmludGVkW21zZ10gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5jb25zdCB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtID0gKG1zZzogc3RyaW5nKTogbmV2ZXIgPT4ge1xuICAgIC8vIEZpcmVmb3ggd291bGRuJ3QgcHJpbnQgdW5jYXVnaHQgZXhjZXB0aW9ucyB3aXRoIGZpbGUgbmFtZS9saW5lIG51bWJlclxuICAgIC8vIGJ1dCBhZGRpbmcgXCJuZXcgRXJyb3IoKVwiIHRvIHRoZSB0aHJvdyBiZWxvdyBmaXhlZCBpdC4uLlxuICAgIHRocm93IG5ldyBFcnJvcihHUUdfSU5fTVlQUk9HUkFNX01TRyArIG1zZyk7XG59O1xuXG5jb25zdCB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQgPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgaWYgKHR5cGVvZiBzcHJpdGVOYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTcHJpdGUgbmFtZSBtdXN0IGJlIGEgU3RyaW5nLCBub3Q6IFwiICsgc3ByaXRlTmFtZSk7XG4gICAgfSBlbHNlIGlmICghc3ByaXRlRXhpc3RzKHNwcml0ZU5hbWUpKSB7XG4gICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTcHJpdGUgZG9lc24ndCBleGlzdDogXCIgKyBzcHJpdGVOYW1lKTtcbiAgICB9XG59O1xuTnVtYmVyLmlzRmluaXRlID0gTnVtYmVyLmlzRmluaXRlIHx8IGZ1bmN0aW9uICh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gICAgLy8gc2VlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9OdW1iZXIvaXNGaW5pdGVcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2YWx1ZSk7XG59O1xuY29uc3QgdGhyb3dJZk5vdEZpbml0ZU51bWJlciA9IChtc2c6IHN0cmluZywgdmFsOiBhbnkpOiB2b2lkID0+IHsgLy8gZS5nLiB0aHJvdyBpZiBOYU4sIEluZmluaXR5LCBudWxsXG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUodmFsKSkge1xuICAgICAgICBtc2cgPSBtc2cgfHwgXCJFeHBlY3RlZCBhIG51bWJlci5cIjtcbiAgICAgICAgbXNnICs9IFwiIFlvdSB1c2VkXCI7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBtc2cgKz0gXCIgdGhlIFN0cmluZzogXFxcIlwiICsgdmFsICsgXCJcXFwiXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtc2cgKz0gXCI6IFwiICsgdmFsO1xuICAgICAgICB9XG4gICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0obXNnKTtcbiAgICB9XG59O1xuXG5leHBvcnQgY29uc3QgdGhyb3dPbkltZ0xvYWRFcnJvciA9IChpbWdVcmw6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIC8vIHdoYXQgdGhpcyBmdW5jdGlvbiB0aHJvd3MgbXVzdCBub3QgYmUgY2F1Z2h0IGJ5IGNhbGxlciB0aG8uLi5cbiAgICBpZiAoaW1nVXJsLnN1YnN0cmluZyhpbWdVcmwubGVuZ3RoIC0gXCIuZ2lmXCIubGVuZ3RoKS50b0xvd2VyQ2FzZSgpID09PSBcIi5naWZcIikge1xuICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiaW1hZ2UgZmlsZSBmb3JtYXQgbm90IHN1cHBvcnRlZDogR0lGXCIpO1xuICAgIH1cbiAgICBsZXQgdGhyb3dhYmxlRXJyID0gbmV3IEVycm9yKFwiaW1hZ2UgZmlsZSBub3QgZm91bmQ6IFwiICsgaW1nVXJsKTtcbiAgICAkKFwiPGltZy8+XCIpLm9uKFwiZXJyb3JcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoISF0aHJvd2FibGVFcnIgJiYgdGhyb3dhYmxlRXJyLnN0YWNrICYmXG4gICAgICAgICAgICB0aHJvd2FibGVFcnIuc3RhY2sudG9TdHJpbmcoKS5pbmRleE9mKFwibXlwcm9ncmFtLmpzXCIpID49IDApIHtcbiAgICAgICAgICAgIHRocm93YWJsZUVyci5tZXNzYWdlID0gR1FHX0VSUk9SX0lOX01ZUFJPR1JBTV9NU0cgKyB0aHJvd2FibGVFcnIubWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyB0aHJvd2FibGVFcnI7XG4gICAgfSkuYXR0cihcInNyY1wiLCBpbWdVcmwpO1xufTtcblxuXG5cbnR5cGUgTmV3R1FBbmltYXRpb25GbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIHVybE9yTWFwOiBzdHJpbmcsXG4gICAgICAgIG51bWJlck9mRnJhbWU6IG51bWJlcixcbiAgICAgICAgZGVsdGE6IG51bWJlcixcbiAgICAgICAgcmF0ZTogbnVtYmVyLFxuICAgICAgICB0eXBlOiBudW1iZXJcbiAgICApOiBTcHJpdGVBbmltYXRpb247XG4gICAgKHRoaXM6IHZvaWQsIHVybE9yTWFwOiBzdHJpbmcpOiBTcHJpdGVBbmltYXRpb247XG4gICAgKHRoaXM6IHZvaWQsIHVybE9yTWFwOiBvYmplY3QpOiBTcHJpdGVBbmltYXRpb247XG59O1xuZXhwb3J0IGNvbnN0IG5ld0dRQW5pbWF0aW9uOiBOZXdHUUFuaW1hdGlvbkZuID0gKCgpID0+IHtcbiAgICBsZXQgbWVtb0FuaW1zOiBNYXA8c3RyaW5nIHwgb2JqZWN0LCBTcHJpdGVBbmltYXRpb24+ID0gbmV3IE1hcDxvYmplY3QsIFNwcml0ZUFuaW1hdGlvbj4oKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICB1cmxPck1hcDogc3RyaW5nIHwgb2JqZWN0LFxuICAgICAgICBudW1iZXJPZkZyYW1lPzogbnVtYmVyLFxuICAgICAgICBkZWx0YT86IG51bWJlcixcbiAgICAgICAgcmF0ZT86IG51bWJlcixcbiAgICAgICAgdHlwZT86IG51bWJlclxuICAgICk6IFNwcml0ZUFuaW1hdGlvbiB7XG4gICAgICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA1KSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAodXJsT3JNYXApICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJGaXJzdCBhcmd1bWVudCBmb3IgbmV3R1FBbmltYXRpb24gbXVzdCBiZSBhIFN0cmluZy4gSW5zdGVhZCBmb3VuZDogXCIgKyB1cmxPck1hcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdXJsT3JNYXAgPT09IFwic3RyaW5nXCIpIHRocm93T25JbWdMb2FkRXJyb3IodXJsT3JNYXApO1xuICAgICAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJOdW1iZXIgb2YgZnJhbWUgYXJndW1lbnQgZm9yIG5ld0dRQW5pbWF0aW9uIG11c3QgYmUgbnVtZXJpYy4gXCIsIG51bWJlck9mRnJhbWUpO1xuICAgICAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJEZWx0YSBhcmd1bWVudCBmb3IgbmV3R1FBbmltYXRpb24gbXVzdCBiZSBudW1lcmljLiBcIiwgZGVsdGEpO1xuICAgICAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJSYXRlIGFyZ3VtZW50IGZvciBuZXdHUUFuaW1hdGlvbiBtdXN0IGJlIG51bWVyaWMuIFwiLCByYXRlKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZSAhPSBudWxsICYmICh0eXBlICYgQU5JTUFUSU9OX1ZFUlRJQ0FMKSAmJiAodHlwZSAmIEFOSU1BVElPTl9IT1JJWk9OVEFMKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiVHlwZSBhcmd1bWVudCBmb3IgbmV3R1FBbmltYXRpb24gY2Fubm90IGJlIGJvdGggQU5JTUFUSU9OX1ZFUlRJQ0FMIGFuZCBBTklNQVRJT05fSE9SSVpPTlRBTCAtIHVzZSBvbmUgb3IgdGhlIG90aGVyIGJ1dCBub3QgYm90aCFcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlICE9IG51bGwgJiYgISh0eXBlICYgQU5JTUFUSU9OX1ZFUlRJQ0FMKSAmJiAhKHR5cGUgJiBBTklNQVRJT05fSE9SSVpPTlRBTCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlR5cGUgYXJndW1lbnQgZm9yIG5ld0dRQW5pbWF0aW9uIGlzIG1pc3NpbmcgYm90aCBBTklNQVRJT05fVkVSVElDQUwgYW5kIEFOSU1BVElPTl9IT1JJWk9OVEFMIC0gbXVzdCB1c2Ugb25lIG9yIHRoZSBvdGhlciFcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAodXJsT3JNYXApID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93T25JbWdMb2FkRXJyb3IodXJsT3JNYXApO1xuICAgICAgICAgICAgICAgIH0gLy8gZWxzZSBob3BlIGl0J3MgYSBwcm9wZXIgb3B0aW9ucyBtYXAgdG8gcGFzcyBvbiB0byBHYW1lUXVlcnkgZGlyZWN0bHlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIldyb25nIG51bWJlciBvZiBhcmd1bWVudHMgdXNlZCBmb3IgbmV3R1FBbmltYXRpb24uIENoZWNrIEFQSSBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzIG9mIHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgICAgICAgbGV0IGtleSA9IFt1cmxPck1hcCwgbnVtYmVyT2ZGcmFtZSwgZGVsdGEsIHJhdGUsIHR5cGVdO1xuICAgICAgICAgICAgbGV0IG11bHRpZnJhbWVBbmltOiBTcHJpdGVBbmltYXRpb24gfCB1bmRlZmluZWQgPSBtZW1vQW5pbXMuZ2V0KGtleSk7XG4gICAgICAgICAgICBpZiAobXVsdGlmcmFtZUFuaW0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtdWx0aWZyYW1lQW5pbTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IG11bHRpZnJhbWVBbmltOiBTcHJpdGVBbmltYXRpb24gPSBuZXcgJC5nUS5BbmltYXRpb24oe1xuICAgICAgICAgICAgICAgICAgICBpbWFnZVVSTDogdXJsT3JNYXAsXG4gICAgICAgICAgICAgICAgICAgIG51bWJlck9mRnJhbWU6IG51bWJlck9mRnJhbWUsXG4gICAgICAgICAgICAgICAgICAgIGRlbHRhOiBkZWx0YSxcbiAgICAgICAgICAgICAgICAgICAgcmF0ZTogcmF0ZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogdHlwZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG1lbW9Bbmltcy5zZXQoa2V5LCBtdWx0aWZyYW1lQW5pbSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG11bHRpZnJhbWVBbmltO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGxldCBzaW5nbGVmcmFtZUFuaW06IFNwcml0ZUFuaW1hdGlvbiB8IHVuZGVmaW5lZCA9IG1lbW9Bbmltcy5nZXQodXJsT3JNYXApO1xuICAgICAgICAgICAgaWYgKHNpbmdsZWZyYW1lQW5pbSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpbmdsZWZyYW1lQW5pbTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHNpbmdsZWZyYW1lQW5pbTogU3ByaXRlQW5pbWF0aW9uO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHVybE9yTWFwKSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICBzaW5nbGVmcmFtZUFuaW0gPSBuZXcgJC5nUS5BbmltYXRpb24oeyBpbWFnZVVSTDogdXJsT3JNYXAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2luZ2xlZnJhbWVBbmltID0gbmV3ICQuZ1EuQW5pbWF0aW9uKHVybE9yTWFwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbWVtb0FuaW1zLnNldCh1cmxPck1hcCwgc2luZ2xlZnJhbWVBbmltKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2luZ2xlZnJhbWVBbmltO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIldyb25nIG51bWJlciBvZiBhcmd1bWVudHMgdXNlZCBmb3IgbmV3R1FBbmltYXRpb24uIENoZWNrIEFQSSBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzIG9mIHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyAkLmdRLkFuaW1hdGlvbih7IGltYWdlVVJMOiBcIlwiIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cbnR5cGUgQ3JlYXRlR3JvdXBJblBsYXlncm91bmRGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeDogbnVtYmVyLFxuICAgICAgICB0aGVQb3N5OiBudW1iZXJcbiAgICApOiB2b2lkO1xuICAgICh0aGlzOiB2b2lkLCBncm91cE5hbWU6IHN0cmluZywgdGhlV2lkdGg6IG51bWJlciwgdGhlSGVpZ2h0OiBudW1iZXIpOiB2b2lkO1xuICAgICh0aGlzOiB2b2lkLCBncm91cE5hbWU6IHN0cmluZyk6IHZvaWQ7XG4gICAgKHRoaXM6IHZvaWQsIGdyb3VwTmFtZTogc3RyaW5nLCBvcHRNYXA6IG9iamVjdCk6IHZvaWQ7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kOiBDcmVhdGVHcm91cEluUGxheWdyb3VuZEZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgdGhlV2lkdGg/OiBudW1iZXIgfCBvYmplY3QsXG4gICAgdGhlSGVpZ2h0PzogbnVtYmVyLFxuICAgIHRoZVBvc3g/OiBudW1iZXIsXG4gICAgdGhlUG9zeT86IG51bWJlclxuKTogdm9pZCB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICBpZiAodHlwZW9mIChncm91cE5hbWUpICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiRmlyc3QgYXJndW1lbnQgZm9yIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgZ3JvdXBOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNwcml0ZUdyb3VwTmFtZUZvcm1hdElzVmFsaWQoZ3JvdXBOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIkdyb3VwIG5hbWUgZ2l2ZW4gdG8gY3JlYXRlR3JvdXBJblBsYXlncm91bmQgaXMgaW4gd3JvbmcgZm9ybWF0OiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNwcml0ZUV4aXN0cyhncm91cE5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiY3JlYXRlR3JvdXBJblBsYXlncm91bmQgY2Fubm90IGNyZWF0ZSBkdXBsaWNhdGUgZ3JvdXAgd2l0aCBuYW1lOiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIldpZHRoIGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVXaWR0aCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiSGVpZ2h0IGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVIZWlnaHQpO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDUpIHtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlV2lkdGgpO1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkhlaWdodCBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlSGVpZ2h0KTtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N4KTtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJZIGxvY2F0aW9uIGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N5KTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7IC8vIHRyZWF0cyBhcmd1bWVudHNbMV0gYXMgYSBzdGFuZGFyZCBvcHRpb25zIG1hcFxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMV0gIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU2Vjb25kIGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBleHBlY3RlZCB0byBiZSBhIGRpY3Rpb25hcnkuIEluc3RlYWQgZm91bmQ6IFwiICsgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgICAgIH0gLy8gZWxzZSBob3BlIGl0J3MgYSBwcm9wZXIgc3RhbmRhcmQgb3B0aW9ucyBtYXBcbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50cyB1c2VkIGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZC4gQ2hlY2sgQVBJIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMgb2YgcGFyYW1ldGVycy5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRHcm91cChcbiAgICAgICAgICAgIGdyb3VwTmFtZSxcbiAgICAgICAgICAgIHsgd2lkdGg6ICQucGxheWdyb3VuZCgpLndpZHRoKCksIGhlaWdodDogJC5wbGF5Z3JvdW5kKCkuaGVpZ2h0KCkgfVxuICAgICAgICApO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICBpZiAodHlwZW9mIHRoZVdpZHRoICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwidGhlV2lkdGggbXVzdCBiZSBhIG51bWJlciBidXQgaW5zdGVhZCBnb3Q6IFwiICsgdGhlV2lkdGgpO1xuICAgICAgICB9XG4gICAgICAgICQucGxheWdyb3VuZCgpLmFkZEdyb3VwKGdyb3VwTmFtZSwgeyB3aWR0aDogdGhlV2lkdGgsIGhlaWdodDogdGhlSGVpZ2h0IH0pO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgICBpZiAodHlwZW9mIHRoZVdpZHRoICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwidGhlV2lkdGggbXVzdCBiZSBhIG51bWJlciBidXQgaW5zdGVhZCBnb3Q6IFwiICsgdGhlV2lkdGgpO1xuICAgICAgICB9XG4gICAgICAgICQucGxheWdyb3VuZCgpLmFkZEdyb3VwKFxuICAgICAgICAgICAgZ3JvdXBOYW1lLFxuICAgICAgICAgICAgeyB3aWR0aDogdGhlV2lkdGgsIGhlaWdodDogdGhlSGVpZ2h0LCBwb3N4OiB0aGVQb3N4LCBwb3N5OiB0aGVQb3N5IH1cbiAgICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHsgLy8gdHJlYXRzIGFyZ3VtZW50c1sxXSBhcyBhIHN0YW5kYXJkIG9wdGlvbnMgbWFwXG4gICAgICAgIGlmICh0eXBlb2YgdGhlV2lkdGggIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTZWNvbmQgYXJndW1lbnQgbXVzdCBiZSBhIG51bWJlciBidXQgaW5zdGVhZCBnb3Q6IFwiICsgdGhlV2lkdGgpO1xuICAgICAgICB9XG4gICAgICAgICQucGxheWdyb3VuZCgpLmFkZEdyb3VwKGdyb3VwTmFtZSwgYXJndW1lbnRzWzFdKTtcbiAgICB9XG59O1xuXG5leHBvcnQgdHlwZSBTcHJpdGVBbmltYXRpb24gPSB7IGltYWdlVVJMOiBzdHJpbmcgfTtcbnR5cGUgQ3JlYXRlU3ByaXRlSW5Hcm91cEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlQW5pbWF0aW9uOiBTcHJpdGVBbmltYXRpb24sXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyLFxuICAgICAgICB0aGVQb3N4OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3k6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVBbmltYXRpb246IFNwcml0ZUFuaW1hdGlvbixcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXJcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgb3B0aW9uc01hcDogb2JqZWN0XG4gICAgKTogdm9pZDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlU3ByaXRlSW5Hcm91cDogQ3JlYXRlU3ByaXRlSW5Hcm91cEZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHRoZUFuaW1hdGlvbjogU3ByaXRlQW5pbWF0aW9uIHwgb2JqZWN0LFxuICAgIHRoZVdpZHRoPzogbnVtYmVyLFxuICAgIHRoZUhlaWdodD86IG51bWJlcixcbiAgICB0aGVQb3N4PzogbnVtYmVyLFxuICAgIHRoZVBvc3k/OiBudW1iZXJcbik6IHZvaWQge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiAoZ3JvdXBOYW1lKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIkZpcnN0IGFyZ3VtZW50IGZvciBjcmVhdGVTcHJpdGVJbkdyb3VwIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgZ3JvdXBOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNwcml0ZUV4aXN0cyhncm91cE5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiY3JlYXRlU3ByaXRlSW5Hcm91cCBjYW5ub3QgZmluZCBncm91cCAoZG9lc24ndCBleGlzdD8pOiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIChzcHJpdGVOYW1lKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlNlY29uZCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIGEgU3RyaW5nLiBJbnN0ZWFkIGZvdW5kOiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc3ByaXRlR3JvdXBOYW1lRm9ybWF0SXNWYWxpZChzcHJpdGVOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlNwcml0ZSBuYW1lIGdpdmVuIHRvIGNyZWF0ZVNwcml0ZUluR3JvdXAgaXMgaW4gd3JvbmcgZm9ybWF0OiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzcHJpdGVFeGlzdHMoc3ByaXRlTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJjcmVhdGVTcHJpdGVJbkdyb3VwIGNhbm5vdCBjcmVhdGUgZHVwbGljYXRlIHNwcml0ZSB3aXRoIG5hbWU6IFwiICsgc3ByaXRlTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNSB8fCBhcmd1bWVudHMubGVuZ3RoID09PSA3KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mICh0aGVBbmltYXRpb24pICE9PSBcIm9iamVjdFwiIHx8ICh0aGVBbmltYXRpb24gaW5zdGFuY2VvZiBPYmplY3RcbiAgICAgICAgICAgICAgICAmJiAoIShcImltYWdlVVJMXCIgaW4gdGhlQW5pbWF0aW9uKSB8fCB0eXBlb2YgKHRoZUFuaW1hdGlvbltcImltYWdlVVJMXCJdKSAhPT0gXCJzdHJpbmdcIikpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcImNyZWF0ZVNwcml0ZUluR3JvdXAgY2Fubm90IHVzZSB0aGlzIGFzIGFuIGFuaW1hdGlvbjogXCIgKyB0aGVBbmltYXRpb25cbiAgICAgICAgICAgICAgICAgICAgKyBcIlxcbkFuaW1hdGlvbiBtdXN0IGJlIG9mIHR5cGUgU3ByaXRlQW5pbWF0aW9uIGJ1dCB5b3UgcHJvdmlkZWQgYTogXCIgKyB0eXBlb2YgKHRoZUFuaW1hdGlvbikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIldpZHRoIGFyZ3VtZW50IGZvciBjcmVhdGVTcHJpdGVJbkdyb3VwIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZVdpZHRoKTtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJIZWlnaHQgYXJndW1lbnQgZm9yIGNyZWF0ZVNwcml0ZUluR3JvdXAgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlSGVpZ2h0KTtcblxuXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNykge1xuICAgICAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIGFyZ3VtZW50IGZvciBjcmVhdGVTcHJpdGVJbkdyb3VwIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZVBvc3gpO1xuICAgICAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJZIGxvY2F0aW9uIGFyZ3VtZW50IGZvciBjcmVhdGVTcHJpdGVJbkdyb3VwIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZVBvc3kpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzJdICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlRoaXJkIGFyZ3VtZW50IGZvciBjcmVhdGVTcHJpdGVJbkdyb3VwIGV4cGVjdGVkIHRvIGJlIGEgZGljdGlvbmFyeS4gSW5zdGVhZCBmb3VuZDogXCIgKyBhcmd1bWVudHNbMl0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGVBbmltYXRpb24gaW5zdGFuY2VvZiBPYmplY3QgJiYgXCJpbWFnZVVSTFwiIGluIHRoZUFuaW1hdGlvbiAmJiB0eXBlb2YgdGhlQW5pbWF0aW9uW1wiaW1hZ2VVUkxcIl0gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiVGhpcmQgYXJndW1lbnQgZm9yIGNyZWF0ZVNwcml0ZUluR3JvdXAgZXhwZWN0ZWQgdG8gYmUgYSBkaWN0aW9uYXJ5LiBJbnN0ZWFkIGZvdW5kIHRoaXMgYW5pbWF0aW9uOiBcIiArIHRoZUFuaW1hdGlvbiArIFwiIHdpdGggaW1hZ2VVUkw6IFwiICsgdGhlQW5pbWF0aW9uW1wiaW1hZ2VVUkxcIl0gKyBcIi4gTWF5YmUgd3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50cyBwcm92aWRlZD8gQ2hlY2sgQVBJIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMgb2YgcGFyYW1ldGVycy5cIik7XG4gICAgICAgICAgICB9IC8vIGVsc2UgaG9wZSBpdCdzIGEgcHJvcGVyIHN0YW5kYXJkIG9wdGlvbnMgbWFwXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50cyB1c2VkIGZvciBjcmVhdGVTcHJpdGVJbkdyb3VwLiBDaGVjayBBUEkgZG9jdW1lbnRhdGlvbiBmb3IgZGV0YWlscyBvZiBwYXJhbWV0ZXJzLlwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA1KSB7XG4gICAgICAgICQoXCIjXCIgKyBncm91cE5hbWUpLmFkZFNwcml0ZShcbiAgICAgICAgICAgIHNwcml0ZU5hbWUsXG4gICAgICAgICAgICB7IGFuaW1hdGlvbjogdGhlQW5pbWF0aW9uLCB3aWR0aDogdGhlV2lkdGgsIGhlaWdodDogdGhlSGVpZ2h0IH1cbiAgICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDcpIHtcbiAgICAgICAgJChcIiNcIiArIGdyb3VwTmFtZSkuYWRkU3ByaXRlKFxuICAgICAgICAgICAgc3ByaXRlTmFtZSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IHRoZUFuaW1hdGlvbixcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhlV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGVIZWlnaHQsXG4gICAgICAgICAgICAgICAgcG9zeDogdGhlUG9zeCxcbiAgICAgICAgICAgICAgICBwb3N5OiB0aGVQb3N5XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7IC8vIHRyZWF0cyBhcmd1bWVudHNbMl0gYXMgYSBzdGFuZGFyZCBvcHRpb25zIG1hcFxuICAgICAgICAkKFwiI1wiICsgZ3JvdXBOYW1lKS5hZGRTcHJpdGUoc3ByaXRlTmFtZSwgYXJndW1lbnRzWzJdKTtcbiAgICB9XG59O1xuXG50eXBlIENyZWF0ZVRleHRTcHJpdGVJbkdyb3VwRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeDogbnVtYmVyLFxuICAgICAgICB0aGVQb3N5OiBudW1iZXJcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXJcbiAgICApOiB2b2lkO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cDogQ3JlYXRlVGV4dFNwcml0ZUluR3JvdXBGbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgIHRoZUhlaWdodDogbnVtYmVyLFxuICAgIHRoZVBvc3g/OiBudW1iZXIsXG4gICAgdGhlUG9zeT86IG51bWJlclxuKTogdm9pZCB7XG4gICAgLy8gdG8gYmUgdXNlZCBsaWtlIHNwcml0ZShcInRleHRCb3hcIikudGV4dChcImhpXCIpOyAvLyBvciAuaHRtbChcIjxiPmhpPC9iPlwiKTtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIGlmICh0eXBlb2YgKGdyb3VwTmFtZSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJGaXJzdCBhcmd1bWVudCBmb3IgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgbXVzdCBiZSBhIFN0cmluZy4gSW5zdGVhZCBmb3VuZDogXCIgKyBncm91cE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc3ByaXRlRXhpc3RzKGdyb3VwTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBjYW5ub3QgZmluZCBncm91cCAoZG9lc24ndCBleGlzdD8pOiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIChzcHJpdGVOYW1lKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlNlY29uZCBhcmd1bWVudCBmb3IgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgbXVzdCBiZSBhIFN0cmluZy4gSW5zdGVhZCBmb3VuZDogXCIgKyBzcHJpdGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNwcml0ZUdyb3VwTmFtZUZvcm1hdElzVmFsaWQoc3ByaXRlTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTcHJpdGUgbmFtZSBnaXZlbiB0byBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBpcyBpbiB3cm9uZyBmb3JtYXQ6IFwiICsgc3ByaXRlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNwcml0ZUV4aXN0cyhzcHJpdGVOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcImNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwIGNhbm5vdCBjcmVhdGUgZHVwbGljYXRlIHNwcml0ZSB3aXRoIG5hbWU6IFwiICsgc3ByaXRlTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNCB8fCBhcmd1bWVudHMubGVuZ3RoID09PSA2KSB7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiV2lkdGggYXJndW1lbnQgZm9yIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZVdpZHRoKTtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJIZWlnaHQgYXJndW1lbnQgZm9yIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZUhlaWdodCk7XG5cbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA2KSB7XG4gICAgICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlggbG9jYXRpb24gYXJndW1lbnQgZm9yIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZVBvc3gpO1xuICAgICAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJZIGxvY2F0aW9uIGFyZ3VtZW50IGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIHVzZWQgZm9yIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwLiBDaGVjayBBUEkgZG9jdW1lbnRhdGlvbiBmb3IgZGV0YWlscyBvZiBwYXJhbWV0ZXJzLlwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA0KSB7XG4gICAgICAgICQoXCIjXCIgKyBncm91cE5hbWUpLmFkZFNwcml0ZShzcHJpdGVOYW1lLCB7XG4gICAgICAgICAgICB3aWR0aDogdGhlV2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoZUhlaWdodFxuICAgICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDYpIHtcbiAgICAgICAgJChcIiNcIiArIGdyb3VwTmFtZSkuYWRkU3ByaXRlKHNwcml0ZU5hbWUsIHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGVXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogdGhlSGVpZ2h0LFxuICAgICAgICAgICAgcG9zeDogdGhlUG9zeCxcbiAgICAgICAgICAgIHBvc3k6IHRoZVBvc3lcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA0IHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDYpIHtcbiAgICAgICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLmNzcyhcImJhY2tncm91bmQtY29sb3JcIiwgXCJ3aGl0ZVwiKSAvLyBkZWZhdWx0IHRvIHdoaXRlIGJhY2tncm91bmQgZm9yIGVhc2Ugb2YgdXNlXG4gICAgICAgICAgICAuY3NzKFwidXNlci1zZWxlY3RcIiwgXCJub25lXCIpO1xuICAgIH1cbn07XG5cbmNvbnN0IHRleHRJbnB1dFNwcml0ZVRleHRBcmVhSWQgPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICByZXR1cm4gc3ByaXRlTmFtZSArIFwiLXRleHRhcmVhXCI7XG59O1xuY29uc3QgdGV4dElucHV0U3ByaXRlU3VibWl0QnV0dG9uSWQgPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICByZXR1cm4gc3ByaXRlTmFtZSArIFwiLWJ1dHRvblwiO1xufTtcbmNvbnN0IHRleHRJbnB1dFNwcml0ZUdRR19TSUdOQUxTX0lkID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIHNwcml0ZU5hbWUgKyBcIi1zdWJtaXR0ZWRcIjtcbn07XG50eXBlIENyZWF0ZVRleHRJbnB1dFNwcml0ZUluR3JvdXBGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyLFxuICAgICAgICByb3dzOiBudW1iZXIsXG4gICAgICAgIGNvbHM6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeDogbnVtYmVyLFxuICAgICAgICB0aGVQb3N5OiBudW1iZXIsXG4gICAgICAgIHN1Ym1pdEhhbmRsZXI6IFN1Ym1pdEhhbmRsZXJGblxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICAgICAgcm93czogbnVtYmVyLFxuICAgICAgICBjb2xzOiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3g6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeTogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyLFxuICAgICAgICByb3dzOiBudW1iZXIsXG4gICAgICAgIGNvbHM6IG51bWJlclxuICAgICk6IHZvaWQ7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVRleHRJbnB1dFNwcml0ZUluR3JvdXA6IENyZWF0ZVRleHRJbnB1dFNwcml0ZUluR3JvdXBGbiA9XG4gICAgZnVuY3Rpb24gKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICAgICAgcm93czogbnVtYmVyLFxuICAgICAgICBjb2xzOiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3g/OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3k/OiBudW1iZXIsXG4gICAgICAgIHN1Ym1pdEhhbmRsZXI/OiBTdWJtaXRIYW5kbGVyRm5cbiAgICApOiB2b2lkIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDYpIHtcbiAgICAgICAgICAgIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwKGdyb3VwTmFtZSwgc3ByaXRlTmFtZSwgdGhlV2lkdGgsIHRoZUhlaWdodCk7XG4gICAgICAgIH0gZWxzZSBpZiAoKGFyZ3VtZW50cy5sZW5ndGggPT09IDggfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gOSkgJiYgdGhlUG9zeCAmJlxuICAgICAgICAgICAgdGhlUG9zeSkge1xuICAgICAgICAgICAgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAoXG4gICAgICAgICAgICAgICAgZ3JvdXBOYW1lLFxuICAgICAgICAgICAgICAgIHNwcml0ZU5hbWUsXG4gICAgICAgICAgICAgICAgdGhlV2lkdGgsXG4gICAgICAgICAgICAgICAgdGhlSGVpZ2h0LFxuICAgICAgICAgICAgICAgIHRoZVBvc3gsXG4gICAgICAgICAgICAgICAgdGhlUG9zeVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNiB8fCBhcmd1bWVudHMubGVuZ3RoID09PSA4IHx8XG4gICAgICAgICAgICBhcmd1bWVudHMubGVuZ3RoID09PSA5KSB7XG4gICAgICAgICAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkuY3NzKFwiYmFja2dyb3VuZC1jb2xvclwiLCBcIndoaXRlXCIpOyAvLyBkZWZhdWx0IHRvIHdoaXRlIGJhY2tncm91bmQgZm9yIGVhc2Ugb2YgdXNlXG5cbiAgICAgICAgICAgIHZhciB0ZXh0YXJlYUh0bWwgPSAnPHRleHRhcmVhIGlkPVwiJyArXG4gICAgICAgICAgICAgICAgdGV4dElucHV0U3ByaXRlVGV4dEFyZWFJZChzcHJpdGVOYW1lKSArICdcIiByb3dzPVwiJyArIHJvd3MgK1xuICAgICAgICAgICAgICAgICdcIiBjb2xzPVwiJyArIGNvbHMgKyAnXCI+aGk8L3RleHRhcmVhPic7XG4gICAgICAgICAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkuYXBwZW5kKHRleHRhcmVhSHRtbCk7XG5cbiAgICAgICAgICAgIHZhciBidXR0b25JZCA9IHRleHRJbnB1dFNwcml0ZVN1Ym1pdEJ1dHRvbklkKHNwcml0ZU5hbWUpO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkh0bWwgPSAnPGJ1dHRvbiBpZD1cIicgKyBidXR0b25JZCArXG4gICAgICAgICAgICAgICAgJ1wiIHR5cGU9XCJidXR0b25cIj5TdWJtaXQ8L2J1dHRvbj4nO1xuICAgICAgICAgICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLmFwcGVuZChidXR0b25IdG1sKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA5KSB7XG4gICAgICAgICAgICB0ZXh0SW5wdXRTcHJpdGVTZXRIYW5kbGVyKHNwcml0ZU5hbWUsIHN1Ym1pdEhhbmRsZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGV4dElucHV0U3ByaXRlU2V0SGFuZGxlcihzcHJpdGVOYW1lKTtcbiAgICAgICAgfVxuICAgIH07XG5leHBvcnQgdHlwZSBTdWJtaXRIYW5kbGVyRm4gPSAoczogc3RyaW5nKSA9PiB2b2lkO1xuZXhwb3J0IGNvbnN0IHRleHRJbnB1dFNwcml0ZVNldEhhbmRsZXIgPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgc3VibWl0SGFuZGxlcj86IFN1Ym1pdEhhbmRsZXJGblxuKTogdm9pZCB7XG4gICAgdmFyIHJlYWxTdWJtaXRIYW5kbGVyO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIHJlYWxTdWJtaXRIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHN1Ym1pdEhhbmRsZXIpIHN1Ym1pdEhhbmRsZXIodGV4dElucHV0U3ByaXRlU3RyaW5nKHNwcml0ZU5hbWUpKTtcbiAgICAgICAgICAgIEdRR19TSUdOQUxTW3RleHRJbnB1dFNwcml0ZUdRR19TSUdOQUxTX0lkKHNwcml0ZU5hbWUpXSA9IHRydWU7XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmVhbFN1Ym1pdEhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBHUUdfU0lHTkFMU1t0ZXh0SW5wdXRTcHJpdGVHUUdfU0lHTkFMU19JZChzcHJpdGVOYW1lKV0gPSB0cnVlO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAkKFwiI1wiICsgdGV4dElucHV0U3ByaXRlU3VibWl0QnV0dG9uSWQoc3ByaXRlTmFtZSkpLmNsaWNrKHJlYWxTdWJtaXRIYW5kbGVyKTtcbn07XG5cbmV4cG9ydCBjb25zdCB0ZXh0SW5wdXRTcHJpdGVTdHJpbmcgPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICByZXR1cm4gU3RyaW5nKCQoXCIjXCIgKyB0ZXh0SW5wdXRTcHJpdGVUZXh0QXJlYUlkKHNwcml0ZU5hbWUpKVswXS52YWx1ZSk7XG59O1xuZXhwb3J0IGNvbnN0IHRleHRJbnB1dFNwcml0ZVNldFN0cmluZyA9IChcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgc3RyOiBzdHJpbmdcbik6IHZvaWQgPT4ge1xuICAgICQoXCIjXCIgKyB0ZXh0SW5wdXRTcHJpdGVUZXh0QXJlYUlkKHNwcml0ZU5hbWUpKVswXS52YWx1ZSA9IHN0cjtcbn07XG5cbmV4cG9ydCBjb25zdCB0ZXh0SW5wdXRTcHJpdGVSZXNldCA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICB0ZXh0UHJvbXB0Pzogc3RyaW5nXG4pIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB0ZXh0SW5wdXRTcHJpdGVTZXRTdHJpbmcoc3ByaXRlTmFtZSwgXCJcIik7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyICYmIHRleHRQcm9tcHQpIHtcbiAgICAgICAgdGV4dElucHV0U3ByaXRlU2V0U3RyaW5nKHNwcml0ZU5hbWUsIHRleHRQcm9tcHQpO1xuICAgIH1cbiAgICBHUUdfU0lHTkFMU1t0ZXh0SW5wdXRTcHJpdGVHUUdfU0lHTkFMU19JZChzcHJpdGVOYW1lKV0gPSBmYWxzZTtcbn07XG5cbmV4cG9ydCBjb25zdCB0ZXh0SW5wdXRTcHJpdGVTdWJtaXR0ZWQgPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKEdRR19TSUdOQUxTW3RleHRJbnB1dFNwcml0ZUdRR19TSUdOQUxTX0lkKHNwcml0ZU5hbWUpXSA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlbW92ZVNwcml0ZSA9IChzcHJpdGVOYW1lT3JPYmo6IHN0cmluZyB8IG9iamVjdCk6IHZvaWQgPT4ge1xuICAgIGlmICh0eXBlb2YgKHNwcml0ZU5hbWVPck9iaikgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWVPck9iaik7XG4gICAgICAgIH07XG4gICAgICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lT3JPYmopLnJlbW92ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICQoc3ByaXRlTmFtZU9yT2JqKS5yZW1vdmUoKTtcbiAgICB9XG59O1xuXG5leHBvcnQgY29uc3Qgc3ByaXRlID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHNwcml0ZURvbU9iamVjdCA9PiB7XG4gICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lKTtcbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVFeGlzdHMgPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgcmV0dXJuIChzcHJpdGVOYW1lID09ICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5hdHRyKFwiaWRcIikpOyAvLyBzcHJpdGVOYW1lIGNvdWxkIGJlIGdpdmVuIGFzIGFuIGludCBieSBhIHN0dWRlbnRcbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVPYmplY3QgPSAoXG4gICAgc3ByaXRlTmFtZU9yT2JqOiBzdHJpbmcgfCBvYmplY3Rcbik6IHNwcml0ZURvbU9iamVjdCA9PiB7XG4gICAgaWYgKHR5cGVvZiAoc3ByaXRlTmFtZU9yT2JqKSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gJChcIiNcIiArIHNwcml0ZU5hbWVPck9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICQoc3ByaXRlTmFtZU9yT2JqKTtcbiAgICB9XG59O1xuXG5leHBvcnQgY29uc3Qgc3ByaXRlSWQgPSAoc3ByaXRlTmFtZU9yT2JqOiBzdHJpbmcgfCBvYmplY3QpOiBzdHJpbmcgPT4ge1xuICAgIGlmICh0eXBlb2YgKHNwcml0ZU5hbWVPck9iaikgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZygkKFwiI1wiICsgc3ByaXRlTmFtZU9yT2JqKS5hdHRyKFwiaWRcIikpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcoJChzcHJpdGVOYW1lT3JPYmopLmF0dHIoXCJpZFwiKSk7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZUdldFggPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogbnVtYmVyID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICB9O1xuICAgIHJldHVybiAkKFwiI1wiICsgc3ByaXRlTmFtZSkueCgpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVHZXRZID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgfTtcbiAgICByZXR1cm4gJChcIiNcIiArIHNwcml0ZU5hbWUpLnkoKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlR2V0WiA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBudW1iZXIgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgIH07XG4gICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lKS56KCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVNldFggPSAoc3ByaXRlTmFtZTogc3RyaW5nLCB4dmFsOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlggbG9jYXRpb24gbXVzdCBiZSBhIG51bWJlci5cIiwgeHZhbCk7XG4gICAgfTtcbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkueCh4dmFsKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0WSA9IChzcHJpdGVOYW1lOiBzdHJpbmcsIHl2YWw6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB5dmFsKTtcbiAgICB9O1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS55KHl2YWwpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRaID0gKHNwcml0ZU5hbWU6IHN0cmluZywgenZhbDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJaIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHp2YWwpO1xuICAgIH07XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLnooenZhbCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVNldFhZID0gKFxuICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICB4dmFsOiBudW1iZXIsXG4gICAgeXZhbDogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlggbG9jYXRpb24gbXVzdCBiZSBhIG51bWJlci5cIiwgeHZhbCk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJZIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHl2YWwpO1xuICAgIH07XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLnh5KHh2YWwsIHl2YWwpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRYWVogPSAoXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHh2YWw6IG51bWJlcixcbiAgICB5dmFsOiBudW1iZXIsXG4gICAgenZhbDogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlggbG9jYXRpb24gbXVzdCBiZSBhIG51bWJlci5cIiwgeHZhbCk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJZIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHl2YWwpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWiBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB6dmFsKTtcbiAgICB9O1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS54eXooeHZhbCwgeXZhbCwgenZhbCk7XG59O1xuXG5leHBvcnQgY29uc3Qgc3ByaXRlR2V0V2lkdGggPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogbnVtYmVyID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICB9O1xuICAgIHJldHVybiAkKFwiI1wiICsgc3ByaXRlTmFtZSkudygpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVHZXRIZWlnaHQgPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogbnVtYmVyID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICB9O1xuICAgIHJldHVybiAkKFwiI1wiICsgc3ByaXRlTmFtZSkuaCgpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRXaWR0aCA9IChzcHJpdGVOYW1lOiBzdHJpbmcsIHd2YWw6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiV2lkdGggbXVzdCBiZSBhIG51bWJlci5cIiwgd3ZhbCk7XG4gICAgfVxuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS53KHd2YWwpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRIZWlnaHQgPSAoc3ByaXRlTmFtZTogc3RyaW5nLCBodmFsOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkhlaWdodCBtdXN0IGJlIGEgbnVtYmVyLlwiLCBodmFsKTtcbiAgICB9XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLmgoaHZhbCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVNldFdpZHRoSGVpZ2h0ID0gKFxuICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICB3dmFsOiBudW1iZXIsXG4gICAgaHZhbDogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIldpZHRoIG11c3QgYmUgYSBudW1iZXIuXCIsIHd2YWwpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiSGVpZ2h0IG11c3QgYmUgYSBudW1iZXIuXCIsIGh2YWwpO1xuICAgIH1cbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkud2god3ZhbCwgaHZhbCk7XG59O1xuXG5leHBvcnQgY29uc3Qgc3ByaXRlRmxpcFZlcnRpY2FsID0gKHNwcml0ZU5hbWU6IHN0cmluZywgZmxpcHBlZDogYm9vbGVhbik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgIH1cbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkuZmxpcHYoZmxpcHBlZCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZUZsaXBIb3Jpem9udGFsID0gKHNwcml0ZU5hbWU6IHN0cmluZywgZmxpcHBlZDogYm9vbGVhbik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgIH1cbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkuZmxpcGgoZmxpcHBlZCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZUdldEZsaXBWZXJ0aWNhbCA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5mbGlwdigpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVHZXRGbGlwSG9yaXpvbnRhbCA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5mbGlwaCgpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZVJvdGF0ZSA9IChcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgYW5nbGVEZWdyZWVzOiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiQW5nbGUgbXVzdCBiZSBhIG51bWJlci5cIiwgYW5nbGVEZWdyZWVzKTtcbiAgICB9XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLnJvdGF0ZShhbmdsZURlZ3JlZXMpO1xufTtcblxuY29uc3QgR1FHX1NQUklURVNfUFJPUFM6IHsgW3g6IHN0cmluZ106IHsgW3k6IHN0cmluZ106IGFueSB9IH0gPSB7fTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTY2FsZSA9IChzcHJpdGVOYW1lOiBzdHJpbmcsIHJhdGlvOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICAvLyBTY2FsZXMgdGhlIHNwcml0ZSdzIHdpZHRoL2hlaWdodCB3aXRoIHJhdGlvLCBcbiAgICAvLyBhbmQgc2V0IGl0cyBhbmltIHRvIDEwMCUgZml0IGl0LlxuICAgIC8vXG4gICAgLy8gTk9URTogV2UgYXNzdW1lIHRoYXQgdGhlIHdpZHRoL2hlaWdodCBvZiB0aGUgc3ByaXRlIFxuICAgIC8vIHVwb24gZmlyc3QgY2FsbCB0byB0aGlzIGZ1bmN0aW9uIGlzIHRoZSBcIm9yaWdpbmFsXCIgd2lkdGgvaGVpZ2h0IG9mIHRoZSBzcHJpdGUuXG4gICAgLy8gVGhpcyBhbmQgYWxsIHN1YnNlcXVlbnQgY2FsbHMgdG8gdGhpcyBmdW5jdGlvbiBjYWxjdWxhdGVzIHJhdGlvXG4gICAgLy8gcmVsYXRpdmUgdG8gdGhhdCBvcmlnaW5hbCB3aWR0aC9oZWlnaHQuXG5cbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlJhdGlvIG11c3QgYmUgYSBudW1iZXIuXCIsIHJhdGlvKTtcbiAgICB9XG5cbiAgICBsZXQgc3ByaXRlUHJvcCA9IEdRR19TUFJJVEVTX1BST1BTW3Nwcml0ZU5hbWVdO1xuICAgIGlmIChzcHJpdGVQcm9wID09IG51bGwpIHtcbiAgICAgICAgc3ByaXRlUHJvcCA9IHtcbiAgICAgICAgICAgIHdpZHRoT3JpZ2luYWw6IHNwcml0ZUdldFdpZHRoKHNwcml0ZU5hbWUpLFxuICAgICAgICAgICAgaGVpZ2h0T3JpZ2luYWw6IHNwcml0ZUdldEhlaWdodChzcHJpdGVOYW1lKVxuICAgICAgICB9O1xuICAgICAgICBHUUdfU1BSSVRFU19QUk9QU1tzcHJpdGVOYW1lXSA9IHNwcml0ZVByb3A7XG4gICAgfVxuICAgIGNvbnN0IG5ld1dpZHRoID0gc3ByaXRlUHJvcC53aWR0aE9yaWdpbmFsICogcmF0aW87XG4gICAgY29uc3QgbmV3SGVpZ2h0ID0gc3ByaXRlUHJvcC5oZWlnaHRPcmlnaW5hbCAqIHJhdGlvO1xuXG4gICAgLy8kKFwiI1wiICsgc3ByaXRlTmFtZSkuc2NhbGUocmF0aW8pOyAvLyBHUSBzY2FsZSBpcyB2ZXJ5IGJyb2tlbi5cbiAgICAvLyBHUSdzIHNjYWxlKCkgd2lsbCBzY2FsZSB0aGUgYW5pbSBpbWFnZSAod2hpY2ggaXMgYSBiYWNrZ3JvdW5kLWltYWdlIGluIHRoZSBkaXYpIHByb3Blcmx5XG4gICAgLy8gYW5kIGV2ZW4gc2NhbGUgdGhlIGRpdidzIHdpZHRoL2hlaWdodCBwcm9wZXJseVxuICAgIC8vIGJ1dCBzb21laG93IHRoZSBpbi1nYW1lIHdpZHRoL2hlaWdodCB0aGF0IEdRIHN0b3JlcyBmb3IgaXQgcmVtYWlucyB0aGUgb3JpZ2luYWwgc2l6ZVxuICAgIC8vIGFuZCB3b3JzZSwgdGhlIGhpdCBib3gncyB3aWR0aC9oZWlnaHQgdGhhdCBHUSB1c2VzIHRvIGNhbGN1bGF0ZSBjb2xsaXNpb24gZGV0ZWN0aW9uIHdpdGggXG4gICAgLy8gaXMgaW4gYmV0d2VlbiB0aGUgZGl2J3MgYW5kIHRoZSBzcHJpdGUncyB3aWR0aC9oZWlnaHQgKGFib3V0IGhhbGZ3YXkgYmV0d2Vlbj8gZG9uJ3Qga25vdykuXG5cbiAgICAvLyQoXCIjXCIgKyBzcHJpdGVOYW1lKS5jc3MoXCJ0cmFuc2Zvcm0tb3JpZ2luXCIsIFwidG9wIGxlZnRcIik7IC8vIGRvIE5PVCBjaGFuZ2UgdHJhbnNmb3JtLW9yaWdpbiwgZWxzZSBicmVha3MgY29sbGlzaW9uIGFuZCByb3RhdGVcbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkuY3NzKFwiYmFja2dyb3VuZC1zaXplXCIsIFwiMTAwJSAxMDAlXCIpOyAvLyBzdHJldGNoZXMgd2lkdGgvaGVpZ2h0IGluZGVwZW5kZW50bHkgdG8gd2lkdGgvaGVpZ2h0IG9mIGRpdlxuICAgIHNwcml0ZVNldFdpZHRoSGVpZ2h0KHNwcml0ZU5hbWUsIG5ld1dpZHRoLCBuZXdIZWlnaHQpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZVNldEFuaW1hdGlvbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIHNwcml0ZU5hbWVPck9iajogc3RyaW5nIHwgb2JqZWN0LFxuICAgIGFHUUFuaW1hdGlvbj86IG9iamVjdCxcbiAgICBjYWxsYmFja0Z1bmN0aW9uPzogRnVuY3Rpb25cbikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyICYmIGFHUUFuaW1hdGlvbiAhPSBudWxsKSB7XG4gICAgICAgIHNwcml0ZU9iamVjdChzcHJpdGVOYW1lT3JPYmopLnNldEFuaW1hdGlvbihhR1FBbmltYXRpb24pO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyAmJiBhR1FBbmltYXRpb24gIT0gbnVsbCAmJiB0eXBlb2YgY2FsbGJhY2tGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHNwcml0ZU9iamVjdChzcHJpdGVOYW1lT3JPYmopLnNldEFuaW1hdGlvbihhR1FBbmltYXRpb24sIGNhbGxiYWNrRnVuY3Rpb24pO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBzcHJpdGVPYmplY3Qoc3ByaXRlTmFtZU9yT2JqKS5zZXRBbmltYXRpb24oKTtcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVBhdXNlQW5pbWF0aW9uID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5wYXVzZUFuaW1hdGlvbigpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVSZXN1bWVBbmltYXRpb24gPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLnJlc3VtZUFuaW1hdGlvbigpO1xufTtcblxudHlwZSBKUU9iamVjdCA9IHtcbiAgICBvZmZzZXQ6ICgpID0+IHsgbGVmdDogbnVtYmVyLCB0b3A6IG51bWJlciB9O1xuICAgIG91dGVyV2lkdGg6ICh4OiBib29sZWFuKSA9PiBudW1iZXI7XG4gICAgb3V0ZXJIZWlnaHQ6ICh4OiBib29sZWFuKSA9PiBudW1iZXI7XG59O1xuY29uc3QganFPYmpzQ29sbGlkZUF4aXNBbGlnbmVkID0gZnVuY3Rpb24gKG9iajE6IEpRT2JqZWN0LCBvYmoyOiBKUU9iamVjdCkge1xuICAgIC8vIG9iajEvMiBtdXN0IGJlIGF4aXMgYWxpZ25lZCBqUXVlcnkgb2JqZWN0c1xuICAgIGNvbnN0IGQxTGVmdCA9IG9iajEub2Zmc2V0KCkubGVmdDtcbiAgICBjb25zdCBkMVJpZ2h0ID0gZDFMZWZ0ICsgb2JqMS5vdXRlcldpZHRoKHRydWUpO1xuICAgIGNvbnN0IGQxVG9wID0gb2JqMS5vZmZzZXQoKS50b3A7XG4gICAgY29uc3QgZDFCb3R0b20gPSBkMVRvcCArIG9iajEub3V0ZXJIZWlnaHQodHJ1ZSk7XG5cbiAgICBjb25zdCBkMkxlZnQgPSBvYmoyLm9mZnNldCgpLmxlZnQ7XG4gICAgY29uc3QgZDJSaWdodCA9IGQyTGVmdCArIG9iajIub3V0ZXJXaWR0aCh0cnVlKTtcbiAgICBjb25zdCBkMlRvcCA9IG9iajIub2Zmc2V0KCkudG9wO1xuICAgIGNvbnN0IGQyQm90dG9tID0gZDJUb3AgKyBvYmoyLm91dGVySGVpZ2h0KHRydWUpO1xuXG4gICAgcmV0dXJuICEoZDFCb3R0b20gPCBkMlRvcCB8fCBkMVRvcCA+IGQyQm90dG9tIHx8IGQxUmlnaHQgPCBkMkxlZnQgfHwgZDFMZWZ0ID4gZDJSaWdodCk7XG59O1xuXG50eXBlIERPTU9iamVjdCA9IHtcbiAgICBnZXRCb3VuZGluZ0NsaWVudFJlY3Q6ICgpID0+IHsgbGVmdDogbnVtYmVyLCB0b3A6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgYm90dG9tOiBudW1iZXIgfTtcbn07XG5jb25zdCBkb21PYmpzQ29sbGlkZUF4aXNBbGlnbmVkID0gZnVuY3Rpb24gKG9iajE6IERPTU9iamVjdCwgb2JqMjogRE9NT2JqZWN0KSB7XG4gICAgLy8gb2JqMS8yIGFyZSBET00gb2JqZWN0cywgcG9zc2libHkgcm90YXRlZFxuICAgIC8vIGNvbGxpc2lvbiBpcyBjaGVja2VkIHZpYSBheGlzIGFsaWduZWQgYm91bmRpbmcgcmVjdHNcbiAgICBjb25zdCByMSA9IG9iajEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgcjIgPSBvYmoyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiAhKHIxLmJvdHRvbSA8IHIyLnRvcCB8fCByMS50b3AgPiByMi5ib3R0b20gfHwgcjEucmlnaHQgPCByMi5sZWZ0IHx8IHIxLmxlZnQgPiByMi5yaWdodCk7XG59O1xuXG50eXBlIEdhbWVRdWVyeU9iamVjdCA9IHtcbiAgICBhbmdsZTogbnVtYmVyLFxuICAgIGFuaW1hdGlvbjogb2JqZWN0LFxuICAgIGJvdW5kaW5nQ2lyY2xlOiBvYmplY3QsXG4gICAgY3VycmVudEZyYW1lOiBudW1iZXIsXG4gICAgZmFjdG9yOiBudW1iZXIsXG4gICAgZmFjdG9yaDogbnVtYmVyLFxuICAgIGZhY3RvcnY6IG51bWJlcixcbiAgICBmcmFtZUluY3JlbWVudDogbnVtYmVyLFxuICAgIGdlb21ldHJ5OiBudW1iZXIsXG4gICAgaGVpZ2h0OiBudW1iZXIsXG4gICAgaWRsZUNvdW50ZXI6IG51bWJlcixcbiAgICBwbGF5aW5nOiBib29sZWFuLFxuICAgIHBvc09mZnNldFg6IG51bWJlcixcbiAgICBwb3NPZmZzZXRZOiBudW1iZXIsXG4gICAgcG9zeDogbnVtYmVyLFxuICAgIHBvc3k6IG51bWJlcixcbiAgICBwb3N6OiBudW1iZXIsXG4gICAgd2lkdGg6IG51bWJlclxufTtcbmNvbnN0IGdxT2Jqc0NvbGxpZGVBeGlzQWxpZ25lZCA9IGZ1bmN0aW9uIChvYmoxOiB7IGdhbWVRdWVyeTogR2FtZVF1ZXJ5T2JqZWN0IH0sIG9iajI6IHsgZ2FtZVF1ZXJ5OiBHYW1lUXVlcnlPYmplY3QgfSkge1xuICAgIC8vIG9iajEvMiBtdXN0IGJlIGF4aXMgYWxpZ25lZCBHUSBET00gb2JqZWN0c1xuICAgIC8vIHR1cm5zIG91dCB0aGlzIGlzIG5vdCByZWFsbHkgZmFzdGVyIHRoYW4gZG9tT2Jqc0NvbGxpZGVBeGlzQWxpZ25lZFxuICAgIGNvbnN0IHIxID0gb2JqMS5nYW1lUXVlcnk7XG4gICAgY29uc3QgcjFfYm90dG9tID0gcjEucG9zeSArIHIxLmhlaWdodDtcbiAgICBjb25zdCByMV9yaWdodCA9IHIxLnBvc3ggKyByMS53aWR0aDtcblxuICAgIGNvbnN0IHIyID0gb2JqMi5nYW1lUXVlcnk7XG4gICAgY29uc3QgcjJfYm90dG9tID0gcjIucG9zeSArIHIyLmhlaWdodDtcbiAgICBjb25zdCByMl9yaWdodCA9IHIyLnBvc3ggKyByMi53aWR0aDtcbiAgICByZXR1cm4gIShyMV9ib3R0b20gPCByMi5wb3N5IHx8IHIxLnBvc3kgPiByMl9ib3R0b20gfHwgcjFfcmlnaHQgPCByMi5wb3N4IHx8IHIxLnBvc3ggPiByMl9yaWdodCk7XG59O1xuXG5cbi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbiByZXR1cm5zIHJhZGl1cyBvZiByZWN0YW5ndWxhciBnZW9tZXRyeVxuICogXG4gKiBAcGFyYW0gZWxlbVxuICogQHBhcmFtIGFuZ2xlIHRoZSBhbmdsZSBpbiBkZWdyZWVzXG4gKiBAcmV0dXJuIC54LCAueSByYWRpdXMgb2YgZ2VvbWV0cnlcbiAqL1xuY29uc3QgcHJvamVjdEdxT2JqID0gZnVuY3Rpb24gKGVsZW06IEdhbWVRdWVyeU9iamVjdCwgYW5nbGU6IG51bWJlcik6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSB7XG4gICAgLy8gYmFzZWQgb24gYSBHUSBmbi5cbiAgICBjb25zdCBiID0gYW5nbGUgKiBNYXRoLlBJIC8gMTgwO1xuICAgIGNvbnN0IFJ4ID0gTWF0aC5hYnMoTWF0aC5jb3MoYikgKiBlbGVtLndpZHRoIC8gMiAqIGVsZW0uZmFjdG9yKSArIE1hdGguYWJzKE1hdGguc2luKGIpICogZWxlbS5oZWlnaHQgLyAyICogZWxlbS5mYWN0b3IpO1xuICAgIGNvbnN0IFJ5ID0gTWF0aC5hYnMoTWF0aC5jb3MoYikgKiBlbGVtLmhlaWdodCAvIDIgKiBlbGVtLmZhY3RvcikgKyBNYXRoLmFicyhNYXRoLnNpbihiKSAqIGVsZW0ud2lkdGggLyAyICogZWxlbS5mYWN0b3IpO1xuICAgIHJldHVybiB7IHg6IFJ4LCB5OiBSeSB9O1xufTtcblxuLyoqXG4gKiBVdGlsaXR5IGZ1bmN0aW9uIHJldHVybnMgd2hldGhlciB0d28gbm9uLWF4aXMgYWxpZ25lZCByZWN0YW5ndWxhciBvYmplY3RzIGFyZSBjb2xsaWRpbmdcbiAqIFxuICogQHBhcmFtIGVsZW0xXG4gKiBAcGFyYW0gZWxlbTFDZW50ZXJYIHgtY29vcmQgb2YgY2VudGVyIG9mIGJvdW5kaW5nIGNpcmNsZS9yZWN0IG9mIGVsZW0xXG4gKiBAcGFyYW0gZWxlbTFDZW50ZXJZIHktY29vcmQgb2YgY2VudGVyIG9mIGJvdW5kaW5nIGNpcmNsZS9yZWN0IG9mIGVsZW0xXG4gKiBAcGFyYW0gZWxlbTJcbiAqIEBwYXJhbSBlbGVtMkNlbnRlclggeC1jb29yZCBvZiBjZW50ZXIgb2YgYm91bmRpbmcgY2lyY2xlL3JlY3Qgb2YgZWxlbTJcbiAqIEBwYXJhbSBlbGVtMkNlbnRlclkgeS1jb29yZCBvZiBjZW50ZXIgb2YgYm91bmRpbmcgY2lyY2xlL3JlY3Qgb2YgZWxlbTJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IGlmIHRoZSB0d28gZWxlbWVudHMgY29sbGlkZSBvciBub3RcbiAqL1xuY29uc3QgZ3FPYmpzQ29sbGlkZSA9IGZ1bmN0aW9uIChlbGVtMTogR2FtZVF1ZXJ5T2JqZWN0LCBlbGVtMUNlbnRlclg6IG51bWJlciwgZWxlbTFDZW50ZXJZOiBudW1iZXIsXG4gICAgZWxlbTI6IEdhbWVRdWVyeU9iamVjdCwgZWxlbTJDZW50ZXJYOiBudW1iZXIsIGVsZW0yQ2VudGVyWTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgLy8gdGVzdCByZWFsIGNvbGxpc2lvbiAob25seSBmb3IgdHdvIHJlY3RhbmdsZXM7IGNvdWxkIGJlIHJvdGF0ZWQpXG4gICAgLy8gYmFzZWQgb24gYW5kIGZpeGVzIGEgYnJva2VuIEdRIGZuLlxuICAgIGNvbnN0IGR4ID0gZWxlbTJDZW50ZXJYIC0gZWxlbTFDZW50ZXJYOyAvLyBHUSB1c2VzIGl0cyBib3VuZGluZ0NpcmNsZSB0byBjYWxjdWxhdGUgdGhlc2UsIGJ1dFxuICAgIGNvbnN0IGR5ID0gZWxlbTJDZW50ZXJZIC0gZWxlbTFDZW50ZXJZOyAvLyBHUSBib3VuZGluZ0NpcmNsZXMgYXJlIGJyb2tlbiB3aGVuIHNwcml0ZXMgYXJlIHNjYWxlZFxuICAgIGNvbnN0IGEgPSBNYXRoLmF0YW4oZHkgLyBkeCk7XG5cbiAgICBsZXQgRHggPSBNYXRoLmFicyhNYXRoLmNvcyhhIC0gZWxlbTEuYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSAvIE1hdGguY29zKGEpICogZHgpO1xuICAgIGxldCBEeSA9IE1hdGguYWJzKE1hdGguc2luKGEgLSBlbGVtMS5hbmdsZSAqIE1hdGguUEkgLyAxODApIC8gTWF0aC5zaW4oYSkgKiBkeSk7XG5cbiAgICBsZXQgUiA9IHByb2plY3RHcU9iaihlbGVtMiwgZWxlbTIuYW5nbGUgLSBlbGVtMS5hbmdsZSk7XG5cbiAgICBpZiAoKGVsZW0xLndpZHRoIC8gMiAqIGVsZW0xLmZhY3RvciArIFIueCA8PSBEeCkgfHwgKGVsZW0xLmhlaWdodCAvIDIgKiBlbGVtMS5mYWN0b3IgKyBSLnkgPD0gRHkpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBEeCA9IE1hdGguYWJzKE1hdGguY29zKGEgLSBlbGVtMi5hbmdsZSAqIE1hdGguUEkgLyAxODApIC8gTWF0aC5jb3MoYSkgKiAtZHgpO1xuICAgICAgICBEeSA9IE1hdGguYWJzKE1hdGguc2luKGEgLSBlbGVtMi5hbmdsZSAqIE1hdGguUEkgLyAxODApIC8gTWF0aC5zaW4oYSkgKiAtZHkpO1xuXG4gICAgICAgIFIgPSBwcm9qZWN0R3FPYmooZWxlbTEsIGVsZW0xLmFuZ2xlIC0gZWxlbTIuYW5nbGUpO1xuXG4gICAgICAgIGlmICgoZWxlbTIud2lkdGggLyAyICogZWxlbTIuZmFjdG9yICsgUi54IDw9IER4KSB8fCAoZWxlbTIuaGVpZ2h0IC8gMiAqIGVsZW0yLmZhY3RvciArIFIueSA8PSBEeSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0IHR5cGUgQ29sbGlzaW9uSGFuZGxpbmdGbiA9IChjb2xsSW5kZXg6IG51bWJlciwgaGl0U3ByaXRlOiBvYmplY3QpID0+XG4gICAgdm9pZDtcbmV4cG9ydCBjb25zdCBmb3JFYWNoU3ByaXRlU3ByaXRlQ29sbGlzaW9uRG8gPSAoXG4gICAgc3ByaXRlMU5hbWU6IHN0cmluZyxcbiAgICBzcHJpdGUyTmFtZTogc3RyaW5nLFxuICAgIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb246IENvbGxpc2lvbkhhbmRsaW5nRm5cbik6IHZvaWQgPT4ge1xuICAgICQoc3ByaXRlRmlsdGVyZWRDb2xsaXNpb24oc3ByaXRlMU5hbWUsIFwiLmdRX2dyb3VwLCAjXCIgKyBzcHJpdGUyTmFtZSkpLmVhY2goY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbik7XG4gICAgLy8gY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbiBjYW4gb3B0aW9uYWxseSB0YWtlIHR3byBhcmd1bWVudHM6IGNvbGxJbmRleCwgaGl0U3ByaXRlXG4gICAgLy8gc2VlIGh0dHA6Ly9hcGkuanF1ZXJ5LmNvbS9qUXVlcnkuZWFjaFxufTtcbmV4cG9ydCBjb25zdCBmb3JFYWNoMlNwcml0ZXNIaXQgPSAoKCkgPT4ge1xuICAgIHZhciBwcmludGVkID0gZmFsc2U7XG4gICAgcmV0dXJuIChzcHJpdGUxTmFtZTogc3RyaW5nLCBzcHJpdGUyTmFtZTogc3RyaW5nLCBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uOiBDb2xsaXNpb25IYW5kbGluZ0ZuKSA9PiB7XG4gICAgICAgIGlmICghcHJpbnRlZCkge1xuICAgICAgICAgICAgcHJpbnRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiRGVwcmVjYXRlZCBmdW5jdGlvbiB1c2VkOiBmb3JFYWNoMlNwcml0ZXNIaXQuICBVc2Ugd2hlbjJTcHJpdGVzSGl0IGluc3RlYWQgZm9yIGJldHRlciBwZXJmb3JtYW5jZS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgZm9yRWFjaFNwcml0ZVNwcml0ZUNvbGxpc2lvbkRvKHNwcml0ZTFOYW1lLCBzcHJpdGUyTmFtZSwgY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbik7XG4gICAgfTtcbn0pKCk7XG5leHBvcnQgY29uc3Qgd2hlbjJTcHJpdGVzSGl0ID0gZm9yRWFjaFNwcml0ZVNwcml0ZUNvbGxpc2lvbkRvOyAvLyBORVdcblxuZXhwb3J0IGNvbnN0IGZvckVhY2hTcHJpdGVHcm91cENvbGxpc2lvbkRvID0gKFxuICAgIHNwcml0ZTFOYW1lOiBzdHJpbmcsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbjogQ29sbGlzaW9uSGFuZGxpbmdGblxuKTogdm9pZCA9PiB7XG4gICAgJChzcHJpdGVGaWx0ZXJlZENvbGxpc2lvbihzcHJpdGUxTmFtZSwgXCIjXCIgKyBncm91cE5hbWUgKyBcIiwgLmdRX3Nwcml0ZVwiKSkuZWFjaChjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uKTtcbiAgICAvLyBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uIGNhbiBvcHRpb25hbGx5IHRha2UgdHdvIGFyZ3VtZW50czogY29sbEluZGV4LCBoaXRTcHJpdGVcbiAgICAvLyBzZWUgaHR0cDovL2FwaS5qcXVlcnkuY29tL2pRdWVyeS5lYWNoXG59O1xuZXhwb3J0IGNvbnN0IGZvckVhY2hTcHJpdGVHcm91cEhpdCA9IGZvckVhY2hTcHJpdGVHcm91cENvbGxpc2lvbkRvO1xuXG5leHBvcnQgY29uc3QgZm9yRWFjaFNwcml0ZUZpbHRlcmVkQ29sbGlzaW9uRG8gPSAoXG4gICAgc3ByaXRlMU5hbWU6IHN0cmluZyxcbiAgICBmaWx0ZXJTdHI6IHN0cmluZyxcbiAgICBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uOiBDb2xsaXNpb25IYW5kbGluZ0ZuXG4pOiB2b2lkID0+IHtcbiAgICAkKHNwcml0ZUZpbHRlcmVkQ29sbGlzaW9uKHNwcml0ZTFOYW1lLCBmaWx0ZXJTdHIpKS5lYWNoKGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb24pO1xuICAgIC8vIHNlZSBodHRwOi8vZ2FtZXF1ZXJ5anMuY29tL2RvY3VtZW50YXRpb24vYXBpLyNjb2xsaXNpb24gZm9yIGZpbHRlclN0ciBzcGVjXG4gICAgLy8gY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbiBjYW4gb3B0aW9uYWxseSB0YWtlIHR3byBhcmd1bWVudHM6IGNvbGxJbmRleCwgaGl0U3ByaXRlXG4gICAgLy8gc2VlIGh0dHA6Ly9hcGkuanF1ZXJ5LmNvbS9qUXVlcnkuZWFjaFxufTtcbmV4cG9ydCBjb25zdCBmb3JFYWNoU3ByaXRlRmlsdGVyZWRIaXQgPSBmb3JFYWNoU3ByaXRlRmlsdGVyZWRDb2xsaXNpb25EbztcblxuY29uc3Qgc3ByaXRlRmlsdGVyZWRDb2xsaXNpb24gPSBmdW5jdGlvbiAoc3ByaXRlMU5hbWU6IHN0cmluZywgZmlsdGVyOiBzdHJpbmcpOiBET01PYmplY3RbXSB7XG4gICAgLy8gQmFzZWQgb24gYW5kIGZpeGVzIEdRJ3MgY29sbGlzaW9uIGZ1bmN0aW9uLCBiZWNhdXNlIEdRJ3MgY29sbGlkZSBcbiAgICAvLyBmdW5jdGlvbiBpcyBiYWRseSBicm9rZW4gd2hlbiBzcHJpdGVzIGFyZSByb3RhdGVkL3NjYWxlZFxuICAgIC8vIFRoZSBmaXggaXMgdG8gY2hlY2sgY29sbGlzaW9uIHVzaW5nIGF4aXMgYWxpZ25lZCByZWN0YW5ndWxhciBoaXQgYm94ZXMuXG4gICAgLy8gTm90IGdyZWF0IGZvciByb3RhdGVkIHNwcml0ZXMsIGJ1dCBnb29kIGVub3VnaCBmb3Igbm93LlxuICAgIGNvbnN0IHMxID0gJChcIiNcIiArIHNwcml0ZTFOYW1lKTtcbiAgICB2YXIgcmVzdWx0TGlzdCA9IFtdO1xuXG4gICAgLy9pZiAodGhpcyAhPT0gJC5nYW1lUXVlcnkucGxheWdyb3VuZCkge1xuICAgIC8vIFdlIG11c3QgZmluZCBhbGwgdGhlIGVsZW1lbnRzIHRoYXQgdG91Y2hlICd0aGlzJ1xuICAgIHZhciBlbGVtZW50c1RvQ2hlY2sgPSBuZXcgQXJyYXkoKTtcbiAgICBlbGVtZW50c1RvQ2hlY2sucHVzaCgkLmdhbWVRdWVyeS5zY2VuZWdyYXBoLmNoaWxkcmVuKGZpbHRlcikuZ2V0KCkpO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGVsZW1lbnRzVG9DaGVjay5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICB2YXIgc3ViTGVuID0gZWxlbWVudHNUb0NoZWNrW2ldLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKHN1Ykxlbi0tKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudFRvQ2hlY2sgPSBlbGVtZW50c1RvQ2hlY2tbaV1bc3ViTGVuXTtcbiAgICAgICAgICAgIC8vIElzIGl0IGEgZ2FtZVF1ZXJ5IGdlbmVyYXRlZCBlbGVtZW50P1xuICAgICAgICAgICAgaWYgKGVsZW1lbnRUb0NoZWNrLmdhbWVRdWVyeSkge1xuICAgICAgICAgICAgICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gY2hlY2sgZ3JvdXBzXG4gICAgICAgICAgICAgICAgaWYgKCFlbGVtZW50VG9DaGVjay5nYW1lUXVlcnkuZ3JvdXAgJiYgIWVsZW1lbnRUb0NoZWNrLmdhbWVRdWVyeS50aWxlU2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIERvZXMgaXQgdG91Y2hlIHRoZSBzZWxlY3Rpb24/XG4gICAgICAgICAgICAgICAgICAgIGlmIChzMVswXSAhPSBlbGVtZW50VG9DaGVjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgYm91bmRpbmcgY2lyY2xlIGNvbGxpc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgLyp2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3cob2Zmc2V0WSArIGdhbWVRdWVyeS5ib3VuZGluZ0NpcmNsZS55IC0gZWxlbWVudHNUb0NoZWNrW2ldLm9mZnNldFkgLSBlbGVtZW50VG9DaGVjay5nYW1lUXVlcnkuYm91bmRpbmdDaXJjbGUueSwgMikgKyBNYXRoLnBvdyhvZmZzZXRYICsgZ2FtZVF1ZXJ5LmJvdW5kaW5nQ2lyY2xlLnggLSBlbGVtZW50c1RvQ2hlY2tbaV0ub2Zmc2V0WCAtIGVsZW1lbnRUb0NoZWNrLmdhbWVRdWVyeS5ib3VuZGluZ0NpcmNsZS54LCAyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgLSBnYW1lUXVlcnkuYm91bmRpbmdDaXJjbGUucmFkaXVzIC0gZWxlbWVudFRvQ2hlY2suZ2FtZVF1ZXJ5LmJvdW5kaW5nQ2lyY2xlLnJhZGl1cyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgczFSZWN0ID0gczFbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlMlJlY3QgPSBlbGVtZW50VG9DaGVjay5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHMxUmVjdC5ib3R0b20gPCBlMlJlY3QudG9wIHx8IHMxUmVjdC50b3AgPiBlMlJlY3QuYm90dG9tXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgczFSZWN0LnJpZ2h0IDwgZTJSZWN0LmxlZnQgfHwgczFSZWN0LmxlZnQgPiBlMlJlY3QucmlnaHQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgcmVhbCBjb2xsaXNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2lmIChjb2xsaWRlKGdhbWVRdWVyeSwgeyB4OiBvZmZzZXRYLCB5OiBvZmZzZXRZIH0sIGVsZW1lbnRUb0NoZWNrLmdhbWVRdWVyeSwgeyB4OiBlbGVtZW50c1RvQ2hlY2tbaV0ub2Zmc2V0WCwgeTogZWxlbWVudHNUb0NoZWNrW2ldLm9mZnNldFkgfSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHUSdzIGNvbGxpZGUgaXMgdmVyeSBicm9rZW4gaWYgcm90YXRpb24gYXBwbGllZFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHMxWzBdLmdhbWVRdWVyeS5hbmdsZSAlIDkwID09PSAwICYmIGVsZW1lbnRUb0NoZWNrLmdhbWVRdWVyeS5hbmdsZSAlIDkwID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGF4aXMgYWxpZ25lZCBjb2xsaXNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWRkIHRvIHRoZSByZXN1bHQgbGlzdCBpZiBjb2xsaXNpb24gZGV0ZWN0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0TGlzdC5wdXNoKGVsZW1lbnRzVG9DaGVja1tpXVtzdWJMZW5dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBub3QgYXhpcyBhbGlnbmVkIGNvbGxpc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzMUNlbnRlclggPSBzMVJlY3QubGVmdCArIChzMVJlY3QucmlnaHQgLSBzMVJlY3QubGVmdCkgLyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzMUNlbnRlclkgPSBzMVJlY3QudG9wICsgKHMxUmVjdC5ib3R0b20gLSBzMVJlY3QudG9wKSAvIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGUyQ2VudGVyWCA9IGUyUmVjdC5sZWZ0ICsgKGUyUmVjdC5yaWdodCAtIGUyUmVjdC5sZWZ0KSAvIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGUyQ2VudGVyWSA9IGUyUmVjdC50b3AgKyAoZTJSZWN0LmJvdHRvbSAtIGUyUmVjdC50b3ApIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdxT2Jqc0NvbGxpZGUoczFbMF0uZ2FtZVF1ZXJ5LCBzMUNlbnRlclgsIHMxQ2VudGVyWSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRUb0NoZWNrLmdhbWVRdWVyeSwgZTJDZW50ZXJYLCBlMkNlbnRlclkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBZGQgdG8gdGhlIHJlc3VsdCBsaXN0IGlmIGNvbGxpc2lvbiBkZXRlY3RlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0TGlzdC5wdXNoKGVsZW1lbnRzVG9DaGVja1tpXVtzdWJMZW5dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIGNoaWxkcmVuIG5vZGVzIHRvIHRoZSBsaXN0XG4gICAgICAgICAgICAgICAgdmFyIGVsZUNoaWxkcmVuID0gJChlbGVtZW50VG9DaGVjaykuY2hpbGRyZW4oZmlsdGVyKTtcbiAgICAgICAgICAgICAgICBpZiAoZWxlQ2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzVG9DaGVjay5wdXNoKGVsZUNoaWxkcmVuLmdldCgpKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHNUb0NoZWNrW2xlbl0ub2Zmc2V0WCA9IGVsZW1lbnRUb0NoZWNrLmdhbWVRdWVyeS5wb3N4ICsgZWxlbWVudHNUb0NoZWNrW2ldLm9mZnNldFg7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzVG9DaGVja1tsZW5dLm9mZnNldFkgPSBlbGVtZW50VG9DaGVjay5nYW1lUXVlcnkucG9zeSArIGVsZW1lbnRzVG9DaGVja1tpXS5vZmZzZXRZO1xuICAgICAgICAgICAgICAgICAgICBsZW4rKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0TGlzdDtcbn07XG5cbmV4cG9ydCB0eXBlIFNwcml0ZUhpdERpcmVjdGlvbmFsaXR5ID0ge1xuICAgIFwibGVmdFwiOiBib29sZWFuO1xuICAgIFwicmlnaHRcIjogYm9vbGVhbjtcbiAgICBcInVwXCI6IGJvb2xlYW47XG4gICAgXCJkb3duXCI6IGJvb2xlYW47XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZUhpdERpcmVjdGlvbiA9IChcbiAgICBzcHJpdGUxSWQ6IHN0cmluZyxcbiAgICBzcHJpdGUxWDogbnVtYmVyLFxuICAgIHNwcml0ZTFZOiBudW1iZXIsXG4gICAgc3ByaXRlMVhTcGVlZDogbnVtYmVyLFxuICAgIHNwcml0ZTFZU3BlZWQ6IG51bWJlcixcbiAgICBzcHJpdGUxV2lkdGg6IG51bWJlcixcbiAgICBzcHJpdGUxSGVpZ2h0OiBudW1iZXIsXG4gICAgc3ByaXRlMklkOiBzdHJpbmcsXG4gICAgc3ByaXRlMlg6IG51bWJlcixcbiAgICBzcHJpdGUyWTogbnVtYmVyLFxuICAgIHNwcml0ZTJYU3BlZWQ6IG51bWJlcixcbiAgICBzcHJpdGUyWVNwZWVkOiBudW1iZXIsXG4gICAgc3ByaXRlMldpZHRoOiBudW1iZXIsXG4gICAgc3ByaXRlMkhlaWdodDogbnVtYmVyXG4pOiBTcHJpdGVIaXREaXJlY3Rpb25hbGl0eSA9PiB7XG4gICAgdmFyIHNwcml0ZTFJbmZvOiBTcHJpdGVEaWN0ID0ge1xuICAgICAgICBcImlkXCI6IHNwcml0ZTFJZCxcbiAgICAgICAgXCJ4UG9zXCI6IHNwcml0ZTFYLFxuICAgICAgICBcInlQb3NcIjogc3ByaXRlMVksXG4gICAgICAgIFwieFNwZWVkXCI6IHNwcml0ZTFYU3BlZWQsXG4gICAgICAgIFwieVNwZWVkXCI6IHNwcml0ZTFZU3BlZWQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHNwcml0ZTFIZWlnaHQsXG4gICAgICAgIFwid2lkdGhcIjogc3ByaXRlMVdpZHRoXG4gICAgfTtcbiAgICB2YXIgc3ByaXRlMkluZm86IFNwcml0ZURpY3QgPSB7XG4gICAgICAgIFwiaWRcIjogc3ByaXRlMklkLFxuICAgICAgICBcInhQb3NcIjogc3ByaXRlMlgsXG4gICAgICAgIFwieVBvc1wiOiBzcHJpdGUyWSxcbiAgICAgICAgXCJ4U3BlZWRcIjogc3ByaXRlMlhTcGVlZCxcbiAgICAgICAgXCJ5U3BlZWRcIjogc3ByaXRlMllTcGVlZCxcbiAgICAgICAgXCJoZWlnaHRcIjogc3ByaXRlMkhlaWdodCxcbiAgICAgICAgXCJ3aWR0aFwiOiBzcHJpdGUyV2lkdGhcbiAgICB9O1xuICAgIHJldHVybiBzcHJpdGVIaXREaXIoc3ByaXRlMUluZm8sIHNwcml0ZTJJbmZvKTtcbn07XG5cbmV4cG9ydCB0eXBlIFNwcml0ZVBoeXNpY2FsRGltZW5zaW9ucyA9IHtcbiAgICBcInhQb3NcIjogbnVtYmVyO1xuICAgIFwieVBvc1wiOiBudW1iZXI7XG4gICAgXCJ4U3BlZWRcIjogbnVtYmVyOyAvLyBtb3ZlbWVudCBtdXN0IGJlIGJ5IGRpY3Rpb25hcnksXG4gICAgXCJ5U3BlZWRcIjogbnVtYmVyOyAvLyB3aXRoIHNvbWV0aGluZyBsaWtlIHggPSB4ICsgeFNwZWVkXG4gICAgXCJ3aWR0aFwiOiBudW1iZXI7XG4gICAgXCJoZWlnaHRcIjogbnVtYmVyO1xufTtcbmV4cG9ydCB0eXBlIFNwcml0ZURpY3QgPSBTcHJpdGVQaHlzaWNhbERpbWVuc2lvbnMgJiB7XG4gICAgXCJpZFwiOiBzdHJpbmc7XG4gICAgW3M6IHN0cmluZ106IGFueTtcbn07XG5jb25zdCBzcHJpdGVzU3BlZWRTYW1wbGVzOiB7IFtrOiBzdHJpbmddOiB7IHNhbXBsZVNpemU6IG51bWJlciwgeFNwZWVkU2FtcGxlczogbnVtYmVyW10sIHlTcGVlZFNhbXBsZXM6IG51bWJlcltdLCBjaGVja2VkOiBib29sZWFuIH0gfSA9IHt9O1xuY29uc3QgY2hlY2tTcHJpdGVTcGVlZFVzYWdlQ29tbW9uRXJyb3JzID0gKHNwcml0ZUluZm86IFNwcml0ZURpY3QpID0+IHtcbiAgICAvLyBBIGhldXJpc3RpYyBjaGVjayBmb3IgY29tbW9uIGVycm9ycyBmcm9tIGxlYXJuZXJzLlxuICAgIC8vIENoZWNrIGlmIHNwcml0ZSBzcGVlZHMgZXZlciBjaGFuZ2UuICBJZiBub3QsIHByb2JhYmx5IGRvaW5nIGl0IHdyb25nLlxuICAgIGlmICghc3ByaXRlc1NwZWVkU2FtcGxlc1tzcHJpdGVJbmZvW1wiaWRcIl1dKSB7XG4gICAgICAgIHNwcml0ZXNTcGVlZFNhbXBsZXNbc3ByaXRlSW5mb1tcImlkXCJdXSA9IHtcbiAgICAgICAgICAgIHNhbXBsZVNpemU6IDAsXG4gICAgICAgICAgICB4U3BlZWRTYW1wbGVzOiBbXSxcbiAgICAgICAgICAgIHlTcGVlZFNhbXBsZXM6IFtdLFxuICAgICAgICAgICAgY2hlY2tlZDogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzcHJpdGUxU2FtcGxpbmcgPSBzcHJpdGVzU3BlZWRTYW1wbGVzW3Nwcml0ZUluZm9bXCJpZFwiXV07XG4gICAgICAgIGNvbnN0IG1heFNhbXBsZVNpemUgPSAxMDtcbiAgICAgICAgaWYgKHNwcml0ZTFTYW1wbGluZy5zYW1wbGVTaXplIDwgbWF4U2FtcGxlU2l6ZSkge1xuICAgICAgICAgICAgKytzcHJpdGUxU2FtcGxpbmcuc2FtcGxlU2l6ZTtcbiAgICAgICAgICAgIHNwcml0ZTFTYW1wbGluZy54U3BlZWRTYW1wbGVzLnB1c2goc3ByaXRlSW5mb1tcInhTcGVlZFwiXSk7XG4gICAgICAgICAgICBzcHJpdGUxU2FtcGxpbmcueVNwZWVkU2FtcGxlcy5wdXNoKHNwcml0ZUluZm9bXCJ5U3BlZWRcIl0pO1xuICAgICAgICB9IGVsc2UgaWYgKCFzcHJpdGUxU2FtcGxpbmcuY2hlY2tlZCkge1xuICAgICAgICAgICAgc3ByaXRlMVNhbXBsaW5nLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgY29uc3Qgc3MgPSBzcHJpdGUxU2FtcGxpbmcuc2FtcGxlU2l6ZTtcbiAgICAgICAgICAgIGNvbnN0IHN4U2FtcGxlcyA9IHNwcml0ZTFTYW1wbGluZy54U3BlZWRTYW1wbGVzO1xuICAgICAgICAgICAgY29uc3Qgc3lTYW1wbGVzID0gc3ByaXRlMVNhbXBsaW5nLnlTcGVlZFNhbXBsZXM7XG5cbiAgICAgICAgICAgIGxldCBzYW1lWHNwZWVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc3M7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChzeFNhbXBsZXNbaV0gIT09IHN4U2FtcGxlc1tpIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgc2FtZVhzcGVlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2FtZVhzcGVlZCAmJiBzeFNhbXBsZXNbMF0gIT09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhHUUdfV0FSTklOR19JTl9NWVBST0dSQU1fTVNHXG4gICAgICAgICAgICAgICAgICAgICsgXCJzcHJpdGUgaGl0IGRpcmVjdGlvbiBmdW5jdGlvbmFsaXR5LSBwb3NzaWJseSB3cm9uZyB4UG9zIGNhbGN1bGF0aW9uIGZvciBzcHJpdGU6IFwiXG4gICAgICAgICAgICAgICAgICAgICsgc3ByaXRlSW5mb1tcImlkXCJdXG4gICAgICAgICAgICAgICAgICAgICsgXCIuICBFbnN1cmUgeFNwZWVkIHVzZWQgdmFsaWRseSBpZiBzcHJpdGUgaGl0IGRpcmVjdGlvbmFsaXR5IHNlZW1zIHdyb25nLlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHNhbWVZc3BlZWQgPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBzczsgKytpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN5U2FtcGxlc1tpXSAhPT0gc3lTYW1wbGVzW2kgLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICBzYW1lWXNwZWVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzYW1lWXNwZWVkICYmIHN5U2FtcGxlc1swXSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKEdRR19XQVJOSU5HX0lOX01ZUFJPR1JBTV9NU0dcbiAgICAgICAgICAgICAgICAgICAgKyBcInNwcml0ZSBoaXQgZGlyZWN0aW9uIGZ1bmN0aW9uYWxpdHktIHBvc3NpYmx5IHdyb25nIHlQb3MgY2FsY3VsYXRpb24gZm9yIHNwcml0ZTogXCJcbiAgICAgICAgICAgICAgICAgICAgKyBzcHJpdGVJbmZvW1wiaWRcIl1cbiAgICAgICAgICAgICAgICAgICAgKyBcIi4gIEVuc3VyZSB5U3BlZWQgdXNlZCB2YWxpZGx5IGlmIHNwcml0ZSBoaXQgZGlyZWN0aW9uYWxpdHkgc2VlbXMgd3JvbmcuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZUhpdERpciA9IChcbiAgICBzcHJpdGUxSW5mbzogU3ByaXRlRGljdCxcbiAgICBzcHJpdGUySW5mbzogU3ByaXRlRGljdFxuKTogU3ByaXRlSGl0RGlyZWN0aW9uYWxpdHkgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgY2hlY2tTcHJpdGVTcGVlZFVzYWdlQ29tbW9uRXJyb3JzKHNwcml0ZTFJbmZvKTtcbiAgICAgICAgY2hlY2tTcHJpdGVTcGVlZFVzYWdlQ29tbW9uRXJyb3JzKHNwcml0ZTJJbmZvKTtcbiAgICB9XG4gICAgcmV0dXJuIHNwcml0ZUhpdERpckltcGwoc3ByaXRlMUluZm8sIHNwcml0ZTJJbmZvKTtcbn1cbmNvbnN0IHNwcml0ZUhpdERpckltcGwgPSAoXG4gICAgc3ByaXRlMUluZm86IFNwcml0ZVBoeXNpY2FsRGltZW5zaW9ucyxcbiAgICBzcHJpdGUySW5mbzogU3ByaXRlUGh5c2ljYWxEaW1lbnNpb25zXG4pOiBTcHJpdGVIaXREaXJlY3Rpb25hbGl0eSA9PiB7XG4gICAgLypcbiAgICAgICBSZXR1cm5zIHRoZSBkaXJlY3Rpb24gdGhhdCBzcHJpdGUgMSBoaXRzIHNwcml0ZSAyIGZyb20uXG4gICAgICAgc3ByaXRlIDEgaXMgcmVsYXRpdmVseSBsZWZ0L3JpZ2h0L3VwL2Rvd24gb2Ygc3ByaXRlIDJcbiAgICAgICBcbiAgICAgICBIaXQgZGlyZWN0aW9uIHJldHVybmVkIGNvdWxkIGJlIG11bHRpcGxlIHZhbHVlcyAoZS5nLiBsZWZ0IGFuZCB1cCksXG4gICAgICAgYW5kIGlzIHJldHVybmVkIGJ5IHRoaXMgZnVuY3Rpb24gYXMgYSBkaWN0aW9uYXJ5IGFzLCBlLmcuXG4gICAgICAge1xuICAgICAgIFwibGVmdFwiOiBmYWxzZSxcbiAgICAgICBcInJpZ2h0XCI6IGZhbHNlLFxuICAgICAgIFwidXBcIjogZmFsc2UsXG4gICAgICAgXCJkb3duXCI6IGZhbHNlXG4gICAgICAgfVxuICAgICAgIFxuICAgICAgIFBhcmFtZXRlcnMgc3ByaXRlezEsMn1JbmZvIGFyZSBkaWN0aW9uYXJpZXMgd2l0aCBhdCBsZWFzdCB0aGVzZSBrZXlzOlxuICAgICAgIHtcbiAgICAgICBcImlkXCI6IFwiYWN0dWFsU3ByaXRlTmFtZVwiLFxuICAgICAgIFwieFBvc1wiOiA1MDAsXG4gICAgICAgXCJ5UG9zXCI6IDIwMCxcbiAgICAgICBcInhTcGVlZFwiOiAtOCwgIC8vIG1vdmVtZW50IG11c3QgYmUgYnkgZGljdGlvbmFyeSxcbiAgICAgICBcInlTcGVlZFwiOiAwLCAgIC8vIHdpdGggc29tZXRoaW5nIGxpa2UgeCA9IHggKyB4U3BlZWRcbiAgICAgICBcImhlaWdodFwiOiA3NCxcbiAgICAgICBcIndpZHRoXCI6IDc1XG4gICAgICAgfVxuICAgICAgICovXG5cbiAgICB2YXIgcGVyY2VudE1hcmdpbiA9IDEuMTsgLy8gcG9zaXRpdmUgcGVyY2VudCBpbiBkZWNpbWFsXG4gICAgdmFyIGRpcjogU3ByaXRlSGl0RGlyZWN0aW9uYWxpdHkgPSB7XG4gICAgICAgIFwibGVmdFwiOiBmYWxzZSxcbiAgICAgICAgXCJyaWdodFwiOiBmYWxzZSxcbiAgICAgICAgXCJ1cFwiOiBmYWxzZSxcbiAgICAgICAgXCJkb3duXCI6IGZhbHNlXG4gICAgfTtcblxuICAgIC8vIGN1cnJlbnQgaG9yaXpvbnRhbCBwb3NpdGlvblxuICAgIHZhciBzMWxlZnQgPSBzcHJpdGUxSW5mb1tcInhQb3NcIl07XG4gICAgdmFyIHMxcmlnaHQgPSBzMWxlZnQgKyBzcHJpdGUxSW5mb1tcIndpZHRoXCJdO1xuXG4gICAgdmFyIHMybGVmdCA9IHNwcml0ZTJJbmZvW1wieFBvc1wiXTtcbiAgICB2YXIgczJyaWdodCA9IHMybGVmdCArIHNwcml0ZTJJbmZvW1wid2lkdGhcIl07XG5cbiAgICAvLyByZXZlcnNlIGhvcml6b250YWwgcG9zaXRpb24gYnkgeFNwZWVkIHdpdGggcGVyY2VudCBtYXJnaW5cbiAgICB2YXIgc3ByaXRlMVhTcGVlZCA9IHNwcml0ZTFJbmZvW1wieFNwZWVkXCJdICogcGVyY2VudE1hcmdpbjtcbiAgICBzMWxlZnQgPSBzMWxlZnQgLSBzcHJpdGUxWFNwZWVkO1xuICAgIHMxcmlnaHQgPSBzMXJpZ2h0IC0gc3ByaXRlMVhTcGVlZDtcblxuICAgIHZhciBzcHJpdGUyWFNwZWVkID0gc3ByaXRlMkluZm9bXCJ4U3BlZWRcIl0gKiBwZXJjZW50TWFyZ2luO1xuICAgIHMybGVmdCA9IHMybGVmdCAtIHNwcml0ZTJYU3BlZWQ7XG4gICAgczJyaWdodCA9IHMycmlnaHQgLSBzcHJpdGUyWFNwZWVkO1xuXG4gICAgaWYgKHMxcmlnaHQgPD0gczJsZWZ0KSB7XG4gICAgICAgIGRpcltcImxlZnRcIl0gPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoczJyaWdodCA8PSBzMWxlZnQpIHtcbiAgICAgICAgZGlyW1wicmlnaHRcIl0gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIGN1cnJlbnQgdmVydGljYWwgcG9zaXRpb25cbiAgICB2YXIgczF0b3AgPSBzcHJpdGUxSW5mb1tcInlQb3NcIl07XG4gICAgdmFyIHMxYm90dG9tID0gczF0b3AgKyBzcHJpdGUxSW5mb1tcImhlaWdodFwiXTtcblxuICAgIHZhciBzMnRvcCA9IHNwcml0ZTJJbmZvW1wieVBvc1wiXTtcbiAgICB2YXIgczJib3R0b20gPSBzMnRvcCArIHNwcml0ZTJJbmZvW1wiaGVpZ2h0XCJdO1xuXG4gICAgLy8gcmV2ZXJzZSB2ZXJ0aWNhbCBwb3NpdGlvbiBieSB5U3BlZWQgd2l0aCBwZXJjZW50IG1hcmdpblxuICAgIHZhciBzcHJpdGUxWVNwZWVkID0gc3ByaXRlMUluZm9bXCJ5U3BlZWRcIl0gKiBwZXJjZW50TWFyZ2luO1xuICAgIHMxdG9wID0gczF0b3AgLSBzcHJpdGUxWVNwZWVkO1xuICAgIHMxYm90dG9tID0gczFib3R0b20gLSBzcHJpdGUxWVNwZWVkO1xuXG4gICAgdmFyIHNwcml0ZTJZU3BlZWQgPSBzcHJpdGUySW5mb1tcInlTcGVlZFwiXSAqIHBlcmNlbnRNYXJnaW47XG4gICAgczJ0b3AgPSBzMnRvcCAtIHNwcml0ZTJZU3BlZWQ7XG4gICAgczJib3R0b20gPSBzMmJvdHRvbSAtIHNwcml0ZTJZU3BlZWQ7XG5cbiAgICBpZiAoczFib3R0b20gPD0gczJ0b3ApIHtcbiAgICAgICAgZGlyW1widXBcIl0gPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoczJib3R0b20gPD0gczF0b3ApIHtcbiAgICAgICAgZGlyW1wiZG93blwiXSA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpcjtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRLZXlTdGF0ZSA9IChrZXk6IG51bWJlcik6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiAhISQuZ1Eua2V5VHJhY2tlcltrZXldO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldE1vdXNlWCA9ICgpOiBudW1iZXIgPT4ge1xuICAgIHJldHVybiAkLmdRLm1vdXNlVHJhY2tlci54O1xufTtcbmV4cG9ydCBjb25zdCBnZXRNb3VzZVkgPSAoKTogbnVtYmVyID0+IHtcbiAgICByZXR1cm4gJC5nUS5tb3VzZVRyYWNrZXIueTtcbn07XG5leHBvcnQgY29uc3QgZ2V0TW91c2VCdXR0b24xID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiAhISQuZ1EubW91c2VUcmFja2VyWzFdO1xufTtcbmV4cG9ydCBjb25zdCBnZXRNb3VzZUJ1dHRvbjIgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgcmV0dXJuICEhJC5nUS5tb3VzZVRyYWNrZXJbMl07XG59O1xuZXhwb3J0IGNvbnN0IGdldE1vdXNlQnV0dG9uMyA9ICgpOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gISEkLmdRLm1vdXNlVHJhY2tlclszXTtcbn07XG5cbmV4cG9ydCBjb25zdCBkaXNhYmxlQ29udGV4dE1lbnUgPSAoKTogdm9pZCA9PiB7XG4gICAgLy8gc2VlIGFsc286IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ5MjAyMjEvanF1ZXJ5LWpzLXByZXZlbnQtcmlnaHQtY2xpY2stbWVudS1pbi1icm93c2Vyc1xuICAgIC8vICQoXCIjcGxheWdyb3VuZFwiKS5jb250ZXh0bWVudShmdW5jdGlvbigpe3JldHVybiBmYWxzZTt9KTtcbiAgICAkKFwiI3BsYXlncm91bmRcIikub24oXCJjb250ZXh0bWVudVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbn07XG5leHBvcnQgY29uc3QgZW5hYmxlQ29udGV4dE1lbnUgPSAoKTogdm9pZCA9PiB7XG4gICAgLy8gc2VlIGFsc286IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ5MjAyMjEvanF1ZXJ5LWpzLXByZXZlbnQtcmlnaHQtY2xpY2stbWVudS1pbi1icm93c2Vyc1xuICAgICQoXCIjcGxheWdyb3VuZFwiKS5vZmYoXCJjb250ZXh0bWVudVwiKTtcbn07XG5cbmV4cG9ydCBjb25zdCBoaWRlTW91c2VDdXJzb3IgPSAoKTogdm9pZCA9PiB7XG4gICAgJChcIiNwbGF5Z3JvdW5kXCIpLmNzcyhcImN1cnNvclwiLCBcIm5vbmVcIik7XG59O1xuZXhwb3J0IGNvbnN0IHNob3dNb3VzZUN1cnNvciA9ICgpOiB2b2lkID0+IHtcbiAgICAkKFwiI3BsYXlncm91bmRcIikuY3NzKFwiY3Vyc29yXCIsIFwiZGVmYXVsdFwiKTtcbn07XG5cbmV4cG9ydCBjb25zdCBzYXZlRGljdGlvbmFyeUFzID0gKHNhdmVBczogc3RyaW5nLCBkaWN0aW9uYXJ5OiBvYmplY3QpOiB2b2lkID0+IHtcbiAgICAvLyByZXF1aXJlcyBqcy1jb29raWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qcy1jb29raWUvanMtY29va2llL3RyZWUvdjIuMC40XG4gICAgQ29va2llcy5zZXQoXCJHUUdfXCIgKyBzYXZlQXMsIGRpY3Rpb25hcnkpO1xufTtcbmV4cG9ydCBjb25zdCBnZXRTYXZlZERpY3Rpb25hcnkgPSAoc2F2ZWRBczogc3RyaW5nKTogb2JqZWN0ID0+IHtcbiAgICByZXR1cm4gQ29va2llcy5nZXRKU09OKFwiR1FHX1wiICsgc2F2ZWRBcyk7XG59O1xuZXhwb3J0IGNvbnN0IGRlbGV0ZVNhdmVkRGljdGlvbmFyeSA9IChzYXZlZEFzOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBDb29raWVzLnJlbW92ZShcIkdRR19cIiArIHNhdmVkQXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZU92YWxJbkdyb3VwID0gKFxuICAgIGdyb3VwTmFtZTogc3RyaW5nIHwgbnVsbCxcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICAvLyByb3RkZWcgaW4gZGVncmVlcyBjbG9ja3dpc2Ugb24gc2NyZWVuIChyZWNhbGwgeS1heGlzIHBvaW50cyBkb3dud2FyZHMhKVxuXG4gICAgaWYgKCFjb2xvcikge1xuICAgICAgICBjb2xvciA9IFwiZ3JheVwiO1xuICAgIH1cblxuICAgIGlmICghZ3JvdXBOYW1lKSB7XG4gICAgICAgICQucGxheWdyb3VuZCgpLmFkZFNwcml0ZShpZCwgeyB3aWR0aDogMSwgaGVpZ2h0OiAxIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNyZWF0ZVNwcml0ZUluR3JvdXAoZ3JvdXBOYW1lLCBpZCwgeyB3aWR0aDogMSwgaGVpZ2h0OiAxIH0pO1xuICAgIH1cblxuICAgIHZhciBib3JkZXJfcmFkaXVzID0gKHcgLyAyICsgXCJweCAvIFwiICsgaCAvIDIgKyBcInB4XCIpO1xuICAgIHNwcml0ZShpZClcbiAgICAgICAgLmNzcyhcImJhY2tncm91bmRcIiwgY29sb3IpXG4gICAgICAgIC5jc3MoXCJib3JkZXItcmFkaXVzXCIsIGJvcmRlcl9yYWRpdXMpXG4gICAgICAgIC5jc3MoXCItbW96LWJvcmRlci1yYWRpdXNcIiwgYm9yZGVyX3JhZGl1cylcbiAgICAgICAgLmNzcyhcIi13ZWJraXQtYm9yZGVyLXJhZGl1c1wiLCBib3JkZXJfcmFkaXVzKTtcblxuICAgIHNwcml0ZVNldFdpZHRoSGVpZ2h0KGlkLCB3LCBoKTtcbiAgICBzcHJpdGVTZXRYWShpZCwgeCwgeSk7XG5cbiAgICBpZiAocm90ZGVnICE9IG51bGwpIHtcbiAgICAgICAgaWYgKHJvdE9yaWdpblggIT0gbnVsbCAmJiByb3RPcmlnaW5ZICE9IG51bGwpIHtcbiAgICAgICAgICAgIHZhciByb3RPcmlnaW4gPSByb3RPcmlnaW5YICsgXCJweCBcIiArIHJvdE9yaWdpblkgKyBcInB4XCI7XG4gICAgICAgICAgICBzcHJpdGUoaWQpXG4gICAgICAgICAgICAgICAgLmNzcyhcIi13ZWJraXQtdHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pXG4gICAgICAgICAgICAgICAgLmNzcyhcIi1tb3otdHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pXG4gICAgICAgICAgICAgICAgLmNzcyhcIi1tcy10cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbilcbiAgICAgICAgICAgICAgICAuY3NzKFwiLW8tdHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pXG4gICAgICAgICAgICAgICAgLmNzcyhcInRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKTtcbiAgICAgICAgfVxuICAgICAgICBzcHJpdGVSb3RhdGUoaWQsIHJvdGRlZyk7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVPdmFsID0gKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICB3OiBudW1iZXIsXG4gICAgaDogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHJvdGRlZz86IG51bWJlcixcbiAgICByb3RPcmlnaW5YPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblk/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZU92YWxJbkdyb3VwKFxuICAgICAgICBudWxsLFxuICAgICAgICBpZCxcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgdyxcbiAgICAgICAgaCxcbiAgICAgICAgY29sb3IsXG4gICAgICAgIHJvdGRlZyxcbiAgICAgICAgcm90T3JpZ2luWCxcbiAgICAgICAgcm90T3JpZ2luWVxuICAgICk7XG59O1xuZXhwb3J0IGNvbnN0IGRyYXdPdmFsID0gKFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVPdmFsKFxuICAgICAgICBcIkdRR19vdmFsX1wiICsgR1FHX2dldFVuaXF1ZUlkKCksXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHcsXG4gICAgICAgIGgsXG4gICAgICAgIGNvbG9yLFxuICAgICAgICByb3RkZWcsXG4gICAgICAgIHJvdE9yaWdpblgsXG4gICAgICAgIHJvdE9yaWdpbllcbiAgICApO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVDaXJjbGVJbkdyb3VwID0gKFxuICAgIGdyb3VwTmFtZTogc3RyaW5nIHwgbnVsbCxcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgcjogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHJvdGRlZz86IG51bWJlcixcbiAgICByb3RPcmlnaW5YPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblk/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZU92YWxJbkdyb3VwKFxuICAgICAgICBncm91cE5hbWUsXG4gICAgICAgIGlkLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICByLFxuICAgICAgICByLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlQ2lyY2xlID0gKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICByOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgY3JlYXRlQ2lyY2xlSW5Hcm91cChcbiAgICAgICAgbnVsbCxcbiAgICAgICAgaWQsXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHIsXG4gICAgICAgIGNvbG9yLFxuICAgICAgICByb3RkZWcsXG4gICAgICAgIHJvdE9yaWdpblgsXG4gICAgICAgIHJvdE9yaWdpbllcbiAgICApO1xufTtcbmV4cG9ydCBjb25zdCBkcmF3Q2lyY2xlID0gKFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgcjogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHJvdGRlZz86IG51bWJlcixcbiAgICByb3RPcmlnaW5YPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblk/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZUNpcmNsZShcbiAgICAgICAgXCJHUUdfY2lyY2xlX1wiICsgR1FHX2dldFVuaXF1ZUlkKCksXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHIsXG4gICAgICAgIGNvbG9yLFxuICAgICAgICByb3RkZWcsXG4gICAgICAgIHJvdE9yaWdpblgsXG4gICAgICAgIHJvdE9yaWdpbllcbiAgICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVJlY3RJbkdyb3VwID0gKFxuICAgIGdyb3VwTmFtZTogc3RyaW5nIHwgbnVsbCxcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICAvLyByb3RkZWcgaW4gZGVncmVlcyBjbG9ja3dpc2Ugb24gc2NyZWVuIChyZWNhbGwgeS1heGlzIHBvaW50cyBkb3dud2FyZHMhKVxuICAgIC8vIHJvdE9yaWdpbntYLFl9IG11c3QgYmUgd2l0aGluIHJhbmdlIG9mIHdpZGUgdyBhbmQgaGVpZ2h0IGgsIGFuZCByZWxhdGl2ZSB0byBjb29yZGluYXRlICh4LHkpLlxuXG4gICAgaWYgKCFjb2xvcikge1xuICAgICAgICBjb2xvciA9IFwiZ3JheVwiO1xuICAgIH1cblxuICAgIGlmICghZ3JvdXBOYW1lKSB7XG4gICAgICAgICQucGxheWdyb3VuZCgpLmFkZFNwcml0ZShpZCwgeyB3aWR0aDogMSwgaGVpZ2h0OiAxIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNyZWF0ZVNwcml0ZUluR3JvdXAoZ3JvdXBOYW1lLCBpZCwgeyB3aWR0aDogMSwgaGVpZ2h0OiAxIH0pO1xuICAgIH1cblxuICAgIHNwcml0ZShpZCkuY3NzKFwiYmFja2dyb3VuZFwiLCBjb2xvcik7XG5cbiAgICBzcHJpdGVTZXRXaWR0aEhlaWdodChpZCwgdywgaCk7XG4gICAgc3ByaXRlU2V0WFkoaWQsIHgsIHkpO1xuXG4gICAgaWYgKHJvdGRlZyAhPSBudWxsKSB7XG4gICAgICAgIGlmIChyb3RPcmlnaW5YICE9IG51bGwgJiYgcm90T3JpZ2luWSAhPSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgcm90T3JpZ2luID0gcm90T3JpZ2luWCArIFwicHggXCIgKyByb3RPcmlnaW5ZICsgXCJweFwiO1xuICAgICAgICAgICAgc3ByaXRlKGlkKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItd2Via2l0LXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItbW96LXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItbXMtdHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pXG4gICAgICAgICAgICAgICAgLmNzcyhcIi1vLXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCJ0cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbik7XG4gICAgICAgIH1cbiAgICAgICAgc3ByaXRlUm90YXRlKGlkLCByb3RkZWcpO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgY3JlYXRlUmVjdCA9IChcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVSZWN0SW5Hcm91cChcbiAgICAgICAgbnVsbCxcbiAgICAgICAgaWQsXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHcsXG4gICAgICAgIGgsXG4gICAgICAgIGNvbG9yLFxuICAgICAgICByb3RkZWcsXG4gICAgICAgIHJvdE9yaWdpblgsXG4gICAgICAgIHJvdE9yaWdpbllcbiAgICApO1xufTtcbmV4cG9ydCBjb25zdCBkcmF3UmVjdCA9IChcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHc6IG51bWJlcixcbiAgICBoOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgY3JlYXRlUmVjdChcbiAgICAgICAgXCJHUUdfcmVjdF9cIiArIEdRR19nZXRVbmlxdWVJZCgpLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICB3LFxuICAgICAgICBoLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVMaW5lSW5Hcm91cCA9IChcbiAgICBncm91cE5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgaWQ6IHN0cmluZyxcbiAgICB4MTogbnVtYmVyLFxuICAgIHkxOiBudW1iZXIsXG4gICAgeDI6IG51bWJlcixcbiAgICB5MjogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHRoaWNrbmVzcz86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgaWYgKCFjb2xvcikge1xuICAgICAgICBjb2xvciA9IFwiZ3JheVwiO1xuICAgIH1cbiAgICBpZiAoIXRoaWNrbmVzcykge1xuICAgICAgICB0aGlja25lc3MgPSAyO1xuICAgIH1cbiAgICB2YXIgeGQgPSB4MiAtIHgxO1xuICAgIHZhciB5ZCA9IHkyIC0geTE7XG4gICAgdmFyIGRpc3QgPSBNYXRoLnNxcnQoeGQgKiB4ZCArIHlkICogeWQpO1xuXG4gICAgdmFyIGFyY0NvcyA9IE1hdGguYWNvcyh4ZCAvIGRpc3QpO1xuICAgIGlmICh5MiA8IHkxKSB7XG4gICAgICAgIGFyY0NvcyAqPSAtMTtcbiAgICB9XG4gICAgdmFyIHJvdGRlZyA9IGFyY0NvcyAqIDE4MCAvIE1hdGguUEk7XG5cbiAgICB2YXIgaGFsZlRoaWNrID0gdGhpY2tuZXNzIC8gMjtcbiAgICB2YXIgZHJhd1kxID0geTEgLSBoYWxmVGhpY2s7XG5cbiAgICBjcmVhdGVSZWN0SW5Hcm91cChcbiAgICAgICAgZ3JvdXBOYW1lLFxuICAgICAgICBpZCxcbiAgICAgICAgeDEsXG4gICAgICAgIGRyYXdZMSxcbiAgICAgICAgZGlzdCxcbiAgICAgICAgdGhpY2tuZXNzLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICAwLFxuICAgICAgICBoYWxmVGhpY2tcbiAgICApO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVMaW5lID0gKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgeDE6IG51bWJlcixcbiAgICB5MTogbnVtYmVyLFxuICAgIHgyOiBudW1iZXIsXG4gICAgeTI6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICB0aGlja25lc3M/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZUxpbmVJbkdyb3VwKG51bGwsIGlkLCB4MSwgeTEsIHgyLCB5MiwgY29sb3IsIHRoaWNrbmVzcyk7XG59O1xuZXhwb3J0IGNvbnN0IGRyYXdMaW5lID0gKFxuICAgIHgxOiBudW1iZXIsXG4gICAgeTE6IG51bWJlcixcbiAgICB4MjogbnVtYmVyLFxuICAgIHkyOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgdGhpY2tuZXNzPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVMaW5lKFwiR1FHX2xpbmVfXCIgKyBHUUdfZ2V0VW5pcXVlSWQoKSwgeDEsIHkxLCB4MiwgeTIsIGNvbG9yLCB0aGlja25lc3MpO1xufTtcblxuZXhwb3J0IHR5cGUgQ29udGFpbmVySXRlcmF0b3IgPSB7XG4gICAgbmV4dDogKCkgPT4gW251bWJlciwgbnVtYmVyXTtcbiAgICBoYXNOZXh0OiAoKSA9PiBib29sZWFuO1xuICAgIGN1cnJlbnQ6IG51bWJlcjtcbiAgICBlbmQ6IG51bWJlcjtcbiAgICBfa2V5czogc3RyaW5nW107XG59O1xuZXhwb3J0IHR5cGUgTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4gPSAobjogbnVtYmVyKSA9PiBudW1iZXIgfCBSZWNvcmQ8XG4gICAgbnVtYmVyLFxuICAgIG51bWJlclxuPjtcbmV4cG9ydCB0eXBlIENyZWF0ZUNvbnRhaW5lckl0ZXJhdG9yRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXJcbiAgICApOiBDb250YWluZXJJdGVyYXRvcjtcbiAgICAodGhpczogdm9pZCwgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4pOiBDb250YWluZXJJdGVyYXRvcjtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlQ29udGFpbmVySXRlcmF0b3I6IENyZWF0ZUNvbnRhaW5lckl0ZXJhdG9yRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICBzdGFydD86IG51bWJlcixcbiAgICBlbmQ/OiBudW1iZXIsXG4gICAgc3RlcHNpemU/OiBudW1iZXJcbik6IENvbnRhaW5lckl0ZXJhdG9yIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgZiA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBjb25zdCBmT3duUHJvcE5hbWVzOiBzdHJpbmdbXSA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGYpO1xuICAgICAgICBjb25zdCBpdDogQ29udGFpbmVySXRlcmF0b3IgPSB7XG4gICAgICAgICAgICBjdXJyZW50OiAwLFxuICAgICAgICAgICAgZW5kOiBmT3duUHJvcE5hbWVzLmxlbmd0aCxcbiAgICAgICAgICAgIF9rZXlzOiBmT3duUHJvcE5hbWVzLFxuICAgICAgICAgICAgbmV4dDogZnVuY3Rpb24gKHRoaXM6IENvbnRhaW5lckl0ZXJhdG9yKTogW251bWJlciwgbnVtYmVyXSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbUlkeCA9IHRoaXMuX2tleXNbdGhpcy5jdXJyZW50XTtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtOiBbbnVtYmVyLCBudW1iZXJdID0gW051bWJlcihpdGVtSWR4KSwgZltpdGVtSWR4XV07XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Kys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGFzTmV4dDogZnVuY3Rpb24gKHRoaXM6IENvbnRhaW5lckl0ZXJhdG9yKTogYm9vbGVhbiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLmN1cnJlbnQgPCB0aGlzLmVuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBpdDtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwic3RhcnQgbXVzdCBiZSBhIG51bWJlci5cIiwgc3RhcnQpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiZW5kIG11c3QgYmUgYSBudW1iZXIuXCIsIGVuZCk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJzdGVwc2l6ZSBtdXN0IGJlIGEgbnVtYmVyLlwiLCBzdGVwc2l6ZSk7XG4gICAgICAgIGlmIChzdGFydCA9PSBudWxsIHx8IGVuZCA9PSBudWxsIHx8IHN0ZXBzaXplID09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IFwiVFMgdHlwZSBoaW50XCI7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmeDogKG46IG51bWJlcikgPT4gbnVtYmVyID0gKHR5cGVvZiBmID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICAgID8gKGYgYXMgKHg6IG51bWJlcikgPT4gbnVtYmVyKVxuICAgICAgICAgICAgOiAoeDogbnVtYmVyKTogbnVtYmVyID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTnVtYmVyKGZbeF0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGl0OiBDb250YWluZXJJdGVyYXRvciA9IHtcbiAgICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uICh0aGlzOiBDb250YWluZXJJdGVyYXRvcik6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW06IFtudW1iZXIsIG51bWJlcl0gPSBbdGhpcy5jdXJyZW50LCBmeCh0aGlzLmN1cnJlbnQpXTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQgKz0gc3RlcHNpemU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGFzTmV4dDogZnVuY3Rpb24gKHRoaXM6IENvbnRhaW5lckl0ZXJhdG9yKTogYm9vbGVhbiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLmN1cnJlbnQgPCB0aGlzLmVuZCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3VycmVudDogc3RhcnQsXG4gICAgICAgICAgICBlbmQ6IGVuZCxcbiAgICAgICAgICAgIF9rZXlzOiB0eXBlb2YgZiAhPT0gXCJmdW5jdGlvblwiID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZikgOiAoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBrOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IHN0ZXBzaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIGsucHVzaChTdHJpbmcoaSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaztcbiAgICAgICAgICAgIH0pKClcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGl0O1xuICAgIH1cbn07XG5leHBvcnQgdHlwZSBHcmFwaENyZWF0aW9uT3B0aW9ucyA9IHtcbiAgICBpbnRlcnBvbGF0ZWQ6IGJvb2xlYW47XG59O1xuZXhwb3J0IHR5cGUgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnMsXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICByYWRpdXNfdGhpY2tuZXNzOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgbW9yZU9wdHM6IEdyYXBoQ3JlYXRpb25PcHRpb25zLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnMsXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIG1vcmVPcHRzOiBHcmFwaENyZWF0aW9uT3B0aW9ucyxcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgcmFkaXVzX3RoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIG1vcmVPcHRzOiBHcmFwaENyZWF0aW9uT3B0aW9ucyxcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnNcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbn07XG5leHBvcnQgdHlwZSBHcm91cE5hbWVBbmRJZFByZWZpeCA9IHtcbiAgICBcImlkXCI6IHN0cmluZztcbiAgICBcImdyb3VwXCI6IHN0cmluZztcbn07XG50eXBlIENyZWF0ZUdyYXBoV2l0aE9wdGlvbnNGblBhcmFtVHlwZXMgPSBbXG4gICAgc3RyaW5nLFxuICAgIHN0cmluZyxcbiAgICBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICBHcmFwaENyZWF0aW9uT3B0aW9uc1xuXTtcbmV4cG9ydCBjb25zdCBjcmVhdGVHcmFwaFdpdGhPcHRpb25zOiBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICBpZDogc3RyaW5nLFxuICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgIG1vcmVPcHRzOiBHcmFwaENyZWF0aW9uT3B0aW9uc1xuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXgge1xuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIG1vcmVPcHRzLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIHJhZGl1c190aGlja25lc3MpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgbW9yZU9wdHMsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBtb3JlT3B0cywgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgbW9yZU9wdHMsIGNvbG9yLCByYWRpdXNfdGhpY2tuZXNzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIG1vcmVPcHRzLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBtb3JlT3B0cylcbiAgICAvLyBtb3JlT3B0cyA9IHtcImludGVycG9sYXRlZFwiOiB0cnVlT3JGYWxzZX1cbiAgICB2YXIgaW50ZXJwb2xhdGVkID0gbW9yZU9wdHNbXCJpbnRlcnBvbGF0ZWRcIl07XG5cbiAgICBpZiAoIWlkKSB7XG4gICAgICAgIGlkID0gXCJHUUdfZ3JhcGhfXCIgKyBHUUdfZ2V0VW5pcXVlSWQoKTtcbiAgICB9XG4gICAgaWYgKCFncm91cE5hbWUpIHtcbiAgICAgICAgZ3JvdXBOYW1lID0gaWQgKyBcIl9ncm91cFwiO1xuICAgICAgICBjcmVhdGVHcm91cEluUGxheWdyb3VuZChncm91cE5hbWUpO1xuICAgIH1cbiAgICB2YXIgZ3JvdXBfaWQgPSB7XG4gICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgIFwiZ3JvdXBcIjogZ3JvdXBOYW1lXG4gICAgfTtcblxuICAgIHZhciBjb2xvcjtcbiAgICB2YXIgcmFkaXVzX3RoaWNrbmVzcztcbiAgICBsZXQgaXRlcjogQ29udGFpbmVySXRlcmF0b3I7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCAmJiBhcmd1bWVudHMubGVuZ3RoIDw9IDYgJiZcbiAgICAgICAgXCJvYmplY3RcIiA9PT0gdHlwZW9mIChmKSkge1xuICAgICAgICBjb2xvciA9IGFyZ3VtZW50c1s0XTtcbiAgICAgICAgcmFkaXVzX3RoaWNrbmVzcyA9IGFyZ3VtZW50c1s1XTtcbiAgICAgICAgaXRlciA9IGNyZWF0ZUNvbnRhaW5lckl0ZXJhdG9yKGYpO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA3ICYmIGFyZ3VtZW50cy5sZW5ndGggPD0gOSkge1xuICAgICAgICB2YXIgc3RhcnQgPSBhcmd1bWVudHNbNF07XG4gICAgICAgIHZhciBlbmQgPSBhcmd1bWVudHNbNV07XG4gICAgICAgIHZhciBzdGVwc2l6ZSA9IGFyZ3VtZW50c1s2XTtcbiAgICAgICAgY29sb3IgPSBhcmd1bWVudHNbN107XG4gICAgICAgIHJhZGl1c190aGlja25lc3MgPSBhcmd1bWVudHNbOF07XG4gICAgICAgIGl0ZXIgPSBjcmVhdGVDb250YWluZXJJdGVyYXRvcihmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIkZ1bmN0aW9uIHVzZWQgd2l0aCB3cm9uZyBudW1iZXIgb2YgYXJndW1lbnRzXCIpO1xuICAgICAgICB0aHJvdyBcIlRTIHR5cGUgaGludFwiO1xuICAgIH1cblxuICAgIGlmIChjb2xvciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29sb3IgPSBcImdyYXlcIjtcbiAgICB9XG4gICAgaWYgKHJhZGl1c190aGlja25lc3MgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJhZGl1c190aGlja25lc3MgPSAyO1xuICAgIH1cblxuICAgIHZhciBjdXJyWCA9IG51bGw7XG4gICAgdmFyIGN1cnJZID0gbnVsbDtcbiAgICB3aGlsZSAoaXRlci5oYXNOZXh0KCkpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBpdGVyLm5leHQoKTtcbiAgICAgICAgdmFyIGkgPSBpdGVtWzBdO1xuICAgICAgICB2YXIgZnhpID0gaXRlbVsxXTtcblxuICAgICAgICBpZiAoZnhpID09PSBJbmZpbml0eSkge1xuICAgICAgICAgICAgZnhpID0gR1FHX01BWF9TQUZFX1BMQVlHUk9VTkRfSU5URUdFUjtcbiAgICAgICAgfSBlbHNlIGlmIChmeGkgPT09IC1JbmZpbml0eSkge1xuICAgICAgICAgICAgZnhpID0gR1FHX01JTl9TQUZFX1BMQVlHUk9VTkRfSU5URUdFUjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdXJyWSA9PT0gbnVsbCAmJiBmeGkgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjdXJyWCA9IGk7XG4gICAgICAgICAgICBjdXJyWSA9IGZ4aTtcbiAgICAgICAgICAgIGlmICghaW50ZXJwb2xhdGVkKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlQ2lyY2xlSW5Hcm91cChcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBfaWRbXCJncm91cFwiXSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBfaWRbXCJpZFwiXSArIFwiX2dyYXBoX3B0X1wiICsgaSxcbiAgICAgICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICAgICAgZnhpLFxuICAgICAgICAgICAgICAgICAgICByYWRpdXNfdGhpY2tuZXNzLFxuICAgICAgICAgICAgICAgICAgICBjb2xvclxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZnhpICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKCFpbnRlcnBvbGF0ZWQpIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVDaXJjbGVJbkdyb3VwKFxuICAgICAgICAgICAgICAgICAgICBncm91cF9pZFtcImdyb3VwXCJdLFxuICAgICAgICAgICAgICAgICAgICBncm91cF9pZFtcImlkXCJdICsgXCJfZ3JhcGhfcHRfXCIgKyBpLFxuICAgICAgICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICAgICAgICBmeGksXG4gICAgICAgICAgICAgICAgICAgIHJhZGl1c190aGlja25lc3MsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlTGluZUluR3JvdXAoXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwX2lkW1wiZ3JvdXBcIl0sXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwX2lkW1wiaWRcIl0gKyBcIl9ncmFwaF9saW5lX1wiICsgY3VyclggKyBcIi1cIiArIGksXG4gICAgICAgICAgICAgICAgICAgIGN1cnJYIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgY3VyclkgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICAgICAgICBmeGksXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yLFxuICAgICAgICAgICAgICAgICAgICByYWRpdXNfdGhpY2tuZXNzXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1cnJYID0gaTtcbiAgICAgICAgICAgIGN1cnJZID0gZnhpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGdyb3VwX2lkO1xufTtcblxudHlwZSBDcmVhdGVHcmFwaEluR3JvdXBGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm5cbiAgICApOiB2b2lkO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVHcmFwaEluR3JvdXA6IENyZWF0ZUdyYXBoSW5Hcm91cEZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgaWQ6IHN0cmluZyxcbiAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGblxuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXgge1xuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvciwgZG90UmFkaXVzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSlcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBjb2xvciwgZG90UmFkaXVzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYpXG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIGFyZ3Muc3BsaWNlKDMsIDAsIHsgXCJpbnRlcnBvbGF0ZWRcIjogZmFsc2UgfSk7XG4gICAgcmV0dXJuIGNyZWF0ZUdyYXBoV2l0aE9wdGlvbnMuYXBwbHkoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIGFyZ3MgYXMgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuUGFyYW1UeXBlc1xuICAgICk7XG59O1xuXG50eXBlIENyZWF0ZUdyYXBoRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgICh0aGlzOiB2b2lkLCBpZDogc3RyaW5nLCBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbik6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVHcmFwaDogQ3JlYXRlR3JhcGhGbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkXG4pOiBHcm91cE5hbWVBbmRJZFByZWZpeCB7XG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvciwgZG90UmFkaXVzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBjb2xvciwgZG90UmFkaXVzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZilcbiAgICB2YXIgb3B0cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgb3B0cy5zcGxpY2UoMCwgMCwgbnVsbCk7XG4gICAgb3B0cy5zcGxpY2UoMywgMCwgeyBcImludGVycG9sYXRlZFwiOiBmYWxzZSB9KTtcbiAgICByZXR1cm4gY3JlYXRlR3JhcGhXaXRoT3B0aW9ucy5hcHBseShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgb3B0cyBhcyBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzXG4gICAgKTtcbn07XG5cbnR5cGUgRHJhd0dyYXBoRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgICh0aGlzOiB2b2lkLCBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbik6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xufTtcbmV4cG9ydCBjb25zdCBkcmF3R3JhcGg6IERyYXdHcmFwaEZuID0gZnVuY3Rpb24gZHJhd0dyYXBoKFxuICAgIHRoaXM6IHZvaWRcbik6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmKVxuICAgIHZhciBvcHRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBvcHRzLnNwbGljZSgwLCAwLCBudWxsKTtcbiAgICBvcHRzLnNwbGljZSgwLCAwLCBudWxsKTtcbiAgICBvcHRzLnNwbGljZSgzLCAwLCB7IFwiaW50ZXJwb2xhdGVkXCI6IGZhbHNlIH0pO1xuICAgIHJldHVybiBjcmVhdGVHcmFwaFdpdGhPcHRpb25zLmFwcGx5KFxuICAgICAgICB0aGlzLFxuICAgICAgICBvcHRzIGFzIENyZWF0ZUdyYXBoV2l0aE9wdGlvbnNGblBhcmFtVHlwZXNcbiAgICApO1xufTtcblxudHlwZSBDcmVhdGVJbnRlcnBvbGF0ZWRHcmFwaEluR3JvdXBGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIHRoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIHRoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGblxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVJbnRlcnBvbGF0ZWRHcmFwaEluR3JvdXA6IENyZWF0ZUludGVycG9sYXRlZEdyYXBoSW5Hcm91cEZuID1cbiAgICBmdW5jdGlvbiAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGblxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAgICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yLCB0aGlja25lc3MpXG4gICAgICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvcilcbiAgICAgICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIGNvbG9yLCB0aGlja25lc3MpXG4gICAgICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIGNvbG9yKVxuICAgICAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmKVxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIGFyZ3Muc3BsaWNlKDMsIDAsIHsgXCJpbnRlcnBvbGF0ZWRcIjogdHJ1ZSB9KTtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUdyYXBoV2l0aE9wdGlvbnMuYXBwbHkoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgYXJncyBhcyBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzXG4gICAgICAgICk7XG4gICAgfTtcblxudHlwZSBDcmVhdGVJbnRlcnBvbGF0ZWRHcmFwaEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICB0aGlja25lc3M6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICB0aGlja25lc3M6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAodGhpczogdm9pZCwgaWQ6IHN0cmluZywgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4pOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlSW50ZXJwb2xhdGVkR3JhcGg6IENyZWF0ZUludGVycG9sYXRlZEdyYXBoRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZFxuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXgge1xuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIHRoaWNrbmVzcylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSlcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgY29sb3IsIHRoaWNrbmVzcylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYpXG4gICAgdmFyIG9wdHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIG9wdHMuc3BsaWNlKDAsIDAsIG51bGwpO1xuICAgIG9wdHMuc3BsaWNlKDMsIDAsIHsgXCJpbnRlcnBvbGF0ZWRcIjogdHJ1ZSB9KTtcbiAgICByZXR1cm4gY3JlYXRlR3JhcGhXaXRoT3B0aW9ucy5hcHBseShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgb3B0cyBhcyBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzXG4gICAgKTtcbiAgICAvLyByZXR1cm4gY3JlYXRlSW50ZXJwb2xhdGVkR3JhcGhJbkdyb3VwLmFwcGx5KHRoaXMsIG9wdHMpO1xufTtcblxudHlwZSBEcmF3SW50ZXJwb2xhdGVkR3JhcGhGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgdGhpY2tuZXNzOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgdGhpY2tuZXNzOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKHRoaXM6IHZvaWQsIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG59O1xuZXhwb3J0IGNvbnN0IGRyYXdJbnRlcnBvbGF0ZWRHcmFwaDogRHJhd0ludGVycG9sYXRlZEdyYXBoRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZFxuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXgge1xuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvciwgdGhpY2tuZXNzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSlcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBjb2xvciwgdGhpY2tuZXNzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYpXG4gICAgdmFyIG9wdHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIG9wdHMuc3BsaWNlKDAsIDAsIG51bGwpO1xuICAgIG9wdHMuc3BsaWNlKDAsIDAsIG51bGwpO1xuICAgIG9wdHMuc3BsaWNlKDMsIDAsIHsgXCJpbnRlcnBvbGF0ZWRcIjogdHJ1ZSB9KTtcbiAgICByZXR1cm4gY3JlYXRlR3JhcGhXaXRoT3B0aW9ucy5hcHBseShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgb3B0cyBhcyBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzXG4gICAgKTtcbn07XG4iXX0=