import {
  Card,
  Avatar,
  Divider,
  Table,
  Space,
  Form,
  Button,
  Row,
  Col,
  message,
  Input,
  Popconfirm,
  Modal,
  Descriptions,
  Select,
} from 'antd';
import {
  AlignCenterOutlined,
  EditOutlined,
  MailOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './index.less';
import { PageContainer } from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';
import Search from 'antd/lib/transfer/search';
import { UpdateDevice, getDeviceList } from '@/services/swagger/device';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { useModel } from 'umi';
import { deleteDeviceByDeviceID } from '@/services/swagger/person';
import moment from 'moment';

interface Device {
  key: React.Key;
  deviceID: number;
  deviceModel: string;
  deviceName: string;
  deviceState: string;
  deviceType: string;
  purchaseDate: string;
  userName: string;
}

const PersonalInfo: React.FC = () => {
  const [form] = Form.useForm(); // 可以获取表单元素实例
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [initDevice, setInitDevice] = useState([]);
  const [searchDevice, setSearchDevice] = useState([]);
  const [showDevice, setShowDevice] = useState([]);
  //added
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const [currentDeviceId, setCurrentDeviceId] = useState(''); // 当前id，如果为空表示新增
  const [currentDevice, setCurrentDevice] = useState({});
  const firstUpdate = useRef(true);
  const [isShow, setIsShow] = useState(false); // 控制modal显示和隐藏
  const [isEditShow, setIsEditShow] = useState(false); // 控制编辑modal显示和隐藏

  const history = useHistory();
  const handleClick = () => {
    history.push('/personalCenter/personalInfo/editDetail'); // 将路由定向到/my-page
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

  //删除我的设备
  const handleDelete = async (deviceID: any) => {
    // 过滤掉选中的设备对象
    const newDevices = showDevice.filter((item: Device) => {
      return item.deviceID !== deviceID;
    });
    // 执行删除操作
    await deleteDeviceByDeviceID({ DeviceID: deviceID });
    // 更新设备列表
    setShowDevice(newDevices);
  };

  //批量删除
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

  //查询
  const handleSearch = (value: string) => {
    setSearchDevice(
      initDevice.filter((device: Device) => {
        return device.deviceID.toString().includes(value) || device.deviceName.includes(value);
      }),
    );
  };

  //防止首次查询时出现message通知
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    } else {
      if (searchDevice.length === 0) message.error('未找到');
      else message.success('查询成功');
    }
  }, [searchDevice]);

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
                <SolutionOutlined /> {currentUser.roleName ? currentUser.roleName : '普通用户'}{' '}
                <Divider type="vertical" />
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
              <Input.Search
                placeholder="请输入你需要搜索的记录编号或设备名称"
                onSearch={handleSearch}
              />
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          <Table
            rowSelection={rowSelection}
            dataSource={searchDevice.length > 0 ? searchDevice : showDevice}
            rowKey="deviceID"
            columns={[
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
                render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
              },
              {
                title: '设备状态',
                dataIndex: 'deviceState',
              },
              {
                title: '操作',
                key: 'action',
                render: (v, r: any) => (
                  <Space size="middle">
                    <a
                      onClick={() => {
                        setIsShow(true); //显示Modal
                        setCurrentDeviceId(r.deviceID);
                        setCurrentDevice(r);
                        form.setFieldsValue(r);
                      }}
                    >
                      查看详情
                    </a>
                    <a
                      onClick={() => {
                        setIsEditShow(true); //显示Modal
                        setCurrentDeviceId(r.deviceID);
                        setCurrentDevice(r);
                        form.setFieldsValue(r);
                      }}
                    >
                      修改记录
                    </a>

                    <Popconfirm
                      title="是否确认删除此项?"
                      onConfirm={() => handleDelete(r.deviceID)}
                    >
                      <a>删除记录</a>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />
        </Form.Item>
      </Form>
      <Modal
        title="编辑设备信息"
        open={isEditShow}
        // 点击遮罩层时不关闭
        maskClosable={false}
        onCancel={() => setIsEditShow(false)}
        // 关闭modal的时候清除数据
        destroyOnClose
        onOk={() => {
          form.submit(); //手动触发表单的提交事件
        }}
      >
        <Form
          // 表单配合modal一起使用的时候，需要设置这个属性，要不然关了窗口之后不会清空数据
          preserve={false}
          onFinish={async (v) => {
            if (currentDeviceId) {
              await UpdateDevice({ ...v }); // 修改
            }
            // else {
            //   await insertAPI({ ...v, image: imageUrl }); // 新增
            // }
            message.success('保存成功');
            setIsEditShow(false);
            setSearchDevice([]); // 重置查询条件，取数据
          }}
          // labelCol={{ span: 3 }}
          form={form}
        >
          <Form.Item
            label="设备名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入设备名称',
              },
            ]}
          >
            <Input placeholder="请输入设备名称" />
          </Form.Item>
          <Form.Item label=" 设备状态" name="state">
            <Select style={{ width: 200 }} placeholder="设备状态">
              <Select.Option value="wait">正常</Select.Option>
              <Select.Option value="already">借出中</Select.Option>
              <Select.Option value="already">已报废</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="查看设备详情"
        width="60%"
        open={isShow}
        // 点击遮罩层时不关闭
        maskClosable={false}
        onCancel={() => setIsShow(false)}
        // 关闭modal的时候清除数据
        // destroyOnClose
        onOk={() => {
          setIsShow(false);
        }}
      >
        <Descriptions
          title="设备详情"
          bordered
          labelStyle={{
            backgroundColor: '#fdffff9e',
          }}
          style={{
            paddingBottom: '10px',
          }}
          contentStyle={{
            backgroundColor: '#fdffff9e',
          }}
        >
          <Descriptions.Item label="设备编号">
            {}
            {/* {detail?.u_name} */}
            xxxxxxxxxx
          </Descriptions.Item>
          <Descriptions.Item label="设备名称">
            {/* {detail?.u_sex} */}
            xxxxxx
          </Descriptions.Item>
          <Descriptions.Item label="设备型号">
            {/* {detail?.u_age} */}
            xxxxxx
          </Descriptions.Item>
          <Descriptions.Item label="购买类型">
            {/* {detail?.u_first} */}
            xxxxxx
          </Descriptions.Item>
          <Descriptions.Item label="设备状态">
            {/* {detail?.u_last} */}
            xxxxxx
          </Descriptions.Item>
          <Descriptions.Item label="设备负责人">
            {/* {detail?.u_name} */}
            xxxxxx
          </Descriptions.Item>
          <Descriptions.Item label="单价">
            {/* {detail?.u_sex} */}
            xxxxxx
          </Descriptions.Item>
          <Descriptions.Item label="借用费率">
            {/* {detail?.u_age} */}
            xxxxxx
          </Descriptions.Item>
          <Descriptions.Item label="购买日期">
            {/* {detail?.u_first} */}
            xxxxxx
          </Descriptions.Item>
          <Descriptions.Item label="资产编号">
            {/* {detail?.u_last} */}
            xxxxxx
          </Descriptions.Item>
          <Descriptions.Item label="预计报废时间">
            {/* {detail?.u_last} */}
            xxxxxx
          </Descriptions.Item>
          <Descriptions.Item label="设备参数">{/* {detail?.u_name} */}</Descriptions.Item>
          <Descriptions.Item label="设备图片列表">{/* {detail?.u_sex} */}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </PageContainer>
  );
};

export default PersonalInfo;
