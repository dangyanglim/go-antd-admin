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
    const{handleUpdateModalVisible}=props
    this.state = {
      columns: [
        {
          title: '规则名称',
          dataIndex: 'name',
          width: 200,
          render: text => <a onClick={() => this.previewItem(text)}>{text}</a>,
        },
        {
          title: '描述',
          dataIndex: 'desc',
          width: 200,
        },
        {
          title: '服务调用次数',
          dataIndex: 'callNo',
          sorter: true,
          width: 200,
          render: val => `${val} 万`,
          // mark to display a total number
          needTotal: true,
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 200,
          filters: [
            {
              text: status[0],
              value: 0,
            },
            {
              text: status[1],
              value: 1,
            },
            {
              text: status[2],
              value: 2,
            },
            {
              text: status[3],
              value: 3,
            },
          ],
          render(val) {
            return <Badge status={statusMap[val]} text={status[val]} />;
          },
        },
        {
          title: '上次调度时间',
          dataIndex: 'updatedAt',
          sorter: true,
          width: 200,
          render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
        {
          title: '操作',
          width: 200,
          render: (text, record) => (
            <Fragment>
              <a onClick={() => handleUpdateModalVisible(true, record)}>配置</a>
              <Divider type="vertical" />
              <a href="">订阅警报</a>
            </Fragment>
          ),
        },
      ],
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