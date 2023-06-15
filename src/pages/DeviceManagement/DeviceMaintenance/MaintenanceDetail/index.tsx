import {
  PageContainer,
  ProForm,
  ProFormDateTimePicker,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Card } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'umi';
import { getMaintenanceDetail } from '@/services/swagger/maintenance';
import { convertToSelectData } from '@/services/general/dataProcess';
import { getAssetNumber, getDeviceDetail } from '@/services/swagger/device';

interface stateType {
  maintenanceID: number;
  deviceName: string;
  edit: boolean;
}

const RepairDetail: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const [selectData, setSelectData] = useState([]);
  const [maintenanceRecord, setMaintenanceRecord] = useState();
  const [isUneditable, setUneditable] = useState(true);
  const { state } = useLocation<stateType>();

  const initial = async () => {
    const res = await getMaintenanceDetail({ maintenanceId: state.maintenanceID });
    if (res.code === 20000) {
      res.data[0].deviceName = state.deviceName;
      setMaintenanceRecord(res.data[0]);
      setUneditable(!state.edit);
    }
    const assets = await getAssetNumber();
    if (res.code === 20000) {
      setSelectData(convertToSelectData(assets.data));
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
            formRef={formRef}
            disabled={isUneditable}
            submitter={{ render: isUneditable ? submitterEdit : submitterSubmit }}
            params={maintenanceRecord}
            request={(params) => {
              return Promise.resolve({
                data: params,
                success: true,
              });
            }}
          >
            <ProFormText label={'保养记录编号'} name="maintenanceID" disabled={true} />
            <ProFormSelect
              label={'设备编号'}
              name="assetNumber"
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
              placeholder={'保养内容'}
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
