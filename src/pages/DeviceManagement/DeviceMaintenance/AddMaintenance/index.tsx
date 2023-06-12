import { convertToSelectData } from '@/services/general/dataProcess';
import { getAssetNumber, getDeviceDetail } from '@/services/swagger/device';
import { insertMaintenance } from '@/services/swagger/maintenance';
import {
  PageContainer,
  ProForm,
  ProFormDateTimePicker,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Card, message } from 'antd';
import { useEffect, useRef, useState } from 'react';

const AddMaintenance: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const [selectData, setSelectData] = useState([]);
  const [componentDisabled, setComponentDisabled] = useState<boolean>(false);

  const initial = async () => {
    const res = await getAssetNumber();
    if (res.code === 20000) {
      console.log(res.data);
      setSelectData(convertToSelectData(res.data));
    }
  };
  useEffect(() => {
    initial();
  }, []);

  const onFinish = async (values: any) => {
    values.repairTime = Date.parse(values.repairTime).toLocaleString();
    values.repairID = 0;
    const res = await insertMaintenance(values);
    if (res.code === 20000) {
      message.success('提交成功');
      setComponentDisabled(true);
    }
    console.log(values);
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
              name={'deviceId'}
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
              label={'保养内容'}
              name={'maintenanceContent'}
              placeholder={'维修内容'}
              required
            />
            <ProFormDateTimePicker
              width={300}
              name="date"
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
