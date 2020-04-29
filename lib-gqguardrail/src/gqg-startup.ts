"use strict";
/*
 * Copyright 2012, 2016, 2017, 2019, 2020 Carson Cheng
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
/*
 * GQGuardrail-GQ-startup loads GQGuardrail and gameQuery.
 * This script auto-loads myprogram.js.
 * Purpose is to hides stuff to make myprogram.js easier to learn.
 */
import { PLAYGROUND_WIDTH, PLAYGROUND_HEIGHT, sprite } from "./gqg-mod.ts";
declare var $: any;
declare const GQG_PLAYGROUND_HEIGHT: number;
declare const GQG_PLAYGROUND_WIDTH: number;
declare var XMLHttpRequest: any;
declare var console: any;
declare var document: any;
declare var draw: Function;
declare var setup: Function;
declare var window: { console: any };

var gqguardrailStartupLoaded;
if (!gqguardrailStartupLoaded) {
    gqguardrailStartupLoaded = true;
    console.log("gqguardrail startup loading...");
    $(() => {
        var localLibsOnly = true; // set false to use CDN libs if available, esp. if hot patching desired

        // Avoid console.log errors in browsers that lack a console (i.e. IE)
        // see: http://stackoverflow.com/questions/7742781/why-javascript-only-works-after-opening-developer-tools-in-ie-once
        // for more complete solution, see: https://github.com/h5bp/html5-boilerplate/blob/master/src/js/plugins.js
        if (!window.console) {
            console = { log: () => { } };
        }

        var urlExist = (url: string, callback: (b: boolean) => void): void => { // callback is called with whether url exists (boolean)
            if (localLibsOnly) {
                callback(false);
                return;
            }

            // see: https://stackoverflow.com/questions/3646914/how-do-i-check-if-file-exists-in-jquery-or-javascript
            var http = new XMLHttpRequest();
            http.open('HEAD', url, true);
            http.onload = (e: any): void => {
                if (http.readyState === 4) {
                    callback(http.status !== 404);
                }
            };
            http.onerror = (e: any): void => {
                callback(false);
            };
            http.send(null);
        };

        type LoaderFn = (url: string, cb: Function) => void;
        var loadCss: LoaderFn = (url: string, callback: Function): void => {
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.rel = "stylesheet";
            link.type = 'text/css';
            link.media = 'all';
            link.href = url;

            link.onreadystatechange = callback;
            link.onload = callback;

            head.appendChild(link);
            //console.log("Loaded css: " + url);
        };

        var loadScript: LoaderFn = (url: string, callback: Function): void => {
            // see: https://stackoverflow.com/questions/950087/include-a-javascript-file-in-another-javascript-file
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            //script.type="module";//CORS violation when run locally

            script.onreadystatechange = callback;
            script.onload = callback;

            head.appendChild(script);
            //console.log("Loaded script: " + url);
        };

        var loadRsrc = (loader: LoaderFn, scriptName: string, cdnUrl: string, fallbackUrl: string, callback: Function): void => {
            // loader must be like loadScript(url, callback), or loadCss(url, callback)
            callback = callback || (() => { });
            urlExist(cdnUrl, (theUrlExists: boolean): void => {
                if (theUrlExists) {
                    loader(cdnUrl, (): void => {
                        console.log('Using online CDN: ' + scriptName);
                        callback();
                    });
                } else {
                    loader(fallbackUrl, (): void => {
                        console.log('Using fallback lib: ' + scriptName);
                        callback();
                    });
                }
            });
        };

        // ***************************************************************************************
        // main
        // ***************************************************************************************
        // GitCDN will take up to 2 hours to propagate file changes
        const gitRepoUrl = "https://gitcdn.xyz/cdn/ccheng/JQGQ-Project-Template/";
        const gitTag = "v5.8"; // use gitcdn.xyz/cdn instead of /repo to get specific hash instead of latest commit
        const cdnUrlBase = gitRepoUrl + gitTag;

        const gqgLibPath = "build/gqg-mod.js"; // relative to GQG Web App project root
        const moduleHackLibPath = "build/gqg-module-Fn.js";
        const studentProgramPath = "build/myprogram.js";

        loadRsrc(loadScript, gqgLibPath, cdnUrlBase + gqgLibPath, gqgLibPath, () => {
            //consolePrint("Using: " + gqglibname);

            sprite("playground").playground({
                height: GQG_PLAYGROUND_HEIGHT,
                width: GQG_PLAYGROUND_WIDTH,
                keyTracker: true,
                mouseTracker: true
            });

            loadRsrc(loadScript, moduleHackLibPath, cdnUrlBase + moduleHackLibPath, moduleHackLibPath, () => {
                loadScript(studentProgramPath, () => {
                    console.log("Running: " + studentProgramPath);
                    console.log("Warning: Make sure you compiled your code before testing!");

                    setup();

                    var REFRESH_RATE = 41;
                    $.playground().registerCallback(draw, REFRESH_RATE);
                    $.playground().startGame();

                    let check_playground_size_warned = false;
                    const check_playground_size = () => {
                        if ((PLAYGROUND_WIDTH !== 640 || PLAYGROUND_HEIGHT !== 480)
                            && !check_playground_size_warned) {
                            check_playground_size_warned = true;
                            console.log("Warning: Non-standard playground sizes detected: " + PLAYGROUND_WIDTH + " x " + PLAYGROUND_HEIGHT);
                        }
                    };
                    setTimeout(check_playground_size, 200);
                    setInterval(check_playground_size, 3000);
                });
            });
        });
    });
}