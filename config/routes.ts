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
        path: '/deviceManagement/repair/addRecord',
        name: '新增维修记录',
        icon: 'smile',
        component: './DeviceManagement/DeviceRepair/AddRepair',
        parentKeys: ['/deviceManagement/repair'],
        hideInMenu: true,
      },
      {
        path: '/deviceManagement/maintenance',
        name: '设备保养',
        icon: 'smile',
        component: './DeviceManagement/DeviceMaintenance',
      },
      {
        path: '/deviceManagement/check',
        name: '设备核查',
        icon: 'smile',
        component: './DeviceManagement/DeviceCheck',
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
