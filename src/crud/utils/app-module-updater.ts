import { Tree } from "@angular-devkit/schematics";
import { strings } from "@angular-devkit/core";

export interface AppModuleInfo {
    path: string;
    content: string;
    hasModuleImport: boolean;
}

/**
 * app.module.ts 파일을 찾고 정보를 반환합니다.
 */
export function findAppModule(tree: Tree, moduleName?: string): AppModuleInfo | null {
    const possiblePaths = [
        "src/app.module.ts",
        "src/app/app.module.ts",
        "app.module.ts",
    ];

    for (const path of possiblePaths) {
        if (tree.exists(path)) {
            const content = tree.read(path)?.toString() || "";
            const fullModuleName = moduleName ? `${strings.classify(moduleName)}Module` : '';
            const hasModuleImport = moduleName ? content.includes(fullModuleName) : false;

            return {
                path,
                content,
                hasModuleImport,
            };
        }
    }

    return null;
}

/**
 * app.module.ts 파일에 모듈을 추가합니다.
 */
export function addModuleToAppModule(
    tree: Tree,
    modulePath: string,
    moduleName: string,
    importPath: string
): void {
    const content = tree.read(modulePath)?.toString() || "";

    // 이미 모듈이 import되어 있는지 확인
    if (content.includes(moduleName)) {
        console.log(`✅ ${moduleName}이 이미 app.module.ts에 추가되어 있습니다.`);
        return;
    }

    let updatedContent = content;

    // 1. import 문 추가
    const importStatement = `import { ${moduleName} } from "${importPath}";`;

    // 기존 import 문들 다음에 추가
    const importRegex = /^import\s+.*?from\s+['"].*?['"];?\s*$/gm;
    const imports = content.match(importRegex);

    if (imports && imports.length > 0) {
        // 마지막 import 문 다음에 추가
        const lastImport = imports[imports.length - 1];
        if (lastImport) {
            const lastImportIndex = content.lastIndexOf(lastImport);
            const insertIndex = lastImportIndex + lastImport.length;

            updatedContent =
                content.slice(0, insertIndex) +
                '\n' + importStatement +
                content.slice(insertIndex);
        } else {
            updatedContent = importStatement + '\n' + content;
        }
    } else {
        // import 문이 없으면 파일 시작 부분에 추가
        updatedContent = importStatement + '\n' + content;
    }

    // 2. 최상위 @Module 데코레이터의 imports 배열에만 모듈 추가
    // 파일을 줄별로 분석해서 정확히 최상위 @Module의 imports 배열 끝을 찾기

    console.log(`🔍 ${moduleName} 모듈을 imports 배열에 추가하는 중...`);

    const lines = updatedContent.split('\n');
    let inTopLevelModule = false;
    let inImportsArray = false;
    let bracketCount = 0;
    let importsEndLine = -1;
    let moduleBracketCount = 0;
    let foundImportsStart = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;

        const trimmedLine = line.trim();

        // 최상위 @Module 시작 감지
        if (trimmedLine.startsWith('@Module') && !inTopLevelModule) {
            inTopLevelModule = true;
            moduleBracketCount = 0;
            console.log(`📍 @Module 발견: ${i + 1}번째 줄`);
            continue;
        }

        if (inTopLevelModule) {
            // imports 배열 시작 감지 (최상위 @Module 내에서만)
            if (trimmedLine.includes('imports:') && line.includes('[') && !foundImportsStart) {
                foundImportsStart = true;
                inImportsArray = true;
                bracketCount = 1; // 첫 번째 [ 카운트
                console.log(`📍 imports 배열 시작: ${i + 1}번째 줄`);
                continue;
            }

            if (inImportsArray) {
                // 대괄호 카운팅
                bracketCount += (line.match(/\[/g) || []).length;
                bracketCount -= (line.match(/\]/g) || []).length;

                console.log(`📍 ${i + 1}번째 줄 - 대괄호 카운트: ${bracketCount} - "${trimmedLine}"`);

                // imports 배열 끝 감지
                if (bracketCount === 0) {
                    importsEndLine = i;
                    console.log(`📍 imports 배열 끝: ${i + 1}번째 줄`);
                    break;
                }
            } else {
                // imports 배열을 찾기 전에는 중괄호 카운팅으로 @Module 범위 확인
                moduleBracketCount += (line.match(/\{/g) || []).length;
                moduleBracketCount -= (line.match(/\}/g) || []).length;

                // 최상위 @Module 끝 감지 (imports 배열을 찾기 전에만)
                if (moduleBracketCount === 0 && inTopLevelModule && !foundImportsStart) {
                    console.log(`📍 @Module 끝 (imports 찾기 전): ${i + 1}번째 줄`);
                    break;
                }
            }
        }
    }

    if (importsEndLine !== -1) {
        // imports 배열의 마지막 줄에서 ] 앞에 모듈 추가
        const lastLine = lines[importsEndLine];
        if (!lastLine) {
            console.log("⚠️  imports 배열의 마지막 줄을 찾을 수 없습니다.");
            return;
        }

        console.log(`📝 마지막 줄: "${lastLine}"`);

        const bracketIndex = lastLine.lastIndexOf(']');
        if (bracketIndex !== -1) {
            const beforeBracket = lastLine.substring(0, bracketIndex);
            const moduleEntry = `\n    ${moduleName},`;

            let newLastLine;
            if (beforeBracket.trim().endsWith(',')) {
                newLastLine = beforeBracket + moduleEntry + '\n  ],';
            } else if (beforeBracket.trim() === '') {
                newLastLine = moduleEntry + '\n  ],';
            } else {
                newLastLine = beforeBracket + ',' + moduleEntry + '\n  ],';
            }

            lines[importsEndLine] = newLastLine;
            updatedContent = lines.join('\n');
            console.log(`✅ ${moduleName} 모듈이 imports 배열에 추가되었습니다.`);
        }
    } else {
        console.log("⚠️  최상위 @Module의 imports 배열을 찾을 수 없습니다.");
    }

    // 파일 업데이트
    tree.overwrite(modulePath, updatedContent);
    console.log(`✅ ${moduleName}이 app.module.ts에 성공적으로 추가되었습니다.`);
}

/**
 * 모듈 경로를 생성합니다.
 */
export function generateModuleImportPath(
    moduleName: string,
    basePath: string = "src/resources"
): string {
    const dasherizedName = strings.dasherize(moduleName);
    return `${basePath}/${dasherizedName}/${dasherizedName}.module`;
}

/**
 * app.module.ts 업데이트를 위한 Rule을 반환합니다.
 */
export function updateAppModuleRule(moduleName: string, modulePath: string): any {
    return (tree: Tree) => {
        const appModuleInfo = findAppModule(tree, moduleName);

        if (!appModuleInfo) {
            console.log("⚠️  app.module.ts 파일을 찾을 수 없습니다. 수동으로 모듈을 추가해주세요.");
            return tree;
        }

        const fullModuleName = `${strings.classify(moduleName)}Module`;
        const importPath = generateModuleImportPath(moduleName, modulePath);

        addModuleToAppModule(tree, appModuleInfo.path, fullModuleName, importPath);

        return tree;
    };
}
