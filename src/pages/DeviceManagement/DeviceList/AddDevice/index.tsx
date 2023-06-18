import { convertToTreeData } from '@/services/general/dataProcess';
import { getDeviceCategoryList } from '@/services/swagger/category';
import { insertDevice } from '@/services/swagger/device';
import { formatDate } from '@/utils/utils';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import DateTimePicker from '@ant-design/pro-form/lib/components/DateTimePicker';
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
  Space,
  TreeSelect,
  Upload,
  UploadProps,
} from 'antd';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { useEffect, useState } from 'react';
import { useHistory, useModel } from 'umi';

//日期
dayjs.extend(customParseFormat);

//样式
// const layout = {
//   labelCol: { span: 4 },
//   wrapperCol: { span: 20 },
// };

const tailLayout = {
  wrapperCol: { offset: 0, span: 16 },
};

//上传照片
const props: UploadProps = {
  // beforeUpload: (file) => {
  //   const isPNG = file.type === 'image/png';
  //   if (!isPNG) {
  //     message.error(`${file.name} is not a png file`);
  //   }
  //   return isPNG || Upload.LIST_IGNORE;
  // },
  onChange: (info) => {
    console.log(info.fileList);
  },
};

//main
const AddDevice: React.FC = () => {
  const formRef = React.useRef<FormInstance>(null);
  const history = useHistory();
  const [componentDisabled, setComponentDisabled] = useState<boolean>(false);
  const [tree, setTree] = useState([]);
  const [uId, setUId] = useState<number>(0);
  const { initialState, setInitialState } = useModel('@@initialState');
  const deviceT: string[] = [];

  const initial = async () => {
    // console.log(initialState);
    formRef.current?.setFieldsValue({ userName: initialState?.currentUser?.userName });
    formRef.current?.setFieldsValue({ purchaseDate: new Date() });
    setUId(initialState?.currentUser?.userID);
    const category = await getDeviceCategoryList();
    if (category.code === 20000) {
      setTree(convertToTreeData(category.data));
    }
  };
  useEffect(() => {
    initial();
  }, []);

  const onFinish = (values: any) => {
    const pDate = formatDate(values.purchaseDate);
    const devices = values.devices;
    values.devices.forEach(async (device, ind: number) => {
      device.deviceType = deviceT[ind];
      device.purchaseDate = pDate;
      device.userID = uId;
      const { deviceImage, ...deviceData } = device;
      const fileList = deviceImage.fileList;
      console.log(deviceData);

      const formData = new FormData();
      // formData.append('file', fileList);
      fileList.forEach((file) => {
        formData.append('files', file.originFileObj);
      });
      // formData.append('device', JSON.stringify(deviceData));
      for (const key in deviceData) {
        formData.append(key, deviceData[key] == undefined ? '' : deviceData[key]);
      }
      const res = await insertDevice(formData);
      if (res.code === 20000 && res.data !== undefined) {
        message.success('添加成功');
        setComponentDisabled(true);
        history.push('/deviceManagement/list');
      } else {
        message.error(res.message);
      }
    });
  };

  const onReset = () => {
    formRef.current?.resetFields();
  };

  return (
    <PageContainer>
      <Form
        ref={formRef}
        name="control-ref"
        onFinish={onFinish}
        style={{ width: '100%' }}
        disabled={componentDisabled}
      >
        <Divider orientation="left" orientationMargin={5}>
          基本信息
        </Divider>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="userName" label="负责人" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="purchaseDate" label="购买时间" rules={[{ required: true }]}>
              <DateTimePicker />
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
                    style={{ width: '100%' }}
                    title={[
                      <MinusCircleOutlined style={{ color: 'red' }} onClick={() => remove(name)} />,
                      `  设备${key + 1}`,
                    ]}
                  >
                    <Row gutter={[16, 24]}>
                      <Col span={8}>
                        <Form.Item label="设备编号">
                          <Input placeholder="提交后自动生成" disabled />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'deviceName']}
                          rules={[{ required: true, message: '设备名称未填写' }]}
                          label="设备名称"
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
                        >
                          <TreeSelect
                            showSearch
                            placeholder="设备类型"
                            treeData={tree}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            allowClear
                            treeDefaultExpandAll
                            onSelect={(value, node) => {
                              const { devices } = formRef?.current?.getFieldsValue();
                              console.log(devices);
                              Object.assign(devices[key], { assetNumber: value });
                              console.log(devices);
                              deviceT.push(node['title']);
                              formRef?.current?.setFieldsValue({ devices });
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'deviceModel']}
                          rules={[{ required: true, message: '设备参数未填写！' }]}
                          label="设备参数"
                        >
                          <Input placeholder="设备参数" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...restField} name={[name, 'assetNumber']} label="资产编号">
                          <Input placeholder="资产编号" disabled />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'deviceSpecification']}
                          label="设备说明"
                        >
                          <Input placeholder="设备说明" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'unitPrice']}
                          rules={[{ required: true, message: '设备单价未填写！' }]}
                          label="设备单价"
                        >
                          <InputNumber<string>
                            min="0"
                            addonAfter={'￥'}
                            step="0.01"
                            placeholder="设备单价"
                            //stringMode
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'stockQuantity']}
                          rules={[{ required: true, message: '设备数量未填写！' }]}
                          label="设备数量"
                        >
                          <InputNumber min={1} placeholder="设备数量" />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'isPublic']}
                          rules={[{ required: true, message: '是否公用未选择！' }]}
                          label="是否公用"
                        >
                          <Radio.Group>
                            <Radio.Button value={1}>公用</Radio.Button>
                            <Radio.Button value={0}>私人</Radio.Button>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'borrowRate']}
                          rules={[{ required: false, message: '借用费率未填写！' }]}
                          label="借用费率"
                        >
                          <InputNumber disabled placeholder="借用费率" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'deviceImage']}
                          rules={[{ required: true, message: '设备图片未上传！' }]}
                          label="设备图片"
                        >
                          <Upload {...props}>
                            <Button icon={<UploadOutlined />}>上传图片</Button>
                          </Upload>
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
                  添加设备
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
