import {
  PageContainer,
  ProForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { Card, Modal } from 'antd';
import { RcFile, UploadFile, UploadProps } from 'antd/lib/upload';
import { useState } from 'react';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const AddScrap: React.FC = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handleCancel = () => setPreviewOpen(false);

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
          <ProForm style={{ width: 600 }}>
            <ProFormSelect label={'设备编号'} name={'deviceId'} required />
            <ProFormText
              label={'设备名称'}
              name={'deviceName'}
              disabled={true}
              placeholder={'根据设备编号自动填写'}
              required
            />
            <ProFormText
              label={'设备负责人'}
              name={'responsibleUser'}
              disabled={true}
              placeholder={'根据设备编号自动填写'}
              required
            />

            <ProFormDateTimePicker
              width={300}
              name="date"
              fieldProps={{
                format: 'yyyy-MM-DD HH:mm:ss',
              }}
              label="报废时间"
              required
            />

            <ProFormTextArea
              name="reason"
              label="备注"
              placeholder="报废原因说明"
              // fieldProps={inputTextAreaProps}
            />
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
