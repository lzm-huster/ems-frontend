/* eslint-disable react/jsx-key */
import { addUser, roleList, updateAvatar, userList } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, RequestOptionsType } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Card, Col, Divider, Drawer, Form, Image, message, Row, Statistic } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { RcFile } from 'antd/lib/upload';
import { useEffect, useRef, useState } from 'react';

const UserManage: React.FC = () => {
  const emailSuffix = '@hust.edu.cn';
  const actionRef = useRef<ActionType>();
  const [initData, setInitData] = useState<API.UserInfo[]>([]);
  const [tableData, setFormData] = useState<API.UserInfo[]>([]);
  const [addModalVisible, setAddVisible] = useState<boolean>(false);
  const [editModalVisible, setEditVisible] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [emailData, setEmailData] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [currentRow, setCurrentRow] = useState<API.UserInfo>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [form] = Form.useForm();
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
      dataIndex: 'roleName',
      filters: true,
      onFilter: true,
      ellipsis: true,
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
      title: '联系方式',
      dataIndex: 'phoneNumber',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'createTime',
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
            setCurrentRow(record);
            console.log(record);
            setEditVisible(true);
            // action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          onClick={() => {
            setCurrentRow(record);
            setShowDetail(true);
          }}
          key="view"
        >
          查看详情
        </a>,
      ],
    },
  ];
  const detailColumns = [
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
      dataIndex: 'roleDescription',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '联系方式',
      dataIndex: 'phoneNumber',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '学号/工号',
      dataIndex: 'idnumber',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '所属部门',
      dataIndex: 'department',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'createTime',
      valueType: 'date',
      sorter: true,
      hideInSearch: true,
    },
  ];
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
  const reloadData = () => {
    userList()
      .then((res) => {
        if (res.code === 20000) {
          console.log(res);
          setInitData(res.data);
          setFormData(res.data);
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => message.error(err));
  };
  useEffect(() => {
    reloadData();
  }, []);
  useEffect(() => {
    form.setFieldsValue({ email: emailData });
  }, [emailData]);
  const onEmailChange = (value) => {
    setEmailData(value.target.value);
  };
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
  const handleAdd = async (values) => {
    console.log(values);
    const res = await addUser(values);
    if (res.code === 20000 && res.data !== null) {
      setAddVisible(false);
      reloadData();
      message.success('用户添加成功');
    } else {
      message.error(res.message);
    }
  };
  const peopleData = {
    sum: initData?.length,
    student: initData?.filter((i) => i.roleName.toLowerCase().includes('student')).length,
    staff: initData?.filter((i) => i.roleName === 'staff').length,
    other:
      initData.length -
      initData.filter((i) => i.roleName.toLowerCase().includes('student')).length -
      initData.filter((i) => i.roleName === 'staff').length,
  };
  return (
    <PageContainer>
      <div style={{ marginBottom: 10 }}>
        <Row gutter={24}>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="总用户数"
                value={peopleData.sum}
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
                value={peopleData.staff}
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
                value={peopleData.student}
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
                value={peopleData.other}
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
        dataSource={tableData}
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
        destroyOnClose={true}
        title="新增用户"
        width="500px"
        visible={addModalVisible}
        onVisibleChange={setAddVisible}
        form={form}
        onFinish={async (value) => {
          value.roleId = value.roleId.value;
          value.email = value.email + emailSuffix;
          await handleAdd(value);
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
          <>
            <ProFormText
              name="idnumber"
              label="学号"
              width={350}
              required={true}
              placeholder="请输入学号"
              onChange={onEmailChange}
            />
            <ProFormText
              name="email"
              label="邮箱"
              initialValue={emailData}
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
          </>
        )}
      </ModalForm>
      <ModalForm
        destroyOnClose={true}
        title="编辑用户"
        width="500px"
        visible={editModalVisible}
        onVisibleChange={setEditVisible}
        onFinish={async (value) => {
          console.log(fileList);

          if (fileList.length !== 0) {
            const file = fileList[0];
            const formData = new FormData();
            formData.append('file', file as RcFile);
            const res = await updateAvatar(formData);
            if (res.code === 20000 && res.data !== null) {
              console.log(res.data);
            } else {
              message.error(res.message);
            }
          }
          // value.roleId = value.roleId.value;
          // value.email = value.email + emailSuffix;
          // await handleAdd(value);
        }}
      >
        <Image src={currentRow?.avatar} width={100} style={{ marginBottom: 10 }} />
        <ProFormUploadButton
          name="avatar"
          title="更换头像"
          max={1}
          fieldProps={{
            fileList: fileList,
            beforeUpload: (file) => {
              setFileList([...fileList, file]);
              return false;
            },
            onRemove: (file) => {
              const index = fileList.indexOf(file);
              const newFileList = fileList.slice();
              newFileList.splice(index, 1);
              setFileList(newFileList);
            },
          }}
        />
        <ProFormSelect
          label="角色"
          name="roleId"
          request={getRoleData}
          initialValue={currentRow?.roleDescription}
          required={true}
          fieldProps={{
            showArrow: false,
            showSearch: true,
            // onChange: onRoleChange,
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
        <ProFormText
          initialValue={currentRow?.userName}
          name="userName"
          label="用户名称"
          width={350}
          required={true}
        />
        <ProFormText
          name="phoneNumber"
          initialValue={currentRow?.phoneNumber}
          label="联系方式"
          width={350}
          required={true}
          placeholder="请输入手机号"
        />
        <ProFormText
          name="department"
          initialValue={currentRow?.department}
          label="所属部门"
          width={350}
        />
        <ProFormText
          name="idnumber"
          initialValue={currentRow?.idnumber}
          label="学号/工号"
          width={350}
        />

        <ProFormText
          name="email"
          label="邮箱"
          initialValue={currentRow?.email}
          width={350}
          required={true}
          // fieldProps={{
          //   suffix: (
          //     <>
          //       <Divider type="vertical" style={{ height: 20 }} />
          //       <span>{emailSuffix}</span>
          //     </>
          //   ),
          // }}
        />
      </ModalForm>

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.userName && (
          <ProDescriptions<API.UserInfo>
            column={2}
            title={'用户详情'}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.phoneNumber,
            }}
            columns={detailColumns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default UserManage;
