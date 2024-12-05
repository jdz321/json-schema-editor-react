import SchemaEditorItem from 'json-schema-editor-react/SchemaEditorItem';
import { JSONSchema } from 'json-schema-editor-react/types';
import React, { type FC } from 'react';
import { App } from 'antd';

const schema: JSONSchema = {
  type: 'object',
};

const SchemaEditor: FC<{ title: string }> = () => {
  const renameProperty = (path: string, propertyName: string) => {};
  const changeSchema = (path: string, val: JSONSchema) => {}
  return (
    <App>
      <SchemaEditorItem
        schema={schema}
        propertyName="root"
        isArrayItems={false}
        renameProperty={renameProperty}
        changeSchema={changeSchema}
      />
    </App>
  );
};

export default SchemaEditor;
