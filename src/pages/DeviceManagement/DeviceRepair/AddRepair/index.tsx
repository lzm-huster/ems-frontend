import { convertToSelectData } from '@/services/general/dataProcess';
import { getAssetNumber, getDeviceDetail } from '@/services/swagger/device';
import { insertRepair } from '@/services/swagger/repair';
import { formatDate } from '@/utils/utils';
import {
  PageContainer,
  ProForm,
  ProFormDateTimePicker,
  ProFormInstance,
  ProFormMoney,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Card, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'umi';

interface stateType {
  deviceID: number;
}

const AddRepair: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const [selectData, setSelectData] = useState([]);
  const [componentDisabled, setComponentDisabled] = useState<boolean>(false);
  const { state } = useLocation<stateType>();

  const initial = async () => {
    const res = await getAssetNumber();
    if (res.code === 20000) {
      console.log(res.data);
      setSelectData(convertToSelectData(res.data));
    }
    if (state != null) {
      const device = await getDeviceDetail({ DeviceID: state.deviceID });
      if (device.code === 20000) {
        formRef.current?.setFieldValue('deviceID', device.data.assetNumber);
        formRef.current?.setFieldValue('deviceName', device.data.deviceName);
      }
    }
  };
  useEffect(() => {
    initial();
  }, []);

  const onFinish = async (values: any) => {
    console.log(values);

    values.repairTime = formatDate(values.repairTime);
    const res = await insertRepair(values);
    if (res.code === 20000 && res.data === true) {
      message.success('提交成功');
      setComponentDisabled(true);
    } else {
      message.error(res.message);
    }
    console.log(values);
  };

  return (
    <PageContainer>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ProForm
            style={{ width: 600 }}
            formRef={formRef}
            disabled={componentDisabled}
            onFinish={onFinish}
          >
            <ProFormText
              label={'维修记录编号'}
              name={'repairID'}
              disabled={true}
              placeholder={'提交后自动生成'}
            />

            <ProFormSelect
              label={'设备编号'}
              name={'deviceID'}
              required
              options={selectData}
              fieldProps={{
                onChange: async (value) => {
                  const did = await getDeviceDetail({ DeviceID: value });
                  if (did.code === 20000) {
                    formRef?.current?.setFieldValue('deviceName', did.data['deviceName']);
                  }
                },
              }}
            />
            <ProFormText
              label={'设备名称'}
              name={'deviceName'}
              disabled={true}
              placeholder={'根据设备编号自动填写'}
              required
            />
            <ProFormText
              label={'维修内容'}
              name={'repairContent'}
              placeholder={'维修内容'}
              required
            />
            <ProFormMoney
              label={'维修费用'}
              name={'repairFee'}
              placeholder={'维修费用'}
              min={0}
              required
            />
            <ProFormDateTimePicker
              width={300}
              name="repairTime"
              fieldProps={{
                format: 'yyyy-MM-DD HH:mm:ss',
              }}
              label="维修时间"
              required
              initialValue={new Date()}
            />
            <ProFormTextArea name="remark" label="备注" placeholder="维修相关说明" />
          </ProForm>
        </div>
      </Card>
    </PageContainer>
  );
};
export default AddRepair;
