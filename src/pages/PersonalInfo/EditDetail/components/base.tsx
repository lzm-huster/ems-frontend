import React, { useState } from 'react';
import { message } from 'antd';
import ProForm, { ProFormRadio, ProFormText } from '@ant-design/pro-form';
import { ProFormUploadButton } from '@ant-design/pro-components';
import { useModel } from 'umi';

import styles from './BaseView.less';
import { updateInfo } from '@/services/swagger/person';
import { UploadFile } from 'antd/es/upload/interface';
import { updateAvatar } from '@/services/ant-design-pro/api';
import { RcFile } from 'antd/lib/upload';

const roleMap = {
  sysAdmin: 1,
  deviceAdmin: 2,
  staff: 3,
  internalStudent: 4,
  externalStudent: 5,
};

const BaseView: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser, loading } = initialState;
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }
      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }
    return '';
  };

  const reloadDetail = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s: any) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={async (v) => {
                if (fileList.length !== 0) {
                  const file = fileList[0];
                  const formData = new FormData();
                  formData.append('file', file as RcFile);
                  const res1 = await updateAvatar(formData);
                  if (res1.code === 20000 && res1.data !== null) {
                    console.log(res1.data);
                    message.success('更新头像成功');
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    setFileList(newFileList);
                  } else {
                    message.error(res1.message);
                  }
                }
                const roleId = currentUser.roleList ? roleMap[currentUser.roleList] : 6;
                const res2 = await updateInfo({
                  roleId: roleId,
                  ...v,
                }); // 新增
                if (res2.code === 20000 && res2.data === true) {
                  message.success('更新用户信息成功');
                } else {
                  message.error(res2.message);
                }
                reloadDetail();
              }}
              submitter={{
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
                submitButtonProps: {
                  children: '更新基本信息',
                },
              }}
              initialValues={{
                ...currentUser,
              }}
              hideRequiredMark
            >
              <ProFormText
                width="md"
                name="userName"
                label="姓名"
                rules={[
                  {
                    required: true,
                    message: '请输入您的姓名!',
                  },
                ]}
              />
              <ProFormRadio.Group
                name="gender"
                layout="horizontal"
                label="性别"
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
                width="md"
                name="idnumber"
                label="学号/工号"
                rules={[
                  {
                    required: true,
                    message: '请输入您的学号/工号!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="phoneNumber"
                label="联系电话"
                rules={[
                  {
                    required: true,
                    message: '请输入您的联系电话!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="department"
                label="所属部门"
                rules={[
                  {
                    required: true,
                    message: '请输入您所属的部门!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="email"
                label="邮箱"
                rules={[
                  {
                    required: true,
                    message: '请输入您的邮箱!',
                  },
                ]}
              />
            </ProForm>
          </div>
          <div className={styles.right}>
            <div className={styles.avatar_title}>头像</div>
            <div className={styles.avatar}>
              <img src={getAvatarURL()} alt="avatar" />
            </div>
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
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
