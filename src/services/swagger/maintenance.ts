import { request } from 'umi';

export async function getMaintenanceList(options?: { [key: string]: any }) {
  return request('/api/maintenance/getDeviceMaintenanceRecordList', {
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
