import { convertToSelectData } from '@/services/general/dataProcess';
import { getCheckDetail, updateCheck } from '@/services/swagger/check';
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
import { Button, Card, Modal } from 'antd';
import { RcFile, UploadFile, UploadProps } from 'antd/lib/upload';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'umi';
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface stateType {
  checkID: number;
  deviceName: string;
  edit: boolean;
}
//使用钩子获取state

const DetailCheck: React.FC = () => {
  const formRef = useRef<ProFormInstance>();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [checkRecord, setCheckRecord] = useState();
  const [isUneditable, setUneditable] = useState(true);
  const [selectData, setSelectData] = useState([]);
  const { state } = useLocation<stateType>();
  const history = useHistory();

  const initial = async () => {
    const res = await getCheckDetail({ checkID: state.checkID });
    if (res.code === 20000) {
      //res.data.scrapTime = new Date(res.data.scrapTime).toLocaleString();
      res.data.deviceName = state.deviceName;
      const images = [];
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
      setCheckRecord(res.data);
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
      >
        删除
      </Button>,
      <Button
        onClick={() => {
          history.push('/deviceManagement/check');
        }}
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
          values.checkTime = formatDate(new Date(values.checkTime));
          // console.log(values);
          values.deviceID = props.form?.getFieldValue('deviceID');
          console.log(values);

          const res = await updateCheck(values);
          console.log(res);

          // if (res.code === 20000 && res.data === true) {
          //   message.success('修改成功');
          //   console.log(props);

          //   setUneditable(true);
          // } else {
          //   message.error(res.message);
          // }
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
          history.push('/deviceManagement/check');
        }}
      >
        返回
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
            initialValues={checkRecord}
            formRef={formRef}
            disabled={isUneditable}
            submitter={{ render: isUneditable ? submitterEdit : submitterSubmit }}
            params={checkRecord}
            request={(params) => {
              return Promise.resolve({
                data: params,
                success: true,
              });
            }}
          >
            <ProFormSelect
              label={'设备编号'}
              name={'assetNumber'}
              required
              options={selectData}
              fieldProps={{
                onChange: async (value) => {
                  const did = await getDeviceDetail({ DeviceID: value });
                  if (did.code === 20000) {
                    // const uName = await getUserDetail({ userId: did.data['userID'] });
                    // if (uName.code === 20000) {
                    //   formRef?.current?.setFieldValue('checker', uName.data['userName']);
                    // }
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
export default DetailCheck;
