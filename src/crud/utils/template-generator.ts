import {
    Rule,
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
import { CrudSchema } from "../schema";
import { PrismaModel } from "./prisma-model-parser";

/**
 * CRUD 모듈 템플릿을 생성하는 Rule을 반환합니다.
 */
export function generateCrudTemplate(
    options: CrudSchema,
    prismaModel: PrismaModel | undefined,
    resolvedPath: string
): Rule {
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

    return chain([mergeWith(templateSource)]);
}
