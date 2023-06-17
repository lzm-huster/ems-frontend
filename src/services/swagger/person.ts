import { request } from 'umi';

export async function deleteDeviceByDeviceID(
  params: {
    // path
    /** The name that needs to be deleted */
    DeviceID: number;
  },
  options?: { [key: string]: any },
) {
  const { DeviceID: param0 } = params;
  return request(`/api/device/deleteDeviceByDeviceID?DeviceID=${param0}`, {
    method: 'POST',
    data: { ...params },
    ...(options || {}),
  });
}

export async function updateInfo(body: any) {
  return request(`/api/user/updateInfo`, {
    method: 'POST',
    data: body,
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
