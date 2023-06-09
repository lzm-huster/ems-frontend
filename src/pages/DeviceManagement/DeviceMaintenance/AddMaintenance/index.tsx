import { convertToSelectData } from '@/services/general/dataProcess';
import { getAssetNumber, getDeviceDetail } from '@/services/swagger/device';
import { insertMaintenance } from '@/services/swagger/maintenance';
import { formatDate } from '@/utils/utils';
import {
  PageContainer,
  ProForm,
  ProFormDateTimePicker,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Card, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'umi';

interface stateType {
  deviceID: number;
}

const AddMaintenance: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const [selectData, setSelectData] = useState([]);
  const { state } = useLocation<stateType>();
  const history = useHistory();

  const initial = async () => {
    const res = await getAssetNumber();
    if (res.code === 20000) {
      console.log(res.data);
      setSelectData(convertToSelectData(res.data));
    }
    if (state != null) {
      const device = await getDeviceDetail({ DeviceID: state.deviceID });
      if (device.code === 20000) {
        formRef.current?.setFieldValue('deviceID', device.data.deviceID);
        formRef.current?.setFieldValue('deviceName', device.data.deviceName);
      }
    }
  };
  useEffect(() => {
    initial();
  }, []);

  const onFinish = async (values: any) => {
    console.log(values);

    values.maintenanceTime = formatDate(values.maintenanceTime);
    const res = await insertMaintenance(values);
    if (res.code === 20000 && res.data === true) {
      message.success('提交成功');
      history.push('/deviceManagement/maintenance');
    } else {
      message.error(res.message);
    }
  };

  return (
    <PageContainer>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ProForm style={{ width: 600 }} formRef={formRef} onFinish={onFinish}>
            <ProFormText
              label={'保养记录编号'}
              name={'maintenanceID'}
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
            <ProFormTextArea
              label={'保养内容'}
              name={'maintenanceContent'}
              placeholder={'保养内容'}
              required
            />
            <ProFormDateTimePicker
              width={300}
              name={'maintenanceTime'}
              fieldProps={{
                format: 'yyyy-MM-DD HH:mm:ss',
              }}
              label="保养时间"
              required
              initialValue={new Date()}
            />
          </ProForm>
        </div>
      </Card>
    </PageContainer>
  );
};
export default AddMaintenance;
