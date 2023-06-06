import { request } from 'umi';

export async function getScrapList(options?: { [key: string]: any }) {
  return request('/api/scrap/getScrapList', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getScrapDetail(
  params: { scrapID: number },
  options?: { [key: string]: any },
) {
  return request('/api/scrap/getScrapDetail', {
    method: 'GET',
    ...(options || {}),
    params: { ...params },
  });
}
