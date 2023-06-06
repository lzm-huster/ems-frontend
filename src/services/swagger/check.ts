import { request } from 'umi';

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
