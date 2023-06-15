import React, { useEffect, useRef, useState } from 'react';
import { AppstoreOutlined, MailOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  MenuProps,
  Row,
  Select,
  Space,
  Table,
} from 'antd';
import { Menu } from 'antd';
import './index.less';
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { useHistory, useModel } from 'umi';
import {
  purchaseApprovalList,
  borrowApprovalList,
  scrapApprovalList,
} from '@/services/swagger/approval';
import moment from 'moment';

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
    label: '借用审核',
    key: 'borrow',
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
  const [SelectedApprovalList, setSeletedApprovalList] = useState([]);
  const hasSelected = selectedRowKeys.length > 0;
  const [current, setCurrent] = useState('purchase');
  const actionRef = useRef<ActionType>();
  const history = useHistory();
  const [form] = Form.useForm();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState;

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
            align: 'center',
          },
          {
            title: '申请内容',
            dataIndex: 'deviceList',
            align: 'center',
          },
          {
            title: '申请时间',
            dataIndex: 'purchaseApplyDate',
            valueType: 'date',
            align: 'center',
          },
          {
            title: '预算',
            dataIndex: 'purchaseBudget',
            align: 'center',
          },
          {
            title: '申请人',
            dataIndex: 'userName',
            align: 'center',
          },
          {
            disable: true,
            title: '申请人角色',
            dataIndex: 'roleName',
            filters: true,
            onFilter: true,
            ellipsis: true,
            align: 'center',
            valueType: 'select',
            valueEnum: {
              sysAdmin: {
                text: '系统管理员',
              },
              deviceAdmin: {
                text: '设备管理员',
              },
              staff: {
                text: '教职工',
              },
              internalStudent: {
                text: '院内学生',
              },
              externalStudent: {
                text: '院外学生',
              },
            },
          },
          {
            title: '审核状态',
            dataIndex: 'purchaseApplyState',
            align: 'center',
          },
          {
            title: '操作',
            align: 'center',
            key: 'action',
            width: 200,
            render: () => (
              <Space size="middle">
                <a>同意</a>
                <a>驳回</a>
              </Space>
            ),
          },
        ];
      case 'borrow':
        return [
          {
            title: '审批编号',
            dataIndex: 'borrowApplyID',
            valueType: 'index',
            width: 100,
            align: 'center',
          },
          {
            title: '申请内容',
            dataIndex: 'deviceList',
            align: 'center',
          },
          {
            title: '申请时间',
            dataIndex: 'borrowApplyDate',
            align: 'center',
          },
          {
            title: '申请人',
            dataIndex: 'userName',
            align: 'center',
          },
          {
            disable: true,
            title: '申请人角色',
            dataIndex: 'roleName',
            filters: true,
            onFilter: true,
            ellipsis: true,
            align: 'center',
            valueType: 'select',
            valueEnum: {
              sysAdmin: {
                text: '系统管理员',
              },
              deviceAdmin: {
                text: '设备管理员',
              },
              staff: {
                text: '教职工',
              },
              internalStudent: {
                text: '院内学生',
              },
              externalStudent: {
                text: '院外学生',
              },
            },
          },
          {
            title: '审批状态',
            dataIndex: 'borrowApplyState',
            align: 'center',
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 200,
            render: () => (
              <Space size="middle">
                <a>同意</a>
                <a>驳回</a>
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
            align: 'center',
          },
          {
            title: '报废设备',
            dataIndex: 'deviceName',
            align: 'center',
          },
          {
            title: '报废时间',
            dataIndex: 'scrapTime',
            valueType: 'date',
            align: 'center',
          },
          {
            title: '设备负责人',
            dataIndex: 'scrapPerson',
            align: 'center',
          },
          {
            title: '报废原因',
            dataIndex: 'scrapReason',
            width: 150,
            align: 'center',
          },
          {
            disable: true,
            title: '申请人角色',
            dataIndex: 'roleName',
            filters: true,
            onFilter: true,
            ellipsis: true,
            align: 'center',
            valueType: 'select',
            valueEnum: {
              sysAdmin: {
                text: '系统管理员',
              },
              deviceAdmin: {
                text: '设备管理员',
              },
              staff: {
                text: '教职工',
              },
              internalStudent: {
                text: '院内学生',
              },
              externalStudent: {
                text: '院外学生',
              },
            },
          },
          {
            title: '设备状态',
            dataIndex: 'scrapState',
            align: 'center',
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 200,
            render: () => (
              <Space size="middle">
                <a>同意</a>
                <a>驳回</a>
              </Space>
            ),
          },
        ];
      default:
        return [];
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  //获取数据
  const initial = async () => {
    const res = await purchaseApprovalList('未审批');
    if (res.code === 20000) {
      setInitDevice(res.data);
      setApprovalList(res.data);
      setSeletedApprovalList(res.data);
    }
  };
  useEffect(() => {
    initial();
  }, []);

  // 数据筛选函数
  // const select = (values) => {
  //   let select = [];
  //   select = ApprovalList.filter((index) => {
  //     return (
  //       (values.time_from === undefined ||
  //         values.time_from.unix() <= moment(index.ordertime).unix()) &&
  //       (values.time_to === undefined || values.time_to.unix() >= moment(index.overtime).unix()) &&
  //       (values.approvalState === index.name || values.name === 'all') &&
  //       (values.userType === index.operation || values.report_state === 'all')
  //     );
  //   });
  //   setSeletedApprovalList(select);
  // };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  function processData(data: any) {
    return data.map((item: any) => {
      item.purchaseApplyDate = new Date(item.purchaseApplyDate).toLocaleString();
      item.borrowApplyDate = new Date(item.borrowApplyDate).toLocaleString();
      item.scrapTime = new Date(item.scrapTime).toLocaleString();
      return item;
    });
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onClick: MenuProps['onClick'] = async (e) => {
    let res;
    setCurrent(e.key);
    switch (e.key) {
      case 'purchase':
        res = await purchaseApprovalList('未审批');
        break;
      case 'borrow':
        res = await borrowApprovalList('已归还');
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

  return (
    <PageContainer>
      <Card title="筛选" size="small">
        <Form
          form={form}
          style={{ margin: '10px' }}
          initialValues={{
            ...currentUser,
          }}
        >
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
                  <Button htmlType="button" onClick={onReset}>
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
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
          <ProTable
            rowSelection={rowSelection}
            columns={getColumns(current)}
            // actionRef={actionRef}
            rowKey="id"
            search={false}
            dataSource={processData(ApprovalList)}
            pagination={{
              pageSize: 5,
              onChange: (page) => console.log(page),
            }}
            dateFormatter="string"
          />
          {/* <Table
            rowSelection={rowSelection}
            columns={getColumns(current)}
            dataSource={processData(ApprovalList)}
          /> */}
        </Space>
      </Card>
    </PageContainer>
  );
};

export default ApprovalCenter;
