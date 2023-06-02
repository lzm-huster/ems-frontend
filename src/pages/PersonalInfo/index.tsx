import { getDeviceList } from '@/services/swagger/device';
import { EditOutlined, MailOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Avatar, Button, Card, Col, Divider, Form, Row, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Search from 'antd/lib/transfer/search';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import './index.less';

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

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: ColumnsType[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
};

const PersonalInfo: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [initDevice, setInitDevice] = useState([]);
  const [searchDevice, setSerachDevice] = useState([]);
  const [showDevice, setShowDevice] = useState([]);

  const history = useHistory();
  const handleClick = () => {
    history.push('/edit'); // 将路由定向到/my-page
  };

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
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item>
          <Card>
            <div className="content">
              <div className="avatar-container">
                <Avatar className="avatar" size={64} icon={<UserOutlined />} />
              </div>
              <div className="nickname">昵称</div>
              <div className="nickname">
                <SolutionOutlined /> 教职工 <Divider type="vertical" />
                <MailOutlined /> 173646139@qq.com
              </div>
            </div>
            <EditOutlined onClick={handleClick} className="edit-icon" />
          </Card>
        </Form.Item>
        <Form.Item>
          <Row>
            <Col span={2}>
              <Button type="primary">新增设备</Button>
            </Col>
            <Col span={3}>
              <Button type="primary">批量删除设备</Button>
            </Col>
            <Col span={8}>
              <Search placeholder="请输入你需要搜索的记录编号或设备名称" />
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          <Table rowSelection={rowSelection} columns={columns} dataSource={showDevice} />
        </Form.Item>
      </Form>
    </PageContainer>
  );
};

export default PersonalInfo;
