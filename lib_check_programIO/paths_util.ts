"use strict";

const Deno_readdirSync = Deno.readdirSync;

export type path = string[]; // like ["/", "local", "bin"]

export const relativePathsOfFilesInDir = (
    baseDirPath: path,
    fileNamesToFind?: string[]
): path[] => {
    const filesDirsInBaseDirPaths: path[] = [];
    const filesDirsInBaseDirInfo = Deno_readdirSync(baseDirPath.join("/"));
    for (let i: number = 0; i < filesDirsInBaseDirInfo.length; ++i) {
        const fileOrDir = filesDirsInBaseDirInfo[i];
        if (fileOrDir.isDirectory()) {
            const subDirPath = baseDirPath.concat(fileOrDir.name ? fileOrDir.name : "");
            const enclosedFilesDirsPaths: path[] = relativePathsOfFilesInDir(subDirPath, fileNamesToFind);
            filesDirsInBaseDirPaths.push(...enclosedFilesDirsPaths);
        } else if (fileOrDir.isFile() && fileOrDir.name
            && (fileNamesToFind == null || fileNamesToFind.find(val => { return val === fileOrDir.name }))) {
            const filePath = baseDirPath.concat(fileOrDir.name);
            filesDirsInBaseDirPaths.push(filePath);
        }
        // not dealing with symlinks
    }
    return filesDirsInBaseDirPaths;
};

export const pathsToStrs = (
    descendantFilesPathsArr: path[]
): string[] => {
    return descendantFilesPathsArr.reduce((prev, val) => {
        return prev.concat(val.join("/"));
    }, []);
};

