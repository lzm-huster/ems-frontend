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
