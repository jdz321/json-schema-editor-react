import type { JSONSchema7, JSONSchema7TypeName } from 'json-schema';
import type { CSSProperties } from 'react';

type Awaitable<T> = T | Promise<T>;

export type JSONSchema = Omit<JSONSchema7, 'definitions'> & {
  definitions?: Record<string, JSONSchema>;
};

export type JSONSchemaTypeName = JSONSchema7TypeName;

export interface SchemaMutationMethods {
  addProperty: (path: string[]) => void;
  removeProperty: (path: string[]) => void;
  renameProperty: (curPath: string[], name: string) => void;
  changeSchema: (path: string[], val: any) => void;
  updateRequiredProperty: (curPath: string[], name: string, val: any) => void;
}

export interface TextEditorProps extends Pick<CSSProperties, 'width' | 'height'> {
  value: string;
  onChange(val: string | undefined): void;
}

export interface ExternalDefinition {
  label?: string;
  value: string;
  schema: JSONSchema;
}

export interface DefinitionsProvider {
  (keyword?: string): Awaitable<ExternalDefinition[]>;
}
