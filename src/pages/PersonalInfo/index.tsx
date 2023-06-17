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
import { EditOutlined, MailOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import './index.less';
import { PageContainer, ProFormDateTimePicker } from '@ant-design/pro-components';
import { UpdateDevice, getDeviceDetail, getDeviceList } from '@/services/swagger/device';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { Link, useModel } from 'umi';
import { deleteDeviceByDeviceID } from '@/services/swagger/person';
import moment from 'moment';
interface Device {
  key: React.Key;
  deviceID: number;
  deviceName: string;
  deviceModel: string;
  deviceType: string;
  deviceSpecification: string;
  deviceImageList: string;
  deviceState: string;
  userID: number;
  unitPrice: number;
  borrowRate: number;
  purchaseDate: string;
  assetNumber: string;
  updateTime: string;
  expectedScrapDate: string;
  isPublic: boolean;
}

const roleMap = {
  sysAdmin: '系统管理员',
  deviceAdmin: '设备管理员',
  staff: '教职工',
  internalStudent: '院内学生',
  externalStudent: '院外学生',
};

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
  const [currentDeviceId, setCurrentDeviceId] = useState(Number); // 当前id，如果为空表示新增
  const [currentRow, setCurrentRow] = useState<API.Device>();
  const firstUpdate = useRef(true); //防止刚加载时进行查询
  const [isShow, setIsShow] = useState(false); // 控制modal显示和隐藏
  const [isEditShow, setIsEditShow] = useState(false); // 控制编辑modal显示和隐藏
  //正在编辑的设备
  const [onEditDevice, setOnEditDevice] = useState<API.Device>();

  //编辑个人信息
  const history = useHistory();
  const handleClick = () => {
    history.push('/personalCenter/personalInfo/editDetail'); // 将路由定向到/my-page
  };

  //数据库获取数据初始化操作
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
  }, []); //执行副作用函数，调用initial();在开始时执行一次

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

  const detail = async () => {
    const res = await getDeviceDetail({ DeviceID: currentDeviceId });
    const deviceDetail = res.data; // 获取设备详情对象
    setCurrentRow(deviceDetail); // 将设备详情对象传入 setCurrentRow 方法中
  };
  useEffect(() => {
    detail(); // 在组件渲染之后调用 detail 函数
  }, []);

  //批量删除
  const massRemove = () => {
    setLoading(true);

    const selectedDeviceIds = selectedRowKeys
      .map((selectedKey) => {
        const selectedDevice = showDevice.find((deviceT: Device) => deviceT.key === selectedKey);
        if (selectedDevice && selectedDevice.deviceID) {
          return selectedDevice.deviceID;
        }
        return null;
      })
      .filter((deviceId): deviceId is number => deviceId !== null);
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
    selectedRowKeys, //选中行的主键值
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
                <SolutionOutlined />{' '}
                {currentUser.roleList ? roleMap[currentUser.roleList] : '未知用户'}{' '}
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
              <Button type="primary">我的设备</Button>
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
                dataIndex: 'deviceID' as 'deviceID', //解决ts关于类型检查的报错（将类型强制转换为 'deviceID：number'）
                align: 'center',
              },
              {
                title: '设备名称',
                dataIndex: 'deviceName',
                align: 'center',
              },
              {
                title: '设备状态',
                dataIndex: 'deviceState',
                align: 'center',
              },
              {
                title: '添加时间',
                dataIndex: 'purchaseDate',
                align: 'center',
                render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
              },
              {
                title: '操作',
                key: 'action',
                align: 'center',
                render: (v: any, r: any) => (
                  <Space size="middle">
                    <a
                      onClick={async () => {
                        setIsShow(true); //显示Modal
                        setCurrentDeviceId(r.deviceID);
                        detail();
                        await form.setFieldsValue(r);
                      }}
                    >
                      查看详情
                    </a>
                    <a
                      onClick={async () => {
                        setIsEditShow(true); //显示Modal
                        setCurrentDeviceId(r.deviceID);
                        setCurrentRow(r);
                        form.setFieldsValue(r);
                        const res = await getDeviceDetail({ DeviceID: r.deviceID });
                        if (res.code === 20000) {
                          res.data.purchaseDate = new Date(res.data.purchaseDate).toLocaleString();
                          res.data.expectedScrapDate = new Date(
                            res.data.expectedScrapDate,
                          ).toLocaleString();
                          res.data.createTime = new Date(res.data.createTime).toLocaleString();
                          res.data.updateTime = new Date(res.data.updateTime).toLocaleString();
                          setOnEditDevice(res.data);
                        }
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
        width="600px"
        maskClosable={false}
        onCancel={() => setIsEditShow(false)}
        destroyOnClose
        onOk={() => {
          form.submit(); //手动触发表单的提交事件
        }}
      >
        <Form
          preserve={false}
          onFinish={async (v) => {
            if (currentDeviceId && onEditDevice) {
              onEditDevice.deviceImageList = onEditDevice.deviceImageList //保证参数不为空
                ? onEditDevice.deviceImageList
                : 'null';
              onEditDevice.deviceState = v.state;
              onEditDevice.purchaseDate = v.purchaseDate;
              const res = await UpdateDevice({
                deviceID: onEditDevice.deviceID,
                deviceName: onEditDevice.deviceName,
                deviceModel: onEditDevice.deviceModel,
                deviceType: onEditDevice.deviceType,
                deviceSpecification: onEditDevice.deviceSpecification,
                deviceImageList: onEditDevice.deviceImageList,
                deviceState: onEditDevice.deviceState,
                userID: onEditDevice.userID,
                isPublic: onEditDevice.isPublic,
                stockQuantity: onEditDevice.stockQuantity,
                unitPrice: onEditDevice.unitPrice,
                borrowRate: onEditDevice.borrowRate,
                purchaseDate: moment(onEditDevice.purchaseDate).format('YYYY-MM-DD HH:mm:ss'),
                assetNumber: onEditDevice.assetNumber,
                expectedScrapDate: moment(onEditDevice.expectedScrapDate).format(
                  'YYYY-MM-DD HH:mm:ss',
                ),
                isDeleted: onEditDevice.isDeleted,
                createTime: moment(onEditDevice.createTime).format('YYYY-MM-DD HH:mm:ss'),
                updateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
              });
              if (res.code === 20000) {
                message.success('保存成功');
                form.resetFields();
                setIsEditShow(false);
                initial(); //更新数据
              } else {
                message.error('保存失败');
              }
            }
          }}
          style={{ marginRight: 50, marginLeft: 50, marginTop: 20 }}
          form={form}
        >
          <Form.Item label="设备编号" name="deviceID" initialValue={currentRow?.deviceID}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="设备名称" name="deviceName" initialValue={currentRow?.deviceName}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="设备类型" name="deviceType" initialValue={currentRow?.deviceType}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="设备型号" name="deviceModel" initialValue={currentRow?.deviceModel}>
            <Input disabled />
          </Form.Item>
          <Form.Item label=" 设备状态" name="state">
            <Select placeholder="设备状态">
              <Select.Option value="正常">正常</Select.Option>
              <Select.Option value="借出中">借出中</Select.Option>
              <Select.Option value="已报废">已报废</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <ProFormDateTimePicker
              // width={300}
              name="purchaseDate"
              fieldProps={{
                format: 'yyyy-MM-DD HH:mm:ss',
              }}
              label="添加时间"
              initialValue={onEditDevice?.purchaseDate}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="查看设备详情"
        width="60%"
        open={isShow}
        maskClosable={false}
        onCancel={() => setIsShow(false)}
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
          <Descriptions.Item label="设备编号">{currentRow?.deviceID}</Descriptions.Item>
          <Descriptions.Item label="设备名称">{currentRow?.deviceName}</Descriptions.Item>
          <Descriptions.Item label="设备型号">{currentRow?.deviceModel}</Descriptions.Item>
          <Descriptions.Item label="购买类型">{currentRow?.deviceType}</Descriptions.Item>
          <Descriptions.Item label="设备状态">{currentRow?.deviceState}</Descriptions.Item>
          <Descriptions.Item label="设备负责人">{currentRow?.userID}</Descriptions.Item>
          <Descriptions.Item label="单价">{currentRow?.unitPrice}</Descriptions.Item>
          <Descriptions.Item label="库存数量">{currentRow?.stockQuantity}</Descriptions.Item>
          <Descriptions.Item label="借用费率">{currentRow?.borrowRate}</Descriptions.Item>
          <Descriptions.Item label="购买日期">
            {currentRow && currentRow.purchaseDate
              ? new Date(currentRow.purchaseDate).toLocaleString('zh-CN')
              : '未知'}
          </Descriptions.Item>
          <Descriptions.Item label="资产编号">{currentRow?.assetNumber}</Descriptions.Item>
          <Descriptions.Item label="预计报废时间">
            {currentRow && currentRow.expectedScrapDate
              ? new Date(currentRow.expectedScrapDate).toLocaleString('zh-CN')
              : '未知'}
          </Descriptions.Item>
          <Descriptions.Item label="设备参数">{currentRow?.deviceSpecification}</Descriptions.Item>
          <Descriptions.Item label="设备图片列表">{currentRow?.deviceImageList}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </PageContainer>
  );
};

export default PersonalInfo;
