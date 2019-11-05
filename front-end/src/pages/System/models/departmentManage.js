import { getMenuTrees,createMenu,deleteMenu,editMenu,getDepartments,addDepartment,editDepartment,deleteDepartment} from '@/services/api';
import { message} from 'antd';
export default {
  namespace: 'departmentManage',

  state: {
    loading: false,
    treeData:[]
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getDepartments,payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *add({ payload }, { call, put }) {
      console.log("add")
      const response = yield call(addDepartment,payload);
      console.log(response)
      if(response.code==200){
        message.success('添加成功');       
      }else{
        message.error(response.msg)
      }
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(deleteDepartment,payload);
      if(response.code==200){
              
      }else{
        message.error(response.msg)
      }
      return response
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(editDepartment,payload);
      console.log(response)
      if(response.code==200){

             
      }else{
        message.error(response.msg)
      }
      return response 
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
