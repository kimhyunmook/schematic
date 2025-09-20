export interface CrudSchema {
  name: string;
  path?: string;
  prismaPath?: string;
}

export interface Schema extends CrudSchema {}
