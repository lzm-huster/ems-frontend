import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, Row, Statistic } from 'antd';
import { useState } from 'react';
import { Link } from 'umi';
import GeneralTable from '../DeviceList/generalTable/GeneralTable';

const DeviceScrap: React.FC = () => {
  const [tableData, setTableData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 60,
    },
    {
      title: '设备编号',
      dataIndex: 'userName',
      copyable: true,
      ellipsis: true,
    },

    {
      title: '设备名称',
      dataIndex: 'userName',
      ellipsis: true,
    },
    {
      title: '设备负责人',
      dataIndex: 'userName',
      ellipsis: true,
    },
    {
      title: '报废时间',
      dataIndex: 'userName',
      valueType: 'date',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '报废原因',
      dataIndex: 'userName',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            // setCurrentRow(record);
            // console.log(record);
            // setEditVisible(true);
            // action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          onClick={() => {
            // setCurrentRow(record);
            // setShowDetail(true);
          }}
          key="view"
        >
          查看详情
        </a>,
      ],
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
              <Button type="primary">
                <Link to={'/deviceManagement/scrap/add'}>新增报废记录</Link>
              </Button>
              <Button danger disabled={!hasSelected}>
                批量删除记录
              </Button>
            </GeneralTable>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};
export default DeviceScrap;
