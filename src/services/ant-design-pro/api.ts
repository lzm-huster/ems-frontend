// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**重置密码 /api/user/password/reset */
export async function resetPassword(body: any, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/api/user/password/reset', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/**增加角色 /api/role/add */
export async function addRole(body: any, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/api/role/add', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
/**
 * 
 * @param body 更新用户头像
 * @param options 
 * @returns 
 */
export async function updateAvatar(body: FormData, options?: { [key: string]: any }) {
  return request<API.BaseResponse<string>>('/api/user/updateAvatar', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    requestType: 'form',
    ...(options || {}),
  });
}


/**获取角色详情 */
export async function getRoleDetail(body: any, options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.RoleDetail>>('/api/role/detail', {
    method: 'GET',
    params: {
      roleId: body,
    },
    ...(options || {}),
  });
}

/**获取权限列表 */
export async function permissionList(options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.PermissionSimple[]>>('/api/permission/list', {
    method: 'GET',
    ...(options || {}),
  });
}
/**获取角色列表 */
export async function roleList(options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.RoleSimple[]>>('/api/role/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/**获取用户列表 */
export async function userList(options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.UserInfo[]>>('/api/user/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/**更新用户信息 */
export async function updateInfoById(body: any, userId: any, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/api/user/updateInfo/' + userId, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
/**更新用户头像 */
export async function updateAvatarById(
  body: FormData,
  userId: any,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse<string>>('/api/user/updateAvatar/' + userId, {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    requestType: 'form',
    ...(options || {}),
  });
}
/**新增用户列表 */
export async function addUser(body: API.AddUserReq, options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.UserInfo>>('/api/user/add', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 获取当前的用户 GET /api/currentUser */
/* todo 修改为get*/
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.CurrentUser>>('/api/user/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/user/login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.BaseResponse<string>>('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
/** 注册接口 POST /api/user/register */
export async function register(body: API.RegisterParams, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
