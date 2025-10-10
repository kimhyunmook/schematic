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
import { getConfig } from "./config";

/**
 * CRUD 모듈 템플릿을 생성하는 Rule을 반환합니다.
 */
export function generateCrudTemplate(
    options: CrudSchema,
    prismaModel: PrismaModel | undefined,
    resolvedPath: string
): Rule {
    const config = getConfig();

    // 도메인 템플릿 선택 (설정 또는 기본값)
    const domain = options.domain || config.defaultDomain;
    const templatePath = `./file/${domain}`;

    const templateSource = apply(url(templatePath), [
        template({
            ...options,
            ...strings, // dasherize, classify, camelize 등
            prismaModel,
        }),
        move(`${resolvedPath}/${strings.dasherize(String(options.name))}`),
        forEach((fileEntry: FileEntry) => {
            // .template 확장자 제거
            if (fileEntry.path.endsWith(".template")) {
                const newPath = fileEntry.path.replace(/\.template$/, "") as any;
                return { path: newPath, content: fileEntry.content } as FileEntry;
            }
            return fileEntry;
        }),
    ]);

    return chain([mergeWith(templateSource)]);
}
