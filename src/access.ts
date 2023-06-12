/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  console.log(currentUser);
  const { userPermissionList } = currentUser ?? {};
  return {
    // normalRouteFilter: (route: { name: any }) => userPermissionList?.includes(route.name),
    // deviceList: userPermissionList?.includes(route.name),
    deviceList: (route: any) => userPermissionList?.includes(route.accessCode),
    deviceAdd: (route: any) => userPermissionList?.includes(route.accessCode),
    deviceAddBtn: (prop: any) => userPermissionList?.includes(prop),
    deviceUpdateBtn: (prop: any) => userPermissionList?.includes(prop),
    deviceDeleteBtn: (prop: any) => userPermissionList?.includes(prop),
    purchaseList: (route: any) => userPermissionList?.includes(route.accessCode),
    purchaseAdd: (route: any) => userPermissionList?.includes(route.accessCode),
    purchaseUpdate: (route: any) => userPermissionList?.includes(route.accessCode),
    purchaseDelete: (route: any) => userPermissionList?.includes(route.accessCode),
    purchaseQuery: (route: any) => userPermissionList?.includes(route.accessCode),
    borrowList: (route: any) => userPermissionList?.includes(route.accessCode),
    borrowAdd: (route: any) => userPermissionList?.includes(route.accessCode),
    borrowUpdate: (route: any) => userPermissionList?.includes(route.accessCode),
    borrowDelete: (route: any) => userPermissionList?.includes(route.accessCode),
    borrowQuery: (route: any) => userPermissionList?.includes(route.accessCode),
    repairList: (route: any) => userPermissionList?.includes(route.accessCode),
    repairAdd: (route: any) => userPermissionList?.includes(route.accessCode),
    repairQuery: (route: any) => userPermissionList?.includes(route.accessCode),
    maintenanceList: (route: any) => userPermissionList?.includes(route.accessCode),
    maintenanceAdd: (route: any) => userPermissionList?.includes(route.accessCode),
    maintenanceQuery: (route: any) => userPermissionList?.includes(route.accessCode),
    inventoryList: (route: any) => userPermissionList?.includes(route.accessCode),
    inventoryAdd: (route: any) => userPermissionList?.includes(route.accessCode),
    inventoryQuery: (route: any) => userPermissionList?.includes(route.accessCode),
    scrapList: (route: any) => userPermissionList?.includes(route.accessCode),
    scrapAdd: (route: any) => userPermissionList?.includes(route.accessCode),
    scrapQuery: (route: any) => userPermissionList?.includes(route.accessCode),
    userList: (route: any) => userPermissionList?.includes(route.accessCode),
    roleList: (route: any) => userPermissionList?.includes(route.accessCode),
    approvalUpdate: (route: any) => userPermissionList?.includes(route.accessCode),
  };
}
