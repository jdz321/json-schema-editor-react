import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, List, Modal, Space } from 'antd';
import React, { ComponentType, useRef, useState } from 'react';
import SchemaEditor from '../SchemaEditor';
import { clone } from '../shared';
import { JSONSchema, TextEditorProps } from '../types';
import SectionTitle from './SectionTitle';

type TDefinitions = Record<string, JSONSchema> | undefined;

interface DefinitionsProps {
  value: TDefinitions;
  onChange: (val: TDefinitions) => void;
  TextEditor: ComponentType<TextEditorProps>;
}

export default function Definitions({
  value,
  onChange,
  TextEditor,
}: DefinitionsProps) {
  const [showDefinition, setShowDefinition] = useState(false);
  const [definitionSchema, setDefinitionSchema] = useState<JSONSchema>({});
  const [definitionName, setDefinitionName] = useState<string>('');
  const originDefinitionName = useRef<string | null>(null);
  const [definitionNameHelp, setDefinitionNameHelp] = useState('');

  const createDefinition = () => {
    originDefinitionName.current = null;
    setDefinitionName('');
    setDefinitionSchema({ type: 'object', properties: {} });
    setDefinitionNameHelp('');
    setShowDefinition(true);
  };

  const editDefinition = (name: string, def: JSONSchema) => {
    originDefinitionName.current = name;
    setDefinitionName(name);
    setDefinitionSchema(def);
    setDefinitionNameHelp('');
    setShowDefinition(true);
  };

  const removeDefinition = (name: string) => {
    const definitions = clone(value) as Record<string, JSONSchema>;
    delete definitions[name];
    onChange(definitions);
  };

  const validateDefinitionName = (val: string) => {
    if (!val.trim()) {
      return 'Name is required';
    }
    if (val !== originDefinitionName.current && value && val in value) {
      return 'This name already exists';
    }
    return '';
  };
  return (
    <>
      <SectionTitle>
        <Space>
          <span>Definitions</span>
          <Button
            type="primary"
            onClick={createDefinition}
            icon={<PlusOutlined />}
          >
            Create
          </Button>
        </Space>
      </SectionTitle>
      <List
        dataSource={Object.entries(value || {})}
        renderItem={([name, schema]) => (
          <List.Item
            actions={[
              <Button
                key="btn-edit"
                onClick={() => editDefinition(name, schema as JSONSchema)}
              >
                edit
              </Button>,
              <Button key="btn-remove" onClick={() => removeDefinition(name)}>
                remove
              </Button>,
            ]}
          >
            {name}
          </List.Item>
        )}
      />
      <Modal
        title="Definition"
        open={showDefinition}
        width="fit-content"
        onCancel={() => setShowDefinition(false)}
        onOk={() => {
          const msg = validateDefinitionName(definitionName);
          if (msg) {
            setDefinitionNameHelp(msg);
            return;
          }
          const definitions = clone(
            (value || {}) as Record<string, JSONSchema>,
          );
          if (originDefinitionName.current) {
            delete definitions[originDefinitionName.current];
          }
          definitions[definitionName] = definitionSchema;
          onChange(definitions);
          setShowDefinition(false);
        }}
      >
        <Form.Item<string>
          label="name"
          required
          help={definitionNameHelp}
          validateStatus={definitionNameHelp ? 'error' : 'success'}
        >
          <Input
            placeholder="definition name"
            value={definitionName}
            onChange={(e) => {
              setDefinitionName(e.target.value);
              setDefinitionNameHelp(validateDefinitionName(e.target.value));
            }}
          />
        </Form.Item>
        <SchemaEditor
          value={definitionSchema}
          onChange={(val) => setDefinitionSchema(val)}
          disableDefinitions
        />
        <TextEditor
          style={{ height: 300 }}
          value={JSON.stringify(definitionSchema, null, 2)}
          onChange={(value) => {
            try {
              setDefinitionSchema(JSON.parse(value));
            } catch (e) {}
          }}
        />
      </Modal>
    </>
  );
}
