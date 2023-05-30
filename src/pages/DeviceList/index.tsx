import React, { useEffect, useState } from 'react';
import { Input, Space, Button, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PageContainerProps } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-components';
import { getDeviceList } from '@/services/swagger/device';

interface Device {
  key: React.Key;
  deviceID: number;
  deviceModel: string;
  deviceName: string;
  deviceState: string;
  deviceType: string;
  purchaseDate: Date;
  userName: string;
}

const columns: ColumnsType<Device> = [
  {
    title: '设备编号',
    dataIndex: 'deviceID',
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
  },
  {
    title: '设备参数',
    dataIndex: 'deviceModel',
  },
  {
    title: '设备状态',
    dataIndex: 'deviceState',
  },
  {
    title: '负责人',
    dataIndex: 'userName',
  },
  {
    title: '购入时间',
    dataIndex: 'purchaseDate',
  },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Space size="middle">
        <a>详情</a>
        <a>借用</a>
        <a>维修</a>
        <a>保养</a>
        <a>报废</a>
        <a>修改</a>
        <a>删除</a>
      </Space>
    ),
  },
];

const { Search } = Input;

const App: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [initDevice, setInitDevice] = useState([]);
  const [searchDevice, setSerachDevice] = useState([]);
  const [showDevice, setShowDevice] = useState([]);

  const initial = async () => {
    const res = await getDeviceList();
    if (res.code === 20000) {
      setInitDevice(res.data);
      setShowDevice(res.data);
    }
  };
  useEffect(() => {
    initial();
  }, []);

  const onSearch = (value: string) => {
    setSerachDevice(
      showDevice.filter((x) => {
        return x['deviceName'] != value;
      }),
    );
    setShowDevice(searchDevice);
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
      <div>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary">新增设备</Button>
          <Button type="primary">信息统计</Button>
          <Button type="primary" onClick={start} disabled={!hasSelected}>
            批量借用
          </Button>
          <Button type="primary" onClick={start} disabled={!hasSelected}>
            批量删除
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `已选择 ${selectedRowKeys.length} 项` : ''}
          </span>
          <Search
            placeholder="请输入设备编号或设备名称"
            onSearch={onSearch}
            allowClear
            style={{ width: 300 }}
          />
        </Space>
        <Table rowSelection={rowSelection} columns={columns} dataSource={showDevice} />
      </div>
    </PageContainer>
  );
};

export default App;
