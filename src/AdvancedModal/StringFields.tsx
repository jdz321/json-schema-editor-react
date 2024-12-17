import { Col, Form, InputNumber, Row } from 'antd';
import React from 'react';

export default function StringFields() {
  return (
    <Row justify={'start'} align={'middle'} style={{ marginBottom: 13 }}>
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
  );
}
