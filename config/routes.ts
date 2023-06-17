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
        access: 'deviceList',
        accessCode: 'device:list',
      },
      {
        path: '/deviceManagement/list/addDevice',
        name: '新增设备',
        icon: 'smile',
        component: './DeviceManagement/DeviceList/AddDevice',
        parentKeys: ['/deviceManagement/list'],
        access: 'deviceAdd',
        accessCode: 'device:add',

        hideInMenu: true,
      },
      {
        path: '/deviceManagement/list/detail',
        name: '设备详情',
        icon: 'smile',
        component: './DeviceManagement/DeviceList/DeviceDetail',
        parentKeys: ['/deviceManagement/list'],
        hideInMenu: true,
        // access: 'repairQuery',
        // accessCode: 'repair:query',
      },
      {
        path: '/deviceManagement/purchaseApply',
        name: '采购申请',
        icon: 'smile',
        component: './DeviceManagement/PurchaseApplication',
        access: 'purchaseList',
        accessCode: 'purchase:list',
      },
      {
        path: '/deviceManagement/purchaseApply/addPurchaseApply',
        name: '新增设备采购申请',
        icon: 'smile',
        component: './DeviceManagement/PurchaseApplication/AddPurchaseApp',
        parentKeys: ['/deviceManagement/purchaseApply'],
        hideInMenu: true,
        access: 'purchaseAdd',
        accessCode: 'purchase:add',
      },
      {
        path: '/deviceManagement/borrow',
        name: '设备借用',
        icon: 'smile',
        component: './DeviceManagement/DeviceBorrow',
        access: 'borrowList',
        accessCode: 'borrow:list',
      },
      {
        path: '/deviceManagement/borrow/addBorrowApply',
        name: '新增设备借用申请',
        icon: 'smile',
        component: './DeviceManagement/DeviceBorrow/AddBorrowApp',
        parentKeys: ['/deviceManagement/borrow'],
        hideInMenu: true,
        access: 'borrowAdd',
        accessCode: 'borrow:add',
      },
      {
        path: '/deviceManagement/repair',
        name: '设备维修',
        icon: 'smile',
        component: './DeviceManagement/DeviceRepair',
        access: 'repairList',
        accessCode: 'repair:list',
      },
      {
        path: '/deviceManagement/repair/addRepair',
        name: '新增维修记录',
        icon: 'smile',
        component: './DeviceManagement/DeviceRepair/AddRepair',
        parentKeys: ['/deviceManagement/repair'],
        hideInMenu: true,
        access: 'repairAdd',
        accessCode: 'repair:add',
      },
      {
        path: '/deviceManagement/repair/detail',
        name: '维修记录详情',
        icon: 'smile',
        component: './DeviceManagement/DeviceRepair/RepairDetail',
        parentKeys: ['/deviceManagement/repair'],
        hideInMenu: true,
        access: 'repairQuery',
        accessCode: 'repair:query',
      },
      {
        path: '/deviceManagement/maintenance',
        name: '设备保养',
        icon: 'smile',
        component: './DeviceManagement/DeviceMaintenance',
        access: 'maintenanceList',
        accessCode: 'maintenance:list',
      },
      {
        path: '/deviceManagement/maintenance/addMaintenance',
        name: '新增保养记录',
        icon: 'smile',
        component: './DeviceManagement/DeviceMaintenance/AddMaintenance',
        parentKeys: ['/deviceManagement/maintenance'],
        hideInMenu: true,
        access: 'maintenanceAdd',
        accessCode: 'maintenance:add',
      },
      {
        path: '/deviceManagement/maintenance/detail',
        name: '保养记录详情',
        icon: 'smile',
        component: './DeviceManagement/DeviceMaintenance/MaintenanceDetail',
        parentKeys: ['/deviceManagement/maintenance'],
        hideInMenu: true,
        access: 'maintenanceQuery',
        accessCode: 'maintenance:query',
      },
      {
        path: '/deviceManagement/check',
        name: '设备核查',
        icon: 'smile',
        component: './DeviceManagement/DeviceCheck',
        access: 'inventoryList',
        accessCode: 'inventory:list',
      },
      {
        path: '/deviceManagement/check/add',
        name: '新增核查记录',
        icon: 'smile',
        component: './DeviceManagement/DeviceCheck/AddCheck',
        parentKeys: ['/deviceManagement/check'],
        hideInMenu: true,
        access: 'inventoryAdd',
        accessCode: 'inventory:add',
      },
      {
        path: '/deviceManagement/check/detail',
        name: '核查记录详情',
        icon: 'smile',
        component: './DeviceManagement/DeviceCheck/DetailCheck',
        parentKeys: ['/deviceManagement/check'],
        hideInMenu: true,
        access: 'inventoryQuery',
        accessCode: 'inventory:query',
      },
      {
        path: '/deviceManagement/scrap',
        name: '设备报废',
        icon: 'smile',
        component: './DeviceManagement/DeviceScrap',
        access: 'scrapList',
        accessCode: 'scrap:list',
      },
      {
        path: '/deviceManagement/scrap/addScrap',
        name: '新增报废记录',
        icon: 'smile',
        component: './DeviceManagement/DeviceScrap/AddScrap',
        parentKeys: ['/deviceManagement/scrap'],
        hideInMenu: true,
        access: 'scrapAdd',
        accessCode: 'scrap:add',
      },
      {
        path: '/deviceManagement/scrap/scrapDetail',
        name: '报废记录详情',
        icon: 'smile',
        component: './DeviceManagement/DeviceScrap/ScrapDetail',
        parentKeys: ['/deviceManagement/scrap'],
        hideInMenu: true,
        access: 'scrapQuery',
        accessCode: 'scrap:query',
      },
      {
        path: '/deviceManagement/statistics',
        name: '信息统计',
        icon: 'smile',
        component: './DeviceManagement/DeviceStatistics',
        // access: 'scrapList',
        // accessCode: 'scrap:list',
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
        access: 'userList',
        accessCode: 'user:list',
      },
      {
        path: '/manage/anthManage',
        name: '角色管理',
        icon: 'smile',
        access: 'roleList',
        accessCode: 'role:list',
        component: './SystemManage/AuthManage',
      },
      // {
      //   path: '/manage/system',
      //   name: '系统说明',
      //   icon: 'smile',
      //   component: './SystemManage/SystemDesc',
      // },
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
        component: './PersonalInfo/PersonCenter',
      },
      {
        //added
        path: '/personalCenter/personalInfo/editDetail',
        name: '编辑个人信息',
        component: './PersonalInfo/EditDetail',
        parentKeys: ['/personalCenter/personalInfo'],
        hideInMenu: true,
      },
      {
        path: '/personalCenter/approvalCenter',
        name: '审批中心',
        // icon: 'smile',
        component: './PersonalInfo/ApprovalCenter',
      },
      {
        path: '/personalCenter/systemNotification',
        name: '系统通知',
        icon: 'smile',
        component: './PersonalInfo/SystemNotification',
      },
      {
        component: './404',
      },
    ],
  },

  // {
  //   path: '/admin',
  //   name: '管理页',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   routes: [
  //     { path: '/admin/sub-page', name: '二级管理页', icon: 'smile', component: './Home' },
  //     { component: './404' },
  //   ],
  // },
  { path: '/', redirect: '/home' },
  { component: './404' },
];
