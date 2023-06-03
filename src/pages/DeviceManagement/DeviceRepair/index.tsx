import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, Form, FormInstance, Input, Row, Space, Statistic } from 'antd';
import React, { useState, useEffect } from 'react';
import { getRepairList } from '@/services/swagger/repair';
import Table, { ColumnsType } from 'antd/lib/table';
import { Link } from 'umi';
import GeneralTable from '../DeviceList/generalTable/GeneralTable';

interface RepairRecord {
  key: React.Key;
  deviceID: number;
  deviceName: string;
  repairContent: string;
  repairFee: 0;
  repairID: 0;
  repairTime: Date;
}

const columns: ColumnsType<RepairRecord> = [
  {
    title: '维修编号',
    dataIndex: 'repairID',
  },
  {
    title: '设备编号',
    dataIndex: 'deviceID',
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
  },
  {
    title: '维修时间',
    dataIndex: 'repairTime',
    sorter: (a, b) => {
      if (a.repairTime.getTime() === null || b.repairTime.getTime() === null) {
        return 0;
      } else {
        return a.repairTime.getTime() - b.repairTime.getTime();
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
    render: () => (
      <Space size="middle">
        <a>详情</a>
        <a>修改</a>
        <a>删除</a>
      </Space>
    ),
  },
];

const { Search } = Input;

const Repair: React.FC = () => {
  const formRef = React.useRef<FormInstance>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [initRepair, setInitRepair] = useState([]);
  const [showRepair, setShowRepair] = useState([]);

  const initial = async () => {
    const res = await getRepairList();
    if (res.code === 20000) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].key = i;
      }
      setInitRepair(res.data);
      setShowRepair(res.data);
    }
  };
  useEffect(() => {
    initial();
  }, []);

  const onSearch = (value: string) => {
    setShowRepair(
      showRepair.filter((item) => {
        return item['deviceName'] == (value as string);
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
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="已维修设备"
              value={5}
              precision={0}
              valueStyle={{ color: '#5781CD', fontWeight: 'bold', fontSize: 42 }}
              suffix="台"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="维修中设备"
              value={12}
              precision={0}
              valueStyle={{ color: '#27A77F', fontWeight: 'bold', fontSize: 42 }}
              suffix="台"
            />
          </Card>
        </Col>
        <Col span={24}>
          <GeneralTable rowSelection={rowSelection} datasource={showRepair} columns={columns}>
            <Button type="primary">
              <Link to={'/deviceManagement/repair/addRecord'}>新增维修记录</Link>
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
