import * as React from 'react';
import { PureComponent, Fragment } from 'react';
import { Table,Divider,Badge, Alert } from 'antd';
import moment from 'moment';
import styles from './index.less';
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

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

export default class ResizeTable extends React.Component{
  constructor(props) {
    super(props);
    const{handleUpdateModalVisible,columns}=props
    const needTotalList = initTotalList(columns);
    this.state = {
      selectedRowKeys: [],
      needTotalList,
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
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };
  previewItem = id => {
    router.push(`/profile/basic/${id}`);
  };
  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };
  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };
  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const { data = {}, rowKey, components,...rest } = this.props;
    const { list = [], pagination } = data;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: (column) => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions:['10', '20', '30', '40','100','500','1000'],
      ...pagination,
    };
    return (
      <div className={styles.standardTable}>
      <div className={styles.tableAlert}>
        <Alert
          message={
            <Fragment>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
              {needTotalList.map(item => (
                <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                  {item.title}
                  总计&nbsp;
                  <span style={{ fontWeight: 600 }}>
                    {item.render ? item.render(item.total) : item.total}
                  </span>
                </span>
              ))}
              <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                清空
              </a>
            </Fragment>
          }
          type="info"
          showIcon
        />
      </div>
      <Table
        bordered
        columns={columns}
        components={this.state.components}
        rowKey={rowKey || 'key'}
        rowSelection={rowSelection}
        dataSource={list}
        pagination={paginationProps}
        onChange={this.handleTableChange}
        //{...rest}
      />
         {/* <Table
         bordered={true}
         components={this.state.components}
         columns={columns}
         pagination={paginationProps}
         dataSource={list} */}
       />
    </div>
      // <Table
      //   bordered={true}
      //   components={this.state.components}
      //   columns={columns}
      //   pagination={paginationProps}
      //   dataSource={list}
      // />
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