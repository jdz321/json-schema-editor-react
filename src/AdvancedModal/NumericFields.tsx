import { Col, Form, InputNumber, Row } from 'antd';
import React from 'react';

export default function NumericFields() {
  return (
    <>
      <Row justify={'start'} align={'middle'} style={{ marginBottom: 13 }}>
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
      <Row justify={'start'} align={'middle'} style={{ marginBottom: 13 }}>
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
  );
}
