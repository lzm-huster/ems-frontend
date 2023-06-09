import {
  PageContainer,
  ProForm,
  ProFormDateTimePicker,
  ProFormDependency,
  ProFormInstance,
  ProFormMoney,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Card, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { getAssetNumber, getDeviceDetail } from '@/services/swagger/device';
import { convertToSelectData } from '@/services/general/dataProcess';

const AddRepair: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const [selectData, setSelectData] = useState([]);

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

  return (
    <PageContainer>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ProForm
            style={{ width: 600 }}
            formRef={formRef}
            onFinish={async (values: any) => {
              message.success('提交成功');
              // setComponentDisabled(true);
              console.log(values);
            }}
          >
            <ProFormText
              label={'维修记录编号'}
              name={'repairID'}
              disabled={true}
              placeholder={'提交后自动生成'}
            />
            <ProFormSelect label={'设备编号'} name={'deviceID'} required options={selectData} />
            <ProFormText
              label={'设备名称'}
              name={'deviceName'}
              disabled={true}
              placeholder={'根据设备编号自动填写'}
              required
            />
            {/* <ProFormDependency name={['deviceN']}>
              {async ({ 'deviceN' })=>{
                const id = formRef.current?.getFieldValue('deviceID')
                if (id === null){
                  return(<ProFormText
                    label={'设备名称'}
                    name={'deviceName'}
                    disabled={true}
                    placeholder={'根据设备编号自动填写'}
                    required
                  />)
                } 
                else{
                  const res = await getDeviceDetail({DeviceID: id})
                  if(res.code === 20000){
                    return(<ProFormText
                      label={'设备名称'}
                      name={'deviceName'}
                      disabled={true}
                      required
                      initialValue={res.data['deviceName']}
                    />)
                  }
                  else{
                    message.error('');
                    return(null)
                  }
                }
                
                
                
                  
              }
              }
            </ProFormDependency> */}

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
          </ProForm>
        </div>
      </Card>
    </PageContainer>
  );
};
export default AddRepair;
