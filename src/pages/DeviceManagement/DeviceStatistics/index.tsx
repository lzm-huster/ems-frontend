import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Statistic } from 'antd';
import { Area, Bar, Column, Line, Pie } from '@ant-design/charts';
import { getDeviceList } from '@/services/swagger/device';

import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { RightOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import { Device } from '../DeviceList';
import { getMonth1st } from '@/services/general/dataProcess';
import { RepairRecord } from '../DeviceRepair';
import { getRepairList } from '@/services/swagger/repair';
//import styles from './Home.less';

//折线图数据
const plotData = (devices: Device[]) => {
  const month1st = getMonth1st(5);
  const data = [];
  for (let i = 0; i < 4; i++) {
    const date = new Date(month1st[i]);
    const node = {
      month: date.getFullYear() + '/' + (date.getMonth() + 1),
      purchaseNum: devices.filter((x: Device) => {
        const t = Date.parse(x.purchaseDate);
        return t >= month1st[i] && t < month1st[i + 1];
      }).length,
    };
    data.push(node);
  }
  const date = new Date(month1st[4]);
  const node = {
    month: date.getFullYear() + '/' + (date.getMonth() + 1),
    purchaseNum: devices.filter((x: Device) => {
      const t = Date.parse(x.purchaseDate);
      return t >= month1st[4];
    }).length,
  };
  data.push(node);
  return data;
};
const Home: React.FC = () => {
  const [deviceNum, setDeviceNum] = useState(0);
  const [initDevice, setInitDevice] = useState([]);
  const [devicePurchase, setDevicePurchase] = useState<{}>([]);
  const [repairFee, setRepairFee] = useState(0);
  const [rLineData, setRepairLineData] = useState<{}>([]);

  const repairLineData = (repairs: RepairRecord[]) => {
    const month1st = getMonth1st(5);
    const data = [];

    for (let i = 0; i < 4; i++) {
      let fee = 0;
      const date = new Date(month1st[i]);
      repairs
        .filter((x: RepairRecord) => {
          const t = Date.parse(x.repairTime);
          return t >= month1st[i] && t < month1st[i + 1];
        })
        .forEach((r) => {
          fee += r.repairFee;
        });
      const node = {
        month: date.getFullYear() + '/' + (date.getMonth() + 1),
        repairFee: fee,
      };
      data.push(node);
    }
    const date = new Date(month1st[4]);
    let fee = 0;
    repairs
      .filter((x: RepairRecord) => {
        const t = Date.parse(x.repairTime);
        return t >= month1st[4];
      })
      .forEach((r) => {
        fee += r.repairFee;
      });
    const node = {
      month: date.getFullYear() + '/' + (date.getMonth() + 1),
      repairFee: fee,
    };
    data.push(node);
    setRepairFee(fee);
    return data;
  };

  const initial = async () => {
    const res = await getDeviceList();
    if (res.code === 20000) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].purchaseDate = new Date(res.data[i].purchaseDate).toLocaleString();
      }
      setInitDevice(res.data);
      setDeviceNum(res.data.length);
      setDevicePurchase(plotData(res.data));
    }
    const rep = await getRepairList();
    if (rep.code === 20000) {
      for (let i = 0; i < rep.data.length; i++) {
        rep.data[i].repairTime = new Date(rep.data[i].repairTime).toLocaleString();
      }
      setRepairLineData(repairLineData(rep.data));
    }
  };
  useEffect(() => {
    initial();
  }, []);

  const deviceColumnConfig = {
    data: devicePurchase,
    xField: 'month',
    yField: 'purchaseNum',
    xAxis: false,
    yAxis: false,
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
      };
    },
  };
  const repairLineConfig = {
    data: rLineData,
    xField: 'month',
    yField: 'repairFee',
    smooth: true,
    xAxis: false,
    yAxis: false,
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
      };
    },
  };

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
    legend: 'none',
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
              <Column height={80} {...deviceColumnConfig} />
            </Card>
          </Link>
        </Col>
        <Col span={6}>
          <Link to={'/deviceManagement/repair/addRecord'}>
            <Card bordered={false} hoverable={true}>
              <Statistic
                title="维修费用"
                value={repairFee}
                precision={0}
                valueStyle={{ color: '#5781CD', fontWeight: 'bold', fontSize: 42 }}
                prefix="￥"
              />
              <Area height={80} {...repairLineConfig} />
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
        <Col span={16}>
          <Card bordered={false} title={'设备状态统计'}>
            <Bar height={300} {...barConfig} />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} title={'设备借用统计'}>
            <Pie height={300} {...pieConfig} />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};
export default Home;
