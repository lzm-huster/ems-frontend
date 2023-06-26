import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Card, Col, Row, Space, Statistic } from 'antd';
import { Area, Bar, Column, Pie } from '@ant-design/charts';
import { getDeviceList } from '@/services/swagger/device';

import React, { useState, useEffect } from 'react';
import { getMonth1st } from '@/services/general/dataProcess';
import { RepairRecord } from '../DeviceRepair';
import { getRepairList } from '@/services/swagger/repair';
import { MaintenanceRecord } from '../DeviceMaintenance';
import { getMaintenanceList } from '@/services/swagger/maintenance';
import { getScrapList, getScrapNum } from '@/services/swagger/scrap';
import { ScrapRecord } from '../DeviceScrap';
//import styles from './Home.less';

const Home: React.FC = () => {
  const [deviceNum, setDeviceNum] = useState(0);
  const [initDevice, setInitDevice] = useState([]);
  const [devicePurchase, setDevicePurchase] = useState<{}>([]);
  const [repairFee, setRepairFee] = useState(0);
  const [rLineData, setRepairLineData] = useState<{}>([]);
  const [maintenanceTMonth, setMaintenanceMonth] = useState(0);
  const [mLineData, setMaintenanceLineData] = useState<{}>([]);
  const [scrapNum, setScrapNum] = useState(0);
  const [sColData, setScrapColData] = useState<{}>([]);
  const [months, setMonths] = useState(6);
  const [repairs, setRepairs] = useState<RepairRecord[]>([]);
  const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>([]);
  const [scraps, setScraps] = useState<ScrapRecord[]>([]);

  const repairLineData = (Repairs: RepairRecord[]) => {
    const month1st = getMonth1st(months);
    const data = [];

    for (let i = 0; i < months - 1; i++) {
      let fee = 0;
      const date = new Date(month1st[i]);
      Repairs.filter((x: RepairRecord) => {
        const t = Date.parse(x.repairTime);
        return t >= month1st[i] && t < month1st[i + 1];
      }).forEach((r) => {
        fee += r.repairFee;
      });
      const node = {
        month: date.getFullYear() + '/' + (date.getMonth() + 1),
        repairFee: fee,
      };
      data.push(node);
    }
    const date = new Date(month1st[months - 1]);
    let fee = 0;
    Repairs.filter((x: RepairRecord) => {
      const t = Date.parse(x.repairTime);
      return t >= month1st[months - 1];
    }).forEach((r) => {
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

  //设备采购次数数据
  const plotData = (devices: Device[]) => {
    const month1st = getMonth1st(months);
    const data = [];
    for (let i = 0; i < months - 1; i++) {
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
    const date = new Date(month1st[months - 1]);
    const node = {
      month: date.getFullYear() + '/' + (date.getMonth() + 1),
      purchaseNum: devices.filter((x: Device) => {
        const t = Date.parse(x.purchaseDate);
        return t >= month1st[months - 1];
      }).length,
    };
    data.push(node);
    return data;
  };

  //设备报废次数数据
  const scrapPlotData = (devices: ScrapRecord[]) => {
    const month1st = getMonth1st(months);
    const data = [];
    for (let i = 0; i < months - 1; i++) {
      const date = new Date(month1st[i]);
      const node = {
        month: date.getFullYear() + '/' + (date.getMonth() + 1),
        scrapNum: devices.filter((x: ScrapRecord) => {
          const t = Date.parse(x.scrapTime);
          return t >= month1st[i] && t < month1st[i + 1];
        }).length,
      };
      data.push(node);
    }
    const date = new Date(month1st[months - 1]);
    const node = {
      month: date.getFullYear() + '/' + (date.getMonth() + 1),
      scrapNum: devices.filter((x: ScrapRecord) => {
        const t = Date.parse(x.scrapTime);
        return t >= month1st[months - 1];
      }).length,
    };
    data.push(node);
    return data;
  };

  //维修折线图数据
  const mplotData = (Repairs: MaintenanceRecord[]) => {
    const month1st = getMonth1st(months);
    const data = [];
    for (let i = 0; i < months - 1; i++) {
      const date = new Date(month1st[i]);
      const node = {
        month: date.getFullYear() + '/' + (date.getMonth() + 1),
        maintenanceNum: Repairs.filter((x: MaintenanceRecord) => {
          const t = Date.parse(x.maintenanceTime);
          return t >= month1st[i] && t < month1st[i + 1];
        }).length,
      };
      data.push(node);
    }
    const date = new Date(month1st[months - 1]);
    const node = {
      month: date.getFullYear() + '/' + (date.getMonth() + 1),
      maintenanceNum: Repairs.filter((x: MaintenanceRecord) => {
        const t = Date.parse(x.maintenanceTime);
        return t >= month1st[months - 1];
      }).length,
    };
    data.push(node);
    setMaintenanceMonth(
      Repairs.filter((x: MaintenanceRecord) => {
        const t = Date.parse(x.maintenanceTime);
        return t >= month1st[months - 1];
      }).length,
    );
    return data;
  };

  const handleChangeMonths = async (m: number) => {
    setMonths(m);
    setDevicePurchase(plotData(initDevice));
    setRepairLineData(repairLineData(repairs));
    setMaintenanceLineData(mplotData(maintenances));
    setScrapColData(scrapPlotData(scraps));
  };

  const initial = async () => {
    const res = await getDeviceList();
    if (res.code === 20000) {
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
      setRepairs(rep.data);
    }
    const mai = await getMaintenanceList();
    if (mai.code === 20000) {
      for (let i = 0; i < mai.data.length; i++) {
        mai.data[i].maintenanceTime = new Date(mai.data[i].maintenanceTime).toLocaleString();
      }
      setMaintenanceLineData(mplotData(mai.data));
      setMaintenances(mai.data);
    }
    const scrap = await getScrapList();
    if (scrap.code === 20000) {
      for (let i = 0; i < scrap.data.length; i++) {
        scrap.data[i].scrapTime = new Date(scrap.data[i].scrapTime).toLocaleString();
      }
      setScrapColData(scrapPlotData(scrap.data));
      setScraps(scrap.data);
    }
    const scrapN = await getScrapNum();
    if (scrapN.code === 20000 && scrapN.data !== undefined) {
      setScrapNum(scrapN.data);
    }
  };
  useEffect(() => {
    initial();
  }, [months]);

  //设备柱形图配置
  const deviceColumnConfig = {
    data: devicePurchase,
    xField: 'month',
    yField: 'purchaseNum',
    yAxis: false,
    color: '#27A77F',
  };

  //维修折线图配置
  const repairLineConfig = {
    data: rLineData,
    xField: 'month',
    yField: 'repairFee',
    smooth: true,
    yAxis: false,
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
      };
    },
  };

  //保养折线图配置
  const maintenanceLineConfig = {
    data: mLineData,
    xField: 'month',
    yField: 'maintenanceNum',
    smooth: true,
    yAxis: false,
    color: '#27A77F',
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#ffffff 0.5:#27A77F 1:#27A77F',
      };
    },
  };

  //报废次数柱形图配置
  const scrapColumnConfig = {
    data: sColData,
    xField: 'month',
    yField: 'scrapNum',
    yAxis: false,
  };

  //设备状态数据
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
        <Col span={24}>
          <Card>
            <Space>
              <text>时间范围</text>
              <a onClick={() => handleChangeMonths(3)}>近三个月</a>
              <a onClick={() => handleChangeMonths(6)}>近六个月</a>
              <a onClick={() => handleChangeMonths(12)}>近一年</a>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable={true}>
            <Statistic
              title="设备数量"
              value={deviceNum}
              precision={0}
              valueStyle={{ color: '#8D42A3', fontWeight: 'bold', fontSize: 42 }}
              suffix="台"
            />
            <Bar height={100} width={100} {...barConfig} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable={true}>
            <Statistic
              title="待办事项"
              value={5}
              precision={0}
              valueStyle={{ color: '#5781CD', fontWeight: 'bold', fontSize: 42 }}
              suffix="件"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="本月维修费用"
              value={repairFee}
              precision={0}
              valueStyle={{ color: '#27A77F', fontWeight: 'bold', fontSize: 42 }}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="本月保养次数"
              value={maintenanceTMonth}
              precision={0}
              valueStyle={{ color: '#27A77F', fontWeight: 'regular', fontSize: 42 }}
              suffix="次"
            />
            <Area height={80} {...maintenanceLineConfig} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="已报废设备"
              value={scrapNum}
              precision={0}
              valueStyle={{ color: '#5781CD', fontWeight: 'regular', fontSize: 42 }}
              suffix="台"
            />
            <Column height={80} {...scrapColumnConfig} />
          </Card>
        </Col>
        <Col span={16}>
          <Card bordered={false} title={'设备状态统计'} hoverable>
            <Bar height={300} {...barConfig} />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} title={'设备借用占比'} hoverable>
            <Pie height={300} {...pieConfig} />
          </Card>
        </Col>
        <Col span={24}>
          <ProCard bordered={false} title={'设备借用统计'} hoverable>
            <Pie height={400} {...pieConfig} />
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};
export default Home;
