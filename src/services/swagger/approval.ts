import { request } from 'umi';

///修改了请求
export async function purchaseApprovalList(state: string, options?: { [key: string]: any }) {
  const params = { state };
  return request('/api/approval/purchaseApprovalList', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function repairApprovalList(state: string, options?: { [key: string]: any }) {
  const params = { state }; //todo:将borrow改为repair
  return request('/api/approval/borrowApprovalList', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function scrapApprovalList(state: string, options?: { [key: string]: any }) {
  const params = { state };
  return request('/api/approval/scrapApprovalList', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
