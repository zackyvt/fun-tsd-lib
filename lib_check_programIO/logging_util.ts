"use strict";

export class Logger {
    messages: string[];
    consoleLog: boolean;
    constructor(consoleLog: boolean) {
        this.consoleLog = consoleLog;
        this.messages = [];
    }
    messagesStr(): string{
        return this.messages.join("\n");
    }
    log(str: string, ...rest: string[]): Logger {
        let line: string = "";
        line += str;
        if (rest.length > 0) {
            line += " " + rest.join(" ");
        }
        this.messages.push(line);

        if (this.consoleLog) {
            console.log(line);
        }
        return this;
    }
};
