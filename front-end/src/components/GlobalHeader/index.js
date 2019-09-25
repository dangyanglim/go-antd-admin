import React, { PureComponent } from 'react';
import { Icon ,Divider} from 'antd';
import Link from 'umi/link';
import router from 'umi/router';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';
import { Tabs } from 'antd';
import { Tag,Button} from 'antd';
const { CheckableTag } = Tag;
import { title } from '../../defaultSettings';

const { TabPane } = Tabs;
export default class GlobalHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabs:[]
    };
  }
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  onClick=(tab)=>{
    router.push(tab.pathName)
  }
  onDelete=(e,tab)=>{
    e.stopPropagation();
    let pathName="";
    for(let i=0;i<this.state.tabs.length;i++){
      if(tab.pathName==this.state.tabs[i].pathName){
        if(this.state.tabs[i].selected){
          if(i==this.state.tabs.length-1){
            pathName=this.state.tabs[i-1].pathName;
          }else{
            pathName=this.state.tabs[i+1].pathName;
          }
        }else{
          for(let j=0;j<this.state.tabs.length;j++){
            if(this.state.tabs[j].selected){
              pathName=this.state.tabs[j].pathName;
            }
          }          
        }
        this.state.tabs.splice(i,1);
        break;
      }
    }
    if(pathName!="")router.push(pathName)
  }
  render() {
    const { collapsed, isMobile, logo ,pageName,pathName} = this.props;
    //console.log(pathName)
    let ret=true;
    let selectedNum=0;
    for(let i=0;i<this.state.tabs.length;i++){
      if(this.state.tabs[i].pageName===pageName){
        
        ret=false
        selectedNum=i;
        break;
      }
    }
    if(!ret&&pageName!=title ){
      for(let i=0;i<this.state.tabs.length;i++){
        if(this.state.tabs[i].selected){
          this.state.tabs[i].selected=false;
        }
      }
      this.state.tabs[selectedNum].selected=true;
    }
    if(ret&&pageName!=title ){
      for(let i=0;i<this.state.tabs.length;i++){
        if(this.state.tabs[i].selected){
          this.state.tabs[i].selected=false;
        }
        if(!this.state.tabs[i].icon){
          this.state.tabs[i].icon=true;
        }        
      }
      this.state.tabs.push({pageName:pageName,pathName:pathName,selected:true,icon:true})
    }
    if(this.state.tabs.length==1){
      this.state.tabs[0].icon=false;
    }
    if(this.state.tabs.length==6){
      this.state.tabs.shift();
    }
    //console.log(this.state.tabs)
    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        )}
        <span className={styles.trigger} onClick={this.toggle}>
          <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
        </span>
        {/* <span>{pageName}</span> */}
        {
          this.state.tabs.map(tab=>(
              <span key={tab.pathName}>
              {/* <Divider type="vertical" /> */}
              <span  className={tab.selected?styles.buttonSelectTrigger:styles.buttonTrigger} onClick={()=>this.onClick(tab)} type={tab.selected?'primary':'default'} >
              {tab.pageName}
              {tab.icon?<span onClick={(e)=>this.onDelete(e,tab)} className={styles.iconTrigger} >
                <Icon type="close" />
              </span>:null}
              </span>
              {/* {tab.icon? <span icon="close" className={styles.iconButton} type={tab.selected?'primary':'default'} onClick={()=>this.onDelete(tab)}><Icon type="close" /></span>:null} */}
              </span>

            
            
          ))
        }
        {/* <Button className={styles.button} type="default">
            {pageName}
            <Icon type="close" />
        </Button>
        <Button className={styles.button} type="primary">
            {pageName}
            <Icon type="close" />
        </Button>
        <Button className={styles.button} type="default">
            {pageName}
            <Icon type="close" />
        </Button>         */}
        <RightContent {...this.props} />
      </div>
    );
  }
}
