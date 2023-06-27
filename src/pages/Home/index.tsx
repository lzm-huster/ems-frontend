import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Statistic } from 'antd';
import { Bar, Pie } from '@ant-design/charts';
import { getDeviceList } from '@/services/swagger/device';

import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { RightOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import { getUserInfo } from '@/services/swagger/user';
//import styles from './Home.less';

const Home: React.FC = () => {
  const [deviceNum, setDeviceNum] = useState(0);
  const [initDevice, setInitDevice] = useState([]);
  const [timeNow, setTime] = useState('00:00:00');
  const [userName, setUserName] = useState('尊敬的用户');

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
    const user = await getUserInfo();
    if (user.code === 20000) {
      setUserName(user.data.userName);
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
      state: '外借',
      num: initDevice.filter((x) => {
        return x.deviceState == '外借';
      }).length,
    },
    {
      state: '报废',
      num: initDevice.filter((x) => {
        return x.deviceState == '报废';
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
      type: '外借',
      num: initDevice.filter((x) => {
        return x.deviceState == '外借';
      }).length,
    },
    {
      type: '在库',
      num:
        deviceNum -
        initDevice.filter((x) => {
          return x.deviceState == '外借';
        }).length -
        initDevice.filter((x) => {
          return x.deviceState == '报废';
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
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="欢迎您"
              value={userName}
              valueStyle={{ color: '#000000', fontWeight: 'regular', fontSize: 40 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Link to={'/deviceManagement/list/'}>
            <Card bordered={false} hoverable={true}>
              <Statistic
                title="设备数量"
                value={deviceNum}
                precision={0}
                valueStyle={{ color: '#8D42A3', fontWeight: 'bold', fontSize: 40 }}
                suffix="台"
              />
            </Card>
          </Link>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="当前时间"
              value={timeNow}
              valueStyle={{ color: '#000000', fontSize: 40 }}
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
