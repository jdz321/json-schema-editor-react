import { Col, Form, Input, Row, Select } from 'antd';
import { StringFormat } from '../shared';
import React from 'react';

export default function FormatFields() {
  return (
    <>
      <Row justify={'start'} align={'middle'} style={{ marginBottom: 13 }}>
        <Col span={4} style={{ textAlign: 'right' }}>
          正则匹配：
        </Col>
        <Col span={20}>
          <Form.Item noStyle name={'pattern'}>
            <Input placeholder={'请输入正则匹配公式'} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify={'start'} align={'middle'} style={{ marginBottom: 13 }}>
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
  );
}
