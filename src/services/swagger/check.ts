import { request } from 'umi';

export async function getCheckList(options?: { [key: string]: any }) {
  return request('/api/check/getCheckList', {
    method: 'GET',
    ...(options || {}),
  });
}
