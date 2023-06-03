import { Space, Table } from 'antd';

const GeneralTable: React.FC = (props) => {
  const { rowSelection, columns, datasource } = props;
  return (
    <div>
      <Space style={{ marginBottom: 16 }}>{props.children}</Space>
      <Table rowSelection={rowSelection} columns={columns} dataSource={datasource} />
    </div>
  );
};
export default GeneralTable;
