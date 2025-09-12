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
    const templateSource = apply(url("./file"), [
      template({
        ...options,
        ...strings, // dasherize, classify, etc.
      }),
      move(`${options.path}/${strings.dasherize(options.name)}`),
      forEach((fileEntry: FileEntry) => {
        // With __name@dasherize__ filenames, we can drop .template suffix removal if not used.
        if (fileEntry.path.endsWith(".template")) {
          const newPath = fileEntry.path.replace(/\.template$/, "") as any;
          return { path: newPath, content: fileEntry.content } as FileEntry;
        }
        return fileEntry;
      }),
    ]);

    return chain([
      mergeWith(templateSource),
      // (원한다면) src/app.module.ts 등 기존 파일에 import 추가하는 AST 조작 코드
    ])(tree, context);
  };
}
