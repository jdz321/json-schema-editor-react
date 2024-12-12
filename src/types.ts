import type { JSONSchema7, JSONSchema7TypeName } from 'json-schema';
import type { CSSProperties } from 'react';

export type JSONSchema = JSONSchema7;

export type JSONSchemaTypeName = JSONSchema7TypeName;

export interface SchemaMutationMethods {
  addProperty: (path: string[]) => void;
  removeProperty: (path: string[]) => void;
  renameProperty: (curPath: string[], name: string) => void;
  changeSchema: (path: string[], val: any) => void;
  updateRequiredProperty: (curPath: string[], name: string, val: any) => void;
}

export interface TextEditorProps {
  value: string;
  onChange(val: string): void;
  style?: CSSProperties;
}
