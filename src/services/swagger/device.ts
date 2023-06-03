import { request } from 'umi';

export async function getDeviceList(options?: { [key: string]: any }) {
  return request('/api/device/getDeviceList', {
    method: 'GET',
    ...(options || {}),
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
