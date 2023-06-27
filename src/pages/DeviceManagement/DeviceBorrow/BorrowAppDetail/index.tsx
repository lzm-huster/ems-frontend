import { convertToSelectData } from '@/services/general/dataProcess';
import { getBorrowApplySheets } from '@/services/swagger/borrow';
import { getAssetNumber, getDeviceDetail } from '@/services/swagger/device';
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
  Steps,
} from 'antd';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { useEffect, useState } from 'react';
import { Access, useAccess, useHistory, useLocation, useModel } from 'umi';

//日期
dayjs.extend(customParseFormat);

interface stateType {
  borrowApplyID: number;
  userName: string;
  edit: boolean;
  borrowApplyState: string;
  borrowApplyDate: string;
}

//样式

// const tailLayout = {
//   wrapperCol: { offset: 0, span: 16 },
// };

//main
const BorrowDetail: React.FC = () => {
  const formRef = React.useRef<FormInstance>(null);

  const [selectData, setSelectData] = useState([]);
  const [componentDisabled, setComponentDisabled] = useState<boolean>(false);
  const [eDate, setEDate] = useState('');
  const [lDate, setLDate] = useState('');
  const [diff, setDiff] = useState(0);
  const [stateFlag, setState] = useState(0);
  const [uId, setUId] = useState<number>(0);
  const { initialState, setInitialState } = useModel('@@initialState');
  const { state } = useLocation<stateType>();
  const history = useHistory();
  const access = useAccess();

  const initial = async () => {
    const assets = await getAssetNumber();
    switch (state.borrowApplyState) {
      case '待导师审批':
        setState(1);
        break;
      case '待管理员审批':
        setState(2);
        break;
      case '申请通过':
      case '借用中':
        setState(3);
        break;
      case '已归还':
        setState(4);
        break;
      default:
        setState(0);
    }
    formRef.current?.setFieldsValue({ userName: initialState?.currentUser?.userName });
    setUId(initialState?.currentUser?.userID);
    // formRef.current?.setFieldsValue({ purchaseDate: dayjs(now, dateFormat) });
    if (assets.code === 20000) {
      setSelectData(convertToSelectData(assets.data));
    }
    if (state != null) {
      setComponentDisabled(!state.edit);
      formRef.current?.setFieldValue('borrowApplyID', state.borrowApplyID);
      formRef.current?.setFieldValue('userName', state.userName);
      formRef.current?.setFieldValue('borrowApplyDate', state.borrowApplyDate);

      const bApps = await getBorrowApplySheets({ BorrowApplyID: state.borrowApplyID });
      if (bApps.code === 20000 && bApps.data !== undefined) {
        const sheets = bApps.data;
        formRef.current?.setFieldValue('expectedReturnTime', sheets[0].expectedReturnTime);
        if (sheets[0].actualReturnTime !== undefined) {
          formRef.current?.setFieldValue('actualReturnTime', sheets[0].actualReturnTime);
        }
        sheets.forEach((sheet) => {
          const list = formRef.current?.getFieldValue('devices') || [];

          const nextList = list.concat({
            key: list.length,
            name: list.length,
            fieldKey: list.length,
            deviceID: sheet.deviceID,
            deviceName: sheet.deviceName,
            deviceType: sheet.deviceType,
            deviceModel: sheet.deviceModel,
            borrowFee: sheet.borrowFee,
          });
          formRef.current?.setFieldValue('devices', nextList);
        });
      }
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
      const applyRecord = { borrowerID: uId, applyDescription: '测试更新借用申请' };
      // const res = await insertBorrowApplyRecord(applyRecord);
      // if (res.code === 20000 && res.data !== 0) {
      //   const recordRes = await getLatestBorrowApplyRecordID();
      //   let flag = true;
      //   if (recordRes.code === 20000 && recordRes.data !== undefined) {
      //     const recordID = recordRes.data;
      //     devices.map((device: any) => {
      //       device.borrowApplyID = recordID;
      //       device.expectedReturnTime = lDate;
      //       insertBorrowApplySheet(device).then((sheetRes) => {
      //         if (sheetRes.code !== 20000 || sheetRes.data === undefined) {
      //           flag = false;
      //         }
      //       });
      //       if (flag) {
      //         message.success('添加借用申请成功');
      //         history.push('/deviceManagement/borrow');
      //       } else {
      //         message.error('添加借用申请失败');
      //       }
      //     });
      //   }
      // }
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
        <Card>
          <Steps
            current={stateFlag}
            items={[
              {
                title: '已提交',
              },
              {
                title: '导师审批',
              },
              {
                title: '管理员审批',
              },
              {
                title: '借用中',
              },
              {
                title: '已归还',
              },
            ]}
          />
        </Card>

        <Divider orientation="left" orientationMargin={5}>
          基本信息
        </Divider>
        <Card>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="borrowApplyID" label="申请编号" rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="userName" label="申请人" rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="borrowApplyDate" label="借用时间" rules={[{ required: true }]}>
                <DateTimePicker disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="expectedReturnTime"
                label="预期归还时间"
                rules={[{ required: true }]}
              >
                <DateTimePicker />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="actualReturnTime" label="实际归还时间" rules={[{ required: true }]}>
                <DateTimePicker placeholder={'暂未归还'} />
              </Form.Item>
            </Col>
            <Access accessible={access.isStudent()}>
              <Col span={8}>
                <Form.Item name="approveTutorName" label="责任导师" rules={[{ required: true }]}>
                  <Select placeholder="请选择导师" />
                </Form.Item>
              </Col>
            </Access>
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
                      // eslint-disable-next-line react/jsx-key
                      `设备${key + 1}`,
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
                      history.push('/deviceManagement/borrow');
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
                      history.push('/deviceManagement/borrow');
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

export default BorrowDetail;
