import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, Form, FormInstance, Input, Row, Space, Statistic } from 'antd';
import React, { useState, useEffect } from 'react';
import { getPurchaseApplySheetList } from '@/services/swagger/purchaseApp';
import { ColumnsType } from 'antd/lib/table';
import { Link } from 'umi';
import GeneralTable from '../DeviceList/generalTable/GeneralTable';

interface RepairRecord {
  key: React.Key;
  approveTutorName: string;
  deviceList: string;
  purchaseApplyDate: Date;
  purchaseApplySheetID: number;
  purchaseApplyState: string;
  userName: string;
}

const columns: ColumnsType<RepairRecord> = [
  {
    title: '采购申请编号',
    dataIndex: 'purchaseApplySheetID',
  },
  {
    title: '设备列表',
    dataIndex: 'deviceList',
  },
  {
    title: '申请人',
    dataIndex: 'userName',
  },
  {
    title: '责任导师',
    dataIndex: 'approveTutorName',
  },
  {
    title: '申请时间',
    dataIndex: 'purchaseApplyDate',
    sorter: (a, b) => {
      if (a.purchaseApplyDate.getTime() === null || b.purchaseApplyDate.getTime() === null) {
        return 0;
      } else {
        return a.purchaseApplyDate.getTime() - b.purchaseApplyDate.getTime();
      }
    },
  },
  {
    title: '申请状态',
    dataIndex: 'purchaseApplyState',
  },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Space size="middle">
        <a>详情</a>
        <a>修改</a>
        <a>删除</a>
      </Space>
    ),
  },
];

const { Search } = Input;

const PurchaseApp: React.FC = () => {
  const formRef = React.useRef<FormInstance>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [initPurchaseApply, setInitPurchaseApply] = useState([]);
  const [showPurchaseApply, setShowPurchaseApply] = useState([]);

  const initial = async () => {
    const res = await getPurchaseApplySheetList();
    if (res.code === 20000) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].key = i;
      }
      setInitPurchaseApply(res.data);
      setShowPurchaseApply(res.data);
    }
  };

  useEffect(() => {
    initial();
  }, []);

  const onSearch = (value: string) => {
    setShowPurchaseApply(
      showPurchaseApply.filter((item) => {
        return item['deviceName'] == (value as string);
      }),
    );
  };

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <PageContainer>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <GeneralTable
            rowSelection={rowSelection}
            datasource={showPurchaseApply}
            columns={columns}
          >
            <Button type="primary">
              <Link to={'/deviceManagement/repair/addRecord'}>新增采购申请</Link>
            </Button>
            <Button onClick={start} disabled={!hasSelected}>
              设备采购入库
            </Button>
            <Button danger onClick={start} disabled={!hasSelected}>
              批量撤销申请
            </Button>
            <span style={{ marginLeft: 8 }}>
              {hasSelected ? `已选择 ${selectedRowKeys.length} 项` : ''}
            </span>
            <Form layout={'inline'} ref={formRef} name="control-ref" style={{ maxWidth: 600 }}>
              <Form.Item name="search">
                <Search placeholder="请输入设备名称" onSearch={onSearch} style={{ width: 300 }} />
              </Form.Item>
              <Form.Item>
                <Button
                  type="text"
                  onClick={() => {
                    setShowPurchaseApply(initPurchaseApply);
                    formRef.current?.setFieldsValue({ search: '' });
                  }}
                >
                  重置
                </Button>
              </Form.Item>
            </Form>
          </GeneralTable>
        </Col>
      </Row>
    </PageContainer>
  );
};
export default PurchaseApp;
