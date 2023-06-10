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

export async function insertMaintenance(
  params: {
    deviceID: number;
    deviceName: string;
    remark: string;
    maintenanceContent: string;
    maintenanceTime: string;
    maintenanceID: number;
  },
  options?: { [key: string]: any },
) {
  return request('/api/maintenance/insertDeviceMaintenanceRecord', {
    method: 'POST',
    params: { ...params },
    ...(options || {}),
  });
}
