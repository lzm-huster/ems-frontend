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

export async function getPublicDevice(options?: { [key: string]: any }) {
  return request('/api/device/getPublicDeviceList', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getPersonDeviceList(options?: { [key: string]: any }) {
  return request('/api/device/getPersonDeviceList', {
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

export async function updateDevice(body: FormData, options?: { [key: string]: any }) {
  return request<any>('/api/device/UpdateDevice', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    requestType: 'form',
    ...(options || {}),
  });
}
export async function UpdateDevice(device: API.Device, options?: { [key: string]: any }) {
  return request('/api/device/UpdateDevice', {
    method: 'POST',
    params: device,
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

export async function insertDevice(body: FormData, options?: { [key: string]: any }) {
  return request('/api/device/insertDevice', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    requestType: 'form',
    ...(options || {}),
  });
}

export async function deleteDevice(params: { DeviceID: number }, options?: { [key: string]: any }) {
  return request('/api/device/deleteDeviceByDeviceID', {
    method: 'POST',
    ...(options || {}),
    params: { ...params },
  });
}
