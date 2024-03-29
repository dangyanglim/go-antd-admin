import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/v1/login', {
    method: 'POST',
    data: params,
  });
}

export async function fakeRegister(params) {
  return request('/v1/register', {
    method: 'POST',
    data: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
export async function getMenuTrees(params) {
  const { id } = params;
  return request(`/v1/getAllMenus?id=${id}`);
}
export async function createMenu(params) {
  return request(`/v1/createMenu?${stringify(params)}`);
}
export async function deleteMenu(params) {
  const { id } = params;
  return request(`/v1/deleteMenu?id=${id}`);
}
export async function editMenu(params) {
  return request(`/v1/editMenu?${stringify(params)}`);
}
export async function getRoutes(params) {
  const { id } = params;
  return request(`/v1/getMenus?id=${id}`);
}
export async function getDepartments(params) {
  const { id } = params;
  return request(`/v1/getAllDepartments?id=${id}`);
}
export async function addDepartment(params) {
  return request(`/v1/createDepartment?${stringify(params)}`);
}
export async function editDepartment(params) {
  return request(`/v1/editDepartment?${stringify(params)}`);
}
export async function deleteDepartment(params) {
  const { id } = params;
  return request(`/v1/deleteDepartment?id=${id}`);
}