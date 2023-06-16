import { request } from 'umi';

export async function insertCheck(body: FormData, options?: { [key: string]: any }) {
  return request('/api/check/insertDeviceCheckRecord', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    requestType: 'form',
    ...(options || {}),
  });
}

export async function getCheckList(options?: { [key: string]: any }) {
  return request('/api/check/getCheckList', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getCheckDetail(
  params: { checkID: number },
  options?: { [key: string]: any },
) {
  return request('/api/check/getCheckDetail', {
    method: 'GET',
    ...(options || {}),
    params: { ...params },
  });
}

export async function deleteCheckRecord(
  params: { checkID: number },
  options?: { [key: string]: any },
) {
  return request('/api/check/deleteDeviceCheckRecord', {
    method: 'POST',
    ...(options || {}),
    params: { ...params },
  });
}
