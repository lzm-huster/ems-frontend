import { request } from 'umi';

export async function getRepairList(options?: { [key: string]: any }) {
  return request('/api/repair/getRepairList', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getRepairDetail(
  params: { repairID: number },
  options?: { [key: string]: any },
) {
  return request('/api/repair/getRepairDetail', {
    method: 'GET',
    ...(options || {}),
    params: { ...params },
  });
}

export async function getRepairedNum(options?: { [key: string]: any }) {
  return request('/api/repair/getNumRepair', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getRepairingNum(options?: { [key: string]: any }) {
  return request('/api/repair/getNumCurrentRepair', {
    method: 'GET',
    ...(options || {}),
  });
}
