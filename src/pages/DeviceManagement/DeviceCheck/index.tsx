import {
  deleteCheckRecord,
  getCheckedNum,
  getCheckingNum,
  getCheckList,
} from '@/services/swagger/check';
import { PageContainer, ProFormDateRangePicker } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  Form,
  FormInstance,
  Input,
  message,
  Popconfirm,
  Row,
  Space,
  Statistic,
} from 'antd';
import { useEffect, useState } from 'react';
import { Access, Link, useAccess } from 'umi';
import GeneralTable from '../DeviceList/generalTable/GeneralTable';
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';

interface CheckRecord {
  key: React.Key;
  checkID: number;
  checkTime: string;
  checker: string;
  deviceID: number;
  assetNumber: string;
  deviceName: string;
  deviceState: string;
}

const DeviceCheck: React.FC = () => {
  const formRef = React.useRef<FormInstance>(null);

  const [tableData, setTableData] = useState<CheckRecord[]>([]);
  const [initTableData, setInitTableData] = useState<CheckRecord[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [checked, setChecked] = useState(0);
  const [checking, setChecking] = useState(0);
  const [loading, setLoading] = useState(false);
  const access = useAccess();
  const initial = async () => {
    const res = await getCheckList();
    if (res.code === 20000) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].key = i;
        res.data[i].checkTime = new Date(res.data[i].checkTime).toLocaleString();
      }
      setTableData(res.data);
      setInitTableData(res.data);
    }
    const checkedRes = await getCheckedNum();
    if (checkedRes.code === 20000) {
      setChecked(checkedRes.data);
    }
    const checkingRes = await getCheckingNum();
    if (checkingRes.code === 20000) {
      setChecking(checkingRes.data);
    }
  };

  useEffect(() => {
    initial();
  }, []);

  const onSearch = (name?: string, sTime?: number, eTime?: number) => {
    if (sTime !== undefined && eTime !== undefined && name !== undefined)
      setTableData(
        name === ''
          ? initTableData
          : initTableData.filter((item: CheckRecord) => {
              const pTime = Date.parse(item['checkTime']);
              return item['deviceName'].indexOf(name) != -1 && pTime <= eTime && pTime >= sTime;
            }),
      );
    else if (name !== undefined)
      setTableData(
        name === ''
          ? initTableData
          : initTableData.filter((item: CheckRecord) => {
              return item['deviceName'].indexOf(name) != -1;
            }),
      );
    else if (sTime !== undefined && eTime !== undefined)
      setTableData(
        name === ''
          ? initTableData
          : initTableData.filter((item: CheckRecord) => {
              const pTime = Date.parse(item['checkTime']);
              return pTime <= eTime && pTime >= sTime;
            }),
      );
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

  const handleDelete = async (checkId: number) => {
    const delRes = await deleteCheckRecord({ checkID: checkId });
    if (delRes.code === 20000 && delRes.data === 1) {
      message.success('删除成功');
      const res = await getCheckList();
      if (res.code === 20000) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].key = i;
          res.data[i].checkTime = new Date(res.data[i].checkTime).toLocaleString();
        }
        setTableData(res.data);
      }
      const checkedRes = await getCheckedNum();
      if (checkedRes.code === 20000) {
        setChecked(checkedRes.data);
      }
      const checkingRes = await getCheckingNum();
      if (checkingRes.code === 20000) {
        setChecking(checkingRes.data);
      }
    } else {
      message.error(delRes.message);
    }
  };

  const handleMessDelete = () => {
    setLoading(true);

    const selectedDataIds = selectedRowKeys
      .map((selectedKey: any) => {
        const selectedData = tableData.find(
          (dataItem: CheckRecord) => dataItem.key === selectedKey,
        );
        if (selectedData && selectedData.checkID) {
          return selectedData.checkID;
        }
        return null;
      })
      .filter((checkID: any): checkID is number => checkID !== null);
    // 依次删除每个设备
    const deletePromises = selectedDataIds.map((checkID: any) =>
      deleteCheckRecord({ checkID: checkID }).then((res) => res.code === 20000),
    );

    // 等待所有删除请求完成后，更新表格数据和清空选中的行数据
    Promise.all(deletePromises).then(async (results) => {
      if (results.every((result: any) => result)) {
        const res = await getCheckList();
        if (res.code === 20000) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].key = i;
            res.data[i].checkTime = new Date(res.data[i].checkTime).toLocaleString();
          }
          setTableData(res.data);
        }
        const checkedRes = await getCheckedNum();
        if (checkedRes.code === 20000) {
          setChecked(checkedRes.data);
        }
        const checkingRes = await getCheckingNum();
        if (checkingRes.code === 20000) {
          setChecking(checkingRes.data);
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

  const columns = [
    {
      title: '核查编号',
      dataIndex: 'checkID',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '设备编号',
      dataIndex: 'assetNumber',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '核查时间',
      dataIndex: 'checkTime',
      valueType: 'date',
      sorter: (a: CheckRecord, b: CheckRecord) => {
        if (a.checkTime === null || b.checkTime === null) {
          return 0;
        } else {
          const aDate = Date.parse(a.checkTime);
          const bDate = Date.parse(b.checkTime);
          return aDate - bDate;
        }
      },
      hideInSearch: true,
    },
    {
      title: '设备状态',
      dataIndex: 'deviceState',
      copyable: true,
      ellipsis: true,
      filters: [
        {
          text: '正常',
          value: '正常',
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
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (record: CheckRecord) => {
        return (
          <Space size={'middle'}>
            <a key="editable">
              <Link
                to={{
                  pathname: '/deviceManagement/check/detail',
                  state: { checkID: record.checkID, deviceName: record.deviceName, edit: false },
                }}
              >
                详情
              </Link>
            </a>
            <Access accessible={access.inventoryUpdateBtn('inventory:update')}>
              <a key="view">
                <Link
                  to={{
                    pathname: '/deviceManagement/check/detail',
                    state: { checkID: record.checkID, deviceName: record.deviceName, edit: true },
                  }}
                >
                  编辑
                </Link>
              </a>
            </Access>
            <Access accessible={access.inventoryDeleteBtn('inventory:delete')}>
              <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.checkID)}>
                <a>删除</a>
              </Popconfirm>
            </Access>
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <div style={{ marginBottom: 10 }}>
        <Row gutter={[16, 24]}>
          <Col span={12}>
            <Card bordered={false}>
              <Statistic
                title="已核查设备"
                value={checked}
                precision={0}
                valueStyle={{ color: '#5781CD', fontWeight: 'regular', fontSize: 42 }}
                suffix="台"
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false}>
              <Statistic
                title="待核查设备"
                value={checking}
                precision={0}
                valueStyle={{ color: '#27A77F', fontWeight: 'regular', fontSize: 42 }}
                suffix="台"
              />
            </Card>
          </Col>
          <Col span={24}>
            <GeneralTable rowSelection={rowSelection} datasource={tableData} columns={columns}>
              <Access accessible={access.inventoryAddBtn('inventory:add')}>
                <Button type="primary">
                  <Link to={'/deviceManagement/check/add'}>新增核查记录</Link>
                </Button>
              </Access>
              <Access accessible={access.inventoryDeleteBtn('inventory:delete')}>
                <Button danger onClick={handleMessDelete} disabled={!hasSelected}>
                  批量删除记录
                </Button>
              </Access>
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
                        setTableData(initTableData);
                        formRef.current?.setFieldsValue({ deviceNameS: '', timeRanges: [] });
                      }}
                    >
                      重置
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </GeneralTable>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};
export default DeviceCheck;
