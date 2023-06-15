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

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
