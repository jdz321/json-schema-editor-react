import type { JSONSchema7, JSONSchema7TypeName } from 'json-schema'

export type JSONSchema = JSONSchema7

export type JSONSchemaTypeName = JSONSchema7TypeName

export interface SchemaMutationMethods {
  addProperty: (path: string[]) => void;
  removeProperty: (path: string[]) => void;
  renameProperty: (curPath: string[], name: string) => void;
  changeSchema: (path: string[], val: any) => void;
  updateRequiredProperty: (curPath: string[], name: string, val: any) => void
}
