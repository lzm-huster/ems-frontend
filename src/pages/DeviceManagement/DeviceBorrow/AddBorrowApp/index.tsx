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
  Row,
  Select,
  Space,
} from 'antd';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { useEffect, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import DateTimeRangePicker from '@ant-design/pro-form/lib/components/DateTimeRangePicker';
import { getAssetNumber, getDeviceDetail } from '@/services/swagger/device';
import { convertToSelectData } from '@/services/general/dataProcess';

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
const AddDevice: React.FC = () => {
  const formRef = React.useRef<FormInstance>(null);

  const [selectData, setSelectData] = useState([]);
  const [componentDisabled, setComponentDisabled] = useState<boolean>(false);

  const initial = async () => {
    const res = await getUserInfo();
    const assets = await getAssetNumber();
    if (res.code === 20000) {
      formRef.current?.setFieldsValue({ userName: res.data.userName });
      formRef.current?.setFieldsValue({ purchaseDate: dayjs(now, dateFormat) });
    }
    if (assets.code === 20000) {
      setSelectData(convertToSelectData(assets.data));
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
            <Form.Item name="userName" label="申请人" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="borrowTime" label="借用时间" rules={[{ required: true }]}>
              <DateTimeRangePicker />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="approveTutorName" label="责任导师" rules={[{ required: true }]}>
              <Select placeholder="请选择导师" />
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
                        <Form.Item
                          name={[name, 'deviceID']}
                          label="设备编号"
                          labelCol={{ offset: 0, span: 4 }}
                        >
                          <Select
                            placeholder="设备编号"
                            options={selectData}
                            onChange={async (value) => {
                              const did = await getDeviceDetail({ DeviceID: value });
                              if (did.code === 20000) {
                                formRef?.current?.setFieldValue(
                                  'deviceName',
                                  did.data['deviceName'],
                                );
                                formRef?.current?.setFieldValue(
                                  'deviceModel',
                                  did.data['deviceModel'],
                                );
                                formRef?.current?.setFieldValue(
                                  'deviceType',
                                  did.data['deviceType'],
                                );
                              }
                            }}
                            // onSelect={(value, node) => {
                            //   const { devices } = formRef?.current?.getFieldsValue();
                            //   Object.assign(devices[key], { assetNumber: value });
                            //   deviceT.push(node['title']);
                            //   formRef?.current?.setFieldsValue({ devices });
                            // }}
                          />
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
                          <Input placeholder="根据设备编号自动填写" disabled />
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
                          <Select placeholder="根据设备编号自动填写" disabled />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'deviceModel']}
                          rules={[{ required: true, message: '设备参数未填写！' }]}
                          label="设备参数"
                          labelCol={{ span: 4 }}
                        >
                          <Input placeholder="根据设备编号自动填写" disabled />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'remark']}
                          label="借用说明"
                          labelCol={{ span: 4 }}
                        >
                          <Input placeholder="借用说明" />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, 'unitPrice']}
                          rules={[{ required: true, message: '设备单价未填写！' }]}
                          label="借用费用"
                          labelCol={{ span: 9 }}
                        >
                          <InputNumber<string>
                            min="0"
                            addonAfter={'￥'}
                            step="0.01"
                            placeholder="预期借用费用"
                            stringMode
                            disabled
                          />
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
                  添加借用设备
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

export default AddDevice;
