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
