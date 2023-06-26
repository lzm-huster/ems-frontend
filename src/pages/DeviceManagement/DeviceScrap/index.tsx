import {
  deleteScrapRecord,
  getExpectedScrapNum,
  getScrapList,
  getScrapNum,
} from '@/services/swagger/scrap';
import {
  PageContainer,
  ProFormDateRangePicker,
  ProFormDateTimeRangePicker,
} from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  Form,
  FormInstance,
  Input,
  InputRef,
  Popconfirm,
  Row,
  Space,
  Statistic,
  message,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Access, Link, useAccess } from 'umi';
import GeneralTable from '../DeviceList/generalTable/GeneralTable';
import { SearchOutlined } from '@ant-design/icons';
import React from 'react';

export interface ScrapRecord {
  key: React.Key;
  deviceID: number;
  deviceName: string;
  assetNumber: string;
  scrapID: number;
  scrapPerson: string;
  scrapReason: string;
  scrapTime: string;
}

type DataIndex = keyof ScrapRecord;

const DeviceScrap: React.FC = () => {
  const [initTableData, setInitTableData] = useState<ScrapRecord[]>([]);
  const [tableData, setTableData] = useState<ScrapRecord[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentRow, setCurrentRow] = useState<ScrapRecord>();
  const [scrapNum, setScrapNum] = useState(0);
  const [expectedScrapNum, setExpectedScrapNum] = useState(0);
  const [loading, setLoading] = useState(false);
  const access = useAccess();
  const formRef = React.useRef<FormInstance>(null);

  const initial = async () => {
    const res = await getScrapList();
    if (res.code === 20000) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].key = i;
        res.data[i].scrapTime = new Date(res.data[i].scrapTime).toLocaleString();
      }
      setTableData(res.data);
      setInitTableData(res.data);
    }
    const scrapN = await getScrapNum();
    const eScrapN = await getExpectedScrapNum();
    if (scrapN.code === 20000 && scrapN.data !== undefined) {
      setScrapNum(scrapN.data);
    }
    if (eScrapN.code === 20000 && eScrapN.data !== undefined) {
      setScrapNum(eScrapN.data);
    }
  };

  useEffect(() => {
    initial();
  }, []);

  const onSearch = (name?: string, sTime?: number, eTime?: number) => {
    if (sTime !== undefined && eTime !== undefined && name !== undefined)
      setTableData(
        name === ''
          ? initTableData
          : initTableData.filter((item: ScrapRecord) => {
              const pTime = Date.parse(item['scrapTime']);
              return item['deviceName'].indexOf(name) != -1 && pTime <= eTime && pTime >= sTime;
            }),
      );
    else if (name !== undefined)
      setTableData(
        name === ''
          ? initTableData
          : initTableData.filter((item: ScrapRecord) => {
              return item['deviceName'].indexOf(name) != -1;
            }),
      );
    else if (sTime !== undefined && eTime !== undefined)
      setTableData(
        name === ''
          ? initTableData
          : initTableData.filter((item: ScrapRecord) => {
              const pTime = Date.parse(item['scrapTime']);
              return pTime <= eTime && pTime >= sTime;
            }),
      );
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

  const handleDelete = async (scrapId: number) => {
    deleteScrapRecord({ scrapID: scrapId });
    const res = await getScrapList();
    if (res.code === 20000) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].key = i;
        res.data[i].scrapTime = new Date(res.data[i].scrapTime).toLocaleString();
      }
      setTableData(res.data);
    }
  };

  /**
   * 批量删除
   */
  const handleMessDelete = () => {
    setLoading(true);

    const selectedDataIds = selectedRowKeys
      .map((selectedKey: any) => {
        const selectedData = tableData.find(
          (dataItem: ScrapRecord) => dataItem.key === selectedKey,
        );
        if (selectedData && selectedData.scrapID) {
          return selectedData.scrapID;
        }
        return null;
      })
      .filter((scrapID: any): scrapID is number => scrapID !== null);
    // 依次删除每个设备
    const deletePromises = selectedDataIds.map((scrapID: any) =>
      deleteScrapRecord({ scrapID: scrapID }).then((res) => res.code === 20000),
    );

    // 等待所有删除请求完成后，更新表格数据和清空选中的行数据
    Promise.all(deletePromises).then(async (results) => {
      if (results.every((result: any) => result)) {
        const res = await getScrapList();
        if (res.code === 20000) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].key = i;
            res.data[i].scrapTime = new Date(res.data[i].scrapTime).toLocaleString();
          }
          setTableData(res.data);
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

  const columns = [
    {
      title: '报废编号',
      dataIndex: 'scrapID',
    },
    {
      title: '设备编号',
      dataIndex: 'assetNumber',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      ellipsis: true,
    },
    {
      title: '设备负责人',
      dataIndex: 'scrapPerson',
      ellipsis: true,
    },
    {
      title: '报废时间',
      dataIndex: 'scrapTime',
      valueType: 'string',
      sorter: (a: ScrapRecord, b: ScrapRecord) => {
        if (a.scrapTime === null || b.scrapTime === null) {
          return 0;
        } else {
          const aDate = Date.parse(a.scrapTime);
          const bDate = Date.parse(b.scrapTime);
          return aDate - bDate;
        }
      },
      hideInSearch: true,
    },
    {
      title: '报废原因',
      dataIndex: 'scrapReason',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record: ScrapRecord, _, action) => {
        return (
          <Space size={'middle'}>
            <a key="editable">
              <Link
                to={{
                  pathname: '/deviceManagement/scrap/scrapDetail',
                  state: { scrapID: record.scrapID, deviceName: record.deviceName, edit: false },
                }}
              >
                详情
              </Link>
            </a>
            <Access accessible={access.scrapUpdateBtn('scrap:update')}>
              <a key="view">
                <Link
                  to={{
                    pathname: '/deviceManagement/scrap/scrapDetail',
                    state: { scrapID: record.scrapID, deviceName: record.deviceName, edit: true },
                  }}
                >
                  编辑
                </Link>
              </a>
            </Access>
            <Access accessible={access.scrapDeleteBtn('scrap:delete')}>
              <Popconfirm title="确认撤销？" onConfirm={() => handleDelete(record.scrapID)}>
                <a>撤销</a>
              </Popconfirm>
            </Access>
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <div style={{ marginBottom: 10 }}>
        <Row gutter={[16, 24]}>
          <Col span={12}>
            <Card bordered={false}>
              <Statistic
                title="已报废设备"
                value={scrapNum}
                precision={0}
                valueStyle={{ color: '#5781CD', fontWeight: 'bold', fontSize: 42 }}
                suffix="件"
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false}>
              <Statistic
                title="待报废设备"
                value={expectedScrapNum}
                precision={0}
                valueStyle={{ color: '#27A77F', fontWeight: 'bold', fontSize: 42 }}
                suffix="个"
              />
            </Card>
          </Col>
          <Col>
            <GeneralTable rowSelection={rowSelection} datasource={tableData} columns={columns}>
              <Access accessible={access.scrapAddBtn('scrap:add')}>
                <Button type="primary">
                  <Link to={'/deviceManagement/scrap/addScrap'}>新增报废记录</Link>
                </Button>
              </Access>
              <Access accessible={access.scrapDeleteBtn('scrap:delete')}>
                <Button danger onClick={handleMessDelete} disabled={!hasSelected}>
                  批量删除记录
                </Button>
              </Access>
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
                        setTableData(initTableData);
                        formRef.current?.setFieldsValue({ deviceNameS: '', timeRanges: [] });
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
      </div>
    </PageContainer>
  );
};
export default DeviceScrap;
