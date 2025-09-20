import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  url,
  template,
  move,
  chain,
  mergeWith,
  forEach,
  FileEntry,
} from "@angular-devkit/schematics";
import { strings } from "@angular-devkit/core";
import { CrudSchema } from "./schema";

export function crudModule(options: CrudSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    // Read consumer package.json for default config (optional)
    let packageConfig: { path?: string; prismaPath?: string } = {};
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
          `Failed reading package.json config: ${
            e instanceof Error ? e.message : e
          }`
        );
      }
    }
    // Parse prisma to extract fields for the model if available
    let prismaModel:
      | {
          name: string;
          fields: Array<{ name: string; type: string; optional: boolean }>;
        }
      | undefined;
    // Resolve prisma schema: explicit file or default fallback
    const prismaPath =
      options.prismaPath || packageConfig.prismaPath || "prisma/schema.prisma";
    if (tree.exists(prismaPath)) {
      const buf = tree.read(prismaPath);
      if (buf) {
        const text = buf.toString("utf-8");
        // Find the first model block in the prisma schema (ignore schematic name)
        const allModelRegex = /model\s+(\w+)\s+\{([\s\S]*?)\}/gm;
        const firstMatch = allModelRegex.exec(text);
        if (
          firstMatch &&
          typeof firstMatch[1] === "string" &&
          typeof firstMatch[2] === "string"
        ) {
          const modelName: string = firstMatch[1];
          const body: string = firstMatch[2];
          const fields: Array<{
            name: string;
            type: string;
            optional: boolean;
          }> = [];
          const lines = body.split(/\r?\n/);
          const lineRegex = /^\s*(\w+)\s+([A-Za-z_][A-Za-z0-9_]*)(\[\])?(\?)?/;
          for (const line of lines) {
            const trimmed = line.trim();
            if (
              !trimmed ||
              trimmed.startsWith("@") ||
              trimmed.startsWith("@@") ||
              trimmed.startsWith("}")
            )
              continue;
            const m = trimmed.match(lineRegex);
            if (!m) continue;
            const fName = m[1] ?? "";
            const fType = m[2] ?? "any";
            const isArray = Boolean(m[3]);
            const isOptional = Boolean(m[4]);
            // Skip relation fields and array (list) fields
            if (isArray) continue;
            if (/\@relation\b/.test(trimmed)) continue;
            fields.push({
              name: fName,
              type: isArray ? `${fType}[]` : fType,
              optional: isOptional,
            });
          }
          prismaModel = { name: modelName, fields };
        } else {
          context.logger.warn(`No model block found in ${prismaPath}`);
        }
      }
    } else {
      context.logger.info(
        `Prisma schema not found at ${prismaPath}. Skipping prisma-driven fields.`
      );
    }
    const resolvedPath = options.path ?? packageConfig.path ?? "src/resources";
    const templateSource = apply(url("./file"), [
      template({
        ...options,
        ...strings, // dasherize, classify, etc.
        prismaModel,
      }),
      move(`${resolvedPath}/${strings.dasherize(String(options.name))}`),
      forEach((fileEntry: FileEntry) => {
        // With __name@dasherize__ filenames, we can drop .template suffix removal if not used.
        if (fileEntry.path.endsWith(".template")) {
          const newPath = fileEntry.path.replace(/\.template$/, "") as any;
          return { path: newPath, content: fileEntry.content } as FileEntry;
        }
        return fileEntry;
      }),
    ]);

    return chain([mergeWith(templateSource)])(tree, context);
  };
}
