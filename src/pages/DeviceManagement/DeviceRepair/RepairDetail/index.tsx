import {
  PageContainer,
  ProForm,
  ProFormDateTimePicker,
  ProFormInstance,
  ProFormMoney,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Card } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'umi';
import { getRepairDetail } from '@/services/swagger/repair';
import { getAssetNumber, getDeviceDetail } from '@/services/swagger/device';
import { convertToSelectData } from '@/services/general/dataProcess';

interface stateType {
  repairID: number;
  deviceName: string;
  edit: boolean;
}

const RepairDetail: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const [repairRecord, setRepairRecord] = useState();
  const [isUneditable, setUneditable] = useState(true);
  const [selectData, setSelectData] = useState([]);
  const { state } = useLocation<stateType>();

  const initial = async () => {
    const res = await getRepairDetail({ repairID: state.repairID });
    if (res.code === 20000) {
      //res.data.repairTime = new Date(res.data.repairTime).toLocaleString();
      res.data.deviceName = state.deviceName;
      setRepairRecord(res.data);
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
            initialValues={repairRecord}
            formRef={formRef}
            disabled={isUneditable}
            submitter={{ render: isUneditable ? submitterEdit : submitterSubmit }}
            //resetter={{ render: resetterRender }}
            params={repairRecord}
            request={(params) => {
              return Promise.resolve({
                data: params,
                success: true,
              });
            }}
          >
            <ProFormText
              label={'维修记录编号'}
              name={'repairID'}
              disabled={true}
              placeholder={'提交后自动生成'}
            />
            <ProFormSelect
              label={'设备编号'}
              name={'assetNumber'}
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
            />
          </ProForm>
        </div>
      </Card>
    </PageContainer>
  );
};
export default RepairDetail;
