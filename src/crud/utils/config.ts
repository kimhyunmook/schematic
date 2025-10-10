/**
 * 환경변수 및 설정 관리
 */

export interface SchematicConfig {
  defaultDomain: string;
  defaultPath: string;
  defaultPrismaPath: string;
  excludedDirectories: Set<string>;
  searchDirectories: string[];
}

/**
 * 환경변수에서 설정을 로드합니다.
 * .env 파일이 없으면 기본값을 사용합니다.
 */
export function loadConfig(): SchematicConfig {
  // 기본값 설정
  const config: SchematicConfig = {
    defaultDomain: process.env["SC_DEFAULT_DOMAIN"] || "default",
    defaultPath: process.env["SC_DEFAULT_PATH"] || "src/resources",
    defaultPrismaPath:
      process.env["SC_DEFAULT_PRISMA_PATH"] || "prisma/schema.prisma",
    excludedDirectories: new Set(
      (
        process.env["SC_EXCLUDED_DIRECTORIES"] ||
        "node_modules,dist,.git,.next,.nuxt,build,out,coverage,.turbo,.cache"
      )
        .split(",")
        .map((dir) => dir.trim())
        .filter((dir) => dir.length > 0)
    ),
    searchDirectories: (process.env["SC_SEARCH_DIRECTORIES"] || "prisma,src")
      .split(",")
      .map((dir) => dir.trim())
      .filter((dir) => dir.length > 0),
  };

  return config;
}

/**
 * 싱글톤 설정 인스턴스
 */
let cachedConfig: SchematicConfig | null = null;

/**
 * 설정을 가져옵니다 (캐시 사용)
 */
export function getConfig(): SchematicConfig {
  if (!cachedConfig) {
    cachedConfig = loadConfig();
  }
  return cachedConfig;
}

