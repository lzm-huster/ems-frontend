/* eslint-disable react/jsx-key */
import { roleList, userList } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProTable,
  RequestOptionsType,
} from '@ant-design/pro-components';
import { Button, Card, Col, Divider, Image, message, Row, Statistic } from 'antd';
import { useEffect, useRef, useState } from 'react';

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 48,
  },
  {
    title: '用户名称',
    dataIndex: 'userName',
    copyable: true,
    ellipsis: true,
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    title: '用户头像',
    dataIndex: 'avatar',
    render: (_, record) => <Image width={40} src={record.avatar} />,
  },
  {
    disable: true,
    title: '用户角色',
    dataIndex: 'state',
    filters: true,
    onFilter: true,
    ellipsis: true,
    valueType: 'select',
    valueEnum: {
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
    title: '联系方式',
    dataIndex: 'phoneNumber',
    copyable: true,
    ellipsis: true,
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'created_at',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
  },
  // {
  //   title: '创建时间',
  //   dataIndex: 'created_at',
  //   valueType: 'dateRange',
  //   hideInTable: true,
  //   search: {
  //     transform: (value: any[]) => {
  //       return {
  //         startTime: value[0],
  //         endTime: value[1],
  //       };
  //     },
  //   },
  // },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看详情
      </a>,
    ],
  },
];
const UserManage: React.FC = () => {
  const emailSuffix = '@hust.edu.cn';
  const actionRef = useRef<ActionType>();
  const [initData, setInitData] = useState<API.UserInfo[]>();
  const [addModalVisible, setAddVisible] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const handleAdd = (values) => {};
  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    const regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/);
    const isMatched = regex.test(value); // inputString为要检查的字符串
    // 没有值的情况
    if (!value) {
      return promise.resolve();
    }
    if (!isMatched) {
      return promise.reject('密码必须包含数字和字母且长度处于6-20之间');
    }
    return promise.resolve();
  };
  useEffect(() => {
    userList()
      .then((res) => {
        if (res.code === 20000) {
          console.log(res);
          setInitData(res.data);
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => message.error(err));
  }, []);
  const changeData = (data: API.RoleSimple[]): RequestOptionsType[] => {
    return data.map((item: API.RoleSimple) => {
      const newObj: {
        label: string;
        value: number;
        title: string;
      } = {
        label: '',
        value: 0,
        title: '',
      };
      if (item.roleDescription) {
        newObj.label = item.roleDescription;
      }
      if (item.roleID) {
        newObj.value = item.roleID;
      }
      if (item.roleName) {
        newObj.title = item.roleName;
      }
      return newObj;
    });
  };
  const getRoleData = async (): Promise<RequestOptionsType[]> => {
    const res = await roleList();
    if (res.code === 20000 && res.data !== undefined) {
      return changeData(res.data);
    } else {
      message.error(res.message);
      return [];
    }
  };
  const onRoleChange = (value) => {
    const title: string = value.title as string;
    setSelectedRole(title);
  };
  // const;
  return (
    <PageContainer>
      <div style={{ marginBottom: 10 }}>
        <Row gutter={24}>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="总用户数"
                value={20}
                precision={0}
                valueStyle={{ color: '#5781CD', fontWeight: 'bold', fontSize: 42 }}
                suffix="人"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="教职工数"
                value={12}
                precision={0}
                valueStyle={{ color: '#27A77F', fontWeight: 'bold', fontSize: 42 }}
                suffix="人"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="学生数"
                value={5}
                precision={0}
                valueStyle={{ color: '#8D42A3', fontWeight: 'bold', fontSize: 42 }}
                suffix="人"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="其他人员数"
                value={3}
                precision={0}
                valueStyle={{ color: '#8D42A3', fontWeight: 'bold', fontSize: 42 }}
                suffix="人"
              />
            </Card>
          </Col>
        </Row>
      </div>

      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        rowKey="id"
        search={false}
        dataSource={initData}
        pagination={{
          pageSize: 5,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setAddVisible(true);
              // actionRef.current?.reload();
            }}
            type="primary"
          >
            添加用户
          </Button>,
        ]}
      />
      <ModalForm
        title="新增用户"
        width="500px"
        visible={addModalVisible}
        onVisibleChange={setAddVisible}
        onFinish={async (value) => {
          console.log(value);

          // const submitterList = value.submitterIdList;
          // const idList = submitterList.map((submitter: { value: string; label: string }) => {
          //   const tempValue: string = submitter.value;
          //   const userId = tempValue?.split('-').pop();
          //   if (userId) {
          //     return parseInt(userId);
          //   }
          //   return;
          // });
          // value.submitterIdList = JSON.stringify(idList);
          // const success = await handleAdd(value);
          // if (success) {
          //   handleModalVisible(false);
          //   // if (actionRef.current) {
          //   //   actionRef.current.reload();
          //   // }
          // }
        }}
      >
        <ProFormSelect
          label="用户角色"
          name="roleId"
          request={getRoleData}
          required={true}
          fieldProps={{
            showArrow: false,
            showSearch: true,
            onChange: onRoleChange,
            dropdownMatchSelectWidth: false,
            labelInValue: true,
            autoClearSearchValue: true,
          }}
        />
        <ProFormRadio.Group
          name="gender"
          label="性别"
          fieldProps={{ defaultValue: '男' }}
          options={[
            {
              label: '男',
              value: '男',
            },
            {
              label: '女',
              value: '女',
            },
          ]}
        />
        <ProFormText name="userName" label="用户名称" width={350} required={true} />
        <ProFormText.Password
          name="password"
          label="密码"
          placeholder={'请输入密码，置空默认ems123456'}
          width={350}
          rules={[
            {
              validator: checkPassword,
            },
          ]}
        />
        <ProFormText
          name="phoneNumber"
          label="联系方式"
          width={350}
          required={true}
          placeholder="请输入手机号"
        />
        {selectedRole.toLowerCase().includes('student') && (
          <ProFormText
            name="email"
            label="邮箱"
            width={350}
            required={true}
            placeholder=""
            fieldProps={{
              suffix: (
                <>
                  <Divider type="vertical" style={{ height: 20 }} />
                  <span>{emailSuffix}</span>
                </>
              ),
            }}
          />
        )}
      </ModalForm>
    </PageContainer>
  );
};

export default UserManage;
