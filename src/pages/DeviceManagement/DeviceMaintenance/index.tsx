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
import { deleteMaintenanceRecord, getMaintenanceList } from '@/services/swagger/maintenance';
import { ColumnsType } from 'antd/lib/table';
import { Link } from 'umi';
import GeneralTable from '../DeviceList/generalTable/GeneralTable';

interface MaintenanceRecord {
  key: React.Key;
  deviceID: number;
  assetNumber: string;
  deviceName: string;
  maintenanceContent: string;
  maintenanceID: 0;
  maintenanceTime: string;
}

const { Search } = Input;

const Maintenance: React.FC = () => {
  const formRef = React.useRef<FormInstance>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [initMaintenance, setInitMaintenance] = useState([]);
  const [showMaintenance, setShowMaintenance] = useState([]);

  const initial = async () => {
    const res = await getMaintenanceList();

    if (res.code === 20000) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].maintenanceTime = new Date(res.data[i].maintenanceTime).toLocaleString();
        res.data[i].key = i;
      }
      setInitMaintenance(res.data);
      setShowMaintenance(res.data);
    }
  };
  useEffect(() => {
    initial();
  }, []);

  const onSearch = (value: string) => {
    setShowMaintenance(
      value === ''
        ? initMaintenance
        : initMaintenance.filter((item: MaintenanceRecord) => {
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

  const handleDelete = async (maintenanceId: number) => {
    deleteMaintenanceRecord({ maintenanceID: maintenanceId });
    const res = await getMaintenanceList();
    if (res.code === 20000) {
      setShowMaintenance(res.data);
    }
  };

  const columns: ColumnsType<MaintenanceRecord> = [
    {
      title: '保养编号',
      dataIndex: 'maintenanceID',
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
      title: '保养时间',
      dataIndex: 'maintenanceTime',
      sorter: (a, b) => {
        if (a.maintenanceTime === null || b.maintenanceTime === null) {
          return 0;
        } else {
          const aDate = Date.parse(a.maintenanceTime);
          const bDate = Date.parse(b.maintenanceTime);
          return aDate - bDate;
        }
      },
    },
    {
      title: '保养内容',
      dataIndex: 'maintenanceContent',
    },
    {
      title: '操作',
      key: 'action',
      render: (record) => (
        <Space size="middle">
          <a>
            <Link
              to={{
                pathname: '/deviceManagement/maintenance/detail',
                state: {
                  maintenanceID: record.maintenanceID,
                  deviceName: record.deviceName,
                  edit: false,
                },
              }}
            >
              详情
            </Link>
          </a>
          <a>
            <Link
              to={{
                pathname: '/deviceManagement/maintenance/detail',
                state: {
                  maintenanceID: record.maintenanceID,
                  deviceName: record.deviceName,
                  edit: true,
                },
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

  return (
    <PageContainer>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <GeneralTable rowSelection={rowSelection} datasource={showMaintenance} columns={columns}>
            <Button type="primary">
              <Link to={'/deviceManagement/maintenance/addMaintenance'}>新增保养记录</Link>
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
                    setShowMaintenance(initMaintenance);
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
export default Maintenance;
