import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, List, Modal, Select, Space } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import SchemaEditor from '../SchemaEditor';
import { clone } from '../shared';
import {
  ExternalDefinition,
  JSONSchema,
} from '../types';
import SectionTitle from './SectionTitle';
import { useEditorContext } from '../context'

type TDefinitions = Record<string, JSONSchema> | undefined;

interface DefinitionsProps {
  value: TDefinitions;
  onChange: (val: TDefinitions) => void;
}

export default function Definitions({
  value,
  onChange,
}: DefinitionsProps) {
  const { modal, message } = App.useApp()
  const { definitionsProvider, TextEditor } = useEditorContext()

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

  const [externalDefinitions, setExternalDefinitions] = useState<
    ExternalDefinition[]
  >([]);

  const onSearchDefinition = useCallback(
    (keyword?: string) => {
      Promise.resolve(definitionsProvider!(keyword)).then(
        setExternalDefinitions,
      );
    },
    [definitionsProvider, setExternalDefinitions],
  );

  const onSelectExternalDefinition = async (name: string, { schema }: ExternalDefinition) => {
    if (value && name in value) {
      const confirmed = await modal.confirm({
        title: 'This name already exists',
        content: `The definition named "${name}" already exists, do you want to replace the original one`,
      })
      if (!confirmed) {
        return
      }
    }
    onChange({ ...(value || {}), [name]: schema })
    message.success('import success')
  }

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
          {definitionsProvider && (
            <Select
              value={[]}
              style={{ width: 240 }}
              placeholder="import external definitions..."
              showSearch
              filterOption={false}
              options={externalDefinitions}
              onSearch={onSearchDefinition}
              onFocus={onSearchDefinition.bind(null, '')}
              onSelect={onSelectExternalDefinition}
            />
          )}
        </Space>
      </SectionTitle>
      <List
        size="small"
        bordered
        dataSource={Object.entries(value || {})}
        renderItem={([name, schema]) => (
          <List.Item
            actions={[
              <Button
                key="btn-edit"
                type="link"
                onClick={() => editDefinition(name, schema as JSONSchema)}
              >
                edit
              </Button>,
              <Button
                key="btn-remove"
                type="link"
                danger
                onClick={() => removeDefinition(name)}
              >
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
