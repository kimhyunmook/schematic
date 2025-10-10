import { Tree, SchematicContext } from "@angular-devkit/schematics";

export interface PackageConfig {
    path?: string;
    prismaPath?: string;
}

/**
 * package.json에서 스키마틱 설정을 읽어옵니다.
 */
export function parsePackageConfig(
    tree: Tree,
    context: SchematicContext
): PackageConfig {
    let packageConfig: PackageConfig = {};
    const pkgPath = "package.json";

    if (tree.exists(pkgPath)) {
        try {
            const pkgBuf = tree.read(pkgPath);
            if (pkgBuf) {
                const pkgJson = JSON.parse(pkgBuf.toString("utf-8")) as any;
                const rootCfg =
                    (pkgJson &&
                        (pkgJson.schematic ||
                            pkgJson["schematic-crud"] ||
                            pkgJson.schematicsConfig)) ||
                    {};
                const crudCfg = rootCfg.crudModule || rootCfg.crud || rootCfg;
                if (crudCfg && typeof crudCfg === "object") {
                    packageConfig.path = crudCfg.path;
                    packageConfig.prismaPath = crudCfg.prismaPath;
                }
            }
        } catch (e) {
            context.logger.warn(
                `Failed reading package.json config: ${e instanceof Error ? e.message : e
                }`
            );
        }
    }

    return packageConfig;
}

