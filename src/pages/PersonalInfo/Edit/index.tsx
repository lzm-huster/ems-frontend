import React, { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Radio,
  RadioChangeEvent,
  Select,
  Upload,
} from 'antd';
import type { FormInstance } from 'antd/es/form';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

/**
 * 主要组件
 * @returns
 */
const Edit: React.FC = () => {
  const formRef = React.useRef<FormInstance>(null);

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    formRef.current?.resetFields();
  };
  const [value, setValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  return (
    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Card title="查看资料" style={{ margin: '20px', width: (window.innerWidth - 500) / 2 }}>
        <div style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Descriptions title="User Info" bordered>
            <Descriptions.Item span={3}>
              <Avatar className="avatar" size={64} icon={<UserOutlined />} />
            </Descriptions.Item>
            {/* <div className="avatar-container">
              <Avatar className="avatar" size={64} icon={<UserOutlined />} />
              </div> */}
            <Descriptions.Item label="姓名">一颗糖果</Descriptions.Item>
            <Descriptions.Item label="账户" span={2}>
              T938278673
            </Descriptions.Item>
            <Descriptions.Item label="所属部门">教职工</Descriptions.Item>
            <Descriptions.Item label="性别" span={2}>
              <Badge status="processing" text="男" />
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">1735644876</Descriptions.Item>
            <Descriptions.Item label="邮箱" span={2}>
              371981764310@qq.com
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Card>
      <Card title="编辑资料" style={{ margin: '20px', width: (window.innerWidth - 200) / 2 }}>
        <div style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Form {...layout} ref={formRef} name="control-ref" onFinish={onFinish}>
            <Form.Item label="上传头像" valuePropName="fileList" getValueFromEvent={normFile}>
              <Upload action="/upload.do" listType="picture-card">
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
            <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
              <Input placeholder="请输入姓名" allowClear></Input>
            </Form.Item>
            <Form.Item name="sex" label="性别" rules={[{ required: true }]}>
              <Radio.Group onChange={onChange} value={value}>
                <Radio value={1}>男</Radio>
                <Radio value={2}>女</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="count" label="账户" rules={[{ required: true }]}>
              <Input placeholder="账户（手机号或工号）" allowClear></Input>
            </Form.Item>

            <Form.Item name="phone" label="联系电话" rules={[{ required: true }]}>
              <Input placeholder="请输入联系电话" allowClear></Input>
            </Form.Item>
            <Form.Item name="department" label="所属部门" rules={[{ required: true }]}>
              <Input placeholder="请输入所属部门" allowClear></Input>
            </Form.Item>
            <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
              <Input placeholder="请输入邮箱" allowClear></Input>
            </Form.Item>

            <Form.Item name="password" label="密码" rules={[{ required: true }]}>
              <Input placeholder="请输入密码" allowClear></Input>
            </Form.Item>
            <Form.Item name="passwordConfirm" label="确认密码" rules={[{ required: true }]}>
              <Input placeholder="请再次确认密码" allowClear></Input>
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button htmlType="button" onClick={onReset}>
                Reset
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </span>
  );
};

export default Edit;
