import { request } from 'umi';

export async function getNoticeDetail(options?: { [key: string]: any }) {
  return request('/api/notice/list', {
    method: 'GET',
    ...(options || {}),
  });
}
