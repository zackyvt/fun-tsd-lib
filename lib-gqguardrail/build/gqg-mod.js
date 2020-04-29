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
const GQG_IN_MYPROGRAM_MSG = 'in "myprogram.js"- ';
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
const throwConsoleError = (msg) => {
    // Firefox wouldn't print uncaught exceptions with file name/line number
    // but adding "new Error()" to the throw below fixed it...
    throw new Error(msg);
};
const throwConsoleErrorInMyprogram = (msg) => {
    throwConsoleError(GQG_IN_MYPROGRAM_MSG + msg);
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
    // what this function throws cannot be caught by caller tho...
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
            throwConsoleError("Deprecated function used: forEach2SpritesHit.  Use when2SpritesHit instead for better performance.");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3FnLW1vZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9jaGVuZy9EZXNrdG9wL1RTLWRldi9mdW4tdGVybWluYWwtbGliLmdpdHJlcG8vbGliLWdxZ3VhcmRyYWlsL3NyYy9ncWctbW9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQTRCYixrREFBa0Q7QUFDbEQsSUFBSSxTQUFTLEdBQVksSUFBSSxDQUFDO0FBQzlCLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxDQUFDLEtBQWMsRUFBUSxFQUFFO0lBQ25ELElBQUksS0FBSyxFQUFFO1FBQ1AsU0FBUyxHQUFHLElBQUksQ0FBQztLQUNwQjtTQUFNO1FBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsR0FBRyxrRUFBa0UsQ0FBQyxDQUFDO1FBQy9HLFNBQVMsR0FBRyxLQUFLLENBQUM7S0FDckI7QUFDTCxDQUFDLENBQUM7QUFFRixNQUFNLGtDQUFrQyxHQUFHLDZCQUE2QixDQUFDO0FBQ3pFLE1BQU0sQ0FBQyxNQUFNLDRCQUE0QixHQUFHLENBQ3hDLGlCQUFrQyxFQUMzQixFQUFFO0lBQ1QsSUFBSSxPQUFPLGlCQUFpQixLQUFLLFFBQVE7UUFDckMsT0FBTyxpQkFBaUIsS0FBSyxRQUFRLEVBQUU7UUFDdkMsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFDRCxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNqRCxJQUFJLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUM5RSxXQUFXLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDL0MsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUMxQixPQUFPLEtBQUssQ0FBQztLQUNoQjtJQUVELE9BQU8sQ0FBQyxpQkFBaUIsS0FB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RiwyREFBMkQ7QUFDL0QsQ0FBQyxDQUFDO0FBd0NGLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUE0QjtJQUcxRCw0REFBNEQ7SUFDNUQsaURBQWlEO0lBQ2pELDBDQUEwQztJQUMxQyxzQ0FBc0M7SUFDdEMsMkJBQTJCO0lBQzNCLG9CQUFvQjtJQUNwQixJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM1QyxPQUFPLHNCQUFzQixDQUFDLEtBQUssQ0FDL0IsSUFBSSxFQUNKLElBQTBDLENBQzdDLENBQUM7QUFDTixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbi8qXG4gKiBDb3B5cmlnaHQgMjAxMiwgMjAxNiwgMjAxNywgMjAxOSwgMjAyMCBDYXJzb24gQ2hlbmdcbiAqIFRoaXMgU291cmNlIENvZGUgRm9ybSBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBvZiB0aGUgTW96aWxsYSBQdWJsaWNcbiAqIExpY2Vuc2UsIHYuIDIuMC4gSWYgYSBjb3B5IG9mIHRoZSBNUEwgd2FzIG5vdCBkaXN0cmlidXRlZCB3aXRoIHRoaXNcbiAqIGZpbGUsIFlvdSBjYW4gb2J0YWluIG9uZSBhdCBodHRwczovL21vemlsbGEub3JnL01QTC8yLjAvLlxuICovXG4vKlxuICogR1FHdWFyZHJhaWwgdjAuOC4wIGlzIGEgd3JhcHBlciBhcm91bmQgZ2FtZVF1ZXJ5IHJldi4gMC43LjEuXG4gKiBNYWtlcyB0aGluZ3MgbW9yZSBwcm9jZWR1cmFsLCB3aXRoIGEgYml0IG9mIGZ1bmN0aW9uYWwuXG4gKiBBZGRzIGluIGhlbHBmdWwgZXJyb3IgbWVzc2FnZXMgZm9yIHN0dWRlbnRzLlxuICogbG9hZCB0aGlzIGFmdGVyIGdhbWVRdWVyeS5cbiAqL1xuXG5leHBvcnQgdHlwZSBzcHJpdGVEb21PYmplY3QgPSB7XG4gICAgd2lkdGg6IChuOiBudW1iZXIpID0+IHNwcml0ZURvbU9iamVjdDtcbiAgICBoZWlnaHQ6IChuOiBudW1iZXIpID0+IHNwcml0ZURvbU9iamVjdDtcbiAgICBzZXRBbmltYXRpb246IChvPzpvYmplY3QsIGY/OiBGdW5jdGlvbik9PmFueTtcbiAgICBjc3M6IChhdHRyOnN0cmluZywgdmFsOnN0cmluZ3xudW1iZXIpPT5zcHJpdGVEb21PYmplY3Q7XG4gICAgcGxheWdyb3VuZDogKG86b2JqZWN0KT0+YW55O1xufTtcbmRlY2xhcmUgdmFyICQ6IGFueTtcbmRlY2xhcmUgdmFyIENvb2tpZXM6IHtcbiAgICBzZXQ6IChhcmcwOiBzdHJpbmcsIGFyZzE6IG9iamVjdCkgPT4gdm9pZDtcbiAgICBnZXRKU09OOiAoYXJnMDogc3RyaW5nKSA9PiBvYmplY3Q7XG4gICAgcmVtb3ZlOiAoYXJnMDogc3RyaW5nKSA9PiB2b2lkO1xufTtcblxuLy8gc3R1ZGVudHMgYXJlIG5vdCBzdXBwb3NlZCB0byB1c2UgR1FHXyB2YXJpYWJsZXNcbmxldCBHUUdfREVCVUc6IGJvb2xlYW4gPSB0cnVlO1xuZXhwb3J0IGNvbnN0IHNldEdxRGVidWdGbGFnID0gKGRlYnVnOiBib29sZWFuKTogdm9pZCA9PiB7XG4gICAgaWYgKGRlYnVnKSB7XG4gICAgICAgIEdRR19ERUJVRyA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coR1FHX1dBUk5JTkdfSU5fTVlQUk9HUkFNX01TRyArIFwiZGVidWcgbW9kZSBkaXNhYmxlZCBhbmQgeW91ciBjb2RlIGlzIG5vdyBydW5uaW5nIGluIHVuc2FmZSBtb2RlLlwiKTtcbiAgICAgICAgR1FHX0RFQlVHID0gZmFsc2U7XG4gICAgfVxufTtcblxuY29uc3QgR1FHX1NQUklURV9HUk9VUF9OQU1FX0ZPUk1BVF9SRUdFWCA9IC9bYS16QS1aMC05X10rW2EtekEtWjAtOV8tXSovO1xuZXhwb3J0IGNvbnN0IHNwcml0ZUdyb3VwTmFtZUZvcm1hdElzVmFsaWQgPSAoXG4gICAgc3ByaXRlT3JHcm91cE5hbWU6IHN0cmluZyB8IG51bWJlclxuKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKHR5cGVvZiBzcHJpdGVPckdyb3VwTmFtZSAhPT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICB0eXBlb2Ygc3ByaXRlT3JHcm91cE5hbWUgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBzcHJpdGVPckdyb3VwTmFtZSA9IHNwcml0ZU9yR3JvdXBOYW1lLnRvU3RyaW5nKCk7XG4gICAgbGV0IG5hbWVNYXRjaGVzID0gc3ByaXRlT3JHcm91cE5hbWUubWF0Y2goR1FHX1NQUklURV9HUk9VUF9OQU1FX0ZPUk1BVF9SRUdFWCk7XG4gICAgbmFtZU1hdGNoZXMgPSAobmFtZU1hdGNoZXMgPyBuYW1lTWF0Y2hlcyA6IFtdKTtcbiAgICBpZiAobmFtZU1hdGNoZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gKHNwcml0ZU9yR3JvdXBOYW1lID09PSBuYW1lTWF0Y2hlc1swXSk7XG59O1xuXG5jb25zdCBHUUdfU0lHTkFMUzogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gPSB7fTtcbmxldCBHUUdfVU5JUVVFX0lEX0NPVU5URVIgPSAwO1xuXG5sZXQgR1FHX1BMQVlHUk9VTkRfV0lEVEggPSA2NDA7XG5sZXQgR1FHX1BMQVlHUk9VTkRfSEVJR0hUID0gNDgwO1xuZXhwb3J0IGxldCBQTEFZR1JPVU5EX1dJRFRIID0gR1FHX1BMQVlHUk9VTkRfV0lEVEg7IC8vIHN0dWRlbnRzIGFyZSBub3Qgc3VwcG9zZWQgdG8gdXNlIEdRR18gdmFyaWFibGVzXG5leHBvcnQgbGV0IFBMQVlHUk9VTkRfSEVJR0hUID0gR1FHX1BMQVlHUk9VTkRfSEVJR0hUO1xuXG5leHBvcnQgY29uc3QgQU5JTUFUSU9OX0hPUklaT05UQUw6IG51bWJlciA9ICQuZ1EuQU5JTUFUSU9OX0hPUklaT05UQUw7XG5leHBvcnQgY29uc3QgQU5JTUFUSU9OX1ZFUlRJQ0FMOiBudW1iZXIgPSAkLmdRLkFOSU1BVElPTl9WRVJUSUNBTDtcbmV4cG9ydCBjb25zdCBBTklNQVRJT05fT05DRTogbnVtYmVyID0gJC5nUS5BTklNQVRJT05fT05DRTtcbmV4cG9ydCBjb25zdCBBTklNQVRJT05fUElOR1BPTkc6IG51bWJlciA9ICQuZ1EuQU5JTUFUSU9OX1BJTkdQT05HO1xuZXhwb3J0IGNvbnN0IEFOSU1BVElPTl9DQUxMQkFDSzogbnVtYmVyID0gJC5nUS5BTklNQVRJT05fQ0FMTEJBQ0s7XG5leHBvcnQgY29uc3QgQU5JTUFUSU9OX01VTFRJOiBudW1iZXIgPSAkLmdRLkFOSU1BVElPTl9NVUxUSTtcblxuXG4vLyBNYXgvTWluIFNhZmUgUGxheWdyb3VuZCBJbnRlZ2VycyBmb3VuZCBieSBleHBlcmltZW50aW5nIHdpdGggR1EgMC43LjEgaW4gRmlyZWZveCA0MS4wLjIgb24gTWFjIE9TIFggMTAuMTAuNVxuY29uc3QgR1FHX01JTl9TQUZFX1BMQVlHUk9VTkRfSU5URUdFUiA9IC0oTWF0aC5wb3coMiwgMjQpIC0gMSk7IC8vIGNmLiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9OdW1iZXIvTUlOX1NBRkVfSU5URUdFUlxuY29uc3QgR1FHX01BWF9TQUZFX1BMQVlHUk9VTkRfSU5URUdFUiA9IChNYXRoLnBvdygyLCAyNCkgLSAxKTsgLy8gY2YuIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL051bWJlci9NQVhfU0FGRV9JTlRFR0VSXG5cblxuY29uc3QgR1FHX2dldFVuaXF1ZUlkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIERhdGUubm93KCkgKyBcIl9cIiArIEdRR19VTklRVUVfSURfQ09VTlRFUisrO1xufTtcblxuZXhwb3J0IGNvbnN0IHNldEdxUGxheWdyb3VuZERpbWVuc2lvbnMgPSAoXG4gICAgd2lkdGg6IG51bWJlcixcbiAgICBoZWlnaHQ6IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgLy8gdGhpcyBtdXN0IGJlIGV4ZWN1dGVkIG91dHNpZGUgb2Ygc2V0dXAgYW5kIGRyYXcgZnVuY3Rpb25zXG4gICAgR1FHX1BMQVlHUk9VTkRfSEVJR0hUID0gaGVpZ2h0O1xuICAgIFBMQVlHUk9VTkRfSEVJR0hUID0gaGVpZ2h0O1xuICAgIEdRR19QTEFZR1JPVU5EX1dJRFRIID0gd2lkdGg7XG4gICAgUExBWUdST1VORF9XSURUSCA9IHdpZHRoO1xuICAgIHNwcml0ZShcInBsYXlncm91bmRcIikud2lkdGgod2lkdGgpLmhlaWdodChoZWlnaHQpO1xufTtcblxuZXhwb3J0IGNvbnN0IGN1cnJlbnREYXRlID0gKCk6IG51bWJlciA9PiB7XG4gICAgcmV0dXJuIERhdGUubm93KCk7XG59O1xuXG5leHBvcnQgY29uc3QgY29uc29sZVByaW50ID0gKC4uLnR4dDogYW55KTogdm9pZCA9PiB7XG4gICAgLy8gbWlnaHQgd29yayBvbmx5IGluIENocm9tZSBvciBpZiBzb21lIGRldmVsb3BtZW50IGFkZC1vbnMgYXJlIGluc3RhbGxlZFxuICAgIGNvbnNvbGUubG9nKC4uLnR4dCk7XG59O1xuXG5cbmNvbnN0IEdRR19JTl9NWVBST0dSQU1fTVNHID0gJ2luIFwibXlwcm9ncmFtLmpzXCItICc7XG5jb25zdCBHUUdfRVJST1JfSU5fTVlQUk9HUkFNX01TRyA9IFwiRXJyb3IgXCIgKyBHUUdfSU5fTVlQUk9HUkFNX01TRztcbmNvbnN0IEdRR19XQVJOSU5HX0lOX01ZUFJPR1JBTV9NU0cgPSAnV2FybmluZyAnICsgR1FHX0lOX01ZUFJPR1JBTV9NU0c7XG5cbmNvbnN0IHByaW50RXJyb3JUb0NvbnNvbGVPbmNlID0gKCgpID0+IHtcbiAgICB2YXIgdGhyb3dDb25zb2xlRXJyb3JfcHJpbnRlZDogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gPSB7fTtcbiAgICByZXR1cm4gKG1zZzogc3RyaW5nKSA9PiB7XG4gICAgICAgIC8vIEZpcmVmb3ggd291bGRuJ3QgcHJpbnQgdW5jYXVnaHQgZXhjZXB0aW9ucyB3aXRoIGZpbGUgbmFtZS9saW5lIG51bWJlclxuICAgICAgICAvLyBidXQgYWRkaW5nIFwibmV3IEVycm9yKClcIiB0byB0aGUgdGhyb3cgYmVsb3cgZml4ZWQgaXQuLi5cbiAgICAgICAgaWYgKCF0aHJvd0NvbnNvbGVFcnJvcl9wcmludGVkW21zZ10pIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjogXCIgKyBtc2cpO1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JfcHJpbnRlZFttc2ddID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuY29uc3QgdGhyb3dDb25zb2xlRXJyb3IgPSAobXNnOiBzdHJpbmcpID0+IHtcbiAgICAvLyBGaXJlZm94IHdvdWxkbid0IHByaW50IHVuY2F1Z2h0IGV4Y2VwdGlvbnMgd2l0aCBmaWxlIG5hbWUvbGluZSBudW1iZXJcbiAgICAvLyBidXQgYWRkaW5nIFwibmV3IEVycm9yKClcIiB0byB0aGUgdGhyb3cgYmVsb3cgZml4ZWQgaXQuLi5cbiAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbn07XG5jb25zdCB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtID0gKG1zZzogc3RyaW5nKSA9PiB7XG4gICAgdGhyb3dDb25zb2xlRXJyb3IoR1FHX0lOX01ZUFJPR1JBTV9NU0cgKyBtc2cpO1xufTtcblxuY29uc3QgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkID0gKHNwcml0ZU5hbWU6IHN0cmluZykgPT4ge1xuICAgIGlmICh0eXBlb2Ygc3ByaXRlTmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU3ByaXRlIG5hbWUgbXVzdCBiZSBhIFN0cmluZywgbm90OiBcIiArIHNwcml0ZU5hbWUpO1xuICAgIH0gZWxzZSBpZiAoIXNwcml0ZUV4aXN0cyhzcHJpdGVOYW1lKSkge1xuICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU3ByaXRlIGRvZXNuJ3QgZXhpc3Q6IFwiICsgc3ByaXRlTmFtZSk7XG4gICAgfVxufTtcbk51bWJlci5pc0Zpbml0ZSA9IE51bWJlci5pc0Zpbml0ZSB8fCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAvLyBzZWU6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL051bWJlci9pc0Zpbml0ZVxuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGlzRmluaXRlKHZhbHVlKTtcbn07XG5jb25zdCB0aHJvd0lmTm90RmluaXRlTnVtYmVyID0gKG1zZzogc3RyaW5nLCB2YWw6IGFueSkgPT4geyAvLyBlLmcuIHRocm93IGlmIE5hTiwgSW5maW5pdHksIG51bGxcbiAgICBpZiAoIU51bWJlci5pc0Zpbml0ZSh2YWwpKSB7XG4gICAgICAgIG1zZyA9IG1zZyB8fCBcIkV4cGVjdGVkIGEgbnVtYmVyLlwiO1xuICAgICAgICBtc2cgKz0gXCIgWW91IHVzZWRcIjtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIG1zZyArPSBcIiB0aGUgU3RyaW5nOiBcXFwiXCIgKyB2YWwgKyBcIlxcXCJcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1zZyArPSBcIjogXCIgKyB2YWw7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShtc2cpO1xuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCB0aHJvd09uSW1nTG9hZEVycm9yID0gKGltZ1VybDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgLy8gd2hhdCB0aGlzIGZ1bmN0aW9uIHRocm93cyBjYW5ub3QgYmUgY2F1Z2h0IGJ5IGNhbGxlciB0aG8uLi5cbiAgICBsZXQgdGhyb3dhYmxlRXJyID0gbmV3IEVycm9yKFwiaW1hZ2UgZmlsZSBub3QgZm91bmQ6IFwiICsgaW1nVXJsKTtcbiAgICAkKFwiPGltZy8+XCIpLm9uKFwiZXJyb3JcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoISF0aHJvd2FibGVFcnIgJiYgdGhyb3dhYmxlRXJyLnN0YWNrICYmXG4gICAgICAgICAgICB0aHJvd2FibGVFcnIuc3RhY2sudG9TdHJpbmcoKS5pbmRleE9mKFwibXlwcm9ncmFtLmpzXCIpID49IDApIHtcbiAgICAgICAgICAgIHRocm93YWJsZUVyci5tZXNzYWdlID0gR1FHX0VSUk9SX0lOX01ZUFJPR1JBTV9NU0cgKyB0aHJvd2FibGVFcnIubWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyB0aHJvd2FibGVFcnI7XG4gICAgfSkuYXR0cihcInNyY1wiLCBpbWdVcmwpO1xufTtcblxuXG5cbnR5cGUgTmV3R1FBbmltYXRpb25GbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIHVybE9yTWFwOiBzdHJpbmcsXG4gICAgICAgIG51bWJlck9mRnJhbWU6IG51bWJlcixcbiAgICAgICAgZGVsdGE6IG51bWJlcixcbiAgICAgICAgcmF0ZTogbnVtYmVyLFxuICAgICAgICB0eXBlOiBudW1iZXJcbiAgICApOiBTcHJpdGVBbmltYXRpb247XG4gICAgKHRoaXM6IHZvaWQsIHVybE9yTWFwOiBzdHJpbmcpOiBTcHJpdGVBbmltYXRpb247XG4gICAgKHRoaXM6IHZvaWQsIHVybE9yTWFwOiBvYmplY3QpOiBTcHJpdGVBbmltYXRpb247XG59O1xuZXhwb3J0IGNvbnN0IG5ld0dRQW5pbWF0aW9uOiBOZXdHUUFuaW1hdGlvbkZuID0gKCgpID0+IHtcbiAgICBsZXQgbWVtb0FuaW1zOiBNYXA8c3RyaW5nIHwgb2JqZWN0LCBTcHJpdGVBbmltYXRpb24+ID0gbmV3IE1hcDxvYmplY3QsIFNwcml0ZUFuaW1hdGlvbj4oKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICB1cmxPck1hcDogc3RyaW5nIHwgb2JqZWN0LFxuICAgICAgICBudW1iZXJPZkZyYW1lPzogbnVtYmVyLFxuICAgICAgICBkZWx0YT86IG51bWJlcixcbiAgICAgICAgcmF0ZT86IG51bWJlcixcbiAgICAgICAgdHlwZT86IG51bWJlclxuICAgICk6IFNwcml0ZUFuaW1hdGlvbiB7XG4gICAgICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA1KSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAodXJsT3JNYXApICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJGaXJzdCBhcmd1bWVudCBmb3IgbmV3R1FBbmltYXRpb24gbXVzdCBiZSBhIFN0cmluZy4gSW5zdGVhZCBmb3VuZDogXCIgKyB1cmxPck1hcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdXJsT3JNYXAgPT09IFwic3RyaW5nXCIpIHRocm93T25JbWdMb2FkRXJyb3IodXJsT3JNYXApO1xuICAgICAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJOdW1iZXIgb2YgZnJhbWUgYXJndW1lbnQgZm9yIG5ld0dRQW5pbWF0aW9uIG11c3QgYmUgbnVtZXJpYy4gXCIsIG51bWJlck9mRnJhbWUpO1xuICAgICAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJEZWx0YSBhcmd1bWVudCBmb3IgbmV3R1FBbmltYXRpb24gbXVzdCBiZSBudW1lcmljLiBcIiwgZGVsdGEpO1xuICAgICAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJSYXRlIGFyZ3VtZW50IGZvciBuZXdHUUFuaW1hdGlvbiBtdXN0IGJlIG51bWVyaWMuIFwiLCByYXRlKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZSAhPSBudWxsICYmICh0eXBlICYgQU5JTUFUSU9OX1ZFUlRJQ0FMKSAmJiAodHlwZSAmIEFOSU1BVElPTl9IT1JJWk9OVEFMKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiVHlwZSBhcmd1bWVudCBmb3IgbmV3R1FBbmltYXRpb24gY2Fubm90IGJlIGJvdGggQU5JTUFUSU9OX1ZFUlRJQ0FMIGFuZCBBTklNQVRJT05fSE9SSVpPTlRBTCAtIHVzZSBvbmUgb3IgdGhlIG90aGVyIGJ1dCBub3QgYm90aCFcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlICE9IG51bGwgJiYgISh0eXBlICYgQU5JTUFUSU9OX1ZFUlRJQ0FMKSAmJiAhKHR5cGUgJiBBTklNQVRJT05fSE9SSVpPTlRBTCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlR5cGUgYXJndW1lbnQgZm9yIG5ld0dRQW5pbWF0aW9uIGlzIG1pc3NpbmcgYm90aCBBTklNQVRJT05fVkVSVElDQUwgYW5kIEFOSU1BVElPTl9IT1JJWk9OVEFMIC0gbXVzdCB1c2Ugb25lIG9yIHRoZSBvdGhlciFcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAodXJsT3JNYXApID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93T25JbWdMb2FkRXJyb3IodXJsT3JNYXApO1xuICAgICAgICAgICAgICAgIH0gLy8gZWxzZSBob3BlIGl0J3MgYSBwcm9wZXIgb3B0aW9ucyBtYXAgdG8gcGFzcyBvbiB0byBHYW1lUXVlcnkgZGlyZWN0bHlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIldyb25nIG51bWJlciBvZiBhcmd1bWVudHMgdXNlZCBmb3IgbmV3R1FBbmltYXRpb24uIENoZWNrIEFQSSBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzIG9mIHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgICAgICAgbGV0IGtleSA9IFt1cmxPck1hcCwgbnVtYmVyT2ZGcmFtZSwgZGVsdGEsIHJhdGUsIHR5cGVdO1xuICAgICAgICAgICAgbGV0IG11bHRpZnJhbWVBbmltOiBTcHJpdGVBbmltYXRpb24gfCB1bmRlZmluZWQgPSBtZW1vQW5pbXMuZ2V0KGtleSk7XG4gICAgICAgICAgICBpZiAobXVsdGlmcmFtZUFuaW0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtdWx0aWZyYW1lQW5pbTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IG11bHRpZnJhbWVBbmltOiBTcHJpdGVBbmltYXRpb24gPSBuZXcgJC5nUS5BbmltYXRpb24oe1xuICAgICAgICAgICAgICAgICAgICBpbWFnZVVSTDogdXJsT3JNYXAsXG4gICAgICAgICAgICAgICAgICAgIG51bWJlck9mRnJhbWU6IG51bWJlck9mRnJhbWUsXG4gICAgICAgICAgICAgICAgICAgIGRlbHRhOiBkZWx0YSxcbiAgICAgICAgICAgICAgICAgICAgcmF0ZTogcmF0ZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogdHlwZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG1lbW9Bbmltcy5zZXQoa2V5LCBtdWx0aWZyYW1lQW5pbSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG11bHRpZnJhbWVBbmltO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGxldCBzaW5nbGVmcmFtZUFuaW06IFNwcml0ZUFuaW1hdGlvbiB8IHVuZGVmaW5lZCA9IG1lbW9Bbmltcy5nZXQodXJsT3JNYXApO1xuICAgICAgICAgICAgaWYgKHNpbmdsZWZyYW1lQW5pbSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpbmdsZWZyYW1lQW5pbTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHNpbmdsZWZyYW1lQW5pbTogU3ByaXRlQW5pbWF0aW9uO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHVybE9yTWFwKSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICBzaW5nbGVmcmFtZUFuaW0gPSBuZXcgJC5nUS5BbmltYXRpb24oeyBpbWFnZVVSTDogdXJsT3JNYXAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2luZ2xlZnJhbWVBbmltID0gbmV3ICQuZ1EuQW5pbWF0aW9uKHVybE9yTWFwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbWVtb0FuaW1zLnNldCh1cmxPck1hcCwgc2luZ2xlZnJhbWVBbmltKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2luZ2xlZnJhbWVBbmltO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIldyb25nIG51bWJlciBvZiBhcmd1bWVudHMgdXNlZCBmb3IgbmV3R1FBbmltYXRpb24uIENoZWNrIEFQSSBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzIG9mIHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyAkLmdRLkFuaW1hdGlvbih7IGltYWdlVVJMOiBcIlwiIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cbnR5cGUgQ3JlYXRlR3JvdXBJblBsYXlncm91bmRGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeDogbnVtYmVyLFxuICAgICAgICB0aGVQb3N5OiBudW1iZXJcbiAgICApOiB2b2lkO1xuICAgICh0aGlzOiB2b2lkLCBncm91cE5hbWU6IHN0cmluZywgdGhlV2lkdGg6IG51bWJlciwgdGhlSGVpZ2h0OiBudW1iZXIpOiB2b2lkO1xuICAgICh0aGlzOiB2b2lkLCBncm91cE5hbWU6IHN0cmluZyk6IHZvaWQ7XG4gICAgKHRoaXM6IHZvaWQsIGdyb3VwTmFtZTogc3RyaW5nLCBvcHRNYXA6IG9iamVjdCk6IHZvaWQ7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kOiBDcmVhdGVHcm91cEluUGxheWdyb3VuZEZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgdGhlV2lkdGg/OiBudW1iZXIgfCBvYmplY3QsXG4gICAgdGhlSGVpZ2h0PzogbnVtYmVyLFxuICAgIHRoZVBvc3g/OiBudW1iZXIsXG4gICAgdGhlUG9zeT86IG51bWJlclxuKTogdm9pZCB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICBpZiAodHlwZW9mIChncm91cE5hbWUpICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiRmlyc3QgYXJndW1lbnQgZm9yIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgZ3JvdXBOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNwcml0ZUdyb3VwTmFtZUZvcm1hdElzVmFsaWQoZ3JvdXBOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIkdyb3VwIG5hbWUgZ2l2ZW4gdG8gY3JlYXRlR3JvdXBJblBsYXlncm91bmQgaXMgaW4gd3JvbmcgZm9ybWF0OiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNwcml0ZUV4aXN0cyhncm91cE5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiY3JlYXRlR3JvdXBJblBsYXlncm91bmQgY2Fubm90IGNyZWF0ZSBkdXBsaWNhdGUgZ3JvdXAgd2l0aCBuYW1lOiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIldpZHRoIGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVXaWR0aCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiSGVpZ2h0IGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVIZWlnaHQpO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDUpIHtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlV2lkdGgpO1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkhlaWdodCBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlSGVpZ2h0KTtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N4KTtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJZIGxvY2F0aW9uIGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N5KTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7IC8vIHRyZWF0cyBhcmd1bWVudHNbMV0gYXMgYSBzdGFuZGFyZCBvcHRpb25zIG1hcFxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMV0gIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU2Vjb25kIGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBleHBlY3RlZCB0byBiZSBhIGRpY3Rpb25hcnkuIEluc3RlYWQgZm91bmQ6IFwiICsgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgICAgIH0gLy8gZWxzZSBob3BlIGl0J3MgYSBwcm9wZXIgc3RhbmRhcmQgb3B0aW9ucyBtYXBcbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50cyB1c2VkIGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZC4gQ2hlY2sgQVBJIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMgb2YgcGFyYW1ldGVycy5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRHcm91cChcbiAgICAgICAgICAgIGdyb3VwTmFtZSxcbiAgICAgICAgICAgIHsgd2lkdGg6ICQucGxheWdyb3VuZCgpLndpZHRoKCksIGhlaWdodDogJC5wbGF5Z3JvdW5kKCkuaGVpZ2h0KCkgfVxuICAgICAgICApO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICBpZiAodHlwZW9mIHRoZVdpZHRoICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwidGhlV2lkdGggbXVzdCBiZSBhIG51bWJlciBidXQgaW5zdGVhZCBnb3Q6IFwiICsgdGhlV2lkdGgpO1xuICAgICAgICB9XG4gICAgICAgICQucGxheWdyb3VuZCgpLmFkZEdyb3VwKGdyb3VwTmFtZSwgeyB3aWR0aDogdGhlV2lkdGgsIGhlaWdodDogdGhlSGVpZ2h0IH0pO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgICBpZiAodHlwZW9mIHRoZVdpZHRoICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwidGhlV2lkdGggbXVzdCBiZSBhIG51bWJlciBidXQgaW5zdGVhZCBnb3Q6IFwiICsgdGhlV2lkdGgpO1xuICAgICAgICB9XG4gICAgICAgICQucGxheWdyb3VuZCgpLmFkZEdyb3VwKFxuICAgICAgICAgICAgZ3JvdXBOYW1lLFxuICAgICAgICAgICAgeyB3aWR0aDogdGhlV2lkdGgsIGhlaWdodDogdGhlSGVpZ2h0LCBwb3N4OiB0aGVQb3N4LCBwb3N5OiB0aGVQb3N5IH1cbiAgICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHsgLy8gdHJlYXRzIGFyZ3VtZW50c1sxXSBhcyBhIHN0YW5kYXJkIG9wdGlvbnMgbWFwXG4gICAgICAgIGlmICh0eXBlb2YgdGhlV2lkdGggIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTZWNvbmQgYXJndW1lbnQgbXVzdCBiZSBhIG51bWJlciBidXQgaW5zdGVhZCBnb3Q6IFwiICsgdGhlV2lkdGgpO1xuICAgICAgICB9XG4gICAgICAgICQucGxheWdyb3VuZCgpLmFkZEdyb3VwKGdyb3VwTmFtZSwgYXJndW1lbnRzWzFdKTtcbiAgICB9XG59O1xuXG5leHBvcnQgdHlwZSBTcHJpdGVBbmltYXRpb24gPSB7IGltYWdlVVJMOiBzdHJpbmcgfTtcbnR5cGUgQ3JlYXRlU3ByaXRlSW5Hcm91cEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlQW5pbWF0aW9uOiBTcHJpdGVBbmltYXRpb24sXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyLFxuICAgICAgICB0aGVQb3N4OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3k6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVBbmltYXRpb246IFNwcml0ZUFuaW1hdGlvbixcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXJcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgb3B0aW9uc01hcDogb2JqZWN0XG4gICAgKTogdm9pZDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlU3ByaXRlSW5Hcm91cDogQ3JlYXRlU3ByaXRlSW5Hcm91cEZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHRoZUFuaW1hdGlvbjogU3ByaXRlQW5pbWF0aW9uIHwgb2JqZWN0LFxuICAgIHRoZVdpZHRoPzogbnVtYmVyLFxuICAgIHRoZUhlaWdodD86IG51bWJlcixcbiAgICB0aGVQb3N4PzogbnVtYmVyLFxuICAgIHRoZVBvc3k/OiBudW1iZXJcbik6IHZvaWQge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiAoZ3JvdXBOYW1lKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIkZpcnN0IGFyZ3VtZW50IGZvciBjcmVhdGVTcHJpdGVJbkdyb3VwIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgZ3JvdXBOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNwcml0ZUV4aXN0cyhncm91cE5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiY3JlYXRlU3ByaXRlSW5Hcm91cCBjYW5ub3QgZmluZCBncm91cCAoZG9lc24ndCBleGlzdD8pOiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIChzcHJpdGVOYW1lKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlNlY29uZCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIGEgU3RyaW5nLiBJbnN0ZWFkIGZvdW5kOiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc3ByaXRlR3JvdXBOYW1lRm9ybWF0SXNWYWxpZChzcHJpdGVOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlNwcml0ZSBuYW1lIGdpdmVuIHRvIGNyZWF0ZVNwcml0ZUluR3JvdXAgaXMgaW4gd3JvbmcgZm9ybWF0OiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzcHJpdGVFeGlzdHMoc3ByaXRlTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJjcmVhdGVTcHJpdGVJbkdyb3VwIGNhbm5vdCBjcmVhdGUgZHVwbGljYXRlIHNwcml0ZSB3aXRoIG5hbWU6IFwiICsgc3ByaXRlTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNSB8fCBhcmd1bWVudHMubGVuZ3RoID09PSA3KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mICh0aGVBbmltYXRpb24pICE9PSBcIm9iamVjdFwiIHx8IChcImltYWdlVXJsXCIgaW4gdGhlQW5pbWF0aW9uICYmIHR5cGVvZiAodGhlQW5pbWF0aW9uW1wiaW1hZ2VVUkxcIl0pICE9PSBcInN0cmluZ1wiKSkge1xuICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJjcmVhdGVTcHJpdGVJbkdyb3VwIGNhbm5vdCB1c2UgdGhpcyBhcyBhbiBhbmltYXRpb246IFwiICsgdGhlQW5pbWF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVXaWR0aCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiSGVpZ2h0IGFyZ3VtZW50IGZvciBjcmVhdGVTcHJpdGVJbkdyb3VwIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZUhlaWdodCk7XG5cblxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDcpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWCBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N4KTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1syXSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJUaGlyZCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBleHBlY3RlZCB0byBiZSBhIGRpY3Rpb25hcnkuIEluc3RlYWQgZm91bmQ6IFwiICsgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJpbWFnZVVybFwiIGluIHRoZUFuaW1hdGlvbiAmJiB0eXBlb2YgKHRoZUFuaW1hdGlvbltcImltYWdlVVJMXCJdKSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJUaGlyZCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBleHBlY3RlZCB0byBiZSBhIGRpY3Rpb25hcnkuIEluc3RlYWQgZm91bmQgdGhpcyBhbmltYXRpb246IFwiICsgdGhlQW5pbWF0aW9uICsgXCIuIE1heWJlIHdyb25nIG51bWJlciBvZiBhcmd1bWVudHMgcHJvdmlkZWQ/IENoZWNrIEFQSSBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzIG9mIHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICAgICAgfSAvLyBlbHNlIGhvcGUgaXQncyBhIHByb3BlciBzdGFuZGFyZCBvcHRpb25zIG1hcFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIldyb25nIG51bWJlciBvZiBhcmd1bWVudHMgdXNlZCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cC4gQ2hlY2sgQVBJIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMgb2YgcGFyYW1ldGVycy5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgICAkKFwiI1wiICsgZ3JvdXBOYW1lKS5hZGRTcHJpdGUoXG4gICAgICAgICAgICBzcHJpdGVOYW1lLFxuICAgICAgICAgICAgeyBhbmltYXRpb246IHRoZUFuaW1hdGlvbiwgd2lkdGg6IHRoZVdpZHRoLCBoZWlnaHQ6IHRoZUhlaWdodCB9XG4gICAgICAgICk7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA3KSB7XG4gICAgICAgICQoXCIjXCIgKyBncm91cE5hbWUpLmFkZFNwcml0ZShcbiAgICAgICAgICAgIHNwcml0ZU5hbWUsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiB0aGVBbmltYXRpb24sXG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoZVdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhlSGVpZ2h0LFxuICAgICAgICAgICAgICAgIHBvc3g6IHRoZVBvc3gsXG4gICAgICAgICAgICAgICAgcG9zeTogdGhlUG9zeVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykgeyAvLyB0cmVhdHMgYXJndW1lbnRzWzJdIGFzIGEgc3RhbmRhcmQgb3B0aW9ucyBtYXBcbiAgICAgICAgJChcIiNcIiArIGdyb3VwTmFtZSkuYWRkU3ByaXRlKHNwcml0ZU5hbWUsIGFyZ3VtZW50c1syXSk7XG4gICAgfVxufTtcblxudHlwZSBDcmVhdGVUZXh0U3ByaXRlSW5Hcm91cEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3g6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeTogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyXG4gICAgKTogdm9pZDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXA6IENyZWF0ZVRleHRTcHJpdGVJbkdyb3VwRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICB0aGVQb3N4PzogbnVtYmVyLFxuICAgIHRoZVBvc3k/OiBudW1iZXJcbik6IHZvaWQge1xuICAgIC8vIHRvIGJlIHVzZWQgbGlrZSBzcHJpdGUoXCJ0ZXh0Qm94XCIpLnRleHQoXCJoaVwiKTsgLy8gb3IgLmh0bWwoXCI8Yj5oaTwvYj5cIik7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICBpZiAodHlwZW9mIChncm91cE5hbWUpICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiRmlyc3QgYXJndW1lbnQgZm9yIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgZ3JvdXBOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNwcml0ZUV4aXN0cyhncm91cE5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgY2Fubm90IGZpbmQgZ3JvdXAgKGRvZXNuJ3QgZXhpc3Q/KTogXCIgKyBncm91cE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiAoc3ByaXRlTmFtZSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTZWNvbmQgYXJndW1lbnQgZm9yIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgc3ByaXRlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzcHJpdGVHcm91cE5hbWVGb3JtYXRJc1ZhbGlkKHNwcml0ZU5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU3ByaXRlIG5hbWUgZ2l2ZW4gdG8gY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgaXMgaW4gd3JvbmcgZm9ybWF0OiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzcHJpdGVFeGlzdHMoc3ByaXRlTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBjYW5ub3QgY3JlYXRlIGR1cGxpY2F0ZSBzcHJpdGUgd2l0aCBuYW1lOiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDQgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gNikge1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIldpZHRoIGFyZ3VtZW50IGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVXaWR0aCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiSGVpZ2h0IGFyZ3VtZW50IGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVIZWlnaHQpO1xuXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNikge1xuICAgICAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIGFyZ3VtZW50IGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVQb3N4KTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlUG9zeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50cyB1c2VkIGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cC4gQ2hlY2sgQVBJIGRvY3VtZW50YXRpb24gZm9yIGRldGFpbHMgb2YgcGFyYW1ldGVycy5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNCkge1xuICAgICAgICAkKFwiI1wiICsgZ3JvdXBOYW1lKS5hZGRTcHJpdGUoc3ByaXRlTmFtZSwge1xuICAgICAgICAgICAgd2lkdGg6IHRoZVdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGVIZWlnaHRcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA2KSB7XG4gICAgICAgICQoXCIjXCIgKyBncm91cE5hbWUpLmFkZFNwcml0ZShzcHJpdGVOYW1lLCB7XG4gICAgICAgICAgICB3aWR0aDogdGhlV2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoZUhlaWdodCxcbiAgICAgICAgICAgIHBvc3g6IHRoZVBvc3gsXG4gICAgICAgICAgICBwb3N5OiB0aGVQb3N5XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNCB8fCBhcmd1bWVudHMubGVuZ3RoID09PSA2KSB7XG4gICAgICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIFwid2hpdGVcIikgLy8gZGVmYXVsdCB0byB3aGl0ZSBiYWNrZ3JvdW5kIGZvciBlYXNlIG9mIHVzZVxuICAgICAgICAgICAgLmNzcyhcInVzZXItc2VsZWN0XCIsIFwibm9uZVwiKTtcbiAgICB9XG59O1xuXG5jb25zdCB0ZXh0SW5wdXRTcHJpdGVUZXh0QXJlYUlkID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIHNwcml0ZU5hbWUgKyBcIi10ZXh0YXJlYVwiO1xufTtcbmNvbnN0IHRleHRJbnB1dFNwcml0ZVN1Ym1pdEJ1dHRvbklkID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIHNwcml0ZU5hbWUgKyBcIi1idXR0b25cIjtcbn07XG5jb25zdCB0ZXh0SW5wdXRTcHJpdGVHUUdfU0lHTkFMU19JZCA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIHJldHVybiBzcHJpdGVOYW1lICsgXCItc3VibWl0dGVkXCI7XG59O1xudHlwZSBDcmVhdGVUZXh0SW5wdXRTcHJpdGVJbkdyb3VwRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICAgICAgcm93czogbnVtYmVyLFxuICAgICAgICBjb2xzOiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3g6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeTogbnVtYmVyLFxuICAgICAgICBzdWJtaXRIYW5kbGVyOiBTdWJtaXRIYW5kbGVyRm5cbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHJvd3M6IG51bWJlcixcbiAgICAgICAgY29sczogbnVtYmVyLFxuICAgICAgICB0aGVQb3N4OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3k6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICAgICAgcm93czogbnVtYmVyLFxuICAgICAgICBjb2xzOiBudW1iZXJcbiAgICApOiB2b2lkO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVUZXh0SW5wdXRTcHJpdGVJbkdyb3VwOiBDcmVhdGVUZXh0SW5wdXRTcHJpdGVJbkdyb3VwRm4gPVxuICAgIGZ1bmN0aW9uIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHJvd3M6IG51bWJlcixcbiAgICAgICAgY29sczogbnVtYmVyLFxuICAgICAgICB0aGVQb3N4PzogbnVtYmVyLFxuICAgICAgICB0aGVQb3N5PzogbnVtYmVyLFxuICAgICAgICBzdWJtaXRIYW5kbGVyPzogU3VibWl0SGFuZGxlckZuXG4gICAgKTogdm9pZCB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA2KSB7XG4gICAgICAgICAgICBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cChncm91cE5hbWUsIHNwcml0ZU5hbWUsIHRoZVdpZHRoLCB0aGVIZWlnaHQpO1xuICAgICAgICB9IGVsc2UgaWYgKChhcmd1bWVudHMubGVuZ3RoID09PSA4IHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDkpICYmIHRoZVBvc3ggJiZcbiAgICAgICAgICAgIHRoZVBvc3kpIHtcbiAgICAgICAgICAgIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwKFxuICAgICAgICAgICAgICAgIGdyb3VwTmFtZSxcbiAgICAgICAgICAgICAgICBzcHJpdGVOYW1lLFxuICAgICAgICAgICAgICAgIHRoZVdpZHRoLFxuICAgICAgICAgICAgICAgIHRoZUhlaWdodCxcbiAgICAgICAgICAgICAgICB0aGVQb3N4LFxuICAgICAgICAgICAgICAgIHRoZVBvc3lcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDYgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gOCB8fFxuICAgICAgICAgICAgYXJndW1lbnRzLmxlbmd0aCA9PT0gOSkge1xuICAgICAgICAgICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLmNzcyhcImJhY2tncm91bmQtY29sb3JcIiwgXCJ3aGl0ZVwiKTsgLy8gZGVmYXVsdCB0byB3aGl0ZSBiYWNrZ3JvdW5kIGZvciBlYXNlIG9mIHVzZVxuXG4gICAgICAgICAgICB2YXIgdGV4dGFyZWFIdG1sID0gJzx0ZXh0YXJlYSBpZD1cIicgK1xuICAgICAgICAgICAgICAgIHRleHRJbnB1dFNwcml0ZVRleHRBcmVhSWQoc3ByaXRlTmFtZSkgKyAnXCIgcm93cz1cIicgKyByb3dzICtcbiAgICAgICAgICAgICAgICAnXCIgY29scz1cIicgKyBjb2xzICsgJ1wiPmhpPC90ZXh0YXJlYT4nO1xuICAgICAgICAgICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLmFwcGVuZCh0ZXh0YXJlYUh0bWwpO1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9uSWQgPSB0ZXh0SW5wdXRTcHJpdGVTdWJtaXRCdXR0b25JZChzcHJpdGVOYW1lKTtcbiAgICAgICAgICAgIHZhciBidXR0b25IdG1sID0gJzxidXR0b24gaWQ9XCInICsgYnV0dG9uSWQgK1xuICAgICAgICAgICAgICAgICdcIiB0eXBlPVwiYnV0dG9uXCI+U3VibWl0PC9idXR0b24+JztcbiAgICAgICAgICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5hcHBlbmQoYnV0dG9uSHRtbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gOSkge1xuICAgICAgICAgICAgdGV4dElucHV0U3ByaXRlU2V0SGFuZGxlcihzcHJpdGVOYW1lLCBzdWJtaXRIYW5kbGVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRleHRJbnB1dFNwcml0ZVNldEhhbmRsZXIoc3ByaXRlTmFtZSk7XG4gICAgICAgIH1cbiAgICB9O1xuZXhwb3J0IHR5cGUgU3VibWl0SGFuZGxlckZuID0gKHM6IHN0cmluZykgPT4gdm9pZDtcbmV4cG9ydCBjb25zdCB0ZXh0SW5wdXRTcHJpdGVTZXRIYW5kbGVyID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHN1Ym1pdEhhbmRsZXI/OiBTdWJtaXRIYW5kbGVyRm5cbik6IHZvaWQge1xuICAgIHZhciByZWFsU3VibWl0SGFuZGxlcjtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICByZWFsU3VibWl0SGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChzdWJtaXRIYW5kbGVyKSBzdWJtaXRIYW5kbGVyKHRleHRJbnB1dFNwcml0ZVN0cmluZyhzcHJpdGVOYW1lKSk7XG4gICAgICAgICAgICBHUUdfU0lHTkFMU1t0ZXh0SW5wdXRTcHJpdGVHUUdfU0lHTkFMU19JZChzcHJpdGVOYW1lKV0gPSB0cnVlO1xuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlYWxTdWJtaXRIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgR1FHX1NJR05BTFNbdGV4dElucHV0U3ByaXRlR1FHX1NJR05BTFNfSWQoc3ByaXRlTmFtZSldID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgJChcIiNcIiArIHRleHRJbnB1dFNwcml0ZVN1Ym1pdEJ1dHRvbklkKHNwcml0ZU5hbWUpKS5jbGljayhyZWFsU3VibWl0SGFuZGxlcik7XG59O1xuXG5leHBvcnQgY29uc3QgdGV4dElucHV0U3ByaXRlU3RyaW5nID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIFN0cmluZygkKFwiI1wiICsgdGV4dElucHV0U3ByaXRlVGV4dEFyZWFJZChzcHJpdGVOYW1lKSlbMF0udmFsdWUpO1xufTtcbmV4cG9ydCBjb25zdCB0ZXh0SW5wdXRTcHJpdGVTZXRTdHJpbmcgPSAoXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHN0cjogc3RyaW5nXG4pOiB2b2lkID0+IHtcbiAgICAkKFwiI1wiICsgdGV4dElucHV0U3ByaXRlVGV4dEFyZWFJZChzcHJpdGVOYW1lKSlbMF0udmFsdWUgPSBzdHI7XG59O1xuXG5leHBvcnQgY29uc3QgdGV4dElucHV0U3ByaXRlUmVzZXQgPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgdGV4dFByb21wdD86IHN0cmluZ1xuKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGV4dElucHV0U3ByaXRlU2V0U3RyaW5nKHNwcml0ZU5hbWUsIFwiXCIpO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiAmJiB0ZXh0UHJvbXB0KSB7XG4gICAgICAgIHRleHRJbnB1dFNwcml0ZVNldFN0cmluZyhzcHJpdGVOYW1lLCB0ZXh0UHJvbXB0KTtcbiAgICB9XG4gICAgR1FHX1NJR05BTFNbdGV4dElucHV0U3ByaXRlR1FHX1NJR05BTFNfSWQoc3ByaXRlTmFtZSldID0gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3QgdGV4dElucHV0U3ByaXRlU3VibWl0dGVkID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGlmIChHUUdfU0lHTkFMU1t0ZXh0SW5wdXRTcHJpdGVHUUdfU0lHTkFMU19JZChzcHJpdGVOYW1lKV0gPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn07XG5cbmV4cG9ydCBjb25zdCByZW1vdmVTcHJpdGUgPSAoc3ByaXRlTmFtZU9yT2JqOiBzdHJpbmcgfCBvYmplY3QpOiB2b2lkID0+IHtcbiAgICBpZiAodHlwZW9mIChzcHJpdGVOYW1lT3JPYmopICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lT3JPYmopO1xuICAgICAgICB9O1xuICAgICAgICAkKFwiI1wiICsgc3ByaXRlTmFtZU9yT2JqKS5yZW1vdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKHNwcml0ZU5hbWVPck9iaikucmVtb3ZlKCk7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZSA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBzcHJpdGVEb21PYmplY3QgPT4ge1xuICAgIHJldHVybiAkKFwiI1wiICsgc3ByaXRlTmFtZSk7XG59O1xuXG5leHBvcnQgY29uc3Qgc3ByaXRlRXhpc3RzID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiAoc3ByaXRlTmFtZSA9PSAkKFwiI1wiICsgc3ByaXRlTmFtZSkuYXR0cihcImlkXCIpKTsgLy8gc3ByaXRlTmFtZSBjb3VsZCBiZSBnaXZlbiBhcyBhbiBpbnQgYnkgYSBzdHVkZW50XG59O1xuXG5leHBvcnQgY29uc3Qgc3ByaXRlT2JqZWN0ID0gKFxuICAgIHNwcml0ZU5hbWVPck9iajogc3RyaW5nIHwgb2JqZWN0XG4pOiBzcHJpdGVEb21PYmplY3QgPT4ge1xuICAgIGlmICh0eXBlb2YgKHNwcml0ZU5hbWVPck9iaikgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lT3JPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAkKHNwcml0ZU5hbWVPck9iaik7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZUlkID0gKHNwcml0ZU5hbWVPck9iajogc3RyaW5nIHwgb2JqZWN0KTogc3RyaW5nID0+IHtcbiAgICBpZiAodHlwZW9mIChzcHJpdGVOYW1lT3JPYmopICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcoJChcIiNcIiArIHNwcml0ZU5hbWVPck9iaikuYXR0cihcImlkXCIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gU3RyaW5nKCQoc3ByaXRlTmFtZU9yT2JqKS5hdHRyKFwiaWRcIikpO1xuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVHZXRYID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgfTtcbiAgICByZXR1cm4gJChcIiNcIiArIHNwcml0ZU5hbWUpLngoKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlR2V0WSA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBudW1iZXIgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgIH07XG4gICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lKS55KCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZUdldFogPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogbnVtYmVyID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICB9O1xuICAgIHJldHVybiAkKFwiI1wiICsgc3ByaXRlTmFtZSkueigpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRYID0gKHNwcml0ZU5hbWU6IHN0cmluZywgeHZhbDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHh2YWwpO1xuICAgIH07XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLngoeHZhbCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVNldFkgPSAoc3ByaXRlTmFtZTogc3RyaW5nLCB5dmFsOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlkgbG9jYXRpb24gbXVzdCBiZSBhIG51bWJlci5cIiwgeXZhbCk7XG4gICAgfTtcbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkueSh5dmFsKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0WiA9IChzcHJpdGVOYW1lOiBzdHJpbmcsIHp2YWw6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWiBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB6dmFsKTtcbiAgICB9O1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS56KHp2YWwpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRYWSA9IChcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgeHZhbDogbnVtYmVyLFxuICAgIHl2YWw6IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHh2YWwpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB5dmFsKTtcbiAgICB9O1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS54eSh4dmFsLCB5dmFsKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0WFlaID0gKFxuICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICB4dmFsOiBudW1iZXIsXG4gICAgeXZhbDogbnVtYmVyLFxuICAgIHp2YWw6IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJYIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHh2YWwpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB5dmFsKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlogbG9jYXRpb24gbXVzdCBiZSBhIG51bWJlci5cIiwgenZhbCk7XG4gICAgfTtcbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkueHl6KHh2YWwsIHl2YWwsIHp2YWwpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZUdldFdpZHRoID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgfTtcbiAgICByZXR1cm4gJChcIiNcIiArIHNwcml0ZU5hbWUpLncoKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlR2V0SGVpZ2h0ID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgfTtcbiAgICByZXR1cm4gJChcIiNcIiArIHNwcml0ZU5hbWUpLmgoKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0V2lkdGggPSAoc3ByaXRlTmFtZTogc3RyaW5nLCB3dmFsOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIldpZHRoIG11c3QgYmUgYSBudW1iZXIuXCIsIHd2YWwpO1xuICAgIH1cbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkudyh3dmFsKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0SGVpZ2h0ID0gKHNwcml0ZU5hbWU6IHN0cmluZywgaHZhbDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJIZWlnaHQgbXVzdCBiZSBhIG51bWJlci5cIiwgaHZhbCk7XG4gICAgfVxuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5oKGh2YWwpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRXaWR0aEhlaWdodCA9IChcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgd3ZhbDogbnVtYmVyLFxuICAgIGh2YWw6IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBtdXN0IGJlIGEgbnVtYmVyLlwiLCB3dmFsKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkhlaWdodCBtdXN0IGJlIGEgbnVtYmVyLlwiLCBodmFsKTtcbiAgICB9XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLndoKHd2YWwsIGh2YWwpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZVJvdGF0ZSA9IChcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgYW5nbGVEZWdyZWVzOiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiQW5nbGUgbXVzdCBiZSBhIG51bWJlci5cIiwgYW5nbGVEZWdyZWVzKTtcbiAgICB9XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLnJvdGF0ZShhbmdsZURlZ3JlZXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZVNjYWxlID0gKHNwcml0ZU5hbWU6IHN0cmluZywgcmF0aW86IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiUmF0aW8gbXVzdCBiZSBhIG51bWJlci5cIiwgcmF0aW8pO1xuICAgIH1cbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkuc2NhbGUocmF0aW8pO1xufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZVNldEFuaW1hdGlvbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIHNwcml0ZU5hbWVPck9iajogc3RyaW5nIHwgb2JqZWN0LFxuICAgIGFHUUFuaW1hdGlvbj86IG9iamVjdCxcbiAgICBjYWxsYmFja0Z1bmN0aW9uPzogRnVuY3Rpb25cbikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyICYmIGFHUUFuaW1hdGlvbiAhPSBudWxsKSB7XG4gICAgICAgIHNwcml0ZU9iamVjdChzcHJpdGVOYW1lT3JPYmopLnNldEFuaW1hdGlvbihhR1FBbmltYXRpb24pO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyAgJiYgYUdRQW5pbWF0aW9uICE9IG51bGwgJiYgdHlwZW9mIGNhbGxiYWNrRnVuY3Rpb24gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBzcHJpdGVPYmplY3Qoc3ByaXRlTmFtZU9yT2JqKS5zZXRBbmltYXRpb24oYUdRQW5pbWF0aW9uLCBjYWxsYmFja0Z1bmN0aW9uKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgc3ByaXRlT2JqZWN0KHNwcml0ZU5hbWVPck9iaikuc2V0QW5pbWF0aW9uKCk7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVQYXVzZUFuaW1hdGlvbiA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkucGF1c2VBbmltYXRpb24oKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlUmVzdW1lQW5pbWF0aW9uID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5yZXN1bWVBbmltYXRpb24oKTtcbn07XG5cbmV4cG9ydCB0eXBlIENvbGxpc2lvbkhhbmRsaW5nRm4gPSAoY29sbEluZGV4OiBudW1iZXIsIGhpdFNwcml0ZTogb2JqZWN0KSA9PlxuICAgIHZvaWQ7XG5leHBvcnQgY29uc3QgZm9yRWFjaFNwcml0ZVNwcml0ZUNvbGxpc2lvbkRvID0gKFxuICAgIHNwcml0ZTFOYW1lOiBzdHJpbmcsXG4gICAgc3ByaXRlMk5hbWU6IHN0cmluZyxcbiAgICBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uOiBDb2xsaXNpb25IYW5kbGluZ0ZuXG4pOiB2b2lkID0+IHtcbiAgICAkKFwiI1wiICsgc3ByaXRlMU5hbWUpLmNvbGxpc2lvbihcIi5nUV9ncm91cCwgI1wiICsgc3ByaXRlMk5hbWUpLmVhY2goXG4gICAgICAgIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb25cbiAgICApO1xuICAgIC8vIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb24gY2FuIG9wdGlvbmFsbHkgdGFrZSB0d28gYXJndW1lbnRzOiBjb2xsSW5kZXgsIGhpdFNwcml0ZVxuICAgIC8vIHNlZSBodHRwOi8vYXBpLmpxdWVyeS5jb20valF1ZXJ5LmVhY2hcbn07XG5leHBvcnQgY29uc3QgZm9yRWFjaDJTcHJpdGVzSGl0ID0gKCgpID0+IHtcbiAgICB2YXIgcHJpbnRlZCA9IGZhbHNlO1xuICAgIHJldHVybiAoc3ByaXRlMU5hbWU6IHN0cmluZywgc3ByaXRlMk5hbWU6IHN0cmluZywgY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbjogQ29sbGlzaW9uSGFuZGxpbmdGbikgPT4ge1xuICAgICAgICBpZiAoIXByaW50ZWQpIHtcbiAgICAgICAgICAgIHByaW50ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3IoXCJEZXByZWNhdGVkIGZ1bmN0aW9uIHVzZWQ6IGZvckVhY2gyU3ByaXRlc0hpdC4gIFVzZSB3aGVuMlNwcml0ZXNIaXQgaW5zdGVhZCBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBmb3JFYWNoU3ByaXRlU3ByaXRlQ29sbGlzaW9uRG8oc3ByaXRlMU5hbWUsIHNwcml0ZTJOYW1lLCBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uKTtcbiAgICB9O1xufSkoKTtcbmV4cG9ydCBjb25zdCB3aGVuMlNwcml0ZXNIaXQgPSBmb3JFYWNoU3ByaXRlU3ByaXRlQ29sbGlzaW9uRG87IC8vIE5FV1xuXG5leHBvcnQgY29uc3QgZm9yRWFjaFNwcml0ZUdyb3VwQ29sbGlzaW9uRG8gPSAoXG4gICAgc3ByaXRlMU5hbWU6IHN0cmluZyxcbiAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uOiBDb2xsaXNpb25IYW5kbGluZ0ZuXG4pOiB2b2lkID0+IHtcbiAgICAkKFwiI1wiICsgc3ByaXRlMU5hbWUpLmNvbGxpc2lvbihcIiNcIiArIGdyb3VwTmFtZSArIFwiLCAuZ1Ffc3ByaXRlXCIpLmVhY2goXG4gICAgICAgIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb25cbiAgICApO1xuICAgIC8vIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb24gY2FuIG9wdGlvbmFsbHkgdGFrZSB0d28gYXJndW1lbnRzOiBjb2xsSW5kZXgsIGhpdFNwcml0ZVxuICAgIC8vIHNlZSBodHRwOi8vYXBpLmpxdWVyeS5jb20valF1ZXJ5LmVhY2hcbn07XG5leHBvcnQgY29uc3QgZm9yRWFjaFNwcml0ZUdyb3VwSGl0ID0gZm9yRWFjaFNwcml0ZUdyb3VwQ29sbGlzaW9uRG87XG5cbmV4cG9ydCBjb25zdCBmb3JFYWNoU3ByaXRlRmlsdGVyZWRDb2xsaXNpb25EbyA9IChcbiAgICBzcHJpdGUxTmFtZTogc3RyaW5nLFxuICAgIGZpbHRlclN0cjogc3RyaW5nLFxuICAgIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb246IENvbGxpc2lvbkhhbmRsaW5nRm5cbik6IHZvaWQgPT4ge1xuICAgICQoXCIjXCIgKyBzcHJpdGUxTmFtZSkuY29sbGlzaW9uKGZpbHRlclN0cikuZWFjaChjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uKTtcbiAgICAvLyBzZWUgaHR0cDovL2dhbWVxdWVyeWpzLmNvbS9kb2N1bWVudGF0aW9uL2FwaS8jY29sbGlzaW9uIGZvciBmaWx0ZXJTdHIgc3BlY1xuICAgIC8vIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb24gY2FuIG9wdGlvbmFsbHkgdGFrZSB0d28gYXJndW1lbnRzOiBjb2xsSW5kZXgsIGhpdFNwcml0ZVxuICAgIC8vIHNlZSBodHRwOi8vYXBpLmpxdWVyeS5jb20valF1ZXJ5LmVhY2hcbn07XG5leHBvcnQgY29uc3QgZm9yRWFjaFNwcml0ZUZpbHRlcmVkSGl0ID0gZm9yRWFjaFNwcml0ZUZpbHRlcmVkQ29sbGlzaW9uRG87XG5cbmV4cG9ydCB0eXBlIFNwcml0ZUhpdERpcmVjdGlvbmFsaXR5ID0ge1xuICAgIFwibGVmdFwiOiBib29sZWFuO1xuICAgIFwicmlnaHRcIjogYm9vbGVhbjtcbiAgICBcInVwXCI6IGJvb2xlYW47XG4gICAgXCJkb3duXCI6IGJvb2xlYW47XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZUhpdERpcmVjdGlvbiA9IChcbiAgICBzcHJpdGUxSWQ6IHN0cmluZyxcbiAgICBzcHJpdGUxWDogbnVtYmVyLFxuICAgIHNwcml0ZTFZOiBudW1iZXIsXG4gICAgc3ByaXRlMVhTcGVlZDogbnVtYmVyLFxuICAgIHNwcml0ZTFZU3BlZWQ6IG51bWJlcixcbiAgICBzcHJpdGUxV2lkdGg6IG51bWJlcixcbiAgICBzcHJpdGUxSGVpZ2h0OiBudW1iZXIsXG4gICAgc3ByaXRlMklkOiBzdHJpbmcsXG4gICAgc3ByaXRlMlg6IG51bWJlcixcbiAgICBzcHJpdGUyWTogbnVtYmVyLFxuICAgIHNwcml0ZTJYU3BlZWQ6IG51bWJlcixcbiAgICBzcHJpdGUyWVNwZWVkOiBudW1iZXIsXG4gICAgc3ByaXRlMldpZHRoOiBudW1iZXIsXG4gICAgc3ByaXRlMkhlaWdodDogbnVtYmVyXG4pOiBTcHJpdGVIaXREaXJlY3Rpb25hbGl0eSA9PiB7XG4gICAgdmFyIHNwcml0ZTFJbmZvOiBTcHJpdGVEaWN0ID0ge1xuICAgICAgICBcImlkXCI6IHNwcml0ZTFJZCxcbiAgICAgICAgXCJ4cG9zXCI6IHNwcml0ZTFYLFxuICAgICAgICBcInlwb3NcIjogc3ByaXRlMVksXG4gICAgICAgIFwieHNwZWVkXCI6IHNwcml0ZTFYU3BlZWQsXG4gICAgICAgIFwieXNwZWVkXCI6IHNwcml0ZTFZU3BlZWQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IHNwcml0ZTFIZWlnaHQsXG4gICAgICAgIFwid2lkdGhcIjogc3ByaXRlMVdpZHRoXG4gICAgfTtcbiAgICB2YXIgc3ByaXRlMkluZm86IFNwcml0ZURpY3QgPSB7XG4gICAgICAgIFwiaWRcIjogc3ByaXRlMklkLFxuICAgICAgICBcInhwb3NcIjogc3ByaXRlMlgsXG4gICAgICAgIFwieXBvc1wiOiBzcHJpdGUyWSxcbiAgICAgICAgXCJ4c3BlZWRcIjogc3ByaXRlMlhTcGVlZCxcbiAgICAgICAgXCJ5c3BlZWRcIjogc3ByaXRlMllTcGVlZCxcbiAgICAgICAgXCJoZWlnaHRcIjogc3ByaXRlMkhlaWdodCxcbiAgICAgICAgXCJ3aWR0aFwiOiBzcHJpdGUyV2lkdGhcbiAgICB9O1xuICAgIHJldHVybiBzcHJpdGVIaXREaXIoc3ByaXRlMUluZm8sIHNwcml0ZTJJbmZvKTtcbn07XG5cbmV4cG9ydCB0eXBlIFNwcml0ZVBoeXNpY2FsRGltZW5zaW9ucyA9IHtcbiAgICBcInhwb3NcIjogbnVtYmVyO1xuICAgIFwieXBvc1wiOiBudW1iZXI7XG4gICAgXCJ4c3BlZWRcIjogbnVtYmVyOyAvLyBtb3ZlbWVudCBtdXN0IGJlIGJ5IGRpY3Rpb25hcnksXG4gICAgXCJ5c3BlZWRcIjogbnVtYmVyOyAvLyB3aXRoIHNvbWV0aGluZyBsaWtlIHggPSB4ICsgeHNwZWVkXG4gICAgXCJ3aWR0aFwiOiBudW1iZXI7XG4gICAgXCJoZWlnaHRcIjogbnVtYmVyO1xufTtcbmV4cG9ydCB0eXBlIFNwcml0ZURpY3QgPSBTcHJpdGVQaHlzaWNhbERpbWVuc2lvbnMgJiB7XG4gICAgXCJpZFwiOiBzdHJpbmc7XG4gICAgW3M6IHN0cmluZ106IGFueTtcbn07XG5jb25zdCBzcHJpdGVzU3BlZWRTYW1wbGVzOiB7IFtrOiBzdHJpbmddOiB7IHNhbXBsZVNpemU6IG51bWJlciwgeHNwZWVkU2FtcGxlczogbnVtYmVyW10sIHlzcGVlZFNhbXBsZXM6IG51bWJlcltdLCBjaGVja2VkOiBib29sZWFuIH0gfSA9IHt9O1xuY29uc3QgY2hlY2tTcHJpdGVTcGVlZFVzYWdlQ29tbW9uRXJyb3JzID0gKHNwcml0ZUluZm86IFNwcml0ZURpY3QpID0+IHtcbiAgICAvLyBBIGhldXJpc3RpYyBjaGVjayBmb3IgY29tbW9uIGVycm9ycyBmcm9tIGxlYXJuZXJzLlxuICAgIC8vIENoZWNrIGlmIHNwcml0ZSBzcGVlZHMgZXZlciBjaGFuZ2UuICBJZiBub3QsIHByb2JhYmx5IGRvaW5nIGl0IHdyb25nLlxuICAgIGlmICghc3ByaXRlc1NwZWVkU2FtcGxlc1tzcHJpdGVJbmZvW1wiaWRcIl1dKSB7XG4gICAgICAgIHNwcml0ZXNTcGVlZFNhbXBsZXNbc3ByaXRlSW5mb1tcImlkXCJdXSA9IHtcbiAgICAgICAgICAgIHNhbXBsZVNpemU6IDAsXG4gICAgICAgICAgICB4c3BlZWRTYW1wbGVzOiBbXSxcbiAgICAgICAgICAgIHlzcGVlZFNhbXBsZXM6IFtdLFxuICAgICAgICAgICAgY2hlY2tlZDogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzcHJpdGUxU2FtcGxpbmcgPSBzcHJpdGVzU3BlZWRTYW1wbGVzW3Nwcml0ZUluZm9bXCJpZFwiXV07XG4gICAgICAgIGNvbnN0IG1heFNhbXBsZVNpemUgPSAxMDtcbiAgICAgICAgaWYgKHNwcml0ZTFTYW1wbGluZy5zYW1wbGVTaXplIDwgbWF4U2FtcGxlU2l6ZSkge1xuICAgICAgICAgICAgKytzcHJpdGUxU2FtcGxpbmcuc2FtcGxlU2l6ZTtcbiAgICAgICAgICAgIHNwcml0ZTFTYW1wbGluZy54c3BlZWRTYW1wbGVzLnB1c2goc3ByaXRlSW5mb1tcInhzcGVlZFwiXSk7XG4gICAgICAgICAgICBzcHJpdGUxU2FtcGxpbmcueXNwZWVkU2FtcGxlcy5wdXNoKHNwcml0ZUluZm9bXCJ5c3BlZWRcIl0pO1xuICAgICAgICB9IGVsc2UgaWYgKCFzcHJpdGUxU2FtcGxpbmcuY2hlY2tlZCkge1xuICAgICAgICAgICAgc3ByaXRlMVNhbXBsaW5nLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgY29uc3Qgc3MgPSBzcHJpdGUxU2FtcGxpbmcuc2FtcGxlU2l6ZTtcbiAgICAgICAgICAgIGNvbnN0IHN4U2FtcGxlcyA9IHNwcml0ZTFTYW1wbGluZy54c3BlZWRTYW1wbGVzO1xuICAgICAgICAgICAgY29uc3Qgc3lTYW1wbGVzID0gc3ByaXRlMVNhbXBsaW5nLnlzcGVlZFNhbXBsZXM7XG5cbiAgICAgICAgICAgIGxldCBzYW1lWHNwZWVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc3M7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChzeFNhbXBsZXNbaV0gIT09IHN4U2FtcGxlc1tpIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgc2FtZVhzcGVlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2FtZVhzcGVlZCAmJiBzeFNhbXBsZXNbMF0gIT09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhHUUdfV0FSTklOR19JTl9NWVBST0dSQU1fTVNHXG4gICAgICAgICAgICAgICAgICAgICsgXCJzcHJpdGUgaGl0IGRpcmVjdGlvbiBmdW5jdGlvbmFsaXR5LSBwb3NzaWJseSB3cm9uZyB4cG9zIGNhbGN1bGF0aW9uIGZvciBzcHJpdGU6IFwiXG4gICAgICAgICAgICAgICAgICAgICsgc3ByaXRlSW5mb1tcImlkXCJdXG4gICAgICAgICAgICAgICAgICAgICsgXCIuICBFbnN1cmUgeHNwZWVkIHVzZWQgdmFsaWRseSBpZiBzcHJpdGUgaGl0IGRpcmVjdGlvbmFsaXR5IHNlZW1zIHdyb25nLlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHNhbWVZc3BlZWQgPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBzczsgKytpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN5U2FtcGxlc1tpXSAhPT0gc3lTYW1wbGVzW2kgLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICBzYW1lWXNwZWVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzYW1lWXNwZWVkICYmIHN5U2FtcGxlc1swXSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKEdRR19XQVJOSU5HX0lOX01ZUFJPR1JBTV9NU0dcbiAgICAgICAgICAgICAgICAgICAgKyBcInNwcml0ZSBoaXQgZGlyZWN0aW9uIGZ1bmN0aW9uYWxpdHktIHBvc3NpYmx5IHdyb25nIHlwb3MgY2FsY3VsYXRpb24gZm9yIHNwcml0ZTogXCJcbiAgICAgICAgICAgICAgICAgICAgKyBzcHJpdGVJbmZvW1wiaWRcIl1cbiAgICAgICAgICAgICAgICAgICAgKyBcIi4gIEVuc3VyZSB5c3BlZWQgdXNlZCB2YWxpZGx5IGlmIHNwcml0ZSBoaXQgZGlyZWN0aW9uYWxpdHkgc2VlbXMgd3JvbmcuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZUhpdERpciA9IChcbiAgICBzcHJpdGUxSW5mbzogU3ByaXRlRGljdCxcbiAgICBzcHJpdGUySW5mbzogU3ByaXRlRGljdFxuKTogU3ByaXRlSGl0RGlyZWN0aW9uYWxpdHkgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgY2hlY2tTcHJpdGVTcGVlZFVzYWdlQ29tbW9uRXJyb3JzKHNwcml0ZTFJbmZvKTtcbiAgICAgICAgY2hlY2tTcHJpdGVTcGVlZFVzYWdlQ29tbW9uRXJyb3JzKHNwcml0ZTJJbmZvKTtcbiAgICB9XG4gICAgcmV0dXJuIHNwcml0ZUhpdERpckltcGwoc3ByaXRlMUluZm8sIHNwcml0ZTJJbmZvKTtcbn1cbmNvbnN0IHNwcml0ZUhpdERpckltcGwgPSAoXG4gICAgc3ByaXRlMUluZm86IFNwcml0ZVBoeXNpY2FsRGltZW5zaW9ucyxcbiAgICBzcHJpdGUySW5mbzogU3ByaXRlUGh5c2ljYWxEaW1lbnNpb25zXG4pOiBTcHJpdGVIaXREaXJlY3Rpb25hbGl0eSA9PiB7XG4gICAgLypcbiAgICAgICBSZXR1cm5zIHRoZSBkaXJlY3Rpb24gdGhhdCBzcHJpdGUgMSBoaXRzIHNwcml0ZSAyIGZyb20uXG4gICAgICAgc3ByaXRlIDEgaXMgcmVsYXRpdmVseSBsZWZ0L3JpZ2h0L3VwL2Rvd24gb2Ygc3ByaXRlIDJcbiAgICAgICBcbiAgICAgICBIaXQgZGlyZWN0aW9uIHJldHVybmVkIGNvdWxkIGJlIG11bHRpcGxlIHZhbHVlcyAoZS5nLiBsZWZ0IGFuZCB1cCksXG4gICAgICAgYW5kIGlzIHJldHVybmVkIGJ5IHRoaXMgZnVuY3Rpb24gYXMgYSBkaWN0aW9uYXJ5IGFzLCBlLmcuXG4gICAgICAge1xuICAgICAgIFwibGVmdFwiOiBmYWxzZSxcbiAgICAgICBcInJpZ2h0XCI6IGZhbHNlLFxuICAgICAgIFwidXBcIjogZmFsc2UsXG4gICAgICAgXCJkb3duXCI6IGZhbHNlXG4gICAgICAgfVxuICAgICAgIFxuICAgICAgIFBhcmFtZXRlcnMgc3ByaXRlezEsMn1JbmZvIGFyZSBkaWN0aW9uYXJpZXMgd2l0aCBhdCBsZWFzdCB0aGVzZSBrZXlzOlxuICAgICAgIHtcbiAgICAgICBcImlkXCI6IFwiYWN0dWFsU3ByaXRlTmFtZVwiLFxuICAgICAgIFwieHBvc1wiOiA1MDAsXG4gICAgICAgXCJ5cG9zXCI6IDIwMCxcbiAgICAgICBcInhzcGVlZFwiOiAtOCwgIC8vIG1vdmVtZW50IG11c3QgYmUgYnkgZGljdGlvbmFyeSxcbiAgICAgICBcInlzcGVlZFwiOiAwLCAgIC8vIHdpdGggc29tZXRoaW5nIGxpa2UgeCA9IHggKyB4c3BlZWRcbiAgICAgICBcImhlaWdodFwiOiA3NCxcbiAgICAgICBcIndpZHRoXCI6IDc1XG4gICAgICAgfVxuICAgICAgICovXG5cbiAgICB2YXIgcGVyY2VudE1hcmdpbiA9IDEuMTsgLy8gcG9zaXRpdmUgcGVyY2VudCBpbiBkZWNpbWFsXG4gICAgdmFyIGRpcjogU3ByaXRlSGl0RGlyZWN0aW9uYWxpdHkgPSB7XG4gICAgICAgIFwibGVmdFwiOiBmYWxzZSxcbiAgICAgICAgXCJyaWdodFwiOiBmYWxzZSxcbiAgICAgICAgXCJ1cFwiOiBmYWxzZSxcbiAgICAgICAgXCJkb3duXCI6IGZhbHNlXG4gICAgfTtcblxuICAgIC8vIGN1cnJlbnQgaG9yaXpvbnRhbCBwb3NpdGlvblxuICAgIHZhciBzMWxlZnQgPSBzcHJpdGUxSW5mb1tcInhwb3NcIl07XG4gICAgdmFyIHMxcmlnaHQgPSBzMWxlZnQgKyBzcHJpdGUxSW5mb1tcIndpZHRoXCJdO1xuXG4gICAgdmFyIHMybGVmdCA9IHNwcml0ZTJJbmZvW1wieHBvc1wiXTtcbiAgICB2YXIgczJyaWdodCA9IHMybGVmdCArIHNwcml0ZTJJbmZvW1wid2lkdGhcIl07XG5cbiAgICAvLyByZXZlcnNlIGhvcml6b250YWwgcG9zaXRpb24gYnkgeHNwZWVkIHdpdGggcGVyY2VudCBtYXJnaW5cbiAgICB2YXIgc3ByaXRlMVhTcGVlZCA9IHNwcml0ZTFJbmZvW1wieHNwZWVkXCJdICogcGVyY2VudE1hcmdpbjtcbiAgICBzMWxlZnQgPSBzMWxlZnQgLSBzcHJpdGUxWFNwZWVkO1xuICAgIHMxcmlnaHQgPSBzMXJpZ2h0IC0gc3ByaXRlMVhTcGVlZDtcblxuICAgIHZhciBzcHJpdGUyWFNwZWVkID0gc3ByaXRlMkluZm9bXCJ4c3BlZWRcIl0gKiBwZXJjZW50TWFyZ2luO1xuICAgIHMybGVmdCA9IHMybGVmdCAtIHNwcml0ZTJYU3BlZWQ7XG4gICAgczJyaWdodCA9IHMycmlnaHQgLSBzcHJpdGUyWFNwZWVkO1xuXG4gICAgaWYgKHMxcmlnaHQgPD0gczJsZWZ0KSB7XG4gICAgICAgIGRpcltcImxlZnRcIl0gPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoczJyaWdodCA8PSBzMWxlZnQpIHtcbiAgICAgICAgZGlyW1wicmlnaHRcIl0gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIGN1cnJlbnQgdmVydGljYWwgcG9zaXRpb25cbiAgICB2YXIgczF0b3AgPSBzcHJpdGUxSW5mb1tcInlwb3NcIl07XG4gICAgdmFyIHMxYm90dG9tID0gczF0b3AgKyBzcHJpdGUxSW5mb1tcImhlaWdodFwiXTtcblxuICAgIHZhciBzMnRvcCA9IHNwcml0ZTJJbmZvW1wieXBvc1wiXTtcbiAgICB2YXIgczJib3R0b20gPSBzMnRvcCArIHNwcml0ZTJJbmZvW1wiaGVpZ2h0XCJdO1xuXG4gICAgLy8gcmV2ZXJzZSB2ZXJ0aWNhbCBwb3NpdGlvbiBieSB5c3BlZWQgd2l0aCBwZXJjZW50IG1hcmdpblxuICAgIHZhciBzcHJpdGUxWVNwZWVkID0gc3ByaXRlMUluZm9bXCJ5c3BlZWRcIl0gKiBwZXJjZW50TWFyZ2luO1xuICAgIHMxdG9wID0gczF0b3AgLSBzcHJpdGUxWVNwZWVkO1xuICAgIHMxYm90dG9tID0gczFib3R0b20gLSBzcHJpdGUxWVNwZWVkO1xuXG4gICAgdmFyIHNwcml0ZTJZU3BlZWQgPSBzcHJpdGUySW5mb1tcInlzcGVlZFwiXSAqIHBlcmNlbnRNYXJnaW47XG4gICAgczJ0b3AgPSBzMnRvcCAtIHNwcml0ZTJZU3BlZWQ7XG4gICAgczJib3R0b20gPSBzMmJvdHRvbSAtIHNwcml0ZTJZU3BlZWQ7XG5cbiAgICBpZiAoczFib3R0b20gPD0gczJ0b3ApIHtcbiAgICAgICAgZGlyW1widXBcIl0gPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoczJib3R0b20gPD0gczF0b3ApIHtcbiAgICAgICAgZGlyW1wiZG93blwiXSA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpcjtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRLZXlTdGF0ZSA9IChrZXk6IG51bWJlcik6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiAhISQuZ1Eua2V5VHJhY2tlcltrZXldO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldE1vdXNlWCA9ICgpOiBudW1iZXIgPT4ge1xuICAgIHJldHVybiAkLmdRLm1vdXNlVHJhY2tlci54O1xufTtcbmV4cG9ydCBjb25zdCBnZXRNb3VzZVkgPSAoKTogbnVtYmVyID0+IHtcbiAgICByZXR1cm4gJC5nUS5tb3VzZVRyYWNrZXIueTtcbn07XG5leHBvcnQgY29uc3QgZ2V0TW91c2VCdXR0b24xID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiAhISQuZ1EubW91c2VUcmFja2VyWzFdO1xufTtcbmV4cG9ydCBjb25zdCBnZXRNb3VzZUJ1dHRvbjIgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgcmV0dXJuICEhJC5nUS5tb3VzZVRyYWNrZXJbMl07XG59O1xuZXhwb3J0IGNvbnN0IGdldE1vdXNlQnV0dG9uMyA9ICgpOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gISEkLmdRLm1vdXNlVHJhY2tlclszXTtcbn07XG5cbmV4cG9ydCBjb25zdCBkaXNhYmxlQ29udGV4dE1lbnUgPSAoKTogdm9pZCA9PiB7XG4gICAgLy8gc2VlIGFsc286IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ5MjAyMjEvanF1ZXJ5LWpzLXByZXZlbnQtcmlnaHQtY2xpY2stbWVudS1pbi1icm93c2Vyc1xuICAgIC8vICQoXCIjcGxheWdyb3VuZFwiKS5jb250ZXh0bWVudShmdW5jdGlvbigpe3JldHVybiBmYWxzZTt9KTtcbiAgICAkKFwiI3BsYXlncm91bmRcIikub24oXCJjb250ZXh0bWVudVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbn07XG5leHBvcnQgY29uc3QgZW5hYmxlQ29udGV4dE1lbnUgPSAoKTogdm9pZCA9PiB7XG4gICAgLy8gc2VlIGFsc286IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ5MjAyMjEvanF1ZXJ5LWpzLXByZXZlbnQtcmlnaHQtY2xpY2stbWVudS1pbi1icm93c2Vyc1xuICAgICQoXCIjcGxheWdyb3VuZFwiKS5vZmYoXCJjb250ZXh0bWVudVwiKTtcbn07XG5cbmV4cG9ydCBjb25zdCBoaWRlTW91c2VDdXJzb3IgPSAoKTogdm9pZCA9PiB7XG4gICAgJChcIiNwbGF5Z3JvdW5kXCIpLmNzcyhcImN1cnNvclwiLCBcIm5vbmVcIik7XG59O1xuZXhwb3J0IGNvbnN0IHNob3dNb3VzZUN1cnNvciA9ICgpOiB2b2lkID0+IHtcbiAgICAkKFwiI3BsYXlncm91bmRcIikuY3NzKFwiY3Vyc29yXCIsIFwiZGVmYXVsdFwiKTtcbn07XG5cbmV4cG9ydCBjb25zdCBzYXZlRGljdGlvbmFyeUFzID0gKHNhdmVBczogc3RyaW5nLCBkaWN0aW9uYXJ5OiBvYmplY3QpOiB2b2lkID0+IHtcbiAgICAvLyByZXF1aXJlcyBqcy1jb29raWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qcy1jb29raWUvanMtY29va2llL3RyZWUvdjIuMC40XG4gICAgQ29va2llcy5zZXQoXCJHUUdfXCIgKyBzYXZlQXMsIGRpY3Rpb25hcnkpO1xufTtcbmV4cG9ydCBjb25zdCBnZXRTYXZlZERpY3Rpb25hcnkgPSAoc2F2ZWRBczogc3RyaW5nKTogb2JqZWN0ID0+IHtcbiAgICByZXR1cm4gQ29va2llcy5nZXRKU09OKFwiR1FHX1wiICsgc2F2ZWRBcyk7XG59O1xuZXhwb3J0IGNvbnN0IGRlbGV0ZVNhdmVkRGljdGlvbmFyeSA9IChzYXZlZEFzOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBDb29raWVzLnJlbW92ZShcIkdRR19cIiArIHNhdmVkQXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZU92YWxJbkdyb3VwID0gKFxuICAgIGdyb3VwTmFtZTogc3RyaW5nIHwgbnVsbCxcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICAvLyByb3RkZWcgaW4gZGVncmVlcyBjbG9ja3dpc2Ugb24gc2NyZWVuIChyZWNhbGwgeS1heGlzIHBvaW50cyBkb3dud2FyZHMhKVxuXG4gICAgaWYgKCFjb2xvcikge1xuICAgICAgICBjb2xvciA9IFwiZ3JheVwiO1xuICAgIH1cblxuICAgIGlmICghZ3JvdXBOYW1lKSB7XG4gICAgICAgICQucGxheWdyb3VuZCgpLmFkZFNwcml0ZShpZCwgeyB3aWR0aDogMSwgaGVpZ2h0OiAxIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNyZWF0ZVNwcml0ZUluR3JvdXAoZ3JvdXBOYW1lLCBpZCwgeyB3aWR0aDogMSwgaGVpZ2h0OiAxIH0pO1xuICAgIH1cblxuICAgIHZhciBib3JkZXJfcmFkaXVzID0gKHcgLyAyICsgXCJweCAvIFwiICsgaCAvIDIgKyBcInB4XCIpO1xuICAgIHNwcml0ZShpZClcbiAgICAgICAgLmNzcyhcImJhY2tncm91bmRcIiwgY29sb3IpXG4gICAgICAgIC5jc3MoXCJib3JkZXItcmFkaXVzXCIsIGJvcmRlcl9yYWRpdXMpXG4gICAgICAgIC5jc3MoXCItbW96LWJvcmRlci1yYWRpdXNcIiwgYm9yZGVyX3JhZGl1cylcbiAgICAgICAgLmNzcyhcIi13ZWJraXQtYm9yZGVyLXJhZGl1c1wiLCBib3JkZXJfcmFkaXVzKTtcblxuICAgIHNwcml0ZVNldFdpZHRoSGVpZ2h0KGlkLCB3LCBoKTtcbiAgICBzcHJpdGVTZXRYWShpZCwgeCwgeSk7XG5cbiAgICBpZiAocm90ZGVnKSB7XG4gICAgICAgIGlmIChyb3RPcmlnaW5YICYmIHJvdE9yaWdpblkpIHtcbiAgICAgICAgICAgIHZhciByb3RPcmlnaW4gPSByb3RPcmlnaW5YICsgXCJweCBcIiArIHJvdE9yaWdpblkgKyBcInB4XCI7XG4gICAgICAgICAgICBzcHJpdGUoaWQpXG4gICAgICAgICAgICAgICAgLmNzcyhcIi13ZWJraXQtdHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pXG4gICAgICAgICAgICAgICAgLmNzcyhcIi1tb3otdHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pXG4gICAgICAgICAgICAgICAgLmNzcyhcIi1tcy10cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbilcbiAgICAgICAgICAgICAgICAuY3NzKFwiLW8tdHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pXG4gICAgICAgICAgICAgICAgLmNzcyhcInRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKTtcbiAgICAgICAgfVxuICAgICAgICBzcHJpdGVSb3RhdGUoaWQsIHJvdGRlZyk7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVPdmFsID0gKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICB3OiBudW1iZXIsXG4gICAgaDogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHJvdGRlZz86IG51bWJlcixcbiAgICByb3RPcmlnaW5YPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblk/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZU92YWxJbkdyb3VwKFxuICAgICAgICBudWxsLFxuICAgICAgICBpZCxcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgdyxcbiAgICAgICAgaCxcbiAgICAgICAgY29sb3IsXG4gICAgICAgIHJvdGRlZyxcbiAgICAgICAgcm90T3JpZ2luWCxcbiAgICAgICAgcm90T3JpZ2luWVxuICAgICk7XG59O1xuZXhwb3J0IGNvbnN0IGRyYXdPdmFsID0gKFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVPdmFsKFxuICAgICAgICBcIkdRR19vdmFsX1wiICsgR1FHX2dldFVuaXF1ZUlkKCksXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHcsXG4gICAgICAgIGgsXG4gICAgICAgIGNvbG9yLFxuICAgICAgICByb3RkZWcsXG4gICAgICAgIHJvdE9yaWdpblgsXG4gICAgICAgIHJvdE9yaWdpbllcbiAgICApO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVDaXJjbGVJbkdyb3VwID0gKFxuICAgIGdyb3VwTmFtZTogc3RyaW5nIHwgbnVsbCxcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgcjogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHJvdGRlZz86IG51bWJlcixcbiAgICByb3RPcmlnaW5YPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblk/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZU92YWxJbkdyb3VwKFxuICAgICAgICBncm91cE5hbWUsXG4gICAgICAgIGlkLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICByLFxuICAgICAgICByLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlQ2lyY2xlID0gKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICByOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgY3JlYXRlQ2lyY2xlSW5Hcm91cChcbiAgICAgICAgbnVsbCxcbiAgICAgICAgaWQsXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHIsXG4gICAgICAgIGNvbG9yLFxuICAgICAgICByb3RkZWcsXG4gICAgICAgIHJvdE9yaWdpblgsXG4gICAgICAgIHJvdE9yaWdpbllcbiAgICApO1xufTtcbmV4cG9ydCBjb25zdCBkcmF3Q2lyY2xlID0gKFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgcjogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHJvdGRlZz86IG51bWJlcixcbiAgICByb3RPcmlnaW5YPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblk/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZUNpcmNsZShcbiAgICAgICAgXCJHUUdfY2lyY2xlX1wiICsgR1FHX2dldFVuaXF1ZUlkKCksXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHIsXG4gICAgICAgIGNvbG9yLFxuICAgICAgICByb3RkZWcsXG4gICAgICAgIHJvdE9yaWdpblgsXG4gICAgICAgIHJvdE9yaWdpbllcbiAgICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVJlY3RJbkdyb3VwID0gKFxuICAgIGdyb3VwTmFtZTogc3RyaW5nIHwgbnVsbCxcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICAvLyByb3RkZWcgaW4gZGVncmVlcyBjbG9ja3dpc2Ugb24gc2NyZWVuIChyZWNhbGwgeS1heGlzIHBvaW50cyBkb3dud2FyZHMhKVxuICAgIC8vIHJvdE9yaWdpbntYLFl9IG11c3QgYmUgd2l0aGluIHJhbmdlIG9mIHdpZGUgdyBhbmQgaGVpZ2h0IGgsIGFuZCByZWxhdGl2ZSB0byBjb29yZGluYXRlICh4LHkpLlxuXG4gICAgaWYgKCFjb2xvcikge1xuICAgICAgICBjb2xvciA9IFwiZ3JheVwiO1xuICAgIH1cblxuICAgIGlmICghZ3JvdXBOYW1lKSB7XG4gICAgICAgICQucGxheWdyb3VuZCgpLmFkZFNwcml0ZShpZCwgeyB3aWR0aDogMSwgaGVpZ2h0OiAxIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNyZWF0ZVNwcml0ZUluR3JvdXAoZ3JvdXBOYW1lLCBpZCwgeyB3aWR0aDogMSwgaGVpZ2h0OiAxIH0pO1xuICAgIH1cblxuICAgIHNwcml0ZShpZCkuY3NzKFwiYmFja2dyb3VuZFwiLCBjb2xvcik7XG5cbiAgICBzcHJpdGVTZXRXaWR0aEhlaWdodChpZCwgdywgaCk7XG4gICAgc3ByaXRlU2V0WFkoaWQsIHgsIHkpO1xuXG4gICAgaWYgKHJvdGRlZykge1xuICAgICAgICBpZiAocm90T3JpZ2luWCAmJiByb3RPcmlnaW5ZKSB7XG4gICAgICAgICAgICB2YXIgcm90T3JpZ2luID0gcm90T3JpZ2luWCArIFwicHggXCIgKyByb3RPcmlnaW5ZICsgXCJweFwiO1xuICAgICAgICAgICAgc3ByaXRlKGlkKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItd2Via2l0LXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItbW96LXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItbXMtdHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pXG4gICAgICAgICAgICAgICAgLmNzcyhcIi1vLXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCJ0cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbik7XG4gICAgICAgIH1cbiAgICAgICAgc3ByaXRlUm90YXRlKGlkLCByb3RkZWcpO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgY3JlYXRlUmVjdCA9IChcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVSZWN0SW5Hcm91cChcbiAgICAgICAgbnVsbCxcbiAgICAgICAgaWQsXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHcsXG4gICAgICAgIGgsXG4gICAgICAgIGNvbG9yLFxuICAgICAgICByb3RkZWcsXG4gICAgICAgIHJvdE9yaWdpblgsXG4gICAgICAgIHJvdE9yaWdpbllcbiAgICApO1xufTtcbmV4cG9ydCBjb25zdCBkcmF3UmVjdCA9IChcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHc6IG51bWJlcixcbiAgICBoOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgY3JlYXRlUmVjdChcbiAgICAgICAgXCJHUUdfcmVjdF9cIiArIEdRR19nZXRVbmlxdWVJZCgpLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICB3LFxuICAgICAgICBoLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVMaW5lSW5Hcm91cCA9IChcbiAgICBncm91cE5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgaWQ6IHN0cmluZyxcbiAgICB4MTogbnVtYmVyLFxuICAgIHkxOiBudW1iZXIsXG4gICAgeDI6IG51bWJlcixcbiAgICB5MjogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHRoaWNrbmVzcz86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgaWYgKCFjb2xvcikge1xuICAgICAgICBjb2xvciA9IFwiZ3JheVwiO1xuICAgIH1cbiAgICBpZiAoIXRoaWNrbmVzcykge1xuICAgICAgICB0aGlja25lc3MgPSAyO1xuICAgIH1cbiAgICB2YXIgeGQgPSB4MiAtIHgxO1xuICAgIHZhciB5ZCA9IHkyIC0geTE7XG4gICAgdmFyIGRpc3QgPSBNYXRoLnNxcnQoeGQgKiB4ZCArIHlkICogeWQpO1xuXG4gICAgdmFyIGFyY0NvcyA9IE1hdGguYWNvcyh4ZCAvIGRpc3QpO1xuICAgIGlmICh5MiA8IHkxKSB7XG4gICAgICAgIGFyY0NvcyAqPSAtMTtcbiAgICB9XG4gICAgdmFyIHJvdGRlZyA9IGFyY0NvcyAqIDE4MCAvIE1hdGguUEk7XG5cbiAgICB2YXIgaGFsZlRoaWNrID0gdGhpY2tuZXNzIC8gMjtcbiAgICB2YXIgZHJhd1kxID0geTEgLSBoYWxmVGhpY2s7XG5cbiAgICBjcmVhdGVSZWN0SW5Hcm91cChcbiAgICAgICAgZ3JvdXBOYW1lLFxuICAgICAgICBpZCxcbiAgICAgICAgeDEsXG4gICAgICAgIGRyYXdZMSxcbiAgICAgICAgZGlzdCxcbiAgICAgICAgdGhpY2tuZXNzLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICAwLFxuICAgICAgICBoYWxmVGhpY2tcbiAgICApO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVMaW5lID0gKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgeDE6IG51bWJlcixcbiAgICB5MTogbnVtYmVyLFxuICAgIHgyOiBudW1iZXIsXG4gICAgeTI6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICB0aGlja25lc3M/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZUxpbmVJbkdyb3VwKG51bGwsIGlkLCB4MSwgeTEsIHgyLCB5MiwgY29sb3IsIHRoaWNrbmVzcyk7XG59O1xuZXhwb3J0IGNvbnN0IGRyYXdMaW5lID0gKFxuICAgIHgxOiBudW1iZXIsXG4gICAgeTE6IG51bWJlcixcbiAgICB4MjogbnVtYmVyLFxuICAgIHkyOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgdGhpY2tuZXNzPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVMaW5lKFwiR1FHX2xpbmVfXCIgKyBHUUdfZ2V0VW5pcXVlSWQoKSwgeDEsIHkxLCB4MiwgeTIsIGNvbG9yLCB0aGlja25lc3MpO1xufTtcblxuZXhwb3J0IHR5cGUgQ29udGFpbmVySXRlcmF0b3IgPSB7XG4gICAgbmV4dDogKCkgPT4gW251bWJlciwgbnVtYmVyXTtcbiAgICBoYXNOZXh0OiAoKSA9PiBib29sZWFuO1xuICAgIGN1cnJlbnQ6IG51bWJlcjtcbiAgICBlbmQ6IG51bWJlcjtcbiAgICBfa2V5czogc3RyaW5nW107XG59O1xuZXhwb3J0IHR5cGUgTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4gPSAobjogbnVtYmVyKSA9PiBudW1iZXIgfCBSZWNvcmQ8XG4gICAgbnVtYmVyLFxuICAgIG51bWJlclxuPjtcbmV4cG9ydCB0eXBlIENyZWF0ZUNvbnRhaW5lckl0ZXJhdG9yRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXJcbiAgICApOiBDb250YWluZXJJdGVyYXRvcjtcbiAgICAodGhpczogdm9pZCwgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4pOiBDb250YWluZXJJdGVyYXRvcjtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlQ29udGFpbmVySXRlcmF0b3I6IENyZWF0ZUNvbnRhaW5lckl0ZXJhdG9yRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICBzdGFydD86IG51bWJlcixcbiAgICBlbmQ/OiBudW1iZXIsXG4gICAgc3RlcHNpemU/OiBudW1iZXJcbik6IENvbnRhaW5lckl0ZXJhdG9yIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgZiA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBjb25zdCBmT3duUHJvcE5hbWVzOiBzdHJpbmdbXSA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGYpO1xuICAgICAgICBjb25zdCBpdDogQ29udGFpbmVySXRlcmF0b3IgPSB7XG4gICAgICAgICAgICBjdXJyZW50OiAwLFxuICAgICAgICAgICAgZW5kOiBmT3duUHJvcE5hbWVzLmxlbmd0aCxcbiAgICAgICAgICAgIF9rZXlzOiBmT3duUHJvcE5hbWVzLFxuICAgICAgICAgICAgbmV4dDogZnVuY3Rpb24gKHRoaXM6IENvbnRhaW5lckl0ZXJhdG9yKTogW251bWJlciwgbnVtYmVyXSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbUlkeCA9IHRoaXMuX2tleXNbdGhpcy5jdXJyZW50XTtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtOiBbbnVtYmVyLCBudW1iZXJdID0gW051bWJlcihpdGVtSWR4KSwgZltpdGVtSWR4XV07XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Kys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGFzTmV4dDogZnVuY3Rpb24gKHRoaXM6IENvbnRhaW5lckl0ZXJhdG9yKTogYm9vbGVhbiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLmN1cnJlbnQgPCB0aGlzLmVuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBpdDtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwic3RhcnQgbXVzdCBiZSBhIG51bWJlci5cIiwgc3RhcnQpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiZW5kIG11c3QgYmUgYSBudW1iZXIuXCIsIGVuZCk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJzdGVwc2l6ZSBtdXN0IGJlIGEgbnVtYmVyLlwiLCBzdGVwc2l6ZSk7XG4gICAgICAgIGlmIChzdGFydCA9PSBudWxsIHx8IGVuZCA9PSBudWxsIHx8IHN0ZXBzaXplID09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IFwiVFMgdHlwZSBoaW50XCI7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmeDogKG46IG51bWJlcikgPT4gbnVtYmVyID0gKHR5cGVvZiBmID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICAgID8gKGYgYXMgKHg6IG51bWJlcikgPT4gbnVtYmVyKVxuICAgICAgICAgICAgOiAoeDogbnVtYmVyKTogbnVtYmVyID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTnVtYmVyKGZbeF0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGl0OiBDb250YWluZXJJdGVyYXRvciA9IHtcbiAgICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uICh0aGlzOiBDb250YWluZXJJdGVyYXRvcik6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW06IFtudW1iZXIsIG51bWJlcl0gPSBbdGhpcy5jdXJyZW50LCBmeCh0aGlzLmN1cnJlbnQpXTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQgKz0gc3RlcHNpemU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGFzTmV4dDogZnVuY3Rpb24gKHRoaXM6IENvbnRhaW5lckl0ZXJhdG9yKTogYm9vbGVhbiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLmN1cnJlbnQgPCB0aGlzLmVuZCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3VycmVudDogc3RhcnQsXG4gICAgICAgICAgICBlbmQ6IGVuZCxcbiAgICAgICAgICAgIF9rZXlzOiB0eXBlb2YgZiAhPT0gXCJmdW5jdGlvblwiID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZikgOiAoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBrOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IHN0ZXBzaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIGsucHVzaChTdHJpbmcoaSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaztcbiAgICAgICAgICAgIH0pKClcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGl0O1xuICAgIH1cbn07XG5leHBvcnQgdHlwZSBHcmFwaENyZWF0aW9uT3B0aW9ucyA9IHtcbiAgICBpbnRlcnBvbGF0ZWQ6IGJvb2xlYW47XG59O1xuZXhwb3J0IHR5cGUgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnMsXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICByYWRpdXNfdGhpY2tuZXNzOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgbW9yZU9wdHM6IEdyYXBoQ3JlYXRpb25PcHRpb25zLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnMsXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIG1vcmVPcHRzOiBHcmFwaENyZWF0aW9uT3B0aW9ucyxcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgcmFkaXVzX3RoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIG1vcmVPcHRzOiBHcmFwaENyZWF0aW9uT3B0aW9ucyxcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnNcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbn07XG5leHBvcnQgdHlwZSBHcm91cE5hbWVBbmRJZFByZWZpeCA9IHtcbiAgICBcImlkXCI6IHN0cmluZztcbiAgICBcImdyb3VwXCI6IHN0cmluZztcbn07XG50eXBlIENyZWF0ZUdyYXBoV2l0aE9wdGlvbnNGblBhcmFtVHlwZXMgPSBbXG4gICAgc3RyaW5nLFxuICAgIHN0cmluZyxcbiAgICBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICBHcmFwaENyZWF0aW9uT3B0aW9uc1xuXTtcbmV4cG9ydCBjb25zdCBjcmVhdGVHcmFwaFdpdGhPcHRpb25zOiBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICBpZDogc3RyaW5nLFxuICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgIG1vcmVPcHRzOiBHcmFwaENyZWF0aW9uT3B0aW9uc1xuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXgge1xuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIG1vcmVPcHRzLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIHJhZGl1c190aGlja25lc3MpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgbW9yZU9wdHMsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBtb3JlT3B0cywgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgbW9yZU9wdHMsIGNvbG9yLCByYWRpdXNfdGhpY2tuZXNzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIG1vcmVPcHRzLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBtb3JlT3B0cylcbiAgICAvLyBtb3JlT3B0cyA9IHtcImludGVycG9sYXRlZFwiOiB0cnVlT3JGYWxzZX1cbiAgICB2YXIgaW50ZXJwb2xhdGVkID0gbW9yZU9wdHNbXCJpbnRlcnBvbGF0ZWRcIl07XG5cbiAgICBpZiAoIWlkKSB7XG4gICAgICAgIGlkID0gXCJHUUdfZ3JhcGhfXCIgKyBHUUdfZ2V0VW5pcXVlSWQoKTtcbiAgICB9XG4gICAgaWYgKCFncm91cE5hbWUpIHtcbiAgICAgICAgZ3JvdXBOYW1lID0gaWQgKyBcIl9ncm91cFwiO1xuICAgICAgICBjcmVhdGVHcm91cEluUGxheWdyb3VuZChncm91cE5hbWUpO1xuICAgIH1cbiAgICB2YXIgZ3JvdXBfaWQgPSB7XG4gICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgIFwiZ3JvdXBcIjogZ3JvdXBOYW1lXG4gICAgfTtcblxuICAgIHZhciBjb2xvcjtcbiAgICB2YXIgcmFkaXVzX3RoaWNrbmVzcztcbiAgICBsZXQgaXRlcjogQ29udGFpbmVySXRlcmF0b3I7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCAmJiBhcmd1bWVudHMubGVuZ3RoIDw9IDYgJiZcbiAgICAgICAgXCJvYmplY3RcIiA9PT0gdHlwZW9mIChmKSkge1xuICAgICAgICBjb2xvciA9IGFyZ3VtZW50c1s0XTtcbiAgICAgICAgcmFkaXVzX3RoaWNrbmVzcyA9IGFyZ3VtZW50c1s1XTtcbiAgICAgICAgaXRlciA9IGNyZWF0ZUNvbnRhaW5lckl0ZXJhdG9yKGYpO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA3ICYmIGFyZ3VtZW50cy5sZW5ndGggPD0gOSkge1xuICAgICAgICB2YXIgc3RhcnQgPSBhcmd1bWVudHNbNF07XG4gICAgICAgIHZhciBlbmQgPSBhcmd1bWVudHNbNV07XG4gICAgICAgIHZhciBzdGVwc2l6ZSA9IGFyZ3VtZW50c1s2XTtcbiAgICAgICAgY29sb3IgPSBhcmd1bWVudHNbN107XG4gICAgICAgIHJhZGl1c190aGlja25lc3MgPSBhcmd1bWVudHNbOF07XG4gICAgICAgIGl0ZXIgPSBjcmVhdGVDb250YWluZXJJdGVyYXRvcihmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIkZ1bmN0aW9uIHVzZWQgd2l0aCB3cm9uZyBudW1iZXIgb2YgYXJndW1lbnRzXCIpO1xuICAgICAgICB0aHJvdyBcIlRTIHR5cGUgaGludFwiO1xuICAgIH1cblxuICAgIGlmIChjb2xvciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29sb3IgPSBcImdyYXlcIjtcbiAgICB9XG4gICAgaWYgKHJhZGl1c190aGlja25lc3MgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJhZGl1c190aGlja25lc3MgPSAyO1xuICAgIH1cblxuICAgIHZhciBjdXJyWCA9IG51bGw7XG4gICAgdmFyIGN1cnJZID0gbnVsbDtcbiAgICB3aGlsZSAoaXRlci5oYXNOZXh0KCkpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBpdGVyLm5leHQoKTtcbiAgICAgICAgdmFyIGkgPSBpdGVtWzBdO1xuICAgICAgICB2YXIgZnhpID0gaXRlbVsxXTtcblxuICAgICAgICBpZiAoZnhpID09PSBJbmZpbml0eSkge1xuICAgICAgICAgICAgZnhpID0gR1FHX01BWF9TQUZFX1BMQVlHUk9VTkRfSU5URUdFUjtcbiAgICAgICAgfSBlbHNlIGlmIChmeGkgPT09IC1JbmZpbml0eSkge1xuICAgICAgICAgICAgZnhpID0gR1FHX01JTl9TQUZFX1BMQVlHUk9VTkRfSU5URUdFUjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdXJyWSA9PT0gbnVsbCAmJiBmeGkgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjdXJyWCA9IGk7XG4gICAgICAgICAgICBjdXJyWSA9IGZ4aTtcbiAgICAgICAgICAgIGlmICghaW50ZXJwb2xhdGVkKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlQ2lyY2xlSW5Hcm91cChcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBfaWRbXCJncm91cFwiXSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBfaWRbXCJpZFwiXSArIFwiX2dyYXBoX3B0X1wiICsgaSxcbiAgICAgICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICAgICAgZnhpLFxuICAgICAgICAgICAgICAgICAgICByYWRpdXNfdGhpY2tuZXNzLFxuICAgICAgICAgICAgICAgICAgICBjb2xvclxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZnhpICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKCFpbnRlcnBvbGF0ZWQpIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVDaXJjbGVJbkdyb3VwKFxuICAgICAgICAgICAgICAgICAgICBncm91cF9pZFtcImdyb3VwXCJdLFxuICAgICAgICAgICAgICAgICAgICBncm91cF9pZFtcImlkXCJdICsgXCJfZ3JhcGhfcHRfXCIgKyBpLFxuICAgICAgICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICAgICAgICBmeGksXG4gICAgICAgICAgICAgICAgICAgIHJhZGl1c190aGlja25lc3MsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlTGluZUluR3JvdXAoXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwX2lkW1wiZ3JvdXBcIl0sXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwX2lkW1wiaWRcIl0gKyBcIl9ncmFwaF9saW5lX1wiICsgY3VyclggKyBcIi1cIiArIGksXG4gICAgICAgICAgICAgICAgICAgIGN1cnJYIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgY3VyclkgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICAgICAgICBmeGksXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yLFxuICAgICAgICAgICAgICAgICAgICByYWRpdXNfdGhpY2tuZXNzXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1cnJYID0gaTtcbiAgICAgICAgICAgIGN1cnJZID0gZnhpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGdyb3VwX2lkO1xufTtcblxudHlwZSBDcmVhdGVHcmFwaEluR3JvdXBGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm5cbiAgICApOiB2b2lkO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVHcmFwaEluR3JvdXA6IENyZWF0ZUdyYXBoSW5Hcm91cEZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgaWQ6IHN0cmluZyxcbiAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGblxuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXgge1xuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvciwgZG90UmFkaXVzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSlcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBjb2xvciwgZG90UmFkaXVzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYpXG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIGFyZ3Muc3BsaWNlKDMsIDAsIHsgXCJpbnRlcnBvbGF0ZWRcIjogZmFsc2UgfSk7XG4gICAgcmV0dXJuIGNyZWF0ZUdyYXBoV2l0aE9wdGlvbnMuYXBwbHkoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIGFyZ3MgYXMgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuUGFyYW1UeXBlc1xuICAgICk7XG59O1xuXG50eXBlIENyZWF0ZUdyYXBoRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgICh0aGlzOiB2b2lkLCBpZDogc3RyaW5nLCBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbik6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVHcmFwaDogQ3JlYXRlR3JhcGhGbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkXG4pOiBHcm91cE5hbWVBbmRJZFByZWZpeCB7XG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvciwgZG90UmFkaXVzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBjb2xvciwgZG90UmFkaXVzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZilcbiAgICB2YXIgb3B0cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgb3B0cy5zcGxpY2UoMCwgMCwgbnVsbCk7XG4gICAgb3B0cy5zcGxpY2UoMywgMCwgeyBcImludGVycG9sYXRlZFwiOiBmYWxzZSB9KTtcbiAgICByZXR1cm4gY3JlYXRlR3JhcGhXaXRoT3B0aW9ucy5hcHBseShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgb3B0cyBhcyBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzXG4gICAgKTtcbn07XG5cbnR5cGUgRHJhd0dyYXBoRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgICh0aGlzOiB2b2lkLCBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbik6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xufTtcbmV4cG9ydCBjb25zdCBkcmF3R3JhcGg6IERyYXdHcmFwaEZuID0gZnVuY3Rpb24gZHJhd0dyYXBoKFxuICAgIHRoaXM6IHZvaWRcbik6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmKVxuICAgIHZhciBvcHRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBvcHRzLnNwbGljZSgwLCAwLCBudWxsKTtcbiAgICBvcHRzLnNwbGljZSgwLCAwLCBudWxsKTtcbiAgICBvcHRzLnNwbGljZSgzLCAwLCB7IFwiaW50ZXJwb2xhdGVkXCI6IGZhbHNlIH0pO1xuICAgIHJldHVybiBjcmVhdGVHcmFwaFdpdGhPcHRpb25zLmFwcGx5KFxuICAgICAgICB0aGlzLFxuICAgICAgICBvcHRzIGFzIENyZWF0ZUdyYXBoV2l0aE9wdGlvbnNGblBhcmFtVHlwZXNcbiAgICApO1xufTtcblxudHlwZSBDcmVhdGVJbnRlcnBvbGF0ZWRHcmFwaEluR3JvdXBGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIHRoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIHRoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGblxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVJbnRlcnBvbGF0ZWRHcmFwaEluR3JvdXA6IENyZWF0ZUludGVycG9sYXRlZEdyYXBoSW5Hcm91cEZuID1cbiAgICBmdW5jdGlvbiAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGblxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAgICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yLCB0aGlja25lc3MpXG4gICAgICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvcilcbiAgICAgICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIGNvbG9yLCB0aGlja25lc3MpXG4gICAgICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIGNvbG9yKVxuICAgICAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmKVxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIGFyZ3Muc3BsaWNlKDMsIDAsIHsgXCJpbnRlcnBvbGF0ZWRcIjogdHJ1ZSB9KTtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUdyYXBoV2l0aE9wdGlvbnMuYXBwbHkoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgYXJncyBhcyBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzXG4gICAgICAgICk7XG4gICAgfTtcblxudHlwZSBDcmVhdGVJbnRlcnBvbGF0ZWRHcmFwaEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICB0aGlja25lc3M6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICB0aGlja25lc3M6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAodGhpczogdm9pZCwgaWQ6IHN0cmluZywgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4pOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlSW50ZXJwb2xhdGVkR3JhcGg6IENyZWF0ZUludGVycG9sYXRlZEdyYXBoRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZFxuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXgge1xuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIHRoaWNrbmVzcylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSlcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgY29sb3IsIHRoaWNrbmVzcylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYpXG4gICAgdmFyIG9wdHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIG9wdHMuc3BsaWNlKDAsIDAsIG51bGwpO1xuICAgIG9wdHMuc3BsaWNlKDMsIDAsIHsgXCJpbnRlcnBvbGF0ZWRcIjogdHJ1ZSB9KTtcbiAgICByZXR1cm4gY3JlYXRlR3JhcGhXaXRoT3B0aW9ucy5hcHBseShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgb3B0cyBhcyBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzXG4gICAgKTtcbiAgICAvLyByZXR1cm4gY3JlYXRlSW50ZXJwb2xhdGVkR3JhcGhJbkdyb3VwLmFwcGx5KHRoaXMsIG9wdHMpO1xufTtcblxudHlwZSBEcmF3SW50ZXJwb2xhdGVkR3JhcGhGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgdGhpY2tuZXNzOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgdGhpY2tuZXNzOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKHRoaXM6IHZvaWQsIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG59O1xuZXhwb3J0IGNvbnN0IGRyYXdJbnRlcnBvbGF0ZWRHcmFwaDogRHJhd0ludGVycG9sYXRlZEdyYXBoRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZFxuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXgge1xuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvciwgdGhpY2tuZXNzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSlcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBjb2xvciwgdGhpY2tuZXNzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYpXG4gICAgdmFyIG9wdHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIG9wdHMuc3BsaWNlKDAsIDAsIG51bGwpO1xuICAgIG9wdHMuc3BsaWNlKDAsIDAsIG51bGwpO1xuICAgIG9wdHMuc3BsaWNlKDMsIDAsIHsgXCJpbnRlcnBvbGF0ZWRcIjogdHJ1ZSB9KTtcbiAgICByZXR1cm4gY3JlYXRlR3JhcGhXaXRoT3B0aW9ucy5hcHBseShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgb3B0cyBhcyBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzXG4gICAgKTtcbn07XG4iXX0=