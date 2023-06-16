import { request } from 'umi';

export async function getMaintenanceList(options?: { [key: string]: any }) {
  return request('/api/maintenance/getDeviceMaintenanceRecordList', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getMaintenanceNum(options?: { [key: string]: any }) {
  return request('/api/maintenance/getMaintenanceDeviceNumber', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getMaintenanceDetail(
  params: { maintenanceId: number },
  options?: { [key: string]: any },
) {
  return request('/api/maintenance/deviceMaintenanceDetailQuery', {
    method: 'GET',
    ...(options || {}),
    params: { ...params },
  });
}

export async function insertMaintenance(body: any, options?: { [key: string]: any }) {
  return request('/api/maintenance/deviceMaintenanceListInsert', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function updateMaintenance(params: any, options?: { [key: string]: any }) {
  return request('/api/maintenance/deviceMaintenanceListUpdate', {
    method: 'POST',
    params: params,
    ...(options || {}),
  });
}

export async function deleteMaintenanceRecord(
  params: { maintenanceID: number },
  options?: { [key: string]: any },
) {
  return request('/api/maintenance/deleteDeviceMaintenanceRecordByMaintenanceID', {
    method: 'POST',
    ...(options || {}),
    params: { ...params },
  });
}
