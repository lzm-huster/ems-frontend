import './index.less';
import React from 'react';
import { Space } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import Notification from './component/Notification';

const SystemNotification: React.FC = () => {
  return (
    <PageContainer>
      <Space.Compact direction="vertical" block>
        <Notification />
        <Notification />
        <Notification />
        <Notification />
        <Notification />
      </Space.Compact>
    </PageContainer>
  );
};

export default SystemNotification;
