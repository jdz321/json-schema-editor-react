import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import React from 'react';
import { SchemaTypeFlags } from './advancedModalShared'

type CommonFieldsProps = SchemaTypeFlags

export default function CommonFields({ isString, isInteger, isNumber, isBoolean }: CommonFieldsProps) {
  return (
    <Row justify={'start'} align={'middle'} style={{ marginBottom: 13 }}>
      <Col span={4} style={{ textAlign: 'right' }}>
        默认值：
      </Col>
      <Col span={8}>
        <Form.Item noStyle name={'default'}>
          {isString && (
            <Input style={{ width: '100%' }} placeholder={'请输入默认值'} />
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
  );
}
