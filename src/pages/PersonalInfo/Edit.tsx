import React, { useState } from 'react';
import { Button, Form, Input, Radio, RadioChangeEvent } from 'antd';
import type { FormInstance } from 'antd/es/form';
//const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

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
    <Form
      {...layout}
      ref={formRef}
      name="control-ref"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
    >
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
  );
};

export default Edit;
