import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputRef,
  Popconfirm,
  Row,
  Space,
  Table,
  message,
} from 'antd';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { PageContainer } from '@ant-design/pro-components';
import { getUserInfo } from '@/services/swagger/user';
import './index.less';

dayjs.extend(customParseFormat);

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  deviceName: string;
  deviceType: string;
  deviceModel: string;
  unitPrice: number;
  stockQuantity: number;
  assetNumber: string;
  isPublic: boolean;
  borrowRate: number;
  deviceImage: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  deviceName: string;
  deviceType: string;
  deviceModel: string;
  unitPrice: number;
  stockQuantity: number;
  assetNumber: string;
  isPublic: boolean;
  borrowRate: number;
  deviceImage: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const dateFormat = 'YYYY/MM/DD';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const formatDate = (time: any) => {
  // 格式化日期，获取今天的日期
  const Dates = new Date(time);
  const year: number = Dates.getFullYear();
  const month: any =
    Dates.getMonth() + 1 < 10 ? '0' + (Dates.getMonth() + 1) : Dates.getMonth() + 1;
  const day: any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
  return year + '/' + month + '/' + day;
};

const now = formatDate(new Date().getTime());

const AddDevice: React.FC = () => {
  const formRef = React.useRef<FormInstance>(null);

  const initial = async () => {
    const res = await getUserInfo();
    if (res.code === 20000) {
      formRef.current?.setFieldsValue({ userName: res.data.userName });
      formRef.current?.setFieldsValue({ purchaseDate: dayjs(now, dateFormat) });
    }
  };
  useEffect(() => {
    initial();
  }, []);

  const onFinish = (values: any) => {
    message.success('提交成功');
  };

  const onReset = () => {
    formRef.current?.resetFields();
  };

  //可编辑表格

  const [dataSource, setDataSource] = useState<DataType[]>([
    {
      key: '0',
      deviceName: 'Edward King 0',
      deviceType: '32',
      deviceModel: 'London, Park Lane no. 0',
      unitPrice: 1,
      stockQuantity: 1,
      assetNumber: 'string',
      isPublic: true,
      borrowRate: 1,
      deviceImage: 'image',
    },
    {
      key: '1',
      deviceModel: 'Edward King 1',
      deviceName: '32',
      deviceType: 'London, Park Lane no. 1',
      unitPrice: 1,
      stockQuantity: 1,
      assetNumber: 'string',
      isPublic: true,
      borrowRate: 1,
      deviceImage: 'image',
    },
  ]);

  const [count, setCount] = useState(2);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: '设备编号',
      dataIndex: 'deviceNum',
      width: '30%',
      editable: true,
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
    },
    {
      title: '设备类型',
      dataIndex: 'deviceType',
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      // render: (_, record:{key:React.Key}) =>
      //   dataSource.length >= 1 ? (
      //     <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
      //       <a>Delete</a>
      //     </Popconfirm>
      //   ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      deviceName: `Edward King ${count}`,
      deviceType: '32',
      deviceModel: `London, Park Lane no. ${count}`,
      unitPrice: 1,
      stockQuantity: 1,
      assetNumber: 'string',
      isPublic: true,
      borrowRate: 1,
      deviceImage: 'image',
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <PageContainer>
      <Form
        {...layout}
        ref={formRef}
        name="control-ref"
        onFinish={onFinish}
        style={{ maxWidth: 1400 }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="userName" label="负责人" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="purchaseDate" label="购买时间" rules={[{ required: true }]}>
              <DatePicker format={dateFormat} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
            Add a row
          </Button>
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={columns as ColumnTypes}
          />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </PageContainer>
  );
};

export default AddDevice;
