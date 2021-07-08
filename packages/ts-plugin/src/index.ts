// largely based on https://github.com/mrmckeb/typescript-plugin-css-modules

import fs from 'fs';
import path from 'path';
import tsModule from 'typescript/lib/tsserverlibrary';
import {generateError, generateTypings} from './codegen';
import {parseBemCss} from './parse-bem-css';

interface Logger {
    log: (message: string) => void;
    error: (error: Error) => void;
}

const createLogger = (info: ts.server.PluginCreateInfo): Logger => {
    const log = (message: string) => {
        info.project.projectService.logger.info(
            `[typescript-plugin-css-modules] ${message}`,
        );
    };
    const error = (error: Error) => {
        log(`Failed ${error.toString()}`);
        log(`Stack trace: ${error.stack}`);
    };

    return {
        log,
        error,
    };
};

const isCss = (fileName: string) => fileName.endsWith('.bem.css');

const replaceField = <T, K extends keyof T>(
    value: T,
    field: K,
    replacer: (oldValue: Exclude<T[K], undefined>) => Exclude<T[K], undefined>,
) => {
    let oldValue = value[field];
    if (typeof oldValue === 'function') {
        oldValue = oldValue.bind(value);
    }
    if (typeof oldValue === 'undefined') {
        return;
    }
    value[field] = replacer(oldValue as Exclude<T[K], undefined>);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const init = ({
    typescript: ts,
}: {
    typescript: typeof tsModule;
}): {
    create: (info: ts.server.PluginCreateInfo) => ts.LanguageService;
    getExternalFiles: (
        project: ts.server.ConfiguredProject,
    ) => ts.server.NormalizedPath[];
} => {
    const create = (info: ts.server.PluginCreateInfo) => {
        // TypeScript plugins have a `cwd` of `/`, which causes issues with import resolution.
        process.chdir(info.project.getCurrentDirectory());

        const logger = createLogger(info);
        // const compilerOptions = info.project.getCompilerOptions();

        // User options for plugin.
        // const options: Options = info.config.options || {};
        // logger.log(`options: ${JSON.stringify(options)}`);

        // const processor = postcss();

        const generateDts = (
            fileName: string,
            scriptSnapshot: ts.IScriptSnapshot,
        ): tsModule.IScriptSnapshot => {
            const css = scriptSnapshot.getText(0, scriptSnapshot.getLength());

            if (/export const bem/.test(css)) {
                return scriptSnapshot;
            }

            const [bemTree, errors] = parseBemCss(css);
            const typings =
                errors.length === 0
                    ? generateTypings(bemTree)
                    : generateError(errors);

            return ts.ScriptSnapshot.fromString(typings);
        };

        replaceField(
            ts,
            'createLanguageServiceSourceFile',
            (createLanguageServiceSourceFile) =>
                (fileName, scriptSnapshot, ...rest): ts.SourceFile => {
                    if (isCss(fileName)) {
                        scriptSnapshot = generateDts(fileName, scriptSnapshot);
                    }
                    const sourceFile = createLanguageServiceSourceFile(
                        fileName,
                        scriptSnapshot,
                        ...rest,
                    );
                    if (isCss(fileName)) {
                        sourceFile.isDeclarationFile = true;
                    }
                    return sourceFile;
                },
        );

        replaceField(
            ts,
            'updateLanguageServiceSourceFile',
            (updateLanguageServiceSourceFile) =>
                (sourceFile, scriptSnapshot, ...rest): ts.SourceFile => {
                    if (isCss(sourceFile.fileName)) {
                        scriptSnapshot = generateDts(
                            sourceFile.fileName,
                            scriptSnapshot,
                        );
                    }
                    sourceFile = updateLanguageServiceSourceFile(
                        sourceFile,
                        scriptSnapshot,
                        ...rest,
                    );
                    if (isCss(sourceFile.fileName)) {
                        sourceFile.isDeclarationFile = true;
                    }
                    return sourceFile;
                },
        );

        const resolveModuleName = (
            containingFile: string,
            moduleName: string,
            backupModuleName: ts.ResolvedModule | undefined,
        ) => {
            try {
                logger.log(JSON.stringify([containingFile, moduleName]));
                if (!isCss(moduleName)) {
                    return backupModuleName;
                }

                // TODO: Move this section to a separate file and add basic tests.
                // Attempts to locate the module using TypeScript's previous search paths. These include "baseUrl" and "paths".
                const failedModule =
                    info.project.getResolvedModuleWithFailedLookupLocationsFromCache(
                        moduleName,
                        containingFile,
                    );
                const baseUrl = info.project.getCompilerOptions().baseUrl;
                const match = '/index.ts';

                // An array of paths TypeScript searched for the module. All include .ts, .tsx, .d.ts, or .json extensions.
                // NOTE: TypeScript doesn't expose this in their interfaces, which is why the type is unknown.
                // https://github.com/microsoft/TypeScript/issues/28770
                const failedLocations: readonly string[] = (
                    failedModule as unknown as {
                        failedLookupLocations: readonly string[];
                    }
                ).failedLookupLocations;

                // Filter to only one extension type, and remove that extension. This leaves us with the actual filename.
                // Example: "usr/person/project/src/dir/File.module.css/index.d.ts" > "usr/person/project/src/dir/File.module.css"
                const normalizedLocations = failedLocations.reduce(
                    (locations, location) => {
                        if (
                            (baseUrl ? location.includes(baseUrl) : true) &&
                            location.endsWith(match)
                        ) {
                            return [...locations, location.replace(match, '')];
                        }
                        return locations;
                    },
                    [] as string[],
                );

                // Find the imported CSS module, if it exists.
                const cssModulePath = normalizedLocations.find((location) =>
                    fs.existsSync(location),
                );

                if (cssModulePath) {
                    return {
                        extension: tsModule.Extension.Dts,
                        isExternalLibraryImport: false,
                        resolvedFileName: path.resolve(cssModulePath),
                    };
                }
            } catch (e) {
                logger.error(e);
                return backupModuleName;
            }
            return backupModuleName;
        };

        replaceField(
            info.languageServiceHost,
            'resolveModuleNames',
            (resolveModuleNames) =>
                (moduleNames, containingFile, ...rest) => {
                    const resolvedModules = resolveModuleNames(
                        moduleNames,
                        containingFile,
                        ...rest,
                    );

                    return moduleNames.map((moduleName, index) =>
                        resolveModuleName(
                            containingFile,
                            moduleName,
                            resolvedModules[index],
                        ),
                    );
                },
        );

        return info.languageService;
    };

    const getExternalFiles = (project: tsModule.server.ConfiguredProject) => {
        return project.getFileNames().filter(isCss);
    };

    return {create, getExternalFiles};
};

export = init;
