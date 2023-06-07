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
import { ActionType, PageContainer } from '@ant-design/pro-components';
import { useHistory } from 'umi';
import {
  purchaseApprovalList,
  repairApprovalList,
  scrapApprovalList,
} from '@/services/swagger/approval';

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
    key: 'repair',
    icon: <AppstoreOutlined />,
  },
  {
    label: '报废审核',
    key: 'scrap',
    icon: <SettingOutlined />,
  },
];

const ApprovalCenter: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(['purchase']);
  const [initDevice, setInitDevice] = useState([]);
  const [searchDevice, setSerachDevice] = useState([]);
  const [ApprovalList, setApprovalList] = useState([]);
  const hasSelected = selectedRowKeys.length > 0;
  const [current, setCurrent] = useState('purchase');
  const actionRef = useRef<ActionType>();
  const history = useHistory();
  const handleClick = () => {
    history.push('/personalCenter/personalInfo/edit'); // 将路由定向到/my-page
  };

  const getColumns = (currentKey: any) => {
    switch (currentKey) {
      case 'purchase':
        return [
          {
            title: '审批编号',
            dataIndex: 'purchaseApplySheetID',
            valueType: 'index',
            width: 100,
          },
          {
            title: '申请内容',
            dataIndex: 'deviceName',
          },
          {
            title: '申请时间',
            dataIndex: 'purchaseApplyDate',
          },
          {
            title: '申请人',
            dataIndex: 'applicant',
          },
          {
            title: '备注',
            dataIndex: 'purchaseApplyState',
          },
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
      case 'repair':
        return [
          {
            title: '审批编号',
            dataIndex: 'repairApplySheetID',
            valueType: 'index',
            width: 100,
          },
          {
            title: '申请内容',
            dataIndex: 'deviceName',
          },
          {
            title: '申请时间',
            dataIndex: 'repairApplyDate',
          },
          {
            title: '申请人',
            dataIndex: 'applicant',
          },
          {
            title: '备注',
            dataIndex: 'repairApplyState',
          },
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
      case 'scrap':
        return [
          {
            title: '报废编号',
            dataIndex: 'scrapID',
            valueType: 'index',
            width: 100,
          },
          {
            title: '报废设备',
            dataIndex: 'deviceName',
          },
          {
            title: '报废时间',
            dataIndex: 'scrapTime',
          },
          {
            title: '设备负责人',
            dataIndex: 'scrapPerson',
          },
          {
            title: '报废原因',
            dataIndex: 'scrapReason',
            width: 150,
          },
          {
            title: '设备状态',
            dataIndex: 'scrapState',
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
            render: () => (
              <Space size="middle">
                <a>详情</a>
                <a>报废</a>
                <a>修改</a>
                <a>删除</a>
              </Space>
            ),
          },
        ];
      default:
        return [];
    }
  };

  //获取数据
  const initial = async () => {
    const res = await purchaseApprovalList('未审批');
    if (res.code === 20000) {
      setInitDevice(res.data);
      setApprovalList(res.data);
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

  const onClick: MenuProps['onClick'] = async (e) => {
    console.log('click ', e);
    let res;
    setCurrent(e.key);
    switch (e.key) {
      case 'purchase':
        res = await purchaseApprovalList('未审批');
        break;
      case 'repair':
        res = await repairApprovalList('未审批');
        break;
      case 'scrap':
        res = await scrapApprovalList('已完成');
        break;
      default:
        res = await purchaseApprovalList('未审批');
        break;
    }
    if (res.code === 20000) {
      setApprovalList(res.data);
    } else setApprovalList([]);
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
            <Col span={6}>
              <Form.Item label="时间">
                <DatePicker />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            {/* 启用下面将提交和重置按钮放置在右边 */}
            {/* <Col span={16}>
              <></>
            </Col> */}
            <Col span={8}>
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
            <Col span={10}>
              <></>
            </Col>
            <Col span={2}>
              <Button type="primary" style={{ margin: '10px' }}>
                批量审批
              </Button>
            </Col>
          </Row>
          <Table
            rowSelection={rowSelection}
            columns={getColumns(current)}
            dataSource={ApprovalList}
          />
        </Space>
      </Card>
    </PageContainer>
  );
};

export default ApprovalCenter;
