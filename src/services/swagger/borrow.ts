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

//   export async function getBorrowApplyRecordList(options?: { [key: string]: any }) {
//     return request('/api/BorrowApplyRecord/getBorrowApplyRecordList', {
//       method: 'GET',
//       ...(options || {}),
//     });
//   }
