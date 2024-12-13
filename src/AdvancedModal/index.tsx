import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Switch,
  theme,
} from 'antd';
import React, { ComponentType, useState } from 'react';
import SchemaEditor from '../SchemaEditor';
import SimpleTextEditor from '../SimpleTextEditor';
import { SchemaTypes, StringFormat } from '../shared';
import { JSONSchema, SchemaMutationMethods, TextEditorProps } from '../types';

const SectionTitle: React.FC<{
  children?: React.ReactNode;
  title?: string;
}> = ({ children, title }) => {
  const { token } = theme.useToken();
  const style: React.CSSProperties = {
    borderLeft: `3px solid ${token.colorPrimary}`,
    fontSize: 16,
    fontWeight: 399,
    paddingLeft: 8,
    marginBottom: 13,
  };

  return <div style={style}>{children || title}</div>;
};

interface AdvancedModalProps extends Partial<SchemaMutationMethods> {
  show: boolean;
  setShow(val: boolean): void;
  formSchema: Partial<JSONSchema>;
  setFormSchema(val: Partial<JSONSchema>): void;
  path: string[];
  form: FormInstance<Partial<JSONSchema>>;
  TextEditor?: ComponentType<TextEditorProps>;
}

export default function AdvancedModal({
  show,
  setShow,
  changeSchema,
  formSchema,
  setFormSchema,
  path,
  form,
  TextEditor = SimpleTextEditor,
}: AdvancedModalProps) {
  const isRoot = path.length === 0;
  const isObject = formSchema.type === 'object';
  const isArray = formSchema.type === 'array';
  const isNumber = formSchema.type === 'number';
  const isBoolean = formSchema.type === 'boolean';
  const isInteger = formSchema.type === 'integer';
  const isString = formSchema.type === 'string';

  const [showDefinition, setShowDefinition] = useState(false);
  const [definitionSchema, setDefinitionSchema] = useState<JSONSchema>();
  const [definitionName, setDefinitionName] = useState<string>();
  const [originDefinitionName, setOriginDefinitionName] = useState<string>();

  const createDefinition = () => {
    setDefinitionSchema({ type: 'object', properties: {} });
    setShowDefinition(true);
  };

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
          {isRoot && (
            <>
              <SectionTitle title="Definitions" />
              <button type="button" onClick={createDefinition}>
                +
              </button>
            </>
          )}
          {!isObject && SchemaTypes.indexOf(formSchema?.type as any) !== -1 && (
            <SectionTitle title="基本设置" />
          )}
          {(isString || isNumber || isInteger || isBoolean) && (
            <Row
              justify={'start'}
              align={'middle'}
              style={{ marginBottom: 13 }}
            >
              <Col span={4} style={{ textAlign: 'right' }}>
                默认值：
              </Col>
              <Col span={8}>
                <Form.Item noStyle name={'default'}>
                  {isString && (
                    <Input
                      style={{ width: '100%' }}
                      placeholder={'请输入默认值'}
                    />
                  )}
                  {(isNumber || isInteger) && (
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder={'请输入默认值'}
                    />
                  )}
                  {isBoolean && (
                    <Select
                      style={{ width: '100%' }}
                      placeholder={'请选择默认值'}
                      options={[
                        { value: true, label: 'true' },
                        { value: false, label: 'false' },
                      ]}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
          {isString && (
            <Row
              justify={'start'}
              align={'middle'}
              style={{ marginBottom: 13 }}
            >
              <Col span={4} style={{ textAlign: 'right' }}>
                最小长度：
              </Col>
              <Col span={8}>
                <Form.Item noStyle name={'minLength'}>
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    parser={(value) =>
                      value ? parseInt(value.replace(/\D/g, ''), 10) : ''
                    }
                    formatter={(value) =>
                      value ? `${Math.floor(Math.max(value, 0))}` : ''
                    }
                    placeholder={'请输入最小长度'}
                  />
                </Form.Item>
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                最大长度：
              </Col>
              <Col span={8}>
                <Form.Item noStyle name={'maxLength'}>
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    parser={(value) =>
                      value ? parseInt(value.replace(/\D/g, ''), 10) : ''
                    }
                    formatter={(value) =>
                      value ? `${Math.floor(Math.max(value, 0))}` : ''
                    }
                    placeholder={'请输入最大长度'}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
          {(isNumber || isInteger) && (
            <>
              <Row
                justify={'start'}
                align={'middle'}
                style={{ marginBottom: 13 }}
              >
                <Col span={4} style={{ textAlign: 'right' }}>
                  最小值：
                </Col>
                <Col span={8}>
                  <Form.Item noStyle name={'minimum'}>
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder={'请输入最小值'}
                    />
                  </Form.Item>
                </Col>
                <Col span={4} style={{ textAlign: 'right' }}>
                  最大值：
                </Col>
                <Col span={8}>
                  <Form.Item noStyle name={'maximum'}>
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder={'请输入最大值'}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row
                justify={'start'}
                align={'middle'}
                style={{ marginBottom: 13 }}
              >
                <Col span={4} style={{ textAlign: 'right' }}>
                  排他最小值：
                </Col>
                <Col span={8}>
                  <Form.Item noStyle name={'exclusiveMinimum'}>
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder={'请输入排他最小值'}
                    />
                  </Form.Item>
                </Col>
                <Col span={4} style={{ textAlign: 'right' }}>
                  排他最大值：
                </Col>
                <Col span={8}>
                  <Form.Item noStyle name={'exclusiveMaximum'}>
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder={'请输入排他最大值'}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          {isString && (
            <>
              <Row
                justify={'start'}
                align={'middle'}
                style={{ marginBottom: 13 }}
              >
                <Col span={4} style={{ textAlign: 'right' }}>
                  正则匹配：
                </Col>
                <Col span={20}>
                  <Form.Item noStyle name={'pattern'}>
                    <Input placeholder={'请输入正则匹配公式'} />
                  </Form.Item>
                </Col>
              </Row>
              <Row
                justify={'start'}
                align={'middle'}
                style={{ marginBottom: 13 }}
              >
                <Col span={4} style={{ textAlign: 'right' }}>
                  格式：
                </Col>
                <Col span={8}>
                  <Form.Item noStyle name={'format'}>
                    <Select
                      allowClear
                      options={StringFormat}
                      placeholder={'请选择字符串格式'}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          {isArray && (
            <>
              <Row
                justify={'start'}
                align={'middle'}
                style={{ marginBottom: 13 }}
              >
                <Col span={4} style={{ textAlign: 'right' }}>
                  元素唯一：
                </Col>
                <Col span={20}>
                  <Form.Item
                    noStyle
                    name={'uniqueItems'}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
              <Row
                justify={'start'}
                align={'middle'}
                style={{ marginBottom: 13 }}
              >
                <Col span={4} style={{ textAlign: 'right' }}>
                  最少元素个数：
                </Col>
                <Col span={8}>
                  <Form.Item noStyle name={'minItems'}>
                    <InputNumber
                      style={{ width: '100%' }}
                      parser={(value) =>
                        value ? parseInt(value.replace(/\D/g, ''), 10) : ''
                      }
                      formatter={(value) =>
                        value ? `${Math.floor(Math.max(value, 0))}` : ''
                      }
                      placeholder={'请输入最少元素个数'}
                    />
                  </Form.Item>
                </Col>
                <Col span={4} style={{ textAlign: 'right' }}>
                  最多元素个数：
                </Col>
                <Col span={8}>
                  <Form.Item noStyle name={'maxItems'}>
                    <InputNumber
                      style={{ width: '100%' }}
                      parser={(value) =>
                        value ? parseInt(value.replace(/\D/g, ''), 10) : ''
                      }
                      formatter={(value) =>
                        value ? `${Math.floor(Math.max(value, 0))}` : ''
                      }
                      placeholder={'请输入最多元素个数'}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          {(isString || isNumber || isInteger) && (
            <Row
              justify={'start'}
              align={'middle'}
              style={{ marginBottom: 13 }}
            >
              <Col span={4} style={{ textAlign: 'right' }}>
                枚举：
              </Col>
              <Col span={20}>
                <Form.List name="enums">
                  {(fields, { add, remove }) => (
                    <>
                      <Row>
                        {fields.map(({ key, name, ...restField }) => (
                          <Col span={12} key={key}>
                            <Row
                              justify={'start'}
                              align={'middle'}
                              style={{ marginBottom: 6 }}
                            >
                              <Col flex={'auto'}>
                                <Form.Item
                                  {...restField}
                                  noStyle
                                  name={[name]}
                                  rules={[{ required: true }]}
                                >
                                  {isString && (
                                    <Input placeholder="请输入枚举值" />
                                  )}
                                  {(isNumber || isInteger) && (
                                    <InputNumber
                                      style={{ width: '100%' }}
                                      placeholder="请输入枚举值"
                                    />
                                  )}
                                </Form.Item>
                              </Col>
                              <Col flex={'36px'} style={{ paddingLeft: 7 }}>
                                <DeleteOutlined onClick={() => remove(name)} />
                              </Col>
                            </Row>
                          </Col>
                        ))}
                      </Row>
                      <Row>
                        <Col span={12}>
                          <Form.Item noStyle>
                            <Button
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                            >
                              添加枚举值
                            </Button>
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )}
                </Form.List>
              </Col>
            </Row>
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
      <Modal title="Definition" open={showDefinition} width={815}>
        <SchemaEditor
          value={definitionSchema}
          onChange={(val) => setDefinitionSchema(val)}
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
