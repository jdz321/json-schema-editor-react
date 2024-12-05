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
