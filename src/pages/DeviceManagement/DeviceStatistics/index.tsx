import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Statistic } from 'antd';
import { Bar, Pie } from '@ant-design/charts';
import { getDeviceList } from '@/services/swagger/device';

import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { RightOutlined } from '@ant-design/icons';
import { Link } from 'umi';
//import styles from './Home.less';

const Home: React.FC = () => {
  const [deviceNum, setDeviceNum] = useState(0);
  const [initDevice, setInitDevice] = useState([]);
  const [timeNow, setTime] = useState('00:00:00');

  function formatTime() {
    const date = new Date();
    const hours = date.getHours();
    const hoursString = hours < 10 ? '0' + hours : hours;
    const minutes = date.getMinutes();
    const minutesString = minutes < 10 ? '0' + minutes : minutes;
    const seconds = date.getSeconds();
    const secondsString = seconds < 10 ? '0' + seconds : seconds;
    return hoursString + ':' + minutesString + ':' + secondsString;
  }

  setInterval(function () {
    setTime(formatTime());
  }, 1000);

  const initial = async () => {
    const res = await getDeviceList();
    if (res.code === 20000) {
      setInitDevice(res.data);
      setDeviceNum(res.data.length);
    }
  };
  useEffect(() => {
    initial();
  }, []);
  const deviceData = [
    {
      state: '正常',
      num: initDevice.filter((x) => {
        return x.deviceState == '正常';
      }).length,
    },
    {
      state: '借出中',
      num: initDevice.filter((x) => {
        return x.deviceState == '借出中';
      }).length,
    },
    {
      state: '维修中',
      num: initDevice.filter((x) => {
        return x.deviceState == '维修中';
      }).length,
    },
    {
      state: '保养中',
      num: initDevice.filter((x) => {
        return x.deviceState == '保养中';
      }).length,
    },
    {
      state: '已报废',
      num: initDevice.filter((x) => {
        return x.deviceState == '已报废';
      }).length,
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
      type: '借出中',
      num: initDevice.filter((x) => {
        return x.deviceState == '借出中';
      }).length,
    },
    {
      type: '在库',
      num:
        deviceNum -
        initDevice.filter((x) => {
          return x.deviceState == '借出中';
        }).length -
        initDevice.filter((x) => {
          return x.deviceState == '已报废';
        }).length,
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
  return (
    <PageContainer>
      <Row gutter={[16, 24]}>
        <Col span={6}>
          <Link to={'/deviceManagement/list/'}>
            <Card bordered={false} hoverable={true}>
              <Statistic
                title="设备数量"
                value={deviceNum}
                precision={0}
                valueStyle={{ color: '#8D42A3', fontWeight: 'bold', fontSize: 42 }}
                suffix="台"
              />
              <Bar height={50} width={100} {...barConfig} />
            </Card>
          </Link>
        </Col>
        <Col span={6}>
          <Link to={'/deviceManagement/repair/addRecord'}>
            <Card bordered={false} hoverable={true}>
              <Statistic
                title="待办事项"
                value={5}
                precision={0}
                valueStyle={{ color: '#5781CD', fontWeight: 'bold', fontSize: 42 }}
                suffix="件"
              />
            </Card>
          </Link>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="系统通知"
              value={12}
              precision={0}
              valueStyle={{ color: '#27A77F', fontWeight: 'bold', fontSize: 42 }}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="当前时间"
              value={timeNow}
              valueStyle={{ color: '#000000', fontSize: 42 }}
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
