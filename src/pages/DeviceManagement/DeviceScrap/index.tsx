import { deleteScrapRecord, getScrapList } from '@/services/swagger/scrap';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, Popconfirm, Row, Space, Statistic, message } from 'antd';
import { useEffect, useState } from 'react';
import { Access, Link, useAccess } from 'umi';
import GeneralTable from '../DeviceList/generalTable/GeneralTable';

interface ScrapRecord {
  key: React.Key;
  deviceID: number;
  deviceName: string;
  assetNumber: string;
  scrapID: number;
  scrapPerson: string;
  scrapReason: string;
  scrapTime: string;
}

const DeviceScrap: React.FC = () => {
  const [tableData, setTableData] = useState<ScrapRecord[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentRow, setCurrentRow] = useState<ScrapRecord>();
  const [loading, setLoading] = useState(false);
  const access = useAccess();
  const initial = async () => {
    const res = await getScrapList();
    if (res.code === 20000) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].key = i;
        res.data[i].scrapTime = new Date(res.data[i].scrapTime).toLocaleString();
      }
      setTableData(res.data);
    }
  };

  useEffect(() => {
    initial();
  }, []);

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
              <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.scrapID)}>
                <a>删除</a>
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
                value={5}
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
                value={12}
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
            </GeneralTable>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};
export default DeviceScrap;
