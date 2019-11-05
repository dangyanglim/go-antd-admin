import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Menu, Dropdown ,Table,Button,Form,Modal,Input,message} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';
import styles from './Department.less';
import PageLoading from '@/components/PageLoading';
import { formatMessage } from 'umi-plugin-react/locale';
import { Tree } from 'antd';
const { confirm } = Modal;
const { TreeNode } = Tree;
const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
const SalesCard = React.lazy(() => import('./SalesCard'));
const TopSearch = React.lazy(() => import('./TopSearch'));
const ProportionSales = React.lazy(() => import('./ProportionSales'));
const OfflineData = React.lazy(() => import('./OfflineData'));
import StandardTable from '@/components/ResizeTable';
const FormItem = Form.Item;
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible ,selectedMenu,selectedRows} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //form.resetFields();
      handleAdd(fieldsValue);
      console.log(fieldsValue)
    });
  };
  console.log(selectedRows)
  return (
    
    <Modal
      destroyOnClose
      title="新建部门"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上级部门">
        {form.getFieldDecorator('parent_name', {
          initialValue:selectedRows&&selectedRows[0]?selectedRows[0].title:null,
          rules: [{ required: true, message: '不能为空！', min: 1 }],
        })(<Input disabled  placeholder="请输入" />)}
      </FormItem>  
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="部门名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '不能为空！', min: 1 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>        
    </Modal>
  );
});
const CreateEditForm = Form.create()(props => {

  const { editModalVisible, form, handleAdd, handleEditModalVisible ,selectedRows,handleEdit} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //form.resetFields();
      handleEdit(fieldsValue);
      console.log(fieldsValue)
    });
  };
  return (
    <Modal
      destroyOnClose
      title="编辑部门"
      visible={editModalVisible}
      onOk={okHandle}
      onCancel={() => handleEditModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="部门名称">
        {form.getFieldDecorator('name', {
          initialValue:selectedRows&&selectedRows[0]?selectedRows[0].title:null,
          rules: [{ required: true, message: '不能为空！', min: 1 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ departmentManage,menu, loading }) => ({
  departmentManage,
  menu,
  loading: loading.effects['departmentManage/fetch'],
}))
@Form.create()
class DepartmentManagePage extends Component {
  state = {
    loading: true,
    modalVisible:false,
    editModalVisible:false,
    selectedRows: [],
    columns : [
      {
        title: '部门名称',
        dataIndex: 'title',
        key: 'title',
       // width: 200,
      },
      {
        title: '部门ID',
        dataIndex: 'key',
        key: 'key',
       // width: 200,
      },
    ],
  };
  handleAdd = fields => {
    const { dispatch } = this.props;
    this.handleModalVisible();
    message.loading("加载中")
    dispatch({
      type: 'departmentManage/add',
      payload: {
        name:fields.name,
        parent_id:this.state.selectedRows[0].key,
      },
    }).then(result => {
      message.destroy()
      
      dispatch({
        type: 'departmentManage/fetch',
        payload: {
          id: 1,
        },
      });       
    }) 
  };
  handleEdit = fields => {
    var _this=this;
    const { dispatch } = this.props;
    this.handleEditModalVisible();
    message.loading("加载中",0)
    dispatch({
      type: 'departmentManage/edit',
      payload: {
        name:fields.name,
        id:this.state.selectedRows[0].key,
      },
    }).then(result => {
      console.log(result)
      message.destroy()
      if(result.code==200){
        message.success('修改成功');
      }
      if(result.code==200){
        var department=result.data
        _this.state.selectedRows[0].title=department.title
        _this.setState({
          selectedRows:_this.state.selectedRows,
        })
      }
      
      dispatch({
        type: 'departmentManage/fetch',
        payload: {
          id: 1,
        },
      });
     
    }) 
  };
  showAddModal=flag=>{

    if(this.state.selectedRows.length==0){
      message.error("请选择上级部门")
      return
    }
    if(this.state.selectedRows.length>1){
      message.error("只能勾选一个上级部门")
      return
    }
    this.handleModalVisible(flag)
  };
  showEditModal=flag=>{
    if(this.state.selectedRows.length==0){
      message.error("请选择部门")
      return
    }
    if(this.state.selectedRows.length>1){
      message.error("只能勾选一个部门")
      return
    }
    this.handleEditModalVisible(flag)
  };
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  handleEditModalVisible = flag => {
    this.setState({
      editModalVisible: !!flag,
    });
  };
  showDeleteConfirm() {
    const { dispatch } = this.props;
    if(this.state.selectedRows.length==0){
      message.error("请选择部门")
      return
    }
    if(this.state.selectedRows.length>1){
      message.error("只能勾选一个部门")
      return
    }
    var id=this.state.selectedRows[0].key
    confirm({
      title: '确定删除?',
      content: '',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        console.log('OK');
        message.loading("加载中",0)
        dispatch({
          type: 'departmentManage/delete',
          payload: {
            id: id,
          },
        }).then(result => {
          message.destroy()
          if(result.code==200){
            message.success('删除成功');
          }
          dispatch({
            type: 'departmentManage/fetch',
            payload: {
              id: 1,
            },
          });      
        });        
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'departmentManage/fetch',
      payload: {
        id: 1,
      },
    });
  };
  handleSelectRows = rows => {
    console.log(rows)
    this.setState({
      selectedRows: rows,
    });
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
  render() {
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleEditModalVisible:this.handleEditModalVisible,
      handleEdit:this.handleEdit,

    };
    const data={}
    const {selectedRows,modalVisible,editModalVisible,columns}=this.state;
    const {departmentManage,loading} =this.props;
    const {treeData}=departmentManage
    data.list=treeData
    return (
      <div className={styles.main}>
            <div className={styles.buttonLine}>
              <Button icon="plus" type="primary" onClick={() => this.showAddModal(true)}>
                新建
              </Button>
              <Button style={{ marginLeft: 10 }}  type="primary" onClick={() => this.showEditModal(true)}>
                编辑
              </Button>
              <Button style={{ marginLeft: 10 }}  type="dashed" onClick={()=>this.showDeleteConfirm()} >
                删除
              </Button>
            </div>
            <StandardTable
              data={data}
              handleResize={this.handleResize}
              loading={loading}
             //scroll={{ x: true ,y:400}}
              onSelectRow={this.handleSelectRows}
              selectedRows={selectedRows}
              columns={columns}
              
            />
            <CreateForm 
              {...parentMethods}
              selectedRows={selectedRows}
              modalVisible={modalVisible} 
            />
            <CreateEditForm 
              {...parentMethods}
              selectedRows={selectedRows}
              editModalVisible={editModalVisible}
              />
      </div>
     
    );
  }
}

export default DepartmentManagePage;
