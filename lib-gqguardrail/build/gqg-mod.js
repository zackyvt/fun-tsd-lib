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
       const Xperimental = {
    makeSoundResource: function (soundName, url, audioType) {
        if (GQG_DEBUG) {
            if (typeof (soundName) !== "string") {
                throwConsoleErrorInMyprogram("First argument for makeSoundResource must be a String. Instead found: " + soundName);
            }
            if (!spriteGroupNameFormatIsValid(soundName)) {
                throwConsoleErrorInMyprogram("Sound name given to makeSoundResource is in wrong format: " + soundName);
            }
            if (spriteExists(soundName)) {
                throwConsoleErrorInMyprogram("makeSoundResource cannot create sound with a duplicate name of: " + soundName);
            }
            if (typeof (url) !== "string") {
                throwConsoleErrorInMyprogram("Second argument for makeSoundResource must be a String. Instead found: " + url);
            }
        }
        const throwableErr = new Error("image file not found: " + url);
        const audio = $("<audio/>").attr("id", soundName);
        const source = $("<source/>").attr("type", "audio/" + audioType).attr("src", url).on("error", function () {
            if (!!throwableErr && throwableErr.stack &&
                throwableErr.stack.toString().indexOf("myprogram.js") >= 0) {
                throwableErr.message = GQG_ERROR_IN_MYPROGRAM_MSG + throwableErr.message;
            }
            throw throwableErr;
        });
        audio.append(source);
        $("body").append(audio);
    },
    playSound: function (soundName) {
        if (GQG_DEBUG) {
            throwIfSpriteNameInvalid(soundName);
        }
        $("#" + soundName).get(0).play();
    },
    pauseSound: function (soundName) {
        if (GQG_DEBUG) {
            throwIfSpriteNameInvalid(soundName);
        }
        $("#" + soundName).get(0).pause();
    },
    resetSound: function (soundName) {
        if (GQG_DEBUG) {
            throwIfSpriteNameInvalid(soundName);
        }
        $("#" + soundName).get(0).currentTime = 0;
    },
    resetSoundTo: function (soundName, time) {
        if (GQG_DEBUG) {
            throwIfSpriteNameInvalid(soundName);
        }
        $("#" + soundName).get(0).currentTime = time;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3FnLW1vZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9jaGVuZy9EZXNrdG9wL1RTLWRldi9mdW4tdHNkLWxpYi5naXRyZXBvL2xpYi1ncWd1YXJkcmFpbC9zcmMvZ3FnLW1vZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUE4QmIsa0RBQWtEO0FBQ2xELElBQUksU0FBUyxHQUFZLElBQUksQ0FBQztBQUM5QixNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsQ0FBQyxLQUFjLEVBQVEsRUFBRTtJQUNuRCxJQUFJLEtBQUssRUFBRTtRQUNQLFNBQVMsR0FBRyxJQUFJLENBQUM7S0FDcEI7U0FBTTtRQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEdBQUcsa0VBQWtFLENBQUMsQ0FBQztRQUMvRyxTQUFTLEdBQUcsS0FBSyxDQUFDO0tBQ3JCO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsTUFBTSxrQ0FBa0MsR0FBRyw2QkFBNkIsQ0FBQztBQUN6RSxNQUFNLENBQUMsTUFBTSw0QkFBNEIsR0FBRyxDQUN4QyxpQkFBa0MsRUFDM0IsRUFBRTtJQUNULElBQUksT0FBTyxpQkFBaUIsS0FBSyxRQUFRO1FBQ3JDLE9BQU8saUJBQWlCLEtBQUssUUFBUSxFQUFFO1FBQ3ZDLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBQ0QsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDakQsSUFBSSxXQUFXLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7SUFDOUUsV0FBVyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDMUIsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFFRCxPQUFPLENBQUMsaUJBQWlCLEtBQUssV0FB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LFNBQVMsRUFBRTtZQUNYLHdCQUF3QixDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3ZDO1FBQ0QsQ0FBQyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUNELFVBQVUsRUFBRSxVQUFVLFNBQWlCO1FBQ25DLElBQUksU0FBUyxFQUFFO1lBQ1gsd0JBQXdCLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDdkM7UUFDRCxDQUFDLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDRCxZQUFZLEVBQUUsVUFBVSxTQUFpQixFQUFFLElBQVk7UUFDbkQsSUFBSSxTQUFTLEVBQUU7WUFDWCx3QkFBd0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN2QztRQUNELENBQUMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDakQsQ0FBQztDQUNKLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbi8qXG4gKiBDb3B5cmlnaHQgMjAxMiwgMjAxNiwgMjAxNywgMjAxOSwgMjAyMCBDYXJzb24gQ2hlbmdcbiAqIFRoaXMgU291cmNlIENvZGUgRm9ybSBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBvZiB0aGUgTW96aWxsYSBQdWJsaWNcbiAqIExpY2Vuc2UsIHYuIDIuMC4gSWYgYSBjb3B5IG9mIHRoZSBNUEwgd2FzIG5vdCBkaXN0cmlidXRlZCB3aXRoIHRoaXNcbiAqIGZpbGUsIFlvdSBjYW4gb2J0YWluIG9uZSBhdCBodHRwczovL21vemlsbGEub3JnL01QTC8yLjAvLlxuICovXG4vKlxuICogR1FHdWFyZHJhaWwgdjAuOC4wIGlzIGEgd3JhcHBlciBhcm91bmQgZ2FtZVF1ZXJ5IHJldi4gMC43LjEuXG4gKiBNYWtlcyB0aGluZ3MgbW9yZSBwcm9jZWR1cmFsLCB3aXRoIGEgYml0IG9mIGZ1bmN0aW9uYWwuXG4gKiBBZGRzIGluIGhlbHBmdWwgZXJyb3IgbWVzc2FnZXMgZm9yIHN0dWRlbnRzLlxuICogbG9hZCB0aGlzIGFmdGVyIGdhbWVRdWVyeS5cbiAqL1xuXG5leHBvcnQgdHlwZSBzcHJpdGVEb21PYmplY3QgPSB7XG4gICAgd2lkdGg6IChuOiBudW1iZXIpID0+IHNwcml0ZURvbU9iamVjdDtcbiAgICBoZWlnaHQ6IChuOiBudW1iZXIpID0+IHNwcml0ZURvbU9iamVjdDtcbiAgICBzZXRBbmltYXRpb246IChvPzogb2JqZWN0LCBmPzogRnVuY3Rpb24pID0+IGFueTtcbiAgICBjc3M6IChhdHRyOiBzdHJpbmcsIHZhbDogc3RyaW5nIHwgbnVtYmVyKSA9PiBzcHJpdGVEb21PYmplY3Q7XG4gICAgcGxheWdyb3VuZDogKG86IG9iamVjdCkgPT4gYW55O1xuICAgIGh0bWw6IChodG1sVGV4dDogc3RyaW5nKSA9PiBzcHJpdGVEb21PYmplY3Q7XG4gICAgdGV4dDogKHRleHQ6IHN0cmluZykgPT4gc3ByaXRlRG9tT2JqZWN0O1xufTtcbmRlY2xhcmUgdmFyICQ6IGFueTtcbmRlY2xhcmUgdmFyIENvb2tpZXM6IHtcbiAgICBzZXQ6IChhcmcwOiBzdHJpbmcsIGFyZzE6IG9iamVjdCkgPT4gdm9pZDtcbiAgICBnZXRKU09OOiAoYXJnMDogc3RyaW5nKSA9PiBvYmplY3Q7XG4gICAgcmVtb3ZlOiAoYXJnMDogc3RyaW5nKSA9PiB2b2lkO1xufTtcblxuLy8gc3R1ZGVudHMgYXJlIG5vdCBzdXBwb3NlZCB0byB1c2UgR1FHXyB2YXJpYWJsZXNcbmxldCBHUUdfREVCVUc6IGJvb2xlYW4gPSB0cnVlO1xuZXhwb3J0IGNvbnN0IHNldEdxRGVidWdGbGFnID0gKGRlYnVnOiBib29sZWFuKTogdm9pZCA9PiB7XG4gICAgaWYgKGRlYnVnKSB7XG4gICAgICAgIEdRR19ERUJVRyA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coR1FHX1dBUk5JTkdfSU5fTVlQUk9HUkFNX01TRyArIFwiZGVidWcgbW9kZSBkaXNhYmxlZCBhbmQgeW91ciBjb2RlIGlzIG5vdyBydW5uaW5nIGluIHVuc2FmZSBtb2RlLlwiKTtcbiAgICAgICAgR1FHX0RFQlVHID0gZmFsc2U7XG4gICAgfVxufTtcblxuY29uc3QgR1FHX1NQUklURV9HUk9VUF9OQU1FX0ZPUk1BVF9SRUdFWCA9IC9bYS16QS1aMC05X10rW2EtekEtWjAtOV8tXSovO1xuZXhwb3J0IGNvbnN0IHNwcml0ZUdyb3VwTmFtZUZvcm1hdElzVmFsaWQgPSAoXG4gICAgc3ByaXRlT3JHcm91cE5hbWU6IHN0cmluZyB8IG51bWJlclxuKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKHR5cGVvZiBzcHJpdGVPckdyb3VwTmFtZSAhPT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICB0eXBlb2Ygc3ByaXRlT3JHcm91cE5hbWUgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBzcHJpdGVPckdyb3VwTmFtZSA9IHNwcml0ZU9yR3JvdXBOYW1lLnRvU3RyaW5nKCk7XG4gICAgbGV0IG5hbWVNYXRjaGVzID0gc3ByaXRlT3JHcm91cE5hbWUubWF0Y2goR1FHX1NQUklURV9HUk9VUF9OQU1FX0ZPUk1BVF9SRUdFWCk7XG4gICAgbmFtZU1hdGNoZXMgPSAobmFtZU1hdGNoZXMgPyBuYW1lTWF0Y2hlcyA6IFtdKTtcbiAgICBpZiAobmFtZU1hdGNoZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gKHNwcml0ZU9yR3JvdXBOYW1lID09PSBuYW1lTWF0Y2hlc1swXSk7XG59O1xuXG5jb25zdCBHUUdfU0lHTkFMUzogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gPSB7fTtcbmxldCBHUUdfVU5JUVVFX0lEX0NPVU5URVIgPSAwO1xuXG5sZXQgR1FHX1BMQVlHUk9VTkRfV0lEVEggPSA2NDA7XG5sZXQgR1FHX1BMQVlHUk9VTkRfSEVJR0hUID0gNDgwO1xuZXhwb3J0IGxldCBQTEFZR1JPVU5EX1dJRFRIID0gR1FHX1BMQVlHUk9VTkRfV0lEVEg7IC8vIHN0dWRlbnRzIGFyZSBub3Qgc3VwcG9zZWQgdG8gdXNlIEdRR18gdmFyaWFibGVzXG5leHBvcnQgbGV0IFBMQVlHUk9VTkRfSEVJR0hUID0gR1FHX1BMQVlHUk9VTkRfSEVJR0hUO1xuXG5leHBvcnQgY29uc3QgQU5JTUFUSU9OX0hPUklaT05UQUw6IG51bWJlciA9ICQuZ1EuQU5JTUFUSU9OX0hPUklaT05UQUw7XG5leHBvcnQgY29uc3QgQU5JTUFUSU9OX1ZFUlRJQ0FMOiBudW1iZXIgPSAkLmdRLkFOSU1BVElPTl9WRVJUSUNBTDtcbmV4cG9ydCBjb25zdCBBTklNQVRJT05fT05DRTogbnVtYmVyID0gJC5nUS5BTklNQVRJT05fT05DRTtcbmV4cG9ydCBjb25zdCBBTklNQVRJT05fUElOR1BPTkc6IG51bWJlciA9ICQuZ1EuQU5JTUFUSU9OX1BJTkdQT05HO1xuZXhwb3J0IGNvbnN0IEFOSU1BVElPTl9DQUxMQkFDSzogbnVtYmVyID0gJC5nUS5BTklNQVRJT05fQ0FMTEJBQ0s7XG5leHBvcnQgY29uc3QgQU5JTUFUSU9OX01VTFRJOiBudW1iZXIgPSAkLmdRLkFOSU1BVElPTl9NVUxUSTtcblxuXG4vLyBNYXgvTWluIFNhZmUgUGxheWdyb3VuZCBJbnRlZ2VycyBmb3VuZCBieSBleHBlcmltZW50aW5nIHdpdGggR1EgMC43LjEgaW4gRmlyZWZveCA0MS4wLjIgb24gTWFjIE9TIFggMTAuMTAuNVxuY29uc3QgR1FHX01JTl9TQUZFX1BMQVlHUk9VTkRfSU5URUdFUiA9IC0oTWF0aC5wb3coMiwgMjQpIC0gMSk7IC8vIGNmLiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9OdW1iZXIvTUlOX1NBRkVfSU5URUdFUlxuY29uc3QgR1FHX01BWF9TQUZFX1BMQVlHUk9VTkRfSU5URUdFUiA9IChNYXRoLnBvdygyLCAyNCkgLSAxKTsgLy8gY2YuIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL051bWJlci9NQVhfU0FGRV9JTlRFR0VSXG5cblxuY29uc3QgR1FHX2dldFVuaXF1ZUlkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIERhdGUubm93KCkgKyBcIl9cIiArIEdRR19VTklRVUVfSURfQ09VTlRFUisrO1xufTtcblxuZXhwb3J0IGNvbnN0IHNldEdxUGxheWdyb3VuZERpbWVuc2lvbnMgPSAoXG4gICAgd2lkdGg6IG51bWJlcixcbiAgICBoZWlnaHQ6IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgLy8gdGhpcyBtdXN0IGJlIGV4ZWN1dGVkIG91dHNpZGUgb2Ygc2V0dXAgYW5kIGRyYXcgZnVuY3Rpb25zXG4gICAgR1FHX1BMQVlHUk9VTkRfSEVJR0hUID0gaGVpZ2h0O1xuICAgIFBMQVlHUk9VTkRfSEVJR0hUID0gaGVpZ2h0O1xuICAgIEdRR19QTEFZR1JPVU5EX1dJRFRIID0gd2lkdGg7XG4gICAgUExBWUdST1VORF9XSURUSCA9IHdpZHRoO1xuICAgIHNwcml0ZShcInBsYXlncm91bmRcIikud2lkdGgod2lkdGgpLmhlaWdodChoZWlnaHQpO1xufTtcblxuZXhwb3J0IGNvbnN0IGN1cnJlbnREYXRlID0gKCk6IG51bWJlciA9PiB7XG4gICAgcmV0dXJuIERhdGUubm93KCk7XG59O1xuXG5leHBvcnQgY29uc3QgY29uc29sZVByaW50ID0gKC4uLnR4dDogYW55KTogdm9pZCA9PiB7XG4gICAgLy8gbWlnaHQgd29yayBvbmx5IGluIENocm9tZSBvciBpZiBzb21lIGRldmVsb3BtZW50IGFkZC1vbnMgYXJlIGluc3RhbGxlZFxuICAgIGNvbnNvbGUubG9nKC4uLnR4dCk7XG59O1xuXG5cbmNvbnN0IEdRR19JTl9NWVBST0dSQU1fTVNHID0gJ2luIFwibXlwcm9ncmFtLnRzXCItICc7XG5jb25zdCBHUUdfRVJST1JfSU5fTVlQUk9HUkFNX01TRyA9IFwiRXJyb3IgXCIgKyBHUUdfSU5fTVlQUk9HUkFNX01TRztcbmNvbnN0IEdRR19XQVJOSU5HX0lOX01ZUFJPR1JBTV9NU0cgPSAnV2FybmluZyAnICsgR1FHX0lOX01ZUFJPR1JBTV9NU0c7XG5cbmNvbnN0IHByaW50RXJyb3JUb0NvbnNvbGVPbmNlID0gKCgpID0+IHtcbiAgICB2YXIgdGhyb3dDb25zb2xlRXJyb3JfcHJpbnRlZDogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gPSB7fTtcbiAgICByZXR1cm4gKG1zZzogc3RyaW5nKSA9PiB7XG4gICAgICAgIC8vIEZpcmVmb3ggd291bGRuJ3QgcHJpbnQgdW5jYXVnaHQgZXhjZXB0aW9ucyB3aXRoIGZpbGUgbmFtZS9saW5lIG51bWJlclxuICAgICAgICAvLyBidXQgYWRkaW5nIFwibmV3IEVycm9yKClcIiB0byB0aGUgdGhyb3cgYmVsb3cgZml4ZWQgaXQuLi5cbiAgICAgICAgaWYgKCF0aHJvd0NvbnNvbGVFcnJvcl9wcmludGVkW21zZ10pIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjogXCIgKyBtc2cpO1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JfcHJpbnRlZFttc2ddID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuY29uc3QgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbSA9IChtc2c6IHN0cmluZyk6IG5ldmVyID0+IHtcbiAgICAvLyBGaXJlZm94IHdvdWxkbid0IHByaW50IHVuY2F1Z2h0IGV4Y2VwdGlvbnMgd2l0aCBmaWxlIG5hbWUvbGluZSBudW1iZXJcbiAgICAvLyBidXQgYWRkaW5nIFwibmV3IEVycm9yKClcIiB0byB0aGUgdGhyb3cgYmVsb3cgZml4ZWQgaXQuLi5cbiAgICB0aHJvdyBuZXcgRXJyb3IoR1FHX0lOX01ZUFJPR1JBTV9NU0cgKyBtc2cpO1xufTtcblxuY29uc3QgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGlmICh0eXBlb2Ygc3ByaXRlTmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU3ByaXRlIG5hbWUgbXVzdCBiZSBhIFN0cmluZywgbm90OiBcIiArIHNwcml0ZU5hbWUpO1xuICAgIH0gZWxzZSBpZiAoIXNwcml0ZUV4aXN0cyhzcHJpdGVOYW1lKSkge1xuICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU3ByaXRlIGRvZXNuJ3QgZXhpc3Q6IFwiICsgc3ByaXRlTmFtZSk7XG4gICAgfVxufTtcbk51bWJlci5pc0Zpbml0ZSA9IE51bWJlci5pc0Zpbml0ZSB8fCBmdW5jdGlvbiAodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICAgIC8vIHNlZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTnVtYmVyL2lzRmluaXRlXG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUodmFsdWUpO1xufTtcbmNvbnN0IHRocm93SWZOb3RGaW5pdGVOdW1iZXIgPSAobXNnOiBzdHJpbmcsIHZhbDogYW55KTogdm9pZCA9PiB7IC8vIGUuZy4gdGhyb3cgaWYgTmFOLCBJbmZpbml0eSwgbnVsbFxuICAgIGlmICghTnVtYmVyLmlzRmluaXRlKHZhbCkpIHtcbiAgICAgICAgbXNnID0gbXNnIHx8IFwiRXhwZWN0ZWQgYSBudW1iZXIuXCI7XG4gICAgICAgIG1zZyArPSBcIiBZb3UgdXNlZFwiO1xuICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgbXNnICs9IFwiIHRoZSBTdHJpbmc6IFxcXCJcIiArIHZhbCArIFwiXFxcIlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbXNnICs9IFwiOiBcIiArIHZhbDtcbiAgICAgICAgfVxuICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKG1zZyk7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHRocm93T25JbWdMb2FkRXJyb3IgPSAoaW1nVXJsOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAvLyB3aGF0IHRoaXMgZnVuY3Rpb24gdGhyb3dzIG11c3Qgbm90IGJlIGNhdWdodCBieSBjYWxsZXIgdGhvLi4uXG4gICAgaWYgKGltZ1VybC5zdWJzdHJpbmcoaW1nVXJsLmxlbmd0aCAtIFwiLmdpZlwiLmxlbmd0aCkudG9Mb3dlckNhc2UoKSA9PT0gXCIuZ2lmXCIpIHtcbiAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcImltYWdlIGZpbGUgZm9ybWF0IG5vdCBzdXBwb3J0ZWQ6IEdJRlwiKTtcbiAgICB9XG4gICAgbGV0IHRocm93YWJsZUVyciA9IG5ldyBFcnJvcihcImltYWdlIGZpbGUgbm90IGZvdW5kOiBcIiArIGltZ1VybCk7XG4gICAgJChcIjxpbWcvPlwiKS5vbihcImVycm9yXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCEhdGhyb3dhYmxlRXJyICYmIHRocm93YWJsZUVyci5zdGFjayAmJlxuICAgICAgICAgICAgdGhyb3dhYmxlRXJyLnN0YWNrLnRvU3RyaW5nKCkuaW5kZXhPZihcIm15cHJvZ3JhbS5qc1wiKSA+PSAwKSB7XG4gICAgICAgICAgICB0aHJvd2FibGVFcnIubWVzc2FnZSA9IEdRR19FUlJPUl9JTl9NWVBST0dSQU1fTVNHICsgdGhyb3dhYmxlRXJyLm1lc3NhZ2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgdGhyb3dhYmxlRXJyO1xuICAgIH0pLmF0dHIoXCJzcmNcIiwgaW1nVXJsKTtcbn07XG5cblxuXG50eXBlIE5ld0dRQW5pbWF0aW9uRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICB1cmxPck1hcDogc3RyaW5nLFxuICAgICAgICBudW1iZXJPZkZyYW1lOiBudW1iZXIsXG4gICAgICAgIGRlbHRhOiBudW1iZXIsXG4gICAgICAgIHJhdGU6IG51bWJlcixcbiAgICAgICAgdHlwZTogbnVtYmVyXG4gICAgKTogU3ByaXRlQW5pbWF0aW9uO1xuICAgICh0aGlzOiB2b2lkLCB1cmxPck1hcDogc3RyaW5nKTogU3ByaXRlQW5pbWF0aW9uO1xuICAgICh0aGlzOiB2b2lkLCB1cmxPck1hcDogb2JqZWN0KTogU3ByaXRlQW5pbWF0aW9uO1xufTtcbmV4cG9ydCBjb25zdCBuZXdHUUFuaW1hdGlvbjogTmV3R1FBbmltYXRpb25GbiA9ICgoKSA9PiB7XG4gICAgbGV0IG1lbW9BbmltczogTWFwPHN0cmluZyB8IG9iamVjdCwgU3ByaXRlQW5pbWF0aW9uPiA9IG5ldyBNYXA8b2JqZWN0LCBTcHJpdGVBbmltYXRpb24+KCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgdXJsT3JNYXA6IHN0cmluZyB8IG9iamVjdCxcbiAgICAgICAgbnVtYmVyT2ZGcmFtZT86IG51bWJlcixcbiAgICAgICAgZGVsdGE/OiBudW1iZXIsXG4gICAgICAgIHJhdGU/OiBudW1iZXIsXG4gICAgICAgIHR5cGU/OiBudW1iZXJcbiAgICApOiBTcHJpdGVBbmltYXRpb24ge1xuICAgICAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHVybE9yTWFwKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiRmlyc3QgYXJndW1lbnQgZm9yIG5ld0dRQW5pbWF0aW9uIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgdXJsT3JNYXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHVybE9yTWFwID09PSBcInN0cmluZ1wiKSB0aHJvd09uSW1nTG9hZEVycm9yKHVybE9yTWFwKTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiTnVtYmVyIG9mIGZyYW1lIGFyZ3VtZW50IGZvciBuZXdHUUFuaW1hdGlvbiBtdXN0IGJlIG51bWVyaWMuIFwiLCBudW1iZXJPZkZyYW1lKTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiRGVsdGEgYXJndW1lbnQgZm9yIG5ld0dRQW5pbWF0aW9uIG11c3QgYmUgbnVtZXJpYy4gXCIsIGRlbHRhKTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiUmF0ZSBhcmd1bWVudCBmb3IgbmV3R1FBbmltYXRpb24gbXVzdCBiZSBudW1lcmljLiBcIiwgcmF0ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgIT0gbnVsbCAmJiAodHlwZSAmIEFOSU1BVElPTl9WRVJUSUNBTCkgJiYgKHR5cGUgJiBBTklNQVRJT05fSE9SSVpPTlRBTCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlR5cGUgYXJndW1lbnQgZm9yIG5ld0dRQW5pbWF0aW9uIGNhbm5vdCBiZSBib3RoIEFOSU1BVElPTl9WRVJUSUNBTCBhbmQgQU5JTUFUSU9OX0hPUklaT05UQUwgLSB1c2Ugb25lIG9yIHRoZSBvdGhlciBidXQgbm90IGJvdGghXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSAhPSBudWxsICYmICEodHlwZSAmIEFOSU1BVElPTl9WRVJUSUNBTCkgJiYgISh0eXBlICYgQU5JTUFUSU9OX0hPUklaT05UQUwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJUeXBlIGFyZ3VtZW50IGZvciBuZXdHUUFuaW1hdGlvbiBpcyBtaXNzaW5nIGJvdGggQU5JTUFUSU9OX1ZFUlRJQ0FMIGFuZCBBTklNQVRJT05fSE9SSVpPTlRBTCAtIG11c3QgdXNlIG9uZSBvciB0aGUgb3RoZXIhXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHVybE9yTWFwKSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvd09uSW1nTG9hZEVycm9yKHVybE9yTWFwKTtcbiAgICAgICAgICAgICAgICB9IC8vIGVsc2UgaG9wZSBpdCdzIGEgcHJvcGVyIG9wdGlvbnMgbWFwIHRvIHBhc3Mgb24gdG8gR2FtZVF1ZXJ5IGRpcmVjdGx5XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIHVzZWQgZm9yIG5ld0dRQW5pbWF0aW9uLiBDaGVjayBBUEkgZG9jdW1lbnRhdGlvbiBmb3IgZGV0YWlscyBvZiBwYXJhbWV0ZXJzLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDUpIHtcbiAgICAgICAgICAgIGxldCBrZXkgPSBbdXJsT3JNYXAsIG51bWJlck9mRnJhbWUsIGRlbHRhLCByYXRlLCB0eXBlXTtcbiAgICAgICAgICAgIGxldCBtdWx0aWZyYW1lQW5pbTogU3ByaXRlQW5pbWF0aW9uIHwgdW5kZWZpbmVkID0gbWVtb0FuaW1zLmdldChrZXkpO1xuICAgICAgICAgICAgaWYgKG11bHRpZnJhbWVBbmltICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbXVsdGlmcmFtZUFuaW07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBtdWx0aWZyYW1lQW5pbTogU3ByaXRlQW5pbWF0aW9uID0gbmV3ICQuZ1EuQW5pbWF0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VVUkw6IHVybE9yTWFwLFxuICAgICAgICAgICAgICAgICAgICBudW1iZXJPZkZyYW1lOiBudW1iZXJPZkZyYW1lLFxuICAgICAgICAgICAgICAgICAgICBkZWx0YTogZGVsdGEsXG4gICAgICAgICAgICAgICAgICAgIHJhdGU6IHJhdGUsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IHR5cGVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBtZW1vQW5pbXMuc2V0KGtleSwgbXVsdGlmcmFtZUFuaW0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBtdWx0aWZyYW1lQW5pbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBsZXQgc2luZ2xlZnJhbWVBbmltOiBTcHJpdGVBbmltYXRpb24gfCB1bmRlZmluZWQgPSBtZW1vQW5pbXMuZ2V0KHVybE9yTWFwKTtcbiAgICAgICAgICAgIGlmIChzaW5nbGVmcmFtZUFuaW0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzaW5nbGVmcmFtZUFuaW07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBzaW5nbGVmcmFtZUFuaW06IFNwcml0ZUFuaW1hdGlvbjtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mICh1cmxPck1hcCkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2luZ2xlZnJhbWVBbmltID0gbmV3ICQuZ1EuQW5pbWF0aW9uKHsgaW1hZ2VVUkw6IHVybE9yTWFwIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNpbmdsZWZyYW1lQW5pbSA9IG5ldyAkLmdRLkFuaW1hdGlvbih1cmxPck1hcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1lbW9Bbmltcy5zZXQodXJsT3JNYXAsIHNpbmdsZWZyYW1lQW5pbSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpbmdsZWZyYW1lQW5pbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIHVzZWQgZm9yIG5ld0dRQW5pbWF0aW9uLiBDaGVjayBBUEkgZG9jdW1lbnRhdGlvbiBmb3IgZGV0YWlscyBvZiBwYXJhbWV0ZXJzLlwiKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgJC5nUS5BbmltYXRpb24oeyBpbWFnZVVSTDogXCJcIiB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG50eXBlIENyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3g6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeTogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAodGhpczogdm9pZCwgZ3JvdXBOYW1lOiBzdHJpbmcsIHRoZVdpZHRoOiBudW1iZXIsIHRoZUhlaWdodDogbnVtYmVyKTogdm9pZDtcbiAgICAodGhpczogdm9pZCwgZ3JvdXBOYW1lOiBzdHJpbmcpOiB2b2lkO1xuICAgICh0aGlzOiB2b2lkLCBncm91cE5hbWU6IHN0cmluZywgb3B0TWFwOiBvYmplY3QpOiB2b2lkO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVHcm91cEluUGxheWdyb3VuZDogQ3JlYXRlR3JvdXBJblBsYXlncm91bmRGbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgIHRoZVdpZHRoPzogbnVtYmVyIHwgb2JqZWN0LFxuICAgIHRoZUhlaWdodD86IG51bWJlcixcbiAgICB0aGVQb3N4PzogbnVtYmVyLFxuICAgIHRoZVBvc3k/OiBudW1iZXJcbik6IHZvaWQge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiAoZ3JvdXBOYW1lKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIkZpcnN0IGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBtdXN0IGJlIGEgU3RyaW5nLiBJbnN0ZWFkIGZvdW5kOiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzcHJpdGVHcm91cE5hbWVGb3JtYXRJc1ZhbGlkKGdyb3VwTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJHcm91cCBuYW1lIGdpdmVuIHRvIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIGlzIGluIHdyb25nIGZvcm1hdDogXCIgKyBncm91cE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzcHJpdGVFeGlzdHMoZ3JvdXBOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcImNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIGNhbm5vdCBjcmVhdGUgZHVwbGljYXRlIGdyb3VwIHdpdGggbmFtZTogXCIgKyBncm91cE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlV2lkdGgpO1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkhlaWdodCBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlSGVpZ2h0KTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA1KSB7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiV2lkdGggYXJndW1lbnQgZm9yIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZVdpZHRoKTtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJIZWlnaHQgYXJndW1lbnQgZm9yIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZUhlaWdodCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWCBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlUG9zeCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlUG9zeSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgeyAvLyB0cmVhdHMgYXJndW1lbnRzWzFdIGFzIGEgc3RhbmRhcmQgb3B0aW9ucyBtYXBcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzFdICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlNlY29uZCBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgZXhwZWN0ZWQgdG8gYmUgYSBkaWN0aW9uYXJ5LiBJbnN0ZWFkIGZvdW5kOiBcIiArIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgICAgICB9IC8vIGVsc2UgaG9wZSBpdCdzIGEgcHJvcGVyIHN0YW5kYXJkIG9wdGlvbnMgbWFwXG4gICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIldyb25nIG51bWJlciBvZiBhcmd1bWVudHMgdXNlZCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQuIENoZWNrIEFQSSBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzIG9mIHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgJC5wbGF5Z3JvdW5kKCkuYWRkR3JvdXAoXG4gICAgICAgICAgICBncm91cE5hbWUsXG4gICAgICAgICAgICB7IHdpZHRoOiAkLnBsYXlncm91bmQoKS53aWR0aCgpLCBoZWlnaHQ6ICQucGxheWdyb3VuZCgpLmhlaWdodCgpIH1cbiAgICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGVXaWR0aCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcInRoZVdpZHRoIG11c3QgYmUgYSBudW1iZXIgYnV0IGluc3RlYWQgZ290OiBcIiArIHRoZVdpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRHcm91cChncm91cE5hbWUsIHsgd2lkdGg6IHRoZVdpZHRoLCBoZWlnaHQ6IHRoZUhlaWdodCB9KTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGVXaWR0aCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcInRoZVdpZHRoIG11c3QgYmUgYSBudW1iZXIgYnV0IGluc3RlYWQgZ290OiBcIiArIHRoZVdpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRHcm91cChcbiAgICAgICAgICAgIGdyb3VwTmFtZSxcbiAgICAgICAgICAgIHsgd2lkdGg6IHRoZVdpZHRoLCBoZWlnaHQ6IHRoZUhlaWdodCwgcG9zeDogdGhlUG9zeCwgcG9zeTogdGhlUG9zeSB9XG4gICAgICAgICk7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7IC8vIHRyZWF0cyBhcmd1bWVudHNbMV0gYXMgYSBzdGFuZGFyZCBvcHRpb25zIG1hcFxuICAgICAgICBpZiAodHlwZW9mIHRoZVdpZHRoICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU2Vjb25kIGFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXIgYnV0IGluc3RlYWQgZ290OiBcIiArIHRoZVdpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRHcm91cChncm91cE5hbWUsIGFyZ3VtZW50c1sxXSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHR5cGUgU3ByaXRlQW5pbWF0aW9uID0geyBpbWFnZVVSTDogc3RyaW5nIH07XG50eXBlIENyZWF0ZVNwcml0ZUluR3JvdXBGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHRoZUFuaW1hdGlvbjogU3ByaXRlQW5pbWF0aW9uLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeDogbnVtYmVyLFxuICAgICAgICB0aGVQb3N5OiBudW1iZXJcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlQW5pbWF0aW9uOiBTcHJpdGVBbmltYXRpb24sXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIG9wdGlvbnNNYXA6IG9iamVjdFxuICAgICk6IHZvaWQ7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVNwcml0ZUluR3JvdXA6IENyZWF0ZVNwcml0ZUluR3JvdXBGbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICB0aGVBbmltYXRpb246IFNwcml0ZUFuaW1hdGlvbiB8IG9iamVjdCxcbiAgICB0aGVXaWR0aD86IG51bWJlcixcbiAgICB0aGVIZWlnaHQ/OiBudW1iZXIsXG4gICAgdGhlUG9zeD86IG51bWJlcixcbiAgICB0aGVQb3N5PzogbnVtYmVyXG4pOiB2b2lkIHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIGlmICh0eXBlb2YgKGdyb3VwTmFtZSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJGaXJzdCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIGEgU3RyaW5nLiBJbnN0ZWFkIGZvdW5kOiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzcHJpdGVFeGlzdHMoZ3JvdXBOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcImNyZWF0ZVNwcml0ZUluR3JvdXAgY2Fubm90IGZpbmQgZ3JvdXAgKGRvZXNuJ3QgZXhpc3Q/KTogXCIgKyBncm91cE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiAoc3ByaXRlTmFtZSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTZWNvbmQgYXJndW1lbnQgZm9yIGNyZWF0ZVNwcml0ZUluR3JvdXAgbXVzdCBiZSBhIFN0cmluZy4gSW5zdGVhZCBmb3VuZDogXCIgKyBzcHJpdGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNwcml0ZUdyb3VwTmFtZUZvcm1hdElzVmFsaWQoc3ByaXRlTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTcHJpdGUgbmFtZSBnaXZlbiB0byBjcmVhdGVTcHJpdGVJbkdyb3VwIGlzIGluIHdyb25nIGZvcm1hdDogXCIgKyBzcHJpdGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3ByaXRlRXhpc3RzKHNwcml0ZU5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiY3JlYXRlU3ByaXRlSW5Hcm91cCBjYW5ub3QgY3JlYXRlIGR1cGxpY2F0ZSBzcHJpdGUgd2l0aCBuYW1lOiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDUgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gNykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiAodGhlQW5pbWF0aW9uKSAhPT0gXCJvYmplY3RcIiB8fCAodGhlQW5pbWF0aW9uIGluc3RhbmNlb2YgT2JqZWN0XG4gICAgICAgICAgICAgICAgJiYgKCEoXCJpbWFnZVVSTFwiIGluIHRoZUFuaW1hdGlvbikgfHwgdHlwZW9mICh0aGVBbmltYXRpb25bXCJpbWFnZVVSTFwiXSkgIT09IFwic3RyaW5nXCIpKSkge1xuICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJjcmVhdGVTcHJpdGVJbkdyb3VwIGNhbm5vdCB1c2UgdGhpcyBhcyBhbiBhbmltYXRpb246IFwiICsgdGhlQW5pbWF0aW9uXG4gICAgICAgICAgICAgICAgICAgICsgXCJcXG5BbmltYXRpb24gbXVzdCBiZSBvZiB0eXBlIFNwcml0ZUFuaW1hdGlvbiBidXQgeW91IHByb3ZpZGVkIGE6IFwiICsgdHlwZW9mICh0aGVBbmltYXRpb24pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVXaWR0aCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiSGVpZ2h0IGFyZ3VtZW50IGZvciBjcmVhdGVTcHJpdGVJbkdyb3VwIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZUhlaWdodCk7XG5cblxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDcpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWCBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N4KTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1syXSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJUaGlyZCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBleHBlY3RlZCB0byBiZSBhIGRpY3Rpb25hcnkuIEluc3RlYWQgZm91bmQ6IFwiICsgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhlQW5pbWF0aW9uIGluc3RhbmNlb2YgT2JqZWN0ICYmIFwiaW1hZ2VVUkxcIiBpbiB0aGVBbmltYXRpb24gJiYgdHlwZW9mIHRoZUFuaW1hdGlvbltcImltYWdlVVJMXCJdID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlRoaXJkIGFyZ3VtZW50IGZvciBjcmVhdGVTcHJpdGVJbkdyb3VwIGV4cGVjdGVkIHRvIGJlIGEgZGljdGlvbmFyeS4gSW5zdGVhZCBmb3VuZCB0aGlzIGFuaW1hdGlvbjogXCIgKyB0aGVBbmltYXRpb24gKyBcIiB3aXRoIGltYWdlVVJMOiBcIiArIHRoZUFuaW1hdGlvbltcImltYWdlVVJMXCJdICsgXCIuIE1heWJlIHdyb25nIG51bWJlciBvZiBhcmd1bWVudHMgcHJvdmlkZWQ/IENoZWNrIEFQSSBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzIG9mIHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICAgICAgfSAvLyBlbHNlIGhvcGUgaXQncyBhIHByb3BlciBzdGFuZGFyZCBvcHRpb25zIG1hcFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIldyb25nIG51bWJlciBvZiBhcmd1bWVudHMgdXNlZCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cC4gQ2hlY2sgQVBJIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMgb2YgcGFyYW1ldGVycy5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgICAkKFwiI1wiICsgZ3JvdXBOYW1lKS5hZGRTcHJpdGUoXG4gICAgICAgICAgICBzcHJpdGVOYW1lLFxuICAgICAgICAgICAgeyBhbmltYXRpb246IHRoZUFuaW1hdGlvbiwgd2lkdGg6IHRoZVdpZHRoLCBoZWlnaHQ6IHRoZUhlaWdodCB9XG4gICAgICAgICk7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA3KSB7XG4gICAgICAgICQoXCIjXCIgKyBncm91cE5hbWUpLmFkZFNwcml0ZShcbiAgICAgICAgICAgIHNwcml0ZU5hbWUsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiB0aGVBbmltYXRpb24sXG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoZVdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhlSGVpZ2h0LFxuICAgICAgICAgICAgICAgIHBvc3g6IHRoZVBvc3gsXG4gICAgICAgICAgICAgICAgcG9zeTogdGhlUG9zeVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykgeyAvLyB0cmVhdHMgYXJndW1lbnRzWzJdIGFzIGEgc3RhbmRhcmQgb3B0aW9ucyBtYXBcbiAgICAgICAgJChcIiNcIiArIGdyb3VwTmFtZSkuYWRkU3ByaXRlKHNwcml0ZU5hbWUsIGFyZ3VtZW50c1syXSk7XG4gICAgfVxufTtcblxudHlwZSBDcmVhdGVUZXh0U3ByaXRlSW5Hcm91cEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3g6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeTogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyXG4gICAgKTogdm9pZDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXA6IENyZWF0ZVRleHRTcHJpdGVJbkdyb3VwRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICB0aGVQb3N4PzogbnVtYmVyLFxuICAgIHRoZVBvc3k/OiBudW1iZXJcbik6IHZvaWQge1xuICAgIC8vIHRvIGJlIHVzZWQgbGlrZSBzcHJpdGUoXCJ0ZXh0Qm94XCIpLnRleHQoXCJoaVwiKTsgLy8gb3IgLmh0bWwoXCI8Yj5oaTwvYj5cIik7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICBpZiAodHlwZW9mIChncm91cE5hbWUpICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiRmlyc3QgYXJndW1lbnQgZm9yIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgZ3JvdXBOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNwcml0ZUV4aXN0cyhncm91cE5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgY2Fubm90IGZpbmQgZ3JvdXAgKGRvZXNuJ3QgZXhpc3Q/KTogXCIgKyBncm91cE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiAoc3ByaXRlTmFtZSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTZWNvbmQgYXJndW1lbnQgZm9yIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgc3ByaXRlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzcHJpdGVHcm91cE5hbWVGb3JtYXRJc1ZhbGlkKHNwcml0ZU5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU3ByaXRlIG5hbWUgZ2l2ZW4gdG8gY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgaXMgaW4gd3JvbmcgZm9ybWF0OiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzcHJpdGVFeGlzdHMoc3ByaXRlTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBjYW5ub3QgY3JlYXRlIGR1cGxpY2F0ZSBzcHJpdGUgd2l0aCBuYW1lOiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDQgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gNikge1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIldpZHRoIGFyZ3VtZW50IGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVXaWR0aCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiSGVpZ2h0IGFyZ3VtZW50IGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVIZWlnaHQpO1xuXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNikge1xuICAgICAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIGFyZ3VtZW50IGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N4KTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlUG9zeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50cyB1c2VkIGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cC4gQ2hlY2sgQVBJIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMgb2YgcGFyYW1ldGVycy5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNCkge1xuICAgICAgICAkKFwiI1wiICsgZ3JvdXBOYW1lKS5hZGRTcHJpdGUoc3ByaXRlTmFtZSwge1xuICAgICAgICAgICAgd2lkdGg6IHRoZVdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGVIZWlnaHRcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA2KSB7XG4gICAgICAgICQoXCIjXCIgKyBncm91cE5hbWUpLmFkZFNwcml0ZShzcHJpdGVOYW1lLCB7XG4gICAgICAgICAgICB3aWR0aDogdGhlV2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoZUhlaWdodCxcbiAgICAgICAgICAgIHBvc3g6IHRoZVBvc3gsXG4gICAgICAgICAgICBwb3N5OiB0aGVQb3N5XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNCB8fCBhcmd1bWVudHMubGVuZ3RoID09PSA2KSB7XG4gICAgICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIFwid2hpdGVcIikgLy8gZGVmYXVsdCB0byB3aGl0ZSBiYWNrZ3JvdW5kIGZvciBlYXNlIG9mIHVzZVxuICAgICAgICAgICAgLmNzcyhcInVzZXItc2VsZWN0XCIsIFwibm9uZVwiKTtcbiAgICB9XG59O1xuXG5jb25zdCB0ZXh0SW5wdXRTcHJpdGVUZXh0QXJlYUlkID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIHNwcml0ZU5hbWUgKyBcIi10ZXh0YXJlYVwiO1xufTtcbmNvbnN0IHRleHRJbnB1dFNwcml0ZVN1Ym1pdEJ1dHRvbklkID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIHNwcml0ZU5hbWUgKyBcIi1idXR0b25cIjtcbn07XG5jb25zdCB0ZXh0SW5wdXRTcHJpdGVHUUdfU0lHTkFMU19JZCA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIHJldHVybiBzcHJpdGVOYW1lICsgXCItc3VibWl0dGVkXCI7XG59O1xudHlwZSBDcmVhdGVUZXh0SW5wdXRTcHJpdGVJbkdyb3VwRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICAgICAgcm93czogbnVtYmVyLFxuICAgICAgICBjb2xzOiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3g6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeTogbnVtYmVyLFxuICAgICAgICBzdWJtaXRIYW5kbGVyOiBTdWJtaXRIYW5kbGVyRm5cbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHJvd3M6IG51bWJlcixcbiAgICAgICAgY29sczogbnVtYmVyLFxuICAgICAgICB0aGVQb3N4OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3k6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICAgICAgcm93czogbnVtYmVyLFxuICAgICAgICBjb2xzOiBudW1iZXJcbiAgICApOiB2b2lkO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVUZXh0SW5wdXRTcHJpdGVJbkdyb3VwOiBDcmVhdGVUZXh0SW5wdXRTcHJpdGVJbkdyb3VwRm4gPVxuICAgIGZ1bmN0aW9uIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHJvd3M6IG51bWJlcixcbiAgICAgICAgY29sczogbnVtYmVyLFxuICAgICAgICB0aGVQb3N4PzogbnVtYmVyLFxuICAgICAgICB0aGVQb3N5PzogbnVtYmVyLFxuICAgICAgICBzdWJtaXRIYW5kbGVyPzogU3VibWl0SGFuZGxlckZuXG4gICAgKTogdm9pZCB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA2KSB7XG4gICAgICAgICAgICBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cChncm91cE5hbWUsIHNwcml0ZU5hbWUsIHRoZVdpZHRoLCB0aGVIZWlnaHQpO1xuICAgICAgICB9IGVsc2UgaWYgKChhcmd1bWVudHMubGVuZ3RoID09PSA4IHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDkpICYmIHRoZVBvc3ggJiZcbiAgICAgICAgICAgIHRoZVBvc3kpIHtcbiAgICAgICAgICAgIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwKFxuICAgICAgICAgICAgICAgIGdyb3VwTmFtZSxcbiAgICAgICAgICAgICAgICBzcHJpdGVOYW1lLFxuICAgICAgICAgICAgICAgIHRoZVdpZHRoLFxuICAgICAgICAgICAgICAgIHRoZUhlaWdodCxcbiAgICAgICAgICAgICAgICB0aGVQb3N4LFxuICAgICAgICAgICAgICAgIHRoZVBvc3lcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDYgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gOCB8fFxuICAgICAgICAgICAgYXJndW1lbnRzLmxlbmd0aCA9PT0gOSkge1xuICAgICAgICAgICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLmNzcyhcImJhY2tncm91bmQtY29sb3JcIiwgXCJ3aGl0ZVwiKTsgLy8gZGVmYXVsdCB0byB3aGl0ZSBiYWNrZ3JvdW5kIGZvciBlYXNlIG9mIHVzZVxuXG4gICAgICAgICAgICB2YXIgdGV4dGFyZWFIdG1sID0gJzx0ZXh0YXJlYSBpZD1cIicgK1xuICAgICAgICAgICAgICAgIHRleHRJbnB1dFNwcml0ZVRleHRBcmVhSWQoc3ByaXRlTmFtZSkgKyAnXCIgcm93cz1cIicgKyByb3dzICtcbiAgICAgICAgICAgICAgICAnXCIgY29scz1cIicgKyBjb2xzICsgJ1wiPmhpPC90ZXh0YXJlYT4nO1xuICAgICAgICAgICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLmFwcGVuZCh0ZXh0YXJlYUh0bWwpO1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9uSWQgPSB0ZXh0SW5wdXRTcHJpdGVTdWJtaXRCdXR0b25JZChzcHJpdGVOYW1lKTtcbiAgICAgICAgICAgIHZhciBidXR0b25IdG1sID0gJzxidXR0b24gaWQ9XCInICsgYnV0dG9uSWQgK1xuICAgICAgICAgICAgICAgICdcIiB0eXBlPVwiYnV0dG9uXCI+U3VibWl0PC9idXR0b24+JztcbiAgICAgICAgICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5hcHBlbmQoYnV0dG9uSHRtbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gOSkge1xuICAgICAgICAgICAgdGV4dElucHV0U3ByaXRlU2V0SGFuZGxlcihzcHJpdGVOYW1lLCBzdWJtaXRIYW5kbGVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRleHRJbnB1dFNwcml0ZVNldEhhbmRsZXIoc3ByaXRlTmFtZSk7XG4gICAgICAgIH1cbiAgICB9O1xuZXhwb3J0IHR5cGUgU3VibWl0SGFuZGxlckZuID0gKHM6IHN0cmluZykgPT4gdm9pZDtcbmV4cG9ydCBjb25zdCB0ZXh0SW5wdXRTcHJpdGVTZXRIYW5kbGVyID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHN1Ym1pdEhhbmRsZXI/OiBTdWJtaXRIYW5kbGVyRm5cbik6IHZvaWQge1xuICAgIHZhciByZWFsU3VibWl0SGFuZGxlcjtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICByZWFsU3VibWl0SGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChzdWJtaXRIYW5kbGVyKSBzdWJtaXRIYW5kbGVyKHRleHRJbnB1dFNwcml0ZVN0cmluZyhzcHJpdGVOYW1lKSk7XG4gICAgICAgICAgICBHUUdfU0lHTkFMU1t0ZXh0SW5wdXRTcHJpdGVHUUdfU0lHTkFMU19JZChzcHJpdGVOYW1lKV0gPSB0cnVlO1xuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlYWxTdWJtaXRIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgR1FHX1NJR05BTFNbdGV4dElucHV0U3ByaXRlR1FHX1NJR05BTFNfSWQoc3ByaXRlTmFtZSldID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgJChcIiNcIiArIHRleHRJbnB1dFNwcml0ZVN1Ym1pdEJ1dHRvbklkKHNwcml0ZU5hbWUpKS5jbGljayhyZWFsU3VibWl0SGFuZGxlcik7XG59O1xuXG5leHBvcnQgY29uc3QgdGV4dElucHV0U3ByaXRlU3RyaW5nID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIFN0cmluZygkKFwiI1wiICsgdGV4dElucHV0U3ByaXRlVGV4dEFyZWFJZChzcHJpdGVOYW1lKSlbMF0udmFsdWUpO1xufTtcbmV4cG9ydCBjb25zdCB0ZXh0SW5wdXRTcHJpdGVTZXRTdHJpbmcgPSAoXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHN0cjogc3RyaW5nXG4pOiB2b2lkID0+IHtcbiAgICAkKFwiI1wiICsgdGV4dElucHV0U3ByaXRlVGV4dEFyZWFJZChzcHJpdGVOYW1lKSlbMF0udmFsdWUgPSBzdHI7XG59O1xuXG5leHBvcnQgY29uc3QgdGV4dElucHV0U3ByaXRlUmVzZXQgPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgdGV4dFByb21wdD86IHN0cmluZ1xuKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGV4dElucHV0U3ByaXRlU2V0U3RyaW5nKHNwcml0ZU5hbWUsIFwiXCIpO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiAmJiB0ZXh0UHJvbXB0KSB7XG4gICAgICAgIHRleHRJbnB1dFNwcml0ZVNldFN0cmluZyhzcHJpdGVOYW1lLCB0ZXh0UHJvbXB0KTtcbiAgICB9XG4gICAgR1FHX1NJR05BTFNbdGV4dElucHV0U3ByaXRlR1FHX1NJR05BTFNfSWQoc3ByaXRlTmFtZSldID0gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3QgdGV4dElucHV0U3ByaXRlU3VibWl0dGVkID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGlmIChHUUdfU0lHTkFMU1t0ZXh0SW5wdXRTcHJpdGVHUUdfU0lHTkFMU19JZChzcHJpdGVOYW1lKV0gPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn07XG5cbmV4cG9ydCBjb25zdCByZW1vdmVTcHJpdGUgPSAoc3ByaXRlTmFtZU9yT2JqOiBzdHJpbmcgfCBvYmplY3QpOiB2b2lkID0+IHtcbiAgICBpZiAodHlwZW9mIChzcHJpdGVOYW1lT3JPYmopICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lT3JPYmopO1xuICAgICAgICB9O1xuICAgICAgICAkKFwiI1wiICsgc3ByaXRlTmFtZU9yT2JqKS5yZW1vdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKHNwcml0ZU5hbWVPck9iaikucmVtb3ZlKCk7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZSA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBzcHJpdGVEb21PYmplY3QgPT4ge1xuICAgIHJldHVybiAkKFwiI1wiICsgc3ByaXRlTmFtZSk7XG59O1xuXG5leHBvcnQgY29uc3Qgc3ByaXRlRXhpc3RzID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiAoc3ByaXRlTmFtZSA9PSAkKFwiI1wiICsgc3ByaXRlTmFtZSkuYXR0cihcImlkXCIpKTsgLy8gc3ByaXRlTmFtZSBjb3VsZCBiZSBnaXZlbiBhcyBhbiBpbnQgYnkgYSBzdHVkZW50XG59O1xuXG5leHBvcnQgY29uc3Qgc3ByaXRlT2JqZWN0ID0gKFxuICAgIHNwcml0ZU5hbWVPck9iajogc3RyaW5nIHwgb2JqZWN0XG4pOiBzcHJpdGVEb21PYmplY3QgPT4ge1xuICAgIGlmICh0eXBlb2YgKHNwcml0ZU5hbWVPck9iaikgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lT3JPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAkKHNwcml0ZU5hbWVPck9iaik7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZUlkID0gKHNwcml0ZU5hbWVPck9iajogc3RyaW5nIHwgb2JqZWN0KTogc3RyaW5nID0+IHtcbiAgICBpZiAodHlwZW9mIChzcHJpdGVOYW1lT3JPYmopICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcoJChcIiNcIiArIHNwcml0ZU5hbWVPck9iaikuYXR0cihcImlkXCIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gU3RyaW5nKCQoc3ByaXRlTmFtZU9yT2JqKS5hdHRyKFwiaWRcIikpO1xuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVHZXRYID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgfTtcbiAgICByZXR1cm4gJChcIiNcIiArIHNwcml0ZU5hbWUpLngoKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlR2V0WSA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBudW1iZXIgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgIH07XG4gICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lKS55KCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZUdldFogPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogbnVtYmVyID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICB9O1xuICAgIHJldHVybiAkKFwiI1wiICsgc3ByaXRlTmFtZSkueigpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRYID0gKHNwcml0ZU5hbWU6IHN0cmluZywgeHZhbDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHh2YWwpO1xuICAgIH07XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLngoeHZhbCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVNldFkgPSAoc3ByaXRlTmFtZTogc3RyaW5nLCB5dmFsOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlkgbG9jYXRpb24gbXVzdCBiZSBhIG51bWJlci5cIiwgeXZhbCk7XG4gICAgfTtcbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkueSh5dmFsKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0WiA9IChzcHJpdGVOYW1lOiBzdHJpbmcsIHp2YWw6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWiBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB6dmFsKTtcbiAgICB9O1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS56KHp2YWwpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRYWSA9IChcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgeHZhbDogbnVtYmVyLFxuICAgIHl2YWw6IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHh2YWwpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB5dmFsKTtcbiAgICB9O1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS54eSh4dmFsLCB5dmFsKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0WFlaID0gKFxuICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICB4dmFsOiBudW1iZXIsXG4gICAgeXZhbDogbnVtYmVyLFxuICAgIHp2YWw6IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHh2YWwpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB5dmFsKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlogbG9jYXRpb24gbXVzdCBiZSBhIG51bWJlci5cIiwgenZhbCk7XG4gICAgfTtcbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkueHl6KHh2YWwsIHl2YWwsIHp2YWwpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZUdldFdpZHRoID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgfTtcbiAgICByZXR1cm4gJChcIiNcIiArIHNwcml0ZU5hbWUpLncoKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlR2V0SGVpZ2h0ID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgfTtcbiAgICByZXR1cm4gJChcIiNcIiArIHNwcml0ZU5hbWUpLmgoKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0V2lkdGggPSAoc3ByaXRlTmFtZTogc3RyaW5nLCB3dmFsOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIldpZHRoIG11c3QgYmUgYSBudW1iZXIuXCIsIHd2YWwpO1xuICAgIH1cbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkudyh3dmFsKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0SGVpZ2h0ID0gKHNwcml0ZU5hbWU6IHN0cmluZywgaHZhbDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJIZWlnaHQgbXVzdCBiZSBhIG51bWJlci5cIiwgaHZhbCk7XG4gICAgfVxuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5oKGh2YWwpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRXaWR0aEhlaWdodCA9IChcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgd3ZhbDogbnVtYmVyLFxuICAgIGh2YWw6IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBtdXN0IGJlIGEgbnVtYmVyLlwiLCB3dmFsKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkhlaWdodCBtdXN0IGJlIGEgbnVtYmVyLlwiLCBodmFsKTtcbiAgICB9XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLndoKHd2YWwsIGh2YWwpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZUZsaXBWZXJ0aWNhbCA9IChzcHJpdGVOYW1lOiBzdHJpbmcsIGZsaXBwZWQ6IGJvb2xlYW4pOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICB9XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLmZsaXB2KGZsaXBwZWQpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVGbGlwSG9yaXpvbnRhbCA9IChzcHJpdGVOYW1lOiBzdHJpbmcsIGZsaXBwZWQ6IGJvb2xlYW4pOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICB9XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLmZsaXBoKGZsaXBwZWQpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVHZXRGbGlwVmVydGljYWwgPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgfVxuICAgIHJldHVybiAkKFwiI1wiICsgc3ByaXRlTmFtZSkuZmxpcHYoKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlR2V0RmxpcEhvcml6b250YWwgPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgfVxuICAgIHJldHVybiAkKFwiI1wiICsgc3ByaXRlTmFtZSkuZmxpcGgoKTtcbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVSb3RhdGUgPSAoXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIGFuZ2xlRGVncmVlczogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkFuZ2xlIG11c3QgYmUgYSBudW1iZXIuXCIsIGFuZ2xlRGVncmVlcyk7XG4gICAgfVxuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5yb3RhdGUoYW5nbGVEZWdyZWVzKTtcbn07XG5cbmNvbnN0IEdRR19TUFJJVEVTX1BST1BTOiB7IFt4OiBzdHJpbmddOiB7IFt5OiBzdHJpbmddOiBhbnkgfSB9ID0ge307XG5leHBvcnQgY29uc3Qgc3ByaXRlU2NhbGUgPSAoc3ByaXRlTmFtZTogc3RyaW5nLCByYXRpbzogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgLy8gU2NhbGVzIHRoZSBzcHJpdGUncyB3aWR0aC9oZWlnaHQgd2l0aCByYXRpbywgXG4gICAgLy8gYW5kIHNldCBpdHMgYW5pbSB0byAxMDAlIGZpdCBpdC5cbiAgICAvL1xuICAgIC8vIE5PVEU6IFdlIGFzc3VtZSB0aGF0IHRoZSB3aWR0aC9oZWlnaHQgb2YgdGhlIHNwcml0ZSBcbiAgICAvLyB1cG9uIGZpcnN0IGNhbGwgdG8gdGhpcyBmdW5jdGlvbiBpcyB0aGUgXCJvcmlnaW5hbFwiIHdpZHRoL2hlaWdodCBvZiB0aGUgc3ByaXRlLlxuICAgIC8vIFRoaXMgYW5kIGFsbCBzdWJzZXF1ZW50IGNhbGxzIHRvIHRoaXMgZnVuY3Rpb24gY2FsY3VsYXRlcyByYXRpb1xuICAgIC8vIHJlbGF0aXZlIHRvIHRoYXQgb3JpZ2luYWwgd2lkdGgvaGVpZ2h0LlxuXG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJSYXRpbyBtdXN0IGJlIGEgbnVtYmVyLlwiLCByYXRpbyk7XG4gICAgfVxuXG4gICAgbGV0IHNwcml0ZVByb3AgPSBHUUdfU1BSSVRFU19QUk9QU1tzcHJpdGVOYW1lXTtcbiAgICBpZiAoc3ByaXRlUHJvcCA9PSBudWxsKSB7XG4gICAgICAgIHNwcml0ZVByb3AgPSB7XG4gICAgICAgICAgICB3aWR0aE9yaWdpbmFsOiBzcHJpdGVHZXRXaWR0aChzcHJpdGVOYW1lKSxcbiAgICAgICAgICAgIGhlaWdodE9yaWdpbmFsOiBzcHJpdGVHZXRIZWlnaHQoc3ByaXRlTmFtZSlcbiAgICAgICAgfTtcbiAgICAgICAgR1FHX1NQUklURVNfUFJPUFNbc3ByaXRlTmFtZV0gPSBzcHJpdGVQcm9wO1xuICAgIH1cbiAgICBjb25zdCBuZXdXaWR0aCA9IHNwcml0ZVByb3Aud2lkdGhPcmlnaW5hbCAqIHJhdGlvO1xuICAgIGNvbnN0IG5ld0hlaWdodCA9IHNwcml0ZVByb3AuaGVpZ2h0T3JpZ2luYWwgKiByYXRpbztcblxuICAgIC8vJChcIiNcIiArIHNwcml0ZU5hbWUpLnNjYWxlKHJhdGlvKTsgLy8gR1Egc2NhbGUgaXMgdmVyeSBicm9rZW4uXG4gICAgLy8gR1EncyBzY2FsZSgpIHdpbGwgc2NhbGUgdGhlIGFuaW0gaW1hZ2UgKHdoaWNoIGlzIGEgYmFja2dyb3VuZC1pbWFnZSBpbiB0aGUgZGl2KSBwcm9wZXJseVxuICAgIC8vIGFuZCBldmVuIHNjYWxlIHRoZSBkaXYncyB3aWR0aC9oZWlnaHQgcHJvcGVybHlcbiAgICAvLyBidXQgc29tZWhvdyB0aGUgaW4tZ2FtZSB3aWR0aC9oZWlnaHQgdGhhdCBHUSBzdG9yZXMgZm9yIGl0IHJlbWFpbnMgdGhlIG9yaWdpbmFsIHNpemVcbiAgICAvLyBhbmQgd29yc2UsIHRoZSBoaXQgYm94J3Mgd2lkdGgvaGVpZ2h0IHRoYXQgR1EgdXNlcyB0byBjYWxjdWxhdGUgY29sbGlzaW9uIGRldGVjdGlvbiB3aXRoIFxuICAgIC8vIGlzIGluIGJldHdlZW4gdGhlIGRpdidzIGFuZCB0aGUgc3ByaXRlJ3Mgd2lkdGgvaGVpZ2h0IChhYm91dCBoYWxmd2F5IGJldHdlZW4/IGRvbid0IGtub3cpLlxuXG4gICAgLy8kKFwiI1wiICsgc3ByaXRlTmFtZSkuY3NzKFwidHJhbnNmb3JtLW9yaWdpblwiLCBcInRvcCBsZWZ0XCIpOyAvLyBkbyBOT1QgY2hhbmdlIHRyYW5zZm9ybS1vcmlnaW4sIGVsc2UgYnJlYWtzIGNvbGxpc2lvbiBhbmQgcm90YXRlXG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLmNzcyhcImJhY2tncm91bmQtc2l6ZVwiLCBcIjEwMCUgMTAwJVwiKTsgLy8gc3RyZXRjaGVzIHdpZHRoL2hlaWdodCBpbmRlcGVuZGVudGx5IHRvIHdpZHRoL2hlaWdodCBvZiBkaXZcbiAgICBzcHJpdGVTZXRXaWR0aEhlaWdodChzcHJpdGVOYW1lLCBuZXdXaWR0aCwgbmV3SGVpZ2h0KTtcbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRBbmltYXRpb24gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBzcHJpdGVOYW1lT3JPYmo6IHN0cmluZyB8IG9iamVjdCxcbiAgICBhR1FBbmltYXRpb24/OiBvYmplY3QsXG4gICAgY2FsbGJhY2tGdW5jdGlvbj86IEZ1bmN0aW9uXG4pIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiAmJiBhR1FBbmltYXRpb24gIT0gbnVsbCkge1xuICAgICAgICBzcHJpdGVPYmplY3Qoc3ByaXRlTmFtZU9yT2JqKS5zZXRBbmltYXRpb24oYUdRQW5pbWF0aW9uKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgJiYgYUdRQW5pbWF0aW9uICE9IG51bGwgJiYgdHlwZW9mIGNhbGxiYWNrRnVuY3Rpb24gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBzcHJpdGVPYmplY3Qoc3ByaXRlTmFtZU9yT2JqKS5zZXRBbmltYXRpb24oYUdRQW5pbWF0aW9uLCBjYWxsYmFja0Z1bmN0aW9uKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgc3ByaXRlT2JqZWN0KHNwcml0ZU5hbWVPck9iaikuc2V0QW5pbWF0aW9uKCk7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVQYXVzZUFuaW1hdGlvbiA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkucGF1c2VBbmltYXRpb24oKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlUmVzdW1lQW5pbWF0aW9uID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5yZXN1bWVBbmltYXRpb24oKTtcbn07XG5cbnR5cGUgSlFPYmplY3QgPSB7XG4gICAgb2Zmc2V0OiAoKSA9PiB7IGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIgfTtcbiAgICBvdXRlcldpZHRoOiAoeDogYm9vbGVhbikgPT4gbnVtYmVyO1xuICAgIG91dGVySGVpZ2h0OiAoeDogYm9vbGVhbikgPT4gbnVtYmVyO1xufTtcbmNvbnN0IGpxT2Jqc0NvbGxpZGVBeGlzQWxpZ25lZCA9IGZ1bmN0aW9uIChvYmoxOiBKUU9iamVjdCwgb2JqMjogSlFPYmplY3QpIHtcbiAgICAvLyBvYmoxLzIgbXVzdCBiZSBheGlzIGFsaWduZWQgalF1ZXJ5IG9iamVjdHNcbiAgICBjb25zdCBkMUxlZnQgPSBvYmoxLm9mZnNldCgpLmxlZnQ7XG4gICAgY29uc3QgZDFSaWdodCA9IGQxTGVmdCArIG9iajEub3V0ZXJXaWR0aCh0cnVlKTtcbiAgICBjb25zdCBkMVRvcCA9IG9iajEub2Zmc2V0KCkudG9wO1xuICAgIGNvbnN0IGQxQm90dG9tID0gZDFUb3AgKyBvYmoxLm91dGVySGVpZ2h0KHRydWUpO1xuXG4gICAgY29uc3QgZDJMZWZ0ID0gb2JqMi5vZmZzZXQoKS5sZWZ0O1xuICAgIGNvbnN0IGQyUmlnaHQgPSBkMkxlZnQgKyBvYmoyLm91dGVyV2lkdGgodHJ1ZSk7XG4gICAgY29uc3QgZDJUb3AgPSBvYmoyLm9mZnNldCgpLnRvcDtcbiAgICBjb25zdCBkMkJvdHRvbSA9IGQyVG9wICsgb2JqMi5vdXRlckhlaWdodCh0cnVlKTtcblxuICAgIHJldHVybiAhKGQxQm90dG9tIDwgZDJUb3AgfHwgZDFUb3AgPiBkMkJvdHRvbSB8fCBkMVJpZ2h0IDwgZDJMZWZ0IHx8IGQxTGVmdCA+IGQyUmlnaHQpO1xufTtcblxudHlwZSBET01PYmplY3QgPSB7XG4gICAgZ2V0Qm91bmRpbmdDbGllbnRSZWN0OiAoKSA9PiB7IGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyIH07XG59O1xuY29uc3QgZG9tT2Jqc0NvbGxpZGVBeGlzQWxpZ25lZCA9IGZ1bmN0aW9uIChvYmoxOiBET01PYmplY3QsIG9iajI6IERPTU9iamVjdCkge1xuICAgIC8vIG9iajEvMiBhcmUgRE9NIG9iamVjdHMsIHBvc3NpYmx5IHJvdGF0ZWRcbiAgICAvLyBjb2xsaXNpb24gaXMgY2hlY2tlZCB2aWEgYXhpcyBhbGlnbmVkIGJvdW5kaW5nIHJlY3RzXG4gICAgY29uc3QgcjEgPSBvYmoxLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHIyID0gb2JqMi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4gIShyMS5ib3R0b20gPCByMi50b3AgfHwgcjEudG9wID4gcjIuYm90dG9tIHx8IHIxLnJpZ2h0IDwgcjIubGVmdCB8fCByMS5sZWZ0ID4gcjIucmlnaHQpO1xufTtcblxudHlwZSBHYW1lUXVlcnlPYmplY3QgPSB7XG4gICAgYW5nbGU6IG51bWJlcixcbiAgICBhbmltYXRpb246IG9iamVjdCxcbiAgICBib3VuZGluZ0NpcmNsZTogb2JqZWN0LFxuICAgIGN1cnJlbnRGcmFtZTogbnVtYmVyLFxuICAgIGZhY3RvcjogbnVtYmVyLFxuICAgIGZhY3Rvcmg6IG51bWJlcixcbiAgICBmYWN0b3J2OiBudW1iZXIsXG4gICAgZnJhbWVJbmNyZW1lbnQ6IG51bWJlcixcbiAgICBnZW9tZXRyeTogbnVtYmVyLFxuICAgIGhlaWdodDogbnVtYmVyLFxuICAgIGlkbGVDb3VudGVyOiBudW1iZXIsXG4gICAgcGxheWluZzogYm9vbGVhbixcbiAgICBwb3NPZmZzZXRYOiBudW1iZXIsXG4gICAgcG9zT2Zmc2V0WTogbnVtYmVyLFxuICAgIHBvc3g6IG51bWJlcixcbiAgICBwb3N5OiBudW1iZXIsXG4gICAgcG9zejogbnVtYmVyLFxuICAgIHdpZHRoOiBudW1iZXJcbn07XG5jb25zdCBncU9ianNDb2xsaWRlQXhpc0FsaWduZWQgPSBmdW5jdGlvbiAob2JqMTogeyBnYW1lUXVlcnk6IEdhbWVRdWVyeU9iamVjdCB9LCBvYmoyOiB7IGdhbWVRdWVyeTogR2FtZVF1ZXJ5T2JqZWN0IH0pIHtcbiAgICAvLyBvYmoxLzIgbXVzdCBiZSBheGlzIGFsaWduZWQgR1EgRE9NIG9iamVjdHNcbiAgICAvLyB0dXJucyBvdXQgdGhpcyBpcyBub3QgcmVhbGx5IGZhc3RlciB0aGFuIGRvbU9ianNDb2xsaWRlQXhpc0FsaWduZWRcbiAgICBjb25zdCByMSA9IG9iajEuZ2FtZVF1ZXJ5O1xuICAgIGNvbnN0IHIxX2JvdHRvbSA9IHIxLnBvc3kgKyByMS5oZWlnaHQ7XG4gICAgY29uc3QgcjFfcmlnaHQgPSByMS5wb3N4ICsgcjEud2lkdGg7XG5cbiAgICBjb25zdCByMiA9IG9iajIuZ2FtZVF1ZXJ5O1xuICAgIGNvbnN0IHIyX2JvdHRvbSA9IHIyLnBvc3kgKyByMi5oZWlnaHQ7XG4gICAgY29uc3QgcjJfcmlnaHQgPSByMi5wb3N4ICsgcjIud2lkdGg7XG4gICAgcmV0dXJuICEocjFfYm90dG9tIDwgcjIucG9zeSB8fCByMS5wb3N5ID4gcjJfYm90dG9tIHx8IHIxX3JpZ2h0IDwgcjIucG9zeCB8fCByMS5wb3N4ID4gcjJfcmlnaHQpO1xufTtcblxuXG4vKipcbiAqIFV0aWxpdHkgZnVuY3Rpb24gcmV0dXJucyByYWRpdXMgb2YgcmVjdGFuZ3VsYXIgZ2VvbWV0cnlcbiAqIFxuICogQHBhcmFtIGVsZW1cbiAqIEBwYXJhbSBhbmdsZSB0aGUgYW5nbGUgaW4gZGVncmVlc1xuICogQHJldHVybiAueCwgLnkgcmFkaXVzIG9mIGdlb21ldHJ5XG4gKi9cbmNvbnN0IHByb2plY3RHcU9iaiA9IGZ1bmN0aW9uIChlbGVtOiBHYW1lUXVlcnlPYmplY3QsIGFuZ2xlOiBudW1iZXIpOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0ge1xuICAgIC8vIGJhc2VkIG9uIGEgR1EgZm4uXG4gICAgY29uc3QgYiA9IGFuZ2xlICogTWF0aC5QSSAvIDE4MDtcbiAgICBjb25zdCBSeCA9IE1hdGguYWJzKE1hdGguY29zKGIpICogZWxlbS53aWR0aCAvIDIgKiBlbGVtLmZhY3RvcikgKyBNYXRoLmFicyhNYXRoLnNpbihiKSAqIGVsZW0uaGVpZ2h0IC8gMiAqIGVsZW0uZmFjdG9yKTtcbiAgICBjb25zdCBSeSA9IE1hdGguYWJzKE1hdGguY29zKGIpICogZWxlbS5oZWlnaHQgLyAyICogZWxlbS5mYWN0b3IpICsgTWF0aC5hYnMoTWF0aC5zaW4oYikgKiBlbGVtLndpZHRoIC8gMiAqIGVsZW0uZmFjdG9yKTtcbiAgICByZXR1cm4geyB4OiBSeCwgeTogUnkgfTtcbn07XG5cbi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbiByZXR1cm5zIHdoZXRoZXIgdHdvIG5vbi1heGlzIGFsaWduZWQgcmVjdGFuZ3VsYXIgb2JqZWN0cyBhcmUgY29sbGlkaW5nXG4gKiBcbiAqIEBwYXJhbSBlbGVtMVxuICogQHBhcmFtIGVsZW0xQ2VudGVyWCB4LWNvb3JkIG9mIGNlbnRlciBvZiBib3VuZGluZyBjaXJjbGUvcmVjdCBvZiBlbGVtMVxuICogQHBhcmFtIGVsZW0xQ2VudGVyWSB5LWNvb3JkIG9mIGNlbnRlciBvZiBib3VuZGluZyBjaXJjbGUvcmVjdCBvZiBlbGVtMVxuICogQHBhcmFtIGVsZW0yXG4gKiBAcGFyYW0gZWxlbTJDZW50ZXJYIHgtY29vcmQgb2YgY2VudGVyIG9mIGJvdW5kaW5nIGNpcmNsZS9yZWN0IG9mIGVsZW0yXG4gKiBAcGFyYW0gZWxlbTJDZW50ZXJZIHktY29vcmQgb2YgY2VudGVyIG9mIGJvdW5kaW5nIGNpcmNsZS9yZWN0IG9mIGVsZW0yXG4gKiBAcmV0dXJuIHtib29sZWFufSBpZiB0aGUgdHdvIGVsZW1lbnRzIGNvbGxpZGUgb3Igbm90XG4gKi9cbmNvbnN0IGdxT2Jqc0NvbGxpZGUgPSBmdW5jdGlvbiAoZWxlbTE6IEdhbWVRdWVyeU9iamVjdCwgZWxlbTFDZW50ZXJYOiBudW1iZXIsIGVsZW0xQ2VudGVyWTogbnVtYmVyLFxuICAgIGVsZW0yOiBHYW1lUXVlcnlPYmplY3QsIGVsZW0yQ2VudGVyWDogbnVtYmVyLCBlbGVtMkNlbnRlclk6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIC8vIHRlc3QgcmVhbCBjb2xsaXNpb24gKG9ubHkgZm9yIHR3byByZWN0YW5nbGVzOyBjb3VsZCBiZSByb3RhdGVkKVxuICAgIC8vIGJhc2VkIG9uIGFuZCBmaXhlcyBhIGJyb2tlbiBHUSBmbi5cbiAgICBjb25zdCBkeCA9IGVsZW0yQ2VudGVyWCAtIGVsZW0xQ2VudGVyWDsgLy8gR1EgdXNlcyBpdHMgYm91bmRpbmdDaXJjbGUgdG8gY2FsY3VsYXRlIHRoZXNlLCBidXRcbiAgICBjb25zdCBkeSA9IGVsZW0yQ2VudGVyWSAtIGVsZW0xQ2VudGVyWTsgLy8gR1EgYm91bmRpbmdDaXJjbGVzIGFyZSBicm9rZW4gd2hlbiBzcHJpdGVzIGFyZSBzY2FsZWRcbiAgICBjb25zdCBhID0gTWF0aC5hdGFuKGR5IC8gZHgpO1xuXG4gICAgbGV0IER4ID0gTWF0aC5hYnMoTWF0aC5jb3MoYSAtIGVsZW0xLmFuZ2xlICogTWF0aC5QSSAvIDE4MCkgLyBNYXRoLmNvcyhhKSAqIGR4KTtcbiAgICBsZXQgRHkgPSBNYXRoLmFicyhNYXRoLnNpbihhIC0gZWxlbTEuYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSAvIE1hdGguc2luKGEpICogZHkpO1xuXG4gICAgbGV0IFIgPSBwcm9qZWN0R3FPYmooZWxlbTIsIGVsZW0yLmFuZ2xlIC0gZWxlbTEuYW5nbGUpO1xuXG4gICAgaWYgKChlbGVtMS53aWR0aCAvIDIgKiBlbGVtMS5mYWN0b3IgKyBSLnggPD0gRHgpIHx8IChlbGVtMS5oZWlnaHQgLyAyICogZWxlbTEuZmFjdG9yICsgUi55IDw9IER5KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgRHggPSBNYXRoLmFicyhNYXRoLmNvcyhhIC0gZWxlbTIuYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSAvIE1hdGguY29zKGEpICogLWR4KTtcbiAgICAgICAgRHkgPSBNYXRoLmFicyhNYXRoLnNpbihhIC0gZWxlbTIuYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSAvIE1hdGguc2luKGEpICogLWR5KTtcblxuICAgICAgICBSID0gcHJvamVjdEdxT2JqKGVsZW0xLCBlbGVtMS5hbmdsZSAtIGVsZW0yLmFuZ2xlKTtcblxuICAgICAgICBpZiAoKGVsZW0yLndpZHRoIC8gMiAqIGVsZW0yLmZhY3RvciArIFIueCA8PSBEeCkgfHwgKGVsZW0yLmhlaWdodCAvIDIgKiBlbGVtMi5mYWN0b3IgKyBSLnkgPD0gRHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmV4cG9ydCB0eXBlIENvbGxpc2lvbkhhbmRsaW5nRm4gPSAoY29sbEluZGV4OiBudW1iZXIsIGhpdFNwcml0ZTogb2JqZWN0KSA9PlxuICAgIHZvaWQ7XG5leHBvcnQgY29uc3QgZm9yRWFjaFNwcml0ZVNwcml0ZUNvbGxpc2lvbkRvID0gKFxuICAgIHNwcml0ZTFOYW1lOiBzdHJpbmcsXG4gICAgc3ByaXRlMk5hbWU6IHN0cmluZyxcbiAgICBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uOiBDb2xsaXNpb25IYW5kbGluZ0ZuXG4pOiB2b2lkID0+IHtcbiAgICAkKHNwcml0ZUZpbHRlcmVkQ29sbGlzaW9uKHNwcml0ZTFOYW1lLCBcIi5nUV9ncm91cCwgI1wiICsgc3ByaXRlMk5hbWUpKS5lYWNoKGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb24pO1xuICAgIC8vIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb24gY2FuIG9wdGlvbmFsbHkgdGFrZSB0d28gYXJndW1lbnRzOiBjb2xsSW5kZXgsIGhpdFNwcml0ZVxuICAgIC8vIHNlZSBodHRwOi8vYXBpLmpxdWVyeS5jb20valF1ZXJ5LmVhY2hcbn07XG5leHBvcnQgY29uc3QgZm9yRWFjaDJTcHJpdGVzSGl0ID0gKCgpID0+IHtcbiAgICB2YXIgcHJpbnRlZCA9IGZhbHNlO1xuICAgIHJldHVybiAoc3ByaXRlMU5hbWU6IHN0cmluZywgc3ByaXRlMk5hbWU6IHN0cmluZywgY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbjogQ29sbGlzaW9uSGFuZGxpbmdGbikgPT4ge1xuICAgICAgICBpZiAoIXByaW50ZWQpIHtcbiAgICAgICAgICAgIHByaW50ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIkRlcHJlY2F0ZWQgZnVuY3Rpb24gdXNlZDogZm9yRWFjaDJTcHJpdGVzSGl0LiAgVXNlIHdoZW4yU3ByaXRlc0hpdCBpbnN0ZWFkIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2UuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGZvckVhY2hTcHJpdGVTcHJpdGVDb2xsaXNpb25EbyhzcHJpdGUxTmFtZSwgc3ByaXRlMk5hbWUsIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb24pO1xuICAgIH07XG59KSgpO1xuZXhwb3J0IGNvbnN0IHdoZW4yU3ByaXRlc0hpdCA9IGZvckVhY2hTcHJpdGVTcHJpdGVDb2xsaXNpb25EbzsgLy8gTkVXXG5cbmV4cG9ydCBjb25zdCBmb3JFYWNoU3ByaXRlR3JvdXBDb2xsaXNpb25EbyA9IChcbiAgICBzcHJpdGUxTmFtZTogc3RyaW5nLFxuICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb246IENvbGxpc2lvbkhhbmRsaW5nRm5cbik6IHZvaWQgPT4ge1xuICAgICQoc3ByaXRlRmlsdGVyZWRDb2xsaXNpb24oc3ByaXRlMU5hbWUsIFwiI1wiICsgZ3JvdXBOYW1lICsgXCIsIC5nUV9zcHJpdGVcIikpLmVhY2goY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbik7XG4gICAgLy8gY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbiBjYW4gb3B0aW9uYWxseSB0YWtlIHR3byBhcmd1bWVudHM6IGNvbGxJbmRleCwgaGl0U3ByaXRlXG4gICAgLy8gc2VlIGh0dHA6Ly9hcGkuanF1ZXJ5LmNvbS9qUXVlcnkuZWFjaFxufTtcbmV4cG9ydCBjb25zdCBmb3JFYWNoU3ByaXRlR3JvdXBIaXQgPSBmb3JFYWNoU3ByaXRlR3JvdXBDb2xsaXNpb25EbztcblxuZXhwb3J0IGNvbnN0IGZvckVhY2hTcHJpdGVGaWx0ZXJlZENvbGxpc2lvbkRvID0gKFxuICAgIHNwcml0ZTFOYW1lOiBzdHJpbmcsXG4gICAgZmlsdGVyU3RyOiBzdHJpbmcsXG4gICAgY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbjogQ29sbGlzaW9uSGFuZGxpbmdGblxuKTogdm9pZCA9PiB7XG4gICAgJChzcHJpdGVGaWx0ZXJlZENvbGxpc2lvbihzcHJpdGUxTmFtZSwgZmlsdGVyU3RyKSkuZWFjaChjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uKTtcbiAgICAvLyBzZWUgaHR0cDovL2dhbWVxdWVyeWpzLmNvbS9kb2N1bWVudGF0aW9uL2FwaS8jY29sbGlzaW9uIGZvciBmaWx0ZXJTdHIgc3BlY1xuICAgIC8vIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb24gY2FuIG9wdGlvbmFsbHkgdGFrZSB0d28gYXJndW1lbnRzOiBjb2xsSW5kZXgsIGhpdFNwcml0ZVxuICAgIC8vIHNlZSBodHRwOi8vYXBpLmpxdWVyeS5jb20valF1ZXJ5LmVhY2hcbn07XG5leHBvcnQgY29uc3QgZm9yRWFjaFNwcml0ZUZpbHRlcmVkSGl0ID0gZm9yRWFjaFNwcml0ZUZpbHRlcmVkQ29sbGlzaW9uRG87XG5cbmNvbnN0IHNwcml0ZUZpbHRlcmVkQ29sbGlzaW9uID0gZnVuY3Rpb24gKHNwcml0ZTFOYW1lOiBzdHJpbmcsIGZpbHRlcjogc3RyaW5nKTogRE9NT2JqZWN0W10ge1xuICAgIC8vIEJhc2VkIG9uIGFuZCBmaXhlcyBHUSdzIGNvbGxpc2lvbiBmdW5jdGlvbiwgYmVjYXVzZSBHUSdzIGNvbGxpZGUgXG4gICAgLy8gZnVuY3Rpb24gaXMgYmFkbHkgYnJva2VuIHdoZW4gc3ByaXRlcyBhcmUgcm90YXRlZC9zY2FsZWRcbiAgICAvLyBUaGUgZml4IGlzIHRvIGNoZWNrIGNvbGxpc2lvbiB1c2luZyBheGlzIGFsaWduZWQgcmVjdGFuZ3VsYXIgaGl0IGJveGVzLlxuICAgIC8vIE5vdCBncmVhdCBmb3Igcm90YXRlZCBzcHJpdGVzLCBidXQgZ29vZCBlbm91Z2ggZm9yIG5vdy5cbiAgICBjb25zdCBzMSA9ICQoXCIjXCIgKyBzcHJpdGUxTmFtZSk7XG4gICAgdmFyIHJlc3VsdExpc3QgPSBbXTtcblxuICAgIC8vaWYgKHRoaXMgIT09ICQuZ2FtZVF1ZXJ5LnBsYXlncm91bmQpIHtcbiAgICAvLyBXZSBtdXN0IGZpbmQgYWxsIHRoZSBlbGVtZW50cyB0aGF0IHRvdWNoZSAndGhpcydcbiAgICB2YXIgZWxlbWVudHNUb0NoZWNrID0gbmV3IEFycmF5KCk7XG4gICAgZWxlbWVudHNUb0NoZWNrLnB1c2goJC5nYW1lUXVlcnkuc2NlbmVncmFwaC5jaGlsZHJlbihmaWx0ZXIpLmdldCgpKTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBlbGVtZW50c1RvQ2hlY2subGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdmFyIHN1YkxlbiA9IGVsZW1lbnRzVG9DaGVja1tpXS5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChzdWJMZW4tLSkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnRUb0NoZWNrID0gZWxlbWVudHNUb0NoZWNrW2ldW3N1Ykxlbl07XG4gICAgICAgICAgICAvLyBJcyBpdCBhIGdhbWVRdWVyeSBnZW5lcmF0ZWQgZWxlbWVudD9cbiAgICAgICAgICAgIGlmIChlbGVtZW50VG9DaGVjay5nYW1lUXVlcnkpIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBkb24ndCB3YW50IHRvIGNoZWNrIGdyb3Vwc1xuICAgICAgICAgICAgICAgIGlmICghZWxlbWVudFRvQ2hlY2suZ2FtZVF1ZXJ5Lmdyb3VwICYmICFlbGVtZW50VG9DaGVjay5nYW1lUXVlcnkudGlsZVNldCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBEb2VzIGl0IHRvdWNoZSB0aGUgc2VsZWN0aW9uP1xuICAgICAgICAgICAgICAgICAgICBpZiAoczFbMF0gIT0gZWxlbWVudFRvQ2hlY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGJvdW5kaW5nIGNpcmNsZSBjb2xsaXNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qdmFyIGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KG9mZnNldFkgKyBnYW1lUXVlcnkuYm91bmRpbmdDaXJjbGUueSAtIGVsZW1lbnRzVG9DaGVja1tpXS5vZmZzZXRZIC0gZWxlbWVudFRvQ2hlY2suZ2FtZVF1ZXJ5LmJvdW5kaW5nQ2lyY2xlLnksIDIpICsgTWF0aC5wb3cob2Zmc2V0WCArIGdhbWVRdWVyeS5ib3VuZGluZ0NpcmNsZS54IC0gZWxlbWVudHNUb0NoZWNrW2ldLm9mZnNldFggLSBlbGVtZW50VG9DaGVjay5nYW1lUXVlcnkuYm91bmRpbmdDaXJjbGUueCwgMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlIC0gZ2FtZVF1ZXJ5LmJvdW5kaW5nQ2lyY2xlLnJhZGl1cyAtIGVsZW1lbnRUb0NoZWNrLmdhbWVRdWVyeS5ib3VuZGluZ0NpcmNsZS5yYWRpdXMgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHMxUmVjdCA9IHMxWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZTJSZWN0ID0gZWxlbWVudFRvQ2hlY2suZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShzMVJlY3QuYm90dG9tIDwgZTJSZWN0LnRvcCB8fCBzMVJlY3QudG9wID4gZTJSZWN0LmJvdHRvbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHMxUmVjdC5yaWdodCA8IGUyUmVjdC5sZWZ0IHx8IHMxUmVjdC5sZWZ0ID4gZTJSZWN0LnJpZ2h0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIHJlYWwgY29sbGlzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9pZiAoY29sbGlkZShnYW1lUXVlcnksIHsgeDogb2Zmc2V0WCwgeTogb2Zmc2V0WSB9LCBlbGVtZW50VG9DaGVjay5nYW1lUXVlcnksIHsgeDogZWxlbWVudHNUb0NoZWNrW2ldLm9mZnNldFgsIHk6IGVsZW1lbnRzVG9DaGVja1tpXS5vZmZzZXRZIH0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR1EncyBjb2xsaWRlIGlzIHZlcnkgYnJva2VuIGlmIHJvdGF0aW9uIGFwcGxpZWRcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzMVswXS5nYW1lUXVlcnkuYW5nbGUgJSA5MCA9PT0gMCAmJiBlbGVtZW50VG9DaGVjay5nYW1lUXVlcnkuYW5nbGUgJSA5MCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBheGlzIGFsaWduZWQgY29sbGlzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkZCB0byB0aGUgcmVzdWx0IGxpc3QgaWYgY29sbGlzaW9uIGRldGVjdGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdExpc3QucHVzaChlbGVtZW50c1RvQ2hlY2tbaV1bc3ViTGVuXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gbm90IGF4aXMgYWxpZ25lZCBjb2xsaXNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgczFDZW50ZXJYID0gczFSZWN0LmxlZnQgKyAoczFSZWN0LnJpZ2h0IC0gczFSZWN0LmxlZnQpIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgczFDZW50ZXJZID0gczFSZWN0LnRvcCArIChzMVJlY3QuYm90dG9tIC0gczFSZWN0LnRvcCkgLyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlMkNlbnRlclggPSBlMlJlY3QubGVmdCArIChlMlJlY3QucmlnaHQgLSBlMlJlY3QubGVmdCkgLyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlMkNlbnRlclkgPSBlMlJlY3QudG9wICsgKGUyUmVjdC5ib3R0b20gLSBlMlJlY3QudG9wKSAvIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChncU9ianNDb2xsaWRlKHMxWzBdLmdhbWVRdWVyeSwgczFDZW50ZXJYLCBzMUNlbnRlclksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50VG9DaGVjay5nYW1lUXVlcnksIGUyQ2VudGVyWCwgZTJDZW50ZXJZKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWRkIHRvIHRoZSByZXN1bHQgbGlzdCBpZiBjb2xsaXNpb24gZGV0ZWN0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdExpc3QucHVzaChlbGVtZW50c1RvQ2hlY2tbaV1bc3ViTGVuXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gQWRkIHRoZSBjaGlsZHJlbiBub2RlcyB0byB0aGUgbGlzdFxuICAgICAgICAgICAgICAgIHZhciBlbGVDaGlsZHJlbiA9ICQoZWxlbWVudFRvQ2hlY2spLmNoaWxkcmVuKGZpbHRlcik7XG4gICAgICAgICAgICAgICAgaWYgKGVsZUNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50c1RvQ2hlY2sucHVzaChlbGVDaGlsZHJlbi5nZXQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzVG9DaGVja1tsZW5dLm9mZnNldFggPSBlbGVtZW50VG9DaGVjay5nYW1lUXVlcnkucG9zeCArIGVsZW1lbnRzVG9DaGVja1tpXS5vZmZzZXRYO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50c1RvQ2hlY2tbbGVuXS5vZmZzZXRZID0gZWxlbWVudFRvQ2hlY2suZ2FtZVF1ZXJ5LnBvc3kgKyBlbGVtZW50c1RvQ2hlY2tbaV0ub2Zmc2V0WTtcbiAgICAgICAgICAgICAgICAgICAgbGVuKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdExpc3Q7XG59O1xuXG5leHBvcnQgdHlwZSBTcHJpdGVIaXREaXJlY3Rpb25hbGl0eSA9IHtcbiAgICBcImxlZnRcIjogYm9vbGVhbjtcbiAgICBcInJpZ2h0XCI6IGJvb2xlYW47XG4gICAgXCJ1cFwiOiBib29sZWFuO1xuICAgIFwiZG93blwiOiBib29sZWFuO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVIaXREaXJlY3Rpb24gPSAoXG4gICAgc3ByaXRlMUlkOiBzdHJpbmcsXG4gICAgc3ByaXRlMVg6IG51bWJlcixcbiAgICBzcHJpdGUxWTogbnVtYmVyLFxuICAgIHNwcml0ZTFYU3BlZWQ6IG51bWJlcixcbiAgICBzcHJpdGUxWVNwZWVkOiBudW1iZXIsXG4gICAgc3ByaXRlMVdpZHRoOiBudW1iZXIsXG4gICAgc3ByaXRlMUhlaWdodDogbnVtYmVyLFxuICAgIHNwcml0ZTJJZDogc3RyaW5nLFxuICAgIHNwcml0ZTJYOiBudW1iZXIsXG4gICAgc3ByaXRlMlk6IG51bWJlcixcbiAgICBzcHJpdGUyWFNwZWVkOiBudW1iZXIsXG4gICAgc3ByaXRlMllTcGVlZDogbnVtYmVyLFxuICAgIHNwcml0ZTJXaWR0aDogbnVtYmVyLFxuICAgIHNwcml0ZTJIZWlnaHQ6IG51bWJlclxuKTogU3ByaXRlSGl0RGlyZWN0aW9uYWxpdHkgPT4ge1xuICAgIHZhciBzcHJpdGUxSW5mbzogU3ByaXRlRGljdCA9IHtcbiAgICAgICAgXCJpZFwiOiBzcHJpdGUxSWQsXG4gICAgICAgIFwieFBvc1wiOiBzcHJpdGUxWCxcbiAgICAgICAgXCJ5UG9zXCI6IHNwcml0ZTFZLFxuICAgICAgICBcInhTcGVlZFwiOiBzcHJpdGUxWFNwZWVkLFxuICAgICAgICBcInlTcGVlZFwiOiBzcHJpdGUxWVNwZWVkLFxuICAgICAgICBcImhlaWdodFwiOiBzcHJpdGUxSGVpZ2h0LFxuICAgICAgICBcIndpZHRoXCI6IHNwcml0ZTFXaWR0aFxuICAgIH07XG4gICAgdmFyIHNwcml0ZTJJbmZvOiBTcHJpdGVEaWN0ID0ge1xuICAgICAgICBcImlkXCI6IHNwcml0ZTJJZCxcbiAgICAgICAgXCJ4UG9zXCI6IHNwcml0ZTJYLFxuICAgICAgICBcInlQb3NcIjogc3ByaXRlMlksXG4gICAgICAgIFwieFNwZWVkXCI6IHNwcml0ZTJYU3BlZWQsXG4gICAgICAgIFwieVNwZWVkXCI6IHNwcml0ZTJZU3BlZWQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHNwcml0ZTJIZWlnaHQsXG4gICAgICAgIFwid2lkdGhcIjogc3ByaXRlMldpZHRoXG4gICAgfTtcbiAgICByZXR1cm4gc3ByaXRlSGl0RGlyKHNwcml0ZTFJbmZvLCBzcHJpdGUySW5mbyk7XG59O1xuXG5leHBvcnQgdHlwZSBTcHJpdGVQaHlzaWNhbERpbWVuc2lvbnMgPSB7XG4gICAgXCJ4UG9zXCI6IG51bWJlcjtcbiAgICBcInlQb3NcIjogbnVtYmVyO1xuICAgIFwieFNwZWVkXCI6IG51bWJlcjsgLy8gbW92ZW1lbnQgbXVzdCBiZSBieSBkaWN0aW9uYXJ5LFxuICAgIFwieVNwZWVkXCI6IG51bWJlcjsgLy8gd2l0aCBzb21ldGhpbmcgbGlrZSB4ID0geCArIHhTcGVlZFxuICAgIFwid2lkdGhcIjogbnVtYmVyO1xuICAgIFwiaGVpZ2h0XCI6IG51bWJlcjtcbn07XG5leHBvcnQgdHlwZSBTcHJpdGVEaWN0ID0gU3ByaXRlUGh5c2ljYWxEaW1lbnNpb25zICYge1xuICAgIFwiaWRcIjogc3RyaW5nO1xuICAgIFtzOiBzdHJpbmddOiBhbnk7XG59O1xuY29uc3Qgc3ByaXRlc1NwZWVkU2FtcGxlczogeyBbazogc3RyaW5nXTogeyBzYW1wbGVTaXplOiBudW1iZXIsIHhTcGVlZFNhbXBsZXM6IG51bWJlcltdLCB5U3BlZWRTYW1wbGVzOiBudW1iZXJbXSwgY2hlY2tlZDogYm9vbGVhbiB9IH0gPSB7fTtcbmNvbnN0IGNoZWNrU3ByaXRlU3BlZWRVc2FnZUNvbW1vbkVycm9ycyA9IChzcHJpdGVJbmZvOiBTcHJpdGVEaWN0KSA9PiB7XG4gICAgLy8gQSBoZXVyaXN0aWMgY2hlY2sgZm9yIGNvbW1vbiBlcnJvcnMgZnJvbSBsZWFybmVycy5cbiAgICAvLyBDaGVjayBpZiBzcHJpdGUgc3BlZWRzIGV2ZXIgY2hhbmdlLiAgSWYgbm90LCBwcm9iYWJseSBkb2luZyBpdCB3cm9uZy5cbiAgICBpZiAoIXNwcml0ZXNTcGVlZFNhbXBsZXNbc3ByaXRlSW5mb1tcImlkXCJdXSkge1xuICAgICAgICBzcHJpdGVzU3BlZWRTYW1wbGVzW3Nwcml0ZUluZm9bXCJpZFwiXV0gPSB7XG4gICAgICAgICAgICBzYW1wbGVTaXplOiAwLFxuICAgICAgICAgICAgeFNwZWVkU2FtcGxlczogW10sXG4gICAgICAgICAgICB5U3BlZWRTYW1wbGVzOiBbXSxcbiAgICAgICAgICAgIGNoZWNrZWQ6IGZhbHNlXG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3ByaXRlMVNhbXBsaW5nID0gc3ByaXRlc1NwZWVkU2FtcGxlc1tzcHJpdGVJbmZvW1wiaWRcIl1dO1xuICAgICAgICBjb25zdCBtYXhTYW1wbGVTaXplID0gMTA7XG4gICAgICAgIGlmIChzcHJpdGUxU2FtcGxpbmcuc2FtcGxlU2l6ZSA8IG1heFNhbXBsZVNpemUpIHtcbiAgICAgICAgICAgICsrc3ByaXRlMVNhbXBsaW5nLnNhbXBsZVNpemU7XG4gICAgICAgICAgICBzcHJpdGUxU2FtcGxpbmcueFNwZWVkU2FtcGxlcy5wdXNoKHNwcml0ZUluZm9bXCJ4U3BlZWRcIl0pO1xuICAgICAgICAgICAgc3ByaXRlMVNhbXBsaW5nLnlTcGVlZFNhbXBsZXMucHVzaChzcHJpdGVJbmZvW1wieVNwZWVkXCJdKTtcbiAgICAgICAgfSBlbHNlIGlmICghc3ByaXRlMVNhbXBsaW5nLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIHNwcml0ZTFTYW1wbGluZy5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IHNzID0gc3ByaXRlMVNhbXBsaW5nLnNhbXBsZVNpemU7XG4gICAgICAgICAgICBjb25zdCBzeFNhbXBsZXMgPSBzcHJpdGUxU2FtcGxpbmcueFNwZWVkU2FtcGxlcztcbiAgICAgICAgICAgIGNvbnN0IHN5U2FtcGxlcyA9IHNwcml0ZTFTYW1wbGluZy55U3BlZWRTYW1wbGVzO1xuXG4gICAgICAgICAgICBsZXQgc2FtZVhzcGVlZCA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHNzOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3hTYW1wbGVzW2ldICE9PSBzeFNhbXBsZXNbaSAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgIHNhbWVYc3BlZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNhbWVYc3BlZWQgJiYgc3hTYW1wbGVzWzBdICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coR1FHX1dBUk5JTkdfSU5fTVlQUk9HUkFNX01TR1xuICAgICAgICAgICAgICAgICAgICArIFwic3ByaXRlIGhpdCBkaXJlY3Rpb24gZnVuY3Rpb25hbGl0eS0gcG9zc2libHkgd3JvbmcgeFBvcyBjYWxjdWxhdGlvbiBmb3Igc3ByaXRlOiBcIlxuICAgICAgICAgICAgICAgICAgICArIHNwcml0ZUluZm9bXCJpZFwiXVxuICAgICAgICAgICAgICAgICAgICArIFwiLiAgRW5zdXJlIHhTcGVlZCB1c2VkIHZhbGlkbHkgaWYgc3ByaXRlIGhpdCBkaXJlY3Rpb25hbGl0eSBzZWVtcyB3cm9uZy5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzYW1lWXNwZWVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc3M7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChzeVNhbXBsZXNbaV0gIT09IHN5U2FtcGxlc1tpIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgc2FtZVlzcGVlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2FtZVlzcGVlZCAmJiBzeVNhbXBsZXNbMF0gIT09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhHUUdfV0FSTklOR19JTl9NWVBST0dSQU1fTVNHXG4gICAgICAgICAgICAgICAgICAgICsgXCJzcHJpdGUgaGl0IGRpcmVjdGlvbiBmdW5jdGlvbmFsaXR5LSBwb3NzaWJseSB3cm9uZyB5UG9zIGNhbGN1bGF0aW9uIGZvciBzcHJpdGU6IFwiXG4gICAgICAgICAgICAgICAgICAgICsgc3ByaXRlSW5mb1tcImlkXCJdXG4gICAgICAgICAgICAgICAgICAgICsgXCIuICBFbnN1cmUgeVNwZWVkIHVzZWQgdmFsaWRseSBpZiBzcHJpdGUgaGl0IGRpcmVjdGlvbmFsaXR5IHNlZW1zIHdyb25nLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVIaXREaXIgPSAoXG4gICAgc3ByaXRlMUluZm86IFNwcml0ZURpY3QsXG4gICAgc3ByaXRlMkluZm86IFNwcml0ZURpY3Rcbik6IFNwcml0ZUhpdERpcmVjdGlvbmFsaXR5ID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIGNoZWNrU3ByaXRlU3BlZWRVc2FnZUNvbW1vbkVycm9ycyhzcHJpdGUxSW5mbyk7XG4gICAgICAgIGNoZWNrU3ByaXRlU3BlZWRVc2FnZUNvbW1vbkVycm9ycyhzcHJpdGUySW5mbyk7XG4gICAgfVxuICAgIHJldHVybiBzcHJpdGVIaXREaXJJbXBsKHNwcml0ZTFJbmZvLCBzcHJpdGUySW5mbyk7XG59XG5jb25zdCBzcHJpdGVIaXREaXJJbXBsID0gKFxuICAgIHNwcml0ZTFJbmZvOiBTcHJpdGVQaHlzaWNhbERpbWVuc2lvbnMsXG4gICAgc3ByaXRlMkluZm86IFNwcml0ZVBoeXNpY2FsRGltZW5zaW9uc1xuKTogU3ByaXRlSGl0RGlyZWN0aW9uYWxpdHkgPT4ge1xuICAgIC8qXG4gICAgICAgUmV0dXJucyB0aGUgZGlyZWN0aW9uIHRoYXQgc3ByaXRlIDEgaGl0cyBzcHJpdGUgMiBmcm9tLlxuICAgICAgIHNwcml0ZSAxIGlzIHJlbGF0aXZlbHkgbGVmdC9yaWdodC91cC9kb3duIG9mIHNwcml0ZSAyXG4gICAgICAgXG4gICAgICAgSGl0IGRpcmVjdGlvbiByZXR1cm5lZCBjb3VsZCBiZSBtdWx0aXBsZSB2YWx1ZXMgKGUuZy4gbGVmdCBhbmQgdXApLFxuICAgICAgIGFuZCBpcyByZXR1cm5lZCBieSB0aGlzIGZ1bmN0aW9uIGFzIGEgZGljdGlvbmFyeSBhcywgZS5nLlxuICAgICAgIHtcbiAgICAgICBcImxlZnRcIjogZmFsc2UsXG4gICAgICAgXCJyaWdodFwiOiBmYWxzZSxcbiAgICAgICBcInVwXCI6IGZhbHNlLFxuICAgICAgIFwiZG93blwiOiBmYWxzZVxuICAgICAgIH1cbiAgICAgICBcbiAgICAgICBQYXJhbWV0ZXJzIHNwcml0ZXsxLDJ9SW5mbyBhcmUgZGljdGlvbmFyaWVzIHdpdGggYXQgbGVhc3QgdGhlc2Uga2V5czpcbiAgICAgICB7XG4gICAgICAgXCJpZFwiOiBcImFjdHVhbFNwcml0ZU5hbWVcIixcbiAgICAgICBcInhQb3NcIjogNTAwLFxuICAgICAgIFwieVBvc1wiOiAyMDAsXG4gICAgICAgXCJ4U3BlZWRcIjogLTgsICAvLyBtb3ZlbWVudCBtdXN0IGJlIGJ5IGRpY3Rpb25hcnksXG4gICAgICAgXCJ5U3BlZWRcIjogMCwgICAvLyB3aXRoIHNvbWV0aGluZyBsaWtlIHggPSB4ICsgeFNwZWVkXG4gICAgICAgXCJoZWlnaHRcIjogNzQsXG4gICAgICAgXCJ3aWR0aFwiOiA3NVxuICAgICAgIH1cbiAgICAgICAqL1xuXG4gICAgdmFyIHBlcmNlbnRNYXJnaW4gPSAxLjE7IC8vIHBvc2l0aXZlIHBlcmNlbnQgaW4gZGVjaW1hbFxuICAgIHZhciBkaXI6IFNwcml0ZUhpdERpcmVjdGlvbmFsaXR5ID0ge1xuICAgICAgICBcImxlZnRcIjogZmFsc2UsXG4gICAgICAgIFwicmlnaHRcIjogZmFsc2UsXG4gICAgICAgIFwidXBcIjogZmFsc2UsXG4gICAgICAgIFwiZG93blwiOiBmYWxzZVxuICAgIH07XG5cbiAgICAvLyBjdXJyZW50IGhvcml6b250YWwgcG9zaXRpb25cbiAgICB2YXIgczFsZWZ0ID0gc3ByaXRlMUluZm9bXCJ4UG9zXCJdO1xuICAgIHZhciBzMXJpZ2h0ID0gczFsZWZ0ICsgc3ByaXRlMUluZm9bXCJ3aWR0aFwiXTtcblxuICAgIHZhciBzMmxlZnQgPSBzcHJpdGUySW5mb1tcInhQb3NcIl07XG4gICAgdmFyIHMycmlnaHQgPSBzMmxlZnQgKyBzcHJpdGUySW5mb1tcIndpZHRoXCJdO1xuXG4gICAgLy8gcmV2ZXJzZSBob3Jpem9udGFsIHBvc2l0aW9uIGJ5IHhTcGVlZCB3aXRoIHBlcmNlbnQgbWFyZ2luXG4gICAgdmFyIHNwcml0ZTFYU3BlZWQgPSBzcHJpdGUxSW5mb1tcInhTcGVlZFwiXSAqIHBlcmNlbnRNYXJnaW47XG4gICAgczFsZWZ0ID0gczFsZWZ0IC0gc3ByaXRlMVhTcGVlZDtcbiAgICBzMXJpZ2h0ID0gczFyaWdodCAtIHNwcml0ZTFYU3BlZWQ7XG5cbiAgICB2YXIgc3ByaXRlMlhTcGVlZCA9IHNwcml0ZTJJbmZvW1wieFNwZWVkXCJdICogcGVyY2VudE1hcmdpbjtcbiAgICBzMmxlZnQgPSBzMmxlZnQgLSBzcHJpdGUyWFNwZWVkO1xuICAgIHMycmlnaHQgPSBzMnJpZ2h0IC0gc3ByaXRlMlhTcGVlZDtcblxuICAgIGlmIChzMXJpZ2h0IDw9IHMybGVmdCkge1xuICAgICAgICBkaXJbXCJsZWZ0XCJdID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHMycmlnaHQgPD0gczFsZWZ0KSB7XG4gICAgICAgIGRpcltcInJpZ2h0XCJdID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBjdXJyZW50IHZlcnRpY2FsIHBvc2l0aW9uXG4gICAgdmFyIHMxdG9wID0gc3ByaXRlMUluZm9bXCJ5UG9zXCJdO1xuICAgIHZhciBzMWJvdHRvbSA9IHMxdG9wICsgc3ByaXRlMUluZm9bXCJoZWlnaHRcIl07XG5cbiAgICB2YXIgczJ0b3AgPSBzcHJpdGUySW5mb1tcInlQb3NcIl07XG4gICAgdmFyIHMyYm90dG9tID0gczJ0b3AgKyBzcHJpdGUySW5mb1tcImhlaWdodFwiXTtcblxuICAgIC8vIHJldmVyc2UgdmVydGljYWwgcG9zaXRpb24gYnkgeVNwZWVkIHdpdGggcGVyY2VudCBtYXJnaW5cbiAgICB2YXIgc3ByaXRlMVlTcGVlZCA9IHNwcml0ZTFJbmZvW1wieVNwZWVkXCJdICogcGVyY2VudE1hcmdpbjtcbiAgICBzMXRvcCA9IHMxdG9wIC0gc3ByaXRlMVlTcGVlZDtcbiAgICBzMWJvdHRvbSA9IHMxYm90dG9tIC0gc3ByaXRlMVlTcGVlZDtcblxuICAgIHZhciBzcHJpdGUyWVNwZWVkID0gc3ByaXRlMkluZm9bXCJ5U3BlZWRcIl0gKiBwZXJjZW50TWFyZ2luO1xuICAgIHMydG9wID0gczJ0b3AgLSBzcHJpdGUyWVNwZWVkO1xuICAgIHMyYm90dG9tID0gczJib3R0b20gLSBzcHJpdGUyWVNwZWVkO1xuXG4gICAgaWYgKHMxYm90dG9tIDw9IHMydG9wKSB7XG4gICAgICAgIGRpcltcInVwXCJdID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHMyYm90dG9tIDw9IHMxdG9wKSB7XG4gICAgICAgIGRpcltcImRvd25cIl0gPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBkaXI7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0S2V5U3RhdGUgPSAoa2V5OiBudW1iZXIpOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gISEkLmdRLmtleVRyYWNrZXJba2V5XTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRNb3VzZVggPSAoKTogbnVtYmVyID0+IHtcbiAgICByZXR1cm4gJC5nUS5tb3VzZVRyYWNrZXIueDtcbn07XG5leHBvcnQgY29uc3QgZ2V0TW91c2VZID0gKCk6IG51bWJlciA9PiB7XG4gICAgcmV0dXJuICQuZ1EubW91c2VUcmFja2VyLnk7XG59O1xuZXhwb3J0IGNvbnN0IGdldE1vdXNlQnV0dG9uMSA9ICgpOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gISEkLmdRLm1vdXNlVHJhY2tlclsxXTtcbn07XG5leHBvcnQgY29uc3QgZ2V0TW91c2VCdXR0b24yID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiAhISQuZ1EubW91c2VUcmFja2VyWzJdO1xufTtcbmV4cG9ydCBjb25zdCBnZXRNb3VzZUJ1dHRvbjMgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgcmV0dXJuICEhJC5nUS5tb3VzZVRyYWNrZXJbM107XG59O1xuXG5leHBvcnQgY29uc3QgZGlzYWJsZUNvbnRleHRNZW51ID0gKCk6IHZvaWQgPT4ge1xuICAgIC8vIHNlZSBhbHNvOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80OTIwMjIxL2pxdWVyeS1qcy1wcmV2ZW50LXJpZ2h0LWNsaWNrLW1lbnUtaW4tYnJvd3NlcnNcbiAgICAvLyAkKFwiI3BsYXlncm91bmRcIikuY29udGV4dG1lbnUoZnVuY3Rpb24oKXtyZXR1cm4gZmFsc2U7fSk7XG4gICAgJChcIiNwbGF5Z3JvdW5kXCIpLm9uKFwiY29udGV4dG1lbnVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG59O1xuZXhwb3J0IGNvbnN0IGVuYWJsZUNvbnRleHRNZW51ID0gKCk6IHZvaWQgPT4ge1xuICAgIC8vIHNlZSBhbHNvOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80OTIwMjIxL2pxdWVyeS1qcy1wcmV2ZW50LXJpZ2h0LWNsaWNrLW1lbnUtaW4tYnJvd3NlcnNcbiAgICAkKFwiI3BsYXlncm91bmRcIikub2ZmKFwiY29udGV4dG1lbnVcIik7XG59O1xuXG5leHBvcnQgY29uc3QgaGlkZU1vdXNlQ3Vyc29yID0gKCk6IHZvaWQgPT4ge1xuICAgICQoXCIjcGxheWdyb3VuZFwiKS5jc3MoXCJjdXJzb3JcIiwgXCJub25lXCIpO1xufTtcbmV4cG9ydCBjb25zdCBzaG93TW91c2VDdXJzb3IgPSAoKTogdm9pZCA9PiB7XG4gICAgJChcIiNwbGF5Z3JvdW5kXCIpLmNzcyhcImN1cnNvclwiLCBcImRlZmF1bHRcIik7XG59O1xuXG5leHBvcnQgY29uc3Qgc2F2ZURpY3Rpb25hcnlBcyA9IChzYXZlQXM6IHN0cmluZywgZGljdGlvbmFyeTogb2JqZWN0KTogdm9pZCA9PiB7XG4gICAgLy8gcmVxdWlyZXMganMtY29va2llOiBodHRwczovL2dpdGh1Yi5jb20vanMtY29va2llL2pzLWNvb2tpZS90cmVlL3YyLjAuNFxuICAgIENvb2tpZXMuc2V0KFwiR1FHX1wiICsgc2F2ZUFzLCBkaWN0aW9uYXJ5KTtcbn07XG5leHBvcnQgY29uc3QgZ2V0U2F2ZWREaWN0aW9uYXJ5ID0gKHNhdmVkQXM6IHN0cmluZyk6IG9iamVjdCA9PiB7XG4gICAgcmV0dXJuIENvb2tpZXMuZ2V0SlNPTihcIkdRR19cIiArIHNhdmVkQXMpO1xufTtcbmV4cG9ydCBjb25zdCBkZWxldGVTYXZlZERpY3Rpb25hcnkgPSAoc2F2ZWRBczogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgQ29va2llcy5yZW1vdmUoXCJHUUdfXCIgKyBzYXZlZEFzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVPdmFsSW5Hcm91cCA9IChcbiAgICBncm91cE5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgaWQ6IHN0cmluZyxcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHc6IG51bWJlcixcbiAgICBoOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgLy8gcm90ZGVnIGluIGRlZ3JlZXMgY2xvY2t3aXNlIG9uIHNjcmVlbiAocmVjYWxsIHktYXhpcyBwb2ludHMgZG93bndhcmRzISlcblxuICAgIGlmICghY29sb3IpIHtcbiAgICAgICAgY29sb3IgPSBcImdyYXlcIjtcbiAgICB9XG5cbiAgICBpZiAoIWdyb3VwTmFtZSkge1xuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRTcHJpdGUoaWQsIHsgd2lkdGg6IDEsIGhlaWdodDogMSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjcmVhdGVTcHJpdGVJbkdyb3VwKGdyb3VwTmFtZSwgaWQsIHsgd2lkdGg6IDEsIGhlaWdodDogMSB9KTtcbiAgICB9XG5cbiAgICB2YXIgYm9yZGVyX3JhZGl1cyA9ICh3IC8gMiArIFwicHggLyBcIiArIGggLyAyICsgXCJweFwiKTtcbiAgICBzcHJpdGUoaWQpXG4gICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIGNvbG9yKVxuICAgICAgICAuY3NzKFwiYm9yZGVyLXJhZGl1c1wiLCBib3JkZXJfcmFkaXVzKVxuICAgICAgICAuY3NzKFwiLW1vei1ib3JkZXItcmFkaXVzXCIsIGJvcmRlcl9yYWRpdXMpXG4gICAgICAgIC5jc3MoXCItd2Via2l0LWJvcmRlci1yYWRpdXNcIiwgYm9yZGVyX3JhZGl1cyk7XG5cbiAgICBzcHJpdGVTZXRXaWR0aEhlaWdodChpZCwgdywgaCk7XG4gICAgc3ByaXRlU2V0WFkoaWQsIHgsIHkpO1xuXG4gICAgaWYgKHJvdGRlZyAhPSBudWxsKSB7XG4gICAgICAgIGlmIChyb3RPcmlnaW5YICE9IG51bGwgJiYgcm90T3JpZ2luWSAhPSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgcm90T3JpZ2luID0gcm90T3JpZ2luWCArIFwicHggXCIgKyByb3RPcmlnaW5ZICsgXCJweFwiO1xuICAgICAgICAgICAgc3ByaXRlKGlkKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItd2Via2l0LXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItbW96LXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItbXMtdHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pXG4gICAgICAgICAgICAgICAgLmNzcyhcIi1vLXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCJ0cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbik7XG4gICAgICAgIH1cbiAgICAgICAgc3ByaXRlUm90YXRlKGlkLCByb3RkZWcpO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgY3JlYXRlT3ZhbCA9IChcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVPdmFsSW5Hcm91cChcbiAgICAgICAgbnVsbCxcbiAgICAgICAgaWQsXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHcsXG4gICAgICAgIGgsXG4gICAgICAgIGNvbG9yLFxuICAgICAgICByb3RkZWcsXG4gICAgICAgIHJvdE9yaWdpblgsXG4gICAgICAgIHJvdE9yaWdpbllcbiAgICApO1xufTtcbmV4cG9ydCBjb25zdCBkcmF3T3ZhbCA9IChcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHc6IG51bWJlcixcbiAgICBoOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgY3JlYXRlT3ZhbChcbiAgICAgICAgXCJHUUdfb3ZhbF9cIiArIEdRR19nZXRVbmlxdWVJZCgpLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICB3LFxuICAgICAgICBoLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlQ2lyY2xlSW5Hcm91cCA9IChcbiAgICBncm91cE5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgaWQ6IHN0cmluZyxcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHI6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVPdmFsSW5Hcm91cChcbiAgICAgICAgZ3JvdXBOYW1lLFxuICAgICAgICBpZCxcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgcixcbiAgICAgICAgcixcbiAgICAgICAgY29sb3IsXG4gICAgICAgIHJvdGRlZyxcbiAgICAgICAgcm90T3JpZ2luWCxcbiAgICAgICAgcm90T3JpZ2luWVxuICAgICk7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUNpcmNsZSA9IChcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgcjogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHJvdGRlZz86IG51bWJlcixcbiAgICByb3RPcmlnaW5YPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblk/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZUNpcmNsZUluR3JvdXAoXG4gICAgICAgIG51bGwsXG4gICAgICAgIGlkLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICByLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5leHBvcnQgY29uc3QgZHJhd0NpcmNsZSA9IChcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHI6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVDaXJjbGUoXG4gICAgICAgIFwiR1FHX2NpcmNsZV9cIiArIEdRR19nZXRVbmlxdWVJZCgpLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICByLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVSZWN0SW5Hcm91cCA9IChcbiAgICBncm91cE5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgaWQ6IHN0cmluZyxcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHc6IG51bWJlcixcbiAgICBoOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgLy8gcm90ZGVnIGluIGRlZ3JlZXMgY2xvY2t3aXNlIG9uIHNjcmVlbiAocmVjYWxsIHktYXhpcyBwb2ludHMgZG93bndhcmRzISlcbiAgICAvLyByb3RPcmlnaW57WCxZfSBtdXN0IGJlIHdpdGhpbiByYW5nZSBvZiB3aWRlIHcgYW5kIGhlaWdodCBoLCBhbmQgcmVsYXRpdmUgdG8gY29vcmRpbmF0ZSAoeCx5KS5cblxuICAgIGlmICghY29sb3IpIHtcbiAgICAgICAgY29sb3IgPSBcImdyYXlcIjtcbiAgICB9XG5cbiAgICBpZiAoIWdyb3VwTmFtZSkge1xuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRTcHJpdGUoaWQsIHsgd2lkdGg6IDEsIGhlaWdodDogMSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjcmVhdGVTcHJpdGVJbkdyb3VwKGdyb3VwTmFtZSwgaWQsIHsgd2lkdGg6IDEsIGhlaWdodDogMSB9KTtcbiAgICB9XG5cbiAgICBzcHJpdGUoaWQpLmNzcyhcImJhY2tncm91bmRcIiwgY29sb3IpO1xuXG4gICAgc3ByaXRlU2V0V2lkdGhIZWlnaHQoaWQsIHcsIGgpO1xuICAgIHNwcml0ZVNldFhZKGlkLCB4LCB5KTtcblxuICAgIGlmIChyb3RkZWcgIT0gbnVsbCkge1xuICAgICAgICBpZiAocm90T3JpZ2luWCAhPSBudWxsICYmIHJvdE9yaWdpblkgIT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIHJvdE9yaWdpbiA9IHJvdE9yaWdpblggKyBcInB4IFwiICsgcm90T3JpZ2luWSArIFwicHhcIjtcbiAgICAgICAgICAgIHNwcml0ZShpZClcbiAgICAgICAgICAgICAgICAuY3NzKFwiLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbilcbiAgICAgICAgICAgICAgICAuY3NzKFwiLW1vei10cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbilcbiAgICAgICAgICAgICAgICAuY3NzKFwiLW1zLXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItby10cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbilcbiAgICAgICAgICAgICAgICAuY3NzKFwidHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pO1xuICAgICAgICB9XG4gICAgICAgIHNwcml0ZVJvdGF0ZShpZCwgcm90ZGVnKTtcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVJlY3QgPSAoXG4gICAgaWQ6IHN0cmluZyxcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHc6IG51bWJlcixcbiAgICBoOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgY3JlYXRlUmVjdEluR3JvdXAoXG4gICAgICAgIG51bGwsXG4gICAgICAgIGlkLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICB3LFxuICAgICAgICBoLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5leHBvcnQgY29uc3QgZHJhd1JlY3QgPSAoXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICB3OiBudW1iZXIsXG4gICAgaDogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHJvdGRlZz86IG51bWJlcixcbiAgICByb3RPcmlnaW5YPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblk/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZVJlY3QoXG4gICAgICAgIFwiR1FHX3JlY3RfXCIgKyBHUUdfZ2V0VW5pcXVlSWQoKSxcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgdyxcbiAgICAgICAgaCxcbiAgICAgICAgY29sb3IsXG4gICAgICAgIHJvdGRlZyxcbiAgICAgICAgcm90T3JpZ2luWCxcbiAgICAgICAgcm90T3JpZ2luWVxuICAgICk7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlTGluZUluR3JvdXAgPSAoXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcgfCBudWxsLFxuICAgIGlkOiBzdHJpbmcsXG4gICAgeDE6IG51bWJlcixcbiAgICB5MTogbnVtYmVyLFxuICAgIHgyOiBudW1iZXIsXG4gICAgeTI6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICB0aGlja25lc3M/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGlmICghY29sb3IpIHtcbiAgICAgICAgY29sb3IgPSBcImdyYXlcIjtcbiAgICB9XG4gICAgaWYgKCF0aGlja25lc3MpIHtcbiAgICAgICAgdGhpY2tuZXNzID0gMjtcbiAgICB9XG4gICAgdmFyIHhkID0geDIgLSB4MTtcbiAgICB2YXIgeWQgPSB5MiAtIHkxO1xuICAgIHZhciBkaXN0ID0gTWF0aC5zcXJ0KHhkICogeGQgKyB5ZCAqIHlkKTtcblxuICAgIHZhciBhcmNDb3MgPSBNYXRoLmFjb3MoeGQgLyBkaXN0KTtcbiAgICBpZiAoeTIgPCB5MSkge1xuICAgICAgICBhcmNDb3MgKj0gLTE7XG4gICAgfVxuICAgIHZhciByb3RkZWcgPSBhcmNDb3MgKiAxODAgLyBNYXRoLlBJO1xuXG4gICAgdmFyIGhhbGZUaGljayA9IHRoaWNrbmVzcyAvIDI7XG4gICAgdmFyIGRyYXdZMSA9IHkxIC0gaGFsZlRoaWNrO1xuXG4gICAgY3JlYXRlUmVjdEluR3JvdXAoXG4gICAgICAgIGdyb3VwTmFtZSxcbiAgICAgICAgaWQsXG4gICAgICAgIHgxLFxuICAgICAgICBkcmF3WTEsXG4gICAgICAgIGRpc3QsXG4gICAgICAgIHRoaWNrbmVzcyxcbiAgICAgICAgY29sb3IsXG4gICAgICAgIHJvdGRlZyxcbiAgICAgICAgMCxcbiAgICAgICAgaGFsZlRoaWNrXG4gICAgKTtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlTGluZSA9IChcbiAgICBpZDogc3RyaW5nLFxuICAgIHgxOiBudW1iZXIsXG4gICAgeTE6IG51bWJlcixcbiAgICB4MjogbnVtYmVyLFxuICAgIHkyOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgdGhpY2tuZXNzPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVMaW5lSW5Hcm91cChudWxsLCBpZCwgeDEsIHkxLCB4MiwgeTIsIGNvbG9yLCB0aGlja25lc3MpO1xufTtcbmV4cG9ydCBjb25zdCBkcmF3TGluZSA9IChcbiAgICB4MTogbnVtYmVyLFxuICAgIHkxOiBudW1iZXIsXG4gICAgeDI6IG51bWJlcixcbiAgICB5MjogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHRoaWNrbmVzcz86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgY3JlYXRlTGluZShcIkdRR19saW5lX1wiICsgR1FHX2dldFVuaXF1ZUlkKCksIHgxLCB5MSwgeDIsIHkyLCBjb2xvciwgdGhpY2tuZXNzKTtcbn07XG5cbmV4cG9ydCB0eXBlIENvbnRhaW5lckl0ZXJhdG9yID0ge1xuICAgIG5leHQ6ICgpID0+IFtudW1iZXIsIG51bWJlcl07XG4gICAgaGFzTmV4dDogKCkgPT4gYm9vbGVhbjtcbiAgICBjdXJyZW50OiBudW1iZXI7XG4gICAgZW5kOiBudW1iZXI7XG4gICAgX2tleXM6IHN0cmluZ1tdO1xufTtcbmV4cG9ydCB0eXBlIE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuID0gKG46IG51bWJlcikgPT4gbnVtYmVyIHwgUmVjb3JkPFxuICAgIG51bWJlcixcbiAgICBudW1iZXJcbj47XG5leHBvcnQgdHlwZSBDcmVhdGVDb250YWluZXJJdGVyYXRvckZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyXG4gICAgKTogQ29udGFpbmVySXRlcmF0b3I7XG4gICAgKHRoaXM6IHZvaWQsIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuKTogQ29udGFpbmVySXRlcmF0b3I7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUNvbnRhaW5lckl0ZXJhdG9yOiBDcmVhdGVDb250YWluZXJJdGVyYXRvckZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgc3RhcnQ/OiBudW1iZXIsXG4gICAgZW5kPzogbnVtYmVyLFxuICAgIHN0ZXBzaXplPzogbnVtYmVyXG4pOiBDb250YWluZXJJdGVyYXRvciB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGYgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgY29uc3QgZk93blByb3BOYW1lczogc3RyaW5nW10gPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhmKTtcbiAgICAgICAgY29uc3QgaXQ6IENvbnRhaW5lckl0ZXJhdG9yID0ge1xuICAgICAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgICAgIGVuZDogZk93blByb3BOYW1lcy5sZW5ndGgsXG4gICAgICAgICAgICBfa2V5czogZk93blByb3BOYW1lcyxcbiAgICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uICh0aGlzOiBDb250YWluZXJJdGVyYXRvcik6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1JZHggPSB0aGlzLl9rZXlzW3RoaXMuY3VycmVudF07XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbTogW251bWJlciwgbnVtYmVyXSA9IFtOdW1iZXIoaXRlbUlkeCksIGZbaXRlbUlkeF1dO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCsrO1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhhc05leHQ6IGZ1bmN0aW9uICh0aGlzOiBDb250YWluZXJJdGVyYXRvcik6IGJvb2xlYW4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAodGhpcy5jdXJyZW50IDwgdGhpcy5lbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gaXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcInN0YXJ0IG11c3QgYmUgYSBudW1iZXIuXCIsIHN0YXJ0KTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcImVuZCBtdXN0IGJlIGEgbnVtYmVyLlwiLCBlbmQpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwic3RlcHNpemUgbXVzdCBiZSBhIG51bWJlci5cIiwgc3RlcHNpemUpO1xuICAgICAgICBpZiAoc3RhcnQgPT0gbnVsbCB8fCBlbmQgPT0gbnVsbCB8fCBzdGVwc2l6ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBcIlRTIHR5cGUgaGludFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZng6IChuOiBudW1iZXIpID0+IG51bWJlciA9ICh0eXBlb2YgZiA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICA/IChmIGFzICh4OiBudW1iZXIpID0+IG51bWJlcilcbiAgICAgICAgICAgIDogKHg6IG51bWJlcik6IG51bWJlciA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE51bWJlcihmW3hdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBjb25zdCBpdDogQ29udGFpbmVySXRlcmF0b3IgPSB7XG4gICAgICAgICAgICBuZXh0OiBmdW5jdGlvbiAodGhpczogQ29udGFpbmVySXRlcmF0b3IpOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtOiBbbnVtYmVyLCBudW1iZXJdID0gW3RoaXMuY3VycmVudCwgZngodGhpcy5jdXJyZW50KV07XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50ICs9IHN0ZXBzaXplO1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhhc05leHQ6IGZ1bmN0aW9uICh0aGlzOiBDb250YWluZXJJdGVyYXRvcik6IGJvb2xlYW4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAodGhpcy5jdXJyZW50IDwgdGhpcy5lbmQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGN1cnJlbnQ6IHN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBlbmQsXG4gICAgICAgICAgICBfa2V5czogdHlwZW9mIGYgIT09IFwiZnVuY3Rpb25cIiA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGYpIDogKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgazogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSBzdGFydDsgaSA8IGVuZDsgaSArPSBzdGVwc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICBrLnB1c2goU3RyaW5nKGkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGs7XG4gICAgICAgICAgICB9KSgpXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBpdDtcbiAgICB9XG59O1xuZXhwb3J0IHR5cGUgR3JhcGhDcmVhdGlvbk9wdGlvbnMgPSB7XG4gICAgaW50ZXJwb2xhdGVkOiBib29sZWFuO1xufTtcbmV4cG9ydCB0eXBlIENyZWF0ZUdyYXBoV2l0aE9wdGlvbnNGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgbW9yZU9wdHM6IEdyYXBoQ3JlYXRpb25PcHRpb25zLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgcmFkaXVzX3RoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIG1vcmVPcHRzOiBHcmFwaENyZWF0aW9uT3B0aW9ucyxcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgbW9yZU9wdHM6IEdyYXBoQ3JlYXRpb25PcHRpb25zLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnMsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIHJhZGl1c190aGlja25lc3M6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnMsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgbW9yZU9wdHM6IEdyYXBoQ3JlYXRpb25PcHRpb25zXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG59O1xuZXhwb3J0IHR5cGUgR3JvdXBOYW1lQW5kSWRQcmVmaXggPSB7XG4gICAgXCJpZFwiOiBzdHJpbmc7XG4gICAgXCJncm91cFwiOiBzdHJpbmc7XG59O1xudHlwZSBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzID0gW1xuICAgIHN0cmluZyxcbiAgICBzdHJpbmcsXG4gICAgTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgR3JhcGhDcmVhdGlvbk9wdGlvbnNcbl07XG5leHBvcnQgY29uc3QgY3JlYXRlR3JhcGhXaXRoT3B0aW9uczogQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgaWQ6IHN0cmluZyxcbiAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnNcbik6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBtb3JlT3B0cywgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yLCByYWRpdXNfdGhpY2tuZXNzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIG1vcmVPcHRzLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgbW9yZU9wdHMsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIG1vcmVPcHRzLCBjb2xvciwgcmFkaXVzX3RoaWNrbmVzcylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBtb3JlT3B0cywgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgbW9yZU9wdHMpXG4gICAgLy8gbW9yZU9wdHMgPSB7XCJpbnRlcnBvbGF0ZWRcIjogdHJ1ZU9yRmFsc2V9XG4gICAgdmFyIGludGVycG9sYXRlZCA9IG1vcmVPcHRzW1wiaW50ZXJwb2xhdGVkXCJdO1xuXG4gICAgaWYgKCFpZCkge1xuICAgICAgICBpZCA9IFwiR1FHX2dyYXBoX1wiICsgR1FHX2dldFVuaXF1ZUlkKCk7XG4gICAgfVxuICAgIGlmICghZ3JvdXBOYW1lKSB7XG4gICAgICAgIGdyb3VwTmFtZSA9IGlkICsgXCJfZ3JvdXBcIjtcbiAgICAgICAgY3JlYXRlR3JvdXBJblBsYXlncm91bmQoZ3JvdXBOYW1lKTtcbiAgICB9XG4gICAgdmFyIGdyb3VwX2lkID0ge1xuICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICBcImdyb3VwXCI6IGdyb3VwTmFtZVxuICAgIH07XG5cbiAgICB2YXIgY29sb3I7XG4gICAgdmFyIHJhZGl1c190aGlja25lc3M7XG4gICAgbGV0IGl0ZXI6IENvbnRhaW5lckl0ZXJhdG9yO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQgJiYgYXJndW1lbnRzLmxlbmd0aCA8PSA2ICYmXG4gICAgICAgIFwib2JqZWN0XCIgPT09IHR5cGVvZiAoZikpIHtcbiAgICAgICAgY29sb3IgPSBhcmd1bWVudHNbNF07XG4gICAgICAgIHJhZGl1c190aGlja25lc3MgPSBhcmd1bWVudHNbNV07XG4gICAgICAgIGl0ZXIgPSBjcmVhdGVDb250YWluZXJJdGVyYXRvcihmKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNyAmJiBhcmd1bWVudHMubGVuZ3RoIDw9IDkpIHtcbiAgICAgICAgdmFyIHN0YXJ0ID0gYXJndW1lbnRzWzRdO1xuICAgICAgICB2YXIgZW5kID0gYXJndW1lbnRzWzVdO1xuICAgICAgICB2YXIgc3RlcHNpemUgPSBhcmd1bWVudHNbNl07XG4gICAgICAgIGNvbG9yID0gYXJndW1lbnRzWzddO1xuICAgICAgICByYWRpdXNfdGhpY2tuZXNzID0gYXJndW1lbnRzWzhdO1xuICAgICAgICBpdGVyID0gY3JlYXRlQ29udGFpbmVySXRlcmF0b3IoZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJGdW5jdGlvbiB1c2VkIHdpdGggd3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50c1wiKTtcbiAgICAgICAgdGhyb3cgXCJUUyB0eXBlIGhpbnRcIjtcbiAgICB9XG5cbiAgICBpZiAoY29sb3IgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbG9yID0gXCJncmF5XCI7XG4gICAgfVxuICAgIGlmIChyYWRpdXNfdGhpY2tuZXNzID09IHVuZGVmaW5lZCkge1xuICAgICAgICByYWRpdXNfdGhpY2tuZXNzID0gMjtcbiAgICB9XG5cbiAgICB2YXIgY3VyclggPSBudWxsO1xuICAgIHZhciBjdXJyWSA9IG51bGw7XG4gICAgd2hpbGUgKGl0ZXIuaGFzTmV4dCgpKSB7XG4gICAgICAgIHZhciBpdGVtID0gaXRlci5uZXh0KCk7XG4gICAgICAgIHZhciBpID0gaXRlbVswXTtcbiAgICAgICAgdmFyIGZ4aSA9IGl0ZW1bMV07XG5cbiAgICAgICAgaWYgKGZ4aSA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgICAgIGZ4aSA9IEdRR19NQVhfU0FGRV9QTEFZR1JPVU5EX0lOVEVHRVI7XG4gICAgICAgIH0gZWxzZSBpZiAoZnhpID09PSAtSW5maW5pdHkpIHtcbiAgICAgICAgICAgIGZ4aSA9IEdRR19NSU5fU0FGRV9QTEFZR1JPVU5EX0lOVEVHRVI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VyclkgPT09IG51bGwgJiYgZnhpICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY3VyclggPSBpO1xuICAgICAgICAgICAgY3VyclkgPSBmeGk7XG4gICAgICAgICAgICBpZiAoIWludGVycG9sYXRlZCkge1xuICAgICAgICAgICAgICAgIGNyZWF0ZUNpcmNsZUluR3JvdXAoXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwX2lkW1wiZ3JvdXBcIl0sXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwX2lkW1wiaWRcIl0gKyBcIl9ncmFwaF9wdF9cIiArIGksXG4gICAgICAgICAgICAgICAgICAgIGksXG4gICAgICAgICAgICAgICAgICAgIGZ4aSxcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzX3RoaWNrbmVzcyxcbiAgICAgICAgICAgICAgICAgICAgY29sb3JcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZ4aSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmICghaW50ZXJwb2xhdGVkKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlQ2lyY2xlSW5Hcm91cChcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBfaWRbXCJncm91cFwiXSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBfaWRbXCJpZFwiXSArIFwiX2dyYXBoX3B0X1wiICsgaSxcbiAgICAgICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICAgICAgZnhpLFxuICAgICAgICAgICAgICAgICAgICByYWRpdXNfdGhpY2tuZXNzLFxuICAgICAgICAgICAgICAgICAgICBjb2xvclxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNyZWF0ZUxpbmVJbkdyb3VwKFxuICAgICAgICAgICAgICAgICAgICBncm91cF9pZFtcImdyb3VwXCJdLFxuICAgICAgICAgICAgICAgICAgICBncm91cF9pZFtcImlkXCJdICsgXCJfZ3JhcGhfbGluZV9cIiArIGN1cnJYICsgXCItXCIgKyBpLFxuICAgICAgICAgICAgICAgICAgICBjdXJyWCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIGN1cnJZIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICAgICAgZnhpLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzX3RoaWNrbmVzc1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyWCA9IGk7XG4gICAgICAgICAgICBjdXJyWSA9IGZ4aTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBncm91cF9pZDtcbn07XG5cbnR5cGUgQ3JlYXRlR3JhcGhJbkdyb3VwRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXJcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuXG4gICAgKTogdm9pZDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlR3JhcGhJbkdyb3VwOiBDcmVhdGVHcmFwaEluR3JvdXBGbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgIGlkOiBzdHJpbmcsXG4gICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm5cbik6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmKVxuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBhcmdzLnNwbGljZSgzLCAwLCB7IFwiaW50ZXJwb2xhdGVkXCI6IGZhbHNlIH0pO1xuICAgIHJldHVybiBjcmVhdGVHcmFwaFdpdGhPcHRpb25zLmFwcGx5KFxuICAgICAgICB0aGlzLFxuICAgICAgICBhcmdzIGFzIENyZWF0ZUdyYXBoV2l0aE9wdGlvbnNGblBhcmFtVHlwZXNcbiAgICApO1xufTtcblxudHlwZSBDcmVhdGVHcmFwaEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAodGhpczogdm9pZCwgaWQ6IHN0cmluZywgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4pOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlR3JhcGg6IENyZWF0ZUdyYXBoRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZFxuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXgge1xuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSlcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYpXG4gICAgdmFyIG9wdHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIG9wdHMuc3BsaWNlKDAsIDAsIG51bGwpO1xuICAgIG9wdHMuc3BsaWNlKDMsIDAsIHsgXCJpbnRlcnBvbGF0ZWRcIjogZmFsc2UgfSk7XG4gICAgcmV0dXJuIGNyZWF0ZUdyYXBoV2l0aE9wdGlvbnMuYXBwbHkoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIG9wdHMgYXMgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuUGFyYW1UeXBlc1xuICAgICk7XG59O1xuXG50eXBlIERyYXdHcmFwaEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAodGhpczogdm9pZCwgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4pOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbn07XG5leHBvcnQgY29uc3QgZHJhd0dyYXBoOiBEcmF3R3JhcGhGbiA9IGZ1bmN0aW9uIGRyYXdHcmFwaChcbiAgICB0aGlzOiB2b2lkXG4pOiBHcm91cE5hbWVBbmRJZFByZWZpeCB7XG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yLCBkb3RSYWRpdXMpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYsIGNvbG9yLCBkb3RSYWRpdXMpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZilcbiAgICB2YXIgb3B0cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgb3B0cy5zcGxpY2UoMCwgMCwgbnVsbCk7XG4gICAgb3B0cy5zcGxpY2UoMCwgMCwgbnVsbCk7XG4gICAgb3B0cy5zcGxpY2UoMywgMCwgeyBcImludGVycG9sYXRlZFwiOiBmYWxzZSB9KTtcbiAgICByZXR1cm4gY3JlYXRlR3JhcGhXaXRoT3B0aW9ucy5hcHBseShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgb3B0cyBhcyBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzXG4gICAgKTtcbn07XG5cbnR5cGUgQ3JlYXRlSW50ZXJwb2xhdGVkR3JhcGhJbkdyb3VwRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICB0aGlja25lc3M6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICB0aGlja25lc3M6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm5cbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlSW50ZXJwb2xhdGVkR3JhcGhJbkdyb3VwOiBDcmVhdGVJbnRlcnBvbGF0ZWRHcmFwaEluR3JvdXBGbiA9XG4gICAgZnVuY3Rpb24gKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm5cbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeCB7XG4gICAgICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvciwgdGhpY2tuZXNzKVxuICAgICAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplKVxuICAgICAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBjb2xvciwgdGhpY2tuZXNzKVxuICAgICAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBjb2xvcilcbiAgICAgICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZilcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICBhcmdzLnNwbGljZSgzLCAwLCB7IFwiaW50ZXJwb2xhdGVkXCI6IHRydWUgfSk7XG4gICAgICAgIHJldHVybiBjcmVhdGVHcmFwaFdpdGhPcHRpb25zLmFwcGx5KFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIGFyZ3MgYXMgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuUGFyYW1UeXBlc1xuICAgICAgICApO1xuICAgIH07XG5cbnR5cGUgQ3JlYXRlSW50ZXJwb2xhdGVkR3JhcGhGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgdGhpY2tuZXNzOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgdGhpY2tuZXNzOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKHRoaXM6IHZvaWQsIGlkOiBzdHJpbmcsIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUludGVycG9sYXRlZEdyYXBoOiBDcmVhdGVJbnRlcnBvbGF0ZWRHcmFwaEZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWRcbik6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yLCB0aGlja25lc3MpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYsIGNvbG9yLCB0aGlja25lc3MpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmKVxuICAgIHZhciBvcHRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBvcHRzLnNwbGljZSgwLCAwLCBudWxsKTtcbiAgICBvcHRzLnNwbGljZSgzLCAwLCB7IFwiaW50ZXJwb2xhdGVkXCI6IHRydWUgfSk7XG4gICAgcmV0dXJuIGNyZWF0ZUdyYXBoV2l0aE9wdGlvbnMuYXBwbHkoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIG9wdHMgYXMgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuUGFyYW1UeXBlc1xuICAgICk7XG4gICAgLy8gcmV0dXJuIGNyZWF0ZUludGVycG9sYXRlZEdyYXBoSW5Hcm91cC5hcHBseSh0aGlzLCBvcHRzKTtcbn07XG5cbnR5cGUgRHJhd0ludGVycG9sYXRlZEdyYXBoRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIHRoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIHRoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgICh0aGlzOiB2b2lkLCBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbik6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xufTtcbmV4cG9ydCBjb25zdCBkcmF3SW50ZXJwb2xhdGVkR3JhcGg6IERyYXdJbnRlcnBvbGF0ZWRHcmFwaEZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWRcbik6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIHRoaWNrbmVzcylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgY29sb3IsIHRoaWNrbmVzcylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmKVxuICAgIHZhciBvcHRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBvcHRzLnNwbGljZSgwLCAwLCBudWxsKTtcbiAgICBvcHRzLnNwbGljZSgwLCAwLCBudWxsKTtcbiAgICBvcHRzLnNwbGljZSgzLCAwLCB7IFwiaW50ZXJwb2xhdGVkXCI6IHRydWUgfSk7XG4gICAgcmV0dXJuIGNyZWF0ZUdyYXBoV2l0aE9wdGlvbnMuYXBwbHkoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIG9wdHMgYXMgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuUGFyYW1UeXBlc1xuICAgICk7XG59O1xuXG5leHBvcnQgY29uc3QgWHBlcmltZW50YWwgPSB7XG4gICAgbWFrZVNvdW5kUmVzb3VyY2U6IGZ1bmN0aW9uIChzb3VuZE5hbWU6IHN0cmluZywgdXJsOiBzdHJpbmcsIGF1ZGlvVHlwZTogXCJtcGVnXCIgfCBcIndhdlwiKTogdm9pZCB7XG4gICAgICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgKHNvdW5kTmFtZSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiRmlyc3QgYXJndW1lbnQgZm9yIG1ha2VTb3VuZFJlc291cmNlIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgc291bmROYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghc3ByaXRlR3JvdXBOYW1lRm9ybWF0SXNWYWxpZChzb3VuZE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlNvdW5kIG5hbWUgZ2l2ZW4gdG8gbWFrZVNvdW5kUmVzb3VyY2UgaXMgaW4gd3JvbmcgZm9ybWF0OiBcIiArIHNvdW5kTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3ByaXRlRXhpc3RzKHNvdW5kTmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwibWFrZVNvdW5kUmVzb3VyY2UgY2Fubm90IGNyZWF0ZSBzb3VuZCB3aXRoIGEgZHVwbGljYXRlIG5hbWUgb2Y6IFwiICsgc291bmROYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgKHVybCkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU2Vjb25kIGFyZ3VtZW50IGZvciBtYWtlU291bmRSZXNvdXJjZSBtdXN0IGJlIGEgU3RyaW5nLiBJbnN0ZWFkIGZvdW5kOiBcIiArIHVybCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGhyb3dhYmxlRXJyID0gbmV3IEVycm9yKFwiaW1hZ2UgZmlsZSBub3QgZm91bmQ6IFwiICsgdXJsKTtcbiAgICAgICAgY29uc3QgYXVkaW8gPSAkKFwiPGF1ZGlvLz5cIikuYXR0cihcImlkXCIsIHNvdW5kTmFtZSk7XG4gICAgICAgIGNvbnN0IHNvdXJjZSA9ICQoXCI8c291cmNlLz5cIikuYXR0cihcInR5cGVcIiwgXCJhdWRpby9cIiArIGF1ZGlvVHlwZSkuYXR0cihcInNyY1wiLCB1cmwpLm9uKFwiZXJyb3JcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCEhdGhyb3dhYmxlRXJyICYmIHRocm93YWJsZUVyci5zdGFjayAmJlxuICAgICAgICAgICAgICAgIHRocm93YWJsZUVyci5zdGFjay50b1N0cmluZygpLmluZGV4T2YoXCJteXByb2dyYW0uanNcIikgPj0gMCkge1xuICAgICAgICAgICAgICAgIHRocm93YWJsZUVyci5tZXNzYWdlID0gR1FHX0VSUk9SX0lOX01ZUFJPR1JBTV9NU0cgKyB0aHJvd2FibGVFcnIubWVzc2FnZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IHRocm93YWJsZUVycjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXVkaW8uYXBwZW5kKHNvdXJjZSk7XG4gICAgICAgICQoXCJib2R5XCIpLmFwcGVuZChhdWRpbyk7XG4gICAgfSxcbiAgICBwbGF5U291bmQ6IGZ1bmN0aW9uIChzb3VuZE5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc291bmROYW1lKTtcbiAgICAgICAgfVxuICAgICAgICAkKFwiI1wiICsgc291bmROYW1lKS5nZXQoMCkucGxheSgpO1xuICAgIH0sXG4gICAgcGF1c2VTb3VuZDogZnVuY3Rpb24gKHNvdW5kTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzb3VuZE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgICQoXCIjXCIgKyBzb3VuZE5hbWUpLmdldCgwKS5wYXVzZSgpO1xuICAgIH0sXG4gICAgcmVzZXRTb3VuZDogZnVuY3Rpb24gKHNvdW5kTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzb3VuZE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgICQoXCIjXCIgKyBzb3VuZE5hbWUpLmdldCgwKS5jdXJyZW50VGltZSA9IDA7XG4gICAgfSxcbiAgICByZXNldFNvdW5kVG86IGZ1bmN0aW9uIChzb3VuZE5hbWU6IHN0cmluZywgdGltZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzb3VuZE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgICQoXCIjXCIgKyBzb3VuZE5hbWUpLmdldCgwKS5jdXJyZW50VGltZSA9IHRpbWU7XG4gICAgfVxufVxuIl19