// @ts-ignore
/* eslint-disable */

declare namespace API {
  type Order = {
    id?: number;
    petId?: number;
    quantity?: number;
    shipDate?: string;
    /** Order Status */
    status?: 'placed' | 'approved' | 'delivered';
    complete?: boolean;
  };

  type Category = {
    id?: number;
    name?: string;
  };

  type User = {
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    /** User Status */
    userStatus?: number;
  };

  type Tag = {
    id?: number;
    name?: string;
  };

  type Pet = {
    id?: number;
    category?: Category;
    name: string;
    photoUrls: string[];
    tags?: Tag[];
    /** pet status in the store */
    status?: 'available' | 'pending' | 'sold';
  };

  type ApiResponse = {
    code?: number;
    type?: string;
    message?: string;
  };

  // type Device = {
  //   deviceID?: number;
  //   deviceModel: string;
  //   deviceName: string;
  //   deviceState: string;
  //   deviceType: string;
  //   purchaseDate: string;
  //   userName: string;
  // }
  

    type ApprovalRecord = {
    purchaseApplySheetID?: number;
    state?: string;
    purchaseApplicantID?: number;
    purchaseApplyDate?: string;
    purchaseApplyDescription?: string;
    approveTutorID?: number;
    isDeleted?: boolean;
    createTime?: string;
    updateTime?: string;
  };

  type Device = {
    deviceID: number;
    deviceName: string;
    deviceModel: string;
    deviceType: string;
    deviceSpecification: string;
    deviceImageList: string;
    deviceState: string;
    userID: number;
    isPublic: number;
    stockQuantity: number;
    unitPrice: number;
    borrowRate: number;
    purchaseDate: string;
    assetNumber: string;
    expectedScrapDate: string;
    isDeleted: number;
    createTime: string;
    updateTime: string;
  };
}
