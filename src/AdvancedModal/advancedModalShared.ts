export type SchemaTypeFlags = Record<
  | 'isRoot'
  | 'isObject'
  | 'isArray'
  | 'isNumber'
  | 'isBoolean'
  | 'isInteger'
  | 'isString',
  boolean
>;
