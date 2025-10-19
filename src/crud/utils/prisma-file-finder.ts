import { Tree, SchematicContext } from "@angular-devkit/schematics";
import { getConfig } from "./config";

/**
 * Prisma 스키마 파일을 찾습니다.
 * 설정된 검색 디렉토리에서 재귀적으로 찾습니다.
 */
export function findPrismaFile(
  tree: Tree,
  context: SchematicContext,
  moduleName: string,
  explicitPath?: string
): string | null {
  const config = getConfig();

  // 1. 명시적으로 지정된 경로가 있으면 확인
  if (explicitPath && tree.exists(explicitPath)) {
    context.logger.info(`✅ Found prisma file at: ${explicitPath}`);
    return explicitPath;
  }

  const targetFileName = `${moduleName.toLowerCase()}.prisma`;
  context.logger.debug(`🔍 Looking for file: ${targetFileName}`);

  // 2. 설정된 디렉토리들에서 재귀 검색
  context.logger.debug(`🔍 Search directories: ${config.searchDirectories.join(', ')}`);
  for (const searchDir of config.searchDirectories) {
    context.logger.debug(`🔍 Searching in directory: ${searchDir}`);
    const foundPath = searchPrismaFileRecursively(
      tree,
      searchDir,
      targetFileName,
      context
    );
    if (foundPath) {
      context.logger.info(`✅ Found module-specific prisma file: ${foundPath}`);
      return foundPath;
    }
  }

  // 3. 통합 prisma 스키마 파일 확인
  const commonPaths = [
    config.defaultPrismaPath,
    "prisma/prisma.schema",
    "schema.prisma",
  ];

  for (const path of commonPaths) {
    if (tree.exists(path)) {
      context.logger.info(`✅ Found common prisma file: ${path}`);
      return path;
    }
  }

  const searchDirs = config.searchDirectories
    .map((dir) => `${dir}/**/${targetFileName}`)
    .join("\n  - ");
  context.logger.warn(
    `⚠️  No prisma file found for module '${moduleName}'. Tried:
  - ${searchDirs} (recursive search)
  - ${config.defaultPrismaPath}
  - schema.prisma`
  );
  return null;
}

/**
 * 디렉토리를 재귀적으로 탐색하여 특정 파일을 찾습니다.
 * 설정된 제외 디렉토리는 스킵합니다.
 */
function searchPrismaFileRecursively(
  tree: Tree,
  dirPath: string,
  targetFileName: string,
  context?: SchematicContext
): string | null {
  const config = getConfig();

  // 디렉토리가 존재하지 않으면 null 반환
  const dir = tree.getDir(dirPath);
  if (!dir) {
    if (context) {
      context.logger.debug(`📁 Directory does not exist: ${dirPath}`);
    }
    return null;
  }

  // 현재 디렉토리에서 파일 검색
  const directPath = `${dirPath}/${targetFileName}`;
  if (tree.exists(directPath)) {
    if (context) {
      context.logger.debug(`✅ Found file: ${directPath}`);
    }
    return directPath;
  }

  // 하위 디렉토리 재귀 검색 (제외 목록 필터링)
  for (const subdir of dir.subdirs) {
    // 제외 디렉토리는 스킵
    if (config.excludedDirectories.has(subdir)) {
      if (context) {
        context.logger.debug(`⏭️ Skipping excluded directory: ${subdir}`);
      }
      continue;
    }

    const result = searchPrismaFileRecursively(
      tree,
      `${dirPath}/${subdir}`,
      targetFileName,
      context
    );
    if (result) {
      return result;
    }
  }

  return null;
}

