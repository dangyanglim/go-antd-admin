import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import MyTag from './MyTag'
import { DragDropContext, DragDropContextProvider, DragSource, DropTarget } from 'react-dnd';
//import {HTML5Backend,HTMLBackend}from 'react-dnd-html5-backend';
import HTML5Backend from 'react-dnd-html5-backend';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
//import StandardTable from '@/components/StandardTable';
//import StandardTable from '@/components/StandardTable/ResizeTable2';
import StandardTable from '@/components/ResizeTable';
//import StandardTable from '@/components/ResizeTable/ResizeTable3';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';

const Types = { // 设定类型，只有DragSource和DropTarget的类型相同时，才能完成拖拽和放置

  TAG: 'TAG'

};

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建规则"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

class CreateColumnForm extends React.Component {
  constructor(props) {
    super(props);
    const {columns}=props;
    this.state={
      columns,
    }
  }
  static getDerivedStateFromProps(nextProps,prevState) {
    // clean state
    const {columns} = nextProps;
    if(columns!=prevState.columns){
      return {
        columns,
      }
    }
    return null;
  }
  render(){
    const { modalVisible, form, handleAdd, handleModalVisible,handleColumnModalVisible,moveTagNode,okHandle,handleChangeChecked} = this.props;
   return (

    <Modal
      destroyOnClose
      title="请选择要显示的列"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleColumnModalVisible()}
    >
      <div className={styles.tags}>{
      this.state.columns.map(column=>(
          <MyTag className={styles.myTag} checked={column.checked} handleChangeChecked={handleChangeChecked} dataIndex={column.dataIndex} moveTagNode={moveTagNode}>{column.title}</MyTag>
      ))
      }
      </div>  
    </Modal>

  );   
  }

}
@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        name: props.values.name,
        desc: props.values.desc,
        key: props.values.key,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      currentStep: 0,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = currentStep => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            handleUpdate(formVals);
          }
        }
      );
    });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  renderContent = (currentStep, formVals) => {
    const { form } = this.props;
    if (currentStep === 1) {
      return [
        <FormItem key="target" {...this.formLayout} label="监控对象">
          {form.getFieldDecorator('target', {
            initialValue: formVals.target,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">表一</Option>
              <Option value="1">表二</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="template" {...this.formLayout} label="规则模板">
          {form.getFieldDecorator('template', {
            initialValue: formVals.template,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">规则模板一</Option>
              <Option value="1">规则模板二</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="type" {...this.formLayout} label="规则类型">
          {form.getFieldDecorator('type', {
            initialValue: formVals.type,
          })(
            <RadioGroup>
              <Radio value="0">强</Radio>
              <Radio value="1">弱</Radio>
            </RadioGroup>
          )}
        </FormItem>,
      ];
    }
    if (currentStep === 2) {
      return [
        <FormItem key="time" {...this.formLayout} label="开始时间">
          {form.getFieldDecorator('time', {
            rules: [{ required: true, message: '请选择开始时间！' }],
          })(
            <DatePicker
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择开始时间"
            />
          )}
        </FormItem>,
        <FormItem key="frequency" {...this.formLayout} label="调度周期">
          {form.getFieldDecorator('frequency', {
            initialValue: formVals.frequency,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="month">月</Option>
              <Option value="week">周</Option>
            </Select>
          )}
        </FormItem>,
      ];
    }
    return [
      <FormItem key="name" {...this.formLayout} label="规则名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入规则名称！' }],
          initialValue: formVals.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="desc" {...this.formLayout} label="规则描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
          initialValue: formVals.desc,
        })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
      </FormItem>,
    ];
  };

  renderFooter = currentStep => {
    const { handleUpdateModalVisible, values } = this.props;
    if (currentStep === 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          取消
        </Button>,
        <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
          下一步
        </Button>,
      ];
    }
    if (currentStep === 2) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          完成
        </Button>,
      ];
    }
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        下一步
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { currentStep, formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="规则配置"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
          <Step title="基本信息" />
          <Step title="配置规则属性" />
          <Step title="设定调度周期" />
        </Steps>
        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
@DragDropContext(HTML5Backend)
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      ColumnModalVisible: false,
      updateModalVisible: false,
      expandForm: false,
      selectedRows: [],
      formValues: {},
      stepFormValues: {},
      dragColumns:
      [
        {
          title: '规则名称',
          dataIndex: 'name',
          width: 200,
          align:'center',
          render: text => <a onClick={() => this.previewItem(text)}>{text}</a>,
          checked:false,
        },
        {
          title: '进程号',
          dataIndex: 'progress',
          align:'center',
          width: 200,
          checked:false,
        },
        {
          title: '描述',
          dataIndex: 'desc',
          width: 200,
          align:'center',
          checked:false,
        },
        {
          title: '拥有者',
          dataIndex: 'owner',
          width: 200,
          align:'center',
          checked:false,
        },
        {
          title: '网址',
          dataIndex: 'href',
          width: 200,
          align:'center',
          checked:false,
        },
        {
          title: '标题',
          dataIndex: 'title',
          width: 200,
          align:'center',
          checked:false,
        },        
        {
          title: '服务调用次数',
          dataIndex: 'callNo',
          sorter: true,
          width: 200,
          align:'center',
          render: val => `${val} 万`,
          // mark to display a total number
          needTotal: true,
          checked:false,
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 200,
          align:'center',
          checked:false,
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
          title: '创建时间',
          dataIndex: 'createdAt',
          sorter: true,
          width: 200,
          align:'center',
          checked:false,
          render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },        
        {
          title: '上次调度时间',
          dataIndex: 'updatedAt',
          sorter: true,
          width: 200,
          align:'center',
          checked:false,
          render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
        {
          title: '操作',
          width: 200,
          fixed: 'right',
          checked:false,
          render: (text, record) => (
            <Fragment>
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>
              <Divider type="vertical" />
              <a href="">订阅警报</a>
            </Fragment>
          ),
        },
      ],
      columns: 
      [
        {
          title: '规则名称',
          dataIndex: 'name',
          width: 200,
          align:'center',
          render: text => <a onClick={() => this.previewItem(text)}>{text}</a>,
        },
        {
          title: '进程号',
          dataIndex: 'progress',
          align:'center',
          width: 200,
        },
        {
          title: '描述',
          dataIndex: 'desc',
          width: 200,
          align:'center',
        },
        {
          title: '拥有者',
          dataIndex: 'owner',
          width: 200,
          align:'center',
        },
        {
          title: '服务调用次数',
          dataIndex: 'callNo',
          sorter: true,
          width: 200,
          align:'center',
          render: val => `${val} 万`,
          // mark to display a total number
          needTotal: true,
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 200,
          align:'center',
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
          title: '创建时间',
          dataIndex: 'createdAt',
          sorter: true,
          width: 200,
          align:'center',
          render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },        
        {
          title: '上次调度时间',
          dataIndex: 'updatedAt',
          sorter: true,
          width: 200,
          align:'center',
          render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
        {
          title: '操作',
          width: 200,
          fixed: 'right',
          render: (text, record) => (
            <Fragment>
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>
              <Divider type="vertical" />
              <a href="">订阅警报</a>
            </Fragment>
          ),
        },
      ],
    
    };
  };
  

  handleResize = (index) => (e, size) => {
    console.log('handleResize');
    
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.size.width,
      };
      console.log(nextColumns)
      return { columns: nextColumns };
    });
  }; 
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }
  okHandle=()=>{
    var newColumns=[];
    for(let i=0;i<this.state.dragColumns.length;i++){
      if(this.state.dragColumns[i].checked){
        newColumns.push(this.state.dragColumns[i])
      }
    }
    console.log(this.state.dragColumns)
    console.log(newColumns)
    this.setState({
      columns:newColumns,
      ColumnModalVisible:false,
    })
    this.forceUpdate();
  }
  handleChangeChecked=(dataIndex,checked)=>{
    for(let i=0;i<this.state.dragColumns.length;i++){
      if(this.state.dragColumns[i].dataIndex===dataIndex){
        this.state.dragColumns[i].checked=checked;
        break;
      }
    }
    
    this.setState({
      dragColumns:this.state.dragColumns,
    })
    this.forceUpdate();
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  previewItem = id => {
    router.push(`/profile/basic/${id}`);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  handleColumnModalVisible = flag => {
    this.setState({
      ColumnModalVisible: !!flag,
      //dragColumns:this.state.columns,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'rule/update',
      payload: {
        query: formValues,
        body: {
          name: fields.name,
          desc: fields.desc,
          key: fields.key,
        },
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} type="primary" onClick={this.handleFormReset}>
                重置
              </Button>
              <Button style={{ marginLeft: 8 }} type="primary" onClick={() => this.handleColumnModalVisible(true)}>
                列配置
              </Button>              
              <Button style={{ marginLeft: 8 }} icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 12 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} type="primary" onClick={this.handleFormReset}>
              重置
            </Button>
            <Button style={{ marginLeft: 8 }} type="primary" onClick={() => this.handleColumnModalVisible(true)}>
                列配置
              </Button>
            <Button style={{ marginLeft: 8 }} icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
  moveTagNode = (dragKey, hoverKey) => {
    const newOrder = this.state.dragColumns.slice();
    let dragIndex = 0;
    let drag={}
    for(let i=0;i<newOrder.length;i++){
      if(newOrder[i].dataIndex===dragKey){
        dragIndex=i;
        drag=newOrder[i];
        break;
      }
    }
    let hoverIndex = 0;
    for(let i=0;i<newOrder.length;i++){
      if(newOrder[i].dataIndex===hoverKey){
        hoverIndex=i;
        break;
      }
    }
    newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, drag);
    //this.state.dragColumns=newOrder;
     this.setState({
      dragColumns: newOrder,
     });
  };
  render() {
    const {
      rule: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues, ColumnModalVisible,dragColumns } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleColumnModalVisible: this.handleColumnModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                  已选择 <a style={{ fontWeight: 600 }}>{selectedRows.length}</a> 项&nbsp;&nbsp;
                  <Button type="primary">冲销</Button>
                  <Button type="primary">批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              handleResize={this.handleResize}
              handleUpdateModalVisible={this.handleUpdateModalVisible}
              columns={this.state.columns}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              scroll={{ x: 1800 ,y:400}}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <CreateColumnForm {...parentMethods} modalVisible={ColumnModalVisible} columns={dragColumns} moveTagNode={this.moveTagNode} okHandle={this.okHandle} handleChangeChecked={this.handleChangeChecked}/>
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
//export default DragDropContext(HTML5Backend)(TableList)


