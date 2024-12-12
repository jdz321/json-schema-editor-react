import {
  CaretDownOutlined,
  CaretRightOutlined,
  DeleteOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  App,
  Button,
  Checkbox,
  Col,
  Dropdown,
  Input,
  Row,
  Select,
  Tooltip,
  theme,
} from 'antd';
import React, { useState, type FC } from 'react';
import { useMutationContext } from '../context';
import { SchemaTypeOptions, getDefaultSchema } from '../shared';
import type { JSONSchema } from '../types';
import ComposiableInput from './ComposiableInput';

interface SchemaEditorItemProps {
  schema: JSONSchema;
  path?: string[];
  propertyName?: string;
  isArrayItems?: boolean;
  required?: boolean;
}

const SchemaEditorItem: FC<SchemaEditorItemProps> = ({
  schema,
  path = [],
  propertyName = '',
  isArrayItems = false,
  required,
}) => {
  const {
    addProperty,
    removeProperty,
    renameProperty,
    changeSchema,
    updateRequiredProperty,
  } = useMutationContext();
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
              renameProperty(curPath, propertyNameDraft);
            }}
            onChange={(name) => setPropertyNameDraft(name.target.value)}
          />
        </Col>
        <Col flex={'16px'}>
          <Checkbox
            checked={required}
            disabled={isArrayItems || isRoot}
            onChange={(e) => {
              updateRequiredProperty(
                curPath,
                propertyNameDraft,
                e.target.checked,
              );
            }}
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
        <Col flex="auto">
          <ComposiableInput
            value={schema.title}
            placeholder={'标题'}
            onChange={(e) => {
              changeSchema([...curPath, 'title'], e.target.value);
            }}
          />
        </Col>
        <Col flex={'auto'}>
          <ComposiableInput
            placeholder={'描述'}
            value={schema.description}
            onChange={(e) =>
              changeSchema([...curPath, 'description'], e.target.value)
            }
          />
        </Col>
        <Col flex={'72px'}>
          <Row style={{ width: '72px' }}>
            <Tooltip title={'高级设置'}>
              <Button
                type={'text'}
                size={'small'}
                icon={<SettingOutlined />}
                style={{ color: 'green' }}
                onClick={() => {
                  // setFormSchema(schema);
                  // setAdvancedModal(!advancedModal);
                }}
              />
            </Tooltip>
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
            <Col flex={'24px'}>
              {!isRoot && !isArrayItems ? (
                <Tooltip title={'删除节点'}>
                  <Button
                    danger
                    type={'text'}
                    size={'small'}
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      removeProperty(curPath);
                    }}
                  />
                </Tooltip>
              ) : (
                <div style={{ width: '24px' }} />
              )}
            </Col>
          </Row>
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
            required={schema.required?.includes(name)}
          />
        ))}
      {schema.type === 'array' && (
        <SchemaEditorItem
          path={curPath}
          propertyName="items"
          schema={schema.items as JSONSchema}
          isArrayItems
        />
      )}
    </div>
  );
};

export default SchemaEditorItem;
