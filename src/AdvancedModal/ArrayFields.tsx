import { Col, Form, InputNumber, Row, Switch } from 'antd';
import React from 'react';

export default function ArrayFields() {
  return (
    <>
      <Row justify={'start'} align={'middle'} style={{ marginBottom: 13 }}>
        <Col span={4} style={{ textAlign: 'right' }}>
          元素唯一：
        </Col>
        <Col span={20}>
          <Form.Item noStyle name={'uniqueItems'} valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Row justify={'start'} align={'middle'} style={{ marginBottom: 13 }}>
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
  );
}
