import * as React from 'react';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { Resizable } from 'react-resizable';
import "./ResizeTable.css";
import "../../../node_modules/react-resizable/css/styles.css";
const ResizeableTitle = (props: any) => {
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

interface IColumn {
  key? :string;
  title?: string;
  width?: number;
  dataIndex?: string;
  render?: (text: any, record: IData, index: number) => React.ReactNode;
}

interface IData {
  key?: number;
  date?: string;
  amount?: number;
  type?: string;
  note?: string;
}

interface IState {
  columns: IColumn[];
  data: IData[];
  components: any;
}

export default class ResizeTable extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      columns: [{
        title: 'Date',
        dataIndex: 'date',
        width: 200,
      }, {
        title: 'Amount',
        dataIndex: 'amount',
        width: 100,
      }, {
        title: 'Type',
        dataIndex: 'type',
        width: 100,
      }, {
        title: 'Note',
        dataIndex: 'note',
        width: 100,
      }, {
        title: 'Action',
        key: 'action',
        render: () => (
          <a href="javascript:;">Delete</a>
        ),
      }],
      data: [{
        key: 0,
        date: '2018-02-11',
        amount: 120,
        type: 'income',
        note: 'transfer',
      }, {
        key: 1,
        date: '2018-03-11',
        amount: 243,
        type: 'income',
        note: 'transfer',
      }, {
        key: 2,
        date: '2018-04-11',
        amount: 98,
        type: 'income',
        note: 'transfer',
      }],
      components: {
          header: {
          cell: ResizeableTitle,
        },
      }
    };
  }

  public render() {
    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: (column: IColumn) => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));

    return (
      <Table
        bordered={true}
        components={this.state.components}
        columns={columns}
        dataSource={this.state.data}
      />
    );
  }

  private  handleResize = (index: number) => (e: any, size: any) => {
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