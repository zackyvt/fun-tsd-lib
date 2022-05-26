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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3FnLW1vZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9jaGVuZy9EZXNrdG9wL1RTLWRldi9mdW4tdHNkLWxpYi5naXRyZXBvL2xpYi1ncWd1YXJkcmFpbC9zcmMvZ3FnLW1vZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUE4QmIsa0RBQWtEO0FBQ2xELElBQUksU0FBUyxHQUFZLElBQUksQ0FBQztBQUM5QixNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsQ0FBQyxLQUFjLEVBQVEsRUFBRTtJQUNuRCxJQUFJLEtBQUssRUFBRTtRQUNQLFNBQVMsR0FBRyxJQUFJLENBQUM7S0FDcEI7U0FBTTtRQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEdBQUcsa0VBQWtFLENBQUMsQ0FBQztRQUMvRyxTQUFTLEdBQUcsS0FBSyxDQUFDO0tBQ3JCO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsTUFBTSxrQ0FBa0MsR0FBRyw2QkFBNkIsQ0FBQztBQUN6RSxNQUFNLENBQUMsTUFBTSw0QkFBNEIsR0FBRyxDQUN4QyxpQkFBa0MsRUFDM0IsRUFBRTtJQUNULElBQUksT0FBTyxpQkFBaUIsS0FBSyxRQUFRO1FBQ3JDLE9BQU8saUJBQWlCLEtBQUssUUFBUSxFQUFFO1FBQ3ZDLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBQ0QsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDakQsSUFBSSxXQUFXLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7SUFDOUUsV0FBVyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDMUIsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFFRCxPQUFPLENBQUMsaUJBQWlCLEtBQUssV0FB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QyxFQUFFLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDNUMsT0FBTyxzQkFBc0IsQ0FBQyxLQUFLLENBQy9CLElBQUksRUFDSixJQUEwQyxDQUM3QyxDQUFDO0lBQ0YsMkRBQTJEO0FBQy9ELENBQUMsQ0FBQztBQXdDRixNQUFNLENBQUMsTUFBTSxxQkFBcUIsR0FBNEI7SUFHMUQsNERBQTREO0lBQzVELGlEQUFpRDtJQUNqRCwwQ0FBMEM7SUFDMUMsc0NBQXNDO0lBQ3RDLDJCQUEyQjtJQUMzQixvQkFBb0I7SUFDcEIsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2pELElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDNUMsT0FBTyxzQkFBc0IsQ0FBQyxLQUFLLENBQy9CLElBQUksRUFDSixJQUEwQyxDQUM3QyxDQUFDO0FBQ04sQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG4vKlxuICogQ29weXJpZ2h0IDIwMTIsIDIwMTYsIDIwMTcsIDIwMTksIDIwMjAgQ2Fyc29uIENoZW5nXG4gKiBUaGlzIFNvdXJjZSBDb2RlIEZvcm0gaXMgc3ViamVjdCB0byB0aGUgdGVybXMgb2YgdGhlIE1vemlsbGEgUHVibGljXG4gKiBMaWNlbnNlLCB2LiAyLjAuIElmIGEgY29weSBvZiB0aGUgTVBMIHdhcyBub3QgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzXG4gKiBmaWxlLCBZb3UgY2FuIG9idGFpbiBvbmUgYXQgaHR0cHM6Ly9tb3ppbGxhLm9yZy9NUEwvMi4wLy5cbiAqL1xuLypcbiAqIEdRR3VhcmRyYWlsIHYwLjguMCBpcyBhIHdyYXBwZXIgYXJvdW5kIGdhbWVRdWVyeSByZXYuIDAuNy4xLlxuICogTWFrZXMgdGhpbmdzIG1vcmUgcHJvY2VkdXJhbCwgd2l0aCBhIGJpdCBvZiBmdW5jdGlvbmFsLlxuICogQWRkcyBpbiBoZWxwZnVsIGVycm9yIG1lc3NhZ2VzIGZvciBzdHVkZW50cy5cbiAqIGxvYWQgdGhpcyBhZnRlciBnYW1lUXVlcnkuXG4gKi9cblxuZXhwb3J0IHR5cGUgc3ByaXRlRG9tT2JqZWN0ID0ge1xuICAgIHdpZHRoOiAobjogbnVtYmVyKSA9PiBzcHJpdGVEb21PYmplY3Q7XG4gICAgaGVpZ2h0OiAobjogbnVtYmVyKSA9PiBzcHJpdGVEb21PYmplY3Q7XG4gICAgc2V0QW5pbWF0aW9uOiAobz86IG9iamVjdCwgZj86IEZ1bmN0aW9uKSA9PiBhbnk7XG4gICAgY3NzOiAoYXR0cjogc3RyaW5nLCB2YWw6IHN0cmluZyB8IG51bWJlcikgPT4gc3ByaXRlRG9tT2JqZWN0O1xuICAgIHBsYXlncm91bmQ6IChvOiBvYmplY3QpID0+IGFueTtcbiAgICBodG1sOiAoaHRtbFRleHQ6IHN0cmluZykgPT4gc3ByaXRlRG9tT2JqZWN0O1xuICAgIHRleHQ6ICh0ZXh0OiBzdHJpbmcpID0+IHNwcml0ZURvbU9iamVjdDtcbn07XG5kZWNsYXJlIHZhciAkOiBhbnk7XG5kZWNsYXJlIHZhciBDb29raWVzOiB7XG4gICAgc2V0OiAoYXJnMDogc3RyaW5nLCBhcmcxOiBvYmplY3QpID0+IHZvaWQ7XG4gICAgZ2V0SlNPTjogKGFyZzA6IHN0cmluZykgPT4gb2JqZWN0O1xuICAgIHJlbW92ZTogKGFyZzA6IHN0cmluZykgPT4gdm9pZDtcbn07XG5cbi8vIHN0dWRlbnRzIGFyZSBub3Qgc3VwcG9zZWQgdG8gdXNlIEdRR18gdmFyaWFibGVzXG5sZXQgR1FHX0RFQlVHOiBib29sZWFuID0gdHJ1ZTtcbmV4cG9ydCBjb25zdCBzZXRHcURlYnVnRmxhZyA9IChkZWJ1ZzogYm9vbGVhbik6IHZvaWQgPT4ge1xuICAgIGlmIChkZWJ1Zykge1xuICAgICAgICBHUUdfREVCVUcgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKEdRR19XQVJOSU5HX0lOX01ZUFJPR1JBTV9NU0cgKyBcImRlYnVnIG1vZGUgZGlzYWJsZWQgYW5kIHlvdXIgY29kZSBpcyBub3cgcnVubmluZyBpbiB1bnNhZmUgbW9kZS5cIik7XG4gICAgICAgIEdRR19ERUJVRyA9IGZhbHNlO1xuICAgIH1cbn07XG5cbmNvbnN0IEdRR19TUFJJVEVfR1JPVVBfTkFNRV9GT1JNQVRfUkVHRVggPSAvW2EtekEtWjAtOV9dK1thLXpBLVowLTlfLV0qLztcbmV4cG9ydCBjb25zdCBzcHJpdGVHcm91cE5hbWVGb3JtYXRJc1ZhbGlkID0gKFxuICAgIHNwcml0ZU9yR3JvdXBOYW1lOiBzdHJpbmcgfCBudW1iZXJcbik6IGJvb2xlYW4gPT4ge1xuICAgIGlmICh0eXBlb2Ygc3ByaXRlT3JHcm91cE5hbWUgIT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgdHlwZW9mIHNwcml0ZU9yR3JvdXBOYW1lICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgc3ByaXRlT3JHcm91cE5hbWUgPSBzcHJpdGVPckdyb3VwTmFtZS50b1N0cmluZygpO1xuICAgIGxldCBuYW1lTWF0Y2hlcyA9IHNwcml0ZU9yR3JvdXBOYW1lLm1hdGNoKEdRR19TUFJJVEVfR1JPVVBfTkFNRV9GT1JNQVRfUkVHRVgpO1xuICAgIG5hbWVNYXRjaGVzID0gKG5hbWVNYXRjaGVzID8gbmFtZU1hdGNoZXMgOiBbXSk7XG4gICAgaWYgKG5hbWVNYXRjaGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIChzcHJpdGVPckdyb3VwTmFtZSA9PT0gbmFtZU1hdGNoZXNbMF0pO1xufTtcblxuY29uc3QgR1FHX1NJR05BTFM6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+ID0ge307XG5sZXQgR1FHX1VOSVFVRV9JRF9DT1VOVEVSID0gMDtcblxubGV0IEdRR19QTEFZR1JPVU5EX1dJRFRIID0gNjQwO1xubGV0IEdRR19QTEFZR1JPVU5EX0hFSUdIVCA9IDQ4MDtcbmV4cG9ydCBsZXQgUExBWUdST1VORF9XSURUSCA9IEdRR19QTEFZR1JPVU5EX1dJRFRIOyAvLyBzdHVkZW50cyBhcmUgbm90IHN1cHBvc2VkIHRvIHVzZSBHUUdfIHZhcmlhYmxlc1xuZXhwb3J0IGxldCBQTEFZR1JPVU5EX0hFSUdIVCA9IEdRR19QTEFZR1JPVU5EX0hFSUdIVDtcblxuZXhwb3J0IGNvbnN0IEFOSU1BVElPTl9IT1JJWk9OVEFMOiBudW1iZXIgPSAkLmdRLkFOSU1BVElPTl9IT1JJWk9OVEFMO1xuZXhwb3J0IGNvbnN0IEFOSU1BVElPTl9WRVJUSUNBTDogbnVtYmVyID0gJC5nUS5BTklNQVRJT05fVkVSVElDQUw7XG5leHBvcnQgY29uc3QgQU5JTUFUSU9OX09OQ0U6IG51bWJlciA9ICQuZ1EuQU5JTUFUSU9OX09OQ0U7XG5leHBvcnQgY29uc3QgQU5JTUFUSU9OX1BJTkdQT05HOiBudW1iZXIgPSAkLmdRLkFOSU1BVElPTl9QSU5HUE9ORztcbmV4cG9ydCBjb25zdCBBTklNQVRJT05fQ0FMTEJBQ0s6IG51bWJlciA9ICQuZ1EuQU5JTUFUSU9OX0NBTExCQUNLO1xuZXhwb3J0IGNvbnN0IEFOSU1BVElPTl9NVUxUSTogbnVtYmVyID0gJC5nUS5BTklNQVRJT05fTVVMVEk7XG5cblxuLy8gTWF4L01pbiBTYWZlIFBsYXlncm91bmQgSW50ZWdlcnMgZm91bmQgYnkgZXhwZXJpbWVudGluZyB3aXRoIEdRIDAuNy4xIGluIEZpcmVmb3ggNDEuMC4yIG9uIE1hYyBPUyBYIDEwLjEwLjVcbmNvbnN0IEdRR19NSU5fU0FGRV9QTEFZR1JPVU5EX0lOVEVHRVIgPSAtKE1hdGgucG93KDIsIDI0KSAtIDEpOyAvLyBjZi4gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTnVtYmVyL01JTl9TQUZFX0lOVEVHRVJcbmNvbnN0IEdRR19NQVhfU0FGRV9QTEFZR1JPVU5EX0lOVEVHRVIgPSAoTWF0aC5wb3coMiwgMjQpIC0gMSk7IC8vIGNmLiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9OdW1iZXIvTUFYX1NBRkVfSU5URUdFUlxuXG5cbmNvbnN0IEdRR19nZXRVbmlxdWVJZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgIHJldHVybiBEYXRlLm5vdygpICsgXCJfXCIgKyBHUUdfVU5JUVVFX0lEX0NPVU5URVIrKztcbn07XG5cbmV4cG9ydCBjb25zdCBzZXRHcVBsYXlncm91bmREaW1lbnNpb25zID0gKFxuICAgIHdpZHRoOiBudW1iZXIsXG4gICAgaGVpZ2h0OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIC8vIHRoaXMgbXVzdCBiZSBleGVjdXRlZCBvdXRzaWRlIG9mIHNldHVwIGFuZCBkcmF3IGZ1bmN0aW9uc1xuICAgIEdRR19QTEFZR1JPVU5EX0hFSUdIVCA9IGhlaWdodDtcbiAgICBQTEFZR1JPVU5EX0hFSUdIVCA9IGhlaWdodDtcbiAgICBHUUdfUExBWUdST1VORF9XSURUSCA9IHdpZHRoO1xuICAgIFBMQVlHUk9VTkRfV0lEVEggPSB3aWR0aDtcbiAgICBzcHJpdGUoXCJwbGF5Z3JvdW5kXCIpLndpZHRoKHdpZHRoKS5oZWlnaHQoaGVpZ2h0KTtcbn07XG5cbmV4cG9ydCBjb25zdCBjdXJyZW50RGF0ZSA9ICgpOiBudW1iZXIgPT4ge1xuICAgIHJldHVybiBEYXRlLm5vdygpO1xufTtcblxuZXhwb3J0IGNvbnN0IGNvbnNvbGVQcmludCA9ICguLi50eHQ6IGFueSk6IHZvaWQgPT4ge1xuICAgIC8vIG1pZ2h0IHdvcmsgb25seSBpbiBDaHJvbWUgb3IgaWYgc29tZSBkZXZlbG9wbWVudCBhZGQtb25zIGFyZSBpbnN0YWxsZWRcbiAgICBjb25zb2xlLmxvZyguLi50eHQpO1xufTtcblxuXG5jb25zdCBHUUdfSU5fTVlQUk9HUkFNX01TRyA9ICdpbiBcIm15cHJvZ3JhbS50c1wiLSAnO1xuY29uc3QgR1FHX0VSUk9SX0lOX01ZUFJPR1JBTV9NU0cgPSBcIkVycm9yIFwiICsgR1FHX0lOX01ZUFJPR1JBTV9NU0c7XG5jb25zdCBHUUdfV0FSTklOR19JTl9NWVBST0dSQU1fTVNHID0gJ1dhcm5pbmcgJyArIEdRR19JTl9NWVBST0dSQU1fTVNHO1xuXG5jb25zdCBwcmludEVycm9yVG9Db25zb2xlT25jZSA9ICgoKSA9PiB7XG4gICAgdmFyIHRocm93Q29uc29sZUVycm9yX3ByaW50ZWQ6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+ID0ge307XG4gICAgcmV0dXJuIChtc2c6IHN0cmluZykgPT4ge1xuICAgICAgICAvLyBGaXJlZm94IHdvdWxkbid0IHByaW50IHVuY2F1Z2h0IGV4Y2VwdGlvbnMgd2l0aCBmaWxlIG5hbWUvbGluZSBudW1iZXJcbiAgICAgICAgLy8gYnV0IGFkZGluZyBcIm5ldyBFcnJvcigpXCIgdG8gdGhlIHRocm93IGJlbG93IGZpeGVkIGl0Li4uXG4gICAgICAgIGlmICghdGhyb3dDb25zb2xlRXJyb3JfcHJpbnRlZFttc2ddKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6IFwiICsgbXNnKTtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9yX3ByaW50ZWRbbXNnXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcbmNvbnN0IHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0gPSAobXNnOiBzdHJpbmcpOiBuZXZlciA9PiB7XG4gICAgLy8gRmlyZWZveCB3b3VsZG4ndCBwcmludCB1bmNhdWdodCBleGNlcHRpb25zIHdpdGggZmlsZSBuYW1lL2xpbmUgbnVtYmVyXG4gICAgLy8gYnV0IGFkZGluZyBcIm5ldyBFcnJvcigpXCIgdG8gdGhlIHRocm93IGJlbG93IGZpeGVkIGl0Li4uXG4gICAgdGhyb3cgbmV3IEVycm9yKEdRR19JTl9NWVBST0dSQU1fTVNHICsgbXNnKTtcbn07XG5cbmNvbnN0IHRocm93SWZTcHJpdGVOYW1lSW52YWxpZCA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBpZiAodHlwZW9mIHNwcml0ZU5hbWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlNwcml0ZSBuYW1lIG11c3QgYmUgYSBTdHJpbmcsIG5vdDogXCIgKyBzcHJpdGVOYW1lKTtcbiAgICB9IGVsc2UgaWYgKCFzcHJpdGVFeGlzdHMoc3ByaXRlTmFtZSkpIHtcbiAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlNwcml0ZSBkb2Vzbid0IGV4aXN0OiBcIiArIHNwcml0ZU5hbWUpO1xuICAgIH1cbn07XG5OdW1iZXIuaXNGaW5pdGUgPSBOdW1iZXIuaXNGaW5pdGUgfHwgZnVuY3Rpb24gKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgICAvLyBzZWU6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL051bWJlci9pc0Zpbml0ZVxuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGlzRmluaXRlKHZhbHVlKTtcbn07XG5jb25zdCB0aHJvd0lmTm90RmluaXRlTnVtYmVyID0gKG1zZzogc3RyaW5nLCB2YWw6IGFueSk6IHZvaWQgPT4geyAvLyBlLmcuIHRocm93IGlmIE5hTiwgSW5maW5pdHksIG51bGxcbiAgICBpZiAoIU51bWJlci5pc0Zpbml0ZSh2YWwpKSB7XG4gICAgICAgIG1zZyA9IG1zZyB8fCBcIkV4cGVjdGVkIGEgbnVtYmVyLlwiO1xuICAgICAgICBtc2cgKz0gXCIgWW91IHVzZWRcIjtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIG1zZyArPSBcIiB0aGUgU3RyaW5nOiBcXFwiXCIgKyB2YWwgKyBcIlxcXCJcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1zZyArPSBcIjogXCIgKyB2YWw7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShtc2cpO1xuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCB0aHJvd09uSW1nTG9hZEVycm9yID0gKGltZ1VybDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgLy8gd2hhdCB0aGlzIGZ1bmN0aW9uIHRocm93cyBtdXN0IG5vdCBiZSBjYXVnaHQgYnkgY2FsbGVyIHRoby4uLlxuICAgIGlmIChpbWdVcmwuc3Vic3RyaW5nKGltZ1VybC5sZW5ndGggLSBcIi5naWZcIi5sZW5ndGgpLnRvTG93ZXJDYXNlKCkgPT09IFwiLmdpZlwiKSB7XG4gICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJpbWFnZSBmaWxlIGZvcm1hdCBub3Qgc3VwcG9ydGVkOiBHSUZcIik7XG4gICAgfVxuICAgIGxldCB0aHJvd2FibGVFcnIgPSBuZXcgRXJyb3IoXCJpbWFnZSBmaWxlIG5vdCBmb3VuZDogXCIgKyBpbWdVcmwpO1xuICAgICQoXCI8aW1nLz5cIikub24oXCJlcnJvclwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghIXRocm93YWJsZUVyciAmJiB0aHJvd2FibGVFcnIuc3RhY2sgJiZcbiAgICAgICAgICAgIHRocm93YWJsZUVyci5zdGFjay50b1N0cmluZygpLmluZGV4T2YoXCJteXByb2dyYW0uanNcIikgPj0gMCkge1xuICAgICAgICAgICAgdGhyb3dhYmxlRXJyLm1lc3NhZ2UgPSBHUUdfRVJST1JfSU5fTVlQUk9HUkFNX01TRyArIHRocm93YWJsZUVyci5tZXNzYWdlO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IHRocm93YWJsZUVycjtcbiAgICB9KS5hdHRyKFwic3JjXCIsIGltZ1VybCk7XG59O1xuXG5cblxudHlwZSBOZXdHUUFuaW1hdGlvbkZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgdXJsT3JNYXA6IHN0cmluZyxcbiAgICAgICAgbnVtYmVyT2ZGcmFtZTogbnVtYmVyLFxuICAgICAgICBkZWx0YTogbnVtYmVyLFxuICAgICAgICByYXRlOiBudW1iZXIsXG4gICAgICAgIHR5cGU6IG51bWJlclxuICAgICk6IFNwcml0ZUFuaW1hdGlvbjtcbiAgICAodGhpczogdm9pZCwgdXJsT3JNYXA6IHN0cmluZyk6IFNwcml0ZUFuaW1hdGlvbjtcbiAgICAodGhpczogdm9pZCwgdXJsT3JNYXA6IG9iamVjdCk6IFNwcml0ZUFuaW1hdGlvbjtcbn07XG5leHBvcnQgY29uc3QgbmV3R1FBbmltYXRpb246IE5ld0dRQW5pbWF0aW9uRm4gPSAoKCkgPT4ge1xuICAgIGxldCBtZW1vQW5pbXM6IE1hcDxzdHJpbmcgfCBvYmplY3QsIFNwcml0ZUFuaW1hdGlvbj4gPSBuZXcgTWFwPG9iamVjdCwgU3ByaXRlQW5pbWF0aW9uPigpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIHVybE9yTWFwOiBzdHJpbmcgfCBvYmplY3QsXG4gICAgICAgIG51bWJlck9mRnJhbWU/OiBudW1iZXIsXG4gICAgICAgIGRlbHRhPzogbnVtYmVyLFxuICAgICAgICByYXRlPzogbnVtYmVyLFxuICAgICAgICB0eXBlPzogbnVtYmVyXG4gICAgKTogU3ByaXRlQW5pbWF0aW9uIHtcbiAgICAgICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDUpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mICh1cmxPck1hcCkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIkZpcnN0IGFyZ3VtZW50IGZvciBuZXdHUUFuaW1hdGlvbiBtdXN0IGJlIGEgU3RyaW5nLiBJbnN0ZWFkIGZvdW5kOiBcIiArIHVybE9yTWFwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB1cmxPck1hcCA9PT0gXCJzdHJpbmdcIikgdGhyb3dPbkltZ0xvYWRFcnJvcih1cmxPck1hcCk7XG4gICAgICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIk51bWJlciBvZiBmcmFtZSBhcmd1bWVudCBmb3IgbmV3R1FBbmltYXRpb24gbXVzdCBiZSBudW1lcmljLiBcIiwgbnVtYmVyT2ZGcmFtZSk7XG4gICAgICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkRlbHRhIGFyZ3VtZW50IGZvciBuZXdHUUFuaW1hdGlvbiBtdXN0IGJlIG51bWVyaWMuIFwiLCBkZWx0YSk7XG4gICAgICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlJhdGUgYXJndW1lbnQgZm9yIG5ld0dRQW5pbWF0aW9uIG11c3QgYmUgbnVtZXJpYy4gXCIsIHJhdGUpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlICE9IG51bGwgJiYgKHR5cGUgJiBBTklNQVRJT05fVkVSVElDQUwpICYmICh0eXBlICYgQU5JTUFUSU9OX0hPUklaT05UQUwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJUeXBlIGFyZ3VtZW50IGZvciBuZXdHUUFuaW1hdGlvbiBjYW5ub3QgYmUgYm90aCBBTklNQVRJT05fVkVSVElDQUwgYW5kIEFOSU1BVElPTl9IT1JJWk9OVEFMIC0gdXNlIG9uZSBvciB0aGUgb3RoZXIgYnV0IG5vdCBib3RoIVwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgIT0gbnVsbCAmJiAhKHR5cGUgJiBBTklNQVRJT05fVkVSVElDQUwpICYmICEodHlwZSAmIEFOSU1BVElPTl9IT1JJWk9OVEFMKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiVHlwZSBhcmd1bWVudCBmb3IgbmV3R1FBbmltYXRpb24gaXMgbWlzc2luZyBib3RoIEFOSU1BVElPTl9WRVJUSUNBTCBhbmQgQU5JTUFUSU9OX0hPUklaT05UQUwgLSBtdXN0IHVzZSBvbmUgb3IgdGhlIG90aGVyIVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mICh1cmxPck1hcCkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3dPbkltZ0xvYWRFcnJvcih1cmxPck1hcCk7XG4gICAgICAgICAgICAgICAgfSAvLyBlbHNlIGhvcGUgaXQncyBhIHByb3BlciBvcHRpb25zIG1hcCB0byBwYXNzIG9uIHRvIEdhbWVRdWVyeSBkaXJlY3RseVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50cyB1c2VkIGZvciBuZXdHUUFuaW1hdGlvbi4gQ2hlY2sgQVBJIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMgb2YgcGFyYW1ldGVycy5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA1KSB7XG4gICAgICAgICAgICBsZXQga2V5ID0gW3VybE9yTWFwLCBudW1iZXJPZkZyYW1lLCBkZWx0YSwgcmF0ZSwgdHlwZV07XG4gICAgICAgICAgICBsZXQgbXVsdGlmcmFtZUFuaW06IFNwcml0ZUFuaW1hdGlvbiB8IHVuZGVmaW5lZCA9IG1lbW9Bbmltcy5nZXQoa2V5KTtcbiAgICAgICAgICAgIGlmIChtdWx0aWZyYW1lQW5pbSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG11bHRpZnJhbWVBbmltO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgbXVsdGlmcmFtZUFuaW06IFNwcml0ZUFuaW1hdGlvbiA9IG5ldyAkLmdRLkFuaW1hdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGltYWdlVVJMOiB1cmxPck1hcCxcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZTogbnVtYmVyT2ZGcmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZGVsdGE6IGRlbHRhLFxuICAgICAgICAgICAgICAgICAgICByYXRlOiByYXRlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiB0eXBlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbWVtb0FuaW1zLnNldChrZXksIG11bHRpZnJhbWVBbmltKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbXVsdGlmcmFtZUFuaW07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgbGV0IHNpbmdsZWZyYW1lQW5pbTogU3ByaXRlQW5pbWF0aW9uIHwgdW5kZWZpbmVkID0gbWVtb0FuaW1zLmdldCh1cmxPck1hcCk7XG4gICAgICAgICAgICBpZiAoc2luZ2xlZnJhbWVBbmltICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2luZ2xlZnJhbWVBbmltO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgc2luZ2xlZnJhbWVBbmltOiBTcHJpdGVBbmltYXRpb247XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAodXJsT3JNYXApID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHNpbmdsZWZyYW1lQW5pbSA9IG5ldyAkLmdRLkFuaW1hdGlvbih7IGltYWdlVVJMOiB1cmxPck1hcCB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzaW5nbGVmcmFtZUFuaW0gPSBuZXcgJC5nUS5BbmltYXRpb24odXJsT3JNYXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtZW1vQW5pbXMuc2V0KHVybE9yTWFwLCBzaW5nbGVmcmFtZUFuaW0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBzaW5nbGVmcmFtZUFuaW07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50cyB1c2VkIGZvciBuZXdHUUFuaW1hdGlvbi4gQ2hlY2sgQVBJIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMgb2YgcGFyYW1ldGVycy5cIik7XG4gICAgICAgICAgICByZXR1cm4gbmV3ICQuZ1EuQW5pbWF0aW9uKHsgaW1hZ2VVUkw6IFwiXCIgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxudHlwZSBDcmVhdGVHcm91cEluUGxheWdyb3VuZEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyLFxuICAgICAgICB0aGVQb3N4OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3k6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKHRoaXM6IHZvaWQsIGdyb3VwTmFtZTogc3RyaW5nLCB0aGVXaWR0aDogbnVtYmVyLCB0aGVIZWlnaHQ6IG51bWJlcik6IHZvaWQ7XG4gICAgKHRoaXM6IHZvaWQsIGdyb3VwTmFtZTogc3RyaW5nKTogdm9pZDtcbiAgICAodGhpczogdm9pZCwgZ3JvdXBOYW1lOiBzdHJpbmcsIG9wdE1hcDogb2JqZWN0KTogdm9pZDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlR3JvdXBJblBsYXlncm91bmQ6IENyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICB0aGVXaWR0aD86IG51bWJlciB8IG9iamVjdCxcbiAgICB0aGVIZWlnaHQ/OiBudW1iZXIsXG4gICAgdGhlUG9zeD86IG51bWJlcixcbiAgICB0aGVQb3N5PzogbnVtYmVyXG4pOiB2b2lkIHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIGlmICh0eXBlb2YgKGdyb3VwTmFtZSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJGaXJzdCBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBhIFN0cmluZy4gSW5zdGVhZCBmb3VuZDogXCIgKyBncm91cE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc3ByaXRlR3JvdXBOYW1lRm9ybWF0SXNWYWxpZChncm91cE5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiR3JvdXAgbmFtZSBnaXZlbiB0byBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBpcyBpbiB3cm9uZyBmb3JtYXQ6IFwiICsgZ3JvdXBOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3ByaXRlRXhpc3RzKGdyb3VwTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJjcmVhdGVHcm91cEluUGxheWdyb3VuZCBjYW5ub3QgY3JlYXRlIGR1cGxpY2F0ZSBncm91cCB3aXRoIG5hbWU6IFwiICsgZ3JvdXBOYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiV2lkdGggYXJndW1lbnQgZm9yIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZVdpZHRoKTtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJIZWlnaHQgYXJndW1lbnQgZm9yIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZUhlaWdodCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIldpZHRoIGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVXaWR0aCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiSGVpZ2h0IGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVIZWlnaHQpO1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlggbG9jYXRpb24gYXJndW1lbnQgZm9yIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZVBvc3gpO1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlkgbG9jYXRpb24gYXJndW1lbnQgZm9yIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZVBvc3kpO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHsgLy8gdHJlYXRzIGFyZ3VtZW50c1sxXSBhcyBhIHN0YW5kYXJkIG9wdGlvbnMgbWFwXG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1sxXSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTZWNvbmQgYXJndW1lbnQgZm9yIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIGV4cGVjdGVkIHRvIGJlIGEgZGljdGlvbmFyeS4gSW5zdGVhZCBmb3VuZDogXCIgKyBhcmd1bWVudHNbMV0pO1xuICAgICAgICAgICAgfSAvLyBlbHNlIGhvcGUgaXQncyBhIHByb3BlciBzdGFuZGFyZCBvcHRpb25zIG1hcFxuICAgICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIHVzZWQgZm9yIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kLiBDaGVjayBBUEkgZG9jdW1lbnRhdGlvbiBmb3IgZGV0YWlscyBvZiBwYXJhbWV0ZXJzLlwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICQucGxheWdyb3VuZCgpLmFkZEdyb3VwKFxuICAgICAgICAgICAgZ3JvdXBOYW1lLFxuICAgICAgICAgICAgeyB3aWR0aDogJC5wbGF5Z3JvdW5kKCkud2lkdGgoKSwgaGVpZ2h0OiAkLnBsYXlncm91bmQoKS5oZWlnaHQoKSB9XG4gICAgICAgICk7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhlV2lkdGggIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJ0aGVXaWR0aCBtdXN0IGJlIGEgbnVtYmVyIGJ1dCBpbnN0ZWFkIGdvdDogXCIgKyB0aGVXaWR0aCk7XG4gICAgICAgIH1cbiAgICAgICAgJC5wbGF5Z3JvdW5kKCkuYWRkR3JvdXAoZ3JvdXBOYW1lLCB7IHdpZHRoOiB0aGVXaWR0aCwgaGVpZ2h0OiB0aGVIZWlnaHQgfSk7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA1KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhlV2lkdGggIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJ0aGVXaWR0aCBtdXN0IGJlIGEgbnVtYmVyIGJ1dCBpbnN0ZWFkIGdvdDogXCIgKyB0aGVXaWR0aCk7XG4gICAgICAgIH1cbiAgICAgICAgJC5wbGF5Z3JvdW5kKCkuYWRkR3JvdXAoXG4gICAgICAgICAgICBncm91cE5hbWUsXG4gICAgICAgICAgICB7IHdpZHRoOiB0aGVXaWR0aCwgaGVpZ2h0OiB0aGVIZWlnaHQsIHBvc3g6IHRoZVBvc3gsIHBvc3k6IHRoZVBvc3kgfVxuICAgICAgICApO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgeyAvLyB0cmVhdHMgYXJndW1lbnRzWzFdIGFzIGEgc3RhbmRhcmQgb3B0aW9ucyBtYXBcbiAgICAgICAgaWYgKHR5cGVvZiB0aGVXaWR0aCAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlNlY29uZCBhcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyIGJ1dCBpbnN0ZWFkIGdvdDogXCIgKyB0aGVXaWR0aCk7XG4gICAgICAgIH1cbiAgICAgICAgJC5wbGF5Z3JvdW5kKCkuYWRkR3JvdXAoZ3JvdXBOYW1lLCBhcmd1bWVudHNbMV0pO1xuICAgIH1cbn07XG5cbmV4cG9ydCB0eXBlIFNwcml0ZUFuaW1hdGlvbiA9IHsgaW1hZ2VVUkw6IHN0cmluZyB9O1xudHlwZSBDcmVhdGVTcHJpdGVJbkdyb3VwRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVBbmltYXRpb246IFNwcml0ZUFuaW1hdGlvbixcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3g6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeTogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHRoZUFuaW1hdGlvbjogU3ByaXRlQW5pbWF0aW9uLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgICAgICBvcHRpb25zTWFwOiBvYmplY3RcbiAgICApOiB2b2lkO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVTcHJpdGVJbkdyb3VwOiBDcmVhdGVTcHJpdGVJbkdyb3VwRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgdGhlQW5pbWF0aW9uOiBTcHJpdGVBbmltYXRpb24gfCBvYmplY3QsXG4gICAgdGhlV2lkdGg/OiBudW1iZXIsXG4gICAgdGhlSGVpZ2h0PzogbnVtYmVyLFxuICAgIHRoZVBvc3g/OiBudW1iZXIsXG4gICAgdGhlUG9zeT86IG51bWJlclxuKTogdm9pZCB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICBpZiAodHlwZW9mIChncm91cE5hbWUpICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiRmlyc3QgYXJndW1lbnQgZm9yIGNyZWF0ZVNwcml0ZUluR3JvdXAgbXVzdCBiZSBhIFN0cmluZy4gSW5zdGVhZCBmb3VuZDogXCIgKyBncm91cE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc3ByaXRlRXhpc3RzKGdyb3VwTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJjcmVhdGVTcHJpdGVJbkdyb3VwIGNhbm5vdCBmaW5kIGdyb3VwIChkb2Vzbid0IGV4aXN0Pyk6IFwiICsgZ3JvdXBOYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgKHNwcml0ZU5hbWUpICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU2Vjb25kIGFyZ3VtZW50IGZvciBjcmVhdGVTcHJpdGVJbkdyb3VwIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgc3ByaXRlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzcHJpdGVHcm91cE5hbWVGb3JtYXRJc1ZhbGlkKHNwcml0ZU5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU3ByaXRlIG5hbWUgZ2l2ZW4gdG8gY3JlYXRlU3ByaXRlSW5Hcm91cCBpcyBpbiB3cm9uZyBmb3JtYXQ6IFwiICsgc3ByaXRlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNwcml0ZUV4aXN0cyhzcHJpdGVOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcImNyZWF0ZVNwcml0ZUluR3JvdXAgY2Fubm90IGNyZWF0ZSBkdXBsaWNhdGUgc3ByaXRlIHdpdGggbmFtZTogXCIgKyBzcHJpdGVOYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA1IHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgKHRoZUFuaW1hdGlvbikgIT09IFwib2JqZWN0XCIgfHwgKHRoZUFuaW1hdGlvbiBpbnN0YW5jZW9mIE9iamVjdFxuICAgICAgICAgICAgICAgICYmICghKFwiaW1hZ2VVUkxcIiBpbiB0aGVBbmltYXRpb24pIHx8IHR5cGVvZiAodGhlQW5pbWF0aW9uW1wiaW1hZ2VVUkxcIl0pICE9PSBcInN0cmluZ1wiKSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiY3JlYXRlU3ByaXRlSW5Hcm91cCBjYW5ub3QgdXNlIHRoaXMgYXMgYW4gYW5pbWF0aW9uOiBcIiArIHRoZUFuaW1hdGlvblxuICAgICAgICAgICAgICAgICAgICArIFwiXFxuQW5pbWF0aW9uIG11c3QgYmUgb2YgdHlwZSBTcHJpdGVBbmltYXRpb24gYnV0IHlvdSBwcm92aWRlZCBhOiBcIiArIHR5cGVvZiAodGhlQW5pbWF0aW9uKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiV2lkdGggYXJndW1lbnQgZm9yIGNyZWF0ZVNwcml0ZUluR3JvdXAgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlV2lkdGgpO1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkhlaWdodCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVIZWlnaHQpO1xuXG5cbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA3KSB7XG4gICAgICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlggbG9jYXRpb24gYXJndW1lbnQgZm9yIGNyZWF0ZVNwcml0ZUluR3JvdXAgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlUG9zeCk7XG4gICAgICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlkgbG9jYXRpb24gYXJndW1lbnQgZm9yIGNyZWF0ZVNwcml0ZUluR3JvdXAgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlUG9zeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMl0gIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiVGhpcmQgYXJndW1lbnQgZm9yIGNyZWF0ZVNwcml0ZUluR3JvdXAgZXhwZWN0ZWQgdG8gYmUgYSBkaWN0aW9uYXJ5LiBJbnN0ZWFkIGZvdW5kOiBcIiArIGFyZ3VtZW50c1syXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoZUFuaW1hdGlvbiBpbnN0YW5jZW9mIE9iamVjdCAmJiBcImltYWdlVVJMXCIgaW4gdGhlQW5pbWF0aW9uICYmIHR5cGVvZiB0aGVBbmltYXRpb25bXCJpbWFnZVVSTFwiXSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJUaGlyZCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBleHBlY3RlZCB0byBiZSBhIGRpY3Rpb25hcnkuIEluc3RlYWQgZm91bmQgdGhpcyBhbmltYXRpb246IFwiICsgdGhlQW5pbWF0aW9uICsgXCIgd2l0aCBpbWFnZVVSTDogXCIgKyB0aGVBbmltYXRpb25bXCJpbWFnZVVSTFwiXSArIFwiLiBNYXliZSB3cm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIHByb3ZpZGVkPyBDaGVjayBBUEkgZG9jdW1lbnRhdGlvbiBmb3IgZGV0YWlscyBvZiBwYXJhbWV0ZXJzLlwiKTtcbiAgICAgICAgICAgIH0gLy8gZWxzZSBob3BlIGl0J3MgYSBwcm9wZXIgc3RhbmRhcmQgb3B0aW9ucyBtYXBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIHVzZWQgZm9yIGNyZWF0ZVNwcml0ZUluR3JvdXAuIENoZWNrIEFQSSBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzIG9mIHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDUpIHtcbiAgICAgICAgJChcIiNcIiArIGdyb3VwTmFtZSkuYWRkU3ByaXRlKFxuICAgICAgICAgICAgc3ByaXRlTmFtZSxcbiAgICAgICAgICAgIHsgYW5pbWF0aW9uOiB0aGVBbmltYXRpb24sIHdpZHRoOiB0aGVXaWR0aCwgaGVpZ2h0OiB0aGVIZWlnaHQgfVxuICAgICAgICApO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNykge1xuICAgICAgICAkKFwiI1wiICsgZ3JvdXBOYW1lKS5hZGRTcHJpdGUoXG4gICAgICAgICAgICBzcHJpdGVOYW1lLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogdGhlQW5pbWF0aW9uLFxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGVXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoZUhlaWdodCxcbiAgICAgICAgICAgICAgICBwb3N4OiB0aGVQb3N4LFxuICAgICAgICAgICAgICAgIHBvc3k6IHRoZVBvc3lcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHsgLy8gdHJlYXRzIGFyZ3VtZW50c1syXSBhcyBhIHN0YW5kYXJkIG9wdGlvbnMgbWFwXG4gICAgICAgICQoXCIjXCIgKyBncm91cE5hbWUpLmFkZFNwcml0ZShzcHJpdGVOYW1lLCBhcmd1bWVudHNbMl0pO1xuICAgIH1cbn07XG5cbnR5cGUgQ3JlYXRlVGV4dFNwcml0ZUluR3JvdXBGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyLFxuICAgICAgICB0aGVQb3N4OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3k6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlclxuICAgICk6IHZvaWQ7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwOiBDcmVhdGVUZXh0U3ByaXRlSW5Hcm91cEZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgdGhlUG9zeD86IG51bWJlcixcbiAgICB0aGVQb3N5PzogbnVtYmVyXG4pOiB2b2lkIHtcbiAgICAvLyB0byBiZSB1c2VkIGxpa2Ugc3ByaXRlKFwidGV4dEJveFwiKS50ZXh0KFwiaGlcIik7IC8vIG9yIC5odG1sKFwiPGI+aGk8L2I+XCIpO1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiAoZ3JvdXBOYW1lKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIkZpcnN0IGFyZ3VtZW50IGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBtdXN0IGJlIGEgU3RyaW5nLiBJbnN0ZWFkIGZvdW5kOiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzcHJpdGVFeGlzdHMoZ3JvdXBOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcImNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwIGNhbm5vdCBmaW5kIGdyb3VwIChkb2Vzbid0IGV4aXN0Pyk6IFwiICsgZ3JvdXBOYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgKHNwcml0ZU5hbWUpICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU2Vjb25kIGFyZ3VtZW50IGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBtdXN0IGJlIGEgU3RyaW5nLiBJbnN0ZWFkIGZvdW5kOiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc3ByaXRlR3JvdXBOYW1lRm9ybWF0SXNWYWxpZChzcHJpdGVOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlNwcml0ZSBuYW1lIGdpdmVuIHRvIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwIGlzIGluIHdyb25nIGZvcm1hdDogXCIgKyBzcHJpdGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3ByaXRlRXhpc3RzKHNwcml0ZU5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgY2Fubm90IGNyZWF0ZSBkdXBsaWNhdGUgc3ByaXRlIHdpdGggbmFtZTogXCIgKyBzcHJpdGVOYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA0IHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDYpIHtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBhcmd1bWVudCBmb3IgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlV2lkdGgpO1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkhlaWdodCBhcmd1bWVudCBmb3IgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlSGVpZ2h0KTtcblxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDYpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWCBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlUG9zeCk7XG4gICAgICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlkgbG9jYXRpb24gYXJndW1lbnQgZm9yIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZVBvc3kpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIldyb25nIG51bWJlciBvZiBhcmd1bWVudHMgdXNlZCBmb3IgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAuIENoZWNrIEFQSSBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzIG9mIHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDQpIHtcbiAgICAgICAgJChcIiNcIiArIGdyb3VwTmFtZSkuYWRkU3ByaXRlKHNwcml0ZU5hbWUsIHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGVXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogdGhlSGVpZ2h0XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNikge1xuICAgICAgICAkKFwiI1wiICsgZ3JvdXBOYW1lKS5hZGRTcHJpdGUoc3ByaXRlTmFtZSwge1xuICAgICAgICAgICAgd2lkdGg6IHRoZVdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGVIZWlnaHQsXG4gICAgICAgICAgICBwb3N4OiB0aGVQb3N4LFxuICAgICAgICAgICAgcG9zeTogdGhlUG9zeVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDQgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gNikge1xuICAgICAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkuY3NzKFwiYmFja2dyb3VuZC1jb2xvclwiLCBcIndoaXRlXCIpIC8vIGRlZmF1bHQgdG8gd2hpdGUgYmFja2dyb3VuZCBmb3IgZWFzZSBvZiB1c2VcbiAgICAgICAgICAgIC5jc3MoXCJ1c2VyLXNlbGVjdFwiLCBcIm5vbmVcIik7XG4gICAgfVxufTtcblxuY29uc3QgdGV4dElucHV0U3ByaXRlVGV4dEFyZWFJZCA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIHJldHVybiBzcHJpdGVOYW1lICsgXCItdGV4dGFyZWFcIjtcbn07XG5jb25zdCB0ZXh0SW5wdXRTcHJpdGVTdWJtaXRCdXR0b25JZCA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIHJldHVybiBzcHJpdGVOYW1lICsgXCItYnV0dG9uXCI7XG59O1xuY29uc3QgdGV4dElucHV0U3ByaXRlR1FHX1NJR05BTFNfSWQgPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICByZXR1cm4gc3ByaXRlTmFtZSArIFwiLXN1Ym1pdHRlZFwiO1xufTtcbnR5cGUgQ3JlYXRlVGV4dElucHV0U3ByaXRlSW5Hcm91cEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHJvd3M6IG51bWJlcixcbiAgICAgICAgY29sczogbnVtYmVyLFxuICAgICAgICB0aGVQb3N4OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3k6IG51bWJlcixcbiAgICAgICAgc3VibWl0SGFuZGxlcjogU3VibWl0SGFuZGxlckZuXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyLFxuICAgICAgICByb3dzOiBudW1iZXIsXG4gICAgICAgIGNvbHM6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeDogbnVtYmVyLFxuICAgICAgICB0aGVQb3N5OiBudW1iZXJcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHJvd3M6IG51bWJlcixcbiAgICAgICAgY29sczogbnVtYmVyXG4gICAgKTogdm9pZDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlVGV4dElucHV0U3ByaXRlSW5Hcm91cDogQ3JlYXRlVGV4dElucHV0U3ByaXRlSW5Hcm91cEZuID1cbiAgICBmdW5jdGlvbiAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyLFxuICAgICAgICByb3dzOiBudW1iZXIsXG4gICAgICAgIGNvbHM6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeD86IG51bWJlcixcbiAgICAgICAgdGhlUG9zeT86IG51bWJlcixcbiAgICAgICAgc3VibWl0SGFuZGxlcj86IFN1Ym1pdEhhbmRsZXJGblxuICAgICk6IHZvaWQge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNikge1xuICAgICAgICAgICAgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAoZ3JvdXBOYW1lLCBzcHJpdGVOYW1lLCB0aGVXaWR0aCwgdGhlSGVpZ2h0KTtcbiAgICAgICAgfSBlbHNlIGlmICgoYXJndW1lbnRzLmxlbmd0aCA9PT0gOCB8fCBhcmd1bWVudHMubGVuZ3RoID09PSA5KSAmJiB0aGVQb3N4ICYmXG4gICAgICAgICAgICB0aGVQb3N5KSB7XG4gICAgICAgICAgICBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cChcbiAgICAgICAgICAgICAgICBncm91cE5hbWUsXG4gICAgICAgICAgICAgICAgc3ByaXRlTmFtZSxcbiAgICAgICAgICAgICAgICB0aGVXaWR0aCxcbiAgICAgICAgICAgICAgICB0aGVIZWlnaHQsXG4gICAgICAgICAgICAgICAgdGhlUG9zeCxcbiAgICAgICAgICAgICAgICB0aGVQb3N5XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA2IHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDggfHxcbiAgICAgICAgICAgIGFyZ3VtZW50cy5sZW5ndGggPT09IDkpIHtcbiAgICAgICAgICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIFwid2hpdGVcIik7IC8vIGRlZmF1bHQgdG8gd2hpdGUgYmFja2dyb3VuZCBmb3IgZWFzZSBvZiB1c2VcblxuICAgICAgICAgICAgdmFyIHRleHRhcmVhSHRtbCA9ICc8dGV4dGFyZWEgaWQ9XCInICtcbiAgICAgICAgICAgICAgICB0ZXh0SW5wdXRTcHJpdGVUZXh0QXJlYUlkKHNwcml0ZU5hbWUpICsgJ1wiIHJvd3M9XCInICsgcm93cyArXG4gICAgICAgICAgICAgICAgJ1wiIGNvbHM9XCInICsgY29scyArICdcIj5oaTwvdGV4dGFyZWE+JztcbiAgICAgICAgICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5hcHBlbmQodGV4dGFyZWFIdG1sKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbklkID0gdGV4dElucHV0U3ByaXRlU3VibWl0QnV0dG9uSWQoc3ByaXRlTmFtZSk7XG4gICAgICAgICAgICB2YXIgYnV0dG9uSHRtbCA9ICc8YnV0dG9uIGlkPVwiJyArIGJ1dHRvbklkICtcbiAgICAgICAgICAgICAgICAnXCIgdHlwZT1cImJ1dHRvblwiPlN1Ym1pdDwvYnV0dG9uPic7XG4gICAgICAgICAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkuYXBwZW5kKGJ1dHRvbkh0bWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDkpIHtcbiAgICAgICAgICAgIHRleHRJbnB1dFNwcml0ZVNldEhhbmRsZXIoc3ByaXRlTmFtZSwgc3VibWl0SGFuZGxlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0ZXh0SW5wdXRTcHJpdGVTZXRIYW5kbGVyKHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgfTtcbmV4cG9ydCB0eXBlIFN1Ym1pdEhhbmRsZXJGbiA9IChzOiBzdHJpbmcpID0+IHZvaWQ7XG5leHBvcnQgY29uc3QgdGV4dElucHV0U3ByaXRlU2V0SGFuZGxlciA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICBzdWJtaXRIYW5kbGVyPzogU3VibWl0SGFuZGxlckZuXG4pOiB2b2lkIHtcbiAgICB2YXIgcmVhbFN1Ym1pdEhhbmRsZXI7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgcmVhbFN1Ym1pdEhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoc3VibWl0SGFuZGxlcikgc3VibWl0SGFuZGxlcih0ZXh0SW5wdXRTcHJpdGVTdHJpbmcoc3ByaXRlTmFtZSkpO1xuICAgICAgICAgICAgR1FHX1NJR05BTFNbdGV4dElucHV0U3ByaXRlR1FHX1NJR05BTFNfSWQoc3ByaXRlTmFtZSldID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZWFsU3VibWl0SGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIEdRR19TSUdOQUxTW3RleHRJbnB1dFNwcml0ZUdRR19TSUdOQUxTX0lkKHNwcml0ZU5hbWUpXSA9IHRydWU7XG4gICAgICAgIH07XG4gICAgfVxuICAgICQoXCIjXCIgKyB0ZXh0SW5wdXRTcHJpdGVTdWJtaXRCdXR0b25JZChzcHJpdGVOYW1lKSkuY2xpY2socmVhbFN1Ym1pdEhhbmRsZXIpO1xufTtcblxuZXhwb3J0IGNvbnN0IHRleHRJbnB1dFNwcml0ZVN0cmluZyA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIHJldHVybiBTdHJpbmcoJChcIiNcIiArIHRleHRJbnB1dFNwcml0ZVRleHRBcmVhSWQoc3ByaXRlTmFtZSkpWzBdLnZhbHVlKTtcbn07XG5leHBvcnQgY29uc3QgdGV4dElucHV0U3ByaXRlU2V0U3RyaW5nID0gKFxuICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICBzdHI6IHN0cmluZ1xuKTogdm9pZCA9PiB7XG4gICAgJChcIiNcIiArIHRleHRJbnB1dFNwcml0ZVRleHRBcmVhSWQoc3ByaXRlTmFtZSkpWzBdLnZhbHVlID0gc3RyO1xufTtcblxuZXhwb3J0IGNvbnN0IHRleHRJbnB1dFNwcml0ZVJlc2V0ID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHRleHRQcm9tcHQ/OiBzdHJpbmdcbikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHRleHRJbnB1dFNwcml0ZVNldFN0cmluZyhzcHJpdGVOYW1lLCBcIlwiKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIgJiYgdGV4dFByb21wdCkge1xuICAgICAgICB0ZXh0SW5wdXRTcHJpdGVTZXRTdHJpbmcoc3ByaXRlTmFtZSwgdGV4dFByb21wdCk7XG4gICAgfVxuICAgIEdRR19TSUdOQUxTW3RleHRJbnB1dFNwcml0ZUdRR19TSUdOQUxTX0lkKHNwcml0ZU5hbWUpXSA9IGZhbHNlO1xufTtcblxuZXhwb3J0IGNvbnN0IHRleHRJbnB1dFNwcml0ZVN1Ym1pdHRlZCA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICBpZiAoR1FHX1NJR05BTFNbdGV4dElucHV0U3ByaXRlR1FHX1NJR05BTFNfSWQoc3ByaXRlTmFtZSldID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlU3ByaXRlID0gKHNwcml0ZU5hbWVPck9iajogc3RyaW5nIHwgb2JqZWN0KTogdm9pZCA9PiB7XG4gICAgaWYgKHR5cGVvZiAoc3ByaXRlTmFtZU9yT2JqKSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZU9yT2JqKTtcbiAgICAgICAgfTtcbiAgICAgICAgJChcIiNcIiArIHNwcml0ZU5hbWVPck9iaikucmVtb3ZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJChzcHJpdGVOYW1lT3JPYmopLnJlbW92ZSgpO1xuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGUgPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogc3ByaXRlRG9tT2JqZWN0ID0+IHtcbiAgICByZXR1cm4gJChcIiNcIiArIHNwcml0ZU5hbWUpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZUV4aXN0cyA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gKHNwcml0ZU5hbWUgPT0gJChcIiNcIiArIHNwcml0ZU5hbWUpLmF0dHIoXCJpZFwiKSk7IC8vIHNwcml0ZU5hbWUgY291bGQgYmUgZ2l2ZW4gYXMgYW4gaW50IGJ5IGEgc3R1ZGVudFxufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZU9iamVjdCA9IChcbiAgICBzcHJpdGVOYW1lT3JPYmo6IHN0cmluZyB8IG9iamVjdFxuKTogc3ByaXRlRG9tT2JqZWN0ID0+IHtcbiAgICBpZiAodHlwZW9mIChzcHJpdGVOYW1lT3JPYmopICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiAkKFwiI1wiICsgc3ByaXRlTmFtZU9yT2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJChzcHJpdGVOYW1lT3JPYmopO1xuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVJZCA9IChzcHJpdGVOYW1lT3JPYmo6IHN0cmluZyB8IG9iamVjdCk6IHN0cmluZyA9PiB7XG4gICAgaWYgKHR5cGVvZiAoc3ByaXRlTmFtZU9yT2JqKSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gU3RyaW5nKCQoXCIjXCIgKyBzcHJpdGVOYW1lT3JPYmopLmF0dHIoXCJpZFwiKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZygkKHNwcml0ZU5hbWVPck9iaikuYXR0cihcImlkXCIpKTtcbiAgICB9XG59O1xuXG5leHBvcnQgY29uc3Qgc3ByaXRlR2V0WCA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBudW1iZXIgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgIH07XG4gICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lKS54KCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZUdldFkgPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogbnVtYmVyID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICB9O1xuICAgIHJldHVybiAkKFwiI1wiICsgc3ByaXRlTmFtZSkueSgpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVHZXRaID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgfTtcbiAgICByZXR1cm4gJChcIiNcIiArIHNwcml0ZU5hbWUpLnooKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0WCA9IChzcHJpdGVOYW1lOiBzdHJpbmcsIHh2YWw6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWCBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB4dmFsKTtcbiAgICB9O1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS54KHh2YWwpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRZID0gKHNwcml0ZU5hbWU6IHN0cmluZywgeXZhbDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJZIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHl2YWwpO1xuICAgIH07XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLnkoeXZhbCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVNldFogPSAoc3ByaXRlTmFtZTogc3RyaW5nLCB6dmFsOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlogbG9jYXRpb24gbXVzdCBiZSBhIG51bWJlci5cIiwgenZhbCk7XG4gICAgfTtcbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkueih6dmFsKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0WFkgPSAoXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHh2YWw6IG51bWJlcixcbiAgICB5dmFsOiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWCBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB4dmFsKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlkgbG9jYXRpb24gbXVzdCBiZSBhIG51bWJlci5cIiwgeXZhbCk7XG4gICAgfTtcbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkueHkoeHZhbCwgeXZhbCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVNldFhZWiA9IChcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgeHZhbDogbnVtYmVyLFxuICAgIHl2YWw6IG51bWJlcixcbiAgICB6dmFsOiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWCBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB4dmFsKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlkgbG9jYXRpb24gbXVzdCBiZSBhIG51bWJlci5cIiwgeXZhbCk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJaIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHp2YWwpO1xuICAgIH07XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLnh5eih4dmFsLCB5dmFsLCB6dmFsKTtcbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVHZXRXaWR0aCA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBudW1iZXIgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgIH07XG4gICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lKS53KCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZUdldEhlaWdodCA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBudW1iZXIgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgIH07XG4gICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5oKCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVNldFdpZHRoID0gKHNwcml0ZU5hbWU6IHN0cmluZywgd3ZhbDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBtdXN0IGJlIGEgbnVtYmVyLlwiLCB3dmFsKTtcbiAgICB9XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLncod3ZhbCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVNldEhlaWdodCA9IChzcHJpdGVOYW1lOiBzdHJpbmcsIGh2YWw6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiSGVpZ2h0IG11c3QgYmUgYSBudW1iZXIuXCIsIGh2YWwpO1xuICAgIH1cbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkuaChodmFsKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0V2lkdGhIZWlnaHQgPSAoXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHd2YWw6IG51bWJlcixcbiAgICBodmFsOiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiV2lkdGggbXVzdCBiZSBhIG51bWJlci5cIiwgd3ZhbCk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJIZWlnaHQgbXVzdCBiZSBhIG51bWJlci5cIiwgaHZhbCk7XG4gICAgfVxuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS53aCh3dmFsLCBodmFsKTtcbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVSb3RhdGUgPSAoXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIGFuZ2xlRGVncmVlczogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkFuZ2xlIG11c3QgYmUgYSBudW1iZXIuXCIsIGFuZ2xlRGVncmVlcyk7XG4gICAgfVxuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5yb3RhdGUoYW5nbGVEZWdyZWVzKTtcbn07XG5cbmNvbnN0IEdRR19TUFJJVEVTX1BST1BTOiB7IFt4OiBzdHJpbmddOiB7IFt5OiBzdHJpbmddOiBhbnkgfSB9ID0ge307XG5leHBvcnQgY29uc3Qgc3ByaXRlU2NhbGUgPSAoc3ByaXRlTmFtZTogc3RyaW5nLCByYXRpbzogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgLy8gU2NhbGVzIHRoZSBzcHJpdGUncyB3aWR0aC9oZWlnaHQgd2l0aCByYXRpbywgXG4gICAgLy8gYW5kIHNldCBpdHMgYW5pbSB0byAxMDAlIGZpdCBpdC5cbiAgICAvL1xuICAgIC8vIE5PVEU6IFdlIGFzc3VtZSB0aGF0IHRoZSB3aWR0aC9oZWlnaHQgb2YgdGhlIHNwcml0ZSBcbiAgICAvLyB1cG9uIGZpcnN0IGNhbGwgdG8gdGhpcyBmdW5jdGlvbiBpcyB0aGUgXCJvcmlnaW5hbFwiIHdpZHRoL2hlaWdodCBvZiB0aGUgc3ByaXRlLlxuICAgIC8vIFRoaXMgYW5kIGFsbCBzdWJzZXF1ZW50IGNhbGxzIHRvIHRoaXMgZnVuY3Rpb24gY2FsY3VsYXRlcyByYXRpb1xuICAgIC8vIHJlbGF0aXZlIHRvIHRoYXQgb3JpZ2luYWwgd2lkdGgvaGVpZ2h0LlxuXG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJSYXRpbyBtdXN0IGJlIGEgbnVtYmVyLlwiLCByYXRpbyk7XG4gICAgfVxuXG4gICAgbGV0IHNwcml0ZVByb3AgPSBHUUdfU1BSSVRFU19QUk9QU1tzcHJpdGVOYW1lXTtcbiAgICBpZiAoc3ByaXRlUHJvcCA9PSBudWxsKSB7XG4gICAgICAgIHNwcml0ZVByb3AgPSB7XG4gICAgICAgICAgICB3aWR0aE9yaWdpbmFsOiBzcHJpdGVHZXRXaWR0aChzcHJpdGVOYW1lKSxcbiAgICAgICAgICAgIGhlaWdodE9yaWdpbmFsOiBzcHJpdGVHZXRIZWlnaHQoc3ByaXRlTmFtZSlcbiAgICAgICAgfTtcbiAgICAgICAgR1FHX1NQUklURVNfUFJPUFNbc3ByaXRlTmFtZV0gPSBzcHJpdGVQcm9wO1xuICAgIH1cbiAgICBjb25zdCBuZXdXaWR0aCA9IHNwcml0ZVByb3Aud2lkdGhPcmlnaW5hbCAqIHJhdGlvO1xuICAgIGNvbnN0IG5ld0hlaWdodCA9IHNwcml0ZVByb3AuaGVpZ2h0T3JpZ2luYWwgKiByYXRpbztcblxuICAgIC8vJChcIiNcIiArIHNwcml0ZU5hbWUpLnNjYWxlKHJhdGlvKTsgLy8gR1Egc2NhbGUgaXMgdmVyeSBicm9rZW4uXG4gICAgLy8gR1EncyBzY2FsZSgpIHdpbGwgc2NhbGUgdGhlIGFuaW0gaW1hZ2UgKHdoaWNoIGlzIGEgYmFja2dyb3VuZC1pbWFnZSBpbiB0aGUgZGl2KSBwcm9wZXJseVxuICAgIC8vIGFuZCBldmVuIHNjYWxlIHRoZSBkaXYncyB3aWR0aC9oZWlnaHQgcHJvcGVybHlcbiAgICAvLyBidXQgc29tZWhvdyB0aGUgaW4tZ2FtZSB3aWR0aC9oZWlnaHQgdGhhdCBHUSBzdG9yZXMgZm9yIGl0IHJlbWFpbnMgdGhlIG9yaWdpbmFsIHNpemVcbiAgICAvLyBhbmQgd29yc2UsIHRoZSBoaXQgYm94J3Mgd2lkdGgvaGVpZ2h0IHRoYXQgR1EgdXNlcyB0byBjYWxjdWxhdGUgY29sbGlzaW9uIGRldGVjdGlvbiB3aXRoIFxuICAgIC8vIGlzIGluIGJldHdlZW4gdGhlIGRpdidzIGFuZCB0aGUgc3ByaXRlJ3Mgd2lkdGgvaGVpZ2h0IChhYm91dCBoYWxmd2F5IGJldHdlZW4/IGRvbid0IGtub3cpLlxuXG4gICAgLy8kKFwiI1wiICsgc3ByaXRlTmFtZSkuY3NzKFwidHJhbnNmb3JtLW9yaWdpblwiLCBcInRvcCBsZWZ0XCIpOyAvLyBkbyBOT1QgY2hhbmdlIHRyYW5zZm9ybS1vcmlnaW4sIGVsc2UgYnJlYWtzIGNvbGxpc2lvbiBhbmQgcm90YXRlXG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLmNzcyhcImJhY2tncm91bmQtc2l6ZVwiLCBcIjEwMCUgMTAwJVwiKTsgLy8gc3RyZXRjaGVzIHdpZHRoL2hlaWdodCBpbmRlcGVuZGVudGx5IHRvIHdpZHRoL2hlaWdodCBvZiBkaXZcbiAgICBzcHJpdGVTZXRXaWR0aEhlaWdodChzcHJpdGVOYW1lLCBuZXdXaWR0aCwgbmV3SGVpZ2h0KTtcbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRBbmltYXRpb24gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBzcHJpdGVOYW1lT3JPYmo6IHN0cmluZyB8IG9iamVjdCxcbiAgICBhR1FBbmltYXRpb24/OiBvYmplY3QsXG4gICAgY2FsbGJhY2tGdW5jdGlvbj86IEZ1bmN0aW9uXG4pIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiAmJiBhR1FBbmltYXRpb24gIT0gbnVsbCkge1xuICAgICAgICBzcHJpdGVPYmplY3Qoc3ByaXRlTmFtZU9yT2JqKS5zZXRBbmltYXRpb24oYUdRQW5pbWF0aW9uKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgJiYgYUdRQW5pbWF0aW9uICE9IG51bGwgJiYgdHlwZW9mIGNhbGxiYWNrRnVuY3Rpb24gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBzcHJpdGVPYmplY3Qoc3ByaXRlTmFtZU9yT2JqKS5zZXRBbmltYXRpb24oYUdRQW5pbWF0aW9uLCBjYWxsYmFja0Z1bmN0aW9uKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgc3ByaXRlT2JqZWN0KHNwcml0ZU5hbWVPck9iaikuc2V0QW5pbWF0aW9uKCk7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVQYXVzZUFuaW1hdGlvbiA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkucGF1c2VBbmltYXRpb24oKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlUmVzdW1lQW5pbWF0aW9uID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5yZXN1bWVBbmltYXRpb24oKTtcbn07XG5cbnR5cGUgSlFPYmplY3QgPSB7XG4gICAgb2Zmc2V0OiAoKSA9PiB7IGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIgfTtcbiAgICBvdXRlcldpZHRoOiAoeDogYm9vbGVhbikgPT4gbnVtYmVyO1xuICAgIG91dGVySGVpZ2h0OiAoeDogYm9vbGVhbikgPT4gbnVtYmVyO1xufTtcbmNvbnN0IGpxT2Jqc0NvbGxpZGVBeGlzQWxpZ25lZCA9IGZ1bmN0aW9uIChvYmoxOiBKUU9iamVjdCwgb2JqMjogSlFPYmplY3QpIHtcbiAgICAvLyBvYmoxLzIgbXVzdCBiZSBheGlzIGFsaWduZWQgalF1ZXJ5IG9iamVjdHNcbiAgICBjb25zdCBkMUxlZnQgPSBvYmoxLm9mZnNldCgpLmxlZnQ7XG4gICAgY29uc3QgZDFSaWdodCA9IGQxTGVmdCArIG9iajEub3V0ZXJXaWR0aCh0cnVlKTtcbiAgICBjb25zdCBkMVRvcCA9IG9iajEub2Zmc2V0KCkudG9wO1xuICAgIGNvbnN0IGQxQm90dG9tID0gZDFUb3AgKyBvYmoxLm91dGVySGVpZ2h0KHRydWUpO1xuXG4gICAgY29uc3QgZDJMZWZ0ID0gb2JqMi5vZmZzZXQoKS5sZWZ0O1xuICAgIGNvbnN0IGQyUmlnaHQgPSBkMkxlZnQgKyBvYmoyLm91dGVyV2lkdGgodHJ1ZSk7XG4gICAgY29uc3QgZDJUb3AgPSBvYmoyLm9mZnNldCgpLnRvcDtcbiAgICBjb25zdCBkMkJvdHRvbSA9IGQyVG9wICsgb2JqMi5vdXRlckhlaWdodCh0cnVlKTtcblxuICAgIHJldHVybiAhKGQxQm90dG9tIDwgZDJUb3AgfHwgZDFUb3AgPiBkMkJvdHRvbSB8fCBkMVJpZ2h0IDwgZDJMZWZ0IHx8IGQxTGVmdCA+IGQyUmlnaHQpO1xufTtcblxudHlwZSBET01PYmplY3QgPSB7XG4gICAgZ2V0Qm91bmRpbmdDbGllbnRSZWN0OiAoKSA9PiB7IGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyIH07XG59O1xuY29uc3QgZG9tT2Jqc0NvbGxpZGVBeGlzQWxpZ25lZCA9IGZ1bmN0aW9uIChvYmoxOiBET01PYmplY3QsIG9iajI6IERPTU9iamVjdCkge1xuICAgIC8vIG9iajEvMiBhcmUgRE9NIG9iamVjdHMsIHBvc3NpYmx5IHJvdGF0ZWRcbiAgICAvLyBjb2xsaXNpb24gaXMgY2hlY2tlZCB2aWEgYXhpcyBhbGlnbmVkIGJvdW5kaW5nIHJlY3RzXG4gICAgY29uc3QgcjEgPSBvYmoxLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHIyID0gb2JqMi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4gIShyMS5ib3R0b20gPCByMi50b3AgfHwgcjEudG9wID4gcjIuYm90dG9tIHx8IHIxLnJpZ2h0IDwgcjIubGVmdCB8fCByMS5sZWZ0ID4gcjIucmlnaHQpO1xufTtcblxudHlwZSBHYW1lUXVlcnlPYmplY3QgPSB7XG4gICAgYW5nbGU6IG51bWJlcixcbiAgICBhbmltYXRpb246IG9iamVjdCxcbiAgICBib3VuZGluZ0NpcmNsZTogb2JqZWN0LFxuICAgIGN1cnJlbnRGcmFtZTogbnVtYmVyLFxuICAgIGZhY3RvcjogbnVtYmVyLFxuICAgIGZhY3Rvcmg6IG51bWJlcixcbiAgICBmYWN0b3J2OiBudW1iZXIsXG4gICAgZnJhbWVJbmNyZW1lbnQ6IG51bWJlcixcbiAgICBnZW9tZXRyeTogbnVtYmVyLFxuICAgIGhlaWdodDogbnVtYmVyLFxuICAgIGlkbGVDb3VudGVyOiBudW1iZXIsXG4gICAgcGxheWluZzogYm9vbGVhbixcbiAgICBwb3NPZmZzZXRYOiBudW1iZXIsXG4gICAgcG9zT2Zmc2V0WTogbnVtYmVyLFxuICAgIHBvc3g6IG51bWJlcixcbiAgICBwb3N5OiBudW1iZXIsXG4gICAgcG9zejogbnVtYmVyLFxuICAgIHdpZHRoOiBudW1iZXJcbn07XG5jb25zdCBncU9ianNDb2xsaWRlQXhpc0FsaWduZWQgPSBmdW5jdGlvbiAob2JqMTogeyBnYW1lUXVlcnk6IEdhbWVRdWVyeU9iamVjdCB9LCBvYmoyOiB7IGdhbWVRdWVyeTogR2FtZVF1ZXJ5T2JqZWN0IH0pIHtcbiAgICAvLyBvYmoxLzIgbXVzdCBiZSBheGlzIGFsaWduZWQgR1EgRE9NIG9iamVjdHNcbiAgICAvLyB0dXJucyBvdXQgdGhpcyBpcyBub3QgcmVhbGx5IGZhc3RlciB0aGFuIGRvbU9ianNDb2xsaWRlQXhpc0FsaWduZWRcbiAgICBjb25zdCByMSA9IG9iajEuZ2FtZVF1ZXJ5O1xuICAgIGNvbnN0IHIxX2JvdHRvbSA9IHIxLnBvc3kgKyByMS5oZWlnaHQ7XG4gICAgY29uc3QgcjFfcmlnaHQgPSByMS5wb3N4ICsgcjEud2lkdGg7XG5cbiAgICBjb25zdCByMiA9IG9iajIuZ2FtZVF1ZXJ5O1xuICAgIGNvbnN0IHIyX2JvdHRvbSA9IHIyLnBvc3kgKyByMi5oZWlnaHQ7XG4gICAgY29uc3QgcjJfcmlnaHQgPSByMi5wb3N4ICsgcjIud2lkdGg7XG4gICAgcmV0dXJuICEocjFfYm90dG9tIDwgcjIucG9zeSB8fCByMS5wb3N5ID4gcjJfYm90dG9tIHx8IHIxX3JpZ2h0IDwgcjIucG9zeCB8fCByMS5wb3N4ID4gcjJfcmlnaHQpO1xufTtcblxuXG4vKipcbiAqIFV0aWxpdHkgZnVuY3Rpb24gcmV0dXJucyByYWRpdXMgb2YgcmVjdGFuZ3VsYXIgZ2VvbWV0cnlcbiAqIFxuICogQHBhcmFtIGVsZW1cbiAqIEBwYXJhbSBhbmdsZSB0aGUgYW5nbGUgaW4gZGVncmVlc1xuICogQHJldHVybiAueCwgLnkgcmFkaXVzIG9mIGdlb21ldHJ5XG4gKi9cbmNvbnN0IHByb2plY3RHcU9iaiA9IGZ1bmN0aW9uIChlbGVtOiBHYW1lUXVlcnlPYmplY3QsIGFuZ2xlOiBudW1iZXIpOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0ge1xuICAgIC8vIGJhc2VkIG9uIGEgR1EgZm4uXG4gICAgY29uc3QgYiA9IGFuZ2xlICogTWF0aC5QSSAvIDE4MDtcbiAgICBjb25zdCBSeCA9IE1hdGguYWJzKE1hdGguY29zKGIpICogZWxlbS53aWR0aCAvIDIgKiBlbGVtLmZhY3RvcikgKyBNYXRoLmFicyhNYXRoLnNpbihiKSAqIGVsZW0uaGVpZ2h0IC8gMiAqIGVsZW0uZmFjdG9yKTtcbiAgICBjb25zdCBSeSA9IE1hdGguYWJzKE1hdGguY29zKGIpICogZWxlbS5oZWlnaHQgLyAyICogZWxlbS5mYWN0b3IpICsgTWF0aC5hYnMoTWF0aC5zaW4oYikgKiBlbGVtLndpZHRoIC8gMiAqIGVsZW0uZmFjdG9yKTtcbiAgICByZXR1cm4geyB4OiBSeCwgeTogUnkgfTtcbn07XG5cbi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbiByZXR1cm5zIHdoZXRoZXIgdHdvIG5vbi1heGlzIGFsaWduZWQgcmVjdGFuZ3VsYXIgb2JqZWN0cyBhcmUgY29sbGlkaW5nXG4gKiBcbiAqIEBwYXJhbSBlbGVtMVxuICogQHBhcmFtIGVsZW0xQ2VudGVyWCB4LWNvb3JkIG9mIGNlbnRlciBvZiBib3VuZGluZyBjaXJjbGUvcmVjdCBvZiBlbGVtMVxuICogQHBhcmFtIGVsZW0xQ2VudGVyWSB5LWNvb3JkIG9mIGNlbnRlciBvZiBib3VuZGluZyBjaXJjbGUvcmVjdCBvZiBlbGVtMVxuICogQHBhcmFtIGVsZW0yXG4gKiBAcGFyYW0gZWxlbTJDZW50ZXJYIHgtY29vcmQgb2YgY2VudGVyIG9mIGJvdW5kaW5nIGNpcmNsZS9yZWN0IG9mIGVsZW0yXG4gKiBAcGFyYW0gZWxlbTJDZW50ZXJZIHktY29vcmQgb2YgY2VudGVyIG9mIGJvdW5kaW5nIGNpcmNsZS9yZWN0IG9mIGVsZW0yXG4gKiBAcmV0dXJuIHtib29sZWFufSBpZiB0aGUgdHdvIGVsZW1lbnRzIGNvbGxpZGUgb3Igbm90XG4gKi9cbmNvbnN0IGdxT2Jqc0NvbGxpZGUgPSBmdW5jdGlvbiAoZWxlbTE6IEdhbWVRdWVyeU9iamVjdCwgZWxlbTFDZW50ZXJYOiBudW1iZXIsIGVsZW0xQ2VudGVyWTogbnVtYmVyLFxuICAgIGVsZW0yOiBHYW1lUXVlcnlPYmplY3QsIGVsZW0yQ2VudGVyWDogbnVtYmVyLCBlbGVtMkNlbnRlclk6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIC8vIHRlc3QgcmVhbCBjb2xsaXNpb24gKG9ubHkgZm9yIHR3byByZWN0YW5nbGVzOyBjb3VsZCBiZSByb3RhdGVkKVxuICAgIC8vIGJhc2VkIG9uIGFuZCBmaXhlcyBhIGJyb2tlbiBHUSBmbi5cbiAgICBjb25zdCBkeCA9IGVsZW0yQ2VudGVyWCAtIGVsZW0xQ2VudGVyWDsgLy8gR1EgdXNlcyBpdHMgYm91bmRpbmdDaXJjbGUgdG8gY2FsY3VsYXRlIHRoZXNlLCBidXRcbiAgICBjb25zdCBkeSA9IGVsZW0yQ2VudGVyWSAtIGVsZW0xQ2VudGVyWTsgLy8gR1EgYm91bmRpbmdDaXJjbGVzIGFyZSBicm9rZW4gd2hlbiBzcHJpdGVzIGFyZSBzY2FsZWRcbiAgICBjb25zdCBhID0gTWF0aC5hdGFuKGR5IC8gZHgpO1xuXG4gICAgbGV0IER4ID0gTWF0aC5hYnMoTWF0aC5jb3MoYSAtIGVsZW0xLmFuZ2xlICogTWF0aC5QSSAvIDE4MCkgLyBNYXRoLmNvcyhhKSAqIGR4KTtcbiAgICBsZXQgRHkgPSBNYXRoLmFicyhNYXRoLnNpbihhIC0gZWxlbTEuYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSAvIE1hdGguc2luKGEpICogZHkpO1xuXG4gICAgbGV0IFIgPSBwcm9qZWN0R3FPYmooZWxlbTIsIGVsZW0yLmFuZ2xlIC0gZWxlbTEuYW5nbGUpO1xuXG4gICAgaWYgKChlbGVtMS53aWR0aCAvIDIgKiBlbGVtMS5mYWN0b3IgKyBSLnggPD0gRHgpIHx8IChlbGVtMS5oZWlnaHQgLyAyICogZWxlbTEuZmFjdG9yICsgUi55IDw9IER5KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgRHggPSBNYXRoLmFicyhNYXRoLmNvcyhhIC0gZWxlbTIuYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSAvIE1hdGguY29zKGEpICogLWR4KTtcbiAgICAgICAgRHkgPSBNYXRoLmFicyhNYXRoLnNpbihhIC0gZWxlbTIuYW5nbGUgKiBNYXRoLlBJIC8gMTgwKSAvIE1hdGguc2luKGEpICogLWR5KTtcblxuICAgICAgICBSID0gcHJvamVjdEdxT2JqKGVsZW0xLCBlbGVtMS5hbmdsZSAtIGVsZW0yLmFuZ2xlKTtcblxuICAgICAgICBpZiAoKGVsZW0yLndpZHRoIC8gMiAqIGVsZW0yLmZhY3RvciArIFIueCA8PSBEeCkgfHwgKGVsZW0yLmhlaWdodCAvIDIgKiBlbGVtMi5mYWN0b3IgKyBSLnkgPD0gRHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmV4cG9ydCB0eXBlIENvbGxpc2lvbkhhbmRsaW5nRm4gPSAoY29sbEluZGV4OiBudW1iZXIsIGhpdFNwcml0ZTogb2JqZWN0KSA9PlxuICAgIHZvaWQ7XG5leHBvcnQgY29uc3QgZm9yRWFjaFNwcml0ZVNwcml0ZUNvbGxpc2lvbkRvID0gKFxuICAgIHNwcml0ZTFOYW1lOiBzdHJpbmcsXG4gICAgc3ByaXRlMk5hbWU6IHN0cmluZyxcbiAgICBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uOiBDb2xsaXNpb25IYW5kbGluZ0ZuXG4pOiB2b2lkID0+IHtcbiAgICAkKHNwcml0ZUZpbHRlcmVkQ29sbGlzaW9uKHNwcml0ZTFOYW1lLCBcIi5nUV9ncm91cCwgI1wiICsgc3ByaXRlMk5hbWUpKS5lYWNoKGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb24pO1xuICAgIC8vIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb24gY2FuIG9wdGlvbmFsbHkgdGFrZSB0d28gYXJndW1lbnRzOiBjb2xsSW5kZXgsIGhpdFNwcml0ZVxuICAgIC8vIHNlZSBodHRwOi8vYXBpLmpxdWVyeS5jb20valF1ZXJ5LmVhY2hcbn07XG5leHBvcnQgY29uc3QgZm9yRWFjaDJTcHJpdGVzSGl0ID0gKCgpID0+IHtcbiAgICB2YXIgcHJpbnRlZCA9IGZhbHNlO1xuICAgIHJldHVybiAoc3ByaXRlMU5hbWU6IHN0cmluZywgc3ByaXRlMk5hbWU6IHN0cmluZywgY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbjogQ29sbGlzaW9uSGFuZGxpbmdGbikgPT4ge1xuICAgICAgICBpZiAoIXByaW50ZWQpIHtcbiAgICAgICAgICAgIHByaW50ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIkRlcHJlY2F0ZWQgZnVuY3Rpb24gdXNlZDogZm9yRWFjaDJTcHJpdGVzSGl0LiAgVXNlIHdoZW4yU3ByaXRlc0hpdCBpbnN0ZWFkIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2UuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGZvckVhY2hTcHJpdGVTcHJpdGVDb2xsaXNpb25EbyhzcHJpdGUxTmFtZSwgc3ByaXRlMk5hbWUsIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb24pO1xuICAgIH07XG59KSgpO1xuZXhwb3J0IGNvbnN0IHdoZW4yU3ByaXRlc0hpdCA9IGZvckVhY2hTcHJpdGVTcHJpdGVDb2xsaXNpb25EbzsgLy8gTkVXXG5cbmV4cG9ydCBjb25zdCBmb3JFYWNoU3ByaXRlR3JvdXBDb2xsaXNpb25EbyA9IChcbiAgICBzcHJpdGUxTmFtZTogc3RyaW5nLFxuICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb246IENvbGxpc2lvbkhhbmRsaW5nRm5cbik6IHZvaWQgPT4ge1xuICAgICQoc3ByaXRlRmlsdGVyZWRDb2xsaXNpb24oc3ByaXRlMU5hbWUsIFwiI1wiICsgZ3JvdXBOYW1lICsgXCIsIC5nUV9zcHJpdGVcIikpLmVhY2goY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbik7XG4gICAgLy8gY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbiBjYW4gb3B0aW9uYWxseSB0YWtlIHR3byBhcmd1bWVudHM6IGNvbGxJbmRleCwgaGl0U3ByaXRlXG4gICAgLy8gc2VlIGh0dHA6Ly9hcGkuanF1ZXJ5LmNvbS9qUXVlcnkuZWFjaFxufTtcbmV4cG9ydCBjb25zdCBmb3JFYWNoU3ByaXRlR3JvdXBIaXQgPSBmb3JFYWNoU3ByaXRlR3JvdXBDb2xsaXNpb25EbztcblxuZXhwb3J0IGNvbnN0IGZvckVhY2hTcHJpdGVGaWx0ZXJlZENvbGxpc2lvbkRvID0gKFxuICAgIHNwcml0ZTFOYW1lOiBzdHJpbmcsXG4gICAgZmlsdGVyU3RyOiBzdHJpbmcsXG4gICAgY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbjogQ29sbGlzaW9uSGFuZGxpbmdGblxuKTogdm9pZCA9PiB7XG4gICAgJChzcHJpdGVGaWx0ZXJlZENvbGxpc2lvbihzcHJpdGUxTmFtZSwgZmlsdGVyU3RyKSkuZWFjaChjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uKTtcbiAgICAvLyBzZWUgaHR0cDovL2dhbWVxdWVyeWpzLmNvbS9kb2N1bWVudGF0aW9uL2FwaS8jY29sbGlzaW9uIGZvciBmaWx0ZXJTdHIgc3BlY1xuICAgIC8vIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb24gY2FuIG9wdGlvbmFsbHkgdGFrZSB0d28gYXJndW1lbnRzOiBjb2xsSW5kZXgsIGhpdFNwcml0ZVxuICAgIC8vIHNlZSBodHRwOi8vYXBpLmpxdWVyeS5jb20valF1ZXJ5LmVhY2hcbn07XG5leHBvcnQgY29uc3QgZm9yRWFjaFNwcml0ZUZpbHRlcmVkSGl0ID0gZm9yRWFjaFNwcml0ZUZpbHRlcmVkQ29sbGlzaW9uRG87XG5cbmNvbnN0IHNwcml0ZUZpbHRlcmVkQ29sbGlzaW9uID0gZnVuY3Rpb24gKHNwcml0ZTFOYW1lOiBzdHJpbmcsIGZpbHRlcjogc3RyaW5nKTogRE9NT2JqZWN0W10ge1xuICAgIC8vIEJhc2VkIG9uIGFuZCBmaXhlcyBHUSdzIGNvbGxpc2lvbiBmdW5jdGlvbiwgYmVjYXVzZSBHUSdzIGNvbGxpZGUgXG4gICAgLy8gZnVuY3Rpb24gaXMgYmFkbHkgYnJva2VuIHdoZW4gc3ByaXRlcyBhcmUgcm90YXRlZC9zY2FsZWRcbiAgICAvLyBUaGUgZml4IGlzIHRvIGNoZWNrIGNvbGxpc2lvbiB1c2luZyBheGlzIGFsaWduZWQgcmVjdGFuZ3VsYXIgaGl0IGJveGVzLlxuICAgIC8vIE5vdCBncmVhdCBmb3Igcm90YXRlZCBzcHJpdGVzLCBidXQgZ29vZCBlbm91Z2ggZm9yIG5vdy5cbiAgICBjb25zdCBzMSA9ICQoXCIjXCIgKyBzcHJpdGUxTmFtZSk7XG4gICAgdmFyIHJlc3VsdExpc3QgPSBbXTtcblxuICAgIC8vaWYgKHRoaXMgIT09ICQuZ2FtZVF1ZXJ5LnBsYXlncm91bmQpIHtcbiAgICAvLyBXZSBtdXN0IGZpbmQgYWxsIHRoZSBlbGVtZW50cyB0aGF0IHRvdWNoZSAndGhpcydcbiAgICB2YXIgZWxlbWVudHNUb0NoZWNrID0gbmV3IEFycmF5KCk7XG4gICAgZWxlbWVudHNUb0NoZWNrLnB1c2goJC5nYW1lUXVlcnkuc2NlbmVncmFwaC5jaGlsZHJlbihmaWx0ZXIpLmdldCgpKTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBlbGVtZW50c1RvQ2hlY2subGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdmFyIHN1YkxlbiA9IGVsZW1lbnRzVG9DaGVja1tpXS5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChzdWJMZW4tLSkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnRUb0NoZWNrID0gZWxlbWVudHNUb0NoZWNrW2ldW3N1Ykxlbl07XG4gICAgICAgICAgICAvLyBJcyBpdCBhIGdhbWVRdWVyeSBnZW5lcmF0ZWQgZWxlbWVudD9cbiAgICAgICAgICAgIGlmIChlbGVtZW50VG9DaGVjay5nYW1lUXVlcnkpIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBkb24ndCB3YW50IHRvIGNoZWNrIGdyb3Vwc1xuICAgICAgICAgICAgICAgIGlmICghZWxlbWVudFRvQ2hlY2suZ2FtZVF1ZXJ5Lmdyb3VwICYmICFlbGVtZW50VG9DaGVjay5nYW1lUXVlcnkudGlsZVNldCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBEb2VzIGl0IHRvdWNoZSB0aGUgc2VsZWN0aW9uP1xuICAgICAgICAgICAgICAgICAgICBpZiAoczFbMF0gIT0gZWxlbWVudFRvQ2hlY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGJvdW5kaW5nIGNpcmNsZSBjb2xsaXNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qdmFyIGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KG9mZnNldFkgKyBnYW1lUXVlcnkuYm91bmRpbmdDaXJjbGUueSAtIGVsZW1lbnRzVG9DaGVja1tpXS5vZmZzZXRZIC0gZWxlbWVudFRvQ2hlY2suZ2FtZVF1ZXJ5LmJvdW5kaW5nQ2lyY2xlLnksIDIpICsgTWF0aC5wb3cob2Zmc2V0WCArIGdhbWVRdWVyeS5ib3VuZGluZ0NpcmNsZS54IC0gZWxlbWVudHNUb0NoZWNrW2ldLm9mZnNldFggLSBlbGVtZW50VG9DaGVjay5nYW1lUXVlcnkuYm91bmRpbmdDaXJjbGUueCwgMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlIC0gZ2FtZVF1ZXJ5LmJvdW5kaW5nQ2lyY2xlLnJhZGl1cyAtIGVsZW1lbnRUb0NoZWNrLmdhbWVRdWVyeS5ib3VuZGluZ0NpcmNsZS5yYWRpdXMgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHMxUmVjdCA9IHMxWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZTJSZWN0ID0gZWxlbWVudFRvQ2hlY2suZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShzMVJlY3QuYm90dG9tIDwgZTJSZWN0LnRvcCB8fCBzMVJlY3QudG9wID4gZTJSZWN0LmJvdHRvbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHMxUmVjdC5yaWdodCA8IGUyUmVjdC5sZWZ0IHx8IHMxUmVjdC5sZWZ0ID4gZTJSZWN0LnJpZ2h0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIHJlYWwgY29sbGlzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9pZiAoY29sbGlkZShnYW1lUXVlcnksIHsgeDogb2Zmc2V0WCwgeTogb2Zmc2V0WSB9LCBlbGVtZW50VG9DaGVjay5nYW1lUXVlcnksIHsgeDogZWxlbWVudHNUb0NoZWNrW2ldLm9mZnNldFgsIHk6IGVsZW1lbnRzVG9DaGVja1tpXS5vZmZzZXRZIH0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR1EncyBjb2xsaWRlIGlzIHZlcnkgYnJva2VuIGlmIHJvdGF0aW9uIGFwcGxpZWRcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzMVswXS5nYW1lUXVlcnkuYW5nbGUgJSA5MCA9PT0gMCAmJiBlbGVtZW50VG9DaGVjay5nYW1lUXVlcnkuYW5nbGUgJSA5MCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBheGlzIGFsaWduZWQgY29sbGlzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkZCB0byB0aGUgcmVzdWx0IGxpc3QgaWYgY29sbGlzaW9uIGRldGVjdGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdExpc3QucHVzaChlbGVtZW50c1RvQ2hlY2tbaV1bc3ViTGVuXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gbm90IGF4aXMgYWxpZ25lZCBjb2xsaXNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgczFDZW50ZXJYID0gczFSZWN0LmxlZnQgKyAoczFSZWN0LnJpZ2h0IC0gczFSZWN0LmxlZnQpIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgczFDZW50ZXJZID0gczFSZWN0LnRvcCArIChzMVJlY3QuYm90dG9tIC0gczFSZWN0LnRvcCkgLyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlMkNlbnRlclggPSBlMlJlY3QubGVmdCArIChlMlJlY3QucmlnaHQgLSBlMlJlY3QubGVmdCkgLyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlMkNlbnRlclkgPSBlMlJlY3QudG9wICsgKGUyUmVjdC5ib3R0b20gLSBlMlJlY3QudG9wKSAvIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChncU9ianNDb2xsaWRlKHMxWzBdLmdhbWVRdWVyeSwgczFDZW50ZXJYLCBzMUNlbnRlclksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50VG9DaGVjay5nYW1lUXVlcnksIGUyQ2VudGVyWCwgZTJDZW50ZXJZKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWRkIHRvIHRoZSByZXN1bHQgbGlzdCBpZiBjb2xsaXNpb24gZGV0ZWN0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdExpc3QucHVzaChlbGVtZW50c1RvQ2hlY2tbaV1bc3ViTGVuXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gQWRkIHRoZSBjaGlsZHJlbiBub2RlcyB0byB0aGUgbGlzdFxuICAgICAgICAgICAgICAgIHZhciBlbGVDaGlsZHJlbiA9ICQoZWxlbWVudFRvQ2hlY2spLmNoaWxkcmVuKGZpbHRlcik7XG4gICAgICAgICAgICAgICAgaWYgKGVsZUNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50c1RvQ2hlY2sucHVzaChlbGVDaGlsZHJlbi5nZXQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzVG9DaGVja1tsZW5dLm9mZnNldFggPSBlbGVtZW50VG9DaGVjay5nYW1lUXVlcnkucG9zeCArIGVsZW1lbnRzVG9DaGVja1tpXS5vZmZzZXRYO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50c1RvQ2hlY2tbbGVuXS5vZmZzZXRZID0gZWxlbWVudFRvQ2hlY2suZ2FtZVF1ZXJ5LnBvc3kgKyBlbGVtZW50c1RvQ2hlY2tbaV0ub2Zmc2V0WTtcbiAgICAgICAgICAgICAgICAgICAgbGVuKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdExpc3Q7XG59O1xuXG5leHBvcnQgdHlwZSBTcHJpdGVIaXREaXJlY3Rpb25hbGl0eSA9IHtcbiAgICBcImxlZnRcIjogYm9vbGVhbjtcbiAgICBcInJpZ2h0XCI6IGJvb2xlYW47XG4gICAgXCJ1cFwiOiBib29sZWFuO1xuICAgIFwiZG93blwiOiBib29sZWFuO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVIaXREaXJlY3Rpb24gPSAoXG4gICAgc3ByaXRlMUlkOiBzdHJpbmcsXG4gICAgc3ByaXRlMVg6IG51bWJlcixcbiAgICBzcHJpdGUxWTogbnVtYmVyLFxuICAgIHNwcml0ZTFYU3BlZWQ6IG51bWJlcixcbiAgICBzcHJpdGUxWVNwZWVkOiBudW1iZXIsXG4gICAgc3ByaXRlMVdpZHRoOiBudW1iZXIsXG4gICAgc3ByaXRlMUhlaWdodDogbnVtYmVyLFxuICAgIHNwcml0ZTJJZDogc3RyaW5nLFxuICAgIHNwcml0ZTJYOiBudW1iZXIsXG4gICAgc3ByaXRlMlk6IG51bWJlcixcbiAgICBzcHJpdGUyWFNwZWVkOiBudW1iZXIsXG4gICAgc3ByaXRlMllTcGVlZDogbnVtYmVyLFxuICAgIHNwcml0ZTJXaWR0aDogbnVtYmVyLFxuICAgIHNwcml0ZTJIZWlnaHQ6IG51bWJlclxuKTogU3ByaXRlSGl0RGlyZWN0aW9uYWxpdHkgPT4ge1xuICAgIHZhciBzcHJpdGUxSW5mbzogU3ByaXRlRGljdCA9IHtcbiAgICAgICAgXCJpZFwiOiBzcHJpdGUxSWQsXG4gICAgICAgIFwieFBvc1wiOiBzcHJpdGUxWCxcbiAgICAgICAgXCJ5UG9zXCI6IHNwcml0ZTFZLFxuICAgICAgICBcInhTcGVlZFwiOiBzcHJpdGUxWFNwZWVkLFxuICAgICAgICBcInlTcGVlZFwiOiBzcHJpdGUxWVNwZWVkLFxuICAgICAgICBcImhlaWdodFwiOiBzcHJpdGUxSGVpZ2h0LFxuICAgICAgICBcIndpZHRoXCI6IHNwcml0ZTFXaWR0aFxuICAgIH07XG4gICAgdmFyIHNwcml0ZTJJbmZvOiBTcHJpdGVEaWN0ID0ge1xuICAgICAgICBcImlkXCI6IHNwcml0ZTJJZCxcbiAgICAgICAgXCJ4UG9zXCI6IHNwcml0ZTJYLFxuICAgICAgICBcInlQb3NcIjogc3ByaXRlMlksXG4gICAgICAgIFwieFNwZWVkXCI6IHNwcml0ZTJYU3BlZWQsXG4gICAgICAgIFwieVNwZWVkXCI6IHNwcml0ZTJZU3BlZWQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHNwcml0ZTJIZWlnaHQsXG4gICAgICAgIFwid2lkdGhcIjogc3ByaXRlMldpZHRoXG4gICAgfTtcbiAgICByZXR1cm4gc3ByaXRlSGl0RGlyKHNwcml0ZTFJbmZvLCBzcHJpdGUySW5mbyk7XG59O1xuXG5leHBvcnQgdHlwZSBTcHJpdGVQaHlzaWNhbERpbWVuc2lvbnMgPSB7XG4gICAgXCJ4UG9zXCI6IG51bWJlcjtcbiAgICBcInlQb3NcIjogbnVtYmVyO1xuICAgIFwieFNwZWVkXCI6IG51bWJlcjsgLy8gbW92ZW1lbnQgbXVzdCBiZSBieSBkaWN0aW9uYXJ5LFxuICAgIFwieVNwZWVkXCI6IG51bWJlcjsgLy8gd2l0aCBzb21ldGhpbmcgbGlrZSB4ID0geCArIHhTcGVlZFxuICAgIFwid2lkdGhcIjogbnVtYmVyO1xuICAgIFwiaGVpZ2h0XCI6IG51bWJlcjtcbn07XG5leHBvcnQgdHlwZSBTcHJpdGVEaWN0ID0gU3ByaXRlUGh5c2ljYWxEaW1lbnNpb25zICYge1xuICAgIFwiaWRcIjogc3RyaW5nO1xuICAgIFtzOiBzdHJpbmddOiBhbnk7XG59O1xuY29uc3Qgc3ByaXRlc1NwZWVkU2FtcGxlczogeyBbazogc3RyaW5nXTogeyBzYW1wbGVTaXplOiBudW1iZXIsIHhTcGVlZFNhbXBsZXM6IG51bWJlcltdLCB5U3BlZWRTYW1wbGVzOiBudW1iZXJbXSwgY2hlY2tlZDogYm9vbGVhbiB9IH0gPSB7fTtcbmNvbnN0IGNoZWNrU3ByaXRlU3BlZWRVc2FnZUNvbW1vbkVycm9ycyA9IChzcHJpdGVJbmZvOiBTcHJpdGVEaWN0KSA9PiB7XG4gICAgLy8gQSBoZXVyaXN0aWMgY2hlY2sgZm9yIGNvbW1vbiBlcnJvcnMgZnJvbSBsZWFybmVycy5cbiAgICAvLyBDaGVjayBpZiBzcHJpdGUgc3BlZWRzIGV2ZXIgY2hhbmdlLiAgSWYgbm90LCBwcm9iYWJseSBkb2luZyBpdCB3cm9uZy5cbiAgICBpZiAoIXNwcml0ZXNTcGVlZFNhbXBsZXNbc3ByaXRlSW5mb1tcImlkXCJdXSkge1xuICAgICAgICBzcHJpdGVzU3BlZWRTYW1wbGVzW3Nwcml0ZUluZm9bXCJpZFwiXV0gPSB7XG4gICAgICAgICAgICBzYW1wbGVTaXplOiAwLFxuICAgICAgICAgICAgeFNwZWVkU2FtcGxlczogW10sXG4gICAgICAgICAgICB5U3BlZWRTYW1wbGVzOiBbXSxcbiAgICAgICAgICAgIGNoZWNrZWQ6IGZhbHNlXG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3ByaXRlMVNhbXBsaW5nID0gc3ByaXRlc1NwZWVkU2FtcGxlc1tzcHJpdGVJbmZvW1wiaWRcIl1dO1xuICAgICAgICBjb25zdCBtYXhTYW1wbGVTaXplID0gMTA7XG4gICAgICAgIGlmIChzcHJpdGUxU2FtcGxpbmcuc2FtcGxlU2l6ZSA8IG1heFNhbXBsZVNpemUpIHtcbiAgICAgICAgICAgICsrc3ByaXRlMVNhbXBsaW5nLnNhbXBsZVNpemU7XG4gICAgICAgICAgICBzcHJpdGUxU2FtcGxpbmcueFNwZWVkU2FtcGxlcy5wdXNoKHNwcml0ZUluZm9bXCJ4U3BlZWRcIl0pO1xuICAgICAgICAgICAgc3ByaXRlMVNhbXBsaW5nLnlTcGVlZFNhbXBsZXMucHVzaChzcHJpdGVJbmZvW1wieVNwZWVkXCJdKTtcbiAgICAgICAgfSBlbHNlIGlmICghc3ByaXRlMVNhbXBsaW5nLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIHNwcml0ZTFTYW1wbGluZy5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IHNzID0gc3ByaXRlMVNhbXBsaW5nLnNhbXBsZVNpemU7XG4gICAgICAgICAgICBjb25zdCBzeFNhbXBsZXMgPSBzcHJpdGUxU2FtcGxpbmcueFNwZWVkU2FtcGxlcztcbiAgICAgICAgICAgIGNvbnN0IHN5U2FtcGxlcyA9IHNwcml0ZTFTYW1wbGluZy55U3BlZWRTYW1wbGVzO1xuXG4gICAgICAgICAgICBsZXQgc2FtZVhzcGVlZCA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHNzOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3hTYW1wbGVzW2ldICE9PSBzeFNhbXBsZXNbaSAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgIHNhbWVYc3BlZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNhbWVYc3BlZWQgJiYgc3hTYW1wbGVzWzBdICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coR1FHX1dBUk5JTkdfSU5fTVlQUk9HUkFNX01TR1xuICAgICAgICAgICAgICAgICAgICArIFwic3ByaXRlIGhpdCBkaXJlY3Rpb24gZnVuY3Rpb25hbGl0eS0gcG9zc2libHkgd3JvbmcgeFBvcyBjYWxjdWxhdGlvbiBmb3Igc3ByaXRlOiBcIlxuICAgICAgICAgICAgICAgICAgICArIHNwcml0ZUluZm9bXCJpZFwiXVxuICAgICAgICAgICAgICAgICAgICArIFwiLiAgRW5zdXJlIHhTcGVlZCB1c2VkIHZhbGlkbHkgaWYgc3ByaXRlIGhpdCBkaXJlY3Rpb25hbGl0eSBzZWVtcyB3cm9uZy5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzYW1lWXNwZWVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc3M7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChzeVNhbXBsZXNbaV0gIT09IHN5U2FtcGxlc1tpIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgc2FtZVlzcGVlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2FtZVlzcGVlZCAmJiBzeVNhbXBsZXNbMF0gIT09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhHUUdfV0FSTklOR19JTl9NWVBST0dSQU1fTVNHXG4gICAgICAgICAgICAgICAgICAgICsgXCJzcHJpdGUgaGl0IGRpcmVjdGlvbiBmdW5jdGlvbmFsaXR5LSBwb3NzaWJseSB3cm9uZyB5UG9zIGNhbGN1bGF0aW9uIGZvciBzcHJpdGU6IFwiXG4gICAgICAgICAgICAgICAgICAgICsgc3ByaXRlSW5mb1tcImlkXCJdXG4gICAgICAgICAgICAgICAgICAgICsgXCIuICBFbnN1cmUgeVNwZWVkIHVzZWQgdmFsaWRseSBpZiBzcHJpdGUgaGl0IGRpcmVjdGlvbmFsaXR5IHNlZW1zIHdyb25nLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVIaXREaXIgPSAoXG4gICAgc3ByaXRlMUluZm86IFNwcml0ZURpY3QsXG4gICAgc3ByaXRlMkluZm86IFNwcml0ZURpY3Rcbik6IFNwcml0ZUhpdERpcmVjdGlvbmFsaXR5ID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIGNoZWNrU3ByaXRlU3BlZWRVc2FnZUNvbW1vbkVycm9ycyhzcHJpdGUxSW5mbyk7XG4gICAgICAgIGNoZWNrU3ByaXRlU3BlZWRVc2FnZUNvbW1vbkVycm9ycyhzcHJpdGUySW5mbyk7XG4gICAgfVxuICAgIHJldHVybiBzcHJpdGVIaXREaXJJbXBsKHNwcml0ZTFJbmZvLCBzcHJpdGUySW5mbyk7XG59XG5jb25zdCBzcHJpdGVIaXREaXJJbXBsID0gKFxuICAgIHNwcml0ZTFJbmZvOiBTcHJpdGVQaHlzaWNhbERpbWVuc2lvbnMsXG4gICAgc3ByaXRlMkluZm86IFNwcml0ZVBoeXNpY2FsRGltZW5zaW9uc1xuKTogU3ByaXRlSGl0RGlyZWN0aW9uYWxpdHkgPT4ge1xuICAgIC8qXG4gICAgICAgUmV0dXJucyB0aGUgZGlyZWN0aW9uIHRoYXQgc3ByaXRlIDEgaGl0cyBzcHJpdGUgMiBmcm9tLlxuICAgICAgIHNwcml0ZSAxIGlzIHJlbGF0aXZlbHkgbGVmdC9yaWdodC91cC9kb3duIG9mIHNwcml0ZSAyXG4gICAgICAgXG4gICAgICAgSGl0IGRpcmVjdGlvbiByZXR1cm5lZCBjb3VsZCBiZSBtdWx0aXBsZSB2YWx1ZXMgKGUuZy4gbGVmdCBhbmQgdXApLFxuICAgICAgIGFuZCBpcyByZXR1cm5lZCBieSB0aGlzIGZ1bmN0aW9uIGFzIGEgZGljdGlvbmFyeSBhcywgZS5nLlxuICAgICAgIHtcbiAgICAgICBcImxlZnRcIjogZmFsc2UsXG4gICAgICAgXCJyaWdodFwiOiBmYWxzZSxcbiAgICAgICBcInVwXCI6IGZhbHNlLFxuICAgICAgIFwiZG93blwiOiBmYWxzZVxuICAgICAgIH1cbiAgICAgICBcbiAgICAgICBQYXJhbWV0ZXJzIHNwcml0ZXsxLDJ9SW5mbyBhcmUgZGljdGlvbmFyaWVzIHdpdGggYXQgbGVhc3QgdGhlc2Uga2V5czpcbiAgICAgICB7XG4gICAgICAgXCJpZFwiOiBcImFjdHVhbFNwcml0ZU5hbWVcIixcbiAgICAgICBcInhQb3NcIjogNTAwLFxuICAgICAgIFwieVBvc1wiOiAyMDAsXG4gICAgICAgXCJ4U3BlZWRcIjogLTgsICAvLyBtb3ZlbWVudCBtdXN0IGJlIGJ5IGRpY3Rpb25hcnksXG4gICAgICAgXCJ5U3BlZWRcIjogMCwgICAvLyB3aXRoIHNvbWV0aGluZyBsaWtlIHggPSB4ICsgeFNwZWVkXG4gICAgICAgXCJoZWlnaHRcIjogNzQsXG4gICAgICAgXCJ3aWR0aFwiOiA3NVxuICAgICAgIH1cbiAgICAgICAqL1xuXG4gICAgdmFyIHBlcmNlbnRNYXJnaW4gPSAxLjE7IC8vIHBvc2l0aXZlIHBlcmNlbnQgaW4gZGVjaW1hbFxuICAgIHZhciBkaXI6IFNwcml0ZUhpdERpcmVjdGlvbmFsaXR5ID0ge1xuICAgICAgICBcImxlZnRcIjogZmFsc2UsXG4gICAgICAgIFwicmlnaHRcIjogZmFsc2UsXG4gICAgICAgIFwidXBcIjogZmFsc2UsXG4gICAgICAgIFwiZG93blwiOiBmYWxzZVxuICAgIH07XG5cbiAgICAvLyBjdXJyZW50IGhvcml6b250YWwgcG9zaXRpb25cbiAgICB2YXIgczFsZWZ0ID0gc3ByaXRlMUluZm9bXCJ4UG9zXCJdO1xuICAgIHZhciBzMXJpZ2h0ID0gczFsZWZ0ICsgc3ByaXRlMUluZm9bXCJ3aWR0aFwiXTtcblxuICAgIHZhciBzMmxlZnQgPSBzcHJpdGUySW5mb1tcInhQb3NcIl07XG4gICAgdmFyIHMycmlnaHQgPSBzMmxlZnQgKyBzcHJpdGUySW5mb1tcIndpZHRoXCJdO1xuXG4gICAgLy8gcmV2ZXJzZSBob3Jpem9udGFsIHBvc2l0aW9uIGJ5IHhTcGVlZCB3aXRoIHBlcmNlbnQgbWFyZ2luXG4gICAgdmFyIHNwcml0ZTFYU3BlZWQgPSBzcHJpdGUxSW5mb1tcInhTcGVlZFwiXSAqIHBlcmNlbnRNYXJnaW47XG4gICAgczFsZWZ0ID0gczFsZWZ0IC0gc3ByaXRlMVhTcGVlZDtcbiAgICBzMXJpZ2h0ID0gczFyaWdodCAtIHNwcml0ZTFYU3BlZWQ7XG5cbiAgICB2YXIgc3ByaXRlMlhTcGVlZCA9IHNwcml0ZTJJbmZvW1wieFNwZWVkXCJdICogcGVyY2VudE1hcmdpbjtcbiAgICBzMmxlZnQgPSBzMmxlZnQgLSBzcHJpdGUyWFNwZWVkO1xuICAgIHMycmlnaHQgPSBzMnJpZ2h0IC0gc3ByaXRlMlhTcGVlZDtcblxuICAgIGlmIChzMXJpZ2h0IDw9IHMybGVmdCkge1xuICAgICAgICBkaXJbXCJsZWZ0XCJdID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHMycmlnaHQgPD0gczFsZWZ0KSB7XG4gICAgICAgIGRpcltcInJpZ2h0XCJdID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBjdXJyZW50IHZlcnRpY2FsIHBvc2l0aW9uXG4gICAgdmFyIHMxdG9wID0gc3ByaXRlMUluZm9bXCJ5UG9zXCJdO1xuICAgIHZhciBzMWJvdHRvbSA9IHMxdG9wICsgc3ByaXRlMUluZm9bXCJoZWlnaHRcIl07XG5cbiAgICB2YXIgczJ0b3AgPSBzcHJpdGUySW5mb1tcInlQb3NcIl07XG4gICAgdmFyIHMyYm90dG9tID0gczJ0b3AgKyBzcHJpdGUySW5mb1tcImhlaWdodFwiXTtcblxuICAgIC8vIHJldmVyc2UgdmVydGljYWwgcG9zaXRpb24gYnkgeVNwZWVkIHdpdGggcGVyY2VudCBtYXJnaW5cbiAgICB2YXIgc3ByaXRlMVlTcGVlZCA9IHNwcml0ZTFJbmZvW1wieVNwZWVkXCJdICogcGVyY2VudE1hcmdpbjtcbiAgICBzMXRvcCA9IHMxdG9wIC0gc3ByaXRlMVlTcGVlZDtcbiAgICBzMWJvdHRvbSA9IHMxYm90dG9tIC0gc3ByaXRlMVlTcGVlZDtcblxuICAgIHZhciBzcHJpdGUyWVNwZWVkID0gc3ByaXRlMkluZm9bXCJ5U3BlZWRcIl0gKiBwZXJjZW50TWFyZ2luO1xuICAgIHMydG9wID0gczJ0b3AgLSBzcHJpdGUyWVNwZWVkO1xuICAgIHMyYm90dG9tID0gczJib3R0b20gLSBzcHJpdGUyWVNwZWVkO1xuXG4gICAgaWYgKHMxYm90dG9tIDw9IHMydG9wKSB7XG4gICAgICAgIGRpcltcInVwXCJdID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHMyYm90dG9tIDw9IHMxdG9wKSB7XG4gICAgICAgIGRpcltcImRvd25cIl0gPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBkaXI7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0S2V5U3RhdGUgPSAoa2V5OiBudW1iZXIpOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gISEkLmdRLmtleVRyYWNrZXJba2V5XTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRNb3VzZVggPSAoKTogbnVtYmVyID0+IHtcbiAgICByZXR1cm4gJC5nUS5tb3VzZVRyYWNrZXIueDtcbn07XG5leHBvcnQgY29uc3QgZ2V0TW91c2VZID0gKCk6IG51bWJlciA9PiB7XG4gICAgcmV0dXJuICQuZ1EubW91c2VUcmFja2VyLnk7XG59O1xuZXhwb3J0IGNvbnN0IGdldE1vdXNlQnV0dG9uMSA9ICgpOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gISEkLmdRLm1vdXNlVHJhY2tlclsxXTtcbn07XG5leHBvcnQgY29uc3QgZ2V0TW91c2VCdXR0b24yID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiAhISQuZ1EubW91c2VUcmFja2VyWzJdO1xufTtcbmV4cG9ydCBjb25zdCBnZXRNb3VzZUJ1dHRvbjMgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgcmV0dXJuICEhJC5nUS5tb3VzZVRyYWNrZXJbM107XG59O1xuXG5leHBvcnQgY29uc3QgZGlzYWJsZUNvbnRleHRNZW51ID0gKCk6IHZvaWQgPT4ge1xuICAgIC8vIHNlZSBhbHNvOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80OTIwMjIxL2pxdWVyeS1qcy1wcmV2ZW50LXJpZ2h0LWNsaWNrLW1lbnUtaW4tYnJvd3NlcnNcbiAgICAvLyAkKFwiI3BsYXlncm91bmRcIikuY29udGV4dG1lbnUoZnVuY3Rpb24oKXtyZXR1cm4gZmFsc2U7fSk7XG4gICAgJChcIiNwbGF5Z3JvdW5kXCIpLm9uKFwiY29udGV4dG1lbnVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG59O1xuZXhwb3J0IGNvbnN0IGVuYWJsZUNvbnRleHRNZW51ID0gKCk6IHZvaWQgPT4ge1xuICAgIC8vIHNlZSBhbHNvOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80OTIwMjIxL2pxdWVyeS1qcy1wcmV2ZW50LXJpZ2h0LWNsaWNrLW1lbnUtaW4tYnJvd3NlcnNcbiAgICAkKFwiI3BsYXlncm91bmRcIikub2ZmKFwiY29udGV4dG1lbnVcIik7XG59O1xuXG5leHBvcnQgY29uc3QgaGlkZU1vdXNlQ3Vyc29yID0gKCk6IHZvaWQgPT4ge1xuICAgICQoXCIjcGxheWdyb3VuZFwiKS5jc3MoXCJjdXJzb3JcIiwgXCJub25lXCIpO1xufTtcbmV4cG9ydCBjb25zdCBzaG93TW91c2VDdXJzb3IgPSAoKTogdm9pZCA9PiB7XG4gICAgJChcIiNwbGF5Z3JvdW5kXCIpLmNzcyhcImN1cnNvclwiLCBcImRlZmF1bHRcIik7XG59O1xuXG5leHBvcnQgY29uc3Qgc2F2ZURpY3Rpb25hcnlBcyA9IChzYXZlQXM6IHN0cmluZywgZGljdGlvbmFyeTogb2JqZWN0KTogdm9pZCA9PiB7XG4gICAgLy8gcmVxdWlyZXMganMtY29va2llOiBodHRwczovL2dpdGh1Yi5jb20vanMtY29va2llL2pzLWNvb2tpZS90cmVlL3YyLjAuNFxuICAgIENvb2tpZXMuc2V0KFwiR1FHX1wiICsgc2F2ZUFzLCBkaWN0aW9uYXJ5KTtcbn07XG5leHBvcnQgY29uc3QgZ2V0U2F2ZWREaWN0aW9uYXJ5ID0gKHNhdmVkQXM6IHN0cmluZyk6IG9iamVjdCA9PiB7XG4gICAgcmV0dXJuIENvb2tpZXMuZ2V0SlNPTihcIkdRR19cIiArIHNhdmVkQXMpO1xufTtcbmV4cG9ydCBjb25zdCBkZWxldGVTYXZlZERpY3Rpb25hcnkgPSAoc2F2ZWRBczogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgQ29va2llcy5yZW1vdmUoXCJHUUdfXCIgKyBzYXZlZEFzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVPdmFsSW5Hcm91cCA9IChcbiAgICBncm91cE5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgaWQ6IHN0cmluZyxcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHc6IG51bWJlcixcbiAgICBoOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgLy8gcm90ZGVnIGluIGRlZ3JlZXMgY2xvY2t3aXNlIG9uIHNjcmVlbiAocmVjYWxsIHktYXhpcyBwb2ludHMgZG93bndhcmRzISlcblxuICAgIGlmICghY29sb3IpIHtcbiAgICAgICAgY29sb3IgPSBcImdyYXlcIjtcbiAgICB9XG5cbiAgICBpZiAoIWdyb3VwTmFtZSkge1xuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRTcHJpdGUoaWQsIHsgd2lkdGg6IDEsIGhlaWdodDogMSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjcmVhdGVTcHJpdGVJbkdyb3VwKGdyb3VwTmFtZSwgaWQsIHsgd2lkdGg6IDEsIGhlaWdodDogMSB9KTtcbiAgICB9XG5cbiAgICB2YXIgYm9yZGVyX3JhZGl1cyA9ICh3IC8gMiArIFwicHggLyBcIiArIGggLyAyICsgXCJweFwiKTtcbiAgICBzcHJpdGUoaWQpXG4gICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIGNvbG9yKVxuICAgICAgICAuY3NzKFwiYm9yZGVyLXJhZGl1c1wiLCBib3JkZXJfcmFkaXVzKVxuICAgICAgICAuY3NzKFwiLW1vei1ib3JkZXItcmFkaXVzXCIsIGJvcmRlcl9yYWRpdXMpXG4gICAgICAgIC5jc3MoXCItd2Via2l0LWJvcmRlci1yYWRpdXNcIiwgYm9yZGVyX3JhZGl1cyk7XG5cbiAgICBzcHJpdGVTZXRXaWR0aEhlaWdodChpZCwgdywgaCk7XG4gICAgc3ByaXRlU2V0WFkoaWQsIHgsIHkpO1xuXG4gICAgaWYgKHJvdGRlZyAhPSBudWxsKSB7XG4gICAgICAgIGlmIChyb3RPcmlnaW5YICE9IG51bGwgJiYgcm90T3JpZ2luWSAhPSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgcm90T3JpZ2luID0gcm90T3JpZ2luWCArIFwicHggXCIgKyByb3RPcmlnaW5ZICsgXCJweFwiO1xuICAgICAgICAgICAgc3ByaXRlKGlkKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItd2Via2l0LXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItbW96LXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItbXMtdHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pXG4gICAgICAgICAgICAgICAgLmNzcyhcIi1vLXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCJ0cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbik7XG4gICAgICAgIH1cbiAgICAgICAgc3ByaXRlUm90YXRlKGlkLCByb3RkZWcpO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgY3JlYXRlT3ZhbCA9IChcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVPdmFsSW5Hcm91cChcbiAgICAgICAgbnVsbCxcbiAgICAgICAgaWQsXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHcsXG4gICAgICAgIGgsXG4gICAgICAgIGNvbG9yLFxuICAgICAgICByb3RkZWcsXG4gICAgICAgIHJvdE9yaWdpblgsXG4gICAgICAgIHJvdE9yaWdpbllcbiAgICApO1xufTtcbmV4cG9ydCBjb25zdCBkcmF3T3ZhbCA9IChcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHc6IG51bWJlcixcbiAgICBoOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgY3JlYXRlT3ZhbChcbiAgICAgICAgXCJHUUdfb3ZhbF9cIiArIEdRR19nZXRVbmlxdWVJZCgpLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICB3LFxuICAgICAgICBoLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlQ2lyY2xlSW5Hcm91cCA9IChcbiAgICBncm91cE5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgaWQ6IHN0cmluZyxcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHI6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVPdmFsSW5Hcm91cChcbiAgICAgICAgZ3JvdXBOYW1lLFxuICAgICAgICBpZCxcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgcixcbiAgICAgICAgcixcbiAgICAgICAgY29sb3IsXG4gICAgICAgIHJvdGRlZyxcbiAgICAgICAgcm90T3JpZ2luWCxcbiAgICAgICAgcm90T3JpZ2luWVxuICAgICk7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUNpcmNsZSA9IChcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgcjogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHJvdGRlZz86IG51bWJlcixcbiAgICByb3RPcmlnaW5YPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblk/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZUNpcmNsZUluR3JvdXAoXG4gICAgICAgIG51bGwsXG4gICAgICAgIGlkLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICByLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5leHBvcnQgY29uc3QgZHJhd0NpcmNsZSA9IChcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHI6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVDaXJjbGUoXG4gICAgICAgIFwiR1FHX2NpcmNsZV9cIiArIEdRR19nZXRVbmlxdWVJZCgpLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICByLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVSZWN0SW5Hcm91cCA9IChcbiAgICBncm91cE5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgaWQ6IHN0cmluZyxcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHc6IG51bWJlcixcbiAgICBoOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgLy8gcm90ZGVnIGluIGRlZ3JlZXMgY2xvY2t3aXNlIG9uIHNjcmVlbiAocmVjYWxsIHktYXhpcyBwb2ludHMgZG93bndhcmRzISlcbiAgICAvLyByb3RPcmlnaW57WCxZfSBtdXN0IGJlIHdpdGhpbiByYW5nZSBvZiB3aWRlIHcgYW5kIGhlaWdodCBoLCBhbmQgcmVsYXRpdmUgdG8gY29vcmRpbmF0ZSAoeCx5KS5cblxuICAgIGlmICghY29sb3IpIHtcbiAgICAgICAgY29sb3IgPSBcImdyYXlcIjtcbiAgICB9XG5cbiAgICBpZiAoIWdyb3VwTmFtZSkge1xuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRTcHJpdGUoaWQsIHsgd2lkdGg6IDEsIGhlaWdodDogMSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjcmVhdGVTcHJpdGVJbkdyb3VwKGdyb3VwTmFtZSwgaWQsIHsgd2lkdGg6IDEsIGhlaWdodDogMSB9KTtcbiAgICB9XG5cbiAgICBzcHJpdGUoaWQpLmNzcyhcImJhY2tncm91bmRcIiwgY29sb3IpO1xuXG4gICAgc3ByaXRlU2V0V2lkdGhIZWlnaHQoaWQsIHcsIGgpO1xuICAgIHNwcml0ZVNldFhZKGlkLCB4LCB5KTtcblxuICAgIGlmIChyb3RkZWcgIT0gbnVsbCkge1xuICAgICAgICBpZiAocm90T3JpZ2luWCAhPSBudWxsICYmIHJvdE9yaWdpblkgIT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIHJvdE9yaWdpbiA9IHJvdE9yaWdpblggKyBcInB4IFwiICsgcm90T3JpZ2luWSArIFwicHhcIjtcbiAgICAgICAgICAgIHNwcml0ZShpZClcbiAgICAgICAgICAgICAgICAuY3NzKFwiLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbilcbiAgICAgICAgICAgICAgICAuY3NzKFwiLW1vei10cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbilcbiAgICAgICAgICAgICAgICAuY3NzKFwiLW1zLXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItby10cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbilcbiAgICAgICAgICAgICAgICAuY3NzKFwidHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pO1xuICAgICAgICB9XG4gICAgICAgIHNwcml0ZVJvdGF0ZShpZCwgcm90ZGVnKTtcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVJlY3QgPSAoXG4gICAgaWQ6IHN0cmluZyxcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHc6IG51bWJlcixcbiAgICBoOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgY3JlYXRlUmVjdEluR3JvdXAoXG4gICAgICAgIG51bGwsXG4gICAgICAgIGlkLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICB3LFxuICAgICAgICBoLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5leHBvcnQgY29uc3QgZHJhd1JlY3QgPSAoXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICB3OiBudW1iZXIsXG4gICAgaDogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHJvdGRlZz86IG51bWJlcixcbiAgICByb3RPcmlnaW5YPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblk/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZVJlY3QoXG4gICAgICAgIFwiR1FHX3JlY3RfXCIgKyBHUUdfZ2V0VW5pcXVlSWQoKSxcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgdyxcbiAgICAgICAgaCxcbiAgICAgICAgY29sb3IsXG4gICAgICAgIHJvdGRlZyxcbiAgICAgICAgcm90T3JpZ2luWCxcbiAgICAgICAgcm90T3JpZ2luWVxuICAgICk7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlTGluZUluR3JvdXAgPSAoXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcgfCBudWxsLFxuICAgIGlkOiBzdHJpbmcsXG4gICAgeDE6IG51bWJlcixcbiAgICB5MTogbnVtYmVyLFxuICAgIHgyOiBudW1iZXIsXG4gICAgeTI6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICB0aGlja25lc3M/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGlmICghY29sb3IpIHtcbiAgICAgICAgY29sb3IgPSBcImdyYXlcIjtcbiAgICB9XG4gICAgaWYgKCF0aGlja25lc3MpIHtcbiAgICAgICAgdGhpY2tuZXNzID0gMjtcbiAgICB9XG4gICAgdmFyIHhkID0geDIgLSB4MTtcbiAgICB2YXIgeWQgPSB5MiAtIHkxO1xuICAgIHZhciBkaXN0ID0gTWF0aC5zcXJ0KHhkICogeGQgKyB5ZCAqIHlkKTtcblxuICAgIHZhciBhcmNDb3MgPSBNYXRoLmFjb3MoeGQgLyBkaXN0KTtcbiAgICBpZiAoeTIgPCB5MSkge1xuICAgICAgICBhcmNDb3MgKj0gLTE7XG4gICAgfVxuICAgIHZhciByb3RkZWcgPSBhcmNDb3MgKiAxODAgLyBNYXRoLlBJO1xuXG4gICAgdmFyIGhhbGZUaGljayA9IHRoaWNrbmVzcyAvIDI7XG4gICAgdmFyIGRyYXdZMSA9IHkxIC0gaGFsZlRoaWNrO1xuXG4gICAgY3JlYXRlUmVjdEluR3JvdXAoXG4gICAgICAgIGdyb3VwTmFtZSxcbiAgICAgICAgaWQsXG4gICAgICAgIHgxLFxuICAgICAgICBkcmF3WTEsXG4gICAgICAgIGRpc3QsXG4gICAgICAgIHRoaWNrbmVzcyxcbiAgICAgICAgY29sb3IsXG4gICAgICAgIHJvdGRlZyxcbiAgICAgICAgMCxcbiAgICAgICAgaGFsZlRoaWNrXG4gICAgKTtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlTGluZSA9IChcbiAgICBpZDogc3RyaW5nLFxuICAgIHgxOiBudW1iZXIsXG4gICAgeTE6IG51bWJlcixcbiAgICB4MjogbnVtYmVyLFxuICAgIHkyOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgdGhpY2tuZXNzPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVMaW5lSW5Hcm91cChudWxsLCBpZCwgeDEsIHkxLCB4MiwgeTIsIGNvbG9yLCB0aGlja25lc3MpO1xufTtcbmV4cG9ydCBjb25zdCBkcmF3TGluZSA9IChcbiAgICB4MTogbnVtYmVyLFxuICAgIHkxOiBudW1iZXIsXG4gICAgeDI6IG51bWJlcixcbiAgICB5MjogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHRoaWNrbmVzcz86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgY3JlYXRlTGluZShcIkdRR19saW5lX1wiICsgR1FHX2dldFVuaXF1ZUlkKCksIHgxLCB5MSwgeDIsIHkyLCBjb2xvciwgdGhpY2tuZXNzKTtcbn07XG5cbmV4cG9ydCB0eXBlIENvbnRhaW5lckl0ZXJhdG9yID0ge1xuICAgIG5leHQ6ICgpID0+IFtudW1iZXIsIG51bWJlcl07XG4gICAgaGFzTmV4dDogKCkgPT4gYm9vbGVhbjtcbiAgICBjdXJyZW50OiBudW1iZXI7XG4gICAgZW5kOiBudW1iZXI7XG4gICAgX2tleXM6IHN0cmluZ1tdO1xufTtcbmV4cG9ydCB0eXBlIE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuID0gKG46IG51bWJlcikgPT4gbnVtYmVyIHwgUmVjb3JkPFxuICAgIG51bWJlcixcbiAgICBudW1iZXJcbj47XG5leHBvcnQgdHlwZSBDcmVhdGVDb250YWluZXJJdGVyYXRvckZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyXG4gICAgKTogQ29udGFpbmVySXRlcmF0b3I7XG4gICAgKHRoaXM6IHZvaWQsIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuKTogQ29udGFpbmVySXRlcmF0b3I7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUNvbnRhaW5lckl0ZXJhdG9yOiBDcmVhdGVDb250YWluZXJJdGVyYXRvckZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgc3RhcnQ/OiBudW1iZXIsXG4gICAgZW5kPzogbnVtYmVyLFxuICAgIHN0ZXBzaXplPzogbnVtYmVyXG4pOiBDb250YWluZXJJdGVyYXRvciB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGYgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgY29uc3QgZk93blByb3BOYW1lczogc3RyaW5nW10gPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhmKTtcbiAgICAgICAgY29uc3QgaXQ6IENvbnRhaW5lckl0ZXJhdG9yID0ge1xuICAgICAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgICAgIGVuZDogZk93blByb3BOYW1lcy5sZW5ndGgsXG4gICAgICAgICAgICBfa2V5czogZk93blByb3BOYW1lcyxcbiAgICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uICh0aGlzOiBDb250YWluZXJJdGVyYXRvcik6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1JZHggPSB0aGlzLl9rZXlzW3RoaXMuY3VycmVudF07XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbTogW251bWJlciwgbnVtYmVyXSA9IFtOdW1iZXIoaXRlbUlkeCksIGZbaXRlbUlkeF1dO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCsrO1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhhc05leHQ6IGZ1bmN0aW9uICh0aGlzOiBDb250YWluZXJJdGVyYXRvcik6IGJvb2xlYW4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAodGhpcy5jdXJyZW50IDwgdGhpcy5lbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gaXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcInN0YXJ0IG11c3QgYmUgYSBudW1iZXIuXCIsIHN0YXJ0KTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcImVuZCBtdXN0IGJlIGEgbnVtYmVyLlwiLCBlbmQpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwic3RlcHNpemUgbXVzdCBiZSBhIG51bWJlci5cIiwgc3RlcHNpemUpO1xuICAgICAgICBpZiAoc3RhcnQgPT0gbnVsbCB8fCBlbmQgPT0gbnVsbCB8fCBzdGVwc2l6ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBcIlRTIHR5cGUgaGludFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZng6IChuOiBudW1iZXIpID0+IG51bWJlciA9ICh0eXBlb2YgZiA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICA/IChmIGFzICh4OiBudW1iZXIpID0+IG51bWJlcilcbiAgICAgICAgICAgIDogKHg6IG51bWJlcik6IG51bWJlciA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE51bWJlcihmW3hdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBjb25zdCBpdDogQ29udGFpbmVySXRlcmF0b3IgPSB7XG4gICAgICAgICAgICBuZXh0OiBmdW5jdGlvbiAodGhpczogQ29udGFpbmVySXRlcmF0b3IpOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtOiBbbnVtYmVyLCBudW1iZXJdID0gW3RoaXMuY3VycmVudCwgZngodGhpcy5jdXJyZW50KV07XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50ICs9IHN0ZXBzaXplO1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhhc05leHQ6IGZ1bmN0aW9uICh0aGlzOiBDb250YWluZXJJdGVyYXRvcik6IGJvb2xlYW4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAodGhpcy5jdXJyZW50IDwgdGhpcy5lbmQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGN1cnJlbnQ6IHN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBlbmQsXG4gICAgICAgICAgICBfa2V5czogdHlwZW9mIGYgIT09IFwiZnVuY3Rpb25cIiA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGYpIDogKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgazogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSBzdGFydDsgaSA8IGVuZDsgaSArPSBzdGVwc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICBrLnB1c2goU3RyaW5nKGkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGs7XG4gICAgICAgICAgICB9KSgpXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBpdDtcbiAgICB9XG59O1xuZXhwb3J0IHR5cGUgR3JhcGhDcmVhdGlvbk9wdGlvbnMgPSB7XG4gICAgaW50ZXJwb2xhdGVkOiBib29sZWFuO1xufTtcbmV4cG9ydCB0eXBlIENyZWF0ZUdyYXBoV2l0aE9wdGlvbnNGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgbW9yZU9wdHM6IEdyYXBoQ3JlYXRpb25PcHRpb25zLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgcmFkaXVzX3RoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIG1vcmVPcHRzOiBHcmFwaENyZWF0aW9uT3B0aW9ucyxcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgbW9yZU9wdHM6IEdyYXBoQ3JlYXRpb25PcHRpb25zLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnMsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIHJhZGl1c190aGlja25lc3M6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnMsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgbW9yZU9wdHM6IEdyYXBoQ3JlYXRpb25PcHRpb25zXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG59O1xuZXhwb3J0IHR5cGUgR3JvdXBOYW1lQW5kSWRQcmVmaXggPSB7XG4gICAgXCJpZFwiOiBzdHJpbmc7XG4gICAgXCJncm91cFwiOiBzdHJpbmc7XG59O1xudHlwZSBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzID0gW1xuICAgIHN0cmluZyxcbiAgICBzdHJpbmcsXG4gICAgTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgR3JhcGhDcmVhdGlvbk9wdGlvbnNcbl07XG5leHBvcnQgY29uc3QgY3JlYXRlR3JhcGhXaXRoT3B0aW9uczogQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgaWQ6IHN0cmluZyxcbiAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnNcbik6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBtb3JlT3B0cywgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yLCByYWRpdXNfdGhpY2tuZXNzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIG1vcmVPcHRzLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgbW9yZU9wdHMsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIG1vcmVPcHRzLCBjb2xvciwgcmFkaXVzX3RoaWNrbmVzcylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBtb3JlT3B0cywgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgbW9yZU9wdHMpXG4gICAgLy8gbW9yZU9wdHMgPSB7XCJpbnRlcnBvbGF0ZWRcIjogdHJ1ZU9yRmFsc2V9XG4gICAgdmFyIGludGVycG9sYXRlZCA9IG1vcmVPcHRzW1wiaW50ZXJwb2xhdGVkXCJdO1xuXG4gICAgaWYgKCFpZCkge1xuICAgICAgICBpZCA9IFwiR1FHX2dyYXBoX1wiICsgR1FHX2dldFVuaXF1ZUlkKCk7XG4gICAgfVxuICAgIGlmICghZ3JvdXBOYW1lKSB7XG4gICAgICAgIGdyb3VwTmFtZSA9IGlkICsgXCJfZ3JvdXBcIjtcbiAgICAgICAgY3JlYXRlR3JvdXBJblBsYXlncm91bmQoZ3JvdXBOYW1lKTtcbiAgICB9XG4gICAgdmFyIGdyb3VwX2lkID0ge1xuICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICBcImdyb3VwXCI6IGdyb3VwTmFtZVxuICAgIH07XG5cbiAgICB2YXIgY29sb3I7XG4gICAgdmFyIHJhZGl1c190aGlja25lc3M7XG4gICAgbGV0IGl0ZXI6IENvbnRhaW5lckl0ZXJhdG9yO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQgJiYgYXJndW1lbnRzLmxlbmd0aCA8PSA2ICYmXG4gICAgICAgIFwib2JqZWN0XCIgPT09IHR5cGVvZiAoZikpIHtcbiAgICAgICAgY29sb3IgPSBhcmd1bWVudHNbNF07XG4gICAgICAgIHJhZGl1c190aGlja25lc3MgPSBhcmd1bWVudHNbNV07XG4gICAgICAgIGl0ZXIgPSBjcmVhdGVDb250YWluZXJJdGVyYXRvcihmKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNyAmJiBhcmd1bWVudHMubGVuZ3RoIDw9IDkpIHtcbiAgICAgICAgdmFyIHN0YXJ0ID0gYXJndW1lbnRzWzRdO1xuICAgICAgICB2YXIgZW5kID0gYXJndW1lbnRzWzVdO1xuICAgICAgICB2YXIgc3RlcHNpemUgPSBhcmd1bWVudHNbNl07XG4gICAgICAgIGNvbG9yID0gYXJndW1lbnRzWzddO1xuICAgICAgICByYWRpdXNfdGhpY2tuZXNzID0gYXJndW1lbnRzWzhdO1xuICAgICAgICBpdGVyID0gY3JlYXRlQ29udGFpbmVySXRlcmF0b3IoZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJGdW5jdGlvbiB1c2VkIHdpdGggd3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50c1wiKTtcbiAgICAgICAgdGhyb3cgXCJUUyB0eXBlIGhpbnRcIjtcbiAgICB9XG5cbiAgICBpZiAoY29sb3IgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbG9yID0gXCJncmF5XCI7XG4gICAgfVxuICAgIGlmIChyYWRpdXNfdGhpY2tuZXNzID09IHVuZGVmaW5lZCkge1xuICAgICAgICByYWRpdXNfdGhpY2tuZXNzID0gMjtcbiAgICB9XG5cbiAgICB2YXIgY3VyclggPSBudWxsO1xuICAgIHZhciBjdXJyWSA9IG51bGw7XG4gICAgd2hpbGUgKGl0ZXIuaGFzTmV4dCgpKSB7XG4gICAgICAgIHZhciBpdGVtID0gaXRlci5uZXh0KCk7XG4gICAgICAgIHZhciBpID0gaXRlbVswXTtcbiAgICAgICAgdmFyIGZ4aSA9IGl0ZW1bMV07XG5cbiAgICAgICAgaWYgKGZ4aSA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgICAgIGZ4aSA9IEdRR19NQVhfU0FGRV9QTEFZR1JPVU5EX0lOVEVHRVI7XG4gICAgICAgIH0gZWxzZSBpZiAoZnhpID09PSAtSW5maW5pdHkpIHtcbiAgICAgICAgICAgIGZ4aSA9IEdRR19NSU5fU0FGRV9QTEFZR1JPVU5EX0lOVEVHRVI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VyclkgPT09IG51bGwgJiYgZnhpICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY3VyclggPSBpO1xuICAgICAgICAgICAgY3VyclkgPSBmeGk7XG4gICAgICAgICAgICBpZiAoIWludGVycG9sYXRlZCkge1xuICAgICAgICAgICAgICAgIGNyZWF0ZUNpcmNsZUluR3JvdXAoXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwX2lkW1wiZ3JvdXBcIl0sXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwX2lkW1wiaWRcIl0gKyBcIl9ncmFwaF9wdF9cIiArIGksXG4gICAgICAgICAgICAgICAgICAgIGksXG4gICAgICAgICAgICAgICAgICAgIGZ4aSxcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzX3RoaWNrbmVzcyxcbiAgICAgICAgICAgICAgICAgICAgY29sb3JcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZ4aSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmICghaW50ZXJwb2xhdGVkKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlQ2lyY2xlSW5Hcm91cChcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBfaWRbXCJncm91cFwiXSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBfaWRbXCJpZFwiXSArIFwiX2dyYXBoX3B0X1wiICsgaSxcbiAgICAgICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICAgICAgZnhpLFxuICAgICAgICAgICAgICAgICAgICByYWRpdXNfdGhpY2tuZXNzLFxuICAgICAgICAgICAgICAgICAgICBjb2xvclxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNyZWF0ZUxpbmVJbkdyb3VwKFxuICAgICAgICAgICAgICAgICAgICBncm91cF9pZFtcImdyb3VwXCJdLFxuICAgICAgICAgICAgICAgICAgICBncm91cF9pZFtcImlkXCJdICsgXCJfZ3JhcGhfbGluZV9cIiArIGN1cnJYICsgXCItXCIgKyBpLFxuICAgICAgICAgICAgICAgICAgICBjdXJyWCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIGN1cnJZIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICAgICAgZnhpLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzX3RoaWNrbmVzc1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyWCA9IGk7XG4gICAgICAgICAgICBjdXJyWSA9IGZ4aTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBncm91cF9pZDtcbn07XG5cbnR5cGUgQ3JlYXRlR3JhcGhJbkdyb3VwRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXJcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuXG4gICAgKTogdm9pZDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlR3JhcGhJbkdyb3VwOiBDcmVhdGVHcmFwaEluR3JvdXBGbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgIGlkOiBzdHJpbmcsXG4gICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm5cbik6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmKVxuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBhcmdzLnNwbGljZSgzLCAwLCB7IFwiaW50ZXJwb2xhdGVkXCI6IGZhbHNlIH0pO1xuICAgIHJldHVybiBjcmVhdGVHcmFwaFdpdGhPcHRpb25zLmFwcGx5KFxuICAgICAgICB0aGlzLFxuICAgICAgICBhcmdzIGFzIENyZWF0ZUdyYXBoV2l0aE9wdGlvbnNGblBhcmFtVHlwZXNcbiAgICApO1xufTtcblxudHlwZSBDcmVhdGVHcmFwaEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAodGhpczogdm9pZCwgaWQ6IHN0cmluZywgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4pOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlR3JhcGg6IENyZWF0ZUdyYXBoRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZFxuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXgge1xuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSlcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYpXG4gICAgdmFyIG9wdHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIG9wdHMuc3BsaWNlKDAsIDAsIG51bGwpO1xuICAgIG9wdHMuc3BsaWNlKDMsIDAsIHsgXCJpbnRlcnBvbGF0ZWRcIjogZmFsc2UgfSk7XG4gICAgcmV0dXJuIGNyZWF0ZUdyYXBoV2l0aE9wdGlvbnMuYXBwbHkoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIG9wdHMgYXMgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuUGFyYW1UeXBlc1xuICAgICk7XG59O1xuXG50eXBlIERyYXdHcmFwaEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAodGhpczogdm9pZCwgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4pOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbn07XG5leHBvcnQgY29uc3QgZHJhd0dyYXBoOiBEcmF3R3JhcGhGbiA9IGZ1bmN0aW9uIGRyYXdHcmFwaChcbiAgICB0aGlzOiB2b2lkXG4pOiBHcm91cE5hbWVBbmRJZFByZWZpeCB7XG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yLCBkb3RSYWRpdXMpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYsIGNvbG9yLCBkb3RSYWRpdXMpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZilcbiAgICB2YXIgb3B0cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgb3B0cy5zcGxpY2UoMCwgMCwgbnVsbCk7XG4gICAgb3B0cy5zcGxpY2UoMCwgMCwgbnVsbCk7XG4gICAgb3B0cy5zcGxpY2UoMywgMCwgeyBcImludGVycG9sYXRlZFwiOiBmYWxzZSB9KTtcbiAgICByZXR1cm4gY3JlYXRlR3JhcGhXaXRoT3B0aW9ucy5hcHBseShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgb3B0cyBhcyBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzXG4gICAgKTtcbn07XG5cbnR5cGUgQ3JlYXRlSW50ZXJwb2xhdGVkR3JhcGhJbkdyb3VwRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICB0aGlja25lc3M6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICB0aGlja25lc3M6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm5cbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlSW50ZXJwb2xhdGVkR3JhcGhJbkdyb3VwOiBDcmVhdGVJbnRlcnBvbGF0ZWRHcmFwaEluR3JvdXBGbiA9XG4gICAgZnVuY3Rpb24gKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm5cbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeCB7XG4gICAgICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvciwgdGhpY2tuZXNzKVxuICAgICAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplKVxuICAgICAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBjb2xvciwgdGhpY2tuZXNzKVxuICAgICAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBjb2xvcilcbiAgICAgICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZilcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICBhcmdzLnNwbGljZSgzLCAwLCB7IFwiaW50ZXJwb2xhdGVkXCI6IHRydWUgfSk7XG4gICAgICAgIHJldHVybiBjcmVhdGVHcmFwaFdpdGhPcHRpb25zLmFwcGx5KFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIGFyZ3MgYXMgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuUGFyYW1UeXBlc1xuICAgICAgICApO1xuICAgIH07XG5cbnR5cGUgQ3JlYXRlSW50ZXJwb2xhdGVkR3JhcGhGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgdGhpY2tuZXNzOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgdGhpY2tuZXNzOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKHRoaXM6IHZvaWQsIGlkOiBzdHJpbmcsIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUludGVycG9sYXRlZEdyYXBoOiBDcmVhdGVJbnRlcnBvbGF0ZWRHcmFwaEZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWRcbik6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yLCB0aGlja25lc3MpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYsIGNvbG9yLCB0aGlja25lc3MpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmKVxuICAgIHZhciBvcHRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBvcHRzLnNwbGljZSgwLCAwLCBudWxsKTtcbiAgICBvcHRzLnNwbGljZSgzLCAwLCB7IFwiaW50ZXJwb2xhdGVkXCI6IHRydWUgfSk7XG4gICAgcmV0dXJuIGNyZWF0ZUdyYXBoV2l0aE9wdGlvbnMuYXBwbHkoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIG9wdHMgYXMgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuUGFyYW1UeXBlc1xuICAgICk7XG4gICAgLy8gcmV0dXJuIGNyZWF0ZUludGVycG9sYXRlZEdyYXBoSW5Hcm91cC5hcHBseSh0aGlzLCBvcHRzKTtcbn07XG5cbnR5cGUgRHJhd0ludGVycG9sYXRlZEdyYXBoRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIHRoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIHRoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgICh0aGlzOiB2b2lkLCBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbik6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xufTtcbmV4cG9ydCBjb25zdCBkcmF3SW50ZXJwb2xhdGVkR3JhcGg6IERyYXdJbnRlcnBvbGF0ZWRHcmFwaEZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWRcbik6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIHRoaWNrbmVzcylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgY29sb3IsIHRoaWNrbmVzcylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmKVxuICAgIHZhciBvcHRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBvcHRzLnNwbGljZSgwLCAwLCBudWxsKTtcbiAgICBvcHRzLnNwbGljZSgwLCAwLCBudWxsKTtcbiAgICBvcHRzLnNwbGljZSgzLCAwLCB7IFwiaW50ZXJwb2xhdGVkXCI6IHRydWUgfSk7XG4gICAgcmV0dXJuIGNyZWF0ZUdyYXBoV2l0aE9wdGlvbnMuYXBwbHkoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIG9wdHMgYXMgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuUGFyYW1UeXBlc1xuICAgICk7XG59O1xuIl19