/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, List, Row, Space, message } from 'antd';
import { useModel } from 'umi';
import { login } from '@/services/ant-design-pro/api';
import { values } from 'lodash';
import { updatePassword } from '@/services/swagger/person';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const SecurityView: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible]: [boolean, any] = useState(false);
  const [popover, setPopover]: [boolean, any] = useState(false);
  const confirmDirty = false;
  const [currentPassword, setCurrentPassword] = useState('');

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState;

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleSubmit = async (v: any) => {
    try {
      // 调用更新密码接口并传递新密码的值
      const res = await updatePassword({
        oldPass: v.oldPassword,
        newPass: v.newPassword,
        confirm: v.confirmPassword,
      });
      // 处理响应结果
      if (res.code === 20000) {
        message.success('修改密码成功');
      }
    } catch (error) {
      // 处理错误逻辑
      console.error('密码更新失败:', error);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    const regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/);
    const isMatched = regex.test(value); // inputString为要检查的字符串
    // 没有值的情况
    if (!value) {
      setVisible(!!value);
    }
    if (!isMatched) {
      setVisible(false);
      return promise.reject('密码必须包含数字和字母且长度处于6-20之间');
    }
    // 有值的情况
    if (!visible) {
      setVisible(!!value);
    }
    setPopover(!popover);
    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }
    return promise.resolve();
  };

  return (
    <>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        form={form}
        onFinish={async (v) => {
          await updatePassword({
            oldPass: v.oldPassword,
            newPass: v.newPassword,
            confirm: v.confirmPassword,
          });
          message.success('修改成功');
        }}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        initialValues={{
          ...currentUser,
        }}
      >
        <Form.Item
          name="oldPassword"
          label="原密码"
          rules={[{ required: true, message: '请输入原密码' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            {
              validator: checkPassword,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="确认密码"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '请确认新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('两次输入的密码不一致');
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Row>
            <Col span={4} offset={16}>
              <Button type="primary" htmlType="submit" loading={loading} onClick={handleSubmit}>
                提交
              </Button>
            </Col>
            <Col span={4}>
              <Button htmlType="button" onClick={onReset}>
                重置
              </Button>
            </Col>
          </Row>
        </Form.Item>
        {currentPassword && <p>当前用户密码：{currentPassword}</p>}
      </Form>
    </>
  );
};

export default SecurityView;
