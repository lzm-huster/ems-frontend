import {
  PageContainer,
  ProForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Card } from 'antd';

const AddMaintenance: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ProForm style={{ width: 600 }}>
            <ProFormText
              label={'保养记录编号'}
              name={'maintenanceID'}
              disabled={true}
              placeholder={'提交后自动生成'}
            />
            <ProFormSelect label={'设备编号'} name={'deviceId'} required />
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
            />
          </ProForm>
        </div>
      </Card>
    </PageContainer>
  );
};
export default AddMaintenance;
