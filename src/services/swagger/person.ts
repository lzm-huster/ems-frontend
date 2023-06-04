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
