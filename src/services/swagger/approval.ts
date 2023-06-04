import { request } from 'umi';

// export async function purchaseApprovalList(options?: { [key: string]: any }) {
//   return request('/api/PurchaseApplySheet/purchaseApprovalList', {
//     method: 'GET',
//     ...(options || {}),
//   });
// }

// export async function purchaseApprovalList(state:string, token:string) {
//   const url = 'api/approval/purchaseApprovalList?param1=${state}&param2=${token}';
//   return request(url, {
//     method: 'GET',
//   });
// }
// export async function purchaseApprovalList(params: {state: string;},options?: { [key: string]: any },) {
//   const { state: param0 } = params;
//   const url = 'api/approval/purchaseApprovalList';
//   return request(url, {
//     ...(options || {}),
//     params: { ...params },
//     method: 'GET',
//   });
// }

// export async function purchaseApprovalList(
//   params: {
//     // path
//     /** ID of pet to return */
//     state: string;
//   },
//   options?: { [key: string]: any },
// ) {
//   const { state: param0 } = params;
//   return request<any>(`/pproval/${param0}`, {
//     method: 'GET',
//     params: { ...params },

//     ...(options || {}),
//   });
// }

export async function purchaseApprovalList(
  params: {
    // path
    /** The name that needs to be deleted */
    state: string;
  },
  options?: { [key: string]: any },
) {
  const { state: param0 } = params;
  return request('/api/approval/purchaseApprovalList', {
    method: 'GET',
    data: { ...params },
    ...(options || {}),
  });
}
