/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  console.log(currentUser);
  const { userPermissionList, roleList } = currentUser ?? {};
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
    purchaseAddBtn: (prop: any) => userPermissionList?.includes(prop),
    purchaseUpdateBtn: (prop: any) => userPermissionList?.includes(prop),
    purchaseDeleteBtn: (prop: any) => userPermissionList?.includes(prop),
    purchaseQuery: (route: any) => userPermissionList?.includes(route.accessCode),
    borrowList: (route: any) => userPermissionList?.includes(route.accessCode),
    borrowAdd: (route: any) => userPermissionList?.includes(route.accessCode),
    borrowAddBtn: (prop: any) => userPermissionList?.includes(prop),
    borrowUpdateBtn: (prop: any) => userPermissionList?.includes(prop),
    borrowDeleteBtn: (prop: any) => userPermissionList?.includes(prop),
    borrowQuery: (route: any) => userPermissionList?.includes(route.accessCode),
    repairList: (route: any) => userPermissionList?.includes(route.accessCode),
    repairAdd: (route: any) => userPermissionList?.includes(route.accessCode),
    repairAddBtn: (prop: any) => userPermissionList?.includes(prop),
    repairUpdateBtn: (prop: any) => userPermissionList?.includes(prop),
    repairDeleteBtn: (prop: any) => userPermissionList?.includes(prop),
    repairQuery: (route: any) => userPermissionList?.includes(route.accessCode),
    maintenanceList: (route: any) => userPermissionList?.includes(route.accessCode),
    maintenanceAdd: (route: any) => userPermissionList?.includes(route.accessCode),
    maintenanceAddBtn: (prop: any) => userPermissionList?.includes(prop),
    maintenanceUpdateBtn: (prop: any) => userPermissionList?.includes(prop),
    maintenanceDeleteBtn: (prop: any) => userPermissionList?.includes(prop),
    maintenanceQuery: (route: any) => userPermissionList?.includes(route.accessCode),
    inventoryList: (route: any) => userPermissionList?.includes(route.accessCode),
    inventoryAdd: (route: any) => userPermissionList?.includes(route.accessCode),
    inventoryAddBtn: (prop: any) => userPermissionList?.includes(prop),
    inventoryUpdateBtn: (prop: any) => userPermissionList?.includes(prop),
    inventoryDeleteBtn: (prop: any) => userPermissionList?.includes(prop),
    inventoryQuery: (route: any) => userPermissionList?.includes(route.accessCode),
    scrapList: (route: any) => userPermissionList?.includes(route.accessCode),
    scrapAdd: (route: any) => userPermissionList?.includes(route.accessCode),
    scrapAddBtn: (prop: any) => userPermissionList?.includes(prop),
    scrapUpdateBtn: (prop: any) => userPermissionList?.includes(prop),
    scrapDeleteBtn: (prop: any) => userPermissionList?.includes(prop),
    scrapQuery: (route: any) => userPermissionList?.includes(route.accessCode),
    userList: (route: any) => userPermissionList?.includes(route.accessCode),
    roleList: (route: any) => userPermissionList?.includes(route.accessCode),
    approvalUpdate: (route: any) => userPermissionList?.includes(route.accessCode),
    approvalList: (route: any) => userPermissionList?.includes(route.accessCode),
    deviceAdmin: () => {
      if (roleList === undefined || roleList?.length === 0) return false;
      else {
        const role: string = roleList[0];
        if (role == 'deviceAdmin') {
          return true;
        } else {
          return false;
        }
      }
    },
    isStudent: () => {
      if (roleList === undefined || roleList?.length === 0) return false;
      else {
        const role: string = roleList[0];
        if (role == 'internalStudent') {
          return true;
        } else {
          return false;
        }
      }
    },
  };
}
