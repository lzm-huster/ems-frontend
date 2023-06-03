import { request } from 'umi';

export async function getPurchaseApplySheetList(options?: { [key: string]: any }) {
  return request('/api/PurchaseApplySheet/getPurchaseApplySheetList', {
    method: 'GET',
    ...(options || {}),
  });
}
