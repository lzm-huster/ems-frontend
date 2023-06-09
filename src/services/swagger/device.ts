import { request } from 'umi';

export async function getDeviceList(options?: { [key: string]: any }) {
  return request('/api/device/getDeviceList', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getAssetNumber(options?: { [key: string]: any }) {
  return request('/api/device/getDeviceIDAndAssetNumber', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getPublicAssetNumber(options?: { [key: string]: any }) {
  return request('/api/device/getPublicDeviceIDAndAssetNumber', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function UpdateDevice(options?: { [key: string]: any }) {
  return request<any>('/api/device/UpdateDevice', {
    method: 'POST',
    ...(options || {}),
  });
}

export async function getDeviceDetail(
  params: { DeviceID: number },
  options?: { [key: string]: any },
) {
  return request('/api/device/getDeviceDetail', {
    method: 'GET',
    ...(options || {}),
    params: { ...params },
  });
}
// export async function insertDevice(
//   params: {
//     // path
//     /** name that need to be updated */

//     userName: string;
//   },
//   options?: { [key: string]: any },
// ) {
//   const { username: param0 } = params;
//   return request<any>(`/user/${param0}`, {
//     method: 'PUT',
//     params: { ...params },
//     ...(options || {}),
//   });
// }
