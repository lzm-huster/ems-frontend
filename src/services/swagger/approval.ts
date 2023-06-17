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

export async function borrowApprovalList(state: string, options?: { [key: string]: any }) {
  const params = { state };
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

export async function purchaseApprovalRecord(
  purchaseApplySheetID: any,
  state: any,
  options?: { [key: string]: any },
) {
  return request('/api/approval/purchaseApprovalRecord', {
    method: 'POST',
    params: { purchaseApplySheetID, state },
    ...(options || {}),
  });
}

export async function borrowApprovalRecord(
  borrowApplyID: any,
  state: any,
  options?: { [key: string]: any },
) {
  return request('/api/approval/borrowApprovalRecord', {
    method: 'POST',
    params: { borrowApplyID, state },
    ...(options || {}),
  });
}

export async function scrapApprovalRecord(
  scrapID: number,
  state: any,
  options?: { [key: string]: any },
) {
  return request('/api/approval/scrapApprovalRecord', {
    method: 'POST',
    params: { scrapID, state },
    ...(options || {}),
  });
}
