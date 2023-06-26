import { request } from 'umi';

// /api/PurchaseApply/insertPurchaseApply
export async function insertPurchaseApply(body: any, options?: { [key: string]: any }) {
  return request('/api/PurchaseApply/insertPurchaseApply', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// /api/PurchaseApplySheet/insertPurchaseApplySheet
export async function insertPurchaseApplySheet(body: any, options?: { [key: string]: any }) {
  return request('/api/PurchaseApplySheet/insertPurchaseApplySheet', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function entryPurchaseApplySheet(body: any, options?: { [key: string]: any }) {
  return request('/api/PurchaseApplySheet/updateStateByApplySheetID', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// /api/PurchaseApplySheet/getLatestPurchaseApplySheetID
export async function getLatestPurchaseApplyRecordID(options?: { [key: string]: any }) {
  return request('/api/PurchaseApplySheet/getLatestPurchaseApplySheetID', {
    method: 'GET',
    ...(options || {}),
  });
}
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

export async function getPurchaseApplySheets(
  params: { PurchaseApplySheetID: number },
  options?: { [key: string]: any },
) {
  return request('/api/PurchaseApply/getPurchaseApplyDetailByPurchaseApplySheetID', {
    method: 'GET',
    ...(options || {}),
    params: { ...params },
  });
}
