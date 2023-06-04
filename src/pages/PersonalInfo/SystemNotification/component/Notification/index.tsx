import React from 'react';
import { Button, Col, Row, Space, Card } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { RightCircleOutlined } from '@ant-design/icons';

const Notification: React.FC = () => {
  return (
    <Card style={{ width: '100%' }}>
      <Row>
        <Col span={4}>
          <RightCircleOutlined />
        </Col>
        <Col span={8}>系统更新通知</Col>
        <Col span={4}>1小时前</Col>
      </Row>
      <Row>
        <Col span={24}>用户您好，请及时更新系统……</Col>
      </Row>
    </Card>
  );
};

export default Notification;
