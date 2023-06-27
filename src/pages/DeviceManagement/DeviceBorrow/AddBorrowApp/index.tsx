import { convertToSelectData, convertToSelectStaff } from '@/services/general/dataProcess';
import {
  getLatestBorrowApplyRecordID,
  insertBorrowApplyRecord,
  insertBorrowApplySheet,
} from '@/services/swagger/borrow';
import { getAssetNumber, getDeviceDetail } from '@/services/swagger/device';
import { getStaffList } from '@/services/swagger/user';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProFormDateRangePicker } from '@ant-design/pro-components';
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
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Access, useAccess, useHistory, useLocation, useModel } from 'umi';

//日期
dayjs.extend(customParseFormat);

interface stateType {
  deviceID: string;
}

//样式

const tailLayout = {
  wrapperCol: { offset: 0, span: 16 },
};

//main
const AddBorrow: React.FC = () => {
  const formRef = React.useRef<FormInstance>(null);

  const [selectData, setSelectData] = useState([]);
  const [componentDisabled, setComponentDisabled] = useState<boolean>(false);
  const [eDate, setEDate] = useState('');
  const [lDate, setLDate] = useState('');
  const [diff, setDiff] = useState(0);
  const [staffSelect, setSelectStaff] = useState([]);
  const [uId, setUId] = useState<number>(0);
  const { initialState, setInitialState } = useModel('@@initialState');
  const { state } = useLocation<stateType>();
  const history = useHistory();
  const access = useAccess();

  const initial = async () => {
    const assets = await getAssetNumber();

    formRef.current?.setFieldsValue({ userName: initialState?.currentUser?.userName });
    setUId(initialState?.currentUser?.userID);
    // formRef.current?.setFieldsValue({ purchaseDate: dayjs(now, dateFormat) });
    if (assets.code === 20000) {
      setSelectData(convertToSelectData(assets.data));
    }
    const staff = await getStaffList();
    if (staff.code === 20000 && staff.data !== undefined) {
      setSelectStaff(convertToSelectStaff(staff.data));
    }
    if (state != null) {
      const deviceList = JSON.parse(state.deviceID);
      deviceList.forEach(async (deviceId: number) => {
        const device = await getDeviceDetail({ DeviceID: deviceId });
        if (device.code === 20000) {
          const list = formRef.current?.getFieldValue('devices') || [];
          const nextList = list.concat({
            key: list.length,
            name: list.length,
            fieldKey: list.length,
            deviceID: device.data.deviceID,
            deviceName: device.data.deviceName,
            deviceType: device.data.deviceType,
            deviceModel: device.data.deviceModel,
            borrowFee: device.data.borrowRate * device.data.unitPrice,
          });
          formRef.current?.setFieldValue('devices', nextList);
        }
      });
    }
  };
  useEffect(() => {
    initial();
  }, []);

  const onFinish = async (values: any) => {
    if (!values.devices) {
      message.error('请添加设备');
    } else {
      const { devices } = values;
      const applyRecord = { borrowerID: uId, applyDescription: '测试新增借用申请' };
      const res = await insertBorrowApplyRecord(applyRecord);
      if (res.code === 20000 && res.data !== 0) {
        const recordRes = await getLatestBorrowApplyRecordID();
        let flag = true;
        if (recordRes.code === 20000 && recordRes.data !== undefined) {
          const recordID = recordRes.data;
          devices.map((device: any) => {
            device.borrowApplyID = recordID;
            device.expectedReturnTime = lDate;
            insertBorrowApplySheet(device).then((sheetRes) => {
              if (sheetRes.code !== 20000 || sheetRes.data === undefined) {
                flag = false;
              }
            });
            if (flag) {
              message.success('添加借用申请成功');
              history.push('/deviceManagement/borrow');
            } else {
              message.error('添加借用申请失败');
            }
          });
        }
      }
    }
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
            <Form.Item name="userName" label="申请人" rules={[{ required: true }]}>
              <Input width={200} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="borrowTime" label="借用时间" rules={[{ required: true }]}>
              <ProFormDateRangePicker
                fieldProps={{
                  format: (value) => value.format('YYYY-MM-DD HH:mm:ss'),
                  onOk: (value: any) => {
                    console.log(value);
                  },
                  onChange: (dates, dateStrings: [string, string]) => {
                    setEDate(dateStrings[0]);
                    setLDate(dateStrings[1]);
                    setDiff(moment(dateStrings[1]).diff(dateStrings[0], 'day'));
                  },
                }}
              />
            </Form.Item>
          </Col>

          <Access accessible={access.isStudent()}>
            <Col span={8}>
              <Form.Item name="approveTutorName" label="责任导师" rules={[{ required: true }]}>
                <Select options={staffSelect} placeholder="学生请选择导师" />
              </Form.Item>
            </Col>
          </Access>
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
                      // eslint-disable-next-line react/jsx-key
                      <MinusCircleOutlined style={{ color: 'red' }} onClick={() => remove(name)} />,
                      `  设备${key + 1}`,
                    ]}
                  >
                    <Row gutter={[16, 12]}>
                      <Col span={8}>
                        <Form.Item name={[name, 'deviceID']} label="设备编号">
                          <Select
                            placeholder="设备编号"
                            options={selectData}
                            onSelect={async (value, node) => {
                              const did = await getDeviceDetail({ DeviceID: value });
                              const { devices } = formRef?.current?.getFieldsValue();
                              if (did.code === 20000) {
                                console.log(devices);
                                Object.assign(devices[key], {
                                  deviceName: did.data.deviceName,
                                  deviceModel: did.data.deviceModel,
                                  deviceType: did.data.deviceType,
                                  unitPrice: diff
                                    ? diff * did.data.unitPrice * did.data.borrowRate
                                    : 0,
                                });
                                // deviceT.push(node['title']);
                                formRef?.current?.setFieldsValue({
                                  devices,
                                });
                              } else {
                                message.error(did.message + '请刷新重试');
                              }
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'deviceName']}
                          rules={[{ required: true, message: '设备名称未填写' }]}
                          label="设备名称"
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
                        >
                          <Input placeholder="根据设备编号自动填写" disabled />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item {...restField} name={[name, 'remark']} label="借用说明">
                          <Input placeholder="借用说明" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'borrowFee']}
                          //rules={[{ required: true, message: '借用费用未填写！' }]}
                          label="借用费用"
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

export default AddBorrow;
