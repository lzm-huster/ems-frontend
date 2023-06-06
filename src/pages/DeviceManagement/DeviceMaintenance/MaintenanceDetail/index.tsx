import {
  PageContainer,
  ProForm,
  ProFormDateTimePicker,
  ProFormMoney,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Card } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation } from 'umi';
import { getMaintenanceDetail } from '@/services/swagger/maintenance';

interface stateType {
  maintenanceID: number;
  deviceName: string;
  edit: boolean;
}

const RepairDetail: React.FC = () => {
  const [maintenanceRecord, setMaintenanceRecord] = useState();
  const [isUneditable, setUneditable] = useState(true);
  const { state } = useLocation<stateType>();

  const initial = async () => {
    const res = await getMaintenanceDetail({ maintenanceId: state.maintenanceID });
    if (res.code === 20000) {
      res.data.maintenanceTime = new Date(res.data.maintenanceTime).toLocaleString();
      res.data.deviceName = state.deviceName;
      setMaintenanceRecord(res.data);
      setUneditable(!state.edit);
    }
  };

  useEffect(() => {
    initial();
  }, []);

  const submitterEdit = () => {
    return [
      <Button key="submit" type="primary" onClick={() => setUneditable(false)} disabled={false}>
        修改
      </Button>,
    ];
  };

  const submitterSubmit = (props) => {
    return [
      <Button
        key="submit"
        type="primary"
        onClick={() => {
          props.form?.submit();
          setUneditable(true);
        }}
      >
        提交
      </Button>,
    ];
  };

  return (
    <PageContainer>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ProForm
            style={{ width: 600 }}
            initialValues={maintenanceRecord}
            disabled={isUneditable}
            submitter={{ render: isUneditable ? submitterEdit : submitterSubmit }}
            //resetter={{ render: resetterRender }}
            params={maintenanceRecord}
            request={(params) => {
              return Promise.resolve({
                data: params,
                success: true,
              });
            }}
          >
            <ProFormText
              label={'保养记录编号'}
              name={'maintenanceID'}
              disabled={true}
              placeholder={'提交后自动生成'}
            />
            <ProFormSelect label={'设备编号'} name={'deviceID'} required />
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
              name="maintenanceTime"
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
export default RepairDetail;
