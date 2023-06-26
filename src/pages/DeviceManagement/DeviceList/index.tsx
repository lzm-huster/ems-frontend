import { deleteDevice, getDeviceList } from '@/services/swagger/device';
import { PageContainer, ProFormDateRangePicker } from '@ant-design/pro-components';
import { Button, Form, FormInstance, Input, Popconfirm, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { Access, Link, useAccess } from 'umi';
import GeneralTable from './generalTable/GeneralTable';
import { deleteDeviceByDeviceID } from '@/services/swagger/person';
import { SearchOutlined } from '@ant-design/icons';

export interface Device {
  key: React.Key;
  assetNumber: string;
  deviceID: number;
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
  const [selectedRows, setSelectedRows] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(true);
  const [initDevice, setInitDevice] = useState([]);
  const [showDevice, setShowDevice] = useState([]);
  const [deviceIDs, setDeviceIDs] = useState('');

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

  const onSearch = (name?: string, sTime?: number, eTime?: number) => {
    if (sTime !== undefined && eTime !== undefined && name !== undefined)
      setShowDevice(
        name === ''
          ? initDevice
          : initDevice.filter((item: Device) => {
              const pTime = Date.parse(item['purchaseDate']);
              return item['deviceName'].indexOf(name) != -1 && pTime <= eTime && pTime >= sTime;
            }),
      );
    else if (name !== undefined)
      setShowDevice(
        name === ''
          ? initDevice
          : initDevice.filter((item: Device) => {
              return item['deviceName'].indexOf(name) != -1;
            }),
      );
    else if (sTime !== undefined && eTime !== undefined)
      setShowDevice(
        name === ''
          ? initDevice
          : initDevice.filter((item: Device) => {
              const pTime = Date.parse(item['purchaseDate']);
              return pTime <= eTime && pTime >= sTime;
            }),
      );
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[], newSelectedRows: Device[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRows);
    const deviceIDS: any[] = [];
    setAvailable(true);
    newSelectedRows.forEach((item) => {
      deviceIDS.push(item.deviceID);
      if (item.deviceState !== '正常') {
        setAvailable(false);
      }
    });
    setDeviceIDs(JSON.stringify(deviceIDS));
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
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].key = i;
        res.data[i].purchaseDate = new Date(res.data[i].purchaseDate).toLocaleString();
      }
      setInitDevice(res.data);
      setShowDevice(res.data);
    }
  };

  const handleMessDelete = () => {
    setLoading(true);

    const selectedDeviceIds = selectedRowKeys
      .map((selectedKey: any) => {
        const selectedDevice = showDevice.find((deviceT: Device) => deviceT.key === selectedKey);
        if (selectedDevice && selectedDevice.deviceID) {
          return selectedDevice.deviceID;
        }
        return null;
      })
      .filter((deviceId: any): deviceId is number => deviceId !== null);
    // 依次删除每个设备
    const deletePromises = selectedDeviceIds.map((deviceID: any) =>
      deleteDeviceByDeviceID({ DeviceID: deviceID }).then((res) => res.code === 20000),
    );

    // 等待所有删除请求完成后，更新表格数据和清空选中的行数据
    Promise.all(deletePromises).then(async (results) => {
      if (results.every((result: any) => result)) {
        const res = await getDeviceList();
        if (res.code === 20000) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].key = i;
            res.data[i].purchaseDate = new Date(res.data[i].purchaseDate).toLocaleString();
          }
          setInitDevice(res.data);
          setShowDevice(res.data);
        }
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
    });
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
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
          text: '外借',
          value: '外借',
        },
        {
          text: '报废',
          value: '报废',
        },
        {
          text: '丢失',
          value: '丢失',
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
      width: '25%',
      render: (record) => {
        return record.deviceState === '正常'
          ? [
              <Space size="small">
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
                <Access accessible={access.deviceUpdateBtn('device:update')}>
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
                </Access>
                <Access accessible={access.deviceDeleteBtn('device:delete')}>
                  <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.deviceID)}>
                    <a>删除</a>
                  </Popconfirm>
                </Access>
                <Access accessible={access.borrowAddBtn('borrow:add')}>
                  <Link
                    to={{
                      pathname: '/deviceManagement/borrow/addBorrowApply',
                      state: { deviceID: JSON.stringify([record.deviceID]) },
                    }}
                  >
                    借用
                  </Link>
                </Access>
                <Access accessible={access.repairAddBtn('repair:add')}>
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
                </Access>
                <Access accessible={access.maintenanceAddBtn('maintenance:add')}>
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
                </Access>
                <Access accessible={access.scrapAddBtn('scrap:add')}>
                  <a key="scrap">
                    <Link
                      to={{
                        pathname: '/deviceManagement/scrap/addScrap',
                        state: { deviceID: record.deviceID },
                      }}
                    >
                      报废
                    </Link>
                  </a>
                </Access>
              </Space>,
            ]
          : [
              <Space size="small">
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
                <Access accessible={access.deviceUpdateBtn('device:update')}>
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
                </Access>
                <Access accessible={access.deviceDeleteBtn('device:delete')}>
                  <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.deviceID)}>
                    <a>删除</a>
                  </Popconfirm>
                </Access>
                <Access accessible={access.borrowAddBtn('borrow:add')}>
                  <a key="borrow" style={{ color: 'grey' }}>
                    借用
                  </a>
                </Access>
                <Access accessible={access.repairAddBtn('repair:add')}>
                  <a key="repair" style={{ color: 'grey' }}>
                    维修
                  </a>
                </Access>
                <Access accessible={access.maintenanceAddBtn('maintenance:add')}>
                  <a key="maintenance" style={{ color: 'grey' }}>
                    保养
                  </a>
                </Access>
                <Access accessible={access.scrapAddBtn('scrap:add')}>
                  <a key="scrap" style={{ color: 'grey' }}>
                    报废
                  </a>
                </Access>
              </Space>,
            ];
      },
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
        <Access accessible={access.borrowAddBtn('borrow:add')}>
          <Link
            to={{
              pathname: '/deviceManagement/borrow/addBorrowApply',
              state: { deviceID: deviceIDs },
            }}
          >
            <Button disabled={hasSelected === false ? !hasSelected : !available}>批量借用</Button>
          </Link>
        </Access>
        <Access accessible={access.deviceDeleteBtn('device:delete')}>
          <Button danger onClick={handleMessDelete} disabled={!hasSelected}>
            批量删除
          </Button>
        </Access>

        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `已选择 ${selectedRowKeys.length} 项` : ''}
        </span>
        <div style={{ position: 'absolute', right: 0, top: 0 }}>
          <Form layout={'inline'} ref={formRef} name="control-ref" style={{ maxWidth: 1000 }}>
            <Form.Item name="deviceNameS">
              <Input placeholder="请输入设备名称" style={{ width: 150 }} />
            </Form.Item>
            <Form.Item name="timeRangeS">
              <ProFormDateRangePicker style={{ width: 200 }} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                onClick={() => {
                  const time = formRef.current?.getFieldValue('timeRangeS');
                  if (time !== undefined)
                    onSearch(
                      formRef.current?.getFieldValue('deviceNameS'),
                      Date.parse(time[0]),
                      Date.parse(time[1]),
                    );
                  else onSearch(formRef.current?.getFieldValue('deviceNameS'));
                }}
              >
                <SearchOutlined />
                搜索
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="text"
                onClick={() => {
                  setShowDevice(initDevice);
                  formRef.current?.setFieldsValue({ deviceNameS: '', timeRanges: [] });
                }}
              >
                重置
              </Button>
            </Form.Item>
          </Form>
        </div>
      </GeneralTable>
    </PageContainer>
  );
};

export default DeviceList;
