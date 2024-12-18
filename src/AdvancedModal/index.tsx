import { Form, FormInstance, Modal } from 'antd';
import React, { useState } from 'react';
import { SchemaTypes } from '../shared';
import { JSONSchema, SchemaMutationMethods } from '../types';
import { useEditorContext } from '../context'
import ArrayFields from './ArrayFields';
import CommonFields from './CommonFields';
import Definitions from './Definitions';
import EnumFields from './EnumFields';
import FormatFields from './FormatFields';
import NumericFields from './NumericFields';
import SectionTitle from './SectionTitle';
import StringFields from './StringFields';
import { SchemaTypeFlags } from './advancedModalShared';

interface AdvancedModalProps extends Partial<SchemaMutationMethods> {
  show: boolean;
  setShow(val: boolean): void;
  formSchema: Partial<JSONSchema>;
  setFormSchema(val: Partial<JSONSchema>): void;
  path: string[];
  form: FormInstance<Partial<JSONSchema>>;
  disableDefinitions?: boolean;
}

export default function AdvancedModal({
  show,
  setShow,
  changeSchema,
  formSchema,
  setFormSchema,
  path,
  form,
  disableDefinitions,
}: AdvancedModalProps) {
  const flags: SchemaTypeFlags = {
    isRoot: path.length === 0,
    isObject: formSchema.type === 'object',
    isArray: formSchema.type === 'array',
    isNumber: formSchema.type === 'number',
    isBoolean: formSchema.type === 'boolean',
    isInteger: formSchema.type === 'integer',
    isString: formSchema.type === 'string',
  };

  const { TextEditor } = useEditorContext()

  return (
    <>
      <Modal
        title="高级设置"
        width={900}
        open={show}
        okText={'保存'}
        cancelText={'取消'}
        onOk={() => {
          if (!changeSchema) {
            return;
          }
          form
            .validateFields()
            .then((values) => {
              changeSchema(path, { ...formSchema, ...values });
              setShow(false);
            })
            .catch((errorInfo) => {
              console.log('Failed:', errorInfo);
            });
        }}
        onCancel={() => setShow(false)}
      >
        <Form
          form={form}
          onValuesChange={(_, allValues) => {
            setFormSchema({ ...formSchema, ...allValues });
          }}
        >
          {flags.isRoot && !disableDefinitions && (
            <Definitions
              value={formSchema.definitions as Record<string, JSONSchema>}
              onChange={(definitions) =>
                setFormSchema({ ...formSchema, definitions })
              }
            />
          )}
          {!flags.isObject &&
            SchemaTypes.indexOf(formSchema?.type as any) !== -1 && (
              <SectionTitle title="基本设置" />
            )}
          {(flags.isString ||
            flags.isNumber ||
            flags.isInteger ||
            flags.isBoolean) && <CommonFields {...flags} />}
          {flags.isString && <StringFields />}
          {(flags.isNumber || flags.isInteger) && <NumericFields />}
          {flags.isString && <FormatFields />}
          {flags.isArray && <ArrayFields />}
          {(flags.isString || flags.isNumber || flags.isInteger) && (
            <EnumFields {...flags} />
          )}
          <SectionTitle title="Json Schema" />
          <TextEditor
            style={{ height: 300 }}
            value={JSON.stringify(formSchema, null, 2)}
            onChange={(value) => {
              try {
                const editorSchema = JSON.parse(value);
                setFormSchema(editorSchema);
                form.setFieldsValue(editorSchema);
              } catch (e) {}
            }}
          />
        </Form>
      </Modal>
    </>
  );
}

export function useAdvancedModal() {
  const [show, setShow] = useState(false);
  const [path, setPath] = useState<string[]>([]);
  const [formSchema, setFormSchema] = useState<Partial<JSONSchema>>({});
  const [form] = Form.useForm<Partial<JSONSchema>>();
  const showAdvancedModal = (schema: Partial<JSONSchema>, path: string[]) => {
    setFormSchema(schema);
    form.resetFields();
    form.setFieldsValue(schema);
    setPath(path);
    setShow(true);
  };
  return {
    show,
    setShow,
    path,
    setPath,
    formSchema,
    setFormSchema,
    form,
    showAdvancedModal,
  };
}
