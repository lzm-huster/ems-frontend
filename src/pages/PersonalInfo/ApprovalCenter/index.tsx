import React, { Key, useEffect, useRef, useState } from 'react';
import {
  AppstoreOutlined,
  CloudUploadOutlined,
  EditOutlined,
  MailOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  MenuProps,
  Row,
  Select,
  Space,
  Table,
  message,
} from 'antd';
import { Menu } from 'antd';
import './index.less';
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { useHistory, useModel } from 'umi';
import {
  purchaseApprovalList,
  borrowApprovalList,
  scrapApprovalList,
  purchaseApprovalRecord,
  borrowApprovalRecord,
  scrapApprovalRecord,
} from '@/services/swagger/approval';
import moment from 'moment';
import { keys, valuesIn } from 'lodash';
import e from 'express';
import { roleList } from '@/services/ant-design-pro/api';

const ApprovalCenter: React.FC = () => {
  interface ActionType {
    reload: (resetPageIndex?: boolean) => void;
    reloadAndRest: () => void;
    reset: () => void;
    clearSelected?: () => void;
    startEditable: (rowKey: Key) => boolean;
    cancelEditable: (rowKey: Key) => boolean;
  }

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [initDevice, setInitDevice] = useState([]);
  const [searchDevice, setSerachDevice] = useState([]);
  const [ApprovalList, setApprovalList] = useState([]);
  const [SelectedApprovalList, setSelectedApprovalList] = useState([]);
  const [current, setCurrent] = useState('purchase');

  const actionRef = useRef<ActionType>();
  const history = useHistory();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const [filteredApprovalList, setFilteredApprovalList] = useState(ApprovalList);
  const [rowkeys, setRowkeys] = useState('');
  const [datefrom_string, setDatefrom_string] = useState('1999-01-01');
  const [dateto_string, setDateto_string] = useState('2024-01-01');
  const [date_moment, setDate_moment] = useState(0);
  const [approval_state, setApproval_state] = useState('');

  const stateMap = {
    //审批映射
    staff: '待管理员审批',
    deviceAdmin: '待领导审批',
    leader: '已审批',
  };
  const purchaseMap = {
    //请求映射
    staff: '未审批',
    deviceAdmin: '待管理员审批',
    leader: '待领导审批',
  };
  const borrow_scrapMap = {
    //请求映射
    deviceAdmin: '待管理员审批',
  };

  //合并行
  // const rowCombination = (approvalData: any) => {
  //   let sameN = 0;
  //   for (let i = 0, j = 0; i < approvalData.length; i++) {
  //     if (i > 0 && i < approvalData.length - 1) {
  //       if (approvalData[i].borrowApplyID - approvalData[i - 1].borrowApplyID == 0) {
  //         approvalData[i].key = j;
  //         approvalData[i].r = 0;
  //         sameN++;
  //       } else {
  //         j++;
  //         approvalData[i].key = j;
  //         approvalData[i - sameN - 1].r = sameN + 1;
  //         sameN = 0;
  //       }
  //     } else if (i == 0) {
  //       approvalData[i].key = 0;
  //     } else {
  //       if (approvalData[i].borrowApplyID - approvalData[i - 1].borrowApplyID == 0) {
  //         approvalData[i].key = j;
  //         approvalData[i].r = 0;
  //         sameN++;
  //         approvalData[i - sameN].r = sameN + 1;
  //       } else {
  //         j++;
  //         approvalData[i].key = j;
  //         approvalData[i].r = 1;
  //         approvalData[i - sameN - 1].r = sameN + 1;
  //       }
  //     }
  //   }
  //   console.log(approvalData);
  //   return approvalData;
  // };

  const getMenuItems = () => {
    if (currentUser.roleList == 'deviceAdmin') {
      return [
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
    } else {
      return [
        {
          label: '采购申请审核',
          key: 'purchase',
          icon: <MailOutlined />,
        },
      ];
    }
  };

  const refreshTable = async () => {
    let res;
    switch (current) {
      case 'purchase':
        res = await purchaseApprovalList(purchaseMap[currentUser.roleList]);
        break;
      case 'borrow':
        res = await borrowApprovalList(borrow_scrapMap[currentUser.roleList]);
        break;
      case 'scrap':
        res = await scrapApprovalList(borrow_scrapMap[currentUser.roleList]);
        break;
      default:
        res = await purchaseApprovalList(purchaseMap[currentUser.roleList]);
        break;
    }
    if (res.code === 20000) {
      // 给ApprovalList数组添加递增的键值
      let id = 0;
      const approvalListWithKey = res.data.map((item: any) => ({
        ...item,
        key: ++id,
        r: 1,
      }));
      setApprovalList(approvalListWithKey);
      setSelectedApprovalList(ApprovalList);
    } else {
      setApprovalList([]);
    }
  };

  const handleApprovalRecord = async (id: number, isAbort: boolean) => {
    switch (current) {
      case 'purchase':
        const res1 = await purchaseApprovalRecord(
          id,
          isAbort ? '驳回审批' : stateMap[currentUser.roleList],
        );
        if (res1.code === 20000 || res1.code === 40400) {
          ///40400时修改也成功
          message.success('审批成功！');
          refreshTable();
        } else {
          message.error(res1.message);
          console.log(current);
        }
        break;
      case 'borrow':
        const res2 = await borrowApprovalRecord(
          id,
          isAbort ? '驳回审批' : stateMap[currentUser.roleList],
        );
        if (res2.code === 20000 || res2.code === 40400) {
          message.success('审批成功！');
          refreshTable();
        } else {
          message.error(res2.message);
        }
        break;
      case 'borrow':
        const res3 = await scrapApprovalRecord(
          id,
          isAbort ? '驳回审批' : stateMap[currentUser.roleList],
        );
        if (res3.code === 20000 || res3.code === 40400) {
          message.success('审批成功！');
          refreshTable();
        } else {
          message.error(res3.message);
        }
        break;
      default:
        message.error('内部错误！');
        break;
    }
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
            // onCell: (data) => {
            //   return { rowSpan: data.r };
            // },
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
            // onCell: (data) => {
            //   return { rowSpan: data.r };
            // },
          },
          {
            title: '预算',
            dataIndex: 'purchaseBudget',
            align: 'center',
            // onCell: (data) => {
            //   return { rowSpan: data.r };
            // },
          },
          {
            title: '申请人',
            dataIndex: 'userName',
            align: 'center',
            // onCell: (data) => {
            //   return { rowSpan: data.r };
            // },
          },
          {
            disable: true,
            title: '申请人角色',
            dataIndex: 'roleName',
            // filters: true,
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
            // onCell: (data) => {
            //   return { rowSpan: data.r };
            // },
          },
          {
            title: '审核状态',
            dataIndex: 'purchaseApplyState',
            align: 'center',
            // onCell: (data) => {
            //   return { rowSpan: data.r };
            // },
          },
          {
            title: '操作',
            align: 'center',
            key: 'action',
            width: 200,
            render: (record: any) => (
              <Space size="middle">
                <a
                  onClick={async () => {
                    handleApprovalRecord(record.purchaseApplySheetID, false);
                  }}
                >
                  同意
                </a>
                <a
                  onClick={async () => {
                    handleApprovalRecord(record.purchaseApplySheetID, true);
                  }}
                >
                  驳回
                </a>
              </Space>
            ),
            // onCell: (data) => {
            //   return { rowSpan: data.r };
            // },
          },
        ];
      case 'borrow':
        return [
          {
            title: '审批编号',
            dataIndex: 'borrowApplyID',
            width: 100,
            align: 'center',
            // onCell: (data) => {
            //   return { rowSpan: data.r };
            // },
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
            // onCell: (data) => {
            //   return { rowSpan: data.r };
            // },
          },
          {
            title: '申请人',
            dataIndex: 'userName',
            align: 'center',
            // onCell: (data) => {
            //   return { rowSpan: data.r };
            // },
          },
          {
            disable: true,
            title: '申请人角色',
            dataIndex: 'roleName',
            // filters: true,
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
            // onCell: (data) => {
            //   return { rowSpan: data.r };
            // },
          },
          {
            title: '审批状态',
            dataIndex: 'borrowApplyState',
            align: 'center',
            // onCell: (data) => {
            //   return { rowSpan: data.r };
            // },
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 200,
            render: (record: any) => (
              <Space size="middle">
                <a
                  onClick={async () => {
                    handleApprovalRecord(record.borrowApplyID, false); //这里无法获取borrowApplyID
                  }}
                >
                  同意
                </a>
                <a
                  onClick={async () => {
                    handleApprovalRecord(record.borrowApplyID, true);
                  }}
                >
                  驳回
                </a>
              </Space>
            ),
            // onCell: (data) => {
            //   return { rowSpan: data.r };
            // },
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
            // onCell: (data) => {
            //   return { rowSpan: data.r };
            // },
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
            // onCell: (data) => {
            //   return { rowSpan: data.r };
            // },
          },
          {
            title: '设备负责人',
            dataIndex: 'scrapPerson',
            align: 'center',
            // onCell: (data) => {
            //   return { rowSpan: data.r };
            // },
          },
          {
            title: '报废原因',
            dataIndex: 'scrapReason',
            width: 150,
            align: 'center',
            // onCell: (data) => {
            //   return { rowSpan: data.r };
            // },
          },
          {
            disable: true,
            title: '申请人角色',
            dataIndex: 'roleName',
            // filters: true,
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
            // onCell: (data) => {
            //   return { rowSpan: data.r };
            // },
          },
          {
            title: '设备状态',
            dataIndex: 'scrapState',
            align: 'center',
            // onCell: (data) => {
            //   return { rowSpan: data.r };
            // },
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 200,
            render: (record: any) => (
              <Space size="middle">
                <a
                  onClick={async () => {
                    handleApprovalRecord(record.scrapID, false);
                  }}
                >
                  同意
                </a>
                <a
                  onClick={async () => {
                    handleApprovalRecord(record.scrapID, true);
                  }}
                >
                  驳回
                </a>
              </Space>
            ),
            // onCell: (data) => {
            //   return { rowSpan: data.r };
            // },
          },
        ];
      default:
        return [];
    }
  };
  /**
   * 筛选函数
   * @param values
   */

  const onReset = () => {
    setSelectedApprovalList(ApprovalList);
    form.resetFields();
  };

  //获取数据
  const initial = async () => {
    const res = await purchaseApprovalList(purchaseMap[currentUser.roleList]);
    if (res.code === 20000) {
      setInitDevice(res.data);
      let id = 0;
      const approvalListWithKey = res.data.map((item: any) => ({
        ...item,
        key: ++id,
        r: 1,
      }));
      setApprovalList(approvalListWithKey);
      setSelectedApprovalList(approvalListWithKey);
    }
  };
  useEffect(() => {
    initial();
  }, []);

  function processData(data: any) {
    return data.map((item: any) => {
      item.purchaseApplyDate = new Date(item.purchaseApplyDate).toLocaleString();
      item.borrowApplyDate = new Date(item.borrowApplyDate).toLocaleString();
      item.scrapTime = new Date(item.scrapTime).toLocaleString();
      return item;
    });
  }

  // -----------------------------数据筛选函数-----------------------------------
  const selectFunction = (values: {
    roleName: string;
    time_from: { unix: () => number } | undefined;
    time_to: { unix: () => number } | undefined;
  }) => {
    let select = [];
    if (current == 'purchase') {
      // 根据用户类型和时间筛选数据
      select = ApprovalList.filter((item: any) => {
        return (
          (values.time_from === undefined ||
            values.time_from.unix() <= moment(item.purchaseApplyDate).unix()) &&
          (values.time_to === undefined ||
            values.time_to.unix() >= moment(item.purchaseApplyDate).unix()) &&
          (values.roleName === item.roleName ||
            values.roleName === 'all' ||
            values.roleName === undefined)
        );
      });
    }
    if (current == 'borrow') {
      // 根据用户类型和时间筛选数据
      select = ApprovalList.filter((item: any) => {
        return (
          (values.time_from === undefined ||
            values.time_from.unix() <= moment(item.borrowApplyDate).unix()) &&
          (values.time_to === undefined ||
            values.time_to.unix() >= moment(item.borrowApplyDate).unix()) &&
          (values.roleName === item.roleName ||
            values.roleName === 'all' ||
            values.roleName === undefined)
        );
      });
    } else {
      select = ApprovalList.filter((item: any) => {
        return (
          (values.time_from === undefined ||
            values.time_from.unix() <= moment(item.scrapTime).unix()) &&
          (values.time_to === undefined ||
            values.time_to.unix() >= moment(item.scrapTime).unix()) &&
          (values.roleName === item.roleName ||
            values.roleName === 'all' ||
            values.roleName === undefined)
        );
      });
    }
    console.log('筛选后的内容为', select);
    setSelectedApprovalList(select);
  };

  // -----------------------------计算时间之前---------------------------------------
  //处理日期选择器的禁用日期和日期范围限制
  const disabledDatefrom = (currenttime: any) => {
    return currenttime && currenttime < moment('20201108', 'YYYYMMDD');
  };

  const ontimechange = (time_moment: any) => {
    setDate_moment(time_moment);
  };

  const disabledDateto = (currenttime: any) => {
    if (date_moment === 0) {
      return currenttime && currenttime < moment('20201108', 'YYYYMMDD');
    }
    return currenttime && currenttime < date_moment;
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
    // selectedRowKeys,
    onChange: onSelectChange,
  };

  const onClick: MenuProps['onClick'] = async (e) => {
    let res;
    setCurrent(e.key);
    switch (e.key) {
      case 'purchase':
        res = await purchaseApprovalList(purchaseMap[currentUser.roleList]);
        break;
      case 'borrow':
        res = await borrowApprovalList(purchaseMap[currentUser.roleList]);
        break;
      case 'scrap':
        res = await scrapApprovalList(purchaseMap[currentUser.roleList]);
        break;
      default:
        res = await purchaseApprovalList(purchaseMap[currentUser.roleList]);
        break;
    }
    if (res.code === 20000) {
      // 给ApprovalList数组添加递增的键值
      let id = 0;
      const approvalListWithKey = res.data.map((item: any) => ({
        ...item,
        key: ++id,
        r: 1,
      }));
      setApprovalList(approvalListWithKey);
      setSelectedApprovalList(approvalListWithKey);
      console.log('当前用户：', currentUser);
    } else {
      setApprovalList([]);
    }
  };

  const onFinish = (values: any) => {
    selectFunction(values);
    console.log('Success:', values);
  };

  //同意审批
  //驳回审批
  const approvalNo = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  return (
    <PageContainer>
      <Card size="small">
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Row>
            <Col span={10}>
              <Menu
                onClick={onClick}
                selectedKeys={[current]}
                mode="horizontal"
                items={getMenuItems()}
              />
            </Col>
            <Col span={10}>
              <></>
            </Col>
          </Row>
          <Form
            form={form}
            style={{ margin: '10px' }}
            initialValues={{
              ...currentUser,
            }}
            onFinish={onFinish}
          >
            <Row>
              <Col span={12}>
                <Form.Item label="用户类型" name="roleName" initialValue="all">
                  <Select style={{ width: 200 }} placeholder="用户类型">
                    <Select.Option value="all">全部</Select.Option>
                    <Select.Option value="sysAdmin">系统管理员</Select.Option>
                    <Select.Option value="deviceAdmin">设备管理员</Select.Option>
                    <Select.Option value="staff">教职工</Select.Option>
                    <Select.Option value="internalStudent">院内学生</Select.Option>
                    <Select.Option value="externalStudent">院外学生</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col>
                <Space>
                  <Form.Item label="申请时间" name="time_from">
                    <DatePicker
                      disabledDate={disabledDatefrom}
                      onChange={ontimechange}
                      defaultPickerValue={moment('20201108', 'YYYYMMDD')}
                    />
                  </Form.Item>
                  <Form.Item>
                    <div>至</div>
                  </Form.Item>
                  <Form.Item name="time_to">
                    <DatePicker
                      disabledDate={disabledDateto}
                      defaultPickerValue={moment('20201108', 'YYYYMMDD')}
                    />
                  </Form.Item>
                </Space>
              </Col>
            </Row>
            <Row>
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
          <ProTable
            bordered={true}
            rowSelection={rowSelection}
            columns={getColumns(current)}
            actionRef={actionRef}
            rowKey="key"
            search={false}
            dataSource={processData(SelectedApprovalList)}
            // pagination={{
            //   pageSize: 6,
            //   onChange: (page) => console.log(page),
            // }}
            dateFormatter="string"
          />
        </Space>
      </Card>
    </PageContainer>
  );
};

export default ApprovalCenter;
