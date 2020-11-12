"use strict";
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
       let PLAYGROUND_WIDTH = GQG_PLAYGROUND_WIDTH;
       let PLAYGROUND_HEIGHT = GQG_PLAYGROUND_HEIGHT;
       const ANIMATION_HORIZONTAL = $.gQ.ANIMATION_HORIZONTAL;
       const ANIMATION_VERTICAL = $.gQ.ANIMATION_VERTICAL;
       const ANIMATION_ONCE = $.gQ.ANIMATION_ONCE;
       const ANIMATION_PINGPONG = $.gQ.ANIMATION_PINGPONG;
       const ANIMATION_CALLBACK = $.gQ.ANIMATION_CALLBACK;
       const ANIMATION_MULTI = $.gQ.ANIMATION_MULTI;
const GQG_MIN_SAFE_PLAYGROUND_INTEGER = -(Math.pow(2, 24) - 1);
const GQG_MAX_SAFE_PLAYGROUND_INTEGER = (Math.pow(2, 24) - 1);
const GQG_getUniqueId = () => {
    return Date.now() + "_" + GQG_UNIQUE_ID_COUNTER++;
};
       const setGqPlaygroundDimensions = (width, height) => {
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
    console.log(...txt);
};
const GQG_IN_MYPROGRAM_MSG = 'in "myprogram.ts"- ';
const GQG_ERROR_IN_MYPROGRAM_MSG = "Error " + GQG_IN_MYPROGRAM_MSG;
const GQG_WARNING_IN_MYPROGRAM_MSG = 'Warning ' + GQG_IN_MYPROGRAM_MSG;
const printErrorToConsoleOnce = (() => {
    var throwConsoleError_printed = {};
    return (msg) => {
        if (!throwConsoleError_printed[msg]) {
            console.error("Error: " + msg);
            throwConsoleError_printed[msg] = true;
        }
    };
})();
const throwConsoleErrorInMyprogram = (msg) => {
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
                }
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
        else if (arguments.length === 2) {
            if (typeof arguments[1] !== "object") {
                throwConsoleErrorInMyprogram("Second argument for createGroupInPlayground expected to be a dictionary. Instead found: " + arguments[1]);
            }
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
    else if (arguments.length === 2) {
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
            }
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
    else if (arguments.length === 3) {
        $("#" + groupName).addSprite(spriteName, arguments[2]);
    }
};
       const createTextSpriteInGroup = function (groupName, spriteName, theWidth, theHeight, thePosx, thePosy) {
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
        $("#" + spriteName).css("background-color", "white")
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
        $("#" + spriteName).css("background-color", "white");
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
    return (spriteName == $("#" + spriteName).attr("id"));
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
       const when2SpritesHit = forEachSpriteSpriteCollisionDo;
       const forEachSpriteGroupCollisionDo = (sprite1Name, groupName, collisionHandlingFunction) => {
    $("#" + sprite1Name).collision("#" + groupName + ", .gQ_sprite").each(collisionHandlingFunction);
};
       const forEachSpriteGroupHit = forEachSpriteGroupCollisionDo;
       const forEachSpriteFilteredCollisionDo = (sprite1Name, filterStr, collisionHandlingFunction) => {
    $("#" + sprite1Name).collision(filterStr).each(collisionHandlingFunction);
};
       const forEachSpriteFilteredHit = forEachSpriteFilteredCollisionDo;
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
    var percentMargin = 1.1;
    var dir = {
        "left": false,
        "right": false,
        "up": false,
        "down": false
    };
    var s1left = sprite1Info["xPos"];
    var s1right = s1left + sprite1Info["width"];
    var s2left = sprite2Info["xPos"];
    var s2right = s2left + sprite2Info["width"];
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
    var s1top = sprite1Info["yPos"];
    var s1bottom = s1top + sprite1Info["height"];
    var s2top = sprite2Info["yPos"];
    var s2bottom = s2top + sprite2Info["height"];
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
    $("#playground").on("contextmenu", function () {
        return false;
    });
};
       const enableContextMenu = () => {
    $("#playground").off("contextmenu");
};
       const hideMouseCursor = () => {
    $("#playground").css("cursor", "none");
};
       const showMouseCursor = () => {
    $("#playground").css("cursor", "default");
};
       const saveDictionaryAs = (saveAs, dictionary) => {
    Cookies.set("GQG_" + saveAs, dictionary);
};
       const getSavedDictionary = (savedAs) => {
    return Cookies.getJSON("GQG_" + savedAs);
};
       const deleteSavedDictionary = (savedAs) => {
    Cookies.remove("GQG_" + savedAs);
};
       const createOvalInGroup = (groupName, id, x, y, w, h, color, rotdeg, rotOriginX, rotOriginY) => {
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
    var args = Array.prototype.slice.call(arguments);
    args.splice(3, 0, { "interpolated": false });
    return createGraphWithOptions.apply(this, args);
};
       const createGraph = function () {
    var opts = Array.prototype.slice.call(arguments);
    opts.splice(0, 0, null);
    opts.splice(3, 0, { "interpolated": false });
    return createGraphWithOptions.apply(this, opts);
};
       const drawGraph = function drawGraph() {
    var opts = Array.prototype.slice.call(arguments);
    opts.splice(0, 0, null);
    opts.splice(0, 0, null);
    opts.splice(3, 0, { "interpolated": false });
    return createGraphWithOptions.apply(this, opts);
};
       const createInterpolatedGraphInGroup = function (groupName, id, f) {
    var args = Array.prototype.slice.call(arguments);
    args.splice(3, 0, { "interpolated": true });
    return createGraphWithOptions.apply(this, args);
};
       const createInterpolatedGraph = function () {
    var opts = Array.prototype.slice.call(arguments);
    opts.splice(0, 0, null);
    opts.splice(3, 0, { "interpolated": true });
    return createGraphWithOptions.apply(this, opts);
};
       const drawInterpolatedGraph = function () {
    var opts = Array.prototype.slice.call(arguments);
    opts.splice(0, 0, null);
    opts.splice(0, 0, null);
    opts.splice(3, 0, { "interpolated": true });
    return createGraphWithOptions.apply(this, opts);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3FnLW1vZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9jaGVuZy9EZXNrdG9wL1RTLWRldi9mdW4tdHNkLWxpYi5naXRyZXBvL2xpYi1ncWd1YXJkcmFpbC9zcmMvZ3FnLW1vZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUErQmIsSUFBSSxTQUFTLEdBQVksSUFBSSxDQUFDO0FBQzlCLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxDQUFDLEtBQWMsRUFBUSxFQUFFO0lBQ25ELElBQUksS0FBSyxFQUFFO1FBQ1AsU0FBUyxHQUFHLElBQUksQ0FBQztLQUNwQjtTQUFNO1FBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsR0FBRyxrRUFBa0UsQ0FBQyxDQUFDO1FBQy9HLFNBQVMsR0FBRyxLQUFLLENBQUM7S0FDckI7QUFDTCxDQUFDLENBQUM7QUFFRixNQUFNLGtDQUFrQyxHQUFHLDZCQUE2QixDQUFDO0FBQ3pFLE1BQU0sQ0FBQyxNQUFNLDRCQUE0QixHQUFHLENBQ3hDLGlCQUFrQyxFQUMzQixFQUFFO0lBQ1QsSUFBSSxPQUFPLGlCQUFpQixLQUFLLFFBQVE7UUFDckMsT0FBTyxpQkFBaUIsS0FBSyxRQUFRLEVBQUU7UUFDdkMsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFDRCxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNqRCxJQUFJLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUM5RSxXQUFXLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDL0MsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUMxQixPQUFPLEtBQUssQ0FBQztLQUNoQjtJQUVELE9BQU8sQ0FBQyxpQkFBaUIsS0FBSyxXQUFXLENBQUMsQ0FBQyxD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QU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM1QyxPQUFPLHNCQUFzQixDQUFDLEtBQUssQ0FDL0IsSUFBSSxFQUNKLElBQTBDLENBQzdDLENBQUM7QUFDTixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbi8qXG4gKiBDb3B5cmlnaHQgMjAxMiwgMjAxNiwgMjAxNywgMjAxOSwgMjAyMCBDYXJzb24gQ2hlbmdcbiAqIFRoaXMgU291cmNlIENvZGUgRm9ybSBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBvZiB0aGUgTW96aWxsYSBQdWJsaWNcbiAqIExpY2Vuc2UsIHYuIDIuMC4gSWYgYSBjb3B5IG9mIHRoZSBNUEwgd2FzIG5vdCBkaXN0cmlidXRlZCB3aXRoIHRoaXNcbiAqIGZpbGUsIFlvdSBjYW4gb2J0YWluIG9uZSBhdCBodHRwczovL21vemlsbGEub3JnL01QTC8yLjAvLlxuICovXG4vKlxuICogR1FHdWFyZHJhaWwgdjAuOC4wIGlzIGEgd3JhcHBlciBhcm91bmQgZ2FtZVF1ZXJ5IHJldi4gMC43LjEuXG4gKiBNYWtlcyB0aGluZ3MgbW9yZSBwcm9jZWR1cmFsLCB3aXRoIGEgYml0IG9mIGZ1bmN0aW9uYWwuXG4gKiBBZGRzIGluIGhlbHBmdWwgZXJyb3IgbWVzc2FnZXMgZm9yIHN0dWRlbnRzLlxuICogbG9hZCB0aGlzIGFmdGVyIGdhbWVRdWVyeS5cbiAqL1xuXG5leHBvcnQgdHlwZSBzcHJpdGVEb21PYmplY3QgPSB7XG4gICAgd2lkdGg6IChuOiBudW1iZXIpID0+IHNwcml0ZURvbU9iamVjdDtcbiAgICBoZWlnaHQ6IChuOiBudW1iZXIpID0+IHNwcml0ZURvbU9iamVjdDtcbiAgICBzZXRBbmltYXRpb246IChvPzogb2JqZWN0LCBmPzogRnVuY3Rpb24pID0+IGFueTtcbiAgICBjc3M6IChhdHRyOiBzdHJpbmcsIHZhbDogc3RyaW5nIHwgbnVtYmVyKSA9PiBzcHJpdGVEb21PYmplY3Q7XG4gICAgcGxheWdyb3VuZDogKG86IG9iamVjdCkgPT4gYW55O1xuICAgIGh0bWw6IChodG1sVGV4dDogc3RyaW5nKSA9PiBzcHJpdGVEb21PYmplY3Q7XG4gICAgdGV4dDogKHRleHQ6IHN0cmluZykgPT4gc3ByaXRlRG9tT2JqZWN0O1xufTtcbmRlY2xhcmUgdmFyICQ6IGFueTtcbmRlY2xhcmUgdmFyIENvb2tpZXM6IHtcbiAgICBzZXQ6IChhcmcwOiBzdHJpbmcsIGFyZzE6IG9iamVjdCkgPT4gdm9pZDtcbiAgICBnZXRKU09OOiAoYXJnMDogc3RyaW5nKSA9PiBvYmplY3Q7XG4gICAgcmVtb3ZlOiAoYXJnMDogc3RyaW5nKSA9PiB2b2lkO1xufTtcblxuLy8gc3R1ZGVudHMgYXJlIG5vdCBzdXBwb3NlZCB0byB1c2UgR1FHXyB2YXJpYWJsZXNcbmxldCBHUUdfREVCVUc6IGJvb2xlYW4gPSB0cnVlO1xuZXhwb3J0IGNvbnN0IHNldEdxRGVidWdGbGFnID0gKGRlYnVnOiBib29sZWFuKTogdm9pZCA9PiB7XG4gICAgaWYgKGRlYnVnKSB7XG4gICAgICAgIEdRR19ERUJVRyA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coR1FHX1dBUk5JTkdfSU5fTVlQUk9HUkFNX01TRyArIFwiZGVidWcgbW9kZSBkaXNhYmxlZCBhbmQgeW91ciBjb2RlIGlzIG5vdyBydW5uaW5nIGluIHVuc2FmZSBtb2RlLlwiKTtcbiAgICAgICAgR1FHX0RFQlVHID0gZmFsc2U7XG4gICAgfVxufTtcblxuY29uc3QgR1FHX1NQUklURV9HUk9VUF9OQU1FX0ZPUk1BVF9SRUdFWCA9IC9bYS16QS1aMC05X10rW2EtekEtWjAtOV8tXSovO1xuZXhwb3J0IGNvbnN0IHNwcml0ZUdyb3VwTmFtZUZvcm1hdElzVmFsaWQgPSAoXG4gICAgc3ByaXRlT3JHcm91cE5hbWU6IHN0cmluZyB8IG51bWJlclxuKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKHR5cGVvZiBzcHJpdGVPckdyb3VwTmFtZSAhPT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICB0eXBlb2Ygc3ByaXRlT3JHcm91cE5hbWUgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBzcHJpdGVPckdyb3VwTmFtZSA9IHNwcml0ZU9yR3JvdXBOYW1lLnRvU3RyaW5nKCk7XG4gICAgbGV0IG5hbWVNYXRjaGVzID0gc3ByaXRlT3JHcm91cE5hbWUubWF0Y2goR1FHX1NQUklURV9HUk9VUF9OQU1FX0ZPUk1BVF9SRUdFWCk7XG4gICAgbmFtZU1hdGNoZXMgPSAobmFtZU1hdGNoZXMgPyBuYW1lTWF0Y2hlcyA6IFtdKTtcbiAgICBpZiAobmFtZU1hdGNoZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gKHNwcml0ZU9yR3JvdXBOYW1lID09PSBuYW1lTWF0Y2hlc1swXSk7XG59O1xuXG5jb25zdCBHUUdfU0lHTkFMUzogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gPSB7fTtcbmxldCBHUUdfVU5JUVVFX0lEX0NPVU5URVIgPSAwO1xuXG5sZXQgR1FHX1BMQVlHUk9VTkRfV0lEVEggPSA2NDA7XG5sZXQgR1FHX1BMQVlHUk9VTkRfSEVJR0hUID0gNDgwO1xuZXhwb3J0IGxldCBQTEFZR1JPVU5EX1dJRFRIID0gR1FHX1BMQVlHUk9VTkRfV0lEVEg7IC8vIHN0dWRlbnRzIGFyZSBub3Qgc3VwcG9zZWQgdG8gdXNlIEdRR18gdmFyaWFibGVzXG5leHBvcnQgbGV0IFBMQVlHUk9VTkRfSEVJR0hUID0gR1FHX1BMQVlHUk9VTkRfSEVJR0hUO1xuXG5leHBvcnQgY29uc3QgQU5JTUFUSU9OX0hPUklaT05UQUw6IG51bWJlciA9ICQuZ1EuQU5JTUFUSU9OX0hPUklaT05UQUw7XG5leHBvcnQgY29uc3QgQU5JTUFUSU9OX1ZFUlRJQ0FMOiBudW1iZXIgPSAkLmdRLkFOSU1BVElPTl9WRVJUSUNBTDtcbmV4cG9ydCBjb25zdCBBTklNQVRJT05fT05DRTogbnVtYmVyID0gJC5nUS5BTklNQVRJT05fT05DRTtcbmV4cG9ydCBjb25zdCBBTklNQVRJT05fUElOR1BPTkc6IG51bWJlciA9ICQuZ1EuQU5JTUFUSU9OX1BJTkdQT05HO1xuZXhwb3J0IGNvbnN0IEFOSU1BVElPTl9DQUxMQkFDSzogbnVtYmVyID0gJC5nUS5BTklNQVRJT05fQ0FMTEJBQ0s7XG5leHBvcnQgY29uc3QgQU5JTUFUSU9OX01VTFRJOiBudW1iZXIgPSAkLmdRLkFOSU1BVElPTl9NVUxUSTtcblxuXG4vLyBNYXgvTWluIFNhZmUgUGxheWdyb3VuZCBJbnRlZ2VycyBmb3VuZCBieSBleHBlcmltZW50aW5nIHdpdGggR1EgMC43LjEgaW4gRmlyZWZveCA0MS4wLjIgb24gTWFjIE9TIFggMTAuMTAuNVxuY29uc3QgR1FHX01JTl9TQUZFX1BMQVlHUk9VTkRfSU5URUdFUiA9IC0oTWF0aC5wb3coMiwgMjQpIC0gMSk7IC8vIGNmLiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9OdW1iZXIvTUlOX1NBRkVfSU5URUdFUlxuY29uc3QgR1FHX01BWF9TQUZFX1BMQVlHUk9VTkRfSU5URUdFUiA9IChNYXRoLnBvdygyLCAyNCkgLSAxKTsgLy8gY2YuIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL051bWJlci9NQVhfU0FGRV9JTlRFR0VSXG5cblxuY29uc3QgR1FHX2dldFVuaXF1ZUlkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIERhdGUubm93KCkgKyBcIl9cIiArIEdRR19VTklRVUVfSURfQ09VTlRFUisrO1xufTtcblxuZXhwb3J0IGNvbnN0IHNldEdxUGxheWdyb3VuZERpbWVuc2lvbnMgPSAoXG4gICAgd2lkdGg6IG51bWJlcixcbiAgICBoZWlnaHQ6IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgLy8gdGhpcyBtdXN0IGJlIGV4ZWN1dGVkIG91dHNpZGUgb2Ygc2V0dXAgYW5kIGRyYXcgZnVuY3Rpb25zXG4gICAgR1FHX1BMQVlHUk9VTkRfSEVJR0hUID0gaGVpZ2h0O1xuICAgIFBMQVlHUk9VTkRfSEVJR0hUID0gaGVpZ2h0O1xuICAgIEdRR19QTEFZR1JPVU5EX1dJRFRIID0gd2lkdGg7XG4gICAgUExBWUdST1VORF9XSURUSCA9IHdpZHRoO1xuICAgIHNwcml0ZShcInBsYXlncm91bmRcIikud2lkdGgod2lkdGgpLmhlaWdodChoZWlnaHQpO1xufTtcblxuZXhwb3J0IGNvbnN0IGN1cnJlbnREYXRlID0gKCk6IG51bWJlciA9PiB7XG4gICAgcmV0dXJuIERhdGUubm93KCk7XG59O1xuXG5leHBvcnQgY29uc3QgY29uc29sZVByaW50ID0gKC4uLnR4dDogYW55KTogdm9pZCA9PiB7XG4gICAgLy8gbWlnaHQgd29yayBvbmx5IGluIENocm9tZSBvciBpZiBzb21lIGRldmVsb3BtZW50IGFkZC1vbnMgYXJlIGluc3RhbGxlZFxuICAgIGNvbnNvbGUubG9nKC4uLnR4dCk7XG59O1xuXG5cbmNvbnN0IEdRR19JTl9NWVBST0dSQU1fTVNHID0gJ2luIFwibXlwcm9ncmFtLnRzXCItICc7XG5jb25zdCBHUUdfRVJST1JfSU5fTVlQUk9HUkFNX01TRyA9IFwiRXJyb3IgXCIgKyBHUUdfSU5fTVlQUk9HUkFNX01TRztcbmNvbnN0IEdRR19XQVJOSU5HX0lOX01ZUFJPR1JBTV9NU0cgPSAnV2FybmluZyAnICsgR1FHX0lOX01ZUFJPR1JBTV9NU0c7XG5cbmNvbnN0IHByaW50RXJyb3JUb0NvbnNvbGVPbmNlID0gKCgpID0+IHtcbiAgICB2YXIgdGhyb3dDb25zb2xlRXJyb3JfcHJpbnRlZDogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gPSB7fTtcbiAgICByZXR1cm4gKG1zZzogc3RyaW5nKSA9PiB7XG4gICAgICAgIC8vIEZpcmVmb3ggd291bGRuJ3QgcHJpbnQgdW5jYXVnaHQgZXhjZXB0aW9ucyB3aXRoIGZpbGUgbmFtZS9saW5lIG51bWJlclxuICAgICAgICAvLyBidXQgYWRkaW5nIFwibmV3IEVycm9yKClcIiB0byB0aGUgdGhyb3cgYmVsb3cgZml4ZWQgaXQuLi5cbiAgICAgICAgaWYgKCF0aHJvd0NvbnNvbGVFcnJvcl9wcmludGVkW21zZ10pIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjogXCIgKyBtc2cpO1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JfcHJpbnRlZFttc2ddID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuY29uc3QgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbSA9IChtc2c6IHN0cmluZyk6IG5ldmVyID0+IHtcbiAgICAvLyBGaXJlZm94IHdvdWxkbid0IHByaW50IHVuY2F1Z2h0IGV4Y2VwdGlvbnMgd2l0aCBmaWxlIG5hbWUvbGluZSBudW1iZXJcbiAgICAvLyBidXQgYWRkaW5nIFwibmV3IEVycm9yKClcIiB0byB0aGUgdGhyb3cgYmVsb3cgZml4ZWQgaXQuLi5cbiAgICB0aHJvdyBuZXcgRXJyb3IoR1FHX0lOX01ZUFJPR1JBTV9NU0cgKyBtc2cpO1xufTtcblxuY29uc3QgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIGlmICh0eXBlb2Ygc3ByaXRlTmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU3ByaXRlIG5hbWUgbXVzdCBiZSBhIFN0cmluZywgbm90OiBcIiArIHNwcml0ZU5hbWUpO1xuICAgIH0gZWxzZSBpZiAoIXNwcml0ZUV4aXN0cyhzcHJpdGVOYW1lKSkge1xuICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU3ByaXRlIGRvZXNuJ3QgZXhpc3Q6IFwiICsgc3ByaXRlTmFtZSk7XG4gICAgfVxufTtcbk51bWJlci5pc0Zpbml0ZSA9IE51bWJlci5pc0Zpbml0ZSB8fCBmdW5jdGlvbiAodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICAgIC8vIHNlZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTnVtYmVyL2lzRmluaXRlXG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUodmFsdWUpO1xufTtcbmNvbnN0IHRocm93SWZOb3RGaW5pdGVOdW1iZXIgPSAobXNnOiBzdHJpbmcsIHZhbDogYW55KTogdm9pZCA9PiB7IC8vIGUuZy4gdGhyb3cgaWYgTmFOLCBJbmZpbml0eSwgbnVsbFxuICAgIGlmICghTnVtYmVyLmlzRmluaXRlKHZhbCkpIHtcbiAgICAgICAgbXNnID0gbXNnIHx8IFwiRXhwZWN0ZWQgYSBudW1iZXIuXCI7XG4gICAgICAgIG1zZyArPSBcIiBZb3UgdXNlZFwiO1xuICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgbXNnICs9IFwiIHRoZSBTdHJpbmc6IFxcXCJcIiArIHZhbCArIFwiXFxcIlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbXNnICs9IFwiOiBcIiArIHZhbDtcbiAgICAgICAgfVxuICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKG1zZyk7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHRocm93T25JbWdMb2FkRXJyb3IgPSAoaW1nVXJsOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAvLyB3aGF0IHRoaXMgZnVuY3Rpb24gdGhyb3dzIG11c3Qgbm90IGJlIGNhdWdodCBieSBjYWxsZXIgdGhvLi4uXG4gICAgaWYgKGltZ1VybC5zdWJzdHJpbmcoaW1nVXJsLmxlbmd0aCAtIFwiLmdpZlwiLmxlbmd0aCkudG9Mb3dlckNhc2UoKSA9PT0gXCIuZ2lmXCIpIHtcbiAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcImltYWdlIGZpbGUgZm9ybWF0IG5vdCBzdXBwb3J0ZWQ6IEdJRlwiKTtcbiAgICB9XG4gICAgbGV0IHRocm93YWJsZUVyciA9IG5ldyBFcnJvcihcImltYWdlIGZpbGUgbm90IGZvdW5kOiBcIiArIGltZ1VybCk7XG4gICAgJChcIjxpbWcvPlwiKS5vbihcImVycm9yXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCEhdGhyb3dhYmxlRXJyICYmIHRocm93YWJsZUVyci5zdGFjayAmJlxuICAgICAgICAgICAgdGhyb3dhYmxlRXJyLnN0YWNrLnRvU3RyaW5nKCkuaW5kZXhPZihcIm15cHJvZ3JhbS5qc1wiKSA+PSAwKSB7XG4gICAgICAgICAgICB0aHJvd2FibGVFcnIubWVzc2FnZSA9IEdRR19FUlJPUl9JTl9NWVBST0dSQU1fTVNHICsgdGhyb3dhYmxlRXJyLm1lc3NhZ2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgdGhyb3dhYmxlRXJyO1xuICAgIH0pLmF0dHIoXCJzcmNcIiwgaW1nVXJsKTtcbn07XG5cblxuXG50eXBlIE5ld0dRQW5pbWF0aW9uRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICB1cmxPck1hcDogc3RyaW5nLFxuICAgICAgICBudW1iZXJPZkZyYW1lOiBudW1iZXIsXG4gICAgICAgIGRlbHRhOiBudW1iZXIsXG4gICAgICAgIHJhdGU6IG51bWJlcixcbiAgICAgICAgdHlwZTogbnVtYmVyXG4gICAgKTogU3ByaXRlQW5pbWF0aW9uO1xuICAgICh0aGlzOiB2b2lkLCB1cmxPck1hcDogc3RyaW5nKTogU3ByaXRlQW5pbWF0aW9uO1xuICAgICh0aGlzOiB2b2lkLCB1cmxPck1hcDogb2JqZWN0KTogU3ByaXRlQW5pbWF0aW9uO1xufTtcbmV4cG9ydCBjb25zdCBuZXdHUUFuaW1hdGlvbjogTmV3R1FBbmltYXRpb25GbiA9ICgoKSA9PiB7XG4gICAgbGV0IG1lbW9BbmltczogTWFwPHN0cmluZyB8IG9iamVjdCwgU3ByaXRlQW5pbWF0aW9uPiA9IG5ldyBNYXA8b2JqZWN0LCBTcHJpdGVBbmltYXRpb24+KCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgdXJsT3JNYXA6IHN0cmluZyB8IG9iamVjdCxcbiAgICAgICAgbnVtYmVyT2ZGcmFtZT86IG51bWJlcixcbiAgICAgICAgZGVsdGE/OiBudW1iZXIsXG4gICAgICAgIHJhdGU/OiBudW1iZXIsXG4gICAgICAgIHR5cGU/OiBudW1iZXJcbiAgICApOiBTcHJpdGVBbmltYXRpb24ge1xuICAgICAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHVybE9yTWFwKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiRmlyc3QgYXJndW1lbnQgZm9yIG5ld0dRQW5pbWF0aW9uIG11c3QgYmUgYSBTdHJpbmcuIEluc3RlYWQgZm91bmQ6IFwiICsgdXJsT3JNYXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHVybE9yTWFwID09PSBcInN0cmluZ1wiKSB0aHJvd09uSW1nTG9hZEVycm9yKHVybE9yTWFwKTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiTnVtYmVyIG9mIGZyYW1lIGFyZ3VtZW50IGZvciBuZXdHUUFuaW1hdGlvbiBtdXN0IGJlIG51bWVyaWMuIFwiLCBudW1iZXJPZkZyYW1lKTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiRGVsdGEgYXJndW1lbnQgZm9yIG5ld0dRQW5pbWF0aW9uIG11c3QgYmUgbnVtZXJpYy4gXCIsIGRlbHRhKTtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiUmF0ZSBhcmd1bWVudCBmb3IgbmV3R1FBbmltYXRpb24gbXVzdCBiZSBudW1lcmljLiBcIiwgcmF0ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgIT0gbnVsbCAmJiAodHlwZSAmIEFOSU1BVElPTl9WRVJUSUNBTCkgJiYgKHR5cGUgJiBBTklNQVRJT05fSE9SSVpPTlRBTCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlR5cGUgYXJndW1lbnQgZm9yIG5ld0dRQW5pbWF0aW9uIGNhbm5vdCBiZSBib3RoIEFOSU1BVElPTl9WRVJUSUNBTCBhbmQgQU5JTUFUSU9OX0hPUklaT05UQUwgLSB1c2Ugb25lIG9yIHRoZSBvdGhlciBidXQgbm90IGJvdGghXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSAhPSBudWxsICYmICEodHlwZSAmIEFOSU1BVElPTl9WRVJUSUNBTCkgJiYgISh0eXBlICYgQU5JTUFUSU9OX0hPUklaT05UQUwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJUeXBlIGFyZ3VtZW50IGZvciBuZXdHUUFuaW1hdGlvbiBpcyBtaXNzaW5nIGJvdGggQU5JTUFUSU9OX1ZFUlRJQ0FMIGFuZCBBTklNQVRJT05fSE9SSVpPTlRBTCAtIG11c3QgdXNlIG9uZSBvciB0aGUgb3RoZXIhXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHVybE9yTWFwKSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvd09uSW1nTG9hZEVycm9yKHVybE9yTWFwKTtcbiAgICAgICAgICAgICAgICB9IC8vIGVsc2UgaG9wZSBpdCdzIGEgcHJvcGVyIG9wdGlvbnMgbWFwIHRvIHBhc3Mgb24gdG8gR2FtZVF1ZXJ5IGRpcmVjdGx5XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIHVzZWQgZm9yIG5ld0dRQW5pbWF0aW9uLiBDaGVjayBBUEkgZG9jdW1lbnRhdGlvbiBmb3IgZGV0YWlscyBvZiBwYXJhbWV0ZXJzLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDUpIHtcbiAgICAgICAgICAgIGxldCBrZXkgPSBbdXJsT3JNYXAsIG51bWJlck9mRnJhbWUsIGRlbHRhLCByYXRlLCB0eXBlXTtcbiAgICAgICAgICAgIGxldCBtdWx0aWZyYW1lQW5pbTogU3ByaXRlQW5pbWF0aW9uIHwgdW5kZWZpbmVkID0gbWVtb0FuaW1zLmdldChrZXkpO1xuICAgICAgICAgICAgaWYgKG11bHRpZnJhbWVBbmltICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbXVsdGlmcmFtZUFuaW07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBtdWx0aWZyYW1lQW5pbTogU3ByaXRlQW5pbWF0aW9uID0gbmV3ICQuZ1EuQW5pbWF0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VVUkw6IHVybE9yTWFwLFxuICAgICAgICAgICAgICAgICAgICBudW1iZXJPZkZyYW1lOiBudW1iZXJPZkZyYW1lLFxuICAgICAgICAgICAgICAgICAgICBkZWx0YTogZGVsdGEsXG4gICAgICAgICAgICAgICAgICAgIHJhdGU6IHJhdGUsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IHR5cGVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBtZW1vQW5pbXMuc2V0KGtleSwgbXVsdGlmcmFtZUFuaW0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBtdWx0aWZyYW1lQW5pbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBsZXQgc2luZ2xlZnJhbWVBbmltOiBTcHJpdGVBbmltYXRpb24gfCB1bmRlZmluZWQgPSBtZW1vQW5pbXMuZ2V0KHVybE9yTWFwKTtcbiAgICAgICAgICAgIGlmIChzaW5nbGVmcmFtZUFuaW0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzaW5nbGVmcmFtZUFuaW07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBzaW5nbGVmcmFtZUFuaW06IFNwcml0ZUFuaW1hdGlvbjtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mICh1cmxPck1hcCkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2luZ2xlZnJhbWVBbmltID0gbmV3ICQuZ1EuQW5pbWF0aW9uKHsgaW1hZ2VVUkw6IHVybE9yTWFwIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNpbmdsZWZyYW1lQW5pbSA9IG5ldyAkLmdRLkFuaW1hdGlvbih1cmxPck1hcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1lbW9Bbmltcy5zZXQodXJsT3JNYXAsIHNpbmdsZWZyYW1lQW5pbSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpbmdsZWZyYW1lQW5pbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIHVzZWQgZm9yIG5ld0dRQW5pbWF0aW9uLiBDaGVjayBBUEkgZG9jdW1lbnRhdGlvbiBmb3IgZGV0YWlscyBvZiBwYXJhbWV0ZXJzLlwiKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgJC5nUS5BbmltYXRpb24oeyBpbWFnZVVSTDogXCJcIiB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG50eXBlIENyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3g6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeTogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAodGhpczogdm9pZCwgZ3JvdXBOYW1lOiBzdHJpbmcsIHRoZVdpZHRoOiBudW1iZXIsIHRoZUhlaWdodDogbnVtYmVyKTogdm9pZDtcbiAgICAodGhpczogdm9pZCwgZ3JvdXBOYW1lOiBzdHJpbmcpOiB2b2lkO1xuICAgICh0aGlzOiB2b2lkLCBncm91cE5hbWU6IHN0cmluZywgb3B0TWFwOiBvYmplY3QpOiB2b2lkO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVHcm91cEluUGxheWdyb3VuZDogQ3JlYXRlR3JvdXBJblBsYXlncm91bmRGbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgIHRoZVdpZHRoPzogbnVtYmVyIHwgb2JqZWN0LFxuICAgIHRoZUhlaWdodD86IG51bWJlcixcbiAgICB0aGVQb3N4PzogbnVtYmVyLFxuICAgIHRoZVBvc3k/OiBudW1iZXJcbik6IHZvaWQge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiAoZ3JvdXBOYW1lKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIkZpcnN0IGFyZ3VtZW50IGZvciBjcmVhdGVHcm91cEluUGxheWdyb3VuZCBtdXN0IGJlIGEgU3RyaW5nLiBJbnN0ZWFkIGZvdW5kOiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzcHJpdGVHcm91cE5hbWVGb3JtYXRJc1ZhbGlkKGdyb3VwTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJHcm91cCBuYW1lIGdpdmVuIHRvIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIGlzIGluIHdyb25nIGZvcm1hdDogXCIgKyBncm91cE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzcHJpdGVFeGlzdHMoZ3JvdXBOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcImNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIGNhbm5vdCBjcmVhdGUgZHVwbGljYXRlIGdyb3VwIHdpdGggbmFtZTogXCIgKyBncm91cE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlV2lkdGgpO1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkhlaWdodCBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlSGVpZ2h0KTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA1KSB7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiV2lkdGggYXJndW1lbnQgZm9yIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZVdpZHRoKTtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJIZWlnaHQgYXJndW1lbnQgZm9yIGNyZWF0ZUdyb3VwSW5QbGF5Z3JvdW5kIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZUhlaWdodCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWCBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlUG9zeCk7XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWSBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlUG9zeSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgeyAvLyB0cmVhdHMgYXJndW1lbnRzWzFdIGFzIGEgc3RhbmRhcmQgb3B0aW9ucyBtYXBcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzFdICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlNlY29uZCBhcmd1bWVudCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQgZXhwZWN0ZWQgdG8gYmUgYSBkaWN0aW9uYXJ5LiBJbnN0ZWFkIGZvdW5kOiBcIiArIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgICAgICB9IC8vIGVsc2UgaG9wZSBpdCdzIGEgcHJvcGVyIHN0YW5kYXJkIG9wdGlvbnMgbWFwXG4gICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIldyb25nIG51bWJlciBvZiBhcmd1bWVudHMgdXNlZCBmb3IgY3JlYXRlR3JvdXBJblBsYXlncm91bmQuIENoZWNrIEFQSSBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzIG9mIHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgJC5wbGF5Z3JvdW5kKCkuYWRkR3JvdXAoXG4gICAgICAgICAgICBncm91cE5hbWUsXG4gICAgICAgICAgICB7IHdpZHRoOiAkLnBsYXlncm91bmQoKS53aWR0aCgpLCBoZWlnaHQ6ICQucGxheWdyb3VuZCgpLmhlaWdodCgpIH1cbiAgICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGVXaWR0aCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcInRoZVdpZHRoIG11c3QgYmUgYSBudW1iZXIgYnV0IGluc3RlYWQgZ290OiBcIiArIHRoZVdpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRHcm91cChncm91cE5hbWUsIHsgd2lkdGg6IHRoZVdpZHRoLCBoZWlnaHQ6IHRoZUhlaWdodCB9KTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGVXaWR0aCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcInRoZVdpZHRoIG11c3QgYmUgYSBudW1iZXIgYnV0IGluc3RlYWQgZ290OiBcIiArIHRoZVdpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRHcm91cChcbiAgICAgICAgICAgIGdyb3VwTmFtZSxcbiAgICAgICAgICAgIHsgd2lkdGg6IHRoZVdpZHRoLCBoZWlnaHQ6IHRoZUhlaWdodCwgcG9zeDogdGhlUG9zeCwgcG9zeTogdGhlUG9zeSB9XG4gICAgICAgICk7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7IC8vIHRyZWF0cyBhcmd1bWVudHNbMV0gYXMgYSBzdGFuZGFyZCBvcHRpb25zIG1hcFxuICAgICAgICBpZiAodHlwZW9mIHRoZVdpZHRoICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU2Vjb25kIGFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXIgYnV0IGluc3RlYWQgZ290OiBcIiArIHRoZVdpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICAkLnBsYXlncm91bmQoKS5hZGRHcm91cChncm91cE5hbWUsIGFyZ3VtZW50c1sxXSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHR5cGUgU3ByaXRlQW5pbWF0aW9uID0geyBpbWFnZVVSTDogc3RyaW5nIH07XG50eXBlIENyZWF0ZVNwcml0ZUluR3JvdXBGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHRoZUFuaW1hdGlvbjogU3ByaXRlQW5pbWF0aW9uLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeDogbnVtYmVyLFxuICAgICAgICB0aGVQb3N5OiBudW1iZXJcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlQW5pbWF0aW9uOiBTcHJpdGVBbmltYXRpb24sXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIG9wdGlvbnNNYXA6IG9iamVjdFxuICAgICk6IHZvaWQ7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVNwcml0ZUluR3JvdXA6IENyZWF0ZVNwcml0ZUluR3JvdXBGbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICB0aGVBbmltYXRpb246IFNwcml0ZUFuaW1hdGlvbiB8IG9iamVjdCxcbiAgICB0aGVXaWR0aD86IG51bWJlcixcbiAgICB0aGVIZWlnaHQ/OiBudW1iZXIsXG4gICAgdGhlUG9zeD86IG51bWJlcixcbiAgICB0aGVQb3N5PzogbnVtYmVyXG4pOiB2b2lkIHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIGlmICh0eXBlb2YgKGdyb3VwTmFtZSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJGaXJzdCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIGEgU3RyaW5nLiBJbnN0ZWFkIGZvdW5kOiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzcHJpdGVFeGlzdHMoZ3JvdXBOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcImNyZWF0ZVNwcml0ZUluR3JvdXAgY2Fubm90IGZpbmQgZ3JvdXAgKGRvZXNuJ3QgZXhpc3Q/KTogXCIgKyBncm91cE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiAoc3ByaXRlTmFtZSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTZWNvbmQgYXJndW1lbnQgZm9yIGNyZWF0ZVNwcml0ZUluR3JvdXAgbXVzdCBiZSBhIFN0cmluZy4gSW5zdGVhZCBmb3VuZDogXCIgKyBzcHJpdGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNwcml0ZUdyb3VwTmFtZUZvcm1hdElzVmFsaWQoc3ByaXRlTmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJTcHJpdGUgbmFtZSBnaXZlbiB0byBjcmVhdGVTcHJpdGVJbkdyb3VwIGlzIGluIHdyb25nIGZvcm1hdDogXCIgKyBzcHJpdGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3ByaXRlRXhpc3RzKHNwcml0ZU5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiY3JlYXRlU3ByaXRlSW5Hcm91cCBjYW5ub3QgY3JlYXRlIGR1cGxpY2F0ZSBzcHJpdGUgd2l0aCBuYW1lOiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDUgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gNykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiAodGhlQW5pbWF0aW9uKSAhPT0gXCJvYmplY3RcIiB8fCAoXCJpbWFnZVVybFwiIGluIHRoZUFuaW1hdGlvbiAmJiB0eXBlb2YgKHRoZUFuaW1hdGlvbltcImltYWdlVVJMXCJdKSAhPT0gXCJzdHJpbmdcIikpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiY3JlYXRlU3ByaXRlSW5Hcm91cCBjYW5ub3QgdXNlIHRoaXMgYXMgYW4gYW5pbWF0aW9uOiBcIiArIHRoZUFuaW1hdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiV2lkdGggYXJndW1lbnQgZm9yIGNyZWF0ZVNwcml0ZUluR3JvdXAgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlV2lkdGgpO1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkhlaWdodCBhcmd1bWVudCBmb3IgY3JlYXRlU3ByaXRlSW5Hcm91cCBtdXN0IGJlIG51bWVyaWMuIFwiLCB0aGVIZWlnaHQpO1xuXG5cbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA3KSB7XG4gICAgICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlggbG9jYXRpb24gYXJndW1lbnQgZm9yIGNyZWF0ZVNwcml0ZUluR3JvdXAgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlUG9zeCk7XG4gICAgICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlkgbG9jYXRpb24gYXJndW1lbnQgZm9yIGNyZWF0ZVNwcml0ZUluR3JvdXAgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlUG9zeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMl0gIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiVGhpcmQgYXJndW1lbnQgZm9yIGNyZWF0ZVNwcml0ZUluR3JvdXAgZXhwZWN0ZWQgdG8gYmUgYSBkaWN0aW9uYXJ5LiBJbnN0ZWFkIGZvdW5kOiBcIiArIGFyZ3VtZW50c1syXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFwiaW1hZ2VVcmxcIiBpbiB0aGVBbmltYXRpb24gJiYgdHlwZW9mICh0aGVBbmltYXRpb25bXCJpbWFnZVVSTFwiXSkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiVGhpcmQgYXJndW1lbnQgZm9yIGNyZWF0ZVNwcml0ZUluR3JvdXAgZXhwZWN0ZWQgdG8gYmUgYSBkaWN0aW9uYXJ5LiBJbnN0ZWFkIGZvdW5kIHRoaXMgYW5pbWF0aW9uOiBcIiArIHRoZUFuaW1hdGlvbiArIFwiLiBNYXliZSB3cm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIHByb3ZpZGVkPyBDaGVjayBBUEkgZG9jdW1lbnRhdGlvbiBmb3IgZGV0YWlscyBvZiBwYXJhbWV0ZXJzLlwiKTtcbiAgICAgICAgICAgIH0gLy8gZWxzZSBob3BlIGl0J3MgYSBwcm9wZXIgc3RhbmRhcmQgb3B0aW9ucyBtYXBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93Q29uc29sZUVycm9ySW5NeXByb2dyYW0oXCJXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIHVzZWQgZm9yIGNyZWF0ZVNwcml0ZUluR3JvdXAuIENoZWNrIEFQSSBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzIG9mIHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDUpIHtcbiAgICAgICAgJChcIiNcIiArIGdyb3VwTmFtZSkuYWRkU3ByaXRlKFxuICAgICAgICAgICAgc3ByaXRlTmFtZSxcbiAgICAgICAgICAgIHsgYW5pbWF0aW9uOiB0aGVBbmltYXRpb24sIHdpZHRoOiB0aGVXaWR0aCwgaGVpZ2h0OiB0aGVIZWlnaHQgfVxuICAgICAgICApO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNykge1xuICAgICAgICAkKFwiI1wiICsgZ3JvdXBOYW1lKS5hZGRTcHJpdGUoXG4gICAgICAgICAgICBzcHJpdGVOYW1lLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogdGhlQW5pbWF0aW9uLFxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGVXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoZUhlaWdodCxcbiAgICAgICAgICAgICAgICBwb3N4OiB0aGVQb3N4LFxuICAgICAgICAgICAgICAgIHBvc3k6IHRoZVBvc3lcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHsgLy8gdHJlYXRzIGFyZ3VtZW50c1syXSBhcyBhIHN0YW5kYXJkIG9wdGlvbnMgbWFwXG4gICAgICAgICQoXCIjXCIgKyBncm91cE5hbWUpLmFkZFNwcml0ZShzcHJpdGVOYW1lLCBhcmd1bWVudHNbMl0pO1xuICAgIH1cbn07XG5cbnR5cGUgQ3JlYXRlVGV4dFNwcml0ZUluR3JvdXBGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyLFxuICAgICAgICB0aGVQb3N4OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3k6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgICAgICB0aGVXaWR0aDogbnVtYmVyLFxuICAgICAgICB0aGVIZWlnaHQ6IG51bWJlclxuICAgICk6IHZvaWQ7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwOiBDcmVhdGVUZXh0U3ByaXRlSW5Hcm91cEZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgdGhlUG9zeD86IG51bWJlcixcbiAgICB0aGVQb3N5PzogbnVtYmVyXG4pOiB2b2lkIHtcbiAgICAvLyB0byBiZSB1c2VkIGxpa2Ugc3ByaXRlKFwidGV4dEJveFwiKS50ZXh0KFwiaGlcIik7IC8vIG9yIC5odG1sKFwiPGI+aGk8L2I+XCIpO1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiAoZ3JvdXBOYW1lKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIkZpcnN0IGFyZ3VtZW50IGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBtdXN0IGJlIGEgU3RyaW5nLiBJbnN0ZWFkIGZvdW5kOiBcIiArIGdyb3VwTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzcHJpdGVFeGlzdHMoZ3JvdXBOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcImNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwIGNhbm5vdCBmaW5kIGdyb3VwIChkb2Vzbid0IGV4aXN0Pyk6IFwiICsgZ3JvdXBOYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgKHNwcml0ZU5hbWUpICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiU2Vjb25kIGFyZ3VtZW50IGZvciBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cCBtdXN0IGJlIGEgU3RyaW5nLiBJbnN0ZWFkIGZvdW5kOiBcIiArIHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc3ByaXRlR3JvdXBOYW1lRm9ybWF0SXNWYWxpZChzcHJpdGVOYW1lKSkge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIlNwcml0ZSBuYW1lIGdpdmVuIHRvIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwIGlzIGluIHdyb25nIGZvcm1hdDogXCIgKyBzcHJpdGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3ByaXRlRXhpc3RzKHNwcml0ZU5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvd0NvbnNvbGVFcnJvckluTXlwcm9ncmFtKFwiY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgY2Fubm90IGNyZWF0ZSBkdXBsaWNhdGUgc3ByaXRlIHdpdGggbmFtZTogXCIgKyBzcHJpdGVOYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA0IHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDYpIHtcbiAgICAgICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBhcmd1bWVudCBmb3IgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlV2lkdGgpO1xuICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkhlaWdodCBhcmd1bWVudCBmb3IgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlSGVpZ2h0KTtcblxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDYpIHtcbiAgICAgICAgICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWCBsb2NhdGlvbiBhcmd1bWVudCBmb3IgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAgbXVzdCBiZSBudW1lcmljLiBcIiwgdGhlUG9zeCk7XG4gICAgICAgICAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlkgbG9jYXRpb24gYXJndW1lbnQgZm9yIGNyZWF0ZVRleHRTcHJpdGVJbkdyb3VwIG11c3QgYmUgbnVtZXJpYy4gXCIsIHRoZVBvc3kpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIldyb25nIG51bWJlciBvZiBhcmd1bWVudHMgdXNlZCBmb3IgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAuIENoZWNrIEFQSSBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzIG9mIHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDQpIHtcbiAgICAgICAgJChcIiNcIiArIGdyb3VwTmFtZSkuYWRkU3ByaXRlKHNwcml0ZU5hbWUsIHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGVXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogdGhlSGVpZ2h0XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNikge1xuICAgICAgICAkKFwiI1wiICsgZ3JvdXBOYW1lKS5hZGRTcHJpdGUoc3ByaXRlTmFtZSwge1xuICAgICAgICAgICAgd2lkdGg6IHRoZVdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGVIZWlnaHQsXG4gICAgICAgICAgICBwb3N4OiB0aGVQb3N4LFxuICAgICAgICAgICAgcG9zeTogdGhlUG9zeVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDQgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gNikge1xuICAgICAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkuY3NzKFwiYmFja2dyb3VuZC1jb2xvclwiLCBcIndoaXRlXCIpIC8vIGRlZmF1bHQgdG8gd2hpdGUgYmFja2dyb3VuZCBmb3IgZWFzZSBvZiB1c2VcbiAgICAgICAgICAgIC5jc3MoXCJ1c2VyLXNlbGVjdFwiLCBcIm5vbmVcIik7XG4gICAgfVxufTtcblxuY29uc3QgdGV4dElucHV0U3ByaXRlVGV4dEFyZWFJZCA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIHJldHVybiBzcHJpdGVOYW1lICsgXCItdGV4dGFyZWFcIjtcbn07XG5jb25zdCB0ZXh0SW5wdXRTcHJpdGVTdWJtaXRCdXR0b25JZCA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIHJldHVybiBzcHJpdGVOYW1lICsgXCItYnV0dG9uXCI7XG59O1xuY29uc3QgdGV4dElucHV0U3ByaXRlR1FHX1NJR05BTFNfSWQgPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICByZXR1cm4gc3ByaXRlTmFtZSArIFwiLXN1Ym1pdHRlZFwiO1xufTtcbnR5cGUgQ3JlYXRlVGV4dElucHV0U3ByaXRlSW5Hcm91cEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHJvd3M6IG51bWJlcixcbiAgICAgICAgY29sczogbnVtYmVyLFxuICAgICAgICB0aGVQb3N4OiBudW1iZXIsXG4gICAgICAgIHRoZVBvc3k6IG51bWJlcixcbiAgICAgICAgc3VibWl0SGFuZGxlcjogU3VibWl0SGFuZGxlckZuXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyLFxuICAgICAgICByb3dzOiBudW1iZXIsXG4gICAgICAgIGNvbHM6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeDogbnVtYmVyLFxuICAgICAgICB0aGVQb3N5OiBudW1iZXJcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgdGhlV2lkdGg6IG51bWJlcixcbiAgICAgICAgdGhlSGVpZ2h0OiBudW1iZXIsXG4gICAgICAgIHJvd3M6IG51bWJlcixcbiAgICAgICAgY29sczogbnVtYmVyXG4gICAgKTogdm9pZDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlVGV4dElucHV0U3ByaXRlSW5Hcm91cDogQ3JlYXRlVGV4dElucHV0U3ByaXRlSW5Hcm91cEZuID1cbiAgICBmdW5jdGlvbiAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHRoZVdpZHRoOiBudW1iZXIsXG4gICAgICAgIHRoZUhlaWdodDogbnVtYmVyLFxuICAgICAgICByb3dzOiBudW1iZXIsXG4gICAgICAgIGNvbHM6IG51bWJlcixcbiAgICAgICAgdGhlUG9zeD86IG51bWJlcixcbiAgICAgICAgdGhlUG9zeT86IG51bWJlcixcbiAgICAgICAgc3VibWl0SGFuZGxlcj86IFN1Ym1pdEhhbmRsZXJGblxuICAgICk6IHZvaWQge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNikge1xuICAgICAgICAgICAgY3JlYXRlVGV4dFNwcml0ZUluR3JvdXAoZ3JvdXBOYW1lLCBzcHJpdGVOYW1lLCB0aGVXaWR0aCwgdGhlSGVpZ2h0KTtcbiAgICAgICAgfSBlbHNlIGlmICgoYXJndW1lbnRzLmxlbmd0aCA9PT0gOCB8fCBhcmd1bWVudHMubGVuZ3RoID09PSA5KSAmJiB0aGVQb3N4ICYmXG4gICAgICAgICAgICB0aGVQb3N5KSB7XG4gICAgICAgICAgICBjcmVhdGVUZXh0U3ByaXRlSW5Hcm91cChcbiAgICAgICAgICAgICAgICBncm91cE5hbWUsXG4gICAgICAgICAgICAgICAgc3ByaXRlTmFtZSxcbiAgICAgICAgICAgICAgICB0aGVXaWR0aCxcbiAgICAgICAgICAgICAgICB0aGVIZWlnaHQsXG4gICAgICAgICAgICAgICAgdGhlUG9zeCxcbiAgICAgICAgICAgICAgICB0aGVQb3N5XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSA2IHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDggfHxcbiAgICAgICAgICAgIGFyZ3VtZW50cy5sZW5ndGggPT09IDkpIHtcbiAgICAgICAgICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIFwid2hpdGVcIik7IC8vIGRlZmF1bHQgdG8gd2hpdGUgYmFja2dyb3VuZCBmb3IgZWFzZSBvZiB1c2VcblxuICAgICAgICAgICAgdmFyIHRleHRhcmVhSHRtbCA9ICc8dGV4dGFyZWEgaWQ9XCInICtcbiAgICAgICAgICAgICAgICB0ZXh0SW5wdXRTcHJpdGVUZXh0QXJlYUlkKHNwcml0ZU5hbWUpICsgJ1wiIHJvd3M9XCInICsgcm93cyArXG4gICAgICAgICAgICAgICAgJ1wiIGNvbHM9XCInICsgY29scyArICdcIj5oaTwvdGV4dGFyZWE+JztcbiAgICAgICAgICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5hcHBlbmQodGV4dGFyZWFIdG1sKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbklkID0gdGV4dElucHV0U3ByaXRlU3VibWl0QnV0dG9uSWQoc3ByaXRlTmFtZSk7XG4gICAgICAgICAgICB2YXIgYnV0dG9uSHRtbCA9ICc8YnV0dG9uIGlkPVwiJyArIGJ1dHRvbklkICtcbiAgICAgICAgICAgICAgICAnXCIgdHlwZT1cImJ1dHRvblwiPlN1Ym1pdDwvYnV0dG9uPic7XG4gICAgICAgICAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkuYXBwZW5kKGJ1dHRvbkh0bWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDkpIHtcbiAgICAgICAgICAgIHRleHRJbnB1dFNwcml0ZVNldEhhbmRsZXIoc3ByaXRlTmFtZSwgc3VibWl0SGFuZGxlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0ZXh0SW5wdXRTcHJpdGVTZXRIYW5kbGVyKHNwcml0ZU5hbWUpO1xuICAgICAgICB9XG4gICAgfTtcbmV4cG9ydCB0eXBlIFN1Ym1pdEhhbmRsZXJGbiA9IChzOiBzdHJpbmcpID0+IHZvaWQ7XG5leHBvcnQgY29uc3QgdGV4dElucHV0U3ByaXRlU2V0SGFuZGxlciA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkLFxuICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICBzdWJtaXRIYW5kbGVyPzogU3VibWl0SGFuZGxlckZuXG4pOiB2b2lkIHtcbiAgICB2YXIgcmVhbFN1Ym1pdEhhbmRsZXI7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgcmVhbFN1Ym1pdEhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoc3VibWl0SGFuZGxlcikgc3VibWl0SGFuZGxlcih0ZXh0SW5wdXRTcHJpdGVTdHJpbmcoc3ByaXRlTmFtZSkpO1xuICAgICAgICAgICAgR1FHX1NJR05BTFNbdGV4dElucHV0U3ByaXRlR1FHX1NJR05BTFNfSWQoc3ByaXRlTmFtZSldID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZWFsU3VibWl0SGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIEdRR19TSUdOQUxTW3RleHRJbnB1dFNwcml0ZUdRR19TSUdOQUxTX0lkKHNwcml0ZU5hbWUpXSA9IHRydWU7XG4gICAgICAgIH07XG4gICAgfVxuICAgICQoXCIjXCIgKyB0ZXh0SW5wdXRTcHJpdGVTdWJtaXRCdXR0b25JZChzcHJpdGVOYW1lKSkuY2xpY2socmVhbFN1Ym1pdEhhbmRsZXIpO1xufTtcblxuZXhwb3J0IGNvbnN0IHRleHRJbnB1dFNwcml0ZVN0cmluZyA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIHJldHVybiBTdHJpbmcoJChcIiNcIiArIHRleHRJbnB1dFNwcml0ZVRleHRBcmVhSWQoc3ByaXRlTmFtZSkpWzBdLnZhbHVlKTtcbn07XG5leHBvcnQgY29uc3QgdGV4dElucHV0U3ByaXRlU2V0U3RyaW5nID0gKFxuICAgIHNwcml0ZU5hbWU6IHN0cmluZyxcbiAgICBzdHI6IHN0cmluZ1xuKTogdm9pZCA9PiB7XG4gICAgJChcIiNcIiArIHRleHRJbnB1dFNwcml0ZVRleHRBcmVhSWQoc3ByaXRlTmFtZSkpWzBdLnZhbHVlID0gc3RyO1xufTtcblxuZXhwb3J0IGNvbnN0IHRleHRJbnB1dFNwcml0ZVJlc2V0ID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHRleHRQcm9tcHQ/OiBzdHJpbmdcbikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHRleHRJbnB1dFNwcml0ZVNldFN0cmluZyhzcHJpdGVOYW1lLCBcIlwiKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIgJiYgdGV4dFByb21wdCkge1xuICAgICAgICB0ZXh0SW5wdXRTcHJpdGVTZXRTdHJpbmcoc3ByaXRlTmFtZSwgdGV4dFByb21wdCk7XG4gICAgfVxuICAgIEdRR19TSUdOQUxTW3RleHRJbnB1dFNwcml0ZUdRR19TSUdOQUxTX0lkKHNwcml0ZU5hbWUpXSA9IGZhbHNlO1xufTtcblxuZXhwb3J0IGNvbnN0IHRleHRJbnB1dFNwcml0ZVN1Ym1pdHRlZCA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICBpZiAoR1FHX1NJR05BTFNbdGV4dElucHV0U3ByaXRlR1FHX1NJR05BTFNfSWQoc3ByaXRlTmFtZSldID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlU3ByaXRlID0gKHNwcml0ZU5hbWVPck9iajogc3RyaW5nIHwgb2JqZWN0KTogdm9pZCA9PiB7XG4gICAgaWYgKHR5cGVvZiAoc3ByaXRlTmFtZU9yT2JqKSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZU9yT2JqKTtcbiAgICAgICAgfTtcbiAgICAgICAgJChcIiNcIiArIHNwcml0ZU5hbWVPck9iaikucmVtb3ZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJChzcHJpdGVOYW1lT3JPYmopLnJlbW92ZSgpO1xuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGUgPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogc3ByaXRlRG9tT2JqZWN0ID0+IHtcbiAgICByZXR1cm4gJChcIiNcIiArIHNwcml0ZU5hbWUpO1xufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZUV4aXN0cyA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gKHNwcml0ZU5hbWUgPT0gJChcIiNcIiArIHNwcml0ZU5hbWUpLmF0dHIoXCJpZFwiKSk7IC8vIHNwcml0ZU5hbWUgY291bGQgYmUgZ2l2ZW4gYXMgYW4gaW50IGJ5IGEgc3R1ZGVudFxufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZU9iamVjdCA9IChcbiAgICBzcHJpdGVOYW1lT3JPYmo6IHN0cmluZyB8IG9iamVjdFxuKTogc3ByaXRlRG9tT2JqZWN0ID0+IHtcbiAgICBpZiAodHlwZW9mIChzcHJpdGVOYW1lT3JPYmopICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiAkKFwiI1wiICsgc3ByaXRlTmFtZU9yT2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJChzcHJpdGVOYW1lT3JPYmopO1xuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVJZCA9IChzcHJpdGVOYW1lT3JPYmo6IHN0cmluZyB8IG9iamVjdCk6IHN0cmluZyA9PiB7XG4gICAgaWYgKHR5cGVvZiAoc3ByaXRlTmFtZU9yT2JqKSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gU3RyaW5nKCQoXCIjXCIgKyBzcHJpdGVOYW1lT3JPYmopLmF0dHIoXCJpZFwiKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZygkKHNwcml0ZU5hbWVPck9iaikuYXR0cihcImlkXCIpKTtcbiAgICB9XG59O1xuXG5leHBvcnQgY29uc3Qgc3ByaXRlR2V0WCA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBudW1iZXIgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgIH07XG4gICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lKS54KCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZUdldFkgPSAoc3ByaXRlTmFtZTogc3RyaW5nKTogbnVtYmVyID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICB9O1xuICAgIHJldHVybiAkKFwiI1wiICsgc3ByaXRlTmFtZSkueSgpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVHZXRaID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgfTtcbiAgICByZXR1cm4gJChcIiNcIiArIHNwcml0ZU5hbWUpLnooKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0WCA9IChzcHJpdGVOYW1lOiBzdHJpbmcsIHh2YWw6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWCBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB4dmFsKTtcbiAgICB9O1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS54KHh2YWwpO1xufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRZID0gKHNwcml0ZU5hbWU6IHN0cmluZywgeXZhbDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJZIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHl2YWwpO1xuICAgIH07XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLnkoeXZhbCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVNldFogPSAoc3ByaXRlTmFtZTogc3RyaW5nLCB6dmFsOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlogbG9jYXRpb24gbXVzdCBiZSBhIG51bWJlci5cIiwgenZhbCk7XG4gICAgfTtcbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkueih6dmFsKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0WFkgPSAoXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHh2YWw6IG51bWJlcixcbiAgICB5dmFsOiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWCBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB4dmFsKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlkgbG9jYXRpb24gbXVzdCBiZSBhIG51bWJlci5cIiwgeXZhbCk7XG4gICAgfTtcbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkueHkoeHZhbCwgeXZhbCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVNldFhZWiA9IChcbiAgICBzcHJpdGVOYW1lOiBzdHJpbmcsXG4gICAgeHZhbDogbnVtYmVyLFxuICAgIHl2YWw6IG51bWJlcixcbiAgICB6dmFsOiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiWCBsb2NhdGlvbiBtdXN0IGJlIGEgbnVtYmVyLlwiLCB4dmFsKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlkgbG9jYXRpb24gbXVzdCBiZSBhIG51bWJlci5cIiwgeXZhbCk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJaIGxvY2F0aW9uIG11c3QgYmUgYSBudW1iZXIuXCIsIHp2YWwpO1xuICAgIH07XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLnh5eih4dmFsLCB5dmFsLCB6dmFsKTtcbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVHZXRXaWR0aCA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBudW1iZXIgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgIH07XG4gICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lKS53KCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZUdldEhlaWdodCA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiBudW1iZXIgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgIH07XG4gICAgcmV0dXJuICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5oKCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVNldFdpZHRoID0gKHNwcml0ZU5hbWU6IHN0cmluZywgd3ZhbDogbnVtYmVyKTogdm9pZCA9PiB7XG4gICAgaWYgKEdRR19ERUJVRykge1xuICAgICAgICB0aHJvd0lmU3ByaXRlTmFtZUludmFsaWQoc3ByaXRlTmFtZSk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJXaWR0aCBtdXN0IGJlIGEgbnVtYmVyLlwiLCB3dmFsKTtcbiAgICB9XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLncod3ZhbCk7XG59O1xuZXhwb3J0IGNvbnN0IHNwcml0ZVNldEhlaWdodCA9IChzcHJpdGVOYW1lOiBzdHJpbmcsIGh2YWw6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiSGVpZ2h0IG11c3QgYmUgYSBudW1iZXIuXCIsIGh2YWwpO1xuICAgIH1cbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkuaChodmFsKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlU2V0V2lkdGhIZWlnaHQgPSAoXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIHd2YWw6IG51bWJlcixcbiAgICBodmFsOiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgdGhyb3dJZlNwcml0ZU5hbWVJbnZhbGlkKHNwcml0ZU5hbWUpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiV2lkdGggbXVzdCBiZSBhIG51bWJlci5cIiwgd3ZhbCk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJIZWlnaHQgbXVzdCBiZSBhIG51bWJlci5cIiwgaHZhbCk7XG4gICAgfVxuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS53aCh3dmFsLCBodmFsKTtcbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVSb3RhdGUgPSAoXG4gICAgc3ByaXRlTmFtZTogc3RyaW5nLFxuICAgIGFuZ2xlRGVncmVlczogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIkFuZ2xlIG11c3QgYmUgYSBudW1iZXIuXCIsIGFuZ2xlRGVncmVlcyk7XG4gICAgfVxuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5yb3RhdGUoYW5nbGVEZWdyZWVzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVTY2FsZSA9IChzcHJpdGVOYW1lOiBzdHJpbmcsIHJhdGlvOiBudW1iZXIpOiB2b2lkID0+IHtcbiAgICBpZiAoR1FHX0RFQlVHKSB7XG4gICAgICAgIHRocm93SWZTcHJpdGVOYW1lSW52YWxpZChzcHJpdGVOYW1lKTtcbiAgICAgICAgdGhyb3dJZk5vdEZpbml0ZU51bWJlcihcIlJhdGlvIG11c3QgYmUgYSBudW1iZXIuXCIsIHJhdGlvKTtcbiAgICB9XG4gICAgJChcIiNcIiArIHNwcml0ZU5hbWUpLnNjYWxlKHJhdGlvKTtcbn07XG5cbmV4cG9ydCBjb25zdCBzcHJpdGVTZXRBbmltYXRpb24gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBzcHJpdGVOYW1lT3JPYmo6IHN0cmluZyB8IG9iamVjdCxcbiAgICBhR1FBbmltYXRpb24/OiBvYmplY3QsXG4gICAgY2FsbGJhY2tGdW5jdGlvbj86IEZ1bmN0aW9uXG4pIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiAmJiBhR1FBbmltYXRpb24gIT0gbnVsbCkge1xuICAgICAgICBzcHJpdGVPYmplY3Qoc3ByaXRlTmFtZU9yT2JqKS5zZXRBbmltYXRpb24oYUdRQW5pbWF0aW9uKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgJiYgYUdRQW5pbWF0aW9uICE9IG51bGwgJiYgdHlwZW9mIGNhbGxiYWNrRnVuY3Rpb24gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBzcHJpdGVPYmplY3Qoc3ByaXRlTmFtZU9yT2JqKS5zZXRBbmltYXRpb24oYUdRQW5pbWF0aW9uLCBjYWxsYmFja0Z1bmN0aW9uKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgc3ByaXRlT2JqZWN0KHNwcml0ZU5hbWVPck9iaikuc2V0QW5pbWF0aW9uKCk7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBzcHJpdGVQYXVzZUFuaW1hdGlvbiA9IChzcHJpdGVOYW1lOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAkKFwiI1wiICsgc3ByaXRlTmFtZSkucGF1c2VBbmltYXRpb24oKTtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlUmVzdW1lQW5pbWF0aW9uID0gKHNwcml0ZU5hbWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICQoXCIjXCIgKyBzcHJpdGVOYW1lKS5yZXN1bWVBbmltYXRpb24oKTtcbn07XG5cbmV4cG9ydCB0eXBlIENvbGxpc2lvbkhhbmRsaW5nRm4gPSAoY29sbEluZGV4OiBudW1iZXIsIGhpdFNwcml0ZTogb2JqZWN0KSA9PlxuICAgIHZvaWQ7XG5leHBvcnQgY29uc3QgZm9yRWFjaFNwcml0ZVNwcml0ZUNvbGxpc2lvbkRvID0gKFxuICAgIHNwcml0ZTFOYW1lOiBzdHJpbmcsXG4gICAgc3ByaXRlMk5hbWU6IHN0cmluZyxcbiAgICBjb2xsaXNpb25IYW5kbGluZ0Z1bmN0aW9uOiBDb2xsaXNpb25IYW5kbGluZ0ZuXG4pOiB2b2lkID0+IHtcbiAgICAkKFwiI1wiICsgc3ByaXRlMU5hbWUpLmNvbGxpc2lvbihcIi5nUV9ncm91cCwgI1wiICsgc3ByaXRlMk5hbWUpLmVhY2goXG4gICAgICAgIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb25cbiAgICApO1xuICAgIC8vIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb24gY2FuIG9wdGlvbmFsbHkgdGFrZSB0d28gYXJndW1lbnRzOiBjb2xsSW5kZXgsIGhpdFNwcml0ZVxuICAgIC8vIHNlZSBodHRwOi8vYXBpLmpxdWVyeS5jb20valF1ZXJ5LmVhY2hcbn07XG5leHBvcnQgY29uc3QgZm9yRWFjaDJTcHJpdGVzSGl0ID0gKCgpID0+IHtcbiAgICB2YXIgcHJpbnRlZCA9IGZhbHNlO1xuICAgIHJldHVybiAoc3ByaXRlMU5hbWU6IHN0cmluZywgc3ByaXRlMk5hbWU6IHN0cmluZywgY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbjogQ29sbGlzaW9uSGFuZGxpbmdGbikgPT4ge1xuICAgICAgICBpZiAoIXByaW50ZWQpIHtcbiAgICAgICAgICAgIHByaW50ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIkRlcHJlY2F0ZWQgZnVuY3Rpb24gdXNlZDogZm9yRWFjaDJTcHJpdGVzSGl0LiAgVXNlIHdoZW4yU3ByaXRlc0hpdCBpbnN0ZWFkIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2UuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGZvckVhY2hTcHJpdGVTcHJpdGVDb2xsaXNpb25EbyhzcHJpdGUxTmFtZSwgc3ByaXRlMk5hbWUsIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb24pO1xuICAgIH07XG59KSgpO1xuZXhwb3J0IGNvbnN0IHdoZW4yU3ByaXRlc0hpdCA9IGZvckVhY2hTcHJpdGVTcHJpdGVDb2xsaXNpb25EbzsgLy8gTkVXXG5cbmV4cG9ydCBjb25zdCBmb3JFYWNoU3ByaXRlR3JvdXBDb2xsaXNpb25EbyA9IChcbiAgICBzcHJpdGUxTmFtZTogc3RyaW5nLFxuICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgIGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb246IENvbGxpc2lvbkhhbmRsaW5nRm5cbik6IHZvaWQgPT4ge1xuICAgICQoXCIjXCIgKyBzcHJpdGUxTmFtZSkuY29sbGlzaW9uKFwiI1wiICsgZ3JvdXBOYW1lICsgXCIsIC5nUV9zcHJpdGVcIikuZWFjaChcbiAgICAgICAgY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvblxuICAgICk7XG4gICAgLy8gY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbiBjYW4gb3B0aW9uYWxseSB0YWtlIHR3byBhcmd1bWVudHM6IGNvbGxJbmRleCwgaGl0U3ByaXRlXG4gICAgLy8gc2VlIGh0dHA6Ly9hcGkuanF1ZXJ5LmNvbS9qUXVlcnkuZWFjaFxufTtcbmV4cG9ydCBjb25zdCBmb3JFYWNoU3ByaXRlR3JvdXBIaXQgPSBmb3JFYWNoU3ByaXRlR3JvdXBDb2xsaXNpb25EbztcblxuZXhwb3J0IGNvbnN0IGZvckVhY2hTcHJpdGVGaWx0ZXJlZENvbGxpc2lvbkRvID0gKFxuICAgIHNwcml0ZTFOYW1lOiBzdHJpbmcsXG4gICAgZmlsdGVyU3RyOiBzdHJpbmcsXG4gICAgY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbjogQ29sbGlzaW9uSGFuZGxpbmdGblxuKTogdm9pZCA9PiB7XG4gICAgJChcIiNcIiArIHNwcml0ZTFOYW1lKS5jb2xsaXNpb24oZmlsdGVyU3RyKS5lYWNoKGNvbGxpc2lvbkhhbmRsaW5nRnVuY3Rpb24pO1xuICAgIC8vIHNlZSBodHRwOi8vZ2FtZXF1ZXJ5anMuY29tL2RvY3VtZW50YXRpb24vYXBpLyNjb2xsaXNpb24gZm9yIGZpbHRlclN0ciBzcGVjXG4gICAgLy8gY29sbGlzaW9uSGFuZGxpbmdGdW5jdGlvbiBjYW4gb3B0aW9uYWxseSB0YWtlIHR3byBhcmd1bWVudHM6IGNvbGxJbmRleCwgaGl0U3ByaXRlXG4gICAgLy8gc2VlIGh0dHA6Ly9hcGkuanF1ZXJ5LmNvbS9qUXVlcnkuZWFjaFxufTtcbmV4cG9ydCBjb25zdCBmb3JFYWNoU3ByaXRlRmlsdGVyZWRIaXQgPSBmb3JFYWNoU3ByaXRlRmlsdGVyZWRDb2xsaXNpb25EbztcblxuZXhwb3J0IHR5cGUgU3ByaXRlSGl0RGlyZWN0aW9uYWxpdHkgPSB7XG4gICAgXCJsZWZ0XCI6IGJvb2xlYW47XG4gICAgXCJyaWdodFwiOiBib29sZWFuO1xuICAgIFwidXBcIjogYm9vbGVhbjtcbiAgICBcImRvd25cIjogYm9vbGVhbjtcbn07XG5leHBvcnQgY29uc3Qgc3ByaXRlSGl0RGlyZWN0aW9uID0gKFxuICAgIHNwcml0ZTFJZDogc3RyaW5nLFxuICAgIHNwcml0ZTFYOiBudW1iZXIsXG4gICAgc3ByaXRlMVk6IG51bWJlcixcbiAgICBzcHJpdGUxWFNwZWVkOiBudW1iZXIsXG4gICAgc3ByaXRlMVlTcGVlZDogbnVtYmVyLFxuICAgIHNwcml0ZTFXaWR0aDogbnVtYmVyLFxuICAgIHNwcml0ZTFIZWlnaHQ6IG51bWJlcixcbiAgICBzcHJpdGUySWQ6IHN0cmluZyxcbiAgICBzcHJpdGUyWDogbnVtYmVyLFxuICAgIHNwcml0ZTJZOiBudW1iZXIsXG4gICAgc3ByaXRlMlhTcGVlZDogbnVtYmVyLFxuICAgIHNwcml0ZTJZU3BlZWQ6IG51bWJlcixcbiAgICBzcHJpdGUyV2lkdGg6IG51bWJlcixcbiAgICBzcHJpdGUySGVpZ2h0OiBudW1iZXJcbik6IFNwcml0ZUhpdERpcmVjdGlvbmFsaXR5ID0+IHtcbiAgICB2YXIgc3ByaXRlMUluZm86IFNwcml0ZURpY3QgPSB7XG4gICAgICAgIFwiaWRcIjogc3ByaXRlMUlkLFxuICAgICAgICBcInhQb3NcIjogc3ByaXRlMVgsXG4gICAgICAgIFwieVBvc1wiOiBzcHJpdGUxWSxcbiAgICAgICAgXCJ4U3BlZWRcIjogc3ByaXRlMVhTcGVlZCxcbiAgICAgICAgXCJ5U3BlZWRcIjogc3ByaXRlMVlTcGVlZCxcbiAgICAgICAgXCJoZWlnaHRcIjogc3ByaXRlMUhlaWdodCxcbiAgICAgICAgXCJ3aWR0aFwiOiBzcHJpdGUxV2lkdGhcbiAgICB9O1xuICAgIHZhciBzcHJpdGUySW5mbzogU3ByaXRlRGljdCA9IHtcbiAgICAgICAgXCJpZFwiOiBzcHJpdGUySWQsXG4gICAgICAgIFwieFBvc1wiOiBzcHJpdGUyWCxcbiAgICAgICAgXCJ5UG9zXCI6IHNwcml0ZTJZLFxuICAgICAgICBcInhTcGVlZFwiOiBzcHJpdGUyWFNwZWVkLFxuICAgICAgICBcInlTcGVlZFwiOiBzcHJpdGUyWVNwZWVkLFxuICAgICAgICBcImhlaWdodFwiOiBzcHJpdGUySGVpZ2h0LFxuICAgICAgICBcIndpZHRoXCI6IHNwcml0ZTJXaWR0aFxuICAgIH07XG4gICAgcmV0dXJuIHNwcml0ZUhpdERpcihzcHJpdGUxSW5mbywgc3ByaXRlMkluZm8pO1xufTtcblxuZXhwb3J0IHR5cGUgU3ByaXRlUGh5c2ljYWxEaW1lbnNpb25zID0ge1xuICAgIFwieFBvc1wiOiBudW1iZXI7XG4gICAgXCJ5UG9zXCI6IG51bWJlcjtcbiAgICBcInhTcGVlZFwiOiBudW1iZXI7IC8vIG1vdmVtZW50IG11c3QgYmUgYnkgZGljdGlvbmFyeSxcbiAgICBcInlTcGVlZFwiOiBudW1iZXI7IC8vIHdpdGggc29tZXRoaW5nIGxpa2UgeCA9IHggKyB4U3BlZWRcbiAgICBcIndpZHRoXCI6IG51bWJlcjtcbiAgICBcImhlaWdodFwiOiBudW1iZXI7XG59O1xuZXhwb3J0IHR5cGUgU3ByaXRlRGljdCA9IFNwcml0ZVBoeXNpY2FsRGltZW5zaW9ucyAmIHtcbiAgICBcImlkXCI6IHN0cmluZztcbiAgICBbczogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IFNwcml0ZUFuaW1hdGlvbiB8IG9iamVjdDtcbn07XG5jb25zdCBzcHJpdGVzU3BlZWRTYW1wbGVzOiB7IFtrOiBzdHJpbmddOiB7IHNhbXBsZVNpemU6IG51bWJlciwgeFNwZWVkU2FtcGxlczogbnVtYmVyW10sIHlTcGVlZFNhbXBsZXM6IG51bWJlcltdLCBjaGVja2VkOiBib29sZWFuIH0gfSA9IHt9O1xuY29uc3QgY2hlY2tTcHJpdGVTcGVlZFVzYWdlQ29tbW9uRXJyb3JzID0gKHNwcml0ZUluZm86IFNwcml0ZURpY3QpID0+IHtcbiAgICAvLyBBIGhldXJpc3RpYyBjaGVjayBmb3IgY29tbW9uIGVycm9ycyBmcm9tIGxlYXJuZXJzLlxuICAgIC8vIENoZWNrIGlmIHNwcml0ZSBzcGVlZHMgZXZlciBjaGFuZ2UuICBJZiBub3QsIHByb2JhYmx5IGRvaW5nIGl0IHdyb25nLlxuICAgIGlmICghc3ByaXRlc1NwZWVkU2FtcGxlc1tzcHJpdGVJbmZvW1wiaWRcIl1dKSB7XG4gICAgICAgIHNwcml0ZXNTcGVlZFNhbXBsZXNbc3ByaXRlSW5mb1tcImlkXCJdXSA9IHtcbiAgICAgICAgICAgIHNhbXBsZVNpemU6IDAsXG4gICAgICAgICAgICB4U3BlZWRTYW1wbGVzOiBbXSxcbiAgICAgICAgICAgIHlTcGVlZFNhbXBsZXM6IFtdLFxuICAgICAgICAgICAgY2hlY2tlZDogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzcHJpdGUxU2FtcGxpbmcgPSBzcHJpdGVzU3BlZWRTYW1wbGVzW3Nwcml0ZUluZm9bXCJpZFwiXV07XG4gICAgICAgIGNvbnN0IG1heFNhbXBsZVNpemUgPSAxMDtcbiAgICAgICAgaWYgKHNwcml0ZTFTYW1wbGluZy5zYW1wbGVTaXplIDwgbWF4U2FtcGxlU2l6ZSkge1xuICAgICAgICAgICAgKytzcHJpdGUxU2FtcGxpbmcuc2FtcGxlU2l6ZTtcbiAgICAgICAgICAgIHNwcml0ZTFTYW1wbGluZy54U3BlZWRTYW1wbGVzLnB1c2goc3ByaXRlSW5mb1tcInhTcGVlZFwiXSk7XG4gICAgICAgICAgICBzcHJpdGUxU2FtcGxpbmcueVNwZWVkU2FtcGxlcy5wdXNoKHNwcml0ZUluZm9bXCJ5U3BlZWRcIl0pO1xuICAgICAgICB9IGVsc2UgaWYgKCFzcHJpdGUxU2FtcGxpbmcuY2hlY2tlZCkge1xuICAgICAgICAgICAgc3ByaXRlMVNhbXBsaW5nLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgY29uc3Qgc3MgPSBzcHJpdGUxU2FtcGxpbmcuc2FtcGxlU2l6ZTtcbiAgICAgICAgICAgIGNvbnN0IHN4U2FtcGxlcyA9IHNwcml0ZTFTYW1wbGluZy54U3BlZWRTYW1wbGVzO1xuICAgICAgICAgICAgY29uc3Qgc3lTYW1wbGVzID0gc3ByaXRlMVNhbXBsaW5nLnlTcGVlZFNhbXBsZXM7XG5cbiAgICAgICAgICAgIGxldCBzYW1lWHNwZWVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc3M7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChzeFNhbXBsZXNbaV0gIT09IHN4U2FtcGxlc1tpIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgc2FtZVhzcGVlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2FtZVhzcGVlZCAmJiBzeFNhbXBsZXNbMF0gIT09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhHUUdfV0FSTklOR19JTl9NWVBST0dSQU1fTVNHXG4gICAgICAgICAgICAgICAgICAgICsgXCJzcHJpdGUgaGl0IGRpcmVjdGlvbiBmdW5jdGlvbmFsaXR5LSBwb3NzaWJseSB3cm9uZyB4UG9zIGNhbGN1bGF0aW9uIGZvciBzcHJpdGU6IFwiXG4gICAgICAgICAgICAgICAgICAgICsgc3ByaXRlSW5mb1tcImlkXCJdXG4gICAgICAgICAgICAgICAgICAgICsgXCIuICBFbnN1cmUgeFNwZWVkIHVzZWQgdmFsaWRseSBpZiBzcHJpdGUgaGl0IGRpcmVjdGlvbmFsaXR5IHNlZW1zIHdyb25nLlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHNhbWVZc3BlZWQgPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBzczsgKytpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN5U2FtcGxlc1tpXSAhPT0gc3lTYW1wbGVzW2kgLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICBzYW1lWXNwZWVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzYW1lWXNwZWVkICYmIHN5U2FtcGxlc1swXSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKEdRR19XQVJOSU5HX0lOX01ZUFJPR1JBTV9NU0dcbiAgICAgICAgICAgICAgICAgICAgKyBcInNwcml0ZSBoaXQgZGlyZWN0aW9uIGZ1bmN0aW9uYWxpdHktIHBvc3NpYmx5IHdyb25nIHlQb3MgY2FsY3VsYXRpb24gZm9yIHNwcml0ZTogXCJcbiAgICAgICAgICAgICAgICAgICAgKyBzcHJpdGVJbmZvW1wiaWRcIl1cbiAgICAgICAgICAgICAgICAgICAgKyBcIi4gIEVuc3VyZSB5U3BlZWQgdXNlZCB2YWxpZGx5IGlmIHNwcml0ZSBoaXQgZGlyZWN0aW9uYWxpdHkgc2VlbXMgd3JvbmcuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNwcml0ZUhpdERpciA9IChcbiAgICBzcHJpdGUxSW5mbzogU3ByaXRlRGljdCxcbiAgICBzcHJpdGUySW5mbzogU3ByaXRlRGljdFxuKTogU3ByaXRlSGl0RGlyZWN0aW9uYWxpdHkgPT4ge1xuICAgIGlmIChHUUdfREVCVUcpIHtcbiAgICAgICAgY2hlY2tTcHJpdGVTcGVlZFVzYWdlQ29tbW9uRXJyb3JzKHNwcml0ZTFJbmZvKTtcbiAgICAgICAgY2hlY2tTcHJpdGVTcGVlZFVzYWdlQ29tbW9uRXJyb3JzKHNwcml0ZTJJbmZvKTtcbiAgICB9XG4gICAgcmV0dXJuIHNwcml0ZUhpdERpckltcGwoc3ByaXRlMUluZm8sIHNwcml0ZTJJbmZvKTtcbn1cbmNvbnN0IHNwcml0ZUhpdERpckltcGwgPSAoXG4gICAgc3ByaXRlMUluZm86IFNwcml0ZVBoeXNpY2FsRGltZW5zaW9ucyxcbiAgICBzcHJpdGUySW5mbzogU3ByaXRlUGh5c2ljYWxEaW1lbnNpb25zXG4pOiBTcHJpdGVIaXREaXJlY3Rpb25hbGl0eSA9PiB7XG4gICAgLypcbiAgICAgICBSZXR1cm5zIHRoZSBkaXJlY3Rpb24gdGhhdCBzcHJpdGUgMSBoaXRzIHNwcml0ZSAyIGZyb20uXG4gICAgICAgc3ByaXRlIDEgaXMgcmVsYXRpdmVseSBsZWZ0L3JpZ2h0L3VwL2Rvd24gb2Ygc3ByaXRlIDJcbiAgICAgICBcbiAgICAgICBIaXQgZGlyZWN0aW9uIHJldHVybmVkIGNvdWxkIGJlIG11bHRpcGxlIHZhbHVlcyAoZS5nLiBsZWZ0IGFuZCB1cCksXG4gICAgICAgYW5kIGlzIHJldHVybmVkIGJ5IHRoaXMgZnVuY3Rpb24gYXMgYSBkaWN0aW9uYXJ5IGFzLCBlLmcuXG4gICAgICAge1xuICAgICAgIFwibGVmdFwiOiBmYWxzZSxcbiAgICAgICBcInJpZ2h0XCI6IGZhbHNlLFxuICAgICAgIFwidXBcIjogZmFsc2UsXG4gICAgICAgXCJkb3duXCI6IGZhbHNlXG4gICAgICAgfVxuICAgICAgIFxuICAgICAgIFBhcmFtZXRlcnMgc3ByaXRlezEsMn1JbmZvIGFyZSBkaWN0aW9uYXJpZXMgd2l0aCBhdCBsZWFzdCB0aGVzZSBrZXlzOlxuICAgICAgIHtcbiAgICAgICBcImlkXCI6IFwiYWN0dWFsU3ByaXRlTmFtZVwiLFxuICAgICAgIFwieFBvc1wiOiA1MDAsXG4gICAgICAgXCJ5UG9zXCI6IDIwMCxcbiAgICAgICBcInhTcGVlZFwiOiAtOCwgIC8vIG1vdmVtZW50IG11c3QgYmUgYnkgZGljdGlvbmFyeSxcbiAgICAgICBcInlTcGVlZFwiOiAwLCAgIC8vIHdpdGggc29tZXRoaW5nIGxpa2UgeCA9IHggKyB4U3BlZWRcbiAgICAgICBcImhlaWdodFwiOiA3NCxcbiAgICAgICBcIndpZHRoXCI6IDc1XG4gICAgICAgfVxuICAgICAgICovXG5cbiAgICB2YXIgcGVyY2VudE1hcmdpbiA9IDEuMTsgLy8gcG9zaXRpdmUgcGVyY2VudCBpbiBkZWNpbWFsXG4gICAgdmFyIGRpcjogU3ByaXRlSGl0RGlyZWN0aW9uYWxpdHkgPSB7XG4gICAgICAgIFwibGVmdFwiOiBmYWxzZSxcbiAgICAgICAgXCJyaWdodFwiOiBmYWxzZSxcbiAgICAgICAgXCJ1cFwiOiBmYWxzZSxcbiAgICAgICAgXCJkb3duXCI6IGZhbHNlXG4gICAgfTtcblxuICAgIC8vIGN1cnJlbnQgaG9yaXpvbnRhbCBwb3NpdGlvblxuICAgIHZhciBzMWxlZnQgPSBzcHJpdGUxSW5mb1tcInhQb3NcIl07XG4gICAgdmFyIHMxcmlnaHQgPSBzMWxlZnQgKyBzcHJpdGUxSW5mb1tcIndpZHRoXCJdO1xuXG4gICAgdmFyIHMybGVmdCA9IHNwcml0ZTJJbmZvW1wieFBvc1wiXTtcbiAgICB2YXIgczJyaWdodCA9IHMybGVmdCArIHNwcml0ZTJJbmZvW1wid2lkdGhcIl07XG5cbiAgICAvLyByZXZlcnNlIGhvcml6b250YWwgcG9zaXRpb24gYnkgeFNwZWVkIHdpdGggcGVyY2VudCBtYXJnaW5cbiAgICB2YXIgc3ByaXRlMVhTcGVlZCA9IHNwcml0ZTFJbmZvW1wieFNwZWVkXCJdICogcGVyY2VudE1hcmdpbjtcbiAgICBzMWxlZnQgPSBzMWxlZnQgLSBzcHJpdGUxWFNwZWVkO1xuICAgIHMxcmlnaHQgPSBzMXJpZ2h0IC0gc3ByaXRlMVhTcGVlZDtcblxuICAgIHZhciBzcHJpdGUyWFNwZWVkID0gc3ByaXRlMkluZm9bXCJ4U3BlZWRcIl0gKiBwZXJjZW50TWFyZ2luO1xuICAgIHMybGVmdCA9IHMybGVmdCAtIHNwcml0ZTJYU3BlZWQ7XG4gICAgczJyaWdodCA9IHMycmlnaHQgLSBzcHJpdGUyWFNwZWVkO1xuXG4gICAgaWYgKHMxcmlnaHQgPD0gczJsZWZ0KSB7XG4gICAgICAgIGRpcltcImxlZnRcIl0gPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoczJyaWdodCA8PSBzMWxlZnQpIHtcbiAgICAgICAgZGlyW1wicmlnaHRcIl0gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIGN1cnJlbnQgdmVydGljYWwgcG9zaXRpb25cbiAgICB2YXIgczF0b3AgPSBzcHJpdGUxSW5mb1tcInlQb3NcIl07XG4gICAgdmFyIHMxYm90dG9tID0gczF0b3AgKyBzcHJpdGUxSW5mb1tcImhlaWdodFwiXTtcblxuICAgIHZhciBzMnRvcCA9IHNwcml0ZTJJbmZvW1wieVBvc1wiXTtcbiAgICB2YXIgczJib3R0b20gPSBzMnRvcCArIHNwcml0ZTJJbmZvW1wiaGVpZ2h0XCJdO1xuXG4gICAgLy8gcmV2ZXJzZSB2ZXJ0aWNhbCBwb3NpdGlvbiBieSB5U3BlZWQgd2l0aCBwZXJjZW50IG1hcmdpblxuICAgIHZhciBzcHJpdGUxWVNwZWVkID0gc3ByaXRlMUluZm9bXCJ5U3BlZWRcIl0gKiBwZXJjZW50TWFyZ2luO1xuICAgIHMxdG9wID0gczF0b3AgLSBzcHJpdGUxWVNwZWVkO1xuICAgIHMxYm90dG9tID0gczFib3R0b20gLSBzcHJpdGUxWVNwZWVkO1xuXG4gICAgdmFyIHNwcml0ZTJZU3BlZWQgPSBzcHJpdGUySW5mb1tcInlTcGVlZFwiXSAqIHBlcmNlbnRNYXJnaW47XG4gICAgczJ0b3AgPSBzMnRvcCAtIHNwcml0ZTJZU3BlZWQ7XG4gICAgczJib3R0b20gPSBzMmJvdHRvbSAtIHNwcml0ZTJZU3BlZWQ7XG5cbiAgICBpZiAoczFib3R0b20gPD0gczJ0b3ApIHtcbiAgICAgICAgZGlyW1widXBcIl0gPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoczJib3R0b20gPD0gczF0b3ApIHtcbiAgICAgICAgZGlyW1wiZG93blwiXSA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpcjtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRLZXlTdGF0ZSA9IChrZXk6IG51bWJlcik6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiAhISQuZ1Eua2V5VHJhY2tlcltrZXldO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldE1vdXNlWCA9ICgpOiBudW1iZXIgPT4ge1xuICAgIHJldHVybiAkLmdRLm1vdXNlVHJhY2tlci54O1xufTtcbmV4cG9ydCBjb25zdCBnZXRNb3VzZVkgPSAoKTogbnVtYmVyID0+IHtcbiAgICByZXR1cm4gJC5nUS5tb3VzZVRyYWNrZXIueTtcbn07XG5leHBvcnQgY29uc3QgZ2V0TW91c2VCdXR0b24xID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiAhISQuZ1EubW91c2VUcmFja2VyWzFdO1xufTtcbmV4cG9ydCBjb25zdCBnZXRNb3VzZUJ1dHRvbjIgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgcmV0dXJuICEhJC5nUS5tb3VzZVRyYWNrZXJbMl07XG59O1xuZXhwb3J0IGNvbnN0IGdldE1vdXNlQnV0dG9uMyA9ICgpOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gISEkLmdRLm1vdXNlVHJhY2tlclszXTtcbn07XG5cbmV4cG9ydCBjb25zdCBkaXNhYmxlQ29udGV4dE1lbnUgPSAoKTogdm9pZCA9PiB7XG4gICAgLy8gc2VlIGFsc286IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ5MjAyMjEvanF1ZXJ5LWpzLXByZXZlbnQtcmlnaHQtY2xpY2stbWVudS1pbi1icm93c2Vyc1xuICAgIC8vICQoXCIjcGxheWdyb3VuZFwiKS5jb250ZXh0bWVudShmdW5jdGlvbigpe3JldHVybiBmYWxzZTt9KTtcbiAgICAkKFwiI3BsYXlncm91bmRcIikub24oXCJjb250ZXh0bWVudVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbn07XG5leHBvcnQgY29uc3QgZW5hYmxlQ29udGV4dE1lbnUgPSAoKTogdm9pZCA9PiB7XG4gICAgLy8gc2VlIGFsc286IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ5MjAyMjEvanF1ZXJ5LWpzLXByZXZlbnQtcmlnaHQtY2xpY2stbWVudS1pbi1icm93c2Vyc1xuICAgICQoXCIjcGxheWdyb3VuZFwiKS5vZmYoXCJjb250ZXh0bWVudVwiKTtcbn07XG5cbmV4cG9ydCBjb25zdCBoaWRlTW91c2VDdXJzb3IgPSAoKTogdm9pZCA9PiB7XG4gICAgJChcIiNwbGF5Z3JvdW5kXCIpLmNzcyhcImN1cnNvclwiLCBcIm5vbmVcIik7XG59O1xuZXhwb3J0IGNvbnN0IHNob3dNb3VzZUN1cnNvciA9ICgpOiB2b2lkID0+IHtcbiAgICAkKFwiI3BsYXlncm91bmRcIikuY3NzKFwiY3Vyc29yXCIsIFwiZGVmYXVsdFwiKTtcbn07XG5cbmV4cG9ydCBjb25zdCBzYXZlRGljdGlvbmFyeUFzID0gKHNhdmVBczogc3RyaW5nLCBkaWN0aW9uYXJ5OiBvYmplY3QpOiB2b2lkID0+IHtcbiAgICAvLyByZXF1aXJlcyBqcy1jb29raWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qcy1jb29raWUvanMtY29va2llL3RyZWUvdjIuMC40XG4gICAgQ29va2llcy5zZXQoXCJHUUdfXCIgKyBzYXZlQXMsIGRpY3Rpb25hcnkpO1xufTtcbmV4cG9ydCBjb25zdCBnZXRTYXZlZERpY3Rpb25hcnkgPSAoc2F2ZWRBczogc3RyaW5nKTogb2JqZWN0ID0+IHtcbiAgICByZXR1cm4gQ29va2llcy5nZXRKU09OKFwiR1FHX1wiICsgc2F2ZWRBcyk7XG59O1xuZXhwb3J0IGNvbnN0IGRlbGV0ZVNhdmVkRGljdGlvbmFyeSA9IChzYXZlZEFzOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBDb29raWVzLnJlbW92ZShcIkdRR19cIiArIHNhdmVkQXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZU92YWxJbkdyb3VwID0gKFxuICAgIGdyb3VwTmFtZTogc3RyaW5nIHwgbnVsbCxcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICAvLyByb3RkZWcgaW4gZGVncmVlcyBjbG9ja3dpc2Ugb24gc2NyZWVuIChyZWNhbGwgeS1heGlzIHBvaW50cyBkb3dud2FyZHMhKVxuXG4gICAgaWYgKCFjb2xvcikge1xuICAgICAgICBjb2xvciA9IFwiZ3JheVwiO1xuICAgIH1cblxuICAgIGlmICghZ3JvdXBOYW1lKSB7XG4gICAgICAgICQucGxheWdyb3VuZCgpLmFkZFNwcml0ZShpZCwgeyB3aWR0aDogMSwgaGVpZ2h0OiAxIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNyZWF0ZVNwcml0ZUluR3JvdXAoZ3JvdXBOYW1lLCBpZCwgeyB3aWR0aDogMSwgaGVpZ2h0OiAxIH0pO1xuICAgIH1cblxuICAgIHZhciBib3JkZXJfcmFkaXVzID0gKHcgLyAyICsgXCJweCAvIFwiICsgaCAvIDIgKyBcInB4XCIpO1xuICAgIHNwcml0ZShpZClcbiAgICAgICAgLmNzcyhcImJhY2tncm91bmRcIiwgY29sb3IpXG4gICAgICAgIC5jc3MoXCJib3JkZXItcmFkaXVzXCIsIGJvcmRlcl9yYWRpdXMpXG4gICAgICAgIC5jc3MoXCItbW96LWJvcmRlci1yYWRpdXNcIiwgYm9yZGVyX3JhZGl1cylcbiAgICAgICAgLmNzcyhcIi13ZWJraXQtYm9yZGVyLXJhZGl1c1wiLCBib3JkZXJfcmFkaXVzKTtcblxuICAgIHNwcml0ZVNldFdpZHRoSGVpZ2h0KGlkLCB3LCBoKTtcbiAgICBzcHJpdGVTZXRYWShpZCwgeCwgeSk7XG5cbiAgICBpZiAocm90ZGVnKSB7XG4gICAgICAgIGlmIChyb3RPcmlnaW5YICYmIHJvdE9yaWdpblkpIHtcbiAgICAgICAgICAgIHZhciByb3RPcmlnaW4gPSByb3RPcmlnaW5YICsgXCJweCBcIiArIHJvdE9yaWdpblkgKyBcInB4XCI7XG4gICAgICAgICAgICBzcHJpdGUoaWQpXG4gICAgICAgICAgICAgICAgLmNzcyhcIi13ZWJraXQtdHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pXG4gICAgICAgICAgICAgICAgLmNzcyhcIi1tb3otdHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pXG4gICAgICAgICAgICAgICAgLmNzcyhcIi1tcy10cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbilcbiAgICAgICAgICAgICAgICAuY3NzKFwiLW8tdHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pXG4gICAgICAgICAgICAgICAgLmNzcyhcInRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKTtcbiAgICAgICAgfVxuICAgICAgICBzcHJpdGVSb3RhdGUoaWQsIHJvdGRlZyk7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVPdmFsID0gKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICB3OiBudW1iZXIsXG4gICAgaDogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHJvdGRlZz86IG51bWJlcixcbiAgICByb3RPcmlnaW5YPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblk/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZU92YWxJbkdyb3VwKFxuICAgICAgICBudWxsLFxuICAgICAgICBpZCxcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgdyxcbiAgICAgICAgaCxcbiAgICAgICAgY29sb3IsXG4gICAgICAgIHJvdGRlZyxcbiAgICAgICAgcm90T3JpZ2luWCxcbiAgICAgICAgcm90T3JpZ2luWVxuICAgICk7XG59O1xuZXhwb3J0IGNvbnN0IGRyYXdPdmFsID0gKFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVPdmFsKFxuICAgICAgICBcIkdRR19vdmFsX1wiICsgR1FHX2dldFVuaXF1ZUlkKCksXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHcsXG4gICAgICAgIGgsXG4gICAgICAgIGNvbG9yLFxuICAgICAgICByb3RkZWcsXG4gICAgICAgIHJvdE9yaWdpblgsXG4gICAgICAgIHJvdE9yaWdpbllcbiAgICApO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVDaXJjbGVJbkdyb3VwID0gKFxuICAgIGdyb3VwTmFtZTogc3RyaW5nIHwgbnVsbCxcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgcjogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHJvdGRlZz86IG51bWJlcixcbiAgICByb3RPcmlnaW5YPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblk/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZU92YWxJbkdyb3VwKFxuICAgICAgICBncm91cE5hbWUsXG4gICAgICAgIGlkLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICByLFxuICAgICAgICByLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlQ2lyY2xlID0gKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICByOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgY3JlYXRlQ2lyY2xlSW5Hcm91cChcbiAgICAgICAgbnVsbCxcbiAgICAgICAgaWQsXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHIsXG4gICAgICAgIGNvbG9yLFxuICAgICAgICByb3RkZWcsXG4gICAgICAgIHJvdE9yaWdpblgsXG4gICAgICAgIHJvdE9yaWdpbllcbiAgICApO1xufTtcbmV4cG9ydCBjb25zdCBkcmF3Q2lyY2xlID0gKFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgcjogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHJvdGRlZz86IG51bWJlcixcbiAgICByb3RPcmlnaW5YPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblk/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZUNpcmNsZShcbiAgICAgICAgXCJHUUdfY2lyY2xlX1wiICsgR1FHX2dldFVuaXF1ZUlkKCksXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHIsXG4gICAgICAgIGNvbG9yLFxuICAgICAgICByb3RkZWcsXG4gICAgICAgIHJvdE9yaWdpblgsXG4gICAgICAgIHJvdE9yaWdpbllcbiAgICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVJlY3RJbkdyb3VwID0gKFxuICAgIGdyb3VwTmFtZTogc3RyaW5nIHwgbnVsbCxcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICAvLyByb3RkZWcgaW4gZGVncmVlcyBjbG9ja3dpc2Ugb24gc2NyZWVuIChyZWNhbGwgeS1heGlzIHBvaW50cyBkb3dud2FyZHMhKVxuICAgIC8vIHJvdE9yaWdpbntYLFl9IG11c3QgYmUgd2l0aGluIHJhbmdlIG9mIHdpZGUgdyBhbmQgaGVpZ2h0IGgsIGFuZCByZWxhdGl2ZSB0byBjb29yZGluYXRlICh4LHkpLlxuXG4gICAgaWYgKCFjb2xvcikge1xuICAgICAgICBjb2xvciA9IFwiZ3JheVwiO1xuICAgIH1cblxuICAgIGlmICghZ3JvdXBOYW1lKSB7XG4gICAgICAgICQucGxheWdyb3VuZCgpLmFkZFNwcml0ZShpZCwgeyB3aWR0aDogMSwgaGVpZ2h0OiAxIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNyZWF0ZVNwcml0ZUluR3JvdXAoZ3JvdXBOYW1lLCBpZCwgeyB3aWR0aDogMSwgaGVpZ2h0OiAxIH0pO1xuICAgIH1cblxuICAgIHNwcml0ZShpZCkuY3NzKFwiYmFja2dyb3VuZFwiLCBjb2xvcik7XG5cbiAgICBzcHJpdGVTZXRXaWR0aEhlaWdodChpZCwgdywgaCk7XG4gICAgc3ByaXRlU2V0WFkoaWQsIHgsIHkpO1xuXG4gICAgaWYgKHJvdGRlZykge1xuICAgICAgICBpZiAocm90T3JpZ2luWCAmJiByb3RPcmlnaW5ZKSB7XG4gICAgICAgICAgICB2YXIgcm90T3JpZ2luID0gcm90T3JpZ2luWCArIFwicHggXCIgKyByb3RPcmlnaW5ZICsgXCJweFwiO1xuICAgICAgICAgICAgc3ByaXRlKGlkKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItd2Via2l0LXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItbW96LXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCItbXMtdHJhbnNmb3JtLW9yaWdpblwiLCByb3RPcmlnaW4pXG4gICAgICAgICAgICAgICAgLmNzcyhcIi1vLXRyYW5zZm9ybS1vcmlnaW5cIiwgcm90T3JpZ2luKVxuICAgICAgICAgICAgICAgIC5jc3MoXCJ0cmFuc2Zvcm0tb3JpZ2luXCIsIHJvdE9yaWdpbik7XG4gICAgICAgIH1cbiAgICAgICAgc3ByaXRlUm90YXRlKGlkLCByb3RkZWcpO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgY3JlYXRlUmVjdCA9IChcbiAgICBpZDogc3RyaW5nLFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgdzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICByb3RkZWc/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWD86IG51bWJlcixcbiAgICByb3RPcmlnaW5ZPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVSZWN0SW5Hcm91cChcbiAgICAgICAgbnVsbCxcbiAgICAgICAgaWQsXG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHcsXG4gICAgICAgIGgsXG4gICAgICAgIGNvbG9yLFxuICAgICAgICByb3RkZWcsXG4gICAgICAgIHJvdE9yaWdpblgsXG4gICAgICAgIHJvdE9yaWdpbllcbiAgICApO1xufTtcbmV4cG9ydCBjb25zdCBkcmF3UmVjdCA9IChcbiAgICB4OiBudW1iZXIsXG4gICAgeTogbnVtYmVyLFxuICAgIHc6IG51bWJlcixcbiAgICBoOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgcm90ZGVnPzogbnVtYmVyLFxuICAgIHJvdE9yaWdpblg/OiBudW1iZXIsXG4gICAgcm90T3JpZ2luWT86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgY3JlYXRlUmVjdChcbiAgICAgICAgXCJHUUdfcmVjdF9cIiArIEdRR19nZXRVbmlxdWVJZCgpLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICB3LFxuICAgICAgICBoLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICByb3RPcmlnaW5YLFxuICAgICAgICByb3RPcmlnaW5ZXG4gICAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVMaW5lSW5Hcm91cCA9IChcbiAgICBncm91cE5hbWU6IHN0cmluZyB8IG51bGwsXG4gICAgaWQ6IHN0cmluZyxcbiAgICB4MTogbnVtYmVyLFxuICAgIHkxOiBudW1iZXIsXG4gICAgeDI6IG51bWJlcixcbiAgICB5MjogbnVtYmVyLFxuICAgIGNvbG9yPzogc3RyaW5nLFxuICAgIHRoaWNrbmVzcz86IG51bWJlclxuKTogdm9pZCA9PiB7XG4gICAgaWYgKCFjb2xvcikge1xuICAgICAgICBjb2xvciA9IFwiZ3JheVwiO1xuICAgIH1cbiAgICBpZiAoIXRoaWNrbmVzcykge1xuICAgICAgICB0aGlja25lc3MgPSAyO1xuICAgIH1cbiAgICB2YXIgeGQgPSB4MiAtIHgxO1xuICAgIHZhciB5ZCA9IHkyIC0geTE7XG4gICAgdmFyIGRpc3QgPSBNYXRoLnNxcnQoeGQgKiB4ZCArIHlkICogeWQpO1xuXG4gICAgdmFyIGFyY0NvcyA9IE1hdGguYWNvcyh4ZCAvIGRpc3QpO1xuICAgIGlmICh5MiA8IHkxKSB7XG4gICAgICAgIGFyY0NvcyAqPSAtMTtcbiAgICB9XG4gICAgdmFyIHJvdGRlZyA9IGFyY0NvcyAqIDE4MCAvIE1hdGguUEk7XG5cbiAgICB2YXIgaGFsZlRoaWNrID0gdGhpY2tuZXNzIC8gMjtcbiAgICB2YXIgZHJhd1kxID0geTEgLSBoYWxmVGhpY2s7XG5cbiAgICBjcmVhdGVSZWN0SW5Hcm91cChcbiAgICAgICAgZ3JvdXBOYW1lLFxuICAgICAgICBpZCxcbiAgICAgICAgeDEsXG4gICAgICAgIGRyYXdZMSxcbiAgICAgICAgZGlzdCxcbiAgICAgICAgdGhpY2tuZXNzLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgcm90ZGVnLFxuICAgICAgICAwLFxuICAgICAgICBoYWxmVGhpY2tcbiAgICApO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVMaW5lID0gKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgeDE6IG51bWJlcixcbiAgICB5MTogbnVtYmVyLFxuICAgIHgyOiBudW1iZXIsXG4gICAgeTI6IG51bWJlcixcbiAgICBjb2xvcj86IHN0cmluZyxcbiAgICB0aGlja25lc3M/OiBudW1iZXJcbik6IHZvaWQgPT4ge1xuICAgIGNyZWF0ZUxpbmVJbkdyb3VwKG51bGwsIGlkLCB4MSwgeTEsIHgyLCB5MiwgY29sb3IsIHRoaWNrbmVzcyk7XG59O1xuZXhwb3J0IGNvbnN0IGRyYXdMaW5lID0gKFxuICAgIHgxOiBudW1iZXIsXG4gICAgeTE6IG51bWJlcixcbiAgICB4MjogbnVtYmVyLFxuICAgIHkyOiBudW1iZXIsXG4gICAgY29sb3I/OiBzdHJpbmcsXG4gICAgdGhpY2tuZXNzPzogbnVtYmVyXG4pOiB2b2lkID0+IHtcbiAgICBjcmVhdGVMaW5lKFwiR1FHX2xpbmVfXCIgKyBHUUdfZ2V0VW5pcXVlSWQoKSwgeDEsIHkxLCB4MiwgeTIsIGNvbG9yLCB0aGlja25lc3MpO1xufTtcblxuZXhwb3J0IHR5cGUgQ29udGFpbmVySXRlcmF0b3IgPSB7XG4gICAgbmV4dDogKCkgPT4gW251bWJlciwgbnVtYmVyXTtcbiAgICBoYXNOZXh0OiAoKSA9PiBib29sZWFuO1xuICAgIGN1cnJlbnQ6IG51bWJlcjtcbiAgICBlbmQ6IG51bWJlcjtcbiAgICBfa2V5czogc3RyaW5nW107XG59O1xuZXhwb3J0IHR5cGUgTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4gPSAobjogbnVtYmVyKSA9PiBudW1iZXIgfCBSZWNvcmQ8XG4gICAgbnVtYmVyLFxuICAgIG51bWJlclxuPjtcbmV4cG9ydCB0eXBlIENyZWF0ZUNvbnRhaW5lckl0ZXJhdG9yRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXJcbiAgICApOiBDb250YWluZXJJdGVyYXRvcjtcbiAgICAodGhpczogdm9pZCwgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4pOiBDb250YWluZXJJdGVyYXRvcjtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlQ29udGFpbmVySXRlcmF0b3I6IENyZWF0ZUNvbnRhaW5lckl0ZXJhdG9yRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICBzdGFydD86IG51bWJlcixcbiAgICBlbmQ/OiBudW1iZXIsXG4gICAgc3RlcHNpemU/OiBudW1iZXJcbik6IENvbnRhaW5lckl0ZXJhdG9yIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgZiA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBjb25zdCBmT3duUHJvcE5hbWVzOiBzdHJpbmdbXSA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGYpO1xuICAgICAgICBjb25zdCBpdDogQ29udGFpbmVySXRlcmF0b3IgPSB7XG4gICAgICAgICAgICBjdXJyZW50OiAwLFxuICAgICAgICAgICAgZW5kOiBmT3duUHJvcE5hbWVzLmxlbmd0aCxcbiAgICAgICAgICAgIF9rZXlzOiBmT3duUHJvcE5hbWVzLFxuICAgICAgICAgICAgbmV4dDogZnVuY3Rpb24gKHRoaXM6IENvbnRhaW5lckl0ZXJhdG9yKTogW251bWJlciwgbnVtYmVyXSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbUlkeCA9IHRoaXMuX2tleXNbdGhpcy5jdXJyZW50XTtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtOiBbbnVtYmVyLCBudW1iZXJdID0gW051bWJlcihpdGVtSWR4KSwgZltpdGVtSWR4XV07XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Kys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGFzTmV4dDogZnVuY3Rpb24gKHRoaXM6IENvbnRhaW5lckl0ZXJhdG9yKTogYm9vbGVhbiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLmN1cnJlbnQgPCB0aGlzLmVuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBpdDtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwic3RhcnQgbXVzdCBiZSBhIG51bWJlci5cIiwgc3RhcnQpO1xuICAgICAgICB0aHJvd0lmTm90RmluaXRlTnVtYmVyKFwiZW5kIG11c3QgYmUgYSBudW1iZXIuXCIsIGVuZCk7XG4gICAgICAgIHRocm93SWZOb3RGaW5pdGVOdW1iZXIoXCJzdGVwc2l6ZSBtdXN0IGJlIGEgbnVtYmVyLlwiLCBzdGVwc2l6ZSk7XG4gICAgICAgIGlmIChzdGFydCA9PSBudWxsIHx8IGVuZCA9PSBudWxsIHx8IHN0ZXBzaXplID09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IFwiVFMgdHlwZSBoaW50XCI7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmeDogKG46IG51bWJlcikgPT4gbnVtYmVyID0gKHR5cGVvZiBmID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICAgID8gKGYgYXMgKHg6IG51bWJlcikgPT4gbnVtYmVyKVxuICAgICAgICAgICAgOiAoeDogbnVtYmVyKTogbnVtYmVyID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTnVtYmVyKGZbeF0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGl0OiBDb250YWluZXJJdGVyYXRvciA9IHtcbiAgICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uICh0aGlzOiBDb250YWluZXJJdGVyYXRvcik6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW06IFtudW1iZXIsIG51bWJlcl0gPSBbdGhpcy5jdXJyZW50LCBmeCh0aGlzLmN1cnJlbnQpXTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQgKz0gc3RlcHNpemU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGFzTmV4dDogZnVuY3Rpb24gKHRoaXM6IENvbnRhaW5lckl0ZXJhdG9yKTogYm9vbGVhbiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLmN1cnJlbnQgPCB0aGlzLmVuZCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3VycmVudDogc3RhcnQsXG4gICAgICAgICAgICBlbmQ6IGVuZCxcbiAgICAgICAgICAgIF9rZXlzOiB0eXBlb2YgZiAhPT0gXCJmdW5jdGlvblwiID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZikgOiAoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBrOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IHN0ZXBzaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIGsucHVzaChTdHJpbmcoaSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaztcbiAgICAgICAgICAgIH0pKClcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGl0O1xuICAgIH1cbn07XG5leHBvcnQgdHlwZSBHcmFwaENyZWF0aW9uT3B0aW9ucyA9IHtcbiAgICBpbnRlcnBvbGF0ZWQ6IGJvb2xlYW47XG59O1xuZXhwb3J0IHR5cGUgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnMsXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICByYWRpdXNfdGhpY2tuZXNzOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgbW9yZU9wdHM6IEdyYXBoQ3JlYXRpb25PcHRpb25zLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnMsXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIG1vcmVPcHRzOiBHcmFwaENyZWF0aW9uT3B0aW9ucyxcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgcmFkaXVzX3RoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIG1vcmVPcHRzOiBHcmFwaENyZWF0aW9uT3B0aW9ucyxcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBtb3JlT3B0czogR3JhcGhDcmVhdGlvbk9wdGlvbnNcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbn07XG5leHBvcnQgdHlwZSBHcm91cE5hbWVBbmRJZFByZWZpeCA9IHtcbiAgICBcImlkXCI6IHN0cmluZztcbiAgICBcImdyb3VwXCI6IHN0cmluZztcbn07XG50eXBlIENyZWF0ZUdyYXBoV2l0aE9wdGlvbnNGblBhcmFtVHlwZXMgPSBbXG4gICAgc3RyaW5nLFxuICAgIHN0cmluZyxcbiAgICBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICBHcmFwaENyZWF0aW9uT3B0aW9uc1xuXTtcbmV4cG9ydCBjb25zdCBjcmVhdGVHcmFwaFdpdGhPcHRpb25zOiBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZCxcbiAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICBpZDogc3RyaW5nLFxuICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgIG1vcmVPcHRzOiBHcmFwaENyZWF0aW9uT3B0aW9uc1xuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXgge1xuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIG1vcmVPcHRzLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIHJhZGl1c190aGlja25lc3MpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgbW9yZU9wdHMsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBtb3JlT3B0cywgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgbW9yZU9wdHMsIGNvbG9yLCByYWRpdXNfdGhpY2tuZXNzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIG1vcmVPcHRzLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBtb3JlT3B0cylcbiAgICAvLyBtb3JlT3B0cyA9IHtcImludGVycG9sYXRlZFwiOiB0cnVlT3JGYWxzZX1cbiAgICB2YXIgaW50ZXJwb2xhdGVkID0gbW9yZU9wdHNbXCJpbnRlcnBvbGF0ZWRcIl07XG5cbiAgICBpZiAoIWlkKSB7XG4gICAgICAgIGlkID0gXCJHUUdfZ3JhcGhfXCIgKyBHUUdfZ2V0VW5pcXVlSWQoKTtcbiAgICB9XG4gICAgaWYgKCFncm91cE5hbWUpIHtcbiAgICAgICAgZ3JvdXBOYW1lID0gaWQgKyBcIl9ncm91cFwiO1xuICAgICAgICBjcmVhdGVHcm91cEluUGxheWdyb3VuZChncm91cE5hbWUpO1xuICAgIH1cbiAgICB2YXIgZ3JvdXBfaWQgPSB7XG4gICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgIFwiZ3JvdXBcIjogZ3JvdXBOYW1lXG4gICAgfTtcblxuICAgIHZhciBjb2xvcjtcbiAgICB2YXIgcmFkaXVzX3RoaWNrbmVzcztcbiAgICBsZXQgaXRlcjogQ29udGFpbmVySXRlcmF0b3I7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCAmJiBhcmd1bWVudHMubGVuZ3RoIDw9IDYgJiZcbiAgICAgICAgXCJvYmplY3RcIiA9PT0gdHlwZW9mIChmKSkge1xuICAgICAgICBjb2xvciA9IGFyZ3VtZW50c1s0XTtcbiAgICAgICAgcmFkaXVzX3RoaWNrbmVzcyA9IGFyZ3VtZW50c1s1XTtcbiAgICAgICAgaXRlciA9IGNyZWF0ZUNvbnRhaW5lckl0ZXJhdG9yKGYpO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA3ICYmIGFyZ3VtZW50cy5sZW5ndGggPD0gOSkge1xuICAgICAgICB2YXIgc3RhcnQgPSBhcmd1bWVudHNbNF07XG4gICAgICAgIHZhciBlbmQgPSBhcmd1bWVudHNbNV07XG4gICAgICAgIHZhciBzdGVwc2l6ZSA9IGFyZ3VtZW50c1s2XTtcbiAgICAgICAgY29sb3IgPSBhcmd1bWVudHNbN107XG4gICAgICAgIHJhZGl1c190aGlja25lc3MgPSBhcmd1bWVudHNbOF07XG4gICAgICAgIGl0ZXIgPSBjcmVhdGVDb250YWluZXJJdGVyYXRvcihmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3dDb25zb2xlRXJyb3JJbk15cHJvZ3JhbShcIkZ1bmN0aW9uIHVzZWQgd2l0aCB3cm9uZyBudW1iZXIgb2YgYXJndW1lbnRzXCIpO1xuICAgICAgICB0aHJvdyBcIlRTIHR5cGUgaGludFwiO1xuICAgIH1cblxuICAgIGlmIChjb2xvciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29sb3IgPSBcImdyYXlcIjtcbiAgICB9XG4gICAgaWYgKHJhZGl1c190aGlja25lc3MgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJhZGl1c190aGlja25lc3MgPSAyO1xuICAgIH1cblxuICAgIHZhciBjdXJyWCA9IG51bGw7XG4gICAgdmFyIGN1cnJZID0gbnVsbDtcbiAgICB3aGlsZSAoaXRlci5oYXNOZXh0KCkpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBpdGVyLm5leHQoKTtcbiAgICAgICAgdmFyIGkgPSBpdGVtWzBdO1xuICAgICAgICB2YXIgZnhpID0gaXRlbVsxXTtcblxuICAgICAgICBpZiAoZnhpID09PSBJbmZpbml0eSkge1xuICAgICAgICAgICAgZnhpID0gR1FHX01BWF9TQUZFX1BMQVlHUk9VTkRfSU5URUdFUjtcbiAgICAgICAgfSBlbHNlIGlmIChmeGkgPT09IC1JbmZpbml0eSkge1xuICAgICAgICAgICAgZnhpID0gR1FHX01JTl9TQUZFX1BMQVlHUk9VTkRfSU5URUdFUjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdXJyWSA9PT0gbnVsbCAmJiBmeGkgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjdXJyWCA9IGk7XG4gICAgICAgICAgICBjdXJyWSA9IGZ4aTtcbiAgICAgICAgICAgIGlmICghaW50ZXJwb2xhdGVkKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlQ2lyY2xlSW5Hcm91cChcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBfaWRbXCJncm91cFwiXSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBfaWRbXCJpZFwiXSArIFwiX2dyYXBoX3B0X1wiICsgaSxcbiAgICAgICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICAgICAgZnhpLFxuICAgICAgICAgICAgICAgICAgICByYWRpdXNfdGhpY2tuZXNzLFxuICAgICAgICAgICAgICAgICAgICBjb2xvclxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZnhpICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKCFpbnRlcnBvbGF0ZWQpIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVDaXJjbGVJbkdyb3VwKFxuICAgICAgICAgICAgICAgICAgICBncm91cF9pZFtcImdyb3VwXCJdLFxuICAgICAgICAgICAgICAgICAgICBncm91cF9pZFtcImlkXCJdICsgXCJfZ3JhcGhfcHRfXCIgKyBpLFxuICAgICAgICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICAgICAgICBmeGksXG4gICAgICAgICAgICAgICAgICAgIHJhZGl1c190aGlja25lc3MsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlTGluZUluR3JvdXAoXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwX2lkW1wiZ3JvdXBcIl0sXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwX2lkW1wiaWRcIl0gKyBcIl9ncmFwaF9saW5lX1wiICsgY3VyclggKyBcIi1cIiArIGksXG4gICAgICAgICAgICAgICAgICAgIGN1cnJYIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgY3VyclkgYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICAgICAgICBmeGksXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yLFxuICAgICAgICAgICAgICAgICAgICByYWRpdXNfdGhpY2tuZXNzXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1cnJYID0gaTtcbiAgICAgICAgICAgIGN1cnJZID0gZnhpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGdyb3VwX2lkO1xufTtcblxudHlwZSBDcmVhdGVHcmFwaEluR3JvdXBGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiB2b2lkO1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogdm9pZDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IHZvaWQ7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm5cbiAgICApOiB2b2lkO1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVHcmFwaEluR3JvdXA6IENyZWF0ZUdyYXBoSW5Hcm91cEZuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IHZvaWQsXG4gICAgZ3JvdXBOYW1lOiBzdHJpbmcsXG4gICAgaWQ6IHN0cmluZyxcbiAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGblxuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXgge1xuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvciwgZG90UmFkaXVzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSlcbiAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmLCBjb2xvciwgZG90UmFkaXVzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYpXG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIGFyZ3Muc3BsaWNlKDMsIDAsIHsgXCJpbnRlcnBvbGF0ZWRcIjogZmFsc2UgfSk7XG4gICAgcmV0dXJuIGNyZWF0ZUdyYXBoV2l0aE9wdGlvbnMuYXBwbHkoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIGFyZ3MgYXMgQ3JlYXRlR3JhcGhXaXRoT3B0aW9uc0ZuUGFyYW1UeXBlc1xuICAgICk7XG59O1xuXG50eXBlIENyZWF0ZUdyYXBoRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgICh0aGlzOiB2b2lkLCBpZDogc3RyaW5nLCBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbik6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVHcmFwaDogQ3JlYXRlR3JhcGhGbiA9IGZ1bmN0aW9uIChcbiAgICB0aGlzOiB2b2lkXG4pOiBHcm91cE5hbWVBbmRJZFByZWZpeCB7XG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvciwgZG90UmFkaXVzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBjb2xvciwgZG90UmFkaXVzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZilcbiAgICB2YXIgb3B0cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgb3B0cy5zcGxpY2UoMCwgMCwgbnVsbCk7XG4gICAgb3B0cy5zcGxpY2UoMywgMCwgeyBcImludGVycG9sYXRlZFwiOiBmYWxzZSB9KTtcbiAgICByZXR1cm4gY3JlYXRlR3JhcGhXaXRoT3B0aW9ucy5hcHBseShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgb3B0cyBhcyBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzXG4gICAgKTtcbn07XG5cbnR5cGUgRHJhd0dyYXBoRm4gPSB7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIGRvdFJhZGl1czogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgICh0aGlzOiB2b2lkLCBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbik6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xufTtcbmV4cG9ydCBjb25zdCBkcmF3R3JhcGg6IERyYXdHcmFwaEZuID0gZnVuY3Rpb24gZHJhd0dyYXBoKFxuICAgIHRoaXM6IHZvaWRcbik6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoZiwgY29sb3IsIGRvdFJhZGl1cylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmKVxuICAgIHZhciBvcHRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBvcHRzLnNwbGljZSgwLCAwLCBudWxsKTtcbiAgICBvcHRzLnNwbGljZSgwLCAwLCBudWxsKTtcbiAgICBvcHRzLnNwbGljZSgzLCAwLCB7IFwiaW50ZXJwb2xhdGVkXCI6IGZhbHNlIH0pO1xuICAgIHJldHVybiBjcmVhdGVHcmFwaFdpdGhPcHRpb25zLmFwcGx5KFxuICAgICAgICB0aGlzLFxuICAgICAgICBvcHRzIGFzIENyZWF0ZUdyYXBoV2l0aE9wdGlvbnNGblBhcmFtVHlwZXNcbiAgICApO1xufTtcblxudHlwZSBDcmVhdGVJbnRlcnBvbGF0ZWRHcmFwaEluR3JvdXBGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXIsXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIHRoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgIHRoaWNrbmVzczogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBncm91cE5hbWU6IHN0cmluZyxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGblxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xufTtcbmV4cG9ydCBjb25zdCBjcmVhdGVJbnRlcnBvbGF0ZWRHcmFwaEluR3JvdXA6IENyZWF0ZUludGVycG9sYXRlZEdyYXBoSW5Hcm91cEZuID1cbiAgICBmdW5jdGlvbiAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGdyb3VwTmFtZTogc3RyaW5nLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGblxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4IHtcbiAgICAgICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yLCB0aGlja25lc3MpXG4gICAgICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvcilcbiAgICAgICAgLy8gZm4gc2lnbmF0dXJlOiAoZ3JvdXBOYW1lLCBpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUpXG4gICAgICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIGNvbG9yLCB0aGlja25lc3MpXG4gICAgICAgIC8vIGZuIHNpZ25hdHVyZTogKGdyb3VwTmFtZSwgaWQsIGYsIGNvbG9yKVxuICAgICAgICAvLyBmbiBzaWduYXR1cmU6IChncm91cE5hbWUsIGlkLCBmKVxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIGFyZ3Muc3BsaWNlKDMsIDAsIHsgXCJpbnRlcnBvbGF0ZWRcIjogdHJ1ZSB9KTtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUdyYXBoV2l0aE9wdGlvbnMuYXBwbHkoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgYXJncyBhcyBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzXG4gICAgICAgICk7XG4gICAgfTtcblxudHlwZSBDcmVhdGVJbnRlcnBvbGF0ZWRHcmFwaEZuID0ge1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICB0aGlja25lc3M6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgc3RhcnQ6IG51bWJlcixcbiAgICAgICAgZW5kOiBudW1iZXIsXG4gICAgICAgIHN0ZXBzaXplOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGlkOiBzdHJpbmcsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nLFxuICAgICAgICB0aGlja25lc3M6IG51bWJlclxuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgaWQ6IHN0cmluZyxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIGNvbG9yOiBzdHJpbmdcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAodGhpczogdm9pZCwgaWQ6IHN0cmluZywgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4pOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlSW50ZXJwb2xhdGVkR3JhcGg6IENyZWF0ZUludGVycG9sYXRlZEdyYXBoRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZFxuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXgge1xuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSwgY29sb3IsIHRoaWNrbmVzcylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgc3RhcnQsIGVuZCwgc3RlcHNpemUsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGlkLCBmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSlcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgY29sb3IsIHRoaWNrbmVzcylcbiAgICAvLyBmbiBzaWduYXR1cmU6IChpZCwgZiwgY29sb3IpXG4gICAgLy8gZm4gc2lnbmF0dXJlOiAoaWQsIGYpXG4gICAgdmFyIG9wdHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIG9wdHMuc3BsaWNlKDAsIDAsIG51bGwpO1xuICAgIG9wdHMuc3BsaWNlKDMsIDAsIHsgXCJpbnRlcnBvbGF0ZWRcIjogdHJ1ZSB9KTtcbiAgICByZXR1cm4gY3JlYXRlR3JhcGhXaXRoT3B0aW9ucy5hcHBseShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgb3B0cyBhcyBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzXG4gICAgKTtcbiAgICAvLyByZXR1cm4gY3JlYXRlSW50ZXJwb2xhdGVkR3JhcGhJbkdyb3VwLmFwcGx5KHRoaXMsIG9wdHMpO1xufTtcblxudHlwZSBEcmF3SW50ZXJwb2xhdGVkR3JhcGhGbiA9IHtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgdGhpY2tuZXNzOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBzdGFydDogbnVtYmVyLFxuICAgICAgICBlbmQ6IG51bWJlcixcbiAgICAgICAgc3RlcHNpemU6IG51bWJlcixcbiAgICAgICAgY29sb3I6IHN0cmluZ1xuICAgICk6IEdyb3VwTmFtZUFuZElkUHJlZml4O1xuICAgIChcbiAgICAgICAgdGhpczogdm9pZCxcbiAgICAgICAgZjogTnVtYmVyVG9OdW1iZXJNYXBwaW5nRm4sXG4gICAgICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgICAgIGVuZDogbnVtYmVyLFxuICAgICAgICBzdGVwc2l6ZTogbnVtYmVyXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKFxuICAgICAgICB0aGlzOiB2b2lkLFxuICAgICAgICBmOiBOdW1iZXJUb051bWJlck1hcHBpbmdGbixcbiAgICAgICAgY29sb3I6IHN0cmluZyxcbiAgICAgICAgdGhpY2tuZXNzOiBudW1iZXJcbiAgICApOiBHcm91cE5hbWVBbmRJZFByZWZpeDtcbiAgICAoXG4gICAgICAgIHRoaXM6IHZvaWQsXG4gICAgICAgIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuLFxuICAgICAgICBjb2xvcjogc3RyaW5nXG4gICAgKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG4gICAgKHRoaXM6IHZvaWQsIGY6IE51bWJlclRvTnVtYmVyTWFwcGluZ0ZuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXg7XG59O1xuZXhwb3J0IGNvbnN0IGRyYXdJbnRlcnBvbGF0ZWRHcmFwaDogRHJhd0ludGVycG9sYXRlZEdyYXBoRm4gPSBmdW5jdGlvbiAoXG4gICAgdGhpczogdm9pZFxuKTogR3JvdXBOYW1lQW5kSWRQcmVmaXgge1xuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvciwgdGhpY2tuZXNzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYsIHN0YXJ0LCBlbmQsIHN0ZXBzaXplLCBjb2xvcilcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBzdGFydCwgZW5kLCBzdGVwc2l6ZSlcbiAgICAvLyBmbiBzaWduYXR1cmU6IChmLCBjb2xvciwgdGhpY2tuZXNzKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYsIGNvbG9yKVxuICAgIC8vIGZuIHNpZ25hdHVyZTogKGYpXG4gICAgdmFyIG9wdHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIG9wdHMuc3BsaWNlKDAsIDAsIG51bGwpO1xuICAgIG9wdHMuc3BsaWNlKDAsIDAsIG51bGwpO1xuICAgIG9wdHMuc3BsaWNlKDMsIDAsIHsgXCJpbnRlcnBvbGF0ZWRcIjogdHJ1ZSB9KTtcbiAgICByZXR1cm4gY3JlYXRlR3JhcGhXaXRoT3B0aW9ucy5hcHBseShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgb3B0cyBhcyBDcmVhdGVHcmFwaFdpdGhPcHRpb25zRm5QYXJhbVR5cGVzXG4gICAgKTtcbn07XG4iXX0=