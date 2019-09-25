import * as React from 'react';
import { PureComponent, Fragment } from 'react';
import { Table,Divider,Badge } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';
import { Resizable } from 'react-resizable';
import "./ResizeTable.css";
import "../../../node_modules/react-resizable/css/styles.css";
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
const ResizeableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable width={width} height={0} onResize={onResize}>
      <th {...restProps} />
    </Resizable>
  );
};



export default class ResizeTable extends React.Component{
  constructor(props) {
    super(props);
    const{handleUpdateModalVisible,columns}=props
    this.state = {
      columns,
      // columns: [{
      //   title: 'Date',
      //   dataIndex: 'date',
      //   width: 200,
      // }, {
      //   title: 'Amount',
      //   dataIndex: 'amount',
      //   width: 100,
      // }, {
      //   title: 'Type',
      //   dataIndex: 'type',
      //   width: 100,
      // }, {
      //   title: 'Note',
      //   dataIndex: 'note',
      //   width: 100,
      // }, {
      //   title: 'Action',
      //   key: 'action',
      //   render: () => (
      //     <a href="javascript:;">Delete</a>
      //   ),
      // }],
      components: {
          header: {
          cell: ResizeableTitle,
        },
      }
    };
  }
  previewItem = id => {
    router.push(`/profile/basic/${id}`);
  };
  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const { data = {}, rowKey, components,...rest } = this.props;
    const { list = [], pagination } = data;
    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: (column) => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));

    return (
      <Table
        bordered={true}
        components={this.state.components}
        columns={columns}
        dataSource={list}
      />
    );
  }

  handleResize = (index) => (e, size) => {
    console.log('handleResize');
    
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.size.width,
      };
      return { columns: nextColumns };
    });
  };
}