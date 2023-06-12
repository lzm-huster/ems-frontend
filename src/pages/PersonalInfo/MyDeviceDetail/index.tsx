import React, { useEffect, useState } from 'react';
import { Button, Card, Descriptions} from 'antd';
import { getDeviceList } from '@/services/swagger/device';
import { useParams } from 'umi';
import ProForm, { ProFormDateTimePicker, ProFormSelect, ProFormText, ProFormTextArea, ProFormUploadButton } from '@ant-design/pro-form';

const MyDeviceDetail: React.FC = () => {
    const id:any = useParams(); // 获取路由参数 id
    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deviceRecord, setDeviceRecord] = useState();
    const [isUneditable, setUneditable] = useState(true);

    const submitterEdit = () => {
        return [
            <Button key="submit" type="primary" onClick={() => setUneditable(false)} disabled={false}>
                修改
            </Button>,
        ];
    };

    const submitterSubmit = (props:any) => {
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

    function findDeviceById(devices: any, id: any) {
        const device = devices.find((device: any) => device.id === id);
        return device || null;
    }

    useEffect(() => {
        async function fetchDevice() {
            try {
                const devices = await getDeviceList(); // 从后端获取设备列表
                const device = findDeviceById(devices, id); // 根据 id 查找设备
                setDevice(device);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
        fetchDevice();
    }, [id]);

    return (
            <Card>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <ProForm
                        style={{ width: 600 }}
                        initialValues={deviceRecord}
                        disabled={isUneditable}
                        submitter={{ render: isUneditable ? submitterEdit : submitterSubmit }}
                        params={deviceRecord}
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
                            name={'checker'}
                            disabled={true}
                            placeholder={'根据设备编号自动填写'}
                            required
                        />

                        <ProFormSelect label={'设备状态'} name={'deviceState'} required />
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
    );
};

export default MyDeviceDetail;