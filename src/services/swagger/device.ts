import { request } from 'umi';

export async function getDeviceList(options?: { [key: string]: any }) {
  return request('/api/device/getDeviceList', {
    method: 'GET',
    ...(options || {}),
  });
}
