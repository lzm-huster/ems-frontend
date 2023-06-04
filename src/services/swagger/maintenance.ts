import { request } from 'umi';

export async function getMaintenanceList(options?: { [key: string]: any }) {
  return request('/api/maintenance/getDeviceMaintenanceRecordList', {
    method: 'GET',
    ...(options || {}),
  });
}
