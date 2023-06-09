import { request } from 'umi';

export async function getBorrowApplyRecordList(options?: { [key: string]: any }) {
  return request('/api/BorrowApplyRecord/getBorrowApplyRecordList', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getBorrowApplySheets(params: any, options?: { [key: string]: any }) {
  return request('/api/BorrowApplySheet/getBorrowApplySheets', {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
}

export async function getBorrowDeviceNumber(options?: { [key: string]: any }) {
  return request('/api/BorrowApplyRecord/getBorrowDeviceNumber', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getReturnDeviceNumber(options?: { [key: string]: any }) {
  return request('/api/BorrowApplyRecord/getReturnDeviceNumber', {
    method: 'GET',
    ...(options || {}),
  });
}
// /api/BorrowApplyRecord/insertBorrowApplyRecord
export async function insertBorrowApplyRecord(body: any, options?: { [key: string]: any }) {
  return request('/api/BorrowApplyRecord/insertBorrowApplyRecord', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function updateBorrowApplyRecord(body: any, options?: { [key: string]: any }) {
  return request('/api/BorrowApplyRecord/updateBorrowApplyRecord', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// /api/BorrowApplySheet/insertBorrowApplySheet
export async function insertBorrowApplySheet(body: any, options?: { [key: string]: any }) {
  return request('/api/BorrowApplySheet/insertBorrowApplySheet', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function updateBorrowApplySheet(body: any, options?: { [key: string]: any }) {
  return request('/api/BorrowApplySheet/updateBorrowApplySheet', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// /api/BorrowApplyRecord/getLatestBorrowApplyRecordID
export async function getLatestBorrowApplyRecordID(options?: { [key: string]: any }) {
  return request('/api/BorrowApplyRecord/getLatestBorrowApplyRecordID', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function deleteBorrowRecord(
  params: { BorrowApplyID: number },
  options?: { [key: string]: any },
) {
  return request('/api/BorrowApplyRecord/deleteBorrowApplyRecordByBorrowApplyID', {
    method: 'POST',
    ...(options || {}),
    params: { ...params },
  });
}

export async function returnBorrowRecord(
  params: { BorrowApplyID: number },
  options?: { [key: string]: any },
) {
  return request('/api/BorrowApplyRecord/updateReturnRecordAndDeviceState', {
    method: 'POST',
    ...(options || {}),
    params: { ...params },
  });
}

export async function getBorrowFeeList(options?: { [key: string]: any }) {
  return request('/api/BorrowApplySheet/getAllBorrowFeeRecord', {
    method: 'GET',
    ...(options || {}),
  });
}
//   export async function getBorrowApplyRecordList(options?: { [key: string]: any }) {
//     return request('/api/BorrowApplyRecord/getBorrowApplyRecordList', {
//       method: 'GET',
//       ...(options || {}),
//     });
//   }
