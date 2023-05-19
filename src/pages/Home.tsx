import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography, Col, Row, Statistic } from 'antd';

import React from 'react';
import styles from './Home.less';
const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);
const Home: React.FC = () => {
  return (
    <PageContainer>
      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="待办事项"
              value={5}
              precision={0}
              valueStyle={{ color: '#5781CD', fontWeight: 'bold', fontSize: 42 }}
              //prefix=
              suffix="件"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="系统通知"
              value={12}
              precision={0}
              valueStyle={{ color: '#27A77F', fontWeight: 'bold', fontSize: 42 }}
              //prefix={<ArrowUpOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="设备数量"
              value={12}
              precision={0}
              valueStyle={{ color: '#8D42A3', fontWeight: 'bold', fontSize: 42 }}
              //prefix={<ArrowUpOutlined />}
              suffix="台"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="当前时间"
              value={'17:09:00'}
              valueStyle={{ color: '#000000', fontSize: 42 }}
              //prefix={<ArrowUpOutlined />}
              //suffix="%"
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};
export default Home;
