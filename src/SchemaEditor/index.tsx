import SchemaEditorItem from 'json-schema-editor-react/SchemaEditorItem';
import { JSONSchema } from 'json-schema-editor-react/types';
import React, { useEffect, useState, type FC } from 'react';
import { App } from 'antd';
import pointer from 'json-pointer'
import { clone, genPropertyName } from 'json-schema-editor-react/shared';

interface SchemaEditorProps {
  value?: JSONSchema
  onChange?(val: JSONSchema): void
}

const SchemaEditor: FC<SchemaEditorProps> = ({ value, onChange }) => {
  const [schema, setSchema] = useState(value || { type: 'object' } as JSONSchema)

  useEffect(() => {
    if (typeof value !== 'undefined') {
      setSchema(value)
    }
  }, [value])

  const fireChange = (val: JSONSchema) => {
    if (typeof value === 'undefined') {
      setSchema(val)
    }
    if (onChange) {
      onChange(val)
    }
  }

  const addProperty = (path: string[]) => {
    console.log(path)
    const res = clone(schema)
    const dest = [...path, 'properties']
    const { has, get, set } = pointer(res)
    const properties = has(dest) ? get(dest) : {}
    set(dest, { ...properties, [genPropertyName(properties)]: {} })
    fireChange(res)
  };
  const renameProperty = (path: string[], propertyName: string) => {
    const res = clone(schema)
    const dest = path.slice(0, -1)
    const properties = pointer.get(res, dest) as Record<string, JSONSchema>
    const newProperties = Object.entries(properties).reduce((prev, [key, val]) => ({
      ...prev,
      [key === path[path.length - 1] ? propertyName : key]: val,
    }), {} as Record<string, JSONSchema>)
    pointer.set(res, dest, newProperties)
    fireChange(res)
  };
  const changeSchema = (path: string[], val: JSONSchema) => {
    if (path.length === 0) {
      fireChange(val)
      return
    }
    const res = clone(schema)
    pointer.set(res, path, val)
    fireChange(res)
  }
  return (
    <App>
      <SchemaEditorItem
        schema={schema}
        isArrayItems={false}
        addProperty={addProperty}
        renameProperty={renameProperty}
        changeSchema={changeSchema}
      />
    </App>
  );
};

export default SchemaEditor;
