import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Menu, Dropdown ,Table,Button,Form,Modal,Input,message} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';
import styles from './Menu.less';
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
  const { modalVisible, form, handleAdd, handleModalVisible ,selectedMenu} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //form.resetFields();
      handleAdd(fieldsValue);
      console.log(fieldsValue)
    });
  };

  return (
    <Modal
      destroyOnClose
      title="新建菜单"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父级菜单">
        {form.getFieldDecorator('parent_name', {
          initialValue:selectedMenu.title,
        })(<Input disabled  placeholder="请在左侧点击选择一个菜单" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '不能为空', min: 1 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="前端路由">
        {form.getFieldDecorator('path', {
          rules: [{ required: true, message: '不能为空！', min: 1 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="页面路径">
        {form.getFieldDecorator('component', {
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单图标">
        {form.getFieldDecorator('icon', {
        })(<Input placeholder="请输入" />)}
      </FormItem>      
    </Modal>
  );
});
const CreateEditForm = Form.create()(props => {

  const { editModalVisible, form, handleAdd, handleEditModalVisible ,selectedMenu,handleEdit} = props;
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
      title="编辑菜单"
      visible={editModalVisible}
      onOk={okHandle}
      onCancel={() => handleEditModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name', {
          initialValue:selectedMenu.title,
          rules: [{ required: true, message: '不能为空', min: 1 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="前端路由">
        {form.getFieldDecorator('path', {
          initialValue:selectedMenu.path,
          rules: [{ required: true, message: '不能为空！', min: 1 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="页面路径">
        {form.getFieldDecorator('component', {
          initialValue:selectedMenu.component,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单图标">
        {form.getFieldDecorator('icon', {
          initialValue:selectedMenu.icon,
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});
// const dataSource = [
//   {
//     key: '1',
//     name: '胡彦斌',
//     age: 32,
//     address: '西湖区湖底公园1号',
//   },
//   {
//     key: '2',
//     name: '胡彦祖',
//     age: 42,
//     address: '西湖区湖底公园1号',
//   },
// ];

const columns = [
  {
    title: '菜单编号',
    dataIndex: 'key',
    key: 'key',
  },
  {
    title: '菜单名称',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '前端路由',
    dataIndex: 'path',
    key: 'path',
  },
  {
    title: '页面路径',
    dataIndex: 'component',
    key: 'component',
  },
  {
    title: '菜单图标',
    dataIndex: 'icon',
    key: 'icon',
  },

];
@connect(({ menuManage,menu, loading }) => ({
  menuManage,
  menu,
  loading: loading.effects['menuManage/fetch'],
}))
@Form.create()
class MenuManagePage extends Component {
  state = {
    loading: true,
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    treeData:[],
    modalVisible:false,
    editModalVisible:false,
    selectedMenu:{key:'',title:'',path:'',component:''}
  };

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    console.log(info.node.props.dataRef);
    var menu=info.node.props.dataRef
    this.setState({
      selectedMenu:{key:menu.key,title:menu.title,path:menu.path,component:menu.component,icon:menu.icon}
    });
  };
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menuManage/add',
      payload: {
        name:fields.name,
        path:fields.path,
        parent_id:this.state.selectedMenu.key,
        component:fields.component,
        icon:fields.icon,
      },
    }).then(result => {
      this.handleModalVisible();
      dispatch({
        type: 'menuManage/fetch',
        payload: {
          id: 1,
        },
      });
      dispatch({
        type: 'menu/updateRoutes',
      });        
    })  
  };
  handleEdit = fields => {
    var _this=this;
    const { dispatch } = this.props;
    dispatch({
      type: 'menuManage/edit',
      payload: {
        name:fields.name,
        path:fields.path,
        id:this.state.selectedMenu.key,
        component:fields.component,
        icon:fields.icon,
      },
    }).then(result => {
      console.log(result)
      if(result.code==200){
        var menu=result.data
        _this.setState({
          selectedMenu:{key:menu.key,title:menu.title,path:menu.path,component:menu.component,icon:menu.icon}
        });       
      }
      this.handleEditModalVisible();
      dispatch({
        type: 'menuManage/fetch',
        payload: {
          id: 1,
        },
      });
      dispatch({
        type: 'menu/updateRoutes',
      });       
    })  
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menuManage/fetch',
      payload: {
        id: 1,
      },
    });
  }
  showAddModal=flag=>{

    if(this.state.selectedMenu.key===""){
      message.error("请先选择一个菜单")
      return;
    }
    this.handleModalVisible(flag)
  };
  showEditModal=flag=>{

    if(this.state.selectedMenu.key===""){
      message.error("请先选择一个菜单")
      return;
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
    if(this.state.selectedMenu.key===""){
      message.error("请先选择一个菜单")
      return;
    }
    var id=this.state.selectedMenu.key
    confirm({
      title: '确定删除菜单'+this.state.selectedMenu.title+'及其子菜单?',
      content: '',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        console.log('OK');
        dispatch({
          type: 'menuManage/delete',
          payload: {
            id: id,
          },
        }).then(result => {
          dispatch({
            type: 'menuManage/fetch',
            payload: {
              id: 1,
            },
          });
          dispatch({
            type: 'menu/updateRoutes',
          });       
        })  ;
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  renderTreeNodes = (data,name) =>
  
    data.map(item => {
      var temp=name+"."+item.title
      if (item.children) {
        return (
          <TreeNode title={formatMessage({ id:temp})} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children,temp)}
          </TreeNode>
        );
      }
      
      return <TreeNode key={item.key} {...item} />;
    }
    )
  ;

  render() {
  const {menuManage} =this.props;
  const {modalVisible,selectedMenu,editModalVisible}=this.state;
  const {treeData}=menuManage
  const parentMethods = {
    handleAdd: this.handleAdd,
    handleModalVisible: this.handleModalVisible,
    handleEditModalVisible:this.handleEditModalVisible,
    handleEdit:this.handleEdit,
   // handleColumnModalVisible: this.handleColumnModalVisible,
  };
  var dataSource=[]
  if(selectedMenu.key!="")dataSource.push(selectedMenu)
    return (
      <div className={styles.main}>
        <div className={styles.left}>
        {treeData?<Tree
            defaultExpandAll
            onSelect={this.onSelect}
          >
            <TreeNode title={treeData.title} key={treeData.key} dataRef={treeData}>
              {treeData.children?this.renderTreeNodes(treeData.children,"menu"):null}
            </TreeNode>
          </Tree>:null}
        </div>
        <div className={styles.right}>
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
          <Table 
            bordered
            size={"small"}
            dataSource={dataSource} columns={columns} 
          />;  
        </div>
        <CreateForm 
        {...parentMethods}
        selectedMenu={selectedMenu}
        modalVisible={modalVisible} />
        <CreateEditForm 
        {...parentMethods}
        selectedMenu={selectedMenu}
        editModalVisible={editModalVisible} />
      </div>
     
    );
  }
}

export default MenuManagePage;
