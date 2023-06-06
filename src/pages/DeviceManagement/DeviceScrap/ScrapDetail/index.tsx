import {
  PageContainer,
  ProForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { Button, Card, Modal } from 'antd';
import { RcFile, UploadFile, UploadProps } from 'antd/lib/upload';
import { useEffect, useState } from 'react';
import { useLocation } from 'umi';
import { getScrapDetail } from '@/services/swagger/scrap';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface stateType {
  scrapID: number;
  deviceName: string;
  edit: boolean;
}

const DetailCheck: React.FC = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [scrapRecord, setScrapRecord] = useState();
  const [isUneditable, setUneditable] = useState(true);
  const { state } = useLocation<stateType>();

  const initial = async () => {
    const res = await getScrapDetail({ scrapID: state.scrapID });
    if (res.code === 20000) {
      res.data.scrapTime = new Date(res.data.scrapTime).toLocaleString();
      res.data.deviceName = state.deviceName;
      setScrapRecord(res.data);
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

  const resetterRender = () => {
    return [<Button key="reset">删除</Button>];
  };

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
          <ProForm
            style={{ width: 600 }}
            initialValues={scrapRecord}
            disabled={isUneditable}
            submitter={{ render: isUneditable ? submitterEdit : submitterSubmit }}
            //resetter={{ render: resetterRender }}
            params={scrapRecord}
            request={(params) => {
              return Promise.resolve({
                data: params,
                success: true,
              });
            }}
          >
            <ProFormSelect label={'设备编号'} name={'deviceID'} required />
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
            />

            <ProFormTextArea
              name="scrapReason"
              label="报废原因"
              placeholder="报废原因说明"
              // fieldProps={inputTextAreaProps}
            />
            <>
              <ProFormUploadButton
                name="scrapImage"
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
export default DetailCheck;
