import { getMenuTrees,createMenu,deleteMenu,editMenu } from '@/services/api';
import { message} from 'antd';
export default {
  namespace: 'menuManage',

  state: {
    loading: false,
    treeData:[]
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getMenuTrees,payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *add({ payload }, { call, put }) {
      console.log("add")
      const response = yield call(createMenu,payload);
      console.log(response)
      if(response.code==200){
        message.success('添加成功');       
      }else{
        message.error(response.msg)
      }
    },
    *delete({ payload }, { call, put }) {
      console.log("add")
      const response = yield call(deleteMenu,payload);
      if(response.code==200){
        message.success('删除成功');      
      }else{
        message.error(response.msg)
      }
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(editMenu,payload);
      console.log(response)
      if(response.code==200){
        message.success('修改成功'); 
        return response      
      }else{
        message.error(response.msg)
      }
    },
    *fetchSalesData(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: {
          salesData: response.salesData,
        },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        treeData:payload,
      };
    },
    clear() {
      return {
        visitData: [],
        visitData2: [],
        salesData: [],
        searchData: [],
        offlineData: [],
        offlineChartData: [],
        salesTypeData: [],
        salesTypeDataOnline: [],
        salesTypeDataOffline: [],
        radarData: [],
      };
    },
  },
};
