import { Rule, SchematicContext, Tree, chain } from "@angular-devkit/schematics";
import { CrudSchema } from "./schema";
import {
  parsePackageConfig,
  findPrismaFile,
  parsePrismaModel,
  generateCrudTemplate,
  formatWithPrettier,
  updateAppModuleRule,
} from "./utils";

/**
 * CRUD 모듈을 생성하는 메인 스키마틱 함수
 */
export function crudModule(options: CrudSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    // 1. Parse package.json configuration
    const packageConfig = parsePackageConfig(tree, context);

    // 2. Find prisma file for the module
    const prismaPath = findPrismaFile(tree, context, options.name);

    // 3. Parse prisma model if file exists
    let prismaModel;
    if (prismaPath) {
      prismaModel = parsePrismaModel(tree, context, prismaPath);
    }

    // 4. Generate CRUD template
    const resolvedPath = options.path ?? packageConfig.path ?? "src/resources";
    const templateRule = generateCrudTemplate(options, prismaModel, resolvedPath);

    // 5. Update app.module.ts
    const appModuleRule = updateAppModuleRule(options.name, resolvedPath);

    // 6. Format with Prettier (if available)
    const prettierRule = formatWithPrettier(options, resolvedPath);

    return chain([
      templateRule,
      appModuleRule,
      prettierRule,
    ])(tree, context);
  };
}