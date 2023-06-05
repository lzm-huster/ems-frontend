import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Upload, message } from 'antd';
import ProForm, {
  ProFormDependency,
  ProFormFieldSet,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { useModel, useRequest } from 'umi';

import styles from './BaseView.less';
import { updateInfo } from '@/services/swagger/person';

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }: { avatar: string }) => (
  <>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload showUploadList={false}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined />
          更换头像
        </Button>
      </div>
    </Upload>
  </>
);

const BaseView: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser, loading } = initialState;

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

  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={async (v) => {
                const roleId = 2;
                await updateInfo({
                  roleId: roleId,
                  ...v,
                }); // 新增
                message.success('修改成功');
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
            <AvatarView avatar={getAvatarURL()} />
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
