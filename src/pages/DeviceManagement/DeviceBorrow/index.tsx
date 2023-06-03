import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, Form, FormInstance, Input, Row, Space, Statistic } from 'antd';
import React, { useState, useEffect } from 'react';
import { getBorrowApplyRecordList, getBorrowDeviceNumber } from '@/services/swagger/borrow';
import { ColumnsType } from 'antd/lib/table';
import { Link } from 'umi';
import GeneralTable from '../DeviceList/generalTable/GeneralTable';

interface BorrowRecord {
  key: React.Key;
  approveTutorName: string;
  borrowApplyDate: Date;
  borrowApplyID: number;
  borrowApplyState: string;
  deviceList: string;
  userName: string;
}

const columns: ColumnsType<BorrowRecord> = [
  {
    title: '借用申请编号',
    dataIndex: 'borrowApplyID',
  },
  {
    title: '设备列表',
    dataIndex: 'deviceList',
  },
  {
    title: '借用人',
    dataIndex: 'userName',
  },
  {
    title: '责任导师',
    dataIndex: 'approveTutorName',
  },
  {
    title: '借用时间',
    dataIndex: 'borrowApplyDate',
    sorter: (a, b) => {
      if (a.borrowApplyDate.getTime() === null || b.borrowApplyDate.getTime() === null) {
        return 0;
      } else {
        return a.borrowApplyDate.getTime() - b.borrowApplyDate.getTime();
      }
    },
  },
  {
    title: '借用状态',
    dataIndex: 'borrowApplyState',
  },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Space size="middle">
        <a>详情</a>
        <a>归还</a>
        <a>修改</a>
        <a>删除</a>
      </Space>
    ),
  },
];

const { Search } = Input;

const Borrow: React.FC = () => {
  const formRef = React.useRef<FormInstance>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [initBorrow, setInitBorrow] = useState([]);
  const [showBorrow, setShowBorrow] = useState([]);
  const [borrowNum, setBorrowNum] = useState(0);

  const initial = async () => {
    const res1 = await getBorrowApplyRecordList();
    const res2 = await getBorrowDeviceNumber();

    if (res1.code === 20000) {
      for (let i = 0; i < res1.data.length; i++) {
        res1.data[i].key = i;
      }
      setInitBorrow(res1.data);
      setShowBorrow(res1.data);
    }
    if (res2.code === 20000) {
      setBorrowNum(res2.data);
    }
  };
  useEffect(() => {
    initial();
  }, []);

  const onSearch = (value: string) => {
    setShowBorrow(
      showBorrow.filter((item) => {
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
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="借入设备"
              value={borrowNum}
              precision={0}
              valueStyle={{ color: '#5781CD', fontWeight: 'bold', fontSize: 42 }}
              suffix="台"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="借出设备"
              value={12}
              precision={0}
              valueStyle={{ color: '#27A77F', fontWeight: 'bold', fontSize: 42 }}
              suffix="台"
            />
          </Card>
        </Col>
        <Col span={24}>
          <GeneralTable rowSelection={rowSelection} datasource={showBorrow} columns={columns}>
            <Button type="primary">
              <Link to={'/deviceManagement/repair/addRecord'}>新增借用申请</Link>
            </Button>
            <Button onClick={start} disabled={!hasSelected}>
              批量归还设备
            </Button>
            <Button danger onClick={start} disabled={!hasSelected}>
              批量删除记录
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
                    setShowBorrow(initBorrow);
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
export default Borrow;
