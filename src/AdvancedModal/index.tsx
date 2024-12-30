import { Form, FormInstance, Modal } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useEditorContext } from '../context';
import { SchemaTypes } from '../shared';
import { JSONSchema, SchemaMutationMethods } from '../types';
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
  const { TextEditor } = useEditorContext();

  const [schema, setSchema] = useState<Partial<JSONSchema>>(formSchema);
  const flags = useMemo<SchemaTypeFlags>(
    () => ({
      isRoot: path.length === 0,
      isObject: schema.type === 'object',
      isArray: schema.type === 'array',
      isNumber: schema.type === 'number',
      isBoolean: schema.type === 'boolean',
      isInteger: schema.type === 'integer',
      isString: schema.type === 'string',
    }),
    [schema, path],
  );

  useEffect(() => {
    setSchema(formSchema);
  }, [formSchema]);

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
              changeSchema(path, { ...schema, ...values });
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
            setFormSchema({ ...schema, ...allValues });
          }}
        >
          {flags.isRoot && !disableDefinitions && (
            <Definitions
              value={schema.definitions}
              onChange={(definitions) =>
                setFormSchema({ ...schema, definitions })
              }
            />
          )}
          {!flags.isObject &&
            SchemaTypes.indexOf(schema?.type as any) !== -1 && (
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
            height={300}
            value={JSON.stringify(schema, null, 2)}
            onChange={(value) => {
              try {
                const editorSchema = JSON.parse(value as string);
                setSchema(editorSchema);
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
