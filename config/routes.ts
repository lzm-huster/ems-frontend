export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './Login' },
      { name: '注册', path: '/user/register', component: './Register' },
      { component: './404' },
    ],
  },
  { path: '/home', name: '主页', icon: 'smile', component: './Home' },
  {
    path: '/deviceManagement',
    name: '设备管理',
    icon: 'crown',
    routes: [
      {
        path: '/deviceManagement/list',
        name: '设备信息',
        icon: 'smile',
        component: './DeviceList',
      },
      {
        path: '/deviceManagement/list/addDevice',
        name: '新增设备',
        icon: 'smile',
        component: './AddDevice',
        parentKeys: ['/deviceManagement/list'],
        hideInMenu: true,
      },
      { component: './404' },
    ],
  },
  {
    path: '/personalCenter',
    name: '个人中心',
    icon: 'crown',
    routes: [
      {
        path: '/personalCenter/personalInfo',
        name: '个人信息',
        icon: 'smile',
        component: './PersonalInfo',
      },
      // {
      //   path: '/PersonalCenter/notification',
      //   name: '系统通知',
      //   // icon: 'smile',
      //   component: './DeviceList',
      // },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/manage',
    name: '系统管理',
    icon: 'Appstore',
    routes: [
      {
        path: '/manage/userManage',
        name: '用户管理',
        icon: 'smile',
        component: './SystemManage/UserManage',
      },
    ],
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin/sub-page', name: '二级管理页', icon: 'smile', component: './Home' },
      { component: './404' },
    ],
  },
  { name: '查询表格', icon: 'table', path: '/list', component: './TableList' },
  { path: '/', redirect: '/home' },
  { component: './404' },
];
