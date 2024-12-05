import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import { App, Button, Col, Input, Row, Select } from 'antd';
import React, { useState, type FC } from 'react';
import type { JSONSchema } from '../types';
import { getDefaultSchema, SchemaTypeOptions } from 'json-schema-editor-react/shared';

interface SchemaEditorItemProps {
  schema: JSONSchema;
  path?: string;
  propertyName: string;
  isArrayItems: boolean;
  renameProperty: (path: string, name: string) => void;
  changeSchema: (path: string, val: JSONSchema) => void;
}

const SchemaEditorItem: FC<SchemaEditorItemProps> = ({
  schema,
  path = '/',
  propertyName,
  isArrayItems,
  renameProperty,
  changeSchema,
}) => {
  const isRoot = path === '/';
  const curPath = `${renameProperty}${propertyName}`
  const { message } = App.useApp();
  const [expand, setExpand] = useState(true);
  const [propertyNameDraft, setPropertyNameDraft] = useState(propertyName);
  return (
    <>
      <Row align="middle" gutter={5}>
        <Col flex="24px">
          <Row justify={'end'}>
            {schema.type === 'object' && (
              <Button
                type={'text'}
                size={'small'}
                icon={expand ? <CaretDownOutlined /> : <CaretRightOutlined />}
                onClick={() => setExpand(!expand)}
              />
            )}
          </Row>
        </Col>
        <Col flex={'auto'}>
          <Input
            status={
              !isRoot && propertyNameDraft.length === 0 ? 'error' : undefined
            }
            disabled={isRoot || isArrayItems}
            value={isRoot ? propertyNameDraft || 'root' : propertyNameDraft}
            placeholder={'属性名称'}
            onBlur={() => {
              if (propertyNameDraft?.length === 0) {
                message.error('属性名称不能为空');
                return;
              }
              if (propertyNameDraft.length !== 0) {
                renameProperty(curPath, propertyNameDraft);
              }
            }}
            onChange={(name) => setPropertyNameDraft(name.target.value)}
          />
        </Col>
        <Col flex={'95px'}>
          <Select
            style={{ width: '95px' }}
            value={schema.type}
            options={SchemaTypeOptions}
            onChange={(type) => {
              changeSchema(curPath, getDefaultSchema(type));
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default SchemaEditorItem;
