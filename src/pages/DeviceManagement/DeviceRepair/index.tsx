import { getMonth1st } from '@/services/general/dataProcess';
import {
  deleteRepairRecord,
  getRepairedNum,
  getRepairingNum,
  getRepairList,
} from '@/services/swagger/repair';
import { Line } from '@ant-design/charts';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  FormInstance,
  Input,
  message,
  Popconfirm,
  Row,
  Space,
  Statistic,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Access, Link, useAccess } from 'umi';
import GeneralTable from '../DeviceList/generalTable/GeneralTable';

interface RepairRecord {
  key: React.Key;
  deviceID: number;
  assetNumber: string;
  deviceName: string;
  repairContent: string;
  repairFee: 0;
  repairID: 0;
  repairTime: string;
}

const { Search } = Input;

const Repair: React.FC = () => {
  const formRef = React.useRef<FormInstance>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  //const [selectedRows, setSelectedRows] = useState<RepairRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [initRepair, setInitRepair] = useState([]);
  const [showRepair, setShowRepair] = useState([]);
  const [repairing, setRepairing] = useState(0);
  const [repaired, setRepaired] = useState(0);
  const [lineData, setLineData] = useState<{}>([]);
  const [repairFeeNow, setRepairFee] = useState(0);
  const access = useAccess();

  //折线图数据
  const plotData = (repairs: RepairRecord[]) => {
    const month1st = getMonth1st(5);
    const data = [];
    for (let i = 0; i < 4; i++) {
      const date = new Date(month1st[i]);
      const node = {
        month: date.getFullYear() + '/' + (date.getMonth() + 1),
        repairNum: repairs.filter((x: RepairRecord) => {
          const t = Date.parse(x.repairTime);
          return t >= month1st[i] && t < month1st[i + 1];
        }).length,
      };
      data.push(node);
    }
    const date = new Date(month1st[4]);
    const node = {
      month: date.getFullYear() + '/' + (date.getMonth() + 1),
      repairNum: repairs.filter((x: RepairRecord) => {
        const t = Date.parse(x.repairTime);
        return t >= month1st[4];
      }).length,
    };
    data.push(node);
    let fee = 0;
    repairs
      .filter((x: RepairRecord) => {
        const t = Date.parse(x.repairTime);
        return t >= month1st[4];
      })
      .forEach((r) => {
        fee += r.repairFee;
      });
    setRepairFee(fee);
    return data;
  };

  const initial = async () => {
    const res = await getRepairList();
    if (res.code === 20000) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].repairTime = new Date(res.data[i].repairTime).toLocaleString();
        res.data[i].key = i;
      }
      setInitRepair(res.data);
      setShowRepair(res.data);
      setLineData(plotData(res.data));
    }
    const repairingNum = await getRepairingNum();
    const repairedNum = await getRepairedNum();
    if (repairedNum.code === 20000) {
      setRepaired(repairedNum.data);
    }
    if (repairingNum.code === 20000) {
      setRepairing(repairingNum.data);
    }
  };
  useEffect(() => {
    initial();
  }, []);

  //折线图配置
  const config = {
    data: lineData,
    xField: 'month',
    yField: 'repairNum',
    label: {},
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
    interactions: [
      {
        type: 'marker-active',
      },
    ],
  };

  const handleDelete = async (repairId: number) => {
    const del = await deleteRepairRecord({ repairID: repairId });
    if (del.code === 20000) {
      const res = await getRepairList();
      if (res.code === 20000 && res.data !== undefined) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].repairTime = new Date(res.data[i].repairTime).toLocaleString();
          res.data[i].key = i;
        }
        setShowRepair(res.data);
      } else {
        message.error(res.message);
      }
    }
  };

  // const handleBatchDelete = async () => {
  //   selectedRows.forEach(async (repair)=>{
  //     const del = await deleteRepairRecord({ repairID: repair.repairID });
  //     if (del.code !== 20000){
  //       message.error(del.message);
  //     }
  //   })
  //   const res = await getRepairList();
  //   if (res.code === 20000 && res.data !== undefined) {
  //     for (let i = 0; i < res.data.length; i++) {
  //       res.data[i].repairTime = new Date(res.data[i].repairTime).toLocaleString();
  //       res.data[i].key = i;
  //     }
  //     setShowRepair(res.data);
  //   } else {
  //     message.error(res.message);
  //   }
  // };

  const columns: ColumnsType<RepairRecord> = [
    {
      title: '维修编号',
      dataIndex: 'repairID',
    },
    {
      title: '设备编号',
      dataIndex: 'assetNumber',
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
    },
    {
      title: '维修时间',
      dataIndex: 'repairTime',
      sorter: (a, b) => {
        if (a.repairTime === null || b.repairTime === null) {
          return 0;
        } else {
          const aDate = Date.parse(a.repairTime);
          const bDate = Date.parse(b.repairTime);
          return aDate - bDate;
        }
      },
    },
    {
      title: '维修内容',
      dataIndex: 'repairContent',
    },
    {
      title: '维修费用',
      dataIndex: 'repairFee',
    },
    {
      title: '操作',
      key: 'action',
      render: (record: RepairRecord) => (
        <Space size="middle">
          <a>
            <Link
              to={{
                pathname: '/deviceManagement/repair/detail',
                state: { repairID: record.repairID, deviceName: record.deviceName, edit: false },
              }}
            >
              详情
            </Link>
          </a>
          <Access accessible={access.repairUpdateBtn('repair:update')}>
            <a>
              <Link
                to={{
                  pathname: '/deviceManagement/repair/detail',
                  state: { repairID: record.repairID, deviceName: record.deviceName, edit: true },
                }}
              >
                修改
              </Link>
            </a>
          </Access>
          <Access accessible={access.repairDeleteBtn('repair:delete')}>
            <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.repairID)}>
              <a>删除</a>
            </Popconfirm>
          </Access>
        </Space>
      ),
    },
  ];

  const onSearch = (value: string) => {
    setShowRepair(
      value === ''
        ? initRepair
        : initRepair.filter((item: RepairRecord) => {
            return item['deviceName'].indexOf(value) != -1;
          }),
    );
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[], newSelectedRows: RepairRecord[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    //setSelectedRows(newSelectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <PageContainer>
      <Row gutter={[16, 24]}>
        <Col span={6}>
          <Link to={'/deviceManagement/repair/addRecord'}>
            <Card bordered={false} hoverable={true} title="维修记录">
              <Statistic
                value={repaired}
                title="维修次数"
                precision={0}
                valueStyle={{ color: '#5781CD', fontWeight: 'regular', fontSize: 36 }}
                suffix="次"
              />
              <Divider />
              <Statistic
                value={repairFeeNow}
                title="本月维修费用"
                precision={0}
                valueStyle={{ color: '#5781CD', fontWeight: 'regular', fontSize: 36 }}
                prefix="￥"
              />
            </Card>
          </Link>
        </Col>
        <Col span={18}>
          <Card bordered={false} title={'近五个月维修次数'} hoverable>
            <Line height={213} {...config} />
          </Card>
        </Col>
        <Col span={24}>
          <GeneralTable rowSelection={rowSelection} datasource={showRepair} columns={columns}>
            <Access accessible={access.repairAddBtn('repair:add')}>
              <Button type="primary">
                <Link to={'/deviceManagement/repair/addRepair'}>新增维修记录</Link>
              </Button>
            </Access>
            <Access accessible={access.repairDeleteBtn('repair:delete')}>
              <Button
                danger
                //onClick={handleBatchDelete}
                disabled={!hasSelected}
              >
                批量删除
              </Button>
            </Access>

            <span style={{ marginLeft: 8 }}>
              {hasSelected ? `已选择 ${selectedRowKeys.length} 项` : ''}
            </span>
            <Form layout={'inline'} ref={formRef} name="control-ref" style={{ maxWidth: 600 }}>
              <Form.Item name="search">
                <Search placeholder="请输入设备名称" onSearch={onSearch} style={{ width: 300 }} />
              </Form.Item>
              <Form.Item>
                <Button
                  type="text"
                  onClick={() => {
                    setShowRepair(initRepair);
                    formRef.current?.setFieldsValue({ search: '' });
                  }}
                >
                  重置
                </Button>
              </Form.Item>
            </Form>
          </GeneralTable>
        </Col>
      </Row>
    </PageContainer>
  );
};
export default Repair;
