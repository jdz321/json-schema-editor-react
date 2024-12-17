import { App } from 'antd';
import pointer from 'json-pointer';
import React, { ComponentType, useEffect, useState, type FC } from 'react';
import AdvancedModal, { useAdvancedModal } from '../AdvancedModal';
import SchemaEditorItem from '../SchemaEditorItem';
import { AdvancedModalContext, MutationContext } from '../context';
import { clone, genPropertyName } from '../shared';
import { JSONSchema, TextEditorProps } from '../types';
import SimpleTextEditor from '../SimpleTextEditor';

interface SchemaEditorProps {
  value?: JSONSchema;
  onChange?(val: JSONSchema): void;
  disableDefinitions?: boolean;
  TextEditor?: ComponentType<TextEditorProps>;
}

function updateRequiredList(
  list: string[] | undefined,
  name: string,
  val: boolean,
) {
  let res = list || [];
  if (!val) {
    res = res.filter((k) => k !== name);
  }
  if (val && !res.includes(name)) {
    res.push(name);
  }
  return res.length ? res : void 0;
}

const SchemaEditor: FC<SchemaEditorProps> = ({
  value,
  onChange,
  disableDefinitions,
  TextEditor = SimpleTextEditor,
}) => {
  const [schema, setSchema] = useState(
    value || ({ type: 'object' } as JSONSchema),
  );

  const modalProps = useAdvancedModal();

  useEffect(() => {
    if (typeof value !== 'undefined') {
      setSchema(value);
    }
  }, [value]);

  const fireChange = (val: JSONSchema) => {
    if (typeof value === 'undefined') {
      setSchema(val);
    }
    if (onChange) {
      onChange(val);
    }
  };

  const addProperty = (path: string[]) => {
    console.log(path);
    const res = clone(schema);
    const dest = [...path, 'properties'];
    const { has, get, set } = pointer(res);
    const properties = has(dest) ? get(dest) : {};
    set(dest, { ...properties, [genPropertyName(properties)]: {} });
    fireChange(res);
  };
  const renameProperty = (path: string[], propertyName: string) => {
    const res = clone(schema);
    const dest = path.slice(0, -2);
    const target = pointer.get(res, dest) as JSONSchema;
    target.properties = Object.entries(target.properties!).reduce(
      (prev, [key, val]) => ({
        ...prev,
        [key === path[path.length - 1] ? propertyName : key]: val,
      }),
      {} as typeof target.properties,
    );
    if (target.required) {
      const prevName = path[path.length - 1];
      if (target.required.includes(prevName)) {
        target.required = updateRequiredList(target.required, prevName, false);
        target.required = updateRequiredList(
          target.required,
          propertyName,
          true,
        );
      }
    }
    fireChange(res);
  };
  const changeSchema = (path: string[], val: any) => {
    if (path.length === 0) {
      fireChange(val);
      return;
    }
    const res = clone(schema);
    pointer.set(res, path, val);
    fireChange(res);
  };
  const updateRequiredProperty = (
    path: string[],
    name: string,
    val: boolean,
  ) => {
    const res = clone(schema);
    const dest = path.slice(0, -2);
    const target = pointer.get(res, dest) as JSONSchema;
    target.required = updateRequiredList(target.required, name, val);
    fireChange(res);
  };
  const removeProperty = (path: string[]) => {
    const res = clone(schema);
    pointer.remove(res, path);
    const target = pointer.get(res, path.slice(0, -2)) as JSONSchema;
    target.required = updateRequiredList(
      target.required,
      path[path.length - 1],
      false,
    );
    fireChange(res);
  };
  return (
    <App>
      <MutationContext.Provider
        value={{
          addProperty,
          renameProperty,
          changeSchema,
          updateRequiredProperty,
          removeProperty,
        }}
      >
        <AdvancedModalContext.Provider value={modalProps.showAdvancedModal}>
          <SchemaEditorItem schema={schema} />
        </AdvancedModalContext.Provider>
      </MutationContext.Provider>
      <AdvancedModal
        {...modalProps}
        changeSchema={changeSchema}
        disableDefinitions={disableDefinitions}
        TextEditor={TextEditor}
      />
    </App>
  );
};

export default SchemaEditor;
