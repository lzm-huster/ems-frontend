import { request } from 'umi';

export async function getDeviceList(options?: { [key: string]: any }) {
  return request('http://101.43.18.103:8101/api/device/getDeviceList', {
    method: 'GET',
    ...(options || {}),
  });
}
