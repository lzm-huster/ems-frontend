import { getMonth1st } from '@/services/general/dataProcess';
import {
  deleteMaintenanceRecord,
  getMaintenanceList,
  getMaintenanceNum,
} from '@/services/swagger/maintenance';
import { Line } from '@ant-design/charts';
import { PageContainer, ProFormDateRangePicker } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  Divider,
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

export interface MaintenanceRecord {
  key: React.Key;
  deviceID: number;
  assetNumber: string;
  deviceName: string;
  maintenanceContent: string;
  maintenanceID: 0;
  maintenanceTime: string;
}

const { Search } = Input;

const Maintenance: React.FC = () => {
  const formRef = React.useRef<FormInstance>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [initMaintenance, setInitMaintenance] = useState([]);
  const [showMaintenance, setShowMaintenance] = useState([]);
  const [lineData, setLineData] = useState<{}>([]);
  const [maintenanceNum, setMaintenanceNum] = useState(0);
  const [maintenanceTMonth, setMaintenanceMonth] = useState(0);
  const access = useAccess();

  //折线图数据
  const plotData = (repairs: MaintenanceRecord[]) => {
    const month1st = getMonth1st(5);
    const data = [];
    for (let i = 0; i < 4; i++) {
      const date = new Date(month1st[i]);
      const node = {
        month: date.getFullYear() + '/' + (date.getMonth() + 1),
        maintenanceNum: repairs.filter((x: MaintenanceRecord) => {
          const t = Date.parse(x.maintenanceTime);
          return t >= month1st[i] && t < month1st[i + 1];
        }).length,
      };
      data.push(node);
    }
    const date = new Date(month1st[4]);
    const node = {
      month: date.getFullYear() + '/' + (date.getMonth() + 1),
      maintenanceNum: repairs.filter((x: MaintenanceRecord) => {
        const t = Date.parse(x.maintenanceTime);
        return t >= month1st[4];
      }).length,
    };
    data.push(node);
    setMaintenanceMonth(
      repairs.filter((x: MaintenanceRecord) => {
        const t = Date.parse(x.maintenanceTime);
        return t >= month1st[4];
      }).length,
    );
    return data;
  };

  const initial = async () => {
    const res = await getMaintenanceList();
    const num = await getMaintenanceNum();
    if (res.code === 20000) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].maintenanceTime = new Date(res.data[i].maintenanceTime).toLocaleString();
        res.data[i].key = i;
      }
      setInitMaintenance(res.data);
      setShowMaintenance(res.data);
      setLineData(plotData(res.data));
    }
    if (num.code === 20000) {
      setMaintenanceNum(num.data);
    }
  };
  useEffect(() => {
    initial();
  }, []);

  //折线图配置
  const config = {
    data: lineData,
    xField: 'month',
    yField: 'maintenanceNum',
    label: {},
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
    interactions: [
      {
        type: 'marker-active',
      },
    ],
  };

  const onSearch = (name?: string, sTime?: number, eTime?: number) => {
    if (sTime !== undefined && eTime !== undefined && name !== undefined)
      setShowMaintenance(
        name === ''
          ? initMaintenance
          : initMaintenance.filter((item: MaintenanceRecord) => {
              const pTime = Date.parse(item['maintenanceTime']);
              return item['deviceName'].indexOf(name) != -1 && pTime <= eTime && pTime >= sTime;
            }),
      );
    else if (name !== undefined)
      setShowMaintenance(
        name === ''
          ? initMaintenance
          : initMaintenance.filter((item: MaintenanceRecord) => {
              return item['deviceName'].indexOf(name) != -1;
            }),
      );
    else if (sTime !== undefined && eTime !== undefined)
      setShowMaintenance(
        name === ''
          ? initMaintenance
          : initMaintenance.filter((item: MaintenanceRecord) => {
              const pTime = Date.parse(item['maintenanceTime']);
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

  const handleDelete = async (maintenanceId: number) => {
    deleteMaintenanceRecord({ maintenanceID: maintenanceId });
    const res = await getMaintenanceList();
    const num = await getMaintenanceNum();
    if (res.code === 20000) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].maintenanceTime = new Date(res.data[i].maintenanceTime).toLocaleString();
        res.data[i].key = i;
      }
      setInitMaintenance(res.data);
      setShowMaintenance(res.data);
      setLineData(plotData(res.data));
    }
    if (num.code === 20000) {
      setMaintenanceNum(num.data);
    }
  };

  const handleMessDelete = () => {
    setLoading(true);

    const selectedMaintenanceIds = selectedRowKeys
      .map((selectedKey: any) => {
        const selectedMaintenance = initMaintenance.find(
          (maintenanceItem: MaintenanceRecord) => maintenanceItem.key === selectedKey,
        );
        if (selectedMaintenance && selectedMaintenance.maintenanceID) {
          return selectedMaintenance.maintenanceID;
        }
        return null;
      })
      .filter((maintenanceID: any): maintenanceID is number => maintenanceID !== null);
    // 依次删除每个设备
    const deletePromises = selectedMaintenanceIds.map((maintenanceID: any) =>
      deleteMaintenanceRecord({ maintenanceID: maintenanceID }).then((res) => res.code === 20000),
    );

    // 等待所有删除请求完成后，更新表格数据和清空选中的行数据
    Promise.all(deletePromises).then(async (results) => {
      if (results.every((result: any) => result)) {
        const res = await getMaintenanceList();
        const num = await getMaintenanceNum();
        if (res.code === 20000) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].maintenanceTime = new Date(res.data[i].maintenanceTime).toLocaleString();
            res.data[i].key = i;
          }
          setInitMaintenance(res.data);
          setShowMaintenance(res.data);
          setLineData(plotData(res.data));
        }
        if (num.code === 20000) {
          setMaintenanceNum(num.data);
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

  const columns: ColumnsType<MaintenanceRecord> = [
    {
      title: '保养编号',
      dataIndex: 'maintenanceID',
    },
    {
      title: '设备编号',
      dataIndex: 'assetNumber',
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
    },
    {
      title: '保养时间',
      dataIndex: 'maintenanceTime',
      sorter: (a, b) => {
        if (a.maintenanceTime === null || b.maintenanceTime === null) {
          return 0;
        } else {
          const aDate = Date.parse(a.maintenanceTime);
          const bDate = Date.parse(b.maintenanceTime);
          return aDate - bDate;
        }
      },
    },
    {
      title: '保养内容',
      dataIndex: 'maintenanceContent',
    },
    {
      title: '操作',
      key: 'action',
      render: (record) => (
        <Space size="middle">
          <a>
            <Link
              to={{
                pathname: '/deviceManagement/maintenance/detail',
                state: {
                  maintenanceID: record.maintenanceID,
                  deviceName: record.deviceName,
                  edit: false,
                },
              }}
            >
              详情
            </Link>
          </a>
          <Access accessible={access.maintenanceUpdateBtn('maintenance:update')}>
            <a>
              <Link
                to={{
                  pathname: '/deviceManagement/maintenance/detail',
                  state: {
                    maintenanceID: record.maintenanceID,
                    deviceName: record.deviceName,
                    edit: true,
                  },
                }}
              >
                修改
              </Link>
            </a>
          </Access>
          <Access accessible={access.maintenanceDeleteBtn('maintenance:delete')}>
            <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.maintenanceID)}>
              <a>删除</a>
            </Popconfirm>
          </Access>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Row gutter={[16, 24]}>
        <Col span={6}>
          <Card bordered={false} hoverable={true} title="维修记录">
            <Statistic
              value={maintenanceNum}
              title="保养次数"
              precision={0}
              valueStyle={{ color: '#5781CD', fontWeight: 'regular', fontSize: 36 }}
              suffix="次"
            />
            <Divider />
            <Statistic
              value={maintenanceTMonth}
              title="本月保养次数"
              precision={0}
              valueStyle={{ color: '#5781CD', fontWeight: 'regular', fontSize: 36 }}
              suffix="次"
            />
          </Card>
        </Col>
        <Col span={18}>
          <Card bordered={false} title={'近五个月保养次数'} hoverable>
            <Line height={213} {...config} />
          </Card>
        </Col>
        <Col span={24}>
          <GeneralTable rowSelection={rowSelection} datasource={showMaintenance} columns={columns}>
            <Access accessible={access.maintenanceAddBtn('maintenance:add')}>
              <Button type="primary">
                <Link to={'/deviceManagement/maintenance/addMaintenance'}>新增保养记录</Link>
              </Button>
            </Access>
            <Access accessible={access.maintenanceDeleteBtn('maintenance:delete')}>
              <Button danger onClick={handleMessDelete} disabled={!hasSelected}>
                批量删除
              </Button>
            </Access>

            <span style={{ marginLeft: 8 }}>
              {hasSelected ? `已选择 ${selectedRowKeys.length} 项` : ''}
            </span>
            <div style={{ position: 'absolute', right: 0, top: 0 }}>
              <Form layout={'inline'} ref={formRef} name="control-ref" style={{ maxWidth: 800 }}>
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
                      setShowMaintenance(initMaintenance);
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
    </PageContainer>
  );
};
export default Maintenance;
