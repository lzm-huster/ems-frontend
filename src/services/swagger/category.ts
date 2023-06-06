import { request } from 'umi';

export async function getDeviceCategoryList(options?: { [key: string]: any }) {
  return request('/api/assetCategory/list', {
    method: 'GET',
    ...(options || {}),
  });
}
