import { deleteDevice, getDeviceList } from '@/services/swagger/device';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Form, FormInstance, Input, Popconfirm, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { Access, Link, useAccess } from 'umi';
import GeneralTable from './generalTable/GeneralTable';

interface Device {
  key: React.Key;
  deviceID: string;
  deviceModel: string;
  deviceName: string;
  deviceState: string;
  deviceType: string;
  purchaseDate: string;
  userName: string;
}

const { Search } = Input;

const DeviceList: React.FC = () => {
  const formRef = React.useRef<FormInstance>(null);
  const access = useAccess();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [initDevice, setInitDevice] = useState([]);
  const [showDevice, setShowDevice] = useState([]);

  const initial = async () => {
    const res = await getDeviceList();
    if (res.code === 20000) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].key = i;
        res.data[i].purchaseDate = new Date(res.data[i].purchaseDate).toLocaleString();
      }
      setInitDevice(res.data);
      setShowDevice(res.data);
    }
  };

  useEffect(() => {
    initial();
  }, []);

  const onSearch = (value: string) => {
    setShowDevice(
      value === ''
        ? initDevice
        : initDevice.filter((item: Device) => {
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

  const handleDelete = async (deviceId: number) => {
    deleteDevice({ DeviceID: deviceId });
    const res = await getDeviceList();
    if (res.code === 20000) {
      setShowDevice(res.data);
    }
  };

  const columns: ColumnsType<Device> = [
    {
      title: '设备编号',
      dataIndex: 'assetNumber',
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
      filters: [
        {
          text: '正常',
          value: '正常',
        },
        {
          text: '借出中',
          value: '借出中',
        },
        {
          text: '已报废',
          value: '已报废',
        },
      ],
      onFilter: (value: string, record) => {
        return record.deviceState == value;
      },
    },
    {
      title: '负责人',
      dataIndex: 'userName',
    },
    {
      title: '购入时间',
      dataIndex: 'purchaseDate',
      sorter: (a, b) => {
        if (a.purchaseDate === null || b.purchaseDate === null) {
          return 0;
        } else {
          const aDate = Date.parse(a.purchaseDate);
          const bDate = Date.parse(b.purchaseDate);
          return aDate - bDate;
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 400,
      render: (record) => (
        <Space size="middle">
          <a key="detail">
            <Link
              to={{
                pathname: '/deviceManagement/list/detail',
                state: { deviceID: record.deviceID, userName: record.userName, edit: false },
              }}
            >
              详情
            </Link>
          </a>
          <a key="borrow">
            <Link
              to={{
                pathname: '/deviceManagement/borrow/addBorrowApply',
                state: { deviceID: record.deviceID },
              }}
            >
              借用
            </Link>
          </a>
          <a key="repair">
            <Link
              to={{
                pathname: '/deviceManagement/repair/addRepair',
                state: { deviceID: record.deviceID },
              }}
            >
              维修
            </Link>
          </a>
          <a key="maintenance">
            <Link
              to={{
                pathname: '/deviceManagement/maintenance/addMaintenance',
                state: { deviceID: record.deviceID },
              }}
            >
              保养
            </Link>
          </a>
          <a key="maintenance">
            <Link
              to={{
                pathname: '/deviceManagement/scrap/addScrap',
                state: { deviceID: record.deviceID },
              }}
            >
              报废
            </Link>
          </a>
          <a key="update">
            <Link
              to={{
                pathname: '/deviceManagement/list/detail',
                state: { deviceID: record.deviceID, userName: record.userName, edit: true },
              }}
            >
              修改
            </Link>
          </a>
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.deviceID)}>
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <GeneralTable rowSelection={rowSelection} datasource={showDevice} columns={columns}>
        <Access accessible={access.deviceAddBtn('device:add')}>
          <Button type="primary" style={{ marginRight: 10 }}>
            <Link to={'/deviceManagement/list/addDevice'}>新增设备</Link>
          </Button>
        </Access>
        <Button onClick={start} disabled={!hasSelected}>
          批量借用
        </Button>
        <Access accessible={access.deviceDeleteBtn('device:delete')}>
          <Button danger onClick={start} disabled={!hasSelected}>
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
                setShowDevice(initDevice);
                formRef.current?.setFieldsValue({ search: '' });
              }}
            >
              重置
            </Button>
          </Form.Item>
        </Form>
      </GeneralTable>
    </PageContainer>
  );
};

export default DeviceList;
