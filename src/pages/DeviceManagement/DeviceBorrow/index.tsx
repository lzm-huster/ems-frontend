import {
  deleteBorrowRecord,
  getBorrowApplyRecordList,
  getBorrowDeviceNumber,
  getReturnDeviceNumber,
} from '@/services/swagger/borrow';
import { PageContainer, ProFormDateRangePicker } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  Form,
  FormInstance,
  Input,
  Popconfirm,
  Row,
  Space,
  Statistic,
  message,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Access, Link, useAccess } from 'umi';
import GeneralTable from '../DeviceList/generalTable/GeneralTable';
import { SearchOutlined } from '@ant-design/icons';

interface BorrowRecord {
  key: React.Key;
  approveTutorName: string;
  borrowApplyDate: string;
  borrowApplyID: number;
  borrowApplyState?: string;
  deviceList: string;
  userName: string;
}

const rowCombination = (initData: BorrowRecord[]) => {
  const temptData: BorrowRecord[] = [];
  for (let i = 0, j = 0; i < initData.length; i++) {
    if (i > 0) {
      if (initData[i].borrowApplyID == initData[i - 1].borrowApplyID) {
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
  console.log(temptData);
  return temptData;
};

const Borrow: React.FC = () => {
  const formRef = React.useRef<FormInstance>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [returnable, setReturnable] = useState(true);
  const [cancel, setCancel] = useState(true);
  const [initBorrow, setInitBorrow] = useState<BorrowRecord[]>([]);
  const [showBorrow, setShowBorrow] = useState<BorrowRecord[]>([]);
  const [borrowNum, setBorrowNum] = useState(0);
  const [returnNum, setReturnNum] = useState(0);
  const access = useAccess();
  const initial = async () => {
    const res1 = await getBorrowApplyRecordList();
    const res2 = await getBorrowDeviceNumber();
    const res3 = await getReturnDeviceNumber();
    if (res1.code === 20000) {
      for (let i = 0; i < res1.data.length; i++) {
        res1.data[i].borrowApplyDate = new Date(res1.data[i].borrowApplyDate).toLocaleString();
      }
      setInitBorrow(JSON.parse(JSON.stringify(rowCombination(res1.data))));
      setShowBorrow(JSON.parse(JSON.stringify(rowCombination(res1.data))));
    }
    if (res2.code === 20000) {
      setBorrowNum(res2.data);
    }
    if (res3.code === 20000) {
      setReturnNum(res3.data);
    }
  };
  useEffect(() => {
    initial();
  }, []);

  const onSearch = (name?: string, sTime?: number, eTime?: number) => {
    if (sTime !== undefined && eTime !== undefined && name !== undefined)
      setShowBorrow(
        name === ''
          ? initBorrow
          : initBorrow.filter((item: BorrowRecord) => {
              const pTime = Date.parse(item['borrowApplyDate']);
              return item['deviceList'].indexOf(name) != -1 && pTime <= eTime && pTime >= sTime;
            }),
      );
    else if (name !== undefined)
      setShowBorrow(
        name === ''
          ? initBorrow
          : initBorrow.filter((item: BorrowRecord) => {
              return item['deviceList'].indexOf(name) != -1;
            }),
      );
    else if (sTime !== undefined && eTime !== undefined)
      setShowBorrow(
        name === ''
          ? initBorrow
          : initBorrow.filter((item: BorrowRecord) => {
              const pTime = Date.parse(item['borrowApplyDate']);
              return pTime <= eTime && pTime >= sTime;
            }),
      );
  };

  const start = () => {
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[], newSelectedRows: BorrowRecord[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setCancel(true);
    setReturnable(true);
    newSelectedRows.forEach((item) => {
      if (item.borrowApplyState !== '借用中') {
        setReturnable(false);
      }
      if (item.borrowApplyState !== '待导师审批' && item.borrowApplyState !== '待管理员审批') {
        setCancel(false);
      }
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const handleDelete = async (borrowApplyId: number) => {
    deleteBorrowRecord({ BorrowApplyID: borrowApplyId });
    const res1 = await getBorrowApplyRecordList();
    const res2 = await getBorrowDeviceNumber();

    if (res1.code === 20000) {
      for (let i = 0; i < res1.data.length; i++) {
        res1.data[i].borrowApplyDate = new Date(res1.data[i].borrowApplyDate).toLocaleString();
      }
      setInitBorrow(rowCombination(res1.data));
      setShowBorrow(rowCombination(res1.data));
    }
    if (res2.code === 20000) {
      setBorrowNum(res2.data);
    }
  };

  const handleMessDelete = () => {
    const selectedBorrowIds = selectedRowKeys
      .map((selectedKey: any) => {
        const selectedBorrow = initBorrow.find(
          (borrowItem: BorrowRecord) => borrowItem.key === selectedKey,
        );
        if (selectedBorrow && selectedBorrow.borrowApplyID) {
          return selectedBorrow.borrowApplyID;
        }
        return null;
      })
      .filter((borrowApplyID: any): borrowApplyID is number => borrowApplyID !== null);
    // 依次删除每个设备
    const deletePromises = selectedBorrowIds.map((borrowApplyID: any) =>
      deleteBorrowRecord({ BorrowApplyID: borrowApplyID }).then((res) => res.code === 20000),
    );

    // 等待所有删除请求完成后，更新表格数据和清空选中的行数据
    Promise.all(deletePromises).then(async (results) => {
      if (results.every((result: any) => result)) {
        const res1 = await getBorrowApplyRecordList();
        const res2 = await getBorrowDeviceNumber();

        if (res1.code === 20000) {
          for (let i = 0; i < res1.data.length; i++) {
            res1.data[i].borrowApplyDate = new Date(res1.data[i].borrowApplyDate).toLocaleString();
          }
          setInitBorrow(rowCombination(res1.data));
          setShowBorrow(rowCombination(res1.data));
        }
        if (res2.code === 20000) {
          setBorrowNum(res2.data);
        }
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
    });
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const columns: ColumnsType<BorrowRecord> = [
    {
      title: '借用申请编号',
      dataIndex: 'borrowApplyID',
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
        if (a.borrowApplyDate === null || b.borrowApplyDate === null) {
          return 0;
        } else {
          const aDate = Date.parse(a.borrowApplyDate);
          const bDate = Date.parse(b.borrowApplyDate);
          return aDate - bDate;
        }
      },
    },
    {
      title: '借用状态',
      dataIndex: 'borrowApplyState',
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
          text: '申请通过',
          value: '申请通过',
        },
        {
          text: '借用中',
          value: '借用中',
        },
        {
          text: '已归还',
          value: '已归还',
        },
        {
          text: '驳回',
          value: '驳回',
        },
      ],
      onFilter: (value: string, record) => {
        return record.borrowApplyState == value;
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
                pathname: '/deviceManagement/borrow/borrowApplyDetail',
                state: {
                  borrowApplyID: record.borrowApplyID,
                  userName: record.userName,
                  borrowApplyDate: record.borrowApplyDate,
                  borrowApplyState: record.borrowApplyState,
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
                pathname: '/deviceManagement/borrow/borrowApplyDetail',
                state: {
                  borrowApplyID: record.borrowApplyID,
                  userName: record.userName,
                  borrowApplyDate: record.borrowApplyDate,
                  borrowApplyState: record.borrowApplyState,
                  edit: true,
                },
              }}
            >
              编辑
            </Link>
          </a>
          {record.borrowApplyState === '借用中' ? (
            <a>归还</a>
          ) : (
            <a style={{ color: 'grey' }}>归还</a>
          )}
          {record.borrowApplyState === '待导师审批' ||
          record.borrowApplyState === '待管理员审批' ? (
            <Popconfirm
              title="确认撤销申请？"
              onConfirm={() => handleDelete(record.borrowApplySheetID)}
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
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="借用中设备"
              value={borrowNum}
              precision={0}
              valueStyle={{ color: '#5781CD', fontWeight: 'regular', fontSize: 40 }}
              suffix="台"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="已归还设备"
              value={returnNum}
              precision={0}
              valueStyle={{ color: '#27A77F', fontWeight: 'regular', fontSize: 40 }}
              suffix="台"
            />
          </Card>
        </Col>
        <Col span={24}>
          <GeneralTable rowSelection={rowSelection} datasource={showBorrow} columns={columns}>
            <Access accessible={access.deviceDeleteBtn('borrow:add')}>
              <Button type="primary">
                <Link to={'/deviceManagement/borrow/addBorrowApply'}>新增借用申请</Link>
              </Button>
            </Access>
            <Access accessible={access.borrowUpdateBtn('borrow:update')}>
              <Button onClick={start} disabled={hasSelected === false ? !hasSelected : !returnable}>
                批量归还设备
              </Button>
            </Access>
            <Access accessible={access.borrowDeleteBtn('borrow:delete')}>
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
                      setShowBorrow(initBorrow);
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
export default Borrow;
