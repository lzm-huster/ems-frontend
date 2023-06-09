import { convertToSelectData } from '@/services/general/dataProcess';
import { getAssetNumber, getDeviceDetail, updateDevice } from '@/services/swagger/device';
import { formatDate } from '@/utils/utils';
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
import { Button, Card, message, Modal } from 'antd';
import { RcFile, UploadFile, UploadProps } from 'antd/lib/upload';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'umi';

interface stateType {
  deviceID: number;
  userName: string;
  edit: boolean;
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const DeviceDetail: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const [deviceDetail, setDeviceDetail] = useState();
  const [isUneditable, setUneditable] = useState(true);
  const [selectData, setSelectData] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { state } = useLocation<stateType>();
  const history = useHistory();

  const initial = async () => {
    const res = await getDeviceDetail({ DeviceID: state.deviceID });
    if (res.code === 20000) {
      res.data.userName = state.userName;
      console.log(res);
      const images = fileList;
      if (res.data.deviceImageList !== 'null' && res.data.deviceImageList !== undefined) {
        const imageList = JSON.parse(res.data.deviceImageList);
        console.log(imageList);

        imageList.forEach((image: any, ind: number) => {
          const node: any = {
            url: image,
            name: res.data.deviceName + ind,
            status: 'done',
            uid: ind,
          };
          images.push(node);
        });
      }
      setFileList(images);
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

  const submitterEdit = (props: any) => {
    return [
      <Button key="edit" type="primary" onClick={() => setUneditable(false)} disabled={false}>
        修改
      </Button>,
      <Button
        danger
        onClick={() => {
          props.form?.resetFields();
        }}
        disabled={false}
      >
        删除
      </Button>,
      <Button
        onClick={() => {
          history.push('/deviceManagement/list');
        }}
        disabled={false}
      >
        返回
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
          console.log(values);
          const pDate = formatDate(new Date(values.purchaseDate));
          values.purchaseDate = pDate;
          const { deviceImageList, ...deviceData } = values;
          const fileList1 = deviceImageList.fileList;
          console.log(fileList1);

          const formData = new FormData();
          // formData.append('file', fileList);
          fileList1.forEach((file) => {
            formData.append('files', file.originFileObj);
          });
          // formData.append('device', JSON.stringify(deviceData));
          for (const key in deviceData) {
            formData.append(key, deviceData[key] == undefined ? '' : deviceData[key]);
          }
          const res = await updateDevice(formData);
          if (res.code === 20000 && res.data !== undefined) {
            message.success('修改成功');
            history.push('/deviceManagement/list');
          } else {
            message.error(res.message);
          }
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
            <ProFormText name="userName" label="设备负责人" placeholder="设备负责人" />
            <ProFormDateTimePicker name="purchaseDate" label="购买时间" placeholder="购买时间" />
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
            <ProFormText
              name="deviceSpecification"
              label="设备说明"
              placeholder="请填写生产厂家（及备注说明）"
              required
            />
          </ProForm>
        </div>
      </Card>
    </PageContainer>
  );
};
export default DeviceDetail;
