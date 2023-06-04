import { Card, Avatar, Divider, Table, Space, Form, Button, Row, Col, message } from 'antd';
import { EditOutlined, MailOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import './index.less';
import { PageContainer } from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';
import Search from 'antd/lib/transfer/search';
import { getDeviceList } from '@/services/swagger/device';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useModel } from 'umi';
import { deleteDeviceByDeviceID } from '@/services/swagger/person';

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
    title: '添加时间',
    dataIndex: 'purchaseDate',
  },
  {
    title: '设备状态',
    dataIndex: 'deviceState',
  },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Space size="middle">
        <a>查看详情</a>
        <a>修改记录</a>
        <a>删除记录</a>
      </Space>
    ),
  },
];

const PersonalInfo: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [initDevice, setInitDevice] = useState([]);
  const [searchDevice, setSerachDevice] = useState([]);
  const [showDevice, setShowDevice] = useState([]);
  //added
  const { initialState } = useModel('@@initialState');

  const { currentUser } = initialState;

  const history = useHistory();
  const handleClick = () => {
    history.push('/personalCenter/personalInfo/edit'); // 将路由定向到/my-page
  };

  const initial = async () => {
    const res = await getDeviceList();
    if (res.code === 20000) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].key = i;
      }
      setInitDevice(res.data);
      setShowDevice(res.data);
    }
  };
  useEffect(() => {
    initial();
  }, []);

  const massRemove = () => {
    setLoading(true);

    const selectedDeviceIds = selectedRowKeys
      .map((selectedKey) => {
        const selectedDevice = showDevice.find((device: Device) => device.key === selectedKey);
        if (selectedDevice && selectedDevice.deviceID) {
          return selectedDevice.deviceID;
        }
        return null;
      })
      .filter((deviceId): deviceId is number => deviceId !== null);
    console.log('test', selectedDeviceIds);
    // 依次删除每个设备
    const deletePromises = selectedDeviceIds.map((deviceID) =>
      deleteDeviceByDeviceID({ DeviceID: deviceID }).then((res) => res.code === 20000),
    );

    // 等待所有删除请求完成后，更新表格数据和清空选中的行数据
    Promise.all(deletePromises).then((results) => {
      if (results.every((result) => result)) {
        const newShowDevice = showDevice.filter((item) => !selectedRowKeys.includes(item.key));
        setShowDevice(newShowDevice);
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
                <Avatar
                  className="avatar"
                  src={currentUser.avatar}
                  size={64}
                  icon={<UserOutlined />}
                />
              </div>
              <div className="nickname">{currentUser.userName}</div>
              <div className="nickname">
                <SolutionOutlined /> {currentUser.roleList} <Divider type="vertical" />
                <MailOutlined /> {currentUser.email}
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
              <Button danger onClick={massRemove} disabled={!hasSelected}>
                批量删除设备
              </Button>
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
