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
import { Button, Card, Modal, message } from 'antd';
import { RcFile, UploadFile, UploadProps } from 'antd/lib/upload';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'umi';
import { getScrapDetail, updateScrap } from '@/services/swagger/scrap';
import { convertToSelectData } from '@/services/general/dataProcess';
import { getAssetNumber, getDeviceDetail } from '@/services/swagger/device';
import { getUserDetail } from '@/services/swagger/user';
import { formatDate } from '@/utils/utils';

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
  const [selectData, setSelectData] = useState([]);
  const formRef = useRef<ProFormInstance>();

  const { state } = useLocation<stateType>();

  const initial = async () => {
    const res = await getScrapDetail({ scrapID: state.scrapID });
    if (res.code === 20000) {
      res.data.deviceName = state.deviceName;
      const images = [];
      res.data.scrapImages.forEach((image: any, ind: number) => {
        const node: any = {
          url: image,
          name: res.data.deviceName + ind,
          status: 'done',
          uid: ind,
        };
        images.push(node);
      });
      setFileList(images);
      setScrapRecord(res.data);
      setUneditable(!state.edit);
    }
    const assets = await getAssetNumber();
    if (res.code === 20000) {
      console.log(assets.data);
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
        onClick={async () => {
          const values = props.form?.getFieldsValue();
          const pDate = formatDate(new Date(values.scrapTime));
          values.scrapTime = pDate;

          // const { scrapImages, ...deviceData } = values;
          // const fileList1 = scrapImages;

          const formData = new FormData();
          // // formData.append('file', fileList);
          // fileList1.forEach((file) => {
          //   formData.append('files', file.originFileObj);
          // });
          // // formData.append('device', JSON.stringify(deviceData));
          // for (const key in deviceData) {
          //   formData.append(key, deviceData[key] == undefined ? '' : deviceData[key]);
          // }
          for (const key in values) {
            formData.append(key, values[key] == undefined ? '' : values[key]);
          }
          const res = await updateScrap(formData);
          if (res.code === 20000 && res.data !== undefined) {
            message.success('修改成功');
            setUneditable(true);
          } else {
            message.error(res.message);
          }
        }}
      >
        提交
      </Button>,
    ];
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
            formRef={formRef}
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
                      formRef?.current?.setFieldValue('scrapPerson', uName.data['userName']);
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
                name="scrapImages"
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
