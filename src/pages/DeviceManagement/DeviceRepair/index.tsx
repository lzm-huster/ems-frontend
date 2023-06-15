import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  Form,
  FormInstance,
  Input,
  Popconfirm,
  Row,
  Space,
  Statistic,
} from 'antd';
import React, { useState, useEffect } from 'react';
import {
  getRepairList,
  getRepairedNum,
  getRepairingNum,
  deleteRepairRecord,
} from '@/services/swagger/repair';
import { ColumnsType } from 'antd/lib/table';
import { Link } from 'umi';
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
  const [loading, setLoading] = useState(false);
  const [initRepair, setInitRepair] = useState([]);
  const [showRepair, setShowRepair] = useState([]);
  const [repairing, setRepairing] = useState(0);
  const [repaired, setRepaired] = useState(0);

  const initial = async () => {
    const res = await getRepairList();
    if (res.code === 20000) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].repairTime = new Date(res.data[i].repairTime).toLocaleString();
        res.data[i].key = i;
      }
      setInitRepair(res.data);
      setShowRepair(res.data);
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

  const handleDelete = async (repairId: number) => {
    deleteRepairRecord({ repairID: repairId });
    const res = await getRepairList();
    if (res.code === 20000) {
      setShowRepair(res.data);
    }
  };

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
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.repairID)}>
            <a>删除</a>
          </Popconfirm>
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

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <PageContainer>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <GeneralTable rowSelection={rowSelection} datasource={showRepair} columns={columns}>
            <Button type="primary">
              <Link to={'/deviceManagement/repair/addRepair'}>新增维修记录</Link>
            </Button>
            <Button danger onClick={start} disabled={!hasSelected}>
              批量删除
            </Button>
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
