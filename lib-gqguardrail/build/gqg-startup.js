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
//import { PLAYGROUND_WIDTH, PLAYGROUND_HEIGHT, sprite } from "./gqg-mod.ts";
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
        var urlExist = (url, callback) => {
            if (localLibsOnly) {
                callback(false);
                return;
            }
            // see: https://stackoverflow.com/questions/3646914/how-do-i-check-if-file-exists-in-jquery-or-javascript
            var http = new XMLHttpRequest();
            http.open('HEAD', url, true);
            http.onload = (e) => {
                if (http.readyState === 4) {
                    callback(http.status !== 404);
                }
            };
            http.onerror = (e) => {
                callback(false);
            };
            http.send(null);
        };
        var loadCss = (url, callback) => {
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
        var loadScript = (url, callback) => {
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
        var loadRsrc = (loader, scriptName, cdnUrl, fallbackUrl, callback) => {
            // loader must be like loadScript(url, callback), or loadCss(url, callback)
            callback = callback || (() => { });
            urlExist(cdnUrl, (theUrlExists) => {
                if (theUrlExists) {
                    loader(cdnUrl, () => {
                        console.log('Using online CDN: ' + scriptName);
                        callback();
                    });
                }
                else {
                    loader(fallbackUrl, () => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3FnLXN0YXJ0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmaWxlOi8vL2hvbWUvY2hlbmcvRGVza3RvcC9UUy1kZXYvZnVuLXRlcm1pbmFsLWxpYi5naXRyZXBvL2xpYi1ncWd1YXJkcmFpbC9zcmMvZ3FnLXN0YXJ0dXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDO0FBQ2I7Ozs7O0dBS0c7QUFDSDs7OztHQUlHO0FBQ0gsT0FBTyxFQUFFLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQVczRSxJQUFJLHdCQUF3QixDQUFDO0FBQzdCLElBQUksQ0FBQyx3QkFBd0IsRUFBRTtJQUMzQix3QkFBd0IsR0FBRyxJQUFJLENBQUM7SUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQzlDLENBQUMsQ0FBQyxHQUFHLEVBQUU7UUFDSCxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsQ0FBQyx1RUFBdUU7UUFFakcscUVBQXFFO1FBQ3JFLHFIQUFxSDtRQUNySCwyR0FBMkc7UUFDM0csSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7WUFDakIsT0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDO1NBQ2hDO1FBRUQsSUFBSSxRQUFRLEdBQUcsQ0FBQyxHQUFXLEVBQUUsUUFBOEIsRUFBUSxFQUFFO1lBQ2pFLElBQUksYUFBYSxFQUFFO2dCQUNmLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDaEIsT0FBTzthQUNWO1lBRUQseUdBQXlHO1lBQ3pHLElBQUksSUFBSSxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7WUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFNLEVBQVEsRUFB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QixLQUFLLEdBQUcsSUFBSSxpQkFBaUIsS0FBSyxHQUFHLENBQUM7K0JBQ3BELENBQUMsNEJBQTRCLEVBQUU7NEJBQ2xDLDRCQUE0QixHQUFHLElBQUksQ0FBQzs0QkFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtREFBbUQsR0FBRyxnQkFBZ0IsR0FBRyxLQUFLLEdBQUcsaUJBQWlCLENBQUMsQ0FBQzt5QkFDbkg7b0JBQ0wsQ0FBQyxDQUFDO29CQUNGLFVBQVUsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDdkMsV0FBVyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM3QyxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztDQUNOIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG4vKlxuICogQ29weXJpZ2h0IDIwMTIsIDIwMTYsIDIwMTcsIDIwMTksIDIwMjAgQ2Fyc29uIENoZW5nXG4gKiBUaGlzIFNvdXJjZSBDb2RlIEZvcm0gaXMgc3ViamVjdCB0byB0aGUgdGVybXMgb2YgdGhlIE1vemlsbGEgUHVibGljXG4gKiBMaWNlbnNlLCB2LiAyLjAuIElmIGEgY29weSBvZiB0aGUgTVBMIHdhcyBub3QgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzXG4gKiBmaWxlLCBZb3UgY2FuIG9idGFpbiBvbmUgYXQgaHR0cHM6Ly9tb3ppbGxhLm9yZy9NUEwvMi4wLy5cbiAqL1xuLypcbiAqIEdRR3VhcmRyYWlsLUdRLXN0YXJ0dXAgbG9hZHMgR1FHdWFyZHJhaWwgYW5kIGdhbWVRdWVyeS5cbiAqIFRoaXMgc2NyaXB0IGF1dG8tbG9hZHMgbXlwcm9ncmFtLmpzLlxuICogUHVycG9zZSBpcyB0byBoaWRlcyBzdHVmZiB0byBtYWtlIG15cHJvZ3JhbS5qcyBlYXNpZXIgdG8gbGVhcm4uXG4gKi9cbmltcG9ydCB7IFBMQVlHUk9VTkRfV0lEVEgsIFBMQVlHUk9VTkRfSEVJR0hULCBzcHJpdGUgfSBmcm9tIFwiLi9ncWctbW9kLnRzXCI7XG5kZWNsYXJlIHZhciAkOiBhbnk7XG5kZWNsYXJlIGNvbnN0IEdRR19QTEFZR1JPVU5EX0hFSUdIVDogbnVtYmVyO1xuZGVjbGFyZSBjb25zdCBHUUdfUExBWUdST1VORF9XSURUSDogbnVtYmVyO1xuZGVjbGFyZSB2YXIgWE1MSHR0cFJlcXVlc3Q6IGFueTtcbmRlY2xhcmUgdmFyIGNvbnNvbGU6IGFueTtcbmRlY2xhcmUgdmFyIGRvY3VtZW50OiBhbnk7XG5kZWNsYXJlIHZhciBkcmF3OiBGdW5jdGlvbjtcbmRlY2xhcmUgdmFyIHNldHVwOiBGdW5jdGlvbjtcbmRlY2xhcmUgdmFyIHdpbmRvdzogeyBjb25zb2xlOiBhbnkgfTtcblxudmFyIGdxZ3VhcmRyYWlsU3RhcnR1cExvYWRlZDtcbmlmICghZ3FndWFyZHJhaWxTdGFydHVwTG9hZGVkKSB7XG4gICAgZ3FndWFyZHJhaWxTdGFydHVwTG9hZGVkID0gdHJ1ZTtcbiAgICBjb25zb2xlLmxvZyhcImdxZ3VhcmRyYWlsIHN0YXJ0dXAgbG9hZGluZy4uLlwiKTtcbiAgICAkKCgpID0+IHtcbiAgICAgICAgdmFyIGxvY2FsTGlic09ubHkgPSB0cnVlOyAvLyBzZXQgZmFsc2UgdG8gdXNlIENETiBsaWJzIGlmIGF2YWlsYWJsZSwgZXNwLiBpZiBob3QgcGF0Y2hpbmcgZGVzaXJlZFxuXG4gICAgICAgIC8vIEF2b2lkIGNvbnNvbGUubG9nIGVycm9ycyBpbiBicm93c2VycyB0aGF0IGxhY2sgYSBjb25zb2xlIChpLmUuIElFKVxuICAgICAgICAvLyBzZWU6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNzc0Mjc4MS93aHktamF2YXNjcmlwdC1vbmx5LXdvcmtzLWFmdGVyLW9wZW5pbmctZGV2ZWxvcGVyLXRvb2xzLWluLWllLW9uY2VcbiAgICAgICAgLy8gZm9yIG1vcmUgY29tcGxldGUgc29sdXRpb24sIHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2g1YnAvaHRtbDUtYm9pbGVycGxhdGUvYmxvYi9tYXN0ZXIvc3JjL2pzL3BsdWdpbnMuanNcbiAgICAgICAgaWYgKCF3aW5kb3cuY29uc29sZSkge1xuICAgICAgICAgICAgY29uc29sZSA9IHsgbG9nOiAoKSA9PiB7IH0gfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB1cmxFeGlzdCA9ICh1cmw6IHN0cmluZywgY2FsbGJhY2s6IChiOiBib29sZWFuKSA9PiB2b2lkKTogdm9pZCA9PiB7IC8vIGNhbGxiYWNrIGlzIGNhbGxlZCB3aXRoIHdoZXRoZXIgdXJsIGV4aXN0cyAoYm9vbGVhbilcbiAgICAgICAgICAgIGlmIChsb2NhbExpYnNPbmx5KSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNjQ2OTE0L2hvdy1kby1pLWNoZWNrLWlmLWZpbGUtZXhpc3RzLWluLWpxdWVyeS1vci1qYXZhc2NyaXB0XG4gICAgICAgICAgICB2YXIgaHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgaHR0cC5vcGVuKCdIRUFEJywgdXJsLCB0cnVlKTtcbiAgICAgICAgICAgIGh0dHAub25sb2FkID0gKGU6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChodHRwLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soaHR0cC5zdGF0dXMgIT09IDQwNCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGh0dHAub25lcnJvciA9IChlOiBhbnkpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhmYWxzZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaHR0cC5zZW5kKG51bGwpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHR5cGUgTG9hZGVyRm4gPSAodXJsOiBzdHJpbmcsIGNiOiBGdW5jdGlvbikgPT4gdm9pZDtcbiAgICAgICAgdmFyIGxvYWRDc3M6IExvYWRlckZuID0gKHVybDogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICAgICAgICAgICAgbGluay5yZWwgPSBcInN0eWxlc2hlZXRcIjtcbiAgICAgICAgICAgIGxpbmsudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICAgICAgICBsaW5rLm1lZGlhID0gJ2FsbCc7XG4gICAgICAgICAgICBsaW5rLmhyZWYgPSB1cmw7XG5cbiAgICAgICAgICAgIGxpbmsub25yZWFkeXN0YXRlY2hhbmdlID0gY2FsbGJhY2s7XG4gICAgICAgICAgICBsaW5rLm9ubG9hZCA9IGNhbGxiYWNrO1xuXG4gICAgICAgICAgICBoZWFkLmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkxvYWRlZCBjc3M6IFwiICsgdXJsKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbG9hZFNjcmlwdDogTG9hZGVyRm4gPSAodXJsOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbik6IHZvaWQgPT4ge1xuICAgICAgICAgICAgLy8gc2VlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85NTAwODcvaW5jbHVkZS1hLWphdmFzY3JpcHQtZmlsZS1pbi1hbm90aGVyLWphdmFzY3JpcHQtZmlsZVxuICAgICAgICAgICAgdmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICAgICAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgICAgICAgICAgIHNjcmlwdC5zcmMgPSB1cmw7XG4gICAgICAgICAgICAvL3NjcmlwdC50eXBlPVwibW9kdWxlXCI7Ly9DT1JTIHZpb2xhdGlvbiB3aGVuIHJ1biBsb2NhbGx5XG5cbiAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBjYWxsYmFjaztcbiAgICAgICAgICAgIHNjcmlwdC5vbmxvYWQgPSBjYWxsYmFjaztcblxuICAgICAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkxvYWRlZCBzY3JpcHQ6IFwiICsgdXJsKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbG9hZFJzcmMgPSAobG9hZGVyOiBMb2FkZXJGbiwgc2NyaXB0TmFtZTogc3RyaW5nLCBjZG5Vcmw6IHN0cmluZywgZmFsbGJhY2tVcmw6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAvLyBsb2FkZXIgbXVzdCBiZSBsaWtlIGxvYWRTY3JpcHQodXJsLCBjYWxsYmFjayksIG9yIGxvYWRDc3ModXJsLCBjYWxsYmFjaylcbiAgICAgICAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgKCgpID0+IHsgfSk7XG4gICAgICAgICAgICB1cmxFeGlzdChjZG5VcmwsICh0aGVVcmxFeGlzdHM6IGJvb2xlYW4pOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhlVXJsRXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRlcihjZG5VcmwsICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdVc2luZyBvbmxpbmUgQ0ROOiAnICsgc2NyaXB0TmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2FkZXIoZmFsbGJhY2tVcmwsICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdVc2luZyBmYWxsYmFjayBsaWI6ICcgKyBzY3JpcHROYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAvLyBtYWluXG4gICAgICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAvLyBHaXRDRE4gd2lsbCB0YWtlIHVwIHRvIDIgaG91cnMgdG8gcHJvcGFnYXRlIGZpbGUgY2hhbmdlc1xuICAgICAgICBjb25zdCBnaXRSZXBvVXJsID0gXCJodHRwczovL2dpdGNkbi54eXovY2RuL2NjaGVuZy9KUUdRLVByb2plY3QtVGVtcGxhdGUvXCI7XG4gICAgICAgIGNvbnN0IGdpdFRhZyA9IFwidjUuOFwiOyAvLyB1c2UgZ2l0Y2RuLnh5ei9jZG4gaW5zdGVhZCBvZiAvcmVwbyB0byBnZXQgc3BlY2lmaWMgaGFzaCBpbnN0ZWFkIG9mIGxhdGVzdCBjb21taXRcbiAgICAgICAgY29uc3QgY2RuVXJsQmFzZSA9IGdpdFJlcG9VcmwgKyBnaXRUYWc7XG5cbiAgICAgICAgY29uc3QgZ3FnTGliUGF0aCA9IFwiYnVpbGQvZ3FnLW1vZC5qc1wiOyAvLyByZWxhdGl2ZSB0byBHUUcgV2ViIEFwcCBwcm9qZWN0IHJvb3RcbiAgICAgICAgY29uc3QgbW9kdWxlSGFja0xpYlBhdGggPSBcImJ1aWxkL2dxZy1tb2R1bGUtRm4uanNcIjtcbiAgICAgICAgY29uc3Qgc3R1ZGVudFByb2dyYW1QYXRoID0gXCJidWlsZC9teXByb2dyYW0uanNcIjtcblxuICAgICAgICBsb2FkUnNyYyhsb2FkU2NyaXB0LCBncWdMaWJQYXRoLCBjZG5VcmxCYXNlICsgZ3FnTGliUGF0aCwgZ3FnTGliUGF0aCwgKCkgPT4ge1xuICAgICAgICAgICAgLy9jb25zb2xlUHJpbnQoXCJVc2luZzogXCIgKyBncWdsaWJuYW1lKTtcblxuICAgICAgICAgICAgc3ByaXRlKFwicGxheWdyb3VuZFwiKS5wbGF5Z3JvdW5kKHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IEdRR19QTEFZR1JPVU5EX0hFSUdIVCxcbiAgICAgICAgICAgICAgICB3aWR0aDogR1FHX1BMQVlHUk9VTkRfV0lEVEgsXG4gICAgICAgICAgICAgICAga2V5VHJhY2tlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtb3VzZVRyYWNrZXI6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsb2FkUnNyYyhsb2FkU2NyaXB0LCBtb2R1bGVIYWNrTGliUGF0aCwgY2RuVXJsQmFzZSArIG1vZHVsZUhhY2tMaWJQYXRoLCBtb2R1bGVIYWNrTGliUGF0aCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxvYWRTY3JpcHQoc3R1ZGVudFByb2dyYW1QYXRoLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUnVubmluZzogXCIgKyBzdHVkZW50UHJvZ3JhbVBhdGgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIldhcm5pbmc6IE1ha2Ugc3VyZSB5b3UgY29tcGlsZWQgeW91ciBjb2RlIGJlZm9yZSB0ZXN0aW5nIVwiKTtcblxuICAgICAgICAgICAgICAgICAgICBzZXR1cCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBSRUZSRVNIX1JBVEUgPSA0MTtcbiAgICAgICAgICAgICAgICAgICAgJC5wbGF5Z3JvdW5kKCkucmVnaXN0ZXJDYWxsYmFjayhkcmF3LCBSRUZSRVNIX1JBVEUpO1xuICAgICAgICAgICAgICAgICAgICAkLnBsYXlncm91bmQoKS5zdGFydEdhbWUoKTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgY2hlY2tfcGxheWdyb3VuZF9zaXplX3dhcm5lZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGVja19wbGF5Z3JvdW5kX3NpemUgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKFBMQVlHUk9VTkRfV0lEVEggIT09IDY0MCB8fCBQTEFZR1JPVU5EX0hFSUdIVCAhPT0gNDgwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICFjaGVja19wbGF5Z3JvdW5kX3NpemVfd2FybmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfcGxheWdyb3VuZF9zaXplX3dhcm5lZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJXYXJuaW5nOiBOb24tc3RhbmRhcmQgcGxheWdyb3VuZCBzaXplcyBkZXRlY3RlZDogXCIgKyBQTEFZR1JPVU5EX1dJRFRIICsgXCIgeCBcIiArIFBMQVlHUk9VTkRfSEVJR0hUKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChjaGVja19wbGF5Z3JvdW5kX3NpemUsIDIwMCk7XG4gICAgICAgICAgICAgICAgICAgIHNldEludGVydmFsKGNoZWNrX3BsYXlncm91bmRfc2l6ZSwgMzAwMCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59Il19