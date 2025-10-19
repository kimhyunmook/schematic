import {
  Rule,
  SchematicContext,
  Tree,
  chain,
} from "@angular-devkit/schematics";
import { CrudSchema } from "./schema";
import {
  getConfig,
  parsePackageConfig,
  findPrismaFile,
  parsePrismaModel,
  generateCrudTemplate,
  formatWithPrettier,
  updateAppModuleRule,
} from "./utils";

/**
 * CRUD 모듈을 생성하는 메인 스키마틱 함수
 *
 * 업그레이드된 기능:
 * - 자동 package.json 설정 파싱
 * - 도메인별 템플릿 지원 (space, doda)
 * - 환경변수 설정 지원
 * - 모듈별 개별 Prisma 파일 지원 (prisma/[name].prisma)
 * - 개선된 Prisma 모델 파싱 (설명, 배열 타입 등)
 * - 자동 app.module.ts 업데이트
 * - Prettier 자동 포맷팅
 */
export function crudModule(options: CrudSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const config = getConfig();

    // 도메인 기본값 설정 (환경변수 우선)
    const domain = options.domain || config.defaultDomain;
    context.logger.info(
      `🚀 Generating CRUD module for: ${options.name} (domain: ${domain})`
    );

    // 1. Parse package.json configuration
    const packageConfig = parsePackageConfig(tree, context);

    // 2. Find prisma file for the module
    context.logger.debug(`🔍 Options prismaPath: ${options.prismaPath}`);
    context.logger.debug(`🔍 PackageConfig prismaPath: ${packageConfig.prismaPath}`);
    const prismaPath = findPrismaFile(
      tree,
      context,
      options.name,
      options.prismaPath || packageConfig.prismaPath
    );

    // 3. Parse prisma model if file exists
    let prismaModel;
    if (prismaPath) {
      prismaModel = parsePrismaModel(tree, context, prismaPath, options.name);
    }

    // 4. Generate CRUD template (환경변수 기본 경로 사용)
    const resolvedPath =
      options.path ?? packageConfig.path ?? config.defaultPath;
    const templateRule = generateCrudTemplate(
      { ...options, domain }, // 도메인 정보 전달
      prismaModel,
      resolvedPath
    );

    // 5. Update app.module.ts (자동으로 모듈 추가)
    const appModuleRule = updateAppModuleRule(options.name, resolvedPath);

    // 6. Format with Prettier (if available)
    const prettierRule = formatWithPrettier(options, resolvedPath);

    // 7. Execute all rules in sequence
    return chain([templateRule, appModuleRule, prettierRule])(tree, context);
  };
}