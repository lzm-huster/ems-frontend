import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Card, Col, List, Row, Space, Statistic, Table } from 'antd';
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
import { Device } from '../DeviceList';
import { getBorrowFeeList } from '@/services/swagger/borrow';
//import styles from './Home.less';

interface BorrowFee {
  borrowFee: number;
  borrowID: number;
  deviceID: number;
  deviceName: string;
  returnTime: string;
}

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
  const [borrow, setBorrow] = useState([]);
  const [borrowNumRank, setBNRank] = useState<any[]>([]);
  const [borrowFeeRank, setBFRank] = useState<any[]>([]);
  const [profitRates, setProfitRates] = useState<any[]>([]);

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

  //借用次数折线图数据
  const bplotData = (borrows: BorrowFee[]) => {
    const month1st = getMonth1st(months);
    const data = [];
    for (let i = 0; i < months - 1; i++) {
      const date = new Date(month1st[i]);
      const node = {
        month: date.getFullYear() + '/' + (date.getMonth() + 1),
        borrowNum: borrows.filter((x: BorrowFee) => {
          const t = Date.parse(x.returnTime);
          return t >= month1st[i] && t < month1st[i + 1];
        }).length,
      };
      data.push(node);
    }
    const date = new Date(month1st[months - 1]);
    const node = {
      month: date.getFullYear() + '/' + (date.getMonth() + 1),
      borrowNum: borrows.filter((x: BorrowFee) => {
        const t = Date.parse(x.returnTime);
        return t >= month1st[months - 1];
      }).length,
    };
    data.push(node);
    return data;
  };

  //借用数据
  const borrowNumData = (borrowFeeList: BorrowFee[]) => {
    const data = [];
    const fee = [];
    const borrowGroupByDevice: [{}] = JSON.parse(
      JSON.stringify(
        borrowFeeList.reduce((group, record) => {
          const { deviceID } = record;
          group[deviceID] = group[deviceID] ?? [];
          group[deviceID].push(record);
          return group;
        }, {}),
      ),
    );
    for (const key in borrowGroupByDevice) {
      const node = {
        deviceName: borrowGroupByDevice[key][0].deviceName,
        borrowNum: borrowGroupByDevice[key].length,
      };
      data.push(node);
      let initialNum = 0;
      for (const key1 in borrowGroupByDevice[key]) {
        initialNum += borrowGroupByDevice[key][key1].borrowFee;
      }
      if (initialNum !== 0) {
        const nodef = {
          deviceID: borrowGroupByDevice[key][0].deviceID,
          deviceName: borrowGroupByDevice[key][0].deviceName,
          borrowFee: initialNum,
        };
        fee.push(nodef);
      }
    }
    return [data, fee];
  };

  const columns = [
    {
      title: '设备编号',
      dataIndex: 'assetNumber',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      ellipsis: true,
    },
    {
      title: '设备单价',
      dataIndex: 'unitPrice',
      ellipsis: true,
    },
    {
      title: '设备收益率',
      dataIndex: 'profitRate',
      ellipsis: true,
    },
  ];

  const handleChangeMonths = async (m: number) => {
    setMonths(m);
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
    const mai = await getMaintenanceList();
    if (mai.code === 20000) {
      for (let i = 0; i < mai.data.length; i++) {
        mai.data[i].maintenanceTime = new Date(mai.data[i].maintenanceTime).toLocaleString();
      }
      setMaintenanceLineData(mplotData(mai.data));
    }
    const scrap = await getScrapList();
    if (scrap.code === 20000) {
      for (let i = 0; i < scrap.data.length; i++) {
        scrap.data[i].scrapTime = new Date(scrap.data[i].scrapTime).toLocaleString();
      }
      setScrapColData(scrapPlotData(scrap.data));
    }
    const scrapN = await getScrapNum();
    if (scrapN.code === 20000 && scrapN.data !== undefined) {
      setScrapNum(scrapN.data);
    }
    const bFees = await getBorrowFeeList();
    if (bFees.code === 20000 && bFees.data !== undefined) {
      for (let i = 0; i < bFees.data.length; i++) {
        bFees.data[i].returnTime = new Date(bFees.data[i].returnTime).toLocaleString();
      }
      setBorrow(bplotData(bFees.data));
      const tempt = borrowNumData(bFees.data);
      setBNRank(tempt[0].sort((a, b) => b.borrowNum - a.borrowNum));
      setBFRank(tempt[1].sort((a, b) => b.borrowFee - a.borrowFee));
      setProfitRates(tempt[1]);
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

  //借用次数折线图配置
  const borrowLineConfig = {
    data: borrow,
    xField: 'month',
    yField: 'borrowNum',
    smooth: true,
    color: '#27A77F',
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#ffffff 0.5:#27A77F 1:#27A77F',
      };
    },
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
    legend: false,
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
    legend: false,
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
              valueStyle={{ color: '#27A77F', fontWeight: 'regular', fontSize: 42 }}
              suffix="台"
            />
            <Column height={80} {...deviceColumnConfig} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="本月维修费用"
              value={repairFee}
              precision={0}
              valueStyle={{ color: '#5781CD', fontWeight: 'regular', fontSize: 42 }}
              prefix="￥"
            />
            <Area height={80} {...repairLineConfig} />
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
          <ProCard title="设备借用统计" split="vertical" bordered headerBordered hoverable>
            <ProCard title="月借用次数" colSpan="60%">
              <Area height={360} {...borrowLineConfig} />
            </ProCard>
            <ProCard title="借用次数排名" colSpan="20%">
              <List
                itemLayout="horizontal"
                dataSource={borrowNumRank}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<text style={{ color: 'blue' }}>{index + 1}</text>}
                      title={<text>{item.deviceName}</text>}
                      description={<text>借用{item.borrowNum}次</text>}
                    />
                  </List.Item>
                )}
              />
            </ProCard>
            <ProCard title="借用费用排名" colSpan="20%">
              <List
                itemLayout="horizontal"
                dataSource={borrowFeeRank}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<text style={{ color: 'blue' }}>{index + 1}</text>}
                      title={<text>{item.deviceName}</text>}
                      description={<text>借用总费用{item.borrowFee}元</text>}
                    />
                  </List.Item>
                )}
              />
            </ProCard>
          </ProCard>
        </Col>
        <Col span={24}>
          <ProCard title="设备借用收益" split="vertical" bordered headerBordered hoverable>
            <ProCard title="设备收益率" colSpan="80%">
              <Table columns={columns} dataSource={profitRates} />
            </ProCard>
            <ProCard title="设备收益率排名" colSpan="20%">
              <List
                itemLayout="horizontal"
                dataSource={borrowFeeRank}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<text style={{ color: 'blue' }}>{index + 1}</text>}
                      title={<text>{item.deviceName}</text>}
                      description={<text>借用总费用{item.borrowFee}元</text>}
                    />
                  </List.Item>
                )}
              />
            </ProCard>
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};
export default Home;
