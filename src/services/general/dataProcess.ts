interface Category {
  categoryCode: string;
  categoryDesc: string;
  categoryId: number;
  categoryLevel: number;
  categoryName: string;
  categoryRemark: string;
  parentId: number;
  unit: string;
}

interface Asset {
  DeviceID: number;
  AssetNumber: string;
}

interface Staff {
  avatar: string;
  createTime: string;
  department: string;
  email: string;
  gender: string;
  idnumber: string;
  phoneNumber: string;
  roleDescription: string;
  roleID: number;
  roleName: string;
  userID: number;
  userName: string;
}

export function convertToTreeData(categories: Category[], parentId: number = 0) {
  const treeData = [];
  categories.forEach((category) => {
    if (category.parentId === parentId) {
      const node = {
        title:
          category.categoryDesc == null
            ? category.categoryName
            : category.categoryName + '-' + category.categoryDesc,
        value: category.categoryCode,
        key: category.categoryCode,
      };
      const children = convertToTreeData(categories, category.categoryId);
      if (children.length > 0) {
        node.children = children;
      }
      treeData.push(node);
    }
  });
  return treeData;
}

export function convertToSelectData(assets: Asset[]) {
  const selectData = [];
  assets.forEach((asset) => {
    const node = {
      label: asset.AssetNumber,
      value: asset.DeviceID,
      key: asset.DeviceID,
    };
    selectData.push(node);
  });
  return selectData;
}

export function convertToSelectStaff(staffs: Staff[]) {
  const selectData = [];
  staffs.forEach((staff) => {
    const node = {
      label: staff.userName,
      value: staff.userID,
      key: staff.userID,
    };
    selectData.push(node);
  });
  return selectData;
}

export function getMonth1st(monthNum: number) {
  let data = new Date();
  const li = [];
  data.setDate(1);
  data.setHours(0);
  data.setSeconds(0);
  data.setMinutes(0);
  data.setMilliseconds(0);
  li.unshift(data.getTime());
  for (let i = 0; i < monthNum - 1; i++) {
    data.setDate(0);
    li.unshift(li[0] - data.getDate() * 24 * 3600 * 1000);
    data = new Date(li[0]);
  }
  return li;
}
