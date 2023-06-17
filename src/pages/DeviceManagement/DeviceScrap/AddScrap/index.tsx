import { convertToSelectData } from '@/services/general/dataProcess';
import { getAssetNumber, getDeviceDetail } from '@/services/swagger/device';
import { insertScrap } from '@/services/swagger/scrap';
import { getUserDetail } from '@/services/swagger/user';
import { formatDate } from '@/utils/utils';
import {
  PageContainer,
  ProForm,
  ProFormDateTimePicker,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { Card, message, Modal } from 'antd';
import { RcFile, UploadFile, UploadProps } from 'antd/lib/upload';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'umi';

interface stateType {
  deviceID: number;
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const AddScrap: React.FC = () => {
  const formRef = useRef<ProFormInstance>();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectData, setSelectData] = useState([]);
  const { state } = useLocation<stateType>();

  const handleCancel = () => setPreviewOpen(false);

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
        const uName = await getUserDetail({ userId: device.data.userID });
        if (uName.code === 20000) {
          formRef?.current?.setFieldValue('scrapPerson', uName.data['userName']);
        }
      }
    }
  };
  useEffect(() => {
    initial();
  }, []);

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

  return (
    <PageContainer>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ProForm
            style={{ width: 600 }}
            formRef={formRef}
            // submitter={{
            //   onSubmit: () => {
            //     console.log(formRef.current?.getFieldsValue());
            //   },
            // }}
            onFinish={async (value) => {
              console.log(value);
              const formData = new FormData();
              value.scrapTime = formatDate(value.scrapTime);
              if (value.upload) {
                const { upload, ...scrapData } = value;

                upload.forEach((file: { originFileObj: string | Blob }) => {
                  formData.append('files', file.originFileObj);
                });
                // formData.append('device', JSON.stringify(deviceData));
                for (const key in scrapData) {
                  formData.append(key, scrapData[key] == undefined ? '' : scrapData[key]);
                }
              } else {
                // formData.append('device', JSON.stringify(deviceData));
                for (const key in value) {
                  if (value[key]) {
                    formData.append(key, value[key]);
                  }
                }
              }

              const res = await insertScrap(formData);
              if (res.code === 20000 && res.data === true) {
                message.success('添加报废记录成功');
              } else {
                message.error(res.message);
              }
            }}
          >
            <ProFormSelect
              label={'设备编号'}
              name={'deviceID'}
              required
              options={selectData}
              fieldProps={{
                onChange: async (value) => {
                  const did = await getDeviceDetail({ DeviceID: value });
                  if (did.code === 20000) {
                    const uName = await getUserDetail({ userId: did.data.userID });
                    if (uName.code === 20000) {
                      formRef?.current?.setFieldValue('scrapPerson', uName.data.userName);
                    }
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
              label={'设备负责人'}
              name={'scrapPerson'}
              disabled={true}
              placeholder={'根据设备编号自动填写'}
              required
            />

            <ProFormDateTimePicker
              width={300}
              name="scrapTime"
              fieldProps={{
                format: 'yyyy-MM-DD HH:mm:ss',
              }}
              label="报废时间"
              required
              initialValue={new Date()}
            />

            <ProFormTextArea name="scrapReason" label="报废原因" placeholder="报废原因说明" />
            <>
              <ProFormUploadButton
                name="upload"
                label="报废图片"
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
          </ProForm>
        </div>
      </Card>
    </PageContainer>
  );
};
export default AddScrap;
