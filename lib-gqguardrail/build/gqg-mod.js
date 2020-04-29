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
            if (typeof (theAnimation) !== "object" || ("imageUrl" in theAnimation && typeof (theAnimation["imageURL"]) !== "string")) {
                throwConsoleErrorInMyprogram("createSpriteInGroup cannot use this as an animation: " + theAnimation);
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
            else if ("imageUrl" in theAnimation && typeof (theAnimation["imageURL"]) === "string") {
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
       const spriteScale = (spriteName, ratio) => {
    if (GQG_DEBUG) {
        throwIfSpriteNameInvalid(spriteName);
        throwIfNotFiniteNumber("Ratio must be a number.", ratio);
    }
    $("#" + spriteName).scale(ratio);
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
       const forEachSpriteSpriteCollisionDo = (sprite1Name, sprite2Name, collisionHandlingFunction) => {
    $("#" + sprite1Name).collision(".gQ_group, #" + sprite2Name).each(collisionHandlingFunction);
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
    $("#" + sprite1Name).collision("#" + groupName + ", .gQ_sprite").each(collisionHandlingFunction);
    // collisionHandlingFunction can optionally take two arguments: collIndex, hitSprite
    // see http://api.jquery.com/jQuery.each
};
       const forEachSpriteGroupHit = forEachSpriteGroupCollisionDo;
       const forEachSpriteFilteredCollisionDo = (sprite1Name, filterStr, collisionHandlingFunction) => {
    $("#" + sprite1Name).collision(filterStr).each(collisionHandlingFunction);
    // see http://gamequeryjs.com/documentation/api/#collision for filterStr spec
    // collisionHandlingFunction can optionally take two arguments: collIndex, hitSprite
    // see http://api.jquery.com/jQuery.each
};
       const forEachSpriteFilteredHit = forEachSpriteFilteredCollisionDo;
       const spriteHitDirection = (sprite1Id, sprite1X, sprite1Y, sprite1XSpeed, sprite1YSpeed, sprite1Width, sprite1Height, sprite2Id, sprite2X, sprite2Y, sprite2XSpeed, sprite2YSpeed, sprite2Width, sprite2Height) => {
    var sprite1Info = {
        "id": sprite1Id,
        "xpos": sprite1X,
        "ypos": sprite1Y,
        "xspeed": sprite1XSpeed,
        "yspeed": sprite1YSpeed,
        "height": sprite1Height,
        "width": sprite1Width
    };
    var sprite2Info = {
        "id": sprite2Id,
        "xpos": sprite2X,
        "ypos": sprite2Y,
        "xspeed": sprite2XSpeed,
        "yspeed": sprite2YSpeed,
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
            xspeedSamples: [],
            yspeedSamples: [],
            checked: false
        };
    }
    else {
        const sprite1Sampling = spritesSpeedSamples[spriteInfo["id"]];
        const maxSampleSize = 10;
        if (sprite1Sampling.sampleSize < maxSampleSize) {
            ++sprite1Sampling.sampleSize;
            sprite1Sampling.xspeedSamples.push(spriteInfo["xspeed"]);
            sprite1Sampling.yspeedSamples.push(spriteInfo["yspeed"]);
        }
        else if (!sprite1Sampling.checked) {
            sprite1Sampling.checked = true;
            const ss = sprite1Sampling.sampleSize;
            const sxSamples = sprite1Sampling.xspeedSamples;
            const sySamples = sprite1Sampling.yspeedSamples;
            let sameXspeed = true;
            for (let i = 1; i < ss; ++i) {
                if (sxSamples[i] !== sxSamples[i - 1]) {
                    sameXspeed = false;
                    break;
                }
            }
            if (sameXspeed && sxSamples[0] !== 0) {
                console.log(GQG_WARNING_IN_MYPROGRAM_MSG
                    + "sprite hit direction functionality- possibly wrong xpos calculation for sprite: "
                    + spriteInfo["id"]
                    + ".  Ensure xspeed used validly if sprite hit directionality seems wrong.");
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
                    + "sprite hit direction functionality- possibly wrong ypos calculation for sprite: "
                    + spriteInfo["id"]
                    + ".  Ensure yspeed used validly if sprite hit directionality seems wrong.");
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
       "xpos": 500,
       "ypos": 200,
       "xspeed": -8,  // movement must be by dictionary,
       "yspeed": 0,   // with something like x = x + xspeed
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
    var s1left = sprite1Info["xpos"];
    var s1right = s1left + sprite1Info["width"];
    var s2left = sprite2Info["xpos"];
    var s2right = s2left + sprite2Info["width"];
    // reverse horizontal position by xspeed with percent margin
    var sprite1XSpeed = sprite1Info["xspeed"] * percentMargin;
    s1left = s1left - sprite1XSpeed;
    s1right = s1right - sprite1XSpeed;
    var sprite2XSpeed = sprite2Info["xspeed"] * percentMargin;
    s2left = s2left - sprite2XSpeed;
    s2right = s2right - sprite2XSpeed;
    if (s1right <= s2left) {
        dir["left"] = true;
    }
    if (s2right <= s1left) {
        dir["right"] = true;
    }
    // current vertical position
    var s1top = sprite1Info["ypos"];
    var s1bottom = s1top + sprite1Info["height"];
    var s2top = sprite2Info["ypos"];
    var s2bottom = s2top + sprite2Info["height"];
    // reverse vertical position by yspeed with percent margin
    var sprite1YSpeed = sprite1Info["yspeed"] * percentMargin;
    s1top = s1top - sprite1YSpeed;
    s1bottom = s1bottom - sprite1YSpeed;
    var sprite2YSpeed = sprite2Info["yspeed"] * percentMargin;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3FnLW1vZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9jaGVuZy9EZXNrdG9wL1RTLWRldi9mdW4tdGVybWluYWwtbGliLmdpdHJlcG8vbGliLWdxZ3VhcmRyYWlsL3NyYy9ncWctbW9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQTRCYixrREFBa0Q7QUFDbEQsSUFBSSxTQUFTLEdBQVksSUFBSSxDQUFDO0FBQzlCLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxDQUFDLEtBQWMsRUFBUSxFQUFFO0lBQ25ELElBQUksS0FBSyxFQUFFO1FBQ1AsU0FBUyxHQUFHLElBQUksQ0FBQztLQUNwQjtTQUFNO1FBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsR0FBRyxrRUFBa0UsQ0FBQyxDQUFDO1FBQy9HLFNBQVMsR0FBRyxLQUFLLENBQUM7S0FDckI7QUFDTCxDQUFDLENBQUM7QUFFRixNQUFNLGtDQUFrQyxHQUFHLDZCQUE2QixDQUFDO0FBQ3pFLE1BQU0sQ0FBQyxNQUFNLDRCQUE0QixHQUFHLENBQ3hDLGlCQUFrQyxFQUMzQixFQUFFO0lBQ1QsSUFBSSxPQUFPLGlCQUFpQixLQUFLLFFBQVE7UUFDckMsT0FBTyxpQkFBaUIsS0FBSyxRQUFRLEVBQUU7UUFDdkMsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFDRCxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNqRCxJQUFJLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUM5RSxXQUFXLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDL0MsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUMxQixPQUFPLEtBQUssQ0FBQztLQUNoQjtJQUVELE9BQU8sQ0FBQyxpQkFBaUIsS0FB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QXNCLENBQUMsS0FBSyxDQUMvQixJQUFJLEVBQ0osSUFBMEMsQ0FDN0MsQ0FBQztJQUNGLDJEQUEyRDtBQUMvRCxDQUFDLENBQUM7QUF3Q0YsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQTRCO0lBRzFELDREQUE0RDtJQUM1RCxpREFBaUQ7SUFDakQsMENBQTBDO0lBQzFDLHNDQUFzQztJQUN0QywyQkFBMkI7SUFDM0Isb0JBQW9CO0lBQ3BCLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqRCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLE9BQU8sc0JBQXNCLENBQUMsS0FBSyxDQUMvQixJQUFJLEVBQ0osSUFBMEMsQ0FDN0MsQ0FBQztBQUNOLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuLypcbiAqIENvcHlyaWdodCAyMDEyLCAyMDE2LCAyMDE3LCAyMDE5LCAyMDIwIENhcnNvbiBDaGVuZ1xuICogVGhpcyBTb3VyY2UgQ29kZSBGb3JtIGlzIHN1YmplY3QgdG8gdGhlIHRlcm1zIG9mIHRoZSBNb3ppbGxhIFB1YmxpY1xuICogTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpc1xuICogZmlsZSwgWW91IGNhbiBvYnRhaW4gb25lIGF0IGh0dHBzOi8vbW96aWxsYS5vcmcvTVBMLzIuMC8uXG4gKi9cbi8qXG4gKiBHUUd1YXJkcmFpbCB2MC44LjAgaXMgYSB3cmFwcGVyIGFyb3VuZCBnYW1lUXVlcnkgcmV2LiAwLjcuMS5cbiAqIE1ha2VzIHRoaW5ncyBtb3JlIHByb2NlZHVyYWwsIHdpdGggYSBiaXQgb2YgZnVuY3Rpb25hbC5cbiAqIEFkZHMgaW4gaGVscGZ1bCBlcnJvciBtZXNzYWdlcyBmb3Igc3R1ZGVudHMuXG4gKiBsb2FkIHRoaXMgYWZ0ZXIgZ2FtZVF1ZXJ5LlxuICovXG5cbmV4cG9ydCB0eXBlIHNwcml0ZURvbU9iamVjdCA9IHtcbiAgICB3aWR0aDogKG46IG51bWJlcikgPT4gc3ByaXRlRG9tT2JqZWN0O1xuICAgIGhlaWdodDogKG46IG51bWJlcikgPT4gc3ByaXRlRG9tT2JqZWN0O1xuICAgIHNldEFuaW1hdGlvbjogKG8/OiBvYmplY3QsIGY/OiBGdW5jdGlvbikgPT4gYW55O1xuICAgIGNzczogKGF0dHI6IHN0cmluZywgdmFsOiBzdHJpbmcgfCBudW1iZXIpID0+IHNwcml0ZURvbU9iamVjdDtcbiAgICBwbGF5Z3JvdW5kOiAobzogb2JqZWN0KSA9PiBhbnk7XG59O1xuZGVjbGFyZSB2YXIgJDogYW55O1xuZGVjbGFyZSB2YXIgQ29va2llczoge1xuICAgIHNldDogKGFyZzA6IHN0cmluZywgYXJnMTogb2JqZWN0KSA9PiB2b2lkO1xuICAgIGdldEpTT046IChhcmcwOiBzdHJpbmcpID0+IG9iamVjdDtcbiAgICByZW1vdmU6IChhcmcwOiBzdHJpbmcpID0+IHZvaWQ7XG59O1xuXG4vLyBzdHVkZW50cyBhcmUgbm90IHN1cHBvc2VkIHRvIHVzZSBHUUdfIHZhcmlhYmxlc1xubGV0IEdRR19ERUJVRzogYm9vbGVhbiA9IHRydWU7XG5leHBvcnQgY29uc3Qgc2V0R3FEZWJ1Z0ZsYWcgPSAoZGVidWc6IGJvb2xlYW4pOiB2b2lkID0+IHtcbiAgICBpZiAoZGVidWcpIHtcbiAgICAgICAgR1FHX0RFQlVHID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhHUUdfV0FSTklOR19JTl9NWVBST0dSQU1fTVNHICsgXCJkZWJ1ZyBtb2RlIGRpc2FibGVkIGFuZCB5b3VyIGNvZGUgaXMgbm93IHJ1bm5pbmcgaW4gdW5zYWZlIG1vZGUuXCIpO1xuICAgICAgICBHUUdfREVCVUcgPSBmYWxzZTtcbiAgICB9XG59O1xuXG5jb25zdCBHUUdfU1BSSVRFX0dST1VQX05BTUVfRk9STUFUX1JFR0VYID0gL1thLXpBLVowLTlfXStbYS16QS1aMC05Xy1dKi87XG5leHBvcnQgY29uc3Qgc3ByaXRlR3JvdXBOYW1lRm9ybWF0SXNWYWxpZCA9IChcbiAgICBzcHJpdGVPckdyb3VwTmFtZTogc3RyaW5nIHwgbnVtYmVyXG4pOiBib29sZWFuID0+IHtcbiAgICBpZiAodHlwZW9mIHNwcml0ZU9yR3JvdXBOYW1lICE9PSBcInN0cmluZ1wiICYmXG4gICAgICAgIHR5cGVvZiBzcHJpdGVPckdyb3VwTmFtZSAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHNwcml0ZU9yR3JvdXBOYW1lID0gc3ByaXRlT3JHcm91cE5hbWUudG9TdHJpbmcoKTtcbiAgICBsZXQgbmFtZU1hdGNoZXMgPSBzcHJpdGVPckdyb3VwTmFtZS5tYXRjaChHUUdfU1BSSVRFX0dST1VQX05BTUVfRk9STUFUX1JFR0VYKTtcbiAgICBuYW1lTWF0Y2hlcyA9IChuYW1lTWF0Y2hlcyA/IG5hbWVNYXRjaGVzIDogW10pO1xuICAgIGlmIChuYW1lTWF0Y2hlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiAoc3ByaXRlT3JHcm91cE5hbWUgPT09IG5hbWVNYXRjaGVzWzBdKTtcbn07XG5cbmNvbnN0IEdRR19TSUdOQUxTOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiA9IHt9O1xubGV0IEdRR19VTklRVUVfSURfQ09VTlRFUiA9IDA7XG5cbmxldCBHUUdfUExBWUdST1VORF9XSURUSCA9IDY0MDtcbmxldCBHUUdfUExBWUdST1VORF9IRUlHSFQgPSA0ODA7XG5leHBvcnQgbGV0IFBMQVlHUk9VTkRfV0lEVEggPSBHUUdfUExBWUdST1VORF9XSURUSDsgLy8gc3R1ZGVudHMgYXJlIG5vdCBzdXBwb3NlZCB0byB1c2UgR1FHXyB2YXJpYWJsZXNcbmV4cG9ydCBsZXQgUExBWUdST1VORF9IRUlHSFQgPSBHUUdfUExBWUdST1VORF9IRUlHSFQ7XG5cbmV4cG9ydCBjb25zdCBBTklNQVRJT05fSE9SSVpPTlRBTDogbnVtYmVyID0gJC5nUS5BTklNQVRJT05fSE9SSVpPTlRBTDtcbmV4cG9ydCBjb25zdCBBTklNQVRJT05fVkVSVElDQUw6IG51bWJlciA9ICQuZ1EuQU5JTUFUSU9OX1ZFUlRJQ0FMO1xuZXhwb3J0IGNvbnN0IEFOSU1BVElPTl9PTkNFOiBudW1iZXIgPSAkLmdRLkFOSU1BVElPTl9PTkNFO1xuZXhwb3J0IGNvbnN0IEFOSU1BVElPTl9QSU5HUE9ORzogbnVtYmVyID0gJC5nUS5BTklNQVRJT05fUElOR1BPTkc7XG5leHBvcnQgY29uc3QgQU5JTUFUSU9OX0NBTExCQUNLOiBudW1iZXIgPSAkLmdRLkFOSU1BVElPTl9DQUxMQkFDSztcbmV4cG9ydCBjb25zdCBBTklNQVRJT05fTVVMVEk6IG51bWJlciA9ICQuZ1EuQU5JTUFUSU9OX01VTFRJO1xuXG5cbi8vIE1heC9NaW4gU2FmZSBQbGF5Z3JvdW5kIEludGVnZXJzIGZvdW5kIGJ5IGV4cGVyaW1lbnRpbmcgd2l0aCBHUSAwLjcuMSBpbiBGaXJlZm94IDQxLjAuMiBvbiBNYWMgT1MgWCAxMC4xMC41XG5jb25zdCBHUUdfTUlOX1NBRkVfUExBWUdST1VORF9JTlRFR0VSID0gLShNYXRoLnBvdygyLCAyNCkgLSAxKTsgLy8gY2YuIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL051bWJlci9NSU5fU0FGRV9JTlRFR0VSXG5jb25zdCBHUUdfTUFYX1NBRkVfUExBWUdST1VORF9JTlRFR0VSID0gKE1hdGgucG93KDIsIDI0KSAtIDEpOyAvLyBjZi4gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTnVtYmVyL01BWF9TQUZFX0lOVEVHRVJcblxuXG5jb25zdCBHUUdfZ2V0VW5pcXVlSWQgPSAoKTogc3RyaW5nID0+IHtcbiAgICByZXR1cm4gRGF0ZS5ub3coKSArIFwiX1wiICsgR1FHX1VOSVFVRV9JRF9DT1VOVEVSKys7XG59O1xuXG5leHBvcnQgY29uc3Qgc2V0R3FQbGF5Z3JvdW5kRGltZW5zaW9ucyA9IChcbiAgICB3aWR0aDogbnVtYmVyLFxuICAgIGhlaWdodDogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICAvLyB0aGlzIG11c3QgYmUgZXhlY3V0ZWQgb3V0c2lkZSBvZiBzZXR1cCBhbmQgZHJhdyBmdW5jdGlvbnNcbiAgICBHUUdfUExBWUdST1VORF9IRUlHSFQgPSBoZWlnaHQ7XG4gICAgUExBWUdST1VORF9IRUlHSFQgPSBoZWlnaHQ7XG4gICAgR1FHX1BMQVlHUk9VTkRfV0lEVEggPSB3aWR0aDtcbiAgICBQTEFZR1JPVU5EX1dJRFRIID0gd2lkdGg7XG4gICAgc3ByaXRlKFwicGxheWdyb3VuZFwiKS53aWR0aCh3aWR0aCkuaGVpZ2h0KGhlaWdodCk7XG59O1xuXG5leHBvcnQgY29uc3QgY3VycmVudERhdGUgPSAoKTogbnVtYmVyID0+IHtcbiAgICByZXR1cm4gRGF0ZS5ub3coKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjb25zb2xlUHJpbnQgPSAoLi4udHh0OiBhbnkpOiB2b2lkID0+IHtcbiAgICAvLyBtaWdodCB3b3JrIG9ubHkgaW4gQ2hyb21lIG9yIGlmIHNvbWUgZGV2ZWxvcG1lbnQgYWRkLW9ucyBhcmUgaW5zdGFsbGVkXG4gICAgY29uc29sZS5sb2coLi4udHh0KTtcbn07XG5cblxuY29uc3QgR1FHX0lOX01ZUFJPR1JBTV9NU0cgPSAnaW4gXCJteXByb2dyYW0udHNcIi0gJztcbmNvbnN0IEdRR19FUlJPUl9JTl9NWVBST0dSQU1fTVNHID0gXCJFcnJvciBcIiArIEdRR19JTl9NWVBST0dSQU1fTVNHO1xuY29uc3QgR1FHX1dBUk5JTkdfSU5fTVlQUk9HUkFNX01TRyA9ICdXYXJuaW5nICcgKyBHUUdfSU5fTVlQUk9HUkFNX01TRztcblxuY29uc3QgcHJpbnRFcnJvclRvQ29uc29sZU9uY2UgPSAoKCkgPT4ge1xuICAgIHZhciB0aHJvd0NvbnNvbGVFcnJvcl9wcmludGVkOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiA9IHt9O1xuICAgIHJldHVybiAobXNnOiBzdHJpbmcpID0+IHtcbiAgICAgICAgLy8gRmlyZWZveCB3b3VsZG4ndCBwcmludCB1bmNhdWdodCBleGNlcHRpb25zIHdpdGggZmlsZSBuYW1lL2xpbmUgbnVtYmVyXG4gICAgICAgIC8vIGJ1dCBhZGRpbmcgXCJuZXcgRXJyb3IoKVwiIHRvIHRoZSB0aHJvdyBiZWxvdyBmaXhlZCBpdC4uLlxuICAgICAgICBpZiAoIXRocm93Q29uc29sZUVycm9yX3ByaW50ZWRbbXNnXSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yOiBcIiArIG1zZyk7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvcl9wcmludGVkW21zZ10gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5jb25zdCB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtID0gKG1zZzogc3RyaW5nKTogbmV2ZXIgPT4ge1xuICAgIC8vIEZpcmVmb3ggd291bGRuJ3QgcHJpbnQgdW5jYXVnaHQgZXhjZXB0aW9ucyB3aXRoIGZpbGUgbmFtZS9saW5lIG51bWJlclxuICAgIC8vIGJ1dCBhZGRpbmcgXCJuZXcgRXJyb3IoKVwiIHRvIHRoZSB0aHJvdyBiZWxvdyBmaXhlZCBpdC4uLlxuICAgIHRocm93IG5ldyBFcnJvcihHUUdfSU5fTVlQUk9HUkFNX01TRyArIG1zZyk7XG59O1xuXG5jb25zdCB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQgPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgaWYgKHR5cGVvZiBzcHJpdGVOYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTcHJpdGUgbmFtZSBtdXN0IGJlIGEgU3RyaW5nLCBub3Q6IFwiICsgc3ByaXRlTmFtZSk7XG4gICAgfSBlbHNlIGlmICghc3ByaXRlRXhpc3RzKHNwcml0ZU5hbWUpKSB7XG4gICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTcHJpdGUgZG9lc24ndCBleGlzdDogXCIgKyBzcHJpdGVOYW1lKTtcbiAgICB9XG59O1xuTnVtYmVyLmlzRmluaXRlID0gTnVtYmVyLmlzRmluaXRlIHx8IGZ1bmN0aW9uICh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gICAgLy8gc2VlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9OdW1iZXIvaXNGaW5pdGVcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2YWx1ZSk7XG59O1xuY29uc3QgdGhyb3dJZk5vdEZpbml0ZU51bWJlciA9IChtc2c6IHN0cmluZywgdmFsOiBhbnkpOiB2b2lkID0+IHsgLy8gZS5nLiB0aHJvdyBpZiBOYU4sIEluZmluaXR5LCBudWxsXG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUodmFsKSkge1xuICAgICAgICBtc2cgPSBtc2cgfHwgXCJFeHBlY3RlZCBhIG51bWJlci5cIjtcbiAgICAgICAgbXNnICs9IFwiIFlvdSB1c2VkXCI7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBtc2cgKz0gXCIgdGhlIFN0cmluZzogXFxcIlwiICsgdmFsICsgXCJcXFwiXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtc2cgKz0gXCI6IFwiICsgdmFsO1xuICAgICAgICB9XG4gICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0obXNnKTtcbiAgICB9XG59O1xuXG5leHBvcnQgY29uc3QgdGhyb3dPbkltZ0xvYWRFcnJvciA9IChpbWdVcmw6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIC8vIHdoYXQgdGhpcyBmdW5jdGlvbiB0aHJvd3MgbXVzdCBub3QgYmUgY2F1Z2h0IGJ5IGNhbGxlciB0aG8uLi5cbiAgICBpZiAoaW1nVXJsLnN1YnN0cmluZyhpbWdVcmwubGVuZ3RoIC0gXCIuZ2lmXCIubGVuZ3RoKS50b0xvd2VyQ2FzZSgpID09PSBcIi5naWZcIikge1xuICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiaW1hZ2UgZmlsZSBmb3JtYXQgbm90IHN1cHBvcnRlZDogR0lGXCIpO1xuICAgIH1cbiAgICBsZXQgdGhyb3dhYmxlRXJyID0gbmV3IEVycm9yKFwiaW1hZ2UgZmlsZSBub3QgZm91bmQ6IFwiICsgaW1nVXJsKTtcbiAgICAkKFwiPGltZy8+XCIpLm9uKFwiZXJyb3JcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoISF0aHJvd2FibGVFcnIgJiYgdGhyb3dhYmxlRXJyLnN0YWNrICYmXG4gICAgICAgICAgICB0aHJvd2FibGVFcnIuc3RhY2sudG9TdHJpbmcoKS5pbmRleE9mKFwibXlwcm9ncmFtLmpzXCIpID49IDApIHtcbiAgICAgICAgICAgIHRocm93YWJsZUVyci5tZXNzYWdlID0gR1FHX0VSUk9SX0lOX01ZUFJPR1JBTV9NU0cgKyB0aHJvd2FibGVFcnIubWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyB0aHJvd2FibGVFcnI7XG4gICAgfSkuYXR0cihcInNyY1wiLCBpbWdVcmwpO1xufTtcblxuXG5cbnR5cGUgTmV3R1FBbmltYXRpb25GbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIHVybE9yTWFwOiBzdHJpbmcsXG4gICAgICAgIG51bWJlck9mRnJhbWU6IG51bWJlcixcbiAgICAgICAgZGVsdGE6IG51bWJlcixcbiAgICAgICAgcmF0ZTogbnVtYmVyLFxuICAgICAgICB0eXBlOiBudW1iZXJcbiAgICApOiBTcHJpdGVBbmltYXRpb247XG4gICAgKHRoaXM6IHZvaWQsIHVybE9yTWFwOiBzdHJpbmcpOiBTcHJpdGVBbmltYXRpb247XG4gICAgKHRoaXM6IHZvaWQsIHVybE9yTWFwOiBvYmplY3QpOiBTcHJpdGVBbmltYXRpb247XG59O1xuZXhwb3J0IGNvbnN0IG5ld0dRQW5pbWF0aW9uOiBOZXdHUUFuaW1hdGlvbkZuID0gKCgpID0+IHtcbiAgICBsZXQgbWVtb0FuaW1zOiBNYXA8c3RyaW5nIHwgb2JqZWN0LCBTcHJpdGVBbmltYXRpb24+ID0gbmV3IE1hcDxvYmplY3QsIFNwcml0ZUFuaW1hdGlvbj4oKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICB1cmxPck1hcDogc3RyaW5nIHwgb2JqZWN0LFxuICAgICAgICBudW1iZXJPZkZyYW1lPzogbnVtYmVyLFxuICAgICAgICBkZWx0YT86IG51bWJlcixcbiAgICAgICAgcmF0ZT86IG51bWJlcixcbiAgICAgICAgdHlwZT86IG51bWJlclxuICAgICk6IFNwcml0ZUFuaW1hdGlvbiB7XG4gICAgICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA1KSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAodXJsT3JNYXApICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJGaXJzdCBhcmd1bWVudCBmb3IgbmV3R1FBbmltYXRpb24gbXVzdCBiZSBhIFN0cmluZy4gSW5zdGVhZCBmb3VuZDogXCIgKyB1cmxPck1hcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdXJsT3JNYXAgPT09IFwic3RyaW5nXCIpIHRocm93T25JbWdMb2FkRXJyb3IodXJsT3JNYXApO1xuICAgICAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJOdW1iZXIgb2YgZnJhbWUgYXJndW1lbnQgZm9yIG5ld0dRQW5pbWF0aW9uIG11c3QgYmUgbnVtZXJpYy4gXCIsIG51bWJlck9mRnJhbWUpO1xuICAgICAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJEZWx0YSBhcmd1bWVudCBmb3IgbmV3R1FBbmltYXRpb24gbXVzdCBiZSBudW1lcmljLiBcIiwgZGVsdGEpO1xuICAgICAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJSYXRlIGFyZ3VtZW50IGZvciBuZXdHUUFuaW1hdGlvbiBtdXN0IGJlIG51bWVyaWMuIFwiLCByYXRlKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZSAhPSBudWxsICYmICh0eXBlICYgQU5JTUFUSU9OX1ZFUlRJQ0FMKSAmJiAodHlwZSAmIEFOSU1BVElPTl9IT1JJWk9OVEFMKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiVHlwZSBhcmd1bWVudCBmb3IgbmV3R1FBbmltYXRpb24gY2Fubm90IGJlIGJvdGggQU5JTUFUSU9OX1ZFUlRJQ0FMIGFuZCBBTklNQVRJT05fSE9SSVpPTlRBTCAtIHVzZSBvbmUgb3IgdGhlIG90aGVyIGJ1dCBub3QgYm90aCFcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlICE9IG51bGwgJiYgISh0eXBlICYgQU5JTUFUSU9OX1ZFUlRJQ0FMKSAmJiAhKHR5cGUgJiBBTklNQVRJT05fSE9SSVpPTlRBTCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlR5cGUgYXJndW1lbnQgZm9yIG5ld0dRQW5pbWF0aW9uIGlzIG1pc3NpbmcgYm90aCBBTklNQVRJT05fVkVSVElDQUwgYW5kIEFOSU1BVElPTl9IT1JJWk9OVEFMIC0gbXVzdCB1c2Ugb25lIG9yIHRoZSBvdGhlciFcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAodXJsT3JNYXApID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93T25JbWdMb2FkRXJyb3IodXJsT3JNYXApO1xuICAgICAgICAgICAgICAgIH0gLy8gZWxzZSBob3BlIGl0J3MgYSBwcm9wZXIgb3B0aW9ucyBtYXAgdG8gcGFzcyBvbiB0byBHYW1lUXVlcnkgZGlyZWN0bHlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIldyb25nIG51bWJlciBvZiBhcmd1bWVudHMgdXNlZCBmb3IgbmV3R1FBbmltYXRpb24uIENoZWNrIEFQSSBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzIG9mIHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgICAgICAgbGV0IGtleSA9IFt1cmxPck1hcCwgbnVtYmVyT2ZGcmFtZSwgZGVsdGEsIHJhdGUsIHR5cGVdO1xuICAgICAgICAgICAgbGV0IG11bHRpZnJhbWVBbmltOiBTcHJpdGVBbmltYXRpb24gfCB1bmRlZmluZWQgPSBtZW1vQW5pbXMuZ2V0KGtleSk7XG4gICAgICAgICAgICBpZiAobXVsdGlmcmFtZUFuaW0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtdWx0aWZyYW1lQW5pbTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IG11bHRpZnJhbWVBbmltOiBTcHJpdGVBbmltYXRpb24gPSBuZXcgJC5nUS5BbmltYXRpb24oe1xuICAgICAgICAgICAgICAgICAgICBpbWFnZVVSTDogdXJsT3JNYXAsXG4gICAgICAgICAgICAgICAgICAgIG51bWJlck9mRnJhbWU6IG51bWJlck9mRnJhbWUsXG4gICAgICAgICAgICAgICAgICAgIGRlbHRhOiBkZWx0YSxcbiAgICAgICAgICAgICAgICAgICAgcmF0ZTogcmF0ZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogdHlwZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG1lbW9Bbmltcy5zZXQoa2V5LCBtdWx0aWZyYW1lQW5pbSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG11bHRpZnJhbWVBbmltO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGxldCBzaW5nbGVmcmFtZUFuaW06IFNwcml0ZUFuaW1hdGlvbiB8IHVuZGVmaW5lZCA9IG1lbW9Bbmltcy5nZXQodXJsT3JNYXApO1xuICAgICAgICAgICAgaWYgKHNpbmdsZWZyYW1lQW5pbSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpbmdsZWZyYW1lQW5pbTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHNpbmdsZWZyYW1lQW5pbTogU3ByaXRlQW5pbWF0aW9uO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHVybE9yTWFwKSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICBzaW5nbGVmcmFtZUFuaW0gPSBuZXcgJC5nUS5BbmltYXRpb24oeyBpbWFnZVVSTDogdXJsT3JNYXAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2luZ2xlZnJhbWVBbmltID0gbmV3ICQuZ1EuQW5pbWF0aW9uKHVybE9yTWFwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbWVtb0FuaW1zLnNldCh1cmxPck1hcCwgc2luZ2xlZnJhbWVBbmltKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2luZ2xlZnJhbWVBbmltO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIldyb25nIG51bWJlciBvZiBhcmd1bWVudHMgdXNlZCBmb3IgbmV3R1FBbmltYXRpb24uIENoZWNrIEFQSSBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzIG9mIHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyAkLmdRLkFuaW1hdGlvbih7IGltYWdlVVJMOiBcIlwiIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cbnR5cGUgQ3JlYXRlR3JvdXBJblBsYXlncm91bmRGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeDogbnVtYmVyLFxuICAgICAgICB0aGVQb3N5OiBudW1iZXJcbiAgICApOiB2b2lkO1xuICAgICh0aGlzOiB2b2lkLCBncm91cE5hbWU6IHN0cmluZywgdGhlV2lkdGg6IG51bWJlciwgdGhlSGVpZ2h0OiBudW1iZXIpOiB2b2lkO1xuICAgICh0aGlzOiB2b2lkLCBncm91cE5hbWU6IHN0cmluZyk6IHZvaWQ7XG4gICAgKHRoaXM6IHZvaWQsIGdyb3VwTmFtZTogc3RyaW5nLCBvcHRNYXA6IG9iamVjdCk6IHZvaWQ7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kOiBDcmVhdGVHcm91cEluUGxheWdyb3VuZEZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgdGhlV2lkdGg/OiBudW1iZXIgfCBvYmplY3QsXG4gICAgdGhlSGVpZ2h0PzogbnVtYmVyLFxuICAgIHRoZVBvc3g/OiBudW1iZXIsXG4gICAgdGhlUG9zeT86IG51bWJlclxuKTogdm9pZCB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICBpZiAodHlwZW9mIChncm91cE5hbWUpICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiRmlyc3QgYXJndW1lbnQgZm9yIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgZ3JvdXBOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNwcml0ZUdyb3VwTmFtZUZvcm1hdElzVmFsaWQoZ3JvdXBOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIkdyb3VwIG5hbWUgZ2l2ZW4gdG8gY3JlYXRlR3JvdXBJblBsYXlncm91bmQgaXMgaW4gd3JvbmcgZm9ybWF0OiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNwcml0ZUV4aXN0cyhncm91cE5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiY3JlYXRlR3JvdXBJblBsYXlncm91bmQgY2Fubm90IGNyZWF0ZSBkdXBsaWNhdGUgZ3JvdXAgd2l0aCBuYW1lOiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIldpZHRoIGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVXaWR0aCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiSGVpZ2h0IGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVIZWlnaHQpO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDUpIHtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlV2lkdGgpO1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkhlaWdodCBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlSGVpZ2h0KTtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N4KTtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJZIGxvY2F0aW9uIGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N5KTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7IC8vIHRyZWF0cyBhcmd1bWVudHNbMV0gYXMgYSBzdGFuZGFyZCBvcHRpb25zIG1hcFxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMV0gIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU2Vjb25kIGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBleHBlY3RlZCB0byBiZSBhIGRpY3Rpb25hcnkuIEluc3RlYWQgZm91bmQ6IFwiICsgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgICAgIH0gLy8gZWxzZSBob3BlIGl0J3MgYSBwcm9wZXIgc3RhbmRhcmQgb3B0aW9ucyBtYXBcbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50cyB1c2VkIGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZC4gQ2hlY2sgQVBJIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMgb2YgcGFyYW1ldGVycy5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRHcm91cChcbiAgICAgICAgICAgIGdyb3VwTmFtZSxcbiAgICAgICAgICAgIHsgd2lkdGg6ICQucGxheWdyb3VuZCgpLndpZHRoKCksIGhlaWdodDogJC5wbGF5Z3JvdW5kKCkuaGVpZ2h0KCkgfVxuICAgICAgICApO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICBpZiAodHlwZW9mIHRoZVdpZHRoICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwidGhlV2lkdGggbXVzdCBiZSBhIG51bWJlciBidXQgaW5zdGVhZCBnb3Q6IFwiICsgdGhlV2lkdGgpO1xuICAgICAgICB9XG4gICAgICAgICQucGxheWdyb3VuZCgpLmFkZEdyb3VwKGdyb3VwTmFtZSwgeyB3aWR0aDogdGhlV2lkdGgsIGhlaWdodDogdGhlSGVpZ2h0IH0pO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgICBpZiAodHlwZW9mIHRoZVdpZHRoICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwidGhlV2lkdGggbXVzdCBiZSBhIG51bWJlciBidXQgaW5zdGVhZCBnb3Q6IFwiICsgdGhlV2lkdGgpO1xuICAgICAgICB9XG4gICAgICAgICQucGxheWdyb3VuZCgpLmFkZEdyb3VwKFxuICAgICAgICAgICAgZ3JvdXBOYW1lLFxuICAgICAgICAgICAgeyB3aWR0aDogdGhlV2lkdGgsIGhlaWdodDogdGhlSGVpZ2h0LCBwb3N4OiB0aGVQb3N4LCBwb3N5OiB0aGVQb3N5IH1cbiAgICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHsgLy8gdHJlYXRzIGFyZ3VtZW50c1sxXSBhcyBhIHN0YW5kYXJkIG9wdGlvbnMgbWFwXG4gICAgICAgIGlmICh0eXBlb2YgdGhlV2lkdGggIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTZWNvbmQgYXJndW1lbnQgbXVzdCBiZSBhIG51bWJlciBidXQgaW5zdGVhZCBnb3Q6IFwiICsgdGhlV2lkdGgpO1xuICAgICAgICB9XG4gICAgICAgICQucGxheWdyb3VuZCgpLmFkZEdyb3VwKGdyb3VwTmFtZSwgYXJndW1lbnRzWzFdKTtcbiAgICB9XG59O1xuXG5leHBvcnQgdHlwZSBTcHJpdGVBbmltYXRpb24gPSB7IGltYWdlVVJMOiBzdHJpbmcgfTtcbnR5cGUgQ3JlYXRlU3ByaXRlSW5Hcm91cEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlQW5pbWF0aW9uOiBTcHJpdGVBbmltYXRpb24sXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyLFxuICAgICAgICB0aGVQb3N4OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3k6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVBbmltYXRpb246IFNwcml0ZUFuaW1hdGlvbixcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXJcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgb3B0aW9uc01hcDogb2JqZWN0XG4gICAgKTogdm9pZDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlU3ByaXRlSW5Hcm91cDogQ3JlYXRlU3ByaXRlSW5Hcm91cEZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHRoZUFuaW1hdGlvbjogU3ByaXRlQW5pbWF0aW9uIHwgb2JqZWN0LFxuICAgIHRoZVdpZHRoPzogbnVtYmVyLFxuICAgIHRoZUhlaWdodD86IG51bWJlcixcbiAgICB0aGVQb3N4PzogbnVtYmVyLFxuICAgIHRoZVBvc3k/OiBudW1iZXJcbik6IHZvaWQge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiAoZ3JvdXBOYW1lKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIkZpcnN0IGFyZ3VtZW50IGZvciBjcmVhdGVTcHJpdGVJbkdyb3VwIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgZ3JvdXBOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNwcml0ZUV4aXN0cyhncm91cE5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiY3JlYXRlU3ByaXRlSW5Hcm91cCBjYW5ub3QgZmluZCBncm91cCAoZG9lc24ndCBleGlzdD8pOiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIChzcHJpdGVOYW1lKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlNlY29uZCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIGEgU3RyaW5nLiBJbnN0ZWFkIGZvdW5kOiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc3ByaXRlR3JvdXBOYW1lRm9ybWF0SXNWYWxpZChzcHJpdGVOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlNwcml0ZSBuYW1lIGdpdmVuIHRvIGNyZWF0ZVNwcml0ZUluR3JvdXAgaXMgaW4gd3JvbmcgZm9ybWF0OiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzcHJpdGVFeGlzdHMoc3ByaXRlTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJjcmVhdGVTcHJpdGVJbkdyb3VwIGNhbm5vdCBjcmVhdGUgZHVwbGljYXRlIHNwcml0ZSB3aXRoIG5hbWU6IFwiICsgc3ByaXRlTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNSB8fCBhcmd1bWVudHMubGVuZ3RoID09PSA3KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mICh0aGVBbmltYXRpb24pICE9PSBcIm9iamVjdFwiIHx8IChcImltYWdlVXJsXCIgaW4gdGhlQW5pbWF0aW9uICYmIHR5cGVvZiAodGhlQW5pbWF0aW9uW1wiaW1hZ2VVUkxcIl0pICE9PSBcInN0cmluZ1wiKSkge1xuICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJjcmVhdGVTcHJpdGVJbkdyb3VwIGNhbm5vdCB1c2UgdGhpcyBhcyBhbiBhbmltYXRpb246IFwiICsgdGhlQW5pbWF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVXaWR0aCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiSGVpZ2h0IGFyZ3VtZW50IGZvciBjcmVhdGVTcHJpdGVJbkdyb3VwIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZUhlaWdodCk7XG5cblxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDcpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWCBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N4KTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1syXSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJUaGlyZCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBleHBlY3RlZCB0byBiZSBhIGRpY3Rpb25hcnkuIEluc3RlYWQgZm91bmQ6IFwiICsgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJpbWFnZVVybFwiIGluIHRoZUFuaW1hdGlvbiAmJiB0eXBlb2YgKHRoZUFuaW1hdGlvbltcImltYWdlVVJMXCJdKSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJUaGlyZCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBleHBlY3RlZCB0byBiZSBhIGRpY3Rpb25hcnkuIEluc3RlYWQgZm91bmQgdGhpcyBhbmltYXRpb246IFwiICsgdGhlQW5pbWF0aW9uICsgXCIuIE1heWJlIHdyb25nIG51bWJlciBvZiBhcmd1bWVudHMgcHJvdmlkZWQ/IENoZWNrIEFQSSBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzIG9mIHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICAgICAgfSAvLyBlbHNlIGhvcGUgaXQncyBhIHByb3BlciBzdGFuZGFyZCBvcHRpb25zIG1hcFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIldyb25nIG51bWJlciBvZiBhcmd1bWVudHMgdXNlZCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cC4gQ2hlY2sgQVBJIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMgb2YgcGFyYW1ldGVycy5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgICAkKFwiI1wiICsgZ3JvdXBOYW1lKS5hZGRTcHJpdGUoXG4gICAgICAgICAgICBzcHJpdGVOYW1lLFxuICAgICAgICAgICAgeyBhbmltYXRpb246IHRoZUFuaW1hdGlvbiwgd2lkdGg6IHRoZVdpZHRoLCBoZWlnaHQ6IHRoZUhlaWdodCB9XG4gICAgICAgICk7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA3KSB7XG4gICAgICAgICQoXCIjXCIgKyBncm91cE5hbWUpLmFkZFNwcml0ZShcbiAgICAgICAgICAgIHNwcml0ZU5hbWUsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiB0aGVBbmltYXRpb24sXG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoZVdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhlSGVpZ2h0LFxuICAgICAgICAgICAgICAgIHBvc3g6IHRoZVBvc3gsXG4gICAgICAgICAgICAgICAgcG9zeTogdGhlUG9zeVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykgeyAvLyB0cmVhdHMgYXJndW1lbnRzWzJdIGFzIGEgc3RhbmRhcmQgb3B0aW9ucyBtYXBcbiAgICAgICAgJChcIiNcIiArIGdyb3VwTmFtZSkuYWRkU3ByaXRlKHNwcml0ZU5hbWUsIGFyZ3VtZW50c1syXSk7XG4gICAgfVxufTtcblxudHlwZSBDcmVhdGVUZXh0U3ByaXRlSW5Hcm91cEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3g6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeTogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyXG4gICAgKTogdm9pZDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXA6IENyZWF0ZVRleHRTcHJpdGVJbkdyb3VwRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICB0aGVQb3N4PzogbnVtYmVyLFxuICAgIHRoZVBvc3k/OiBudW1iZXJcbik6IHZvaWQge1xuICAgIC8vIHRvIGJlIHVzZWQgbGlrZSBzcHJpdGUoXCJ0ZXh0Qm94XCIpLnRleHQoXCJoaVwiKTsgLy8gb3IgLmh0bWwoXCI8Yj5oaTwvYj5cIik7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICBpZiAodHlwZW9mIChncm91cE5hbWUpICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiRmlyc3QgYXJndW1lbnQgZm9yIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgZ3JvdXBOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNwcml0ZUV4aXN0cyhncm91cE5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgY2Fubm90IGZpbmQgZ3JvdXAgKGRvZXNuJ3QgZXhpc3Q/KTogXCIgKyBncm91cE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiAoc3ByaXRlTmFtZSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTZWNvbmQgYXJndW1lbnQgZm9yIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgc3ByaXRlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzcHJpdGVHcm91cE5hbWVGb3JtYXRJc1ZhbGlkKHNwcml0ZU5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU3ByaXRlIG5hbWUgZ2l2ZW4gdG8gY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgaXMgaW4gd3JvbmcgZm9ybWF0OiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzcHJpdGVFeGlzdHMoc3ByaXRlTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBjYW5ub3QgY3JlYXRlIGR1cGxpY2F0ZSBzcHJpdGUgd2l0aCBuYW1lOiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDQgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gNikge1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIldpZHRoIGFyZ3VtZW50IGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVXaWR0aCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiSGVpZ2h0IGFyZ3VtZW50IGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVIZWlnaHQpO1xuXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNikge1xuICAgICAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIGFyZ3VtZW50IGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N4KTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlUG9zeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50cyB1c2VkIGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cC4gQ2hlY2sgQVBJIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMgb2YgcGFyYW1ldGVycy5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNCkge1xuICAgICAgICAkKFwiI1wiICsgZ3JvdXBOYW1lKS5hZGRTcHJpdGUoc3ByaXRlTmFtZSwge1xuICAgICAgICAgICAgd2lkdGg6IHRoZVdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGVIZWlnaHRcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA2KSB7XG4gICAgICAgICQoXCIjXCIgKyBncm91cE5hbWUpLmFkZFNwcml0ZShzcHJpdGVOYW1lLCB7XG4gICAgICAgICAgICB3aWR0aDogdGhlV2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoZUhlaWdodCxcbiAgICAgICAgICAgIHBvc3g6IHRoZVBvc3gsXG4gICAgICAgICAgICBwb3N5OiB0aGVQb3N5XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNCB8fCBhcmd1bWVudHMubGVuZ3RoID09PSA2KSB7XG4gICAgICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIFwid2hpdGVcIikgLy8gZGVmYXVsdCB0byB3aGl0ZSBiYWNrZ3JvdW5kIGZvciBlYXNlIG9mIHVzZVxuICAgICAgICAgICAgLmNzcyhcInVzZXItc2VsZWN0XCIsIFwibm9uZVwiKTtcbiAgICB9XG59O1xuXG5jb25zdCB0ZXh0SW5wdXRTcHJpdGVUZXh0QXJlYUlkID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIHNwcml0ZU5hbWUgKyBcIi10ZXh0YXJlYVwiO1xufTtcbmNvbnN0IHRleHRJbnB1dFNwcml0ZVN1Ym1pdEJ1dHRvbklkID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIHNwcml0ZU5hbWUgKyBcIi1idXR0b25cIjtcbn07XG5jb25zdCB0ZXh0SW5wdXRTcHJpdGVHUUdfU0lHTkFMU19JZCA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIHJldHVybiBzcHJpdGVOYW1lICsgXCItc3VibWl0dGVkXCI7XG59O1xudHlwZSBDcmVhdGVUZXh0SW5wdXRTcHJpdGVJbkdyb3VwRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICAgICAgcm93czogbnVtYmVyLFxuICAgICAgICBjb2xzOiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3g6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeTogbnVtYmVyLFxuICAgICAgICBzdWJtaXRIYW5kbGVyOiBTdWJtaXRIYW5kbGVyRm5cbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHJvd3M6IG51bWJlcixcbiAgICAgICAgY29sczogbnVtYmVyLFxuICAgICAgICB0aGVQb3N4OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3k6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICAgICAgcm93czogbnVtYmVyLFxuICAgICAgICBjb2xzOiBudW1iZXJcbiAgICApOiB2b2lkO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVUZXh0SW5wdXRTcHJpdGVJbkdyb3VwOiBDcmVhdGVUZXh0SW5wdXRTcHJpdGVJbkdyb3VwRm4gPVxuICAgIGZ1bmN0aW9uIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHJvd3M6IG51bWJlcixcbiAgICAgICAgY29sczogbnVtYmVyLFxuICAgICAgICB0aGVQb3N4PzogbnVtYmVyLFxuICAgICAgICB0aGVQb3N5PzogbnVtYmVyLFxuICAgICAgICBzdWJtaXRIYW5kbGVyPzogU3VibWl0SGFuZGxlckZuXG4gICAgKTogdm9pZCB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA2KSB7XG4gICAgICAgICAgICBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cChncm91cE5hbWUsIHNwcml0ZU5hbWUsIHRoZVdpZHRoLCB0aGVIZWlnaHQpO1xuICAgICAgICB9IGVsc2UgaWYgKChhcmd1bWVudHMubGVuZ3RoID09PSA4IHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDkpICYmIHRoZVBvc3ggJiZcbiAgICAgICAgICAgIHRoZVBvc3kpIHtcbiAgICAgICAgICAgIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwKFxuICAgICAgICAgICAgICAgIGdyb3VwTmFtZSxcbiAgICAgICAgICAgICAgICBzcHJpdGVOYW1lLFxuICAgICAgICAgICAgICAgIHRoZVdpZHRoLFxuICAgICAgICAgICAgICAgIHRoZUhlaWdodCxcbiAgICAgICAgICAgICAgICB0aGVQb3N4LFxuICAgICAgICAgICAgICAgIHRoZVBvc3lcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDYgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gOCB8fFxuICAgICAgICAgICAgYXJndW1lbnRzLmxlbmd0aCA9PT0gOSkge1xuICAgICAgICAgICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLmNzcyhcImJhY2tncm91bmQtY29sb3JcIiwgXCJ3aGl0ZVwiKTsgLy8gZGVmYXVsdCB0byB3aGl0ZSBiYWNrZ3JvdW5kIGZvciBlYXNlIG9mIHVzZVxuXG4gICAgICAgICAgICB2YXIgdGV4dGFyZWFIdG1sID0gJzx0ZXh0YXJlYSBpZD1cIicgK1xuICAgICAgICAgICAgICAgIHRleHRJbnB1dFNwcml0ZVRleHRBcmVhSWQoc3ByaXRlTmFtZSkgKyAnXCIgcm93cz1cIicgKyByb3dzICtcbiAgICAgICAgICAgICAgICAnXCIgY29scz1cIicgKyBjb2xzICsgJ1wiPmhpPC90ZXh0YXJlYT4nO1xuICAgICAgICAgICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLmFwcGVuZCh0ZXh0YXJlYUh0bWwpO1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9uSWQgPSB0ZXh0SW5wdXRTcHJpdGVTdWJtaXRCdXR0b25JZChzcHJpdGVOYW1lKTtcbiAgICAgICAgICAgIHZhciBidXR0b25IdG1sID0gJzxidXR0b24gaWQ9XCInICsgYnV0dG9uSWQgK1xuICAgICAgICAgICAgICAgICdcIiB0eXBlPVwiYnV0dG9uXCI+U3VibWl0PC9idXR0b24+JztcbiAgICAgICAgICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5hcHBlbmQoYnV0dG9uSHRtbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gOSkge1xuICAgICAgICAgICAgdGV4dElucHV0U3ByaXRlU2V0SGFuZGxlcihzcHJpdGVOYW1lLCBzdWJtaXRIYW5kbGVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRleHRJbnB1dFNwcml0ZVNldEhhbmRsZXIoc3ByaXRlTmFtZSk7XG4gICAgICAgIH1cbiAgICB9O1xuZXhwb3J0IHR5cGUgU3VibWl0SGFuZGxlckZuID0gKHM6IHN0cmluZykgPT4gdm9pZDtcbmV4cG9ydCBjb25zdCB0ZXh0SW5wdXRTcHJpdGVTZXRIYW5kbGVyID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHN1Ym1pdEhhbmRsZXI/OiBTdWJtaXRIYW5kbGVyRm5cbik6IHZvaWQge1xuICAgIHZhciByZWFsU3VibWl0SGFuZGxlcjtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICByZWFsU3VibWl0SGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChzdWJtaXRIYW5kbGVyKSBzdWJtaXRIYW5kbGVyKHRleHRJbnB1dFNwcml0ZVN0cmluZyhzcHJpdGVOYW1lKSk7XG4gICAgICAgICAgICBHUUdfU0lHTkFMU1t0ZXh0SW5wdXRTcHJpdGVHUUdfU0lHTkFMU19JZChzcHJpdGVOYW1lKV0gPSB0cnVlO1xuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlYWxTdWJtaXRIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgR1FHX1NJR05BTFNbdGV4dElucHV0U3ByaXRlR1FHX1NJR05BTFNfSWQoc3ByaXRlTmFtZSldID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgJChcIiNcIiArIHRleHRJbnB1dFNwcml0ZVN1Ym1pdEJ1dHRvbklkKHNwcml0ZU5hbWUpKS5jbGljayhyZWFsU3VibWl0SGFuZGxlcik7XG59O1xuXG5leHBvcnQgY29uc3QgdGV4dElucHV0U3ByaXRlU3RyaW5nID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIFN0cmluZygkKFwiI1wiICsgdGV4dElucHV0U3ByaXRlVGV4dEFyZWFJZChzcHJpdGVOYW1lKSlbMF0udmFsdWUpO1xufTtcbmV4cG9ydCBjb25zdCB0ZXh0SW5wdXRTcHJpdGVTZXRTdHJpbmcgPSAoXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHN0cjogc3RyaW5nXG4pOiB2b2lkID0+IHtcbiAgICAkKFwiI1wiICsgdGV4dElucHV0U3ByaXRlVGV4dEFyZWFJZChzcHJpdGVOYW1lKSlbMF0udmFsdWUgPSBzdHI7XG59O1xuXG5leHBvcnQgY29uc3QgdGV4dElucHV0U3ByaXRlUmVzZXQgPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgdGV4dFByb21wdD86IHN0cmluZ1xuKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGV4dElucHV0U3ByaXRlU2V0U3RyaW5nKHNwcml0ZU5hbWUsIFwiXCIpO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiAmJiB0ZXh0UHJvbXB0KSB7XG4gICAgICAgIHRleHRJbnB1dFNwcml0ZVNldFN0cmluZyhzcHJpdGVOYW1lLCB0ZXh0UHJvbXB0KTtcbiAgICB9XG4gICAgR1FHX1NJR05BTFNbdGV4dElucHV0U3ByaXRlR1FHX1NJR05BTFNfSWQoc3ByaXRlTmFtZSldID0gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3QgdGV4dElucHV0U3ByaXRlU3VibWl0dGVkID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGlmIChHUUdfU0lHTkFMU1t0ZXh0SW5wdXRTcHJpdGVHUUdfU0lHTkFMU19JZChzcHJpdGVOYW1lKV0gPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn07XG5cbmV4cG9ydCBjb25zdCByZW1vdmVTcHJpdGUgPSAoc3ByaXRlTmFtZU9yT2JqOiBzdHJpbmcgfCBvYmplY3QpOiB2b2lkID0+IHtcbiAgICBpZiAodHlwZW9mIChzcHJpdGVOYW1lT3JPYmopICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lT3JPYmopO1xuICAgICAgICB9O1xuICAgICAgICAkKFwiI1wiICsgc3ByaXRlTmFtZU9yT2JqKS5yZW1vdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKHNwcml0ZU5hbWVPck9iaikucmVtb3ZlKCk7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZSA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBzcHJpdGVEb21PYmplY3QgPT4ge1xuICAgIHJldHVybiAkKFwiI1wiICsgc3ByaXRlTmFtZSk7XG59O1xuXG5leHBvcnQgY29uc3Qgc3ByaXRlRXhpc3RzID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiAoc3ByaXRlTmFtZSA9PSAkKFwiI1wiICsgc3ByaXRlTmFtZSkuYXR0cihcImlkXCIpKTsgLy8gc3ByaXRlTmFtZSBjb3VsZCBiZSBnaXZlbiBhcyBhbiBpbnQgYnkgYSBzdHVkZW50XG59O1xuXG5leHBvcnQgY29uc3Qgc3ByaXRlT2JqZWN0ID0gKFxuICAgIHNwcml0ZU5hbWVPck9iajogc3RyaW5nIHwgb2JqZWN0XG4pOiBzcHJpdGVEb21PYmplY3QgPT4ge1xuICAgIGlmICh0eXBlb2YgKHNwcml0ZU5hbWVPck9iaikgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lT3JPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAkKHNwcml0ZU5hbWVPck9iaik7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZUlkID0gKHNwcml0ZU5hbWVPck9iajogc3RyaW5nIHwgb2JqZWN0KTogc3RyaW5nID0+IHtcbiAgICBpZiAodHlwZW9mIChzcHJpdGVOYW1lT3JPYmopICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcoJChcIiNcIiArIHNwcml0ZU5hbWVPck9iaikuYXR0cihcImlkXCIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gU3RyaW5nKCQoc3ByaXRlTmFtZU9yT2JqKS5hdHRyKFwiaWRcIikpO1xuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVHZXRYID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgfTtcbiAgICByZXR1cm4gJChcIiNcIiArIHNwcml0ZU5hbWUpLngoKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlR2V0WSA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBudW1iZXIgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgIH07XG4gICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lKS55KCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZUdldFogPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogbnVtYmVyID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICB9O1xuICAgIHJldHVybiAkKFwiI1wiICsgc3ByaXRlTmFtZSkueigpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRYID0gKHNwcml0ZU5hbWU6IHN0cmluZywgeHZhbDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHh2YWwpO1xuICAgIH07XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLngoeHZhbCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVNldFkgPSAoc3ByaXRlTmFtZTogc3RyaW5nLCB5dmFsOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlkgbG9jYXRpb24gbXVzdCBiZSBhIG51bWJlci5cIiwgeXZhbCk7XG4gICAgfTtcbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkueSh5dmFsKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0WiA9IChzcHJpdGVOYW1lOiBzdHJpbmcsIHp2YWw6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWiBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB6dmFsKTtcbiAgICB9O1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS56KHp2YWwpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRYWSA9IChcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgeHZhbDogbnVtYmVyLFxuICAgIHl2YWw6IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHh2YWwpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB5dmFsKTtcbiAgICB9O1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS54eSh4dmFsLCB5dmFsKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0WFlaID0gKFxuICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICB4dmFsOiBudW1iZXIsXG4gICAgeXZhbDogbnVtYmVyLFxuICAgIHp2YWw6IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHh2YWwpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB5dmFsKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlogbG9jYXRpb24gbXVzdCBiZSBhIG51bWJlci5cIiwgenZhbCk7XG4gICAgfTtcbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkueHl6KHh2YWwsIHl2YWwsIHp2YWwpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZUdldFdpZHRoID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgfTtcbiAgICByZXR1cm4gJChcIiNcIiArIHNwcml0ZU5hbWUpLncoKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlR2V0SGVpZ2h0ID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgfTtcbiAgICByZXR1cm4gJChcIiNcIiArIHNwcml0ZU5hbWUpLmgoKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0V2lkdGggPSAoc3ByaXRlTmFtZTogc3RyaW5nLCB3dmFsOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIldpZHRoIG11c3QgYmUgYSBudW1iZXIuXCIsIHd2YWwpO1xuICAgIH1cbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkudyh3dmFsKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0SGVpZ2h0ID0gKHNwcml0ZU5hbWU6IHN0cmluZywgaHZhbDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJIZWlnaHQgbXVzdCBiZSBhIG51bWJlci5cIiwgaHZhbCk7XG4gICAgfVxuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5oKGh2YWwpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRXaWR0aEhlaWdodCA9IChcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgd3ZhbDogbnVtYmVyLFxuICAgIGh2YWw6IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBtdXN0IGJlIGEgbnVtYmVyLlwiLCB3dmFsKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkhlaWdodCBtdXN0IGJlIGEgbnVtYmVyLlwiLCBodmFsKTtcbiAgICB9XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLndoKHd2YWwsIGh2YWwpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZVJvdGF0ZSA9IChcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgYW5nbGVEZWdyZWVzOiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiQW5nbGUgbXVzdCBiZSBhIG51bWJlci5cIiwgYW5nbGVEZWdyZWVzKTtcbiAgICB9XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLnJvdGF0ZShhbmdsZURlZ3JlZXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZVNjYWxlID0gKHNwcml0ZU5hbWU6IHN0cmluZywgcmF0aW86IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiUmF0aW8gbXVzdCBiZSBhIG51bWJlci5cIiwgcmF0aW8pO1xuICAgIH1cbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkuc2NhbGUocmF0aW8pO1xufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZVNldEFuaW1hdGlvbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIHNwcml0ZU5hbWVPck9iajogc3RyaW5nIHwgb2JqZWN0LFxuICAgIGFHUUFuaW1hdGlvbj86IG9iamVjdCxcbiAgICBjYWxsYmFja0Z1bmN0aW9uPzogRnVuY3Rpb25cbikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyICYmIGFHUUFuaW1hdGlvbiAhPSBudWxsKSB7XG4gICAgICAgIHNwcml0ZU9iamVjdChzcHJpdGVOYW1lT3JPYmopLnNldEFuaW1hdGlvbihhR1FBbmltYXRpb24pO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyAmJiBhR1FBbmltYXRpb24gIT0gbnVsbCAmJiB0eXBlb2YgY2FsbGJhY2tGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHNwcml0ZU9iamVjdChzcHJpdGVOYW1lT3JPYmopLnNldEFuaW1hdGlvbihhR1FBbmltYXRpb24sIGNhbGxiYWNrRnVuY3Rpb24pO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBzcHJpdGVPYmplY3Qoc3ByaXRlTmFtZU9yT2JqKS5zZXRBbmltYXRpb24oKTtcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVBhdXNlQW5pbWF0aW9uID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5wYXVzZUFuaW1hdGlvbigpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVSZXN1bWVBbmltYXRpb24gPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLnJlc3VtZUFuaW1hdGlvbigpO1xufTtcblxuZXhwb3J0IHR5cGUgQ29sbGlzaW9uSGFuZGxpbmdGbiA9IChjb2xsSW5kZXg6IG51bWJlciwgaGl0U3ByaXRlOiBvYmplY3QpID0+XG4gICAgdm9pZDtcbmV4cG9ydCBjb25zdCBmb3JFYWNoU3ByaXRlU3ByaXRlQ29sbGlzaW9uRG8gPSAoXG4gICAgc3ByaXRlMU5hbWU6IHN0cmluZyxcbiAgICBzcHJpdGUyTmFtZTogc3RyaW5nLFxuICAgIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb246IENvbGxpc2lvbkhhbmRsaW5nRm5cbik6IHZvaWQgPT4ge1xuICAgICQoXCIjXCIgKyBzcHJpdGUxTmFtZSkuY29sbGlzaW9uKFwiLmdRX2dyb3VwLCAjXCIgKyBzcHJpdGUyTmFtZSkuZWFjaChcbiAgICAgICAgY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvblxuICAgICk7XG4gICAgLy8gY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbiBjYW4gb3B0aW9uYWxseSB0YWtlIHR3byBhcmd1bWVudHM6IGNvbGxJbmRleCwgaGl0U3ByaXRlXG4gICAgLy8gc2VlIGh0dHA6Ly9hcGkuanF1ZXJ5LmNvbS9qUXVlcnkuZWFjaFxufTtcbmV4cG9ydCBjb25zdCBmb3JFYWNoMlNwcml0ZXNIaXQgPSAoKCkgPT4ge1xuICAgIHZhciBwcmludGVkID0gZmFsc2U7XG4gICAgcmV0dXJuIChzcHJpdGUxTmFtZTogc3RyaW5nLCBzcHJpdGUyTmFtZTogc3RyaW5nLCBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uOiBDb2xsaXNpb25IYW5kbGluZ0ZuKSA9PiB7XG4gICAgICAgIGlmICghcHJpbnRlZCkge1xuICAgICAgICAgICAgcHJpbnRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiRGVwcmVjYXRlZCBmdW5jdGlvbiB1c2VkOiBmb3JFYWNoMlNwcml0ZXNIaXQuICBVc2Ugd2hlbjJTcHJpdGVzSGl0IGluc3RlYWQgZm9yIGJldHRlciBwZXJmb3JtYW5jZS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgZm9yRWFjaFNwcml0ZVNwcml0ZUNvbGxpc2lvbkRvKHNwcml0ZTFOYW1lLCBzcHJpdGUyTmFtZSwgY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbik7XG4gICAgfTtcbn0pKCk7XG5leHBvcnQgY29uc3Qgd2hlbjJTcHJpdGVzSGl0ID0gZm9yRWFjaFNwcml0ZVNwcml0ZUNvbGxpc2lvbkRvOyAvLyBORVdcblxuZXhwb3J0IGNvbnN0IGZvckVhY2hTcHJpdGVHcm91cENvbGxpc2lvbkRvID0gKFxuICAgIHNwcml0ZTFOYW1lOiBzdHJpbmcsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbjogQ29sbGlzaW9uSGFuZGxpbmdGblxuKTogdm9pZCA9PiB7XG4gICAgJChcIiNcIiArIHNwcml0ZTFOYW1lKS5jb2xsaXNpb24oXCIjXCIgKyBncm91cE5hbWUgKyBcIiwgLmdRX3Nwcml0ZVwiKS5lYWNoKFxuICAgICAgICBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uXG4gICAgKTtcbiAgICAvLyBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uIGNhbiBvcHRpb25hbGx5IHRha2UgdHdvIGFyZ3VtZW50czogY29sbEluZGV4LCBoaXRTcHJpdGVcbiAgICAvLyBzZWUgaHR0cDovL2FwaS5qcXVlcnkuY29tL2pRdWVyeS5lYWNoXG59O1xuZXhwb3J0IGNvbnN0IGZvckVhY2hTcHJpdGVHcm91cEhpdCA9IGZvckVhY2hTcHJpdGVHcm91cENvbGxpc2lvbkRvO1xuXG5leHBvcnQgY29uc3QgZm9yRWFjaFNwcml0ZUZpbHRlcmVkQ29sbGlzaW9uRG8gPSAoXG4gICAgc3ByaXRlMU5hbWU6IHN0cmluZyxcbiAgICBmaWx0ZXJTdHI6IHN0cmluZyxcbiAgICBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uOiBDb2xsaXNpb25IYW5kbGluZ0ZuXG4pOiB2b2lkID0+IHtcbiAgICAkKFwiI1wiICsgc3ByaXRlMU5hbWUpLmNvbGxpc2lvbihmaWx0ZXJTdHIpLmVhY2goY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbik7XG4gICAgLy8gc2VlIGh0dHA6Ly9nYW1lcXVlcnlqcy5jb20vZG9jdW1lbnRhdGlvbi9hcGkvI2NvbGxpc2lvbiBmb3IgZmlsdGVyU3RyIHNwZWNcbiAgICAvLyBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uIGNhbiBvcHRpb25hbGx5IHRha2UgdHdvIGFyZ3VtZW50czogY29sbEluZGV4LCBoaXRTcHJpdGVcbiAgICAvLyBzZWUgaHR0cDovL2FwaS5qcXVlcnkuY29tL2pRdWVyeS5lYWNoXG59O1xuZXhwb3J0IGNvbnN0IGZvckVhY2hTcHJpdGVGaWx0ZXJlZEhpdCA9IGZvckVhY2hTcHJpdGVGaWx0ZXJlZENvbGxpc2lvbkRvO1xuXG5leHBvcnQgdHlwZSBTcHJpdGVIaXREaXJlY3Rpb25hbGl0eSA9IHtcbiAgICBcImxlZnRcIjogYm9vbGVhbjtcbiAgICBcInJpZ2h0XCI6IGJvb2xlYW47XG4gICAgXCJ1cFwiOiBib29sZWFuO1xuICAgIFwiZG93blwiOiBib29sZWFuO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVIaXREaXJlY3Rpb24gPSAoXG4gICAgc3ByaXRlMUlkOiBzdHJpbmcsXG4gICAgc3ByaXRlMVg6IG51bWJlcixcbiAgICBzcHJpdGUxWTogbnVtYmVyLFxuICAgIHNwcml0ZTFYU3BlZWQ6IG51bWJlcixcbiAgICBzcHJpdGUxWVNwZWVkOiBudW1iZXIsXG4gICAgc3ByaXRlMVdpZHRoOiBudW1iZXIsXG4gICAgc3ByaXRlMUhlaWdodDogbnVtYmVyLFxuICAgIHNwcml0ZTJJZDogc3RyaW5nLFxuICAgIHNwcml0ZTJYOiBudW1iZXIsXG4gICAgc3ByaXRlMlk6IG51bWJlcixcbiAgICBzcHJpdGUyWFNwZWVkOiBudW1iZXIsXG4gICAgc3ByaXRlMllTcGVlZDogbnVtYmVyLFxuICAgIHNwcml0ZTJXaWR0aDogbnVtYmVyLFxuICAgIHNwcml0ZTJIZWlnaHQ6IG51bWJlclxuKTogU3ByaXRlSGl0RGlyZWN0aW9uYWxpdHkgPT4ge1xuICAgIHZhciBzcHJpdGUxSW5mbzogU3ByaXRlRGljdCA9IHtcbiAgICAgICAgXCJpZFwiOiBzcHJpdGUxSWQsXG4gICAgICAgIFwieHBvc1wiOiBzcHJpdGUxWCxcbiAgICAgICAgXCJ5cG9zXCI6IHNwcml0ZTFZLFxuICAgICAgICBcInhzcGVlZFwiOiBzcHJpdGUxWFNwZWVkLFxuICAgICAgICBcInlzcGVlZFwiOiBzcHJpdGUxWVNwZWVkLFxuICAgICAgICBcImhlaWdodFwiOiBzcHJpdGUxSGVpZ2h0LFxuICAgICAgICBcIndpZHRoXCI6IHNwcml0ZTFXaWR0aFxuICAgIH07XG4gICAgdmFyIHNwcml0ZTJJbmZvOiBTcHJpdGVEaWN0ID0ge1xuICAgICAgICBcImlkXCI6IHNwcml0ZTJJZCxcbiAgICAgICAgXCJ4cG9zXCI6IHNwcml0ZTJYLFxuICAgICAgICBcInlwb3NcIjogc3ByaXRlMlksXG4gICAgICAgIFwieHNwZWVkXCI6IHNwcml0ZTJYU3BlZWQsXG4gICAgICAgIFwieXNwZWVkXCI6IHNwcml0ZTJZU3BlZWQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHNwcml0ZTJIZWlnaHQsXG4gICAgICAgIFwid2lkdGhcIjogc3ByaXRlMldpZHRoXG4gICAgfTtcbiAgICByZXR1cm4gc3ByaXRlSGl0RGlyKHNwcml0ZTFJbmZvLCBzcHJpdGUySW5mbyk7XG59O1xuXG5leHBvcnQgdHlwZSBTcHJpdGVQaHlzaWNhbERpbWVuc2lvbnMgPSB7XG4gICAgXCJ4cG9zXCI6IG51bWJlcjtcbiAgICBcInlwb3NcIjogbnVtYmVyO1xuICAgIFwieHNwZWVkXCI6IG51bWJlcjsgLy8gbW92ZW1lbnQgbXVzdCBiZSBieSBkaWN0aW9uYXJ5LFxuICAgIFwieXNwZWVkXCI6IG51bWJlcjsgLy8gd2l0aCBzb21ldGhpbmcgbGlrZSB4ID0geCArIHhzcGVlZFxuICAgIFwid2lkdGhcIjogbnVtYmVyO1xuICAgIFwiaGVpZ2h0XCI6IG51bWJlcjtcbn07XG5leHBvcnQgdHlwZSBTcHJpdGVEaWN0ID0gU3ByaXRlUGh5c2ljYWxEaW1lbnNpb25zICYge1xuICAgIFwiaWRcIjogc3RyaW5nO1xuICAgIFtzOiBzdHJpbmddOiBhbnk7XG59O1xuY29uc3Qgc3ByaXRlc1NwZWVkU2FtcGxlczogeyBbazogc3RyaW5nXTogeyBzYW1wbGVTaXplOiBudW1iZXIsIHhzcGVlZFNhbXBsZXM6IG51bWJlcltdLCB5c3BlZWRTYW1wbGVzOiBudW1iZXJbXSwgY2hlY2tlZDogYm9vbGVhbiB9IH0gPSB7fTtcbmNvbnN0IGNoZWNrU3ByaXRlU3BlZWRVc2FnZUNvbW1vbkVycm9ycyA9IChzcHJpdGVJbmZvOiBTcHJpdGVEaWN0KSA9PiB7XG4gICAgLy8gQSBoZXVyaXN0aWMgY2hlY2sgZm9yIGNvbW1vbiBlcnJvcnMgZnJvbSBsZWFybmVycy5cbiAgICAvLyBDaGVjayBpZiBzcHJpdGUgc3BlZWRzIGV2ZXIgY2hhbmdlLiAgSWYgbm90LCBwcm9iYWJseSBkb2luZyBpdCB3cm9uZy5cbiAgICBpZiAoIXNwcml0ZXNTcGVlZFNhbXBsZXNbc3ByaXRlSW5mb1tcImlkXCJdXSkge1xuICAgICAgICBzcHJpdGVzU3BlZWRTYW1wbGVzW3Nwcml0ZUluZm9bXCJpZFwiXV0gPSB7XG4gICAgICAgICAgICBzYW1wbGVTaXplOiAwLFxuICAgICAgICAgICAgeHNwZWVkU2FtcGxlczogW10sXG4gICAgICAgICAgICB5c3BlZWRTYW1wbGVzOiBbXSxcbiAgICAgICAgICAgIGNoZWNrZWQ6IGZhbHNlXG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3ByaXRlMVNhbXBsaW5nID0gc3ByaXRlc1NwZWVkU2FtcGxlc1tzcHJpdGVJbmZvW1wiaWRcIl1dO1xuICAgICAgICBjb25zdCBtYXhTYW1wbGVTaXplID0gMTA7XG4gICAgICAgIGlmIChzcHJpdGUxU2FtcGxpbmcuc2FtcGxlU2l6ZSA8IG1heFNhbXBsZVNpemUpIHtcbiAgICAgICAgICAgICsrc3ByaXRlMVNhbXBsaW5nLnNhbXBsZVNpemU7XG4gICAgICAgICAgICBzcHJpdGUxU2FtcGxpbmcueHNwZWVkU2FtcGxlcy5wdXNoKHNwcml0ZUluZm9bXCJ4c3BlZWRcIl0pO1xuICAgICAgICAgICAgc3ByaXRlMVNhbXBsaW5nLnlzcGVlZFNhbXBsZXMucHVzaChzcHJpdGVJbmZvW1wieXNwZWVkXCJdKTtcbiAgICAgICAgfSBlbHNlIGlmICghc3ByaXRlMVNhbXBsaW5nLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIHNwcml0ZTFTYW1wbGluZy5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IHNzID0gc3ByaXRlMVNhbXBsaW5nLnNhbXBsZVNpemU7XG4gICAgICAgICAgICBjb25zdCBzeFNhbXBsZXMgPSBzcHJpdGUxU2FtcGxpbmcueHNwZWVkU2FtcGxlcztcbiAgICAgICAgICAgIGNvbnN0IHN5U2FtcGxlcyA9IHNwcml0ZTFTYW1wbGluZy55c3BlZWRTYW1wbGVzO1xuXG4gICAgICAgICAgICBsZXQgc2FtZVhzcGVlZCA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHNzOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3hTYW1wbGVzW2ldICE9PSBzeFNhbXBsZXNbaSAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgIHNhbWVYc3BlZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNhbWVYc3BlZWQgJiYgc3hTYW1wbGVzWzBdICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coR1FHX1dBUk5JTkdfSU5fTVlQUk9HUkFNX01TR1xuICAgICAgICAgICAgICAgICAgICArIFwic3ByaXRlIGhpdCBkaXJlY3Rpb24gZnVuY3Rpb25hbGl0eS0gcG9zc2libHkgd3JvbmcgeHBvcyBjYWxjdWxhdGlvbiBmb3Igc3ByaXRlOiBcIlxuICAgICAgICAgICAgICAgICAgICArIHNwcml0ZUluZm9bXCJpZFwiXVxuICAgICAgICAgICAgICAgICAgICArIFwiLiAgRW5zdXJlIHhzcGVlZCB1c2VkIHZhbGlkbHkgaWYgc3ByaXRlIGhpdCBkaXJlY3Rpb25hbGl0eSBzZWVtcyB3cm9uZy5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzYW1lWXNwZWVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc3M7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChzeVNhbXBsZXNbaV0gIT09IHN5U2FtcGxlc1tpIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgc2FtZVlzcGVlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2FtZVlzcGVlZCAmJiBzeVNhbXBsZXNbMF0gIT09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhHUUdfV0FSTklOR19JTl9NWVBST0dSQU1fTVNHXG4gICAgICAgICAgICAgICAgICAgICsgXCJzcHJpdGUgaGl0IGRpcmVjdGlvbiBmdW5jdGlvbmFsaXR5LSBwb3NzaWJseSB3cm9uZyB5cG9zIGNhbGN1bGF0aW9uIGZvciBzcHJpdGU6IFwiXG4gICAgICAgICAgICAgICAgICAgICsgc3ByaXRlSW5mb1tcImlkXCJdXG4gICAgICAgICAgICAgICAgICAgICsgXCIuICBFbnN1cmUgeXNwZWVkIHVzZWQgdmFsaWRseSBpZiBzcHJpdGUgaGl0IGRpcmVjdGlvbmFsaXR5IHNlZW1zIHdyb25nLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVIaXREaXIgPSAoXG4gICAgc3ByaXRlMUluZm86IFNwcml0ZURpY3QsXG4gICAgc3ByaXRlMkluZm86IFNwcml0ZURpY3Rcbik6IFNwcml0ZUhpdERpcmVjdGlvbmFsaXR5ID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIGNoZWNrU3ByaXRlU3BlZWRVc2FnZUNvbW1vbkVycm9ycyhzcHJpdGUxSW5mbyk7XG4gICAgICAgIGNoZWNrU3ByaXRlU3BlZWRVc2FnZUNvbW1vbkVycm9ycyhzcHJpdGUySW5mbyk7XG4gICAgfVxuICAgIHJldHVybiBzcHJpdGVIaXREaXJJbXBsKHNwcml0ZTFJbmZvLCBzcHJpdGUySW5mbyk7XG59XG5jb25zdCBzcHJpdGVIaXREaXJJbXBsID0gKFxuICAgIHNwcml0ZTFJbmZvOiBTcHJpdGVQaHlzaWNhbERpbWVuc2lvbnMsXG4gICAgc3ByaXRlMkluZm86IFNwcml0ZVBoeXNpY2FsRGltZW5zaW9uc1xuKTogU3ByaXRlSGl0RGlyZWN0aW9uYWxpdHkgPT4ge1xuICAgIC8qXG4gICAgICAgUmV0dXJucyB0aGUgZGlyZWN0aW9uIHRoYXQgc3ByaXRlIDEgaGl0cyBzcHJpdGUgMiBmcm9tLlxuICAgICAgIHNwcml0ZSAxIGlzIHJlbGF0aXZlbHkgbGVmdC9yaWdodC91cC9kb3duIG9mIHNwcml0ZSAyXG4gICAgICAgXG4gICAgICAgSGl0IGRpcmVjdGlvbiByZXR1cm5lZCBjb3VsZCBiZSBtdWx0aXBsZSB2YWx1ZXMgKGUuZy4gbGVmdCBhbmQgdXApLFxuICAgICAgIGFuZCBpcyByZXR1cm5lZCBieSB0aGlzIGZ1bmN0aW9uIGFzIGEgZGljdGlvbmFyeSBhcywgZS5nLlxuICAgICAgIHtcbiAgICAgICBcImxlZnRcIjogZmFsc2UsXG4gICAgICAgXCJyaWdodFwiOiBmYWxzZSxcbiAgICAgICBcInVwXCI6IGZhbHNlLFxuICAgICAgIFwiZG93blwiOiBmYWxzZVxuICAgICAgIH1cbiAgICAgICBcbiAgICAgICBQYXJhbWV0ZXJzIHNwcml0ZXsxLDJ9SW5mbyBhcmUgZGljdGlvbmFyaWVzIHdpdGggYXQgbGVhc3QgdGhlc2Uga2V5czpcbiAgICAgICB7XG4gICAgICAgXCJpZFwiOiBcImFjdHVhbFNwcml0ZU5hbWVcIixcbiAgICAgICBcInhwb3NcIjogNTAwLFxuICAgICAgIFwieXBvc1wiOiAyMDAsXG4gICAgICAgXCJ4c3BlZWRcIjogLTgsICAvLyBtb3ZlbWVudCBtdXN0IGJlIGJ5IGRpY3Rpb25hcnksXG4gICAgICAgXCJ5c3BlZWRcIjogMCwgICAvLyB3aXRoIHNvbWV0aGluZyBsaWtlIHggPSB4ICsgeHNwZWVkXG4gICAgICAgXCJoZWlnaHRcIjogNzQsXG4gICAgICAgXCJ3aWR0aFwiOiA3NVxuICAgICAgIH1cbiAgICAgICAqL1xuXG4gICAgdmFyIHBlcmNlbnRNYXJnaW4gPSAxLjE7IC8vIHBvc2l0aXZlIHBlcmNlbnQgaW4gZGVjaW1hbFxuICAgIHZhciBkaXI6IFNwcml0ZUhpdERpcmVjdGlvbmFsaXR5ID0ge1xuICAgICAgICBcImxlZnRcIjogZmFsc2UsXG4gICAgICAgIFwicmlnaHRcIjogZmFsc2UsXG4gICAgICAgIFwidXBcIjogZmFsc2UsXG4gICAgICAgIFwiZG93blwiOiBmYWxzZVxuICAgIH07XG5cbiAgICAvLyBjdXJyZW50IGhvcml6b250YWwgcG9zaXRpb25cbiAgICB2YXIgczFsZWZ0ID0gc3ByaXRlMUluZm9bXCJ4cG9zXCJdO1xuICAgIHZhciBzMXJpZ2h0ID0gczFsZWZ0ICsgc3ByaXRlMUluZm9bXCJ3aWR0aFwiXTtcblxuICAgIHZhciBzMmxlZnQgPSBzcHJpdGUySW5mb1tcInhwb3NcIl07XG4gICAgdmFyIHMycmlnaHQgPSBzMmxlZnQgKyBzcHJpdGUySW5mb1tcIndpZHRoXCJdO1xuXG4gICAgLy8gcmV2ZXJzZSBob3Jpem9udGFsIHBvc2l0aW9uIGJ5IHhzcGVlZCB3aXRoIHBlcmNlbnQgbWFyZ2luXG4gICAgdmFyIHNwcml0ZTFYU3BlZWQgPSBzcHJpdGUxSW5mb1tcInhzcGVlZFwiXSAqIHBlcmNlbnRNYXJnaW47XG4gICAgczFsZWZ0ID0gczFsZWZ0IC0gc3ByaXRlMVhTcGVlZDtcbiAgICBzMXJpZ2h0ID0gczFyaWdodCAtIHNwcml0ZTFYU3BlZWQ7XG5cbiAgICB2YXIgc3ByaXRlMlhTcGVlZCA9IHNwcml0ZTJJbmZvW1wieHNwZWVkXCJdICogcGVyY2VudE1hcmdpbjtcbiAgICBzMmxlZnQgPSBzMmxlZnQgLSBzcHJpdGUyWFNwZWVkO1xuICAgIHMycmlnaHQgPSBzMnJpZ2h0IC0gc3ByaXRlMlhTcGVlZDtcblxuICAgIGlmIChzMXJpZ2h0IDw9IHMybGVmdCkge1xuICAgICAgICBkaXJbXCJsZWZ0XCJdID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHMycmlnaHQgPD0gczFsZWZ0KSB7XG4gICAgICAgIGRpcltcInJpZ2h0XCJdID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBjdXJyZW50IHZlcnRpY2FsIHBvc2l0aW9uXG4gICAgdmFyIHMxdG9wID0gc3ByaXRlMUluZm9bXCJ5cG9zXCJdO1xuICAgIHZhciBzMWJvdHRvbSA9IHMxdG9wICsgc3ByaXRlMUluZm9bXCJoZWlnaHRcIl07XG5cbiAgICB2YXIgczJ0b3AgPSBzcHJpdGUySW5mb1tcInlwb3NcIl07XG4gICAgdmFyIHMyYm90dG9tID0gczJ0b3AgKyBzcHJpdGUySW5mb1tcImhlaWdodFwiXTtcblxuICAgIC8vIHJldmVyc2UgdmVydGljYWwgcG9zaXRpb24gYnkgeXNwZWVkIHdpdGggcGVyY2VudCBtYXJnaW5cbiAgICB2YXIgc3ByaXRlMVlTcGVlZCA9IHNwcml0ZTFJbmZvW1wieXNwZWVkXCJdICogcGVyY2VudE1hcmdpbjtcbiAgICBzMXRvcCA9IHMxdG9wIC0gc3ByaXRlMVlTcGVlZDtcbiAgICBzMWJvdHRvbSA9IHMxYm90dG9tIC0gc3ByaXRlMVlTcGVlZDtcblxuICAgIHZhciBzcHJpdGUyWVNwZWVkID0gc3ByaXRlMkluZm9bXCJ5c3BlZWRcIl0gKiBwZXJjZW50TWFyZ2luO1xuICAgIHMydG9wID0gczJ0b3AgLSBzcHJpdGUyWVNwZWVkO1xuICAgIHMyYm90dG9tID0gczJib3R0b20gLSBzcHJpdGUyWVNwZWVkO1xuXG4gICAgaWYgKHMxYm90dG9tIDw9IHMydG9wKSB7XG4gICAgICAgIGRpcltcInVwXCJdID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHMyYm90dG9tIDw9IHMxdG9wKSB7XG4gICAgICAgIGRpcltcImRvd25cIl0gPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBkaXI7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0S2V5U3RhdGUgPSAoa2V5OiBudW1iZXIpOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gISEkLmdRLmtleVRyYWNrZXJba2V5XTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRNb3VzZVggPSAoKTogbnVtYmVyID0+IHtcbiAgICByZXR1cm4gJC5nUS5tb3VzZVRyYWNrZXIueDtcbn07XG5leHBvcnQgY29uc3QgZ2V0TW91c2VZID0gKCk6IG51bWJlciA9PiB7XG4gICAgcmV0dXJuICQuZ1EubW91c2VUcmFja2VyLnk7XG59O1xuZXhwb3J0IGNvbnN0IGdldE1vdXNlQnV0dG9uMSA9ICgpOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gISEkLmdRLm1vdXNlVHJhY2tlclsxXTtcbn07XG5leHBvcnQgY29uc3QgZ2V0TW91c2VCdXR0b24yID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiAhISQuZ1EubW91c2VUcmFja2VyWzJdO1xufTtcbmV4cG9ydCBjb25zdCBnZXRNb3VzZUJ1dHRvbjMgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgcmV0dXJuICEhJC5nUS5tb3VzZVRyYWNrZXJbM107XG59O1xuXG5leHBvcnQgY29uc3QgZGlzYWJsZUNvbnRleHRNZW51ID0gKCk6IHZvaWQgPT4ge1xuICAgIC8vIHNlZSBhbHNvOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80OTIwMjIxL2pxdWVyeS1qcy1wcmV2ZW50LXJpZ2h0LWNsaWNrLW1lbnUtaW4tYnJvd3NlcnNcbiAgICAvLyAkKFwiI3BsYXlncm91bmRcIikuY29udGV4dG1lbnUoZnVuY3Rpb24oKXtyZXR1cm4gZmFsc2U7fSk7XG4gICAgJChcIiNwbGF5Z3JvdW5kXCIpLm9uKFwiY29udGV4dG1lbnVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG59O1xuZXhwb3J0IGNvbnN0IGVuYWJsZUNvbnRleHRNZW51ID0gKCk6IHZvaWQgPT4ge1xuICAgIC8vIHNlZSBhbHNvOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80OTIwMjIxL2pxdWVyeS1qcy1wcmV2ZW50LXJpZ2h0LWNsaWNrLW1lbnUtaW4tYnJvd3NlcnNcbiAgICAkKFwiI3BsYXlncm91bmRcIikub2ZmKFwiY29udGV4dG1lbnVcIik7XG59O1xuXG5leHBvcnQgY29uc3QgaGlkZU1vdXNlQ3Vyc29yID0gKCk6IHZvaWQgPT4ge1xuICAgICQoXCIjcGxheWdyb3VuZFwiKS5jc3MoXCJjdXJzb3JcIiwgXCJub25lXCIpO1xufTtcbmV4cG9ydCBjb25zdCBzaG93TW91c2VDdXJzb3IgPSAoKTogdm9pZCA9PiB7XG4gICAgJChcIiNwbGF5Z3JvdW5kXCIpLmNzcyhcImN1cnNvclwiLCBcImRlZmF1bHRcIik7XG59O1xuXG5leHBvcnQgY29uc3Qgc2F2ZURpY3Rpb25hcnlBcyA9IChzYXZlQXM6IHN0cmluZywgZGljdGlvbmFyeTogb2JqZWN0KTogdm9pZCA9PiB7XG4gICAgLy8gcmVxdWlyZXMganMtY29va2llOiBodHRwczovL2dpdGh1Yi5jb20vanMtY29va2llL2pzLWNvb2tpZS90cmVlL3YyLjAuNFxuICAgIENvb2tpZXMuc2V0KFwiR1FHX1wiICsgc2F2ZUFzLCBkaWN0aW9uYXJ5KTtcbn07XG5leHBvcnQgY29uc3QgZ2V0U2F2ZWREaWN0aW9uYXJ5ID0gKHNhdmVkQXM6IHN0cmluZyk6IG9iamVjdCA9PiB7XG4gICAgcmV0dXJuIENvb2tpZXMuZ2V0SlNPTihcIkdRR19cIiArIHNhdmVkQXMpO1xufTtcbmV4cG9ydCBjb25zdCBkZWxldGVTYXZlZERpY3Rpb25hcnkgPSAoc2F2ZWRBczogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgQ29va2llcy5yZW1vdmUoXCJHUUdfXCIgKyBzYXZlZEFzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVPdmFsSW5Hcm91cCA9IChcbiAgICBncm91cE5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgaWQ6IHN0cmluZyxcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHc6IG51bWJlcixcbiAgICBoOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgLy8gcm90ZGVnIGluIGRlZ3JlZXMgY2xvY2t3aXNlIG9uIHNjcmVlbiAocmVjYWxsIHktYXhpcyBwb2ludHMgZG93bndhcmRzISlcblxuICAgIGlmICghY29sb3IpIHtcbiAgICAgICAgY29sb3IgPSBcImdyYXlcIjtcbiAgICB9XG5cbiAgICBpZiAoIWdyb3VwTmFtZSkge1xuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRTcHJpdGUoaWQsIHsgd2lkdGg6IDEsIGhlaWdodDogMSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjcmVhdGVTcHJpdGVJbkdyb3VwKGdyb3VwTmFtZSwgaWQsIHsgd2lkdGg6IDEsIGhlaWdodDogMSB9KTtcbiAgICB9XG5cbiAgICB2YXIgYm9yZGVyX3JhZGl1cyA9ICh3IC8gMiArIFwicHggLyBcIiArIGggLyAyICsgXCJweFwiKTtcbiAgICBzcHJpdGUoaWQpXG4gICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIGNvbG9yKVxuICAgICAgICAuY3NzKFwiYm9yZGVyLXJhZGl1c1wiLCBib3JkZXJfcmFkaXVzKVxuICAgICAgICAuY3NzKFwiLW1vei1ib3JkZXItcmFkaXVzXCIsIGJvcmRlcl9yYWRpdXMpXG4gICAgICAgIC5jc3MoXCItd2Via2l0LWJvcmRlci1yYWRpdXNcIiwgYm9yZGVyX3JhZGl1cyk7XG5cbiAgICBzcHJpdGVTZXRXaWR0aEhlaWdodChpZCwgdywgaCk7XG4gICAgc3ByaXRlU2V0WFkoaWQsIHgsIHkpO1xuXG4gICAgaWYgKHJvdGRlZykge1xuICAgICAgICBpZiAocm90T3JpZ2luWCAmJiByb3RPcmlnaW5ZKSB7XG4gICAgICAgICAgICB2YXIgcm90T3JpZ2luID0gcm90T3JpZ2luWCArIFwicHggXCIgKyByb3RPcmlnaW5ZICsgXCJweFwiO1xuICAgICAgICAgICAgc3ByaXRlKGlkKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItd2Via2l0LXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItbW96LXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItbXMtdHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pXG4gICAgICAgICAgICAgICAgLmNzcyhcIi1vLXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCJ0cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbik7XG4gICAgICAgIH1cbiAgICAgICAgc3ByaXRlUm90YXRlKGlkLCByb3RkZWcpO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgY3JlYXRlT3ZhbCA9IChcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVPdmFsSW5Hcm91cChcbiAgICAgICAgbnVsbCxcbiAgICAgICAgaWQsXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHcsXG4gICAgICAgIGgsXG4gICAgICAgIGNvbG9yLFxuICAgICAgICByb3RkZWcsXG4gICAgICAgIHJvdE9yaWdpblgsXG4gICAgICAgIHJvdE9yaWdpbllcbiAgICApO1xufTtcbmV4cG9ydCBjb25zdCBkcmF3T3ZhbCA9IChcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHc6IG51bWJlcixcbiAgICBoOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgY3JlYXRlT3ZhbChcbiAgICAgICAgXCJHUUdfb3ZhbF9cIiArIEdRR19nZXRVbmlxdWVJZCgpLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICB3LFxuICAgICAgICBoLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlQ2lyY2xlSW5Hcm91cCA9IChcbiAgICBncm91cE5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgaWQ6IHN0cmluZyxcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHI6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVPdmFsSW5Hcm91cChcbiAgICAgICAgZ3JvdXBOYW1lLFxuICAgICAgICBpZCxcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgcixcbiAgICAgICAgcixcbiAgICAgICAgY29sb3IsXG4gICAgICAgIHJvdGRlZyxcbiAgICAgICAgcm90T3JpZ2luWCxcbiAgICAgICAgcm90T3JpZ2luWVxuICAgICk7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUNpcmNsZSA9IChcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgcjogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHJvdGRlZz86IG51bWJlcixcbiAgICByb3RPcmlnaW5YPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblk/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZUNpcmNsZUluR3JvdXAoXG4gICAgICAgIG51bGwsXG4gICAgICAgIGlkLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICByLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5leHBvcnQgY29uc3QgZHJhd0NpcmNsZSA9IChcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHI6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVDaXJjbGUoXG4gICAgICAgIFwiR1FHX2NpcmNsZV9cIiArIEdRR19nZXRVbmlxdWVJZCgpLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICByLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVSZWN0SW5Hcm91cCA9IChcbiAgICBncm91cE5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgaWQ6IHN0cmluZyxcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHc6IG51bWJlcixcbiAgICBoOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgLy8gcm90ZGVnIGluIGRlZ3JlZXMgY2xvY2t3aXNlIG9uIHNjcmVlbiAocmVjYWxsIHktYXhpcyBwb2ludHMgZG93bndhcmRzISlcbiAgICAvLyByb3RPcmlnaW57WCxZfSBtdXN0IGJlIHdpdGhpbiByYW5nZSBvZiB3aWRlIHcgYW5kIGhlaWdodCBoLCBhbmQgcmVsYXRpdmUgdG8gY29vcmRpbmF0ZSAoeCx5KS5cblxuICAgIGlmICghY29sb3IpIHtcbiAgICAgICAgY29sb3IgPSBcImdyYXlcIjtcbiAgICB9XG5cbiAgICBpZiAoIWdyb3VwTmFtZSkge1xuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRTcHJpdGUoaWQsIHsgd2lkdGg6IDEsIGhlaWdodDogMSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjcmVhdGVTcHJpdGVJbkdyb3VwKGdyb3VwTmFtZSwgaWQsIHsgd2lkdGg6IDEsIGhlaWdodDogMSB9KTtcbiAgICB9XG5cbiAgICBzcHJpdGUoaWQpLmNzcyhcImJhY2tncm91bmRcIiwgY29sb3IpO1xuXG4gICAgc3ByaXRlU2V0V2lkdGhIZWlnaHQoaWQsIHcsIGgpO1xuICAgIHNwcml0ZVNldFhZKGlkLCB4LCB5KTtcblxuICAgIGlmIChyb3RkZWcpIHtcbiAgICAgICAgaWYgKHJvdE9yaWdpblggJiYgcm90T3JpZ2luWSkge1xuICAgICAgICAgICAgdmFyIHJvdE9yaWdpbiA9IHJvdE9yaWdpblggKyBcInB4IFwiICsgcm90T3JpZ2luWSArIFwicHhcIjtcbiAgICAgICAgICAgIHNwcml0ZShpZClcbiAgICAgICAgICAgICAgICAuY3NzKFwiLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbilcbiAgICAgICAgICAgICAgICAuY3NzKFwiLW1vei10cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbilcbiAgICAgICAgICAgICAgICAuY3NzKFwiLW1zLXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItby10cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbilcbiAgICAgICAgICAgICAgICAuY3NzKFwidHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pO1xuICAgICAgICB9XG4gICAgICAgIHNwcml0ZVJvdGF0ZShpZCwgcm90ZGVnKTtcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVJlY3QgPSAoXG4gICAgaWQ6IHN0cmluZyxcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHc6IG51bWJlcixcbiAgICBoOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgY3JlYXRlUmVjdEluR3JvdXAoXG4gICAgICAgIG51bGwsXG4gICAgICAgIGlkLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICB3LFxuICAgICAgICBoLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5leHBvcnQgY29uc3QgZHJhd1JlY3QgPSAoXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICB3OiBudW1iZXIsXG4gICAgaDogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHJvdGRlZz86IG51bWJlcixcbiAgICByb3RPcmlnaW5YPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblk/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZVJlY3QoXG4gICAgICAgIFwiR1FHX3JlY3RfXCIgKyBHUUdfZ2V0VW5pcXVlSWQoKSxcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgdyxcbiAgICAgICAgaCxcbiAgICAgICAgY29sb3IsXG4gICAgICAgIHJvdGRlZyxcbiAgICAgICAgcm90T3JpZ2luWCxcbiAgICAgICAgcm90T3JpZ2luWVxuICAgICk7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlTGluZUluR3JvdXAgPSAoXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcgfCBudWxsLFxuICAgIGlkOiBzdHJpbmcsXG4gICAgeDE6IG51bWJlcixcbiAgICB5MTogbnVtYmVyLFxuICAgIHgyOiBudW1iZXIsXG4gICAgeTI6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICB0aGlja25lc3M/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGlmICghY29sb3IpIHtcbiAgICAgICAgY29sb3IgPSBcImdyYXlcIjtcbiAgICB9XG4gICAgaWYgKCF0aGlja25lc3MpIHtcbiAgICAgICAgdGhpY2tuZXNzID0gMjtcbiAgICB9XG4gICAgdmFyIHhkID0geDIgLSB4MTtcbiAgICB2YXIgeWQgPSB5MiAtIHkxO1xuICAgIHZhciBkaXN0ID0gTWF0aC5zcXJ0KHhkICogeGQgKyB5ZCAqIHlkKTtcblxuICAgIHZhciBhcmNDb3MgPSBNYXRoLmFjb3MoeGQgLyBkaXN0KTtcbiAgICBpZiAoeTIgPCB5MSkge1xuICAgICAgICBhcmNDb3MgKj0gLTE7XG4gICAgfVxuICAgIHZhciByb3RkZWcgPSBhcmNDb3MgKiAxODAgLyBNYXRoLlBJO1xuXG4gICAgdmFyIGhhbGZUaGljayA9IHRoaWNrbmVzcyAvIDI7XG4gICAgdmFyIGRyYXdZMSA9IHkxIC0gaGFsZlRoaWNrO1xuXG4gICAgY3JlYXRlUmVjdEluR3JvdXAoXG4gICAgICAgIGdyb3VwTmFtZSxcbiAgICAgICAgaWQsXG4gICAgICAgIHgxLFxuICAgICAgICBkcmF3WTEsXG4gICAgICAgIGRpc3QsXG4gICAgICAgIHRoaWNrbmVzcyxcbiAgICAgICAgY29sb3IsXG4gICAgICAgIHJvdGRlZyxcbiAgICAgICAgMCxcbiAgICAgICAgaGFsZlRoaWNrXG4gICAgKTtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlTGluZSA9IChcbiAgICBpZDogc3RyaW5nLFxuICAgIHgxOiBudW1iZXIsXG4gICAgeTE6IG51bWJlcixcbiAgICB4MjogbnVtYmVyLFxuICAgIHkyOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgdGhpY2tuZXNzPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVMaW5lSW5Hcm91cChudWxsLCBpZCwgeDEsIHkxLCB4MiwgeTIsIGNvbG9yLCB0aGlja25lc3MpO1xufTtcbmV4cG9ydCBjb25zdCBkcmF3TGluZSA9IChcbiAgICB4MTogbnVtYmVyLFxuICAgIHkxOiBudW1iZXIsXG4gICAgeDI6IG51bWJlcixcbiAgICB5MjogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHRoaWNrbmVzcz86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgY3JlYXRlTGluZShcIkdRR19saW5lX1wiICsgR1FHX2dldFVuaXF1ZUlkKCksIHgxLCB5MSwgeDIsIHkyLCBjb2xvciwgdGhpY2tuZXNzKTtcbn07XG5cbmV4cG9ydCB0eXBlIENvbnRhaW5lckl0ZXJhdG9yID0ge1xuICAgIG5leHQ6ICgpID0+IFtudW1iZXIsIG51bWJlcl07XG4gICAgaGFzTmV4dDogKCkgPT4gYm9vbGVhbjtcbiAgICBjdXJyZW50OiBudW1iZXI7XG4gICAgZW5kOiBudW1iZXI7XG4gICAgX2tleXM6IHN0cmluZ1tdO1xufTtcbmV4cG9ydCB0eXBlIE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuID0gKG46IG51bWJlcikgPT4gbnVtYmVyIHwgUmVjb3JkPFxuICAgIG51bWJlcixcbiAgICBudW1iZXJcbj47XG5leHBvcnQgdHlwZSBDcmVhdGVDb250YWluZXJJdGVyYXRvckZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyXG4gICAgKTogQ29udGFpbmVySXRlcmF0b3I7XG4gICAgKHRoaXM6IHZvaWQsIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuKTogQ29udGFpbmVySXRlcmF0b3I7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUNvbnRhaW5lckl0ZXJhdG9yOiBDcmVhdGVDb250YWluZXJJdGVyYXRvckZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgc3RhcnQ/OiBudW1iZXIsXG4gICAgZW5kPzogbnVtYmVyLFxuICAgIHN0ZXBzaXplPzogbnVtYmVyXG4pOiBDb250YWluZXJJdGVyYXRvciB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGYgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgY29uc3QgZk93blByb3BOYW1lczogc3RyaW5nW10gPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhmKTtcbiAgICAgICAgY29uc3QgaXQ6IENvbnRhaW5lckl0ZXJhdG9yID0ge1xuICAgICAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgICAgIGVuZDogZk93blByb3BOYW1lcy5sZW5ndGgsXG4gICAgICAgICAgICBfa2V5czogZk93blByb3BOYW1lcyxcbiAgICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uICh0aGlzOiBDb250YWluZXJJdGVyYXRvcik6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1JZHggPSB0aGlzLl9rZXlzW3RoaXMuY3VycmVudF07XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbTogW251bWJlciwgbnVtYmVyXSA9IFtOdW1iZXIoaXRlbUlkeCksIGZbaXRlbUlkeF1dO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCsrO1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhhc05leHQ6IGZ1bmN0aW9uICh0aGlzOiBDb250YWluZXJJdGVyYXRvcik6IGJvb2xlYW4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAodGhpcy5jdXJyZW50IDwgdGhpcy5lbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gaXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcInN0YXJ0IG11c3QgYmUgYSBudW1iZXIuXCIsIHN0YXJ0KTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcImVuZCBtdXN0IGJlIGEgbnVtYmVyLlwiLCBlbmQpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwic3RlcHNpemUgbXVzdCBiZSBhIG51bWJlci5cIiwgc3RlcHNpemUpO1xuICAgICAgICBpZiAoc3RhcnQgPT0gbnVsbCB8fCBlbmQgPT0gbnVsbCB8fCBzdGVwc2l6ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBcIlRTIHR5cGUgaGludFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZng6IChuOiBudW1iZXIpID0+IG51bWJlciA9ICh0eXBlb2YgZiA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICA/IChmIGFzICh4OiBudW1iZXIpID0+IG51bWJlcilcbiAgICAgICAgICAgIDogKHg6IG51bWJlcik6IG51bWJlciA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE51bWJlcihmW3hdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBjb25zdCBpdDogQ29udGFpbmVySXRlcmF0b3IgPSB7XG4gICAgICAgICAgICBuZXh0OiBmdW5jdGlvbiAodGhpczogQ29udGFpbmVySXRlcmF0b3IpOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtOiBbbnVtYmVyLCBudW1iZXJdID0gW3RoaXMuY3VycmVudCwgZngodGhpcy5jdXJyZW50KV07XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50ICs9IHN0ZXBzaXplO1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhhc05leHQ6IGZ1bmN0aW9uICh0aGlzOiBDb250YWluZXJJdGVyYXRvcik6IGJvb2xlYW4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAodGhpcy5jdXJyZW50IDwgdGhpcy5lbmQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGN1cnJlbnQ6IHN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBlbmQsXG4gICAgICAgICAgICBfa2V5czogdHlwZW9mIGYgIT09IFwiZnVuY3Rpb25cIiA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGYpIDogKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgazogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSBzdGFydDsgaSA8IGVuZDsgaSArPSBzdGVwc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICBrLnB1c2goU3RyaW5nKGkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGs7XG4gICAgICAgICAgICB9KSgpXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBpdDtcbiAgICB9XG59O1xuZXhwb3J0IHR5cGUgR3JhcGhDcmVhdGlvbk9wdGlvbnMgPSB7XG4gICAgaW50ZXJwb2xhdGVkOiBib29sZWFuO1xufTtcbmV4cG9ydCB0eXBlIENyZWF0ZUdyYXBoV2l0aE9wdGlvbnNGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgbW9yZU9wdHM6IEdyYXBoQ3JlYXRpb25PcHRpb25zLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgcmFkaXVzX3RoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIG1vcmVPcHRzOiBHcmFwaENyZWF0aW9uT3B0aW9ucyxcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgbW9yZU9wdHM6IEdyYXBoQ3JlYXRpb25PcHRpb25zLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnMsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIHJhZGl1c190aGlja25lc3M6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnMsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgbW9yZU9wdHM6IEdyYXBoQ3JlYXRpb25PcHRpb25zXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG59O1xuZXhwb3J0IHR5cGUgR3JvdXBOYW1lQW5kSWRQcmVmaXggPSB7XG4gICAgXCJpZFwiOiBzdHJpbmc7XG4gICAgXCJncm91cFwiOiBzdHJpbmc7XG59O1xudHlwZSBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzID0gW1xuICAgIHN0cmluZyxcbiAgICBzdHJpbmcsXG4gICAgTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgR3JhcGhDcmVhdGlvbk9wdGlvbnNcbl07XG5leHBvcnQgY29uc3QgY3JlYXRlR3JhcGhXaXRoT3B0aW9uczogQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgaWQ6IHN0cmluZyxcbiAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnNcbik6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBtb3JlT3B0cywgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yLCByYWRpdXNfdGhpY2tuZXNzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIG1vcmVPcHRzLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgbW9yZU9wdHMsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIG1vcmVPcHRzLCBjb2xvciwgcmFkaXVzX3RoaWNrbmVzcylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBtb3JlT3B0cywgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgbW9yZU9wdHMpXG4gICAgLy8gbW9yZU9wdHMgPSB7XCJpbnRlcnBvbGF0ZWRcIjogdHJ1ZU9yRmFsc2V9XG4gICAgdmFyIGludGVycG9sYXRlZCA9IG1vcmVPcHRzW1wiaW50ZXJwb2xhdGVkXCJdO1xuXG4gICAgaWYgKCFpZCkge1xuICAgICAgICBpZCA9IFwiR1FHX2dyYXBoX1wiICsgR1FHX2dldFVuaXF1ZUlkKCk7XG4gICAgfVxuICAgIGlmICghZ3JvdXBOYW1lKSB7XG4gICAgICAgIGdyb3VwTmFtZSA9IGlkICsgXCJfZ3JvdXBcIjtcbiAgICAgICAgY3JlYXRlR3JvdXBJblBsYXlncm91bmQoZ3JvdXBOYW1lKTtcbiAgICB9XG4gICAgdmFyIGdyb3VwX2lkID0ge1xuICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICBcImdyb3VwXCI6IGdyb3VwTmFtZVxuICAgIH07XG5cbiAgICB2YXIgY29sb3I7XG4gICAgdmFyIHJhZGl1c190aGlja25lc3M7XG4gICAgbGV0IGl0ZXI6IENvbnRhaW5lckl0ZXJhdG9yO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQgJiYgYXJndW1lbnRzLmxlbmd0aCA8PSA2ICYmXG4gICAgICAgIFwib2JqZWN0XCIgPT09IHR5cGVvZiAoZikpIHtcbiAgICAgICAgY29sb3IgPSBhcmd1bWVudHNbNF07XG4gICAgICAgIHJhZGl1c190aGlja25lc3MgPSBhcmd1bWVudHNbNV07XG4gICAgICAgIGl0ZXIgPSBjcmVhdGVDb250YWluZXJJdGVyYXRvcihmKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNyAmJiBhcmd1bWVudHMubGVuZ3RoIDw9IDkpIHtcbiAgICAgICAgdmFyIHN0YXJ0ID0gYXJndW1lbnRzWzRdO1xuICAgICAgICB2YXIgZW5kID0gYXJndW1lbnRzWzVdO1xuICAgICAgICB2YXIgc3RlcHNpemUgPSBhcmd1bWVudHNbNl07XG4gICAgICAgIGNvbG9yID0gYXJndW1lbnRzWzddO1xuICAgICAgICByYWRpdXNfdGhpY2tuZXNzID0gYXJndW1lbnRzWzhdO1xuICAgICAgICBpdGVyID0gY3JlYXRlQ29udGFpbmVySXRlcmF0b3IoZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJGdW5jdGlvbiB1c2VkIHdpdGggd3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50c1wiKTtcbiAgICAgICAgdGhyb3cgXCJUUyB0eXBlIGhpbnRcIjtcbiAgICB9XG5cbiAgICBpZiAoY29sb3IgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbG9yID0gXCJncmF5XCI7XG4gICAgfVxuICAgIGlmIChyYWRpdXNfdGhpY2tuZXNzID09IHVuZGVmaW5lZCkge1xuICAgICAgICByYWRpdXNfdGhpY2tuZXNzID0gMjtcbiAgICB9XG5cbiAgICB2YXIgY3VyclggPSBudWxsO1xuICAgIHZhciBjdXJyWSA9IG51bGw7XG4gICAgd2hpbGUgKGl0ZXIuaGFzTmV4dCgpKSB7XG4gICAgICAgIHZhciBpdGVtID0gaXRlci5uZXh0KCk7XG4gICAgICAgIHZhciBpID0gaXRlbVswXTtcbiAgICAgICAgdmFyIGZ4aSA9IGl0ZW1bMV07XG5cbiAgICAgICAgaWYgKGZ4aSA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgICAgIGZ4aSA9IEdRR19NQVhfU0FGRV9QTEFZR1JPVU5EX0lOVEVHRVI7XG4gICAgICAgIH0gZWxzZSBpZiAoZnhpID09PSAtSW5maW5pdHkpIHtcbiAgICAgICAgICAgIGZ4aSA9IEdRR19NSU5fU0FGRV9QTEFZR1JPVU5EX0lOVEVHRVI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VyclkgPT09IG51bGwgJiYgZnhpICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY3VyclggPSBpO1xuICAgICAgICAgICAgY3VyclkgPSBmeGk7XG4gICAgICAgICAgICBpZiAoIWludGVycG9sYXRlZCkge1xuICAgICAgICAgICAgICAgIGNyZWF0ZUNpcmNsZUluR3JvdXAoXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwX2lkW1wiZ3JvdXBcIl0sXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwX2lkW1wiaWRcIl0gKyBcIl9ncmFwaF9wdF9cIiArIGksXG4gICAgICAgICAgICAgICAgICAgIGksXG4gICAgICAgICAgICAgICAgICAgIGZ4aSxcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzX3RoaWNrbmVzcyxcbiAgICAgICAgICAgICAgICAgICAgY29sb3JcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZ4aSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmICghaW50ZXJwb2xhdGVkKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlQ2lyY2xlSW5Hcm91cChcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBfaWRbXCJncm91cFwiXSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBfaWRbXCJpZFwiXSArIFwiX2dyYXBoX3B0X1wiICsgaSxcbiAgICAgICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICAgICAgZnhpLFxuICAgICAgICAgICAgICAgICAgICByYWRpdXNfdGhpY2tuZXNzLFxuICAgICAgICAgICAgICAgICAgICBjb2xvclxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNyZWF0ZUxpbmVJbkdyb3VwKFxuICAgICAgICAgICAgICAgICAgICBncm91cF9pZFtcImdyb3VwXCJdLFxuICAgICAgICAgICAgICAgICAgICBncm91cF9pZFtcImlkXCJdICsgXCJfZ3JhcGhfbGluZV9cIiArIGN1cnJYICsgXCItXCIgKyBpLFxuICAgICAgICAgICAgICAgICAgICBjdXJyWCBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIGN1cnJZIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICAgICAgZnhpLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzX3RoaWNrbmVzc1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyWCA9IGk7XG4gICAgICAgICAgICBjdXJyWSA9IGZ4aTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBncm91cF9pZDtcbn07XG5cbnR5cGUgQ3JlYXRlR3JhcGhJbkdyb3VwRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXJcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuXG4gICAgKTogdm9pZDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlR3JhcGhJbkdyb3VwOiBDcmVhdGVHcmFwaEluR3JvdXBGbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgIGlkOiBzdHJpbmcsXG4gICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm5cbik6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmKVxuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBhcmdzLnNwbGljZSgzLCAwLCB7IFwiaW50ZXJwb2xhdGVkXCI6IGZhbHNlIH0pO1xuICAgIHJldHVybiBjcmVhdGVHcmFwaFdpdGhPcHRpb25zLmFwcGx5KFxuICAgICAgICB0aGlzLFxuICAgICAgICBhcmdzIGFzIENyZWF0ZUdyYXBoV2l0aE9wdGlvbnNGblBhcmFtVHlwZXNcbiAgICApO1xufTtcblxudHlwZSBDcmVhdGVHcmFwaEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAodGhpczogdm9pZCwgaWQ6IHN0cmluZywgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4pOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlR3JhcGg6IENyZWF0ZUdyYXBoRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZFxuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXgge1xuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSlcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYpXG4gICAgdmFyIG9wdHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIG9wdHMuc3BsaWNlKDAsIDAsIG51bGwpO1xuICAgIG9wdHMuc3BsaWNlKDMsIDAsIHsgXCJpbnRlcnBvbGF0ZWRcIjogZmFsc2UgfSk7XG4gICAgcmV0dXJuIGNyZWF0ZUdyYXBoV2l0aE9wdGlvbnMuYXBwbHkoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIG9wdHMgYXMgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuUGFyYW1UeXBlc1xuICAgICk7XG59O1xuXG50eXBlIERyYXdHcmFwaEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICBkb3RSYWRpdXM6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAodGhpczogdm9pZCwgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4pOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbn07XG5leHBvcnQgY29uc3QgZHJhd0dyYXBoOiBEcmF3R3JhcGhGbiA9IGZ1bmN0aW9uIGRyYXdHcmFwaChcbiAgICB0aGlzOiB2b2lkXG4pOiBHcm91cE5hbWVBbmRJZFByZWZpeCB7XG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yLCBkb3RSYWRpdXMpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYsIGNvbG9yLCBkb3RSYWRpdXMpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZilcbiAgICB2YXIgb3B0cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgb3B0cy5zcGxpY2UoMCwgMCwgbnVsbCk7XG4gICAgb3B0cy5zcGxpY2UoMCwgMCwgbnVsbCk7XG4gICAgb3B0cy5zcGxpY2UoMywgMCwgeyBcImludGVycG9sYXRlZFwiOiBmYWxzZSB9KTtcbiAgICByZXR1cm4gY3JlYXRlR3JhcGhXaXRoT3B0aW9ucy5hcHBseShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgb3B0cyBhcyBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzXG4gICAgKTtcbn07XG5cbnR5cGUgQ3JlYXRlSW50ZXJwb2xhdGVkR3JhcGhJbkdyb3VwRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICB0aGlja25lc3M6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICB0aGlja25lc3M6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm5cbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlSW50ZXJwb2xhdGVkR3JhcGhJbkdyb3VwOiBDcmVhdGVJbnRlcnBvbGF0ZWRHcmFwaEluR3JvdXBGbiA9XG4gICAgZnVuY3Rpb24gKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm5cbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeCB7XG4gICAgICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvciwgdGhpY2tuZXNzKVxuICAgICAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplKVxuICAgICAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBjb2xvciwgdGhpY2tuZXNzKVxuICAgICAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBjb2xvcilcbiAgICAgICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZilcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICBhcmdzLnNwbGljZSgzLCAwLCB7IFwiaW50ZXJwb2xhdGVkXCI6IHRydWUgfSk7XG4gICAgICAgIHJldHVybiBjcmVhdGVHcmFwaFdpdGhPcHRpb25zLmFwcGx5KFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIGFyZ3MgYXMgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuUGFyYW1UeXBlc1xuICAgICAgICApO1xuICAgIH07XG5cbnR5cGUgQ3JlYXRlSW50ZXJwb2xhdGVkR3JhcGhGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgdGhpY2tuZXNzOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgdGhpY2tuZXNzOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKHRoaXM6IHZvaWQsIGlkOiBzdHJpbmcsIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUludGVycG9sYXRlZEdyYXBoOiBDcmVhdGVJbnRlcnBvbGF0ZWRHcmFwaEZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWRcbik6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yLCB0aGlja25lc3MpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYsIGNvbG9yLCB0aGlja25lc3MpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmKVxuICAgIHZhciBvcHRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBvcHRzLnNwbGljZSgwLCAwLCBudWxsKTtcbiAgICBvcHRzLnNwbGljZSgzLCAwLCB7IFwiaW50ZXJwb2xhdGVkXCI6IHRydWUgfSk7XG4gICAgcmV0dXJuIGNyZWF0ZUdyYXBoV2l0aE9wdGlvbnMuYXBwbHkoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIG9wdHMgYXMgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuUGFyYW1UeXBlc1xuICAgICk7XG4gICAgLy8gcmV0dXJuIGNyZWF0ZUludGVycG9sYXRlZEdyYXBoSW5Hcm91cC5hcHBseSh0aGlzLCBvcHRzKTtcbn07XG5cbnR5cGUgRHJhd0ludGVycG9sYXRlZEdyYXBoRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIHRoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIHRoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgICh0aGlzOiB2b2lkLCBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbik6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xufTtcbmV4cG9ydCBjb25zdCBkcmF3SW50ZXJwb2xhdGVkR3JhcGg6IERyYXdJbnRlcnBvbGF0ZWRHcmFwaEZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWRcbik6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIHRoaWNrbmVzcylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgY29sb3IsIHRoaWNrbmVzcylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmKVxuICAgIHZhciBvcHRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBvcHRzLnNwbGljZSgwLCAwLCBudWxsKTtcbiAgICBvcHRzLnNwbGljZSgwLCAwLCBudWxsKTtcbiAgICBvcHRzLnNwbGljZSgzLCAwLCB7IFwiaW50ZXJwb2xhdGVkXCI6IHRydWUgfSk7XG4gICAgcmV0dXJuIGNyZWF0ZUdyYXBoV2l0aE9wdGlvbnMuYXBwbHkoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIG9wdHMgYXMgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuUGFyYW1UeXBlc1xuICAgICk7XG59O1xuIl19