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

// export async function purchaseApprovalRecord(body: any) {
//   return request('/api/approval/purchaseApprovalRecord', {
//     method: 'POST',
//     data: body,
//   });
// }

export async function purchaseApprovalRecord(
  purchaseApplySheet: API.ApprovalRecord,
  state: string,
  options?: { [key: string]: any },
) {
  return request('/api/approval/purchaseApprovalRecord', {
    method: 'POST',
    params: { purchaseApplySheet, state },
    ...(options || {}),
  });
}

export async function updatePassword(
  body: {
    oldPass: string;
    newPass: string;
    confirm: string;
  },
  options?: { [key: string]: any },
) {
  return request(`/api/user/updatePassword`, {
    method: 'POST',
    data: body,
  });
}

export async function borrowApprovalRecord(body: any) {
  return request('​/api​/approval​/borrowApprovalRecord', {
    method: 'POST',
    data: body,
  });
}

export async function scrapApprovalRecord(body: any) {
  return request('/api/approval/scrapApprovalRecord', {
    method: 'POST',
    data: body,
  });
}
