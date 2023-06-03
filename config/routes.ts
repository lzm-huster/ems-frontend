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
        component: './DeviceManagement/DeviceList',
      },
      {
        path: '/deviceManagement/list/addDevice',
        name: '新增设备',
        icon: 'smile',
        component: './DeviceManagement/DeviceList/AddDevice',
        parentKeys: ['/deviceManagement/list'],
        hideInMenu: true,
      },
      {
        path: '/deviceManagement/repair',
        name: '设备维修',
        icon: 'smile',
        component: './DeviceManagement/DeviceRepair',
      },
      {
        path: '/deviceManagement/check',
        name: '设备核查',
        icon: 'smile',
        component: './DeviceManagement/DeviceCheck',
      },
      {
        path: '/deviceManagement/check/add',
        name: '新增核查记录',
        icon: 'smile',
        component: './DeviceManagement/DeviceCheck/AddCheck',
        parentKeys: ['/deviceManagement/check'],
        hideInMenu: true,
      },
      {
        path: '/deviceManagement/scrap',
        name: '设备报废',
        icon: 'smile',
        component: './DeviceManagement/DeviceScrap',
      },
      {
        path: '/deviceManagement/scrap/add',
        name: '新增报废记录',
        icon: 'smile',
        component: './DeviceManagement/DeviceScrap/AddScrap',
        parentKeys: ['/deviceManagement/scrap'],
        hideInMenu: true,
      },
      { component: './404' },
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
      {
        path: '/manage/system',
        name: '系统说明',
        icon: 'smile',
        component: './SystemManage/SystemDesc',
      },
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
      {
        path: '/personalCenter/personalInfo/edit',
        name: '编辑个人信息',
        component: './PersonalInfo/Edit',
        parentKeys: ['/personalCenter/personalInfo'],
        hideInMenu: true,
      },
      {
        component: './404',
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
  { path: '/', redirect: '/home' },
  { component: './404' },
];
