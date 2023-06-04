import React, { useEffect, useRef, useState } from 'react';
import {
  AppstoreOutlined,
  MailOutlined,
  PlusOutlined,
  SettingOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Layout,
  MenuProps,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Upload,
} from 'antd';
import { Menu } from 'antd';
import './index.less';
import {
  ActionType,
  PageContainer,
} from '@ant-design/pro-components';
import { useHistory } from 'umi';
import { purchaseApprovalList } from '@/services/swagger/Approval';

const tailLayout = {
  wrapperCol: { offset: 21, span: 16 },
};

const items: MenuProps['items'] = [
  {
    label: '采购申请审核',
    key: 'purchase',
    icon: <MailOutlined />,
  },
  {
    label: '维修审核',
    key: 'app',
    icon: <AppstoreOutlined />,
  },
  {
    label: '报废审核',
    key: 'scrap',
    icon: <SettingOutlined />,
  },
];

const ApprovalCenter: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [initDevice, setInitDevice] = useState([]);
  const [searchDevice, setSerachDevice] = useState([]);
  const [PurchaseApproval, setPurchaseApproval] = useState([]);
  const actionRef = useRef<ActionType>();
  const history = useHistory();
  const handleClick = () => {
    history.push('/personalCenter/personalInfo/edit'); // 将路由定向到/my-page
  };


  const purchaseColumns = [
    {
      title: '审批编号',
      dataIndex: 'index',
      valueType: 'index',
      width: 100,
    },
    {
      title: '申请内容',
      dataIndex: 'deviceList',
    },
    {
      title: '申请时间',
      dataIndex: 'purchaseApplyDate',
    },
    {
      title: '申请人',
      dataIndex: 'userName',
    },
    {
      title: '备注',
      dataIndex: 'purchaseApplyState',
    },
    // {
    //   title: '操作',
    //   key: 'action',
    //   width: 200,
    //   render: () => (
    //     <Space size="middle">
    //       <a>同意</a>
    //       <a>驳回</a>
    //     </Space>
    // ),
    // },
      {
    title: '操作',
    key: 'action',
    width: 400,
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

  //获取数据
  const initial = async () => {
    const res = await purchaseApprovalList({ state: '未审批' });
    if (res.code === 20000) {
      setInitDevice(res.data);
      setPurchaseApproval(res.data);
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
  const [current, setCurrent] = useState('purchase');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const onChange = (key: string) => {
    console.log(key);
  };

  function setAddVisible(arg0: boolean) {
    throw new Error('Function not implemented.');
  }

  return (
    <PageContainer>
      <Card title="筛选" size="small">
        <form style={{ margin: '10px' }}>
          <Row>
            <Col span={12}>
              <Form.Item label="是否审批">
                <Select style={{ width: 200 }} placeholder="审批">
                  <Select.Option value="wait">待审批</Select.Option>
                  <Select.Option value="already">已审批</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="价格区间">
                <Space.Compact block>
                  <Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" />
                  <Input
                    className="site-input-split"
                    style={{
                      width: 30,
                      borderLeft: 0,
                      borderRight: 0,
                      pointerEvents: 'none',
                    }}
                    placeholder="~"
                    disabled
                  />
                  <Input
                    className="site-input-right"
                    style={{
                      width: 100,
                      textAlign: 'center',
                    }}
                    placeholder="Maximum"
                  />
                </Space.Compact>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="用户类型">
                <Select style={{ width: 200 }} placeholder="用户类型">
                  <Select.Option value="teacher">教职工</Select.Option>
                  <Select.Option value="student">学生</Select.Option>
                  <Select.Option value="outAcademy">院外人员</Select.Option>
                  <Select.Option value="outSchool">校外人员</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="时间">
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={4} offset={4}>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    提交
                  </Button>
                  <Button htmlType="button">重置</Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </form>
      </Card>
      <Card size="small">
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Row>
            <Col span={10}>
              <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
            </Col>
            <Col span={12}></Col>
            <Col span={2}>
              <Button type="primary" style={{ margin: '10px' }}>
                批量审批
              </Button>
            </Col>
          </Row>
          <Table rowSelection={rowSelection} columns={purchaseColumns} dataSource={PurchaseApproval} />
        </Space>
      </Card>
    </PageContainer>
  );
};

export default ApprovalCenter;
