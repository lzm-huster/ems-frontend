import { getPurchaseApplySheetList } from '@/services/swagger/purchaseApp';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Col, Form, FormInstance, Input, Row, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Access, Link, useAccess } from 'umi';
import GeneralTable from '../DeviceList/generalTable/GeneralTable';

interface PurchaseApply {
  key: React.Key;
  approveTutorName: string;
  deviceList: string;
  purchaseApplyDate: string;
  purchaseApplySheetID: number;
  purchaseApplyState: string;
  userName: string;
}

const rowCombination = (initData: PurchaseApply[]) => {
  const temptData: PurchaseApply[] = [];
  for (let i = 0, j = 0; i < initData.length; i++) {
    if (i > 0) {
      if (initData[i].purchaseApplySheetID == initData[i - 1].purchaseApplySheetID) {
        initData[i].key = j;
        temptData[j].deviceList = temptData[j].deviceList + ',' + initData[i].deviceList;
      } else {
        j++;
        initData[i].key = j;
        temptData.push(JSON.parse(JSON.stringify(initData[i])));
      }
    } else {
      initData[i].key = 0;
      temptData.push(JSON.parse(JSON.stringify(initData[i])));
    }
  }
  return temptData;
};

const columns: ColumnsType<PurchaseApply> = [
  {
    title: '采购申请编号',
    dataIndex: 'purchaseApplySheetID',
  },
  {
    title: '设备列表',
    dataIndex: 'deviceList',
    render: (record) => {
      const deviceLi: string[] = record.split(',');
      if (deviceLi.length < 2) return record;
      else {
        let dl: any = null;
        deviceLi.forEach((d: string, ind: number) => {
          if (ind == 0) {
            dl = d;
          } else {
            dl = (
              <span>
                {dl}
                <br></br>
                {d}
              </span>
            );
          }
        });
        return <div>{dl}</div>;
      }
    },
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
      if (a.purchaseApplyDate === null || b.purchaseApplyDate === null) {
        return 0;
      } else {
        const aDate = Date.parse(a.purchaseApplyDate);
        const bDate = Date.parse(b.purchaseApplyDate);
        return aDate - bDate;
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
    render: (record) => (
      <Space size="small">
        <a key="detail">
          <Link
            to={{
              pathname: '/deviceManagement/purchaseApply/purchaseApplyDetail',
              state: {
                purchaseApplySheetID: record.purchaseApplySheetID,
                userName: record.userName,
                edit: false,
              },
            }}
          >
            详情
          </Link>
        </a>
        <a>入库</a>
        <a key="edit">
          <Link
            to={{
              pathname: '/deviceManagement/purchaseApply/purchaseApplyDetail',
              state: {
                purchaseApplySheetID: record.purchaseApplySheetID,
                userName: record.userName,
                edit: true,
              },
            }}
          >
            编辑
          </Link>
        </a>
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
  const access = useAccess();
  const initial = async () => {
    const res = await getPurchaseApplySheetList();
    if (res.code === 20000) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].purchaseApplyDate = new Date(res.data[i].purchaseApplyDate).toLocaleString();
      }
      setInitPurchaseApply(JSON.parse(JSON.stringify(rowCombination(res.data))));
      setShowPurchaseApply(JSON.parse(JSON.stringify(rowCombination(res.data))));
    }
  };

  useEffect(() => {
    initial();
  }, []);

  const onSearch = (value: string) => {
    setShowPurchaseApply(
      value === ''
        ? initPurchaseApply
        : showPurchaseApply.filter((item: PurchaseApply) => {
            return item['deviceList'].indexOf(value) != -1;
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
            <Access accessible={access.purchaseAddBtn('purchase:add')}>
              <Button type="primary">
                <Link to={'/deviceManagement/purchaseApply/addPurchaseApply'}>新增采购申请</Link>
              </Button>
            </Access>
            <Access accessible={access.purchaseUpdateBtn('purchase:update')}>
              <Button onClick={start} disabled={!hasSelected}>
                设备采购入库
              </Button>
            </Access>

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
                    setShowPurchaseApply(JSON.parse(JSON.stringify(initPurchaseApply)));
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
