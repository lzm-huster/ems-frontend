import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Space, Card, List } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import {
  AlertOutlined,
  CarryOutOutlined,
  ClockCircleFilled,
  CloudSyncOutlined,
  RightCircleOutlined,
  SnippetsOutlined,
} from '@ant-design/icons';
import { getNoticeDetail } from '@/services/swagger/notification';

const Notification: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [initNotice, setInitNotice] = useState<API.Notice>();

  const initial = async () => {
    const res = await getNoticeDetail();
    if (res.code === 20000) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].key = i;
        res.data[i].createTime = new Date(res.data[i].createTime).toLocaleString();
        res.data[i].updateTime = new Date(res.data[i].updateTime).toLocaleString();
      }
      setInitNotice(res.data);
    }
  };
  useEffect(() => {
    initial();
  }, []);

  console.log(initNotice);

  return (
    <PageContainer>
      <List
        itemLayout="vertical"
        dataSource={initNotice}
        style={{ marginBottom: '0px' }}
        renderItem={(item: any) => (
          <List.Item key={item.noticeId}>
            <Card style={{ width: '100%' }}>
              <Row>
                {/* 通知图标颜色 */}
                <Col span={1}>
                  {item.noticeInfo === '系统更新通知' && (
                    <CloudSyncOutlined
                      style={{
                        color: '#0e700e',
                        fontSize: '20px',
                      }}
                    />
                  )}
                  {item.noticeInfo === '借用到期提醒' && (
                    <CarryOutOutlined
                      style={{
                        color: '#007acc',
                        fontSize: '20px',
                      }}
                    />
                  )}
                  {item.noticeInfo === '设备核查通知' && (
                    <AlertOutlined
                      style={{
                        color: '#ff0000',
                        fontSize: '20px',
                      }}
                    />
                  )}
                  {item.noticeInfo === '采购审批通知' && (
                    <SnippetsOutlined
                      style={{
                        color: '#007acc',
                        fontSize: '20px',
                      }}
                    />
                  )}
                </Col>
                {/* 通知题目颜色 */}
                <Col
                  span={8}
                  style={{
                    color: '#007acc',
                    fontSize: '12px',
                  }}
                >
                  {item.noticeInfo}
                </Col>
                <Col span={8} offset={6}>
                  {item.updateTime}
                </Col>
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
