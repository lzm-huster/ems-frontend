import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Descriptions } from 'antd';



const DeviceDetail: React.FC = () => {

    const [detail, setDetail] = useState<any>({});

    return (
        <>
            <Descriptions
                title="设备详情"
                bordered
                // layout="vertical"
                labelStyle={{
                    backgroundColor: "#fdffff9e",
                }}
                style={{
                    paddingBottom: "10px",
                }}
                contentStyle={{
                    backgroundColor: '#fdffff9e'
                }}
            >
                <Descriptions.Item label="设备编号" span={1}>
                    {/* {detail?.u_name} */}

                    xxxxxx
                </Descriptions.Item>
                <Descriptions.Item label="设备名称" span={1}>
                    {/* {detail?.u_sex} */}
                    xxxxxx
                </Descriptions.Item>
                <Descriptions.Item label="设备型号" span={1}>
                    {/* {detail?.u_age} */}
                    xxxxxx
                </Descriptions.Item>
                <Descriptions.Item label="购买类型" span={1}>
                    {/* {detail?.u_first} */}
                    xxxxxx
                </Descriptions.Item>
                <Descriptions.Item label="设备状态" span={1}>
                    {/* {detail?.u_last} */}
                    xxxxxx
                </Descriptions.Item>
                <Descriptions.Item label="设备负责人" span={1}>
                    {/* {detail?.u_name} */}
                    xxxxxx
                </Descriptions.Item>
                <Descriptions.Item label="单价" span={1}>
                    {/* {detail?.u_sex} */}
                    xxxxxx
                </Descriptions.Item>
                <Descriptions.Item label="借用费率" span={1}>
                    {/* {detail?.u_age} */}
                    xxxxxx
                </Descriptions.Item>
                <Descriptions.Item label="购买日期" span={1}>
                    {/* {detail?.u_first} */}
                    xxxxxx
                </Descriptions.Item>
                <Descriptions.Item label="资产编号" span={1}>
                    {/* {detail?.u_last} */}
                    xxxxxx
                </Descriptions.Item>
                <Descriptions.Item label="预计报废时间" span={2}>
                    {/* {detail?.u_last} */}
                    xxxxxx
                </Descriptions.Item>
                <Descriptions.Item label="设备参数" span={3}>
                    {/* {detail?.u_name} */}

                </Descriptions.Item>
                <Descriptions.Item label="设备图片列表" span={3}>
                    {/* {detail?.u_sex} */}

                </Descriptions.Item>
            </Descriptions>
        </>


    );
};

export default DeviceDetail;