import { Rule, SchematicContext, Tree } from "@angular-devkit/schematics";
import { strings } from "@angular-devkit/core";
import { CrudSchema } from "../schema";

/**
 * 생성된 파일들을 Prettier로 포맷팅하는 Rule
 * Prettier 설정(.prettierrc)이 있으면 그것을 따르고, 없으면 기본 설정 사용
 */
export function formatWithPrettier(
    options: CrudSchema,
    resolvedPath: string
): Rule {
    return async (tree: Tree, context: SchematicContext) => {
        const modulePath = `${resolvedPath}/${strings.dasherize(String(options.name))}`;

        context.logger.info(`🎨 Formatting generated files with Prettier...`);

        // prettier 설정 확인
        const hasPrettierConfig =
            tree.exists(".prettierrc") ||
            tree.exists(".prettierrc.json") ||
            tree.exists(".prettierrc.js") ||
            tree.exists("prettier.config.js") ||
            hasPrettierInPackageJson(tree);

        if (!hasPrettierConfig) {
            context.logger.warn(
                "⚠️  No Prettier configuration found. Skipping formatting."
            );
            return tree;
        }

        // 생성된 파일 목록 수집
        const filesToFormat: string[] = [];
        tree.getDir(modulePath).visit((filePath) => {
            if (
                filePath.endsWith(".ts") ||
                filePath.endsWith(".js") ||
                filePath.endsWith(".json")
            ) {
                filesToFormat.push(filePath);
            }
        });

        if (filesToFormat.length === 0) {
            context.logger.warn("No files found to format.");
            return tree;
        }

        // Prettier로 포맷팅
        try {
            const prettier = await tryImportPrettier();
            if (!prettier) {
                context.logger.warn(
                    "⚠️  Prettier not installed. Run 'npm install -D prettier' to enable formatting."
                );
                return tree;
            }

            let formattedCount = 0;
            for (const filePath of filesToFormat) {
                const content = tree.read(filePath);
                if (!content) continue;

                const originalText = content.toString("utf-8");

                try {
                    const formatted = await prettier.format(originalText, {
                        filepath: filePath,
                        // 프로젝트의 prettier 설정을 자동으로 읽음
                    });

                    if (formatted !== originalText) {
                        tree.overwrite(filePath, formatted);
                        formattedCount++;
                    }
                } catch (error) {
                    context.logger.warn(
                        `Failed to format ${filePath}: ${error instanceof Error ? error.message : error}`
                    );
                }
            }

            if (formattedCount > 0) {
                context.logger.info(
                    `✅ Formatted ${formattedCount} file(s) with Prettier`
                );
            } else {
                context.logger.info("✅ All files are already formatted");
            }
        } catch (error) {
            context.logger.warn(
                `Prettier formatting failed: ${error instanceof Error ? error.message : error}`
            );
        }

        return tree;
    };
}

/**
 * package.json에 prettier 설정이 있는지 확인
 */
function hasPrettierInPackageJson(tree: Tree): boolean {
    const pkgPath = "package.json";
    if (!tree.exists(pkgPath)) return false;

    try {
        const pkgBuf = tree.read(pkgPath);
        if (!pkgBuf) return false;
        const pkgJson = JSON.parse(pkgBuf.toString("utf-8")) as any;
        return !!pkgJson.prettier;
    } catch {
        return false;
    }
}

/**
 * Prettier 모듈을 동적으로 import (설치되어 있는 경우에만)
 */
async function tryImportPrettier(): Promise<any> {
    try {
        // 프로젝트에 설치된 prettier를 사용
        return await import("prettier");
    } catch {
        try {
            // 또는 require 시도
            return require("prettier");
        } catch {
            return null;
        }
    }
}

