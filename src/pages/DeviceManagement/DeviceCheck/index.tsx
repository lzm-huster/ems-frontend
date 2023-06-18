import {
  deleteCheckRecord,
  getCheckedNum,
  getCheckingNum,
  getCheckList,
} from '@/services/swagger/check';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, message, Popconfirm, Row, Space, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import { Access, Link, useAccess } from 'umi';
import GeneralTable from '../DeviceList/generalTable/GeneralTable';

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
  const [tableData, setTableData] = useState<CheckRecord[]>([]);
  const [currentRow, setCurrentRow] = useState<CheckRecord>();
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
    if (delRes.code === 20000) {
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
    // {
    //   title: '序号',
    //   dataIndex: 'index',
    //   valueType: 'index',
    //   width: 60,
    // },
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
                valueStyle={{ color: '#5781CD', fontWeight: 'regular', fontSize: 40 }}
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
                valueStyle={{ color: '#27A77F', fontWeight: 'regular', fontSize: 40 }}
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
            </GeneralTable>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};
export default DeviceCheck;
