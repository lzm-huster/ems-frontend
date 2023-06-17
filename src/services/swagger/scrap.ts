import { request } from 'umi';

export async function insertScrap(body: FormData, options?: { [key: string]: any }) {
  return request('/api/scrap/insertDeviceScarpRecord', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    requestType: 'form',
    ...(options || {}),
  });
}

export async function updateScrap(body: FormData, options?: { [key: string]: any }) {
  return request('/api/scrap/updateDeviceScrapRecord', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    requestType: 'form',
    ...(options || {}),
  });
}

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

export async function deleteScrapRecord(
  params: { scrapID: number },
  options?: { [key: string]: any },
) {
  return request('/api/scrap/deleteScrapRecord', {
    method: 'POST',
    ...(options || {}),
    params: { ...params },
  });
}
