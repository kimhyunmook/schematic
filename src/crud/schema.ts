export interface CrudSchema {
  name: string;
  path?: string;
  prismaPath?: string;
  domain?: string;
}

export interface Schema extends CrudSchema { }
