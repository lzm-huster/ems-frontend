// @ts-ignore
/* eslint-disable */

declare namespace API {
  type BaseResponse<T> = {
    code?: number;
    data?: T;
    message?: string;
  };
  type LoginParams = {
    userNumber?: string;
    password?: string;
    loginType?: number;
  };
  type RegisterParams = {
    captcha: string;
    confirm: string;
    email: string;
    idnumber: string;
    password: string;
    phoneNumber: string;
    registerType: number;
    userName: string;
  };
  type CurrentUser = {
    userName: string;
    gender: string;

    phoneNumber: string;
    avatar: object;
    department: string;
    email: string;
    roleList: string[];
    userPermissionList: string[];
    idnumber: string;
  };
  type UserInfo = {
    avatar: string;
    createTime: Date;
    department: string;
    email: string;
    gender: string;
    idnumber: string;
    phoneNumber: string;
    roleName: string;
    roleDescription: string;
    userName: string;
  };
  type AddUserReq = {
    roleId: number;
    department: string;
    email: string;
    gender: string;
    idnumber: string;
    password: string;
    phoneNumber: string;
    userName: string;
  };
  type UpdateUserReq = {
    department: string;
    email: string;
    gender: string;
    idnumber: string;
    phoneNumber: string;
    roleId: number;
    userName: string;
  };

  // type ResponseData = {
  //   avatar: string;
  //   department: string;
  //   email: string;
  //   gender: string;
  //   idnumber: string;
  //   password: string;
  //   phoneNumber: string;
  //   userName: string;
  // };
  type RoleSimple = {
    roleDescription: string;
    roleID: number;
    roleName: string;
  };
  type RoleDetail = {
    roleID: number;
    roleName: string;
    roleDescription: string;
    permissionSimpleResListList: PermissionSimple[];
  };

  type PermissionSimple = {
    permissionDescription: string;
    permissionID: number;
    permissionName: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
