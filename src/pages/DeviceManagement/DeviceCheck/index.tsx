import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, Popconfirm, Row, Space, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'umi';
import GeneralTable from '../DeviceList/generalTable/GeneralTable';
import { deleteCheckRecord, getCheckList } from '@/services/swagger/check';
import { ColumnsType } from 'antd/es/table';

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

  const initial = async () => {
    const res = await getCheckList();
    if (res.code === 20000) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].key = i;
        res.data[i].checkTime = new Date(res.data[i].checkTime).toLocaleString();
      }
      setTableData(res.data);
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
        setTableData(res.data);
      }
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 60,
    },
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
            <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.checkID)}>
              <a>删除</a>
            </Popconfirm>
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
                value={5}
                precision={0}
                valueStyle={{ color: '#5781CD', fontWeight: 'bold', fontSize: 42 }}
                suffix="件"
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false}>
              <Statistic
                title="待核查设备"
                value={12}
                precision={0}
                valueStyle={{ color: '#27A77F', fontWeight: 'bold', fontSize: 42 }}
                suffix="个"
              />
            </Card>
          </Col>
          <Col span={24}>
            <GeneralTable rowSelection={rowSelection} datasource={tableData} columns={columns}>
              <Button type="primary">
                <Link to={'/deviceManagement/check/add'}>新增核查记录</Link>
              </Button>
              <Button danger disabled={!hasSelected}>
                批量删除记录
              </Button>
            </GeneralTable>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};
export default DeviceCheck;
