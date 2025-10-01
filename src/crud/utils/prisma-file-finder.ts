import { Tree, SchematicContext } from "@angular-devkit/schematics";
import { strings } from "@angular-devkit/core";

/**
 * Prisma 파일을 재귀적으로 검색하는 함수
 * 다음 순서로 검색합니다:
 * 1. 직접 경로: prisma/name.prisma
 * 2. 중첩 경로: prisma/name/name.prisma
 * 3. 재귀 검색: 모든 하위 폴더에서 name.prisma 찾기
 */
export function findPrismaFile(
    tree: Tree,
    context: SchematicContext,
    moduleName: string,
    prismaDir = "prisma"
): string | null {
    const prismaFileName = `${strings.dasherize(String(moduleName))}.prisma`;

    // Helper function to recursively search for prisma files
    function searchPrismaFile(dir: string, fileName: string): string | null {
        // First try direct path
        const directPath = `${dir}/${fileName}`;
        if (tree.exists(directPath)) {
            return directPath;
        }

        // Then try nested structure: dir/name/name.prisma
        const nestedPath = `${dir}/${strings.dasherize(String(moduleName))}/${fileName}`;
        if (tree.exists(nestedPath)) {
            return nestedPath;
        }

        // Finally, recursively search all subdirectories
        try {
            const dirObj = tree.getDir(dir);
            for (const subdir of dirObj.subdirs) {
                const subPath = `${dir}/${subdir}`;
                const result = searchPrismaFile(subPath, fileName);
                if (result) {
                    return result;
                }
            }
        } catch (e) {
            // Directory doesn't exist or can't be read
            return null;
        }

        return null;
    }

    const prismaPath = searchPrismaFile(prismaDir, prismaFileName);

    if (prismaPath) {
        context.logger.info(`Found prisma file: ${prismaPath}`);
    } else {
        context.logger.info(
            `Prisma schema not found. Searched for '${prismaFileName}' in prisma directory and subdirectories.`
        );
        listAvailablePrismaFiles(tree, context, prismaDir, prismaFileName);
    }

    return prismaPath;
}

/**
 * 사용 가능한 모든 prisma 파일을 나열합니다 (디버깅용)
 */
function listAvailablePrismaFiles(
    tree: Tree,
    context: SchematicContext,
    prismaDir: string,
    targetFileName: string
): void {
    function listPrismaFiles(dir: string, depth = 0): string[] {
        const files: string[] = [];
        try {
            const dirObj = tree.getDir(dir);
            const prismaFiles = dirObj.subfiles.filter(file => file.endsWith('.prisma'));
            files.push(...prismaFiles.map(file => `${dir}/${file}`));

            // Recursively search subdirectories (limit depth to avoid infinite loops)
            if (depth < 3) {
                for (const subdir of dirObj.subdirs) {
                    files.push(...listPrismaFiles(`${dir}/${subdir}`, depth + 1));
                }
            }
        } catch (e) {
            // Directory doesn't exist or can't be read
        }
        return files;
    }

    const allPrismaFiles = listPrismaFiles(prismaDir);
    if (allPrismaFiles.length > 0) {
        context.logger.info(`Available prisma files: ${allPrismaFiles.join(', ')}`);
        context.logger.info(`Looking for: ${targetFileName}`);
    } else {
        context.logger.info(`No prisma directory or files found. Skipping prisma-driven fields.`);
    }
}

