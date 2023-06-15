import {
  PageContainer,
  ProForm,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormInstance,
  ProFormMoney,
  ProFormRadio,
  ProFormText,
  ProFormTreeSelect,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { Button, Card, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'umi';
import { getAssetNumber, getDeviceDetail } from '@/services/swagger/device';
import { convertToSelectData } from '@/services/general/dataProcess';
import { RcFile, UploadFile, UploadProps } from 'antd/lib/upload';

interface stateType {
  deviceID: number;
  edit: boolean;
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const RepairDetail: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const [deviceDetail, setDeviceDetail] = useState();
  const [isUneditable, setUneditable] = useState(true);
  const [selectData, setSelectData] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { state } = useLocation<stateType>();

  const initial = async () => {
    const res = await getDeviceDetail({ DeviceID: state.deviceID });
    if (res.code === 20000) {
      setDeviceDetail(res.data);
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

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleCancel = () => setPreviewOpen(false);

  return (
    <PageContainer>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ProForm
            style={{ width: 600 }}
            initialValues={deviceDetail}
            formRef={formRef}
            disabled={isUneditable}
            submitter={{ render: isUneditable ? submitterEdit : submitterSubmit }}
            //resetter={{ render: resetterRender }}
            params={deviceDetail}
            request={(params) => {
              return Promise.resolve({
                data: params,
                success: true,
              });
            }}
          >
            <ProFormText
              label={'设备编号'}
              name={'assetNumber'}
              disabled
              //   fieldProps={{
              //     onChange: async (value) => {
              //       const did = await getDeviceDetail({ DeviceID: value });
              //       if (did.code === 20000) {
              //         formRef?.current?.setFieldValue('deviceName', did.data['deviceName']);
              //       }
              //     },
              //   }}
            />
            <ProFormText label={'设备名称'} name={'deviceName'} placeholder={'设备名称'} required />
            <ProFormTreeSelect
              name="deviceType"
              label="设备类型"
              placeholder="设备类型"
              allowClear
              request={async () => {
                return selectData;
              }}
              disabled
            />
            <ProFormText name="deviceModel" label="设备参数" placeholder="设备参数" />
            <ProFormMoney
              min="0"
              name="unitPrice"
              placeholder="设备单价"
              label="设备单价"
              //stringMode
            />

            <ProFormRadio.Group
              name="isPublic"
              label="是否公用"
              options={[
                {
                  label: '公用',
                  value: 1,
                },
                {
                  label: '私人',
                  value: 0,
                },
              ]}
            />
            <ProFormDigit name="borrowRate" label="借用费率" disabled placeholder="借用费率" />

            <>
              <ProFormUploadButton
                name="deviceImageList"
                label="设备图片"
                max={5}
                fieldProps={{
                  name: 'file',
                  listType: 'picture-card',
                  fileList: fileList,
                  onPreview: handlePreview,
                  onChange: handleChange,
                  multiple: true,
                  maxCount: 5,
                }}
              />
              <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </>
            <ProFormText name="deviceSpecification" label="设备说明" placeholder="设备说明" />
          </ProForm>
        </div>
      </Card>
    </PageContainer>
  );
};
export default RepairDetail;
