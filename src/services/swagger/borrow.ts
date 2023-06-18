import { request } from 'umi';

export async function getBorrowApplyRecordList(options?: { [key: string]: any }) {
  return request('/api/BorrowApplyRecord/getBorrowApplyRecordList', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getBorrowDeviceNumber(options?: { [key: string]: any }) {
  return request('/api/BorrowApplyRecord/getBorrowDeviceNumber', {
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
// /api/BorrowApplySheet/insertBorrowApplySheet
export async function insertBorrowApplySheet(body: any, options?: { [key: string]: any }) {
  return request('/api/BorrowApplySheet/insertBorrowApplySheet', {
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

//   export async function getBorrowApplyRecordList(options?: { [key: string]: any }) {
//     return request('/api/BorrowApplyRecord/getBorrowApplyRecordList', {
//       method: 'GET',
//       ...(options || {}),
//     });
//   }
