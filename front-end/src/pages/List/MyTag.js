import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { DragDropContext, DragDropContextProvider, DragSource, DropTarget } from 'react-dnd';
import {HTML5Backend,HTMLBackend}from 'react-dnd-html5-backend';
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


import { Tag } from 'antd';

const { CheckableTag } = Tag;


const tagSource = {
  beginDrag(props) {
    return {
      dataIndex: props.dataIndex,
    };
  },
};
const tagTarget = {
  drop(props, monitor) {
    const dragKey = monitor.getItem().dataIndex;
    const hoverKey = props.dataIndex;

    if (dragKey === hoverKey) {
      return;
    }

    props.moveTagNode(dragKey, hoverKey);
    monitor.getItem().dataIndex = hoverKey;
  },
};

function collect(connect,monitor) { //通过这个函数可以通过this.props获取这个函数所返回的所有属性

  return{

      connectDragSource:connect.dragSource(),

      isDragging:monitor.isDragging()

  }

}
function collect1(connect,monitor) {//同DragSource的collect函数

  return{

      connectDropTarget:connect.dropTarget(),

      isOver:monitor.isOver(), //source是否在Target上方

      isOverCurrent: monitor.isOver({ shallow: true }), 

      canDrop: monitor.canDrop(),//能否被放置

      itemType: monitor.getItemType(),//获取拖拽组件type

  }

}

@DragSource(Types.TAG,tagSource,collect)
@DropTarget(Types.TAG, tagTarget, collect1)
class MyTag extends React.Component {
  constructor(props) {
    super(props);
    const {checked}=props;
    this.state={
      checked,
    }
  }
  //state = { checked: true };
  
  static getDerivedStateFromProps(nextProps,prevState) {
    // clean state
    const {checked} = nextProps;
    if(checked!=prevState.checked){
      return {
        checked,
      }
    }
    return null;
  }
  handleChange = checked => {
    const { handleChangeChecked,dataIndex} = this.props;
    handleChangeChecked(dataIndex,checked);

  };

  render() {
    const { isDragging, connectDragSource,connectDropTarget,handleChangeChecked} = this.props;
    return connectDragSource && connectDragSource(
      connectDropTarget(
      <div>
      <CheckableTag {...this.props} checked={this.state.checked} onChange={this.handleChange} />
      </div>
      )
    );
  }
}
export default MyTag;
// 使组件连接DragSource和DropTarget

// import flow from 'lodash/flow';

// export default flow(

//     DragSource(Types.TAG,tagSource,collect),

// )(MyTag)





