import { request } from 'umi';

export async function getRepairList(options?: { [key: string]: any }) {
  return request('/api/repair/getRepairList', {
    method: 'GET',
    ...(options || {}),
  });
}
