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

  // 명시적 경로 디버깅
  context.logger.debug(`🔍 Explicit path provided: ${explicitPath || 'none'}`);

  // 1. 명시적으로 지정된 경로가 있으면 확인
  if (explicitPath && tree.exists(explicitPath)) {
    context.logger.info(`✅ Found prisma file at: ${explicitPath}`);
    return explicitPath;
  }

  // 명시적 경로가 있지만 파일이 존재하지 않는 경우
  if (explicitPath) {
    context.logger.warn(`⚠️ Explicit path provided but file not found: ${explicitPath}`);
  }

  const targetFileName = `${moduleName.toLowerCase()}.prisma`;
  context.logger.info(`🔍 Looking for prisma file: ${targetFileName}`);

  // 2. 설정된 디렉토리들에서 재귀 검색
  for (const searchDir of config.searchDirectories) {
    context.logger.debug(`🔍 Searching in directory: ${searchDir}`);
    const foundPath = searchPrismaFileRecursively(
      tree,
      searchDir,
      targetFileName,
      10, // 최대 깊이
      0,  // 현재 깊이
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
    "prisma/schema.prisma",
    "src/prisma/schema.prisma",
    "database/schema.prisma",
    "db/schema.prisma",
  ];

  context.logger.debug(`🔍 Checking common prisma paths: ${commonPaths.join(', ')}`);
  for (const path of commonPaths) {
    if (tree.exists(path)) {
      context.logger.info(`✅ Found common prisma file: ${path}`);
      return path;
    }
  }

  // 4. 모든 디렉토리에서 재귀적으로 .prisma 파일 검색
  context.logger.debug(`🔍 Performing deep search for any .prisma files`);
  const deepSearchResult = deepSearchPrismaFiles(tree, config.searchDirectories, context);
  if (deepSearchResult) {
    context.logger.info(`✅ Found prisma file via deep search: ${deepSearchResult}`);
    return deepSearchResult;
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
 * 설정된 제외 디렉토리는 스킵하고, 최대 깊이를 제한합니다.
 */
function searchPrismaFileRecursively(
  tree: Tree,
  dirPath: string,
  targetFileName: string,
  maxDepth: number = 10,
  currentDepth: number = 0,
  context?: SchematicContext
): string | null {
  const config = getConfig();

  // 최대 깊이 제한
  if (currentDepth >= maxDepth) {
    context?.logger.debug(`🔍 Max depth reached (${maxDepth}) for ${dirPath}`);
    return null;
  }

  try {
    // 디렉토리가 존재하지 않으면 null 반환
    const dir = tree.getDir(dirPath);
    if (!dir) {
      context?.logger.debug(`📁 Directory does not exist: ${dirPath}`);
      return null;
    }

    // 현재 디렉토리에서 파일 검색
    const directPath = `${dirPath}/${targetFileName}`;
    if (tree.exists(directPath)) {
      context?.logger.debug(`✅ Found file at: ${directPath}`);
      return directPath;
    }

    // 현재 디렉토리에서 모든 .prisma 파일 검색 (대안)
    for (const file of dir.subfiles) {
      if (file.endsWith('.prisma')) {
        context?.logger.debug(`🔍 Found prisma file: ${dirPath}/${file}`);
        // 파일명이 모듈명과 일치하거나 유사한지 확인
        const fileName = file.replace('.prisma', '').toLowerCase();
        const moduleName = targetFileName.replace('.prisma', '').toLowerCase();
        if (fileName === moduleName || fileName.includes(moduleName) || moduleName.includes(fileName)) {
          context?.logger.debug(`✅ Matched prisma file: ${dirPath}/${file}`);
          return `${dirPath}/${file}`;
        }
      }
    }

    // 하위 디렉토리 재귀 검색 (제외 목록 필터링)
    const subdirs = dir.subdirs.filter(subdir => !config.excludedDirectories.has(subdir));
    context?.logger.debug(`📂 Searching ${subdirs.length} subdirectories in ${dirPath} (depth: ${currentDepth})`);

    for (const subdir of subdirs) {
      const result = searchPrismaFileRecursively(
        tree,
        `${dirPath}/${subdir}`,
        targetFileName,
        maxDepth,
        currentDepth + 1,
        context
      );
      if (result) {
        return result;
      }
    }
  } catch (error) {
    // 디렉토리 접근 실패 시 로그 출력하고 계속 진행
    context?.logger.warn(`⚠️ Failed to access directory ${dirPath}: ${error}`);
  }

  return null;
}

/**
 * 모든 디렉토리에서 재귀적으로 .prisma 파일을 검색합니다.
 * 모듈명과 일치하는 파일을 우선적으로 찾습니다.
 */
function deepSearchPrismaFiles(
  tree: Tree,
  searchDirectories: string[],
  context: SchematicContext
): string | null {
  const config = getConfig();

  for (const searchDir of searchDirectories) {
    try {
      const dir = tree.getDir(searchDir);
      if (!dir) continue;

      // 현재 디렉토리에서 .prisma 파일 검색
      for (const file of dir.subfiles) {
        if (file.endsWith('.prisma')) {
          context.logger.debug(`🔍 Found prisma file in deep search: ${searchDir}/${file}`);
          return `${searchDir}/${file}`;
        }
      }

      // 하위 디렉토리 재귀 검색
      const subdirs = dir.subdirs.filter(subdir => !config.excludedDirectories.has(subdir));
      for (const subdir of subdirs) {
        const result = deepSearchPrismaFilesRecursive(
          tree,
          `${searchDir}/${subdir}`,
          config.excludedDirectories,
          context
        );
        if (result) {
          return result;
        }
      }
    } catch (error) {
      context.logger.warn(`⚠️ Failed to deep search in ${searchDir}: ${error}`);
    }
  }

  return null;
}

/**
 * 재귀적으로 .prisma 파일을 검색합니다.
 */
function deepSearchPrismaFilesRecursive(
  tree: Tree,
  dirPath: string,
  excludedDirectories: Set<string>,
  context: SchematicContext,
  maxDepth: number = 15,
  currentDepth: number = 0
): string | null {
  if (currentDepth >= maxDepth) {
    return null;
  }

  try {
    const dir = tree.getDir(dirPath);
    if (!dir) return null;

    // 현재 디렉토리에서 .prisma 파일 검색
    for (const file of dir.subfiles) {
      if (file.endsWith('.prisma')) {
        context.logger.debug(`🔍 Found prisma file in recursive search: ${dirPath}/${file}`);
        return `${dirPath}/${file}`;
      }
    }

    // 하위 디렉토리 재귀 검색
    const subdirs = dir.subdirs.filter(subdir => !excludedDirectories.has(subdir));
    for (const subdir of subdirs) {
      const result = deepSearchPrismaFilesRecursive(
        tree,
        `${dirPath}/${subdir}`,
        excludedDirectories,
        context,
        maxDepth,
        currentDepth + 1
      );
      if (result) {
        return result;
      }
    }
  } catch (error) {
    context.logger.debug(`⚠️ Failed to access ${dirPath} in recursive search: ${error}`);
  }

  return null;
}

