import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd';
import React from 'react';
import { SchemaTypeFlags } from './advancedModalShared';

type EnumFieldsProps = SchemaTypeFlags;

export default function EnumFields({
  isString,
  isNumber,
  isInteger,
}: EnumFieldsProps) {
  return (
    <Row justify={'start'} align={'middle'} style={{ marginBottom: 13 }}>
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
                          {isString && <Input placeholder="请输入枚举值" />}
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
                    <Button onClick={() => add()} block icon={<PlusOutlined />}>
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
  );
}
