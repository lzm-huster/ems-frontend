import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography, Col, Row, Statistic } from 'antd';
import { Bar, Pie } from '@ant-design/charts';

import React from 'react';
import styles from './Home.less';
const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

const deviceData = [
  {
    state: '正常',
    num: 25,
  },
  {
    state: '出借',
    num: 2,
  },
  {
    state: '维修',
    num: 1,
  },
  {
    state: '保养',
    num: 2,
  },
  {
    state: '报废',
    num: 2,
  },
];
const barConfig = {
  data: deviceData,
  xField: 'num',
  yField: 'state',
  seriesField: 'state',
  legend: {
    //position: 'top-left',
  },
};

const pieData = [
  {
    type: '出借',
    num: 2,
  },
  {
    type: '在库',
    num: 30,
  },
];
const pieConfig = {
  appendPadding: 10,
  data: pieData,
  angleField: 'num',
  colorField: 'type',
  radius: 0.75,
  label: {
    type: 'spider',
    labelHeight: 28,
    content: '{name}\n{percentage}',
  },
  interactions: [
    {
      type: 'element-selected',
    },
    {
      type: 'element-active',
    },
  ],
};

const Home: React.FC = () => {
  return (
    <PageContainer>
      <Row gutter={[16, 24]}>
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
              value={32}
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
        <Col span={16}>
          <Card bordered={false} title={'设备状态统计'}>
            <Bar {...barConfig} />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} title={'设备借用统计'}>
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};
export default Home;
