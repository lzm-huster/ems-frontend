import { getUserInfo } from '@/services/swagger/user';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Space,
} from 'antd';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { useEffect, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import DateTimePicker from '@ant-design/pro-form/lib/components/DateTimePicker';

//日期
dayjs.extend(customParseFormat);

const dateFormat = 'YYYY/MM/DD';

//样式
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const tailLayout = {
  wrapperCol: { offset: 0, span: 16 },
};

const formatDate = (time: any) => {
  // 格式化日期，获取今天的日期
  const Dates = new Date(time);
  const year: number = Dates.getFullYear();
  const month: any =
    Dates.getMonth() + 1 < 10 ? '0' + (Dates.getMonth() + 1) : Dates.getMonth() + 1;
  const day: any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
  return year + '/' + month + '/' + day;
};

const now = formatDate(new Date().getTime());

//main
const AddPurchaseApp: React.FC = () => {
  const formRef = React.useRef<FormInstance>(null);

  const [componentDisabled, setComponentDisabled] = useState<boolean>(false);

  const initial = async () => {
    const res = await getUserInfo();
    if (res.code === 20000) {
      formRef.current?.setFieldsValue({ userName: res.data.userName });
      formRef.current?.setFieldsValue({ purchaseDate: dayjs(now, dateFormat) });
    }
  };
  useEffect(() => {
    initial();
  }, []);

  const onFinish = (values: any) => {
    message.success('提交成功');
    setComponentDisabled(true);
    console.log(values);
  };

  const onReset = () => {
    formRef.current?.resetFields();
  };

  return (
    <PageContainer>
      <Form
        {...layout}
        ref={formRef}
        name="control-ref"
        onFinish={onFinish}
        style={{ maxWidth: 1400 }}
        disabled={componentDisabled}
      >
        <Divider orientation="left" orientationMargin={5}>
          基本信息
        </Divider>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="purchaseApplyID" label="申请单编号">
              <Input placeholder="提交后自动生成" disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="userName" label="申请人" rules={[{ required: true }]}>
              <Input placeholder="申请人姓名" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="approveTutorName" label="责任导师" rules={[{ required: true }]}>
              <Select placeholder="请选择导师" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="purchaseDate" label="申请时间" rules={[{ required: true }]}>
              <DateTimePicker />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="purchaseIllustration" label="采购说明" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Divider orientation="left" orientationMargin={5}>
          设备详情
        </Divider>
        <Form.List name="devices">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  size={'small'}
                  style={{ display: 'flex', marginBottom: 8 }}
                  align="baseline"
                >
                  <Card
                    id="deviceCard"
                    style={{ width: 1400 }}
                    title={[
                      <MinusCircleOutlined style={{ color: 'red' }} onClick={() => remove(name)} />,
                      `  设备${key + 1}`,
                    ]}
                  >
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item label="设备编号" labelCol={{ offset: 0, span: 4 }}>
                          <Input placeholder="提交后自动生成" disabled />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'deviceName']}
                          rules={[{ required: true, message: '设备名称未填写' }]}
                          label="设备名称"
                          labelCol={{ span: 4 }}
                        >
                          <Input placeholder="设备名称" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'deviceType']}
                          rules={[{ required: true, message: '设备类型未填写' }]}
                          label="设备类型"
                          labelCol={{ span: 4 }}
                        >
                          <Select
                            placeholder="设备类型"
                            options={[
                              { value: 'jack', label: 'Jack' },
                              { value: 'lucy', label: 'Lucy' },
                              { value: 'Yiminghe', label: 'yiminghe' },
                              { value: 'disabled', label: 'Disabled', disabled: true },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'deviceModel']}
                          rules={[{ required: true, message: '设备参数未填写！' }]}
                          label="设备参数"
                          labelCol={{ span: 4 }}
                        >
                          <Input placeholder="设备参数" />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, 'unitPrice']}
                          rules={[{ required: true, message: '设备单价未填写！' }]}
                          label="设备单价"
                          labelCol={{ span: 9 }}
                        >
                          <InputNumber<string>
                            min="0"
                            addonAfter={'￥'}
                            step="0.01"
                            placeholder="设备单价"
                            stringMode
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, 'stockQuantity']}
                          rules={[{ required: true, message: '设备数量未填写！' }]}
                          label="设备数量"
                          labelCol={{ span: 11 }}
                        >
                          <InputNumber min={1} placeholder="设备数量" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'assetNum']}
                          rules={[{ required: true, message: '资产编号未填写！' }]}
                          label="资产编号"
                          labelCol={{ span: 4 }}
                        >
                          <Input placeholder="资产编号" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, 'borrowRate']}
                          rules={[{ required: false, message: '借用费率未填写！' }]}
                          label="借用费率"
                          labelCol={{ span: 9 }}
                        >
                          <InputNumber disabled placeholder="借用费率" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'deviceSpecification']}
                          label="设备说明"
                          labelCol={{ span: 4 }}
                        >
                          <Input placeholder="设备说明" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  icon={<PlusOutlined />}
                >
                  添加采购设备
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </PageContainer>
  );
};

export default AddPurchaseApp;