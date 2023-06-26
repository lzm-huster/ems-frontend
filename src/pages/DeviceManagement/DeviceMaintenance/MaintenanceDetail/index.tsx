import { convertToSelectData } from '@/services/general/dataProcess';
import { getAssetNumber, getDeviceDetail } from '@/services/swagger/device';
import { getMaintenanceDetail, updateMaintenance } from '@/services/swagger/maintenance';
import { formatDate } from '@/utils/utils';
import {
  PageContainer,
  ProForm,
  ProFormDateTimePicker,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Card, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'umi';

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
  const history = useHistory();

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

  const submitterEdit = (props: any) => {
    return [
      <Button key="submit" type="primary" onClick={() => setUneditable(false)} disabled={false}>
        修改
      </Button>,
      <Button
        type="ghost"
        onClick={() => {
          props.form?.resetFields();
        }}
        disabled={false}
      >
        删除
      </Button>,
      <Button
        onClick={() => {
          history.push('/deviceManagement/maintenance');
        }}
        disabled={false}
      >
        返回
      </Button>,
    ];
  };

  const submitterSubmit = (props: any) => {
    return [
      <Button
        key="submit"
        type="primary"
        onClick={async () => {
          const values = props.form?.getFieldsValue();
          values.maintenanceTime = formatDate(new Date(values.maintenanceTime));
          // console.log(values);
          values.deviceID = props.form?.getFieldValue('deviceID');
          const res = await updateMaintenance(values);

          if (res.code === 20000 && res.data === 1) {
            message.success('修改成功');
            setUneditable(true);
          } else {
            message.error(res.message);
          }
        }}
      >
        提交
      </Button>,
      // eslint-disable-next-line react/jsx-key
      <Button
        onClick={() => {
          props.form?.resetFields();
        }}
      >
        重置
      </Button>,
      // eslint-disable-next-line react/jsx-key
      <Button
        onClick={() => {
          history.push('/deviceManagement/maintenance');
        }}
      >
        返回
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
              name="deviceID"
              required
              options={selectData}
              fieldProps={{
                onChange: async (value) => {
                  const did = await getDeviceDetail({ DeviceID: value });
                  if (did.code === 20000) {
                    formRef?.current?.setFieldValue('deviceName', did.data.deviceName);
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
