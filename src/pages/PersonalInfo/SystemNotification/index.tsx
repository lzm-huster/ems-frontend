import React from 'react';
import { Button, Col, Row, Space, Card, List } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import {
    AlertOutlined,
    ClockCircleFilled,
    CloudSyncOutlined,
    RightCircleOutlined,
    SnippetsOutlined,
} from '@ant-design/icons';

const notifications = [
    {
        id: 1,
        noticeInfo: 'This is the first notification.',
        taskName: '系统更新通知',
        taskDate: '2023-06-04T13:06:58.133Z',
    },
    {
        id: 2,
        noticeInfo: 'This is the first notification.',
        taskName: '借用到期提醒',
        taskDate: '2023-06-04T13:06:58.133Z',
    },
    {
        id: 3,
        noticeInfo: 'This is the first notification.',
        taskName: '采购审批通知',
        taskDate: '2023-06-04T13:06:58.133Z',
    },
    {
        id: 4,
        noticeInfo: 'This is the first notification.',
        taskName: '设备核查通知',
        taskDate: '2023-06-04T13:06:58.133Z',
    },
    {
        id: 5,
        noticeInfo: '你的采购审批通过啦，快去看看吧！',
        taskName: '采购审批通知',
        taskDate: '2023-06-04T13:06:58.133Z',
    },
];

const Notification: React.FC = () => {
    return (
        <PageContainer>
            <List
                itemLayout="vertical"
                dataSource={notifications}
                style={{ marginBottom: '0px' }}
                renderItem={(item) => (
                    <List.Item key={item.id}>
                        <Card style={{ width: '100%' }}>
                            <Row>
                                <Col span={1}>
                                    {item.taskName === '系统更新通知' && (
                                        <CloudSyncOutlined
                                            style={{
                                                color: '#0e700e',
                                                fontSize: '20px',
                                            }}
                                        />
                                    )}
                                    {item.taskName === '借用到期提醒' && (
                                        <ClockCircleFilled
                                            style={{
                                                color: '#007acc',
                                                fontSize: '20px',
                                            }}
                                        />
                                    )}
                                    {item.taskName === '设备核查通知' && (
                                        <AlertOutlined
                                            style={{
                                                color: '#ff0000',
                                                fontSize: '20px',
                                            }}
                                        />
                                    )}
                                    {item.taskName === '采购审批通知' && (
                                        <SnippetsOutlined
                                            style={{
                                                color: '#007acc',
                                                fontSize: '20px',
                                            }}
                                        />
                                    )}
                                </Col>
                                <Col
                                    span={8}
                                    style={{
                                        color: '#007acc',
                                        fontSize: '12px',
                                    }}
                                >
                                    {item.taskName}
                                </Col>
                                <Col span={8}>{item.taskDate}</Col>
                            </Row>
                            <Row>
                                <Col span={24}>{item.noticeInfo}</Col>
                            </Row>
                        </Card>
                    </List.Item>
                )}
            />
        </PageContainer>

    );
};

export default Notification;
