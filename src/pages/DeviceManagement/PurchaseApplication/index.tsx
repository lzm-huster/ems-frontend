import {
  deletePurchaseApplySheetByPurchaseApplySheetID,
  getPurchaseApplySheetList,
} from '@/services/swagger/purchaseApp';
import { PageContainer, ProFormDateRangePicker } from '@ant-design/pro-components';
import { Button, Col, Form, FormInstance, Input, Popconfirm, Row, Space, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Access, Link, useAccess } from 'umi';
import GeneralTable from '../DeviceList/generalTable/GeneralTable';
import { SearchOutlined } from '@ant-design/icons';

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

const PurchaseApp: React.FC = () => {
  const formRef = React.useRef<FormInstance>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  // const [purchased, setPurchased] = useState(true);
  const [cancel, setCancel] = useState(true);
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

  const onSearch = (name?: string, sTime?: number, eTime?: number) => {
    if (sTime !== undefined && eTime !== undefined && name !== undefined)
      setShowPurchaseApply(
        name === ''
          ? initPurchaseApply
          : initPurchaseApply.filter((item: PurchaseApply) => {
              const pTime = Date.parse(item['purchaseApplyDate']);
              return item['deviceList'].indexOf(name) != -1 && pTime <= eTime && pTime >= sTime;
            }),
      );
    else if (name !== undefined)
      setShowPurchaseApply(
        name === ''
          ? initPurchaseApply
          : initPurchaseApply.filter((item: PurchaseApply) => {
              return item['deviceList'].indexOf(name) != -1;
            }),
      );
    else if (sTime !== undefined && eTime !== undefined)
      setShowPurchaseApply(
        name === ''
          ? initPurchaseApply
          : initPurchaseApply.filter((item: PurchaseApply) => {
              const pTime = Date.parse(item['purchaseApplyDate']);
              return pTime <= eTime && pTime >= sTime;
            }),
      );
  };

  // const start = () => {
  //   setLoading(true);
  //   // ajax request after empty completing
  //   setTimeout(() => {
  //     setSelectedRowKeys([]);
  //     setLoading(false);
  //   }, 1000);
  // };

  /**
   *
   * @param purchaseApplySheetId 撤销/删除
   */
  const handleDelete = async (purchaseApplySheetId: number) => {
    deletePurchaseApplySheetByPurchaseApplySheetID({ PurchaseApplySheetID: purchaseApplySheetId });
    const res = await getPurchaseApplySheetList();
    if (res.code === 20000) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].key = i;
        res.data[i].purchaseApplyDate = new Date(res.data[i].purchaseApplyDate).toLocaleString();
      }
      setInitPurchaseApply(JSON.parse(JSON.stringify(rowCombination(res.data))));
      setShowPurchaseApply(JSON.parse(JSON.stringify(rowCombination(res.data))));
    }
  };

  /**
   * 批量删除
   */
  const handleMessDelete = () => {
    setLoading(true);
    const selectedDataIds = selectedRowKeys
      .map((selectedKey: any) => {
        const selectedData = showPurchaseApply.find(
          (dataItem: PurchaseApply) => dataItem.key === selectedKey,
        );
        if (selectedData && selectedData.purchaseApplySheetID) {
          return selectedData.purchaseApplySheetID;
        }
        return null;
      })
      .filter(
        (purchaseApplySheetID: any): purchaseApplySheetID is number =>
          purchaseApplySheetID !== null,
      );
    // console.log(selectedDataIds);
    // 依次删除每个设备
    const deletePromises = selectedDataIds.map((purchaseApplySheetID: any) =>
      deletePurchaseApplySheetByPurchaseApplySheetID({
        PurchaseApplySheetID: purchaseApplySheetID,
      }).then((res) => res.code === 20000),
    );
    // console.log(2);
    // 等待所有删除请求完成后，更新表格数据和清空选中的行数据
    Promise.all(deletePromises).then(async (results) => {
      if (results.every((result: any) => result)) {
        const res = await getPurchaseApplySheetList();
        if (res.code === 20000) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].key = i;
            res.data[i].purchaseApplyDate = new Date(
              res.data[i].purchaseApplyDate,
            ).toLocaleString();
          }
          setShowPurchaseApply(JSON.parse(JSON.stringify(rowCombination(res.data))));
        }
        message.success('撤销成功');
      } else {
        message.error('撤销失败');
      }
    });
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(true);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[], newSelectedRows: PurchaseApply[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setCancel(true);
    // setPurchased(true);
    newSelectedRows.forEach((item) => {
      // if (item.purchaseApplyState !== '采购中') {
      //   setPurchased(false);
      // }
      if (
        item.purchaseApplyState !== '待导师审批' &&
        item.purchaseApplyState !== '待管理员审批' &&
        item.purchaseApplyState !== '待领导审批'
      ) {
        setCancel(false);
      }
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

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
      filters: [
        {
          text: '待导师审批',
          value: '待导师审批',
        },
        {
          text: '待管理员审批',
          value: '待管理员审批',
        },
        {
          text: '待领导审批',
          value: '待领导审批',
        },
        {
          text: '采购中',
          value: '采购中',
        },
        {
          text: '已入库',
          value: '已入库',
        },
        {
          text: '驳回',
          value: '驳回',
        },
      ],
      onFilter: (value: string, record) => {
        return record.purchaseApplyState == value;
      },
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
                  purchaseApplyState: record.purchaseApplyState,
                  userName: record.userName,
                  edit: false,
                },
              }}
            >
              详情
            </Link>
          </a>
          <a key="edit">
            <Link
              to={{
                pathname: '/deviceManagement/purchaseApply/purchaseApplyDetail',
                state: {
                  purchaseApplySheetID: record.purchaseApplySheetID,
                  purchaseApplyState: record.purchaseApplyState,
                  userName: record.userName,
                  edit: true,
                },
              }}
            >
              编辑
            </Link>
          </a>
          {record.purchaseApplyState === '采购中' ? (
            <a>
              <Link
                to={{
                  pathname: '/deviceManagement/list/addDevice',
                  state: {
                    purchaseApplySheetID: record.purchaseApplySheetID,
                  },
                }}
              >
                入库
              </Link>
            </a>
          ) : (
            <a style={{ color: 'grey' }}>入库</a>
          )}
          {record.purchaseApplyState === '待导师审批' ||
          record.purchaseApplyState === '待管理员审批' ||
          record.purchaseApplyState === '待领导审批' ? (
            <Popconfirm
              title="确认撤销申请？"
              onConfirm={() => handleDelete(record.purchaseApplySheetID)}
            >
              <a>撤销</a>
            </Popconfirm>
          ) : (
            <a style={{ color: 'grey' }}>撤销</a>
          )}
        </Space>
      ),
    },
  ];

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
            {/* <Access accessible={access.purchaseUpdateBtn('purchase:update')}>
              <Button onClick={start} disabled={hasSelected === false ? !hasSelected : !purchased}>
                设备采购入库
              </Button>
            </Access> */}

            <Access accessible={access.purchaseDeleteBtn('purchase:delete')}>
              <Button
                danger
                onClick={handleMessDelete}
                disabled={hasSelected === false ? !hasSelected : !cancel}
              >
                批量撤销申请
              </Button>
            </Access>
            <span style={{ marginLeft: 8 }}>
              {hasSelected ? `已选择 ${selectedRowKeys.length} 项` : ''}
            </span>
            <div style={{ position: 'absolute', right: 0, top: 0 }}>
              <Form layout={'inline'} ref={formRef} name="control-ref" style={{ maxWidth: 1000 }}>
                <Form.Item name="deviceNameS">
                  <Input placeholder="请输入设备名称" style={{ width: 150 }} />
                </Form.Item>
                <Form.Item name="timeRangeS">
                  <ProFormDateRangePicker style={{ width: 200 }} />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    onClick={() => {
                      const time = formRef.current?.getFieldValue('timeRangeS');
                      if (time !== undefined)
                        onSearch(
                          formRef.current?.getFieldValue('deviceNameS'),
                          Date.parse(time[0]),
                          Date.parse(time[1]),
                        );
                      else onSearch(formRef.current?.getFieldValue('deviceNameS'));
                    }}
                  >
                    <SearchOutlined />
                    搜索
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="text"
                    onClick={() => {
                      setShowPurchaseApply(initPurchaseApply);
                      formRef.current?.setFieldsValue({ deviceNameS: '', timeRangeS: [] });
                    }}
                  >
                    重置
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </GeneralTable>
        </Col>
      </Row>
    </PageContainer>
  );
};
export default PurchaseApp;
