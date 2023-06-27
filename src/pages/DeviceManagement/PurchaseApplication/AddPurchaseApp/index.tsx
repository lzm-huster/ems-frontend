import { convertToTreeData } from '@/services/general/dataProcess';
import { getDeviceCategoryList } from '@/services/swagger/category';
import {
  getLatestPurchaseApplyRecordID,
  insertPurchaseApply,
  insertPurchaseApplySheet,
} from '@/services/swagger/purchaseApp';
import { formatDate } from '@/utils/utils';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
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
  Row,
  Select,
  Space,
  TreeSelect,
} from 'antd';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { useEffect, useState } from 'react';
import { Access, useAccess, useHistory, useModel } from 'umi';

//日期
dayjs.extend(customParseFormat);

const tailLayout = {
  wrapperCol: { offset: 0, span: 16 },
};

//main
const AddPurchaseApp: React.FC = () => {
  const formRef = React.useRef<FormInstance>(null);
  const [tree, setTree] = useState([]);
  const [uId, setUId] = useState<number>(0);
  const { initialState, setInitialState } = useModel('@@initialState');
  const history = useHistory();
  const deviceT: string[] = [];
  const access = useAccess();

  const initial = async () => {
    formRef.current?.setFieldsValue({ userName: initialState?.currentUser?.userName });
    formRef.current?.setFieldsValue({ purchaseApplyDate: formatDate(new Date()) });
    setUId(initialState?.currentUser?.userID);
    const category = await getDeviceCategoryList();
    if (category.code === 20000) {
      setTree(convertToTreeData(category.data));
    }
  };
  useEffect(() => {
    initial();
  }, []);

  const onFinish = async (values: any) => {
    console.log(values);
    if (!values.devices) {
      message.error('请添加设备');
    } else {
      const { devices } = values;
      const applyRecord = {
        purchaseApplicantID: uId,
        purchaseApplyDescription: values.remark,
        purchaseApplyDate: values.purchaseApplyDate,
      };
      const res = await insertPurchaseApplySheet(applyRecord);
      if (res.code === 20000 && res.data !== undefined) {
        const recordRes = await getLatestPurchaseApplyRecordID();
        let flag = true;
        if (recordRes.code === 20000 && recordRes.data !== undefined) {
          const recordID = recordRes.data;
          console.log(recordID);

          devices.map((device: any, ind: number) => {
            device.purchaseApplySheetID = recordID;
            // device.expectedReturnTime = lDate;
            device.deviceType = deviceT[ind];
            insertPurchaseApply(device).then((sheetRes) => {
              if (sheetRes.code !== 20000 || sheetRes.data === undefined) {
                flag = false;
              }
            });
            if (flag) {
              message.success('添加借用申请成功');
              history.push('/deviceManagement/purchaseApp');
            } else {
              message.error('添加借用申请失败');
            }
          });
        }
      }
    }

    // console.log(values);
  };

  const onReset = () => {
    formRef.current?.resetFields();
  };

  return (
    <PageContainer>
      <Form ref={formRef} name="control-ref" onFinish={onFinish} style={{ width: '100%' }}>
        <Divider orientation="left" orientationMargin={5}>
          基本信息
        </Divider>
        <Card>
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
            <Access accessible={access.isStudent()}>
              <Col span={8}>
                <Form.Item
                  name="approveTutorName"
                  label="责任导师"
                  rules={[{ required: true }]}
                  initialValue={1}
                >
                  <Select placeholder="学生请选择导师" />
                </Form.Item>
              </Col>
            </Access>

            <Col span={8}>
              <Form.Item name="purchaseApplyDate" label="申请时间" rules={[{ required: true }]}>
                <DateTimePicker />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="purchaseIllustration" label="采购说明" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Card>

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
                        <Form.Item
                          {...restField}
                          name={[name, 'purchaseBudget']}
                          rules={[{ required: true, message: '采购预算未填写！' }]}
                          label="采购预算"
                        >
                          <InputNumber<string>
                            min="0"
                            addonAfter={'￥'}
                            step="0.01"
                            placeholder="采购预算"
                            stringMode
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
