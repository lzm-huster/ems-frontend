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
  TreeSelect,
} from 'antd';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { useEffect, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import DateTimePicker from '@ant-design/pro-form/lib/components/DateTimePicker';
import { getDeviceCategoryList } from '@/services/swagger/category';
import { convertToTreeData } from '@/services/general/dataProcess';
import { useHistory, useLocation } from 'umi';
import { getPurchaseApplySheetByID, getPurchaseApplySheets } from '@/services/swagger/purchaseApp';

//日期
dayjs.extend(customParseFormat);

interface stateType {
  purchaseApplySheetID: number;
  edit: boolean;
  userName: string;
}

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
  const [tree, setTree] = useState([]);
  const { state } = useLocation<stateType>();
  const history = useHistory();

  const initial = async () => {
    setComponentDisabled(!state.edit);
    formRef.current?.setFieldsValue({ userName: state.userName });
    formRef.current?.setFieldsValue({ purchaseApplySheetID: state.purchaseApplySheetID });
    const detail = await getPurchaseApplySheetByID({
      PurchaseApplySheetID: state.purchaseApplySheetID,
    });
    if (detail.code === 20000 && detail.data !== undefined) {
      formRef.current?.setFieldsValue({ purchaseApplyDate: detail.data.purchaseApplyDate });
      formRef.current?.setFieldsValue({
        purchaseApplyDescription: detail.data.purchaseApplyDescription,
      });
    }
    const sheets = await getPurchaseApplySheets({
      PurchaseApplySheetID: state.purchaseApplySheetID,
    });

    if (sheets.code === 20000 && sheets.data !== undefined) {
      sheets.data.forEach((sheet) => {
        const list = formRef.current?.getFieldValue('devices') || [];

        const nextList = list.concat({
          key: list.length,
          name: list.length,
          fieldKey: list.length,
          deviceName: sheet.deviceName,
          deviceType: sheet.deviceType,
          deviceModel: sheet.deviceModel,
          purchaseBudget: sheet.purchaseBudget,
          deviceQuantity: sheet.deviceQuantity,
        });
        formRef.current?.setFieldValue('devices', nextList);
      });
    }
    const category = await getDeviceCategoryList();
    if (category.code === 20000) {
      setTree(convertToTreeData(category.data));
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
            <Form.Item name="purchaseApplySheetID" label="申请单编号">
              <Input placeholder="提交后自动生成" disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="userName" label="申请人" rules={[{ required: true }]}>
              <Input placeholder="申请人姓名" />
            </Form.Item>
          </Col>
          {/* <Col span={8}>
            <Form.Item name="approveTutorName" label="责任导师" rules={[{ required: true }]}>
              <Select placeholder="请选择导师" />
            </Form.Item>
          </Col> */}
          <Col span={8}>
            <Form.Item name="purchaseApplyDate" label="申请时间" rules={[{ required: true }]}>
              <DateTimePicker />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="purchaseApplyDescription"
              label="采购说明"
              rules={[{ required: true }]}
            >
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
                  <Card id="deviceCard" style={{ width: '100%' }} title={[`设备${key + 1}`]}>
                    <Row gutter={[16, 12]}>
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
                          name={[name, 'deviceQuantity']}
                          rules={[{ required: true, message: '采购数量未填写！' }]}
                          label="采购数量"
                        >
                          <InputNumber min={1} placeholder="采购数量" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Space>
              ))}
            </>
          )}
        </Form.List>
        {componentDisabled == true
          ? [
              <Form.Item key={'edit'}>
                <Space>
                  <Button
                    key="edit"
                    type="primary"
                    onClick={() => setComponentDisabled(false)}
                    disabled={false}
                  >
                    修改
                  </Button>
                  <Button
                    onClick={() => {
                      history.push('/deviceManagement/purchaseApply');
                    }}
                    disabled={false}
                  >
                    返回
                  </Button>
                </Space>
              </Form.Item>,
            ]
          : [
              <Form.Item key={'submission'}>
                <Space>
                  <Button type="primary" htmlType="submit" disabled={false}>
                    提交
                  </Button>
                  <Button htmlType="button" onClick={onReset} disabled={false}>
                    重置
                  </Button>
                  <Button
                    onClick={() => {
                      history.push('/deviceManagement/purchaseApply');
                    }}
                    disabled={false}
                  >
                    返回
                  </Button>
                </Space>
              </Form.Item>,
            ]}
      </Form>
    </PageContainer>
  );
};

export default AddPurchaseApp;
