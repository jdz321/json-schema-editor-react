import { JSONSchema } from './types';

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
  return JSON.parse(JSON.stringify(val))
}

export function genPropertyName(properties: Record<string, any>): string {
  for (let i = 1; true; i += 1) {
    const p = `field${i}`
    if (p in properties) {
      continue
    }
    return p
  }
}

export const StringFormat = [
  { value: 'date-time' },
  { value: 'date' },
  { value: 'time' },
  { value: 'email' },
  { value: 'hostname' },
  { value: 'ipv4' },
  { value: 'ipv6' },
  { value: 'uri' },
  { value: 'regex' },
];
