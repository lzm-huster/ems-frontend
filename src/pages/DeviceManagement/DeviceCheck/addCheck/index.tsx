import { convertToSelectData } from '@/services/general/dataProcess';
import { insertCheck } from '@/services/swagger/check';
import { getAssetNumber, getDeviceDetail } from '@/services/swagger/device';
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
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const AddCheck: React.FC = () => {
  const formRef = useRef<ProFormInstance>();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectData, setSelectData] = useState([]);
  const handleCancel = () => setPreviewOpen(false);

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
            onFinish={async (values) => {
              values.checkTime = formatDate(values.checkTime);
              const { checkImage, ...checkData } = values;
              const formData = new FormData();
              checkImage.forEach((file: { originFileObj: string | Blob }) => {
                formData.append('files', file.originFileObj);
              });
              // formData.append('device', JSON.stringify(deviceData));
              for (const key in checkData) {
                formData.append(key, checkData[key] == undefined ? '' : checkData[key]);
              }
              const res = await insertCheck(formData);
              if (res.code === 20000 && res.data === true) {
                message.success('添加核查记录成功');
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
                    const uName = await getUserDetail({ userId: did.data['userID'] });
                    if (uName.code === 20000) {
                      formRef?.current?.setFieldValue('checker', uName.data['userName']);
                    }
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
              label={'设备核查人'}
              name={'checker'}
              placeholder={'设备核查人姓名'}
              required
            />
            <ProFormSelect
              label={'设备状态'}
              name={'deviceState'}
              required
              options={['正常', '已报废', '丢失']}
            />
            <ProFormDateTimePicker
              width={300}
              name="checkTime"
              fieldProps={{
                format: 'yyyy-MM-DD HH:mm:ss',
              }}
              label="核查时间"
              required
              initialValue={new Date()}
            />
            <ProFormTextArea
              name="remark"
              label="备注"
              placeholder="核查详细说明"
              // fieldProps={inputTextAreaProps}
            />
            <>
              <ProFormUploadButton
                name="checkImage"
                label="核查图片"
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
export default AddCheck;
