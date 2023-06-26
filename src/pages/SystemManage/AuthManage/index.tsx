import { addRole, getRoleDetail, permissionList, roleList } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, Form, Input, message, Table } from 'antd';
import { useEffect, useState } from 'react';
const { Search } = Input;
const AuthManage: React.FC = () => {
  const [initRole, setInitRole] = useState<API.RoleSimple[]>([]);
  const [roleData, setRoleData] = useState<API.RoleSimple[]>([]);
  const [initPermission, setInitPermission] = useState<API.PermissionSimple[]>([]);
  const [permissionData, setPermissionData] = useState<API.PermissionSimple[]>([]);
  const [addModalVisible, setAddVisible] = useState<boolean>(false);
  const [editModalVisible, setEditVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.RoleSimple>();
  const [currentRoleDetail, setRoleDetail] = useState<API.RoleDetail>();
  const [selectedPermissionKeys, setSelectedPermissionKeys] = useState<React.Key[]>([]);
  const [editPermissionKeys, setEditPermissionKeys] = useState<React.Key[]>([]);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [form] = Form.useForm();
  useEffect(() => {
    roleList()
      .then((res) => {
        if (res.code === 20000 && res.data !== undefined) {
          setInitRole(res.data);
          setRoleData(res.data);
        }
      })
      .catch((e) => {
        message.error(e.message + ' 请刷新重试');
      });
  }, []);
  const getPermissionList = () => {
    permissionList()
      .then((res) => {
        if (res.code === 20000 && res.data !== undefined) {
          setInitPermission(res.data);
          setPermissionData(res.data);
        } else {
          message.error(res.message);
        }
      })
      .catch((e) => {
        message.error(e);
      });
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '角色描述',
      dataIndex: 'roleDescription',
      copyable: true,
      ellipsis: true,
    },

    {
      title: '操作',
      valueType: 'option',
      width: 200,
      key: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={async () => {
            getPermissionList();
            setCurrentRow(record);
            console.log(record);
            // setEditVisible(true);
            const roleDetail = await getRoleDetail(record.roleID);
            if (roleDetail.code === 20000 && roleDetail.data !== undefined) {
              setRoleDetail(roleDetail.data);
              const roleDetailPermissionList = roleDetail.data.permissionSimpleResListList.map(
                (p) => p.permissionID,
              );
              setEditPermissionKeys(roleDetailPermissionList);
              setEditVisible(true);
            } else {
              message.error(roleDetail.message);
              setEditVisible(false);
            }
          }}
        >
          编辑
        </a>,
        <a
          onClick={async () => {
            setCurrentRow(record);
            const roleDetail = await getRoleDetail(record.roleID);
            if (roleDetail.code === 20000 && roleDetail.data !== undefined) {
              setRoleDetail(roleDetail.data);
              setShowDetail(true);
            } else {
              message.error(roleDetail.message);
              setShowDetail(false);
            }
          }}
          key="view"
          style={{ display: showDetail ? 'none' : 'block' }}
        >
          查看详情
        </a>,
      ],
    },
  ];
  const permissionColumns = [
    // {
    //   title: '序号',
    //   dataIndex: 'permissionId',
    //   valueType: 'index',
    //   width: 48,
    // },
    {
      title: '权限名称',
      dataIndex: 'permissionName',
      ellipsis: true,
    },
    {
      title: '权限描述',
      dataIndex: 'permissionDescription',
      ellipsis: true,
    },
  ];
  const permissionRowSelection = {
    selectedRowKeys: selectedPermissionKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedPermissionKeys(selectedRowKeys);
    },
  };
  const roleDetailRowSelection = {
    selectedRowKeys: editPermissionKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setEditPermissionKeys(selectedRowKeys);
    },
  };
  const reload = () => {
    roleList()
      .then((res) => {
        if (res.code === 20000 && res.data !== undefined) {
          setInitRole(res.data);
          setRoleData(res.data);
        }
      })
      .catch((e) => {
        message.error(e.message + ' 请刷新重试');
      });
  };

  return (
    <PageContainer>
      <ProTable
        search={false}
        columns={columns}
        dataSource={roleData}
        toolbar={{
          search: {
            onSearch: (value: string) => {
              alert(value);
            },
          },
          actions: [
            <Button
              key="button"
              icon={<PlusOutlined />}
              onClick={() => {
                setAddVisible(true);
                getPermissionList();
                // actionRef.current?.reload();
              }}
              type="primary"
            >
              添加角色
            </Button>,
          ],
        }}
      />
      <ModalForm
        modalProps={{ destroyOnClose: true }}
        title="新增角色"
        width="500px"
        visible={addModalVisible}
        onVisibleChange={setAddVisible}
        form={form}
        onFinish={async (value) => {
          value.permissionIdList = selectedPermissionKeys;
          console.log(value);
          addRole(value)
            .then((res) => {
              if (res.code === 20000 && res.data !== undefined) {
                message.success('添加成功');
                setAddVisible(false);
              } else {
                message.error('添加失败');
              }
            })
            .catch((e) => {
              message.error(e);
            });
          reload();
        }}
      >
        <ProFormText name="roleName" label="角色名称" width={350} required={true} />
        <ProFormTextArea name="roleDescription" label="角色描述" width={350} />
        <div style={{ marginBottom: 10 }}>角色赋权</div>
        <Search
          placeholder="搜索权限"
          onSearch={(value) => {
            if (value === '') {
              setPermissionData(initPermission);
            } else {
              const filterPermission = initPermission.filter((permission) => {
                if (
                  permission.permissionName.includes(value) ||
                  permission.permissionDescription.includes(value)
                ) {
                  return true;
                } else {
                  return false;
                }
              });
              setPermissionData(filterPermission);
            }
          }}
        />
        <Table
          rowKey={(r) => r.permissionID}
          rowSelection={{
            type: 'checkbox',
            ...permissionRowSelection,
          }}
          columns={permissionColumns}
          dataSource={permissionData}
          pagination={{ pageSize: 5 }}
        />
      </ModalForm>
      <ModalForm
        modalProps={{ destroyOnClose: true }}
        // destroyOnClose={true}
        title="编辑角色"
        width="500px"
        visible={editModalVisible}
        onVisibleChange={setEditVisible}
        // form={form}
        onFinish={async (value) => {
          // value.permissionIdList = selectedPermissionKeys;
          // console.log(value);
          // addRole(value)
          //   .then((res) => {
          //     if (res.code === 20000 && res.data !== undefined) {
          //       message.success('添加成功');
          //       setAddVisible(false);
          //     } else {
          //       message.error('添加失败');
          //     }
          //   })
          //   .catch((e) => {
          //     message.error(e);
          //   });
          // reload();
          // value.roleId = value.roleId.value;
          // value.email = value.email + emailSuffix;
          // await handleAdd(value);
        }}
      >
        <ProFormText
          name="roleName"
          initialValue={currentRow?.roleName}
          label="角色名称"
          width={350}
          required={true}
        />
        <ProFormTextArea
          name="roleDescription"
          initialValue={currentRow?.roleDescription}
          label="角色描述"
          width={350}
        />
        <div style={{ marginBottom: 10 }}>角色赋权</div>
        <Search
          placeholder="搜索权限"
          onSearch={(value) => {
            const filterPermission = initPermission.filter((permission) => {
              if (
                permission.permissionName.includes(value) ||
                permission.permissionDescription.includes(value)
              ) {
                return true;
              } else {
                return false;
              }
            });
            setPermissionData(filterPermission);
          }}
        />
        <Table
          rowKey={(r) => r.permissionID}
          rowSelection={{
            type: 'checkbox',
            ...roleDetailRowSelection,
          }}
          columns={permissionColumns}
          dataSource={permissionData}
          pagination={{ pageSize: 5 }}
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
        {currentRow?.roleName && (
          <>
            <ProDescriptions<API.RoleDetail>
              column={2}
              title={'角色详情'}
              request={async () => ({
                data: currentRow || {},
              })}
              params={{
                id: currentRow?.roleID,
              }}
              columns={columns}
            />
            <div style={{ marginBottom: 10 }}>角色权限：</div>
            <Table
              rowKey={(r) => r.permissionID}
              // rowSelection={{
              //   type: 'checkbox',
              //   ...roleDetailRowSelection,
              // }}
              columns={permissionColumns}
              dataSource={currentRoleDetail?.permissionSimpleResListList}
              pagination={{ pageSize: 5 }}
            />
          </>
        )}
      </Drawer>
    </PageContainer>
  );
};
export default AuthManage;
