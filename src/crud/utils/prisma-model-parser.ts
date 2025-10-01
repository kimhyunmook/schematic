import { Tree, SchematicContext } from "@angular-devkit/schematics";

export interface PrismaModelField {
    name: string;
    type: string;
    optional: boolean;
}

export interface PrismaModel {
    name: string;
    fields: PrismaModelField[];
}

/**
 * Prisma 스키마 파일에서 모델을 파싱합니다.
 */
export function parsePrismaModel(
    tree: Tree,
    context: SchematicContext,
    prismaPath: string
): PrismaModel | undefined {
    const buf = tree.read(prismaPath);
    if (!buf) {
        context.logger.warn(`Could not read prisma file: ${prismaPath}`);
        return undefined;
    }

    const text = buf.toString("utf-8");

    // Find the first model block in the prisma schema
    const allModelRegex = /model\s+(\w+)\s+\{([\s\S]*?)\}/gm;
    const firstMatch = allModelRegex.exec(text);

    if (
        firstMatch &&
        typeof firstMatch[1] === "string" &&
        typeof firstMatch[2] === "string"
    ) {
        const modelName: string = firstMatch[1];
        const body: string = firstMatch[2];
        const fields: PrismaModelField[] = parseModelFields(body);

        context.logger.info(`Found model '${modelName}' in ${prismaPath}`);
        return { name: modelName, fields };
    } else {
        context.logger.warn(`No model block found in ${prismaPath}`);
        return undefined;
    }
}

/**
 * 모델 본문에서 필드들을 파싱합니다.
 */
function parseModelFields(body: string): PrismaModelField[] {
    const fields: PrismaModelField[] = [];
    const lines = body.split(/\r?\n/);
    const lineRegex = /^\s*(\w+)\s+([A-Za-z_][A-Za-z0-9_]*)(\[\])?(\?)?/;

    for (const line of lines) {
        const trimmed = line.trim();
        if (
            !trimmed ||
            trimmed.startsWith("@") ||
            trimmed.startsWith("@@") ||
            trimmed.startsWith("}")
        ) {
            continue;
        }

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

    return fields;
}

