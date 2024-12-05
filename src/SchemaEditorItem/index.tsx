import {
  CaretDownOutlined,
  CaretRightOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  App,
  Button,
  Col,
  Dropdown,
  Input,
  Row,
  Select,
  theme,
  Tooltip,
} from 'antd';
import {
  getDefaultSchema,
  SchemaTypeOptions,
} from 'json-schema-editor-react/shared';
import React, { useState, type FC } from 'react';
import type { JSONSchema } from '../types';

interface SchemaEditorItemProps {
  schema: JSONSchema;
  path?: string[];
  propertyName?: string;
  isArrayItems?: boolean;
  addProperty: (path: string[]) => void;
  renameProperty: (path: string[], name: string) => void;
  changeSchema: (path: string[], val: JSONSchema) => void;
}

const SchemaEditorItem: FC<SchemaEditorItemProps> = ({
  schema,
  path = [],
  propertyName = '',
  isArrayItems = false,
  addProperty,
  renameProperty,
  changeSchema,
}) => {
  const isRoot = path.length === 0;
  const curPath = propertyName ? [...path, propertyName] : path;
  const schemaItems: any = schema.items;
  const addChildItems =
    !!(
      schema.type === 'object' ||
      (isArrayItems && schemaItems?.type === 'object')
    ) &&
    !isArrayItems &&
    !isRoot;
  const { message } = App.useApp();
  const { token } = theme.useToken();
  const [expand, setExpand] = useState(true);
  const [propertyNameDraft, setPropertyNameDraft] = useState(propertyName);
  return (
    <div style={{ marginLeft: isRoot && !isArrayItems ? 0 : 17 }}>
      <Row align="middle" gutter={5} style={{ paddingBottom: 10 }}>
        <Col flex="24px" style={{ width: 24 }}>
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
        <Col flex="auto">
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
        <Col flex="95px">
          <Select
            style={{ width: '95px' }}
            value={schema.type}
            options={SchemaTypeOptions}
            onChange={(type) => {
              changeSchema(curPath, getDefaultSchema(type));
            }}
          />
        </Col>
        <Col flex={'72px'} style={{ marginLeft: 5 }}>
          {!((isArrayItems || isRoot) && schema.type !== 'object') ? (
            <Dropdown
              disabled={!addChildItems}
              placement="bottom"
              menu={{
                items: [
                  {
                    key: 'addNode',
                    label: '同级节点',
                    onClick: () => {
                      addProperty(path.slice(0, -1));
                    },
                  },
                  {
                    key: 'addChildNode',
                    label: '子级节点',
                    onClick: () => {
                      addProperty(curPath);
                    },
                  },
                ],
              }}
            >
              <Tooltip title={!addChildItems && '添加节点'}>
                <Button
                  type={'text'}
                  size={'small'}
                  icon={<PlusOutlined />}
                  style={{ color: token.colorPrimary }}
                  onClick={() => {
                    if (addChildItems) {
                      return;
                    }
                    addProperty(
                      isArrayItems || isRoot ? curPath : path.slice(0, -1),
                    );
                  }}
                />
              </Tooltip>
            </Dropdown>
          ) : (
            <div style={{ width: '24px' }} />
          )}
        </Col>
      </Row>
      {schema.properties &&
        expand &&
        Object.entries(schema.properties).map(([name, val]) => (
          <SchemaEditorItem
            path={[...curPath, 'properties']}
            propertyName={name}
            schema={val as JSONSchema}
            key={name}
            addProperty={addProperty}
            renameProperty={renameProperty}
            changeSchema={changeSchema}
          />
        ))}
      {schema.type === 'array' && (
        <SchemaEditorItem
          path={curPath}
          propertyName="items"
          schema={schema.items as JSONSchema}
          addProperty={addProperty}
          renameProperty={renameProperty}
          changeSchema={changeSchema}
          isArrayItems
        />
      )}
    </div>
  );
};

export default SchemaEditorItem;
