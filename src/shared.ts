import type { SelectProps } from 'antd'
import type { JSONSchema } from './types';

export const SchemaTypes = [
  'string',
  'number',
  'array',
  'object',
  'boolean',
  'integer',
] as const;

export const SchemaTypeOptions = SchemaTypes.map((value) => {
  return { value: value };
});

export const defTypePrefix = 'def:'

export const getSchemaTypeOptions = (definitions: JSONSchema['definitions'] = {}) => {
  const defOptions = Object.keys(definitions).map((name) => ({
    label: name,
    value: `${defTypePrefix}${name}`,
  }))
  const options: SelectProps['options'] = [{
    label: 'basic types',
    options: SchemaTypeOptions,
  }]
  if (defOptions.length) {
    options.push({
      label: 'definitions',
      options: defOptions,
    })
  }
  return options
}

export function getDefaultSchema(type: JSONSchema['type']): JSONSchema {
  switch (type) {
    case 'string':
      return { type: 'string' };
    case 'number':
      return { type: 'number' };
    case 'boolean':
      return { type: 'boolean' };
    case 'object':
      return { type: 'object', properties: {} };
    case 'integer':
      return { type: 'integer' };
    case 'array':
      return { type: 'array', items: { type: 'string' } };
    case 'null':
  }
  return { type: 'string' };
}

export function clone<T>(val: T): T {
  return JSON.parse(JSON.stringify(val));
}

export function genPropertyName(properties: Record<string, any>): string {
  for (let i = 1; true; i += 1) {
    const p = `field${i}`;
    if (p in properties) {
      continue;
    }
    return p;
  }
}

export const StringFormat = [
  'date-time',
  'date',
  'time',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'uri',
  'regex',
] as const;

export const getStringFormatOptions = (customFormat?: string[]) => {
  return [...StringFormat, ...(customFormat || [])].map((value) => ({ value }));
};

/**
 * ref: #/definitions/xx
 */
export const getDefinitionNameFromRef = (ref: string = '') => {
  const refPrefix = '#/definitions/'
  if (ref.startsWith(refPrefix)) {
    return ref.replace(refPrefix, '')
  }
}
