import { request } from 'umi';

export async function getPurchaseApplySheetList(options?: { [key: string]: any }) {
  return request('/api/PurchaseApplySheet/getPurchaseApplySheetList', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getPurchaseApplySheetByID(
  params: { PurchaseApplySheetID: number },
  options?: { [key: string]: any },
) {
  return request('/api/PurchaseApplySheet/getPurchaseApplySheetByID', {
    method: 'GET',
    ...(options || {}),
    params: { ...params },
  });
}
