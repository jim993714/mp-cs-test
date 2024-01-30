/**
 * 获取校园团活动列表参数的类型
 */
export interface ISchoolDumplingParams {
    scrollId?: string;
    type: number;
    studentShopId: string;
}

/**
 * 活动的数据类型
 */
export interface ISchoolDumplingData {
    scrollId: string;
    list: Array<ISchoolDumplingList>;
    bannerList: Array<IBanner>;
}

/**
 * banner类型
 */
export interface IBanner {
    bannerNo: string;
    imageUrl: string;
    backgroundColor: string;
    appAction: string;
}
/**
 * 活动列表的类型
 */

export interface ISchoolDumplingList {
    activityNo: string /*** 活动编号 */;
    schoolDumplingId: string /*** 开团id。可参团有值，可开团中有待成团标识的有值，没有标识的无值	 */;
    goodName: string /*** 商品名称 */;
    studentNum: number /***  成团人数 */;
    productNo: string /*** 产品编号  */;
    goodsNo: string /*** 商品编号 */;
    remainingMemberNum: number /*** 剩余成团人数 */;
    groupBuyPrice: number /*** 团购价 */;
    allowsDeliveryToDormitory: number /*** 是否允许送货上寝室 */;
    showRefundBeforeReturn: number /*** 是否展示先退款后退货标识  */;
    showAwaitingGroupFormation: number /*** 是否 展示待成团标识 */;
    goodsTitle: string;
    goodsCover: string;
    needStudentVerify: number;
    activityStatus: number;
    startTime: number;
    endTime: number;
    expireTime: number;
    isAlter: number;
    hasJoined: number;
}

/**
 * 获取校园团活动明细参数的类型
 */
export interface ISchoolDumplingDetailParams {
    activityNo: number | string;
    schoolDumplingId?: number | string;
}

/**
 * 获取校园团活动明细类型
 */

export interface ISchoolDumplingDetail {
    activityNo: string /***  活动编号 */;
    schoolDumplingId: string /*** 开团id。可参团有值，可开团中有待成团标识的有值，没有标识的无值 */;
    goodsTitle: string /*** 商品名称  */;
    studentNum: number /*** 成团人数 */;
    productNo: string /*** 产品编号 */;
    goodsNo: string /*** 商品编号 */;
    remainingMemberNum: number /*** 剩余成团人数  */;
    groupBuyPrice: number /*** 团购价 */;
    allowsDeliveryToDormitory: number /*** 是否允许送货上寝。0：不允许;1:允许  */;
    showRefundBeforeReturn: number /*** 是否展示先退款后退货标识。0:不展示,1:展示 */;
    showAwaitingGroupFormation: number /*** 是否展示待成团标识。0:不展示（点击购买进入商详开始首单开团）,1:展示（点击购买进入邀请参团）。 */;
    memberHeadImgs: Array<String> /*** 成员头像	 */;
    timeRemaining: number /*** 	距离结束时间的时间差，单位秒 */;
    hasJoined: number /*** 是否已参团购买。0:未参团,1:已参团 */;
    amountOff: string /*** 	减免金额。小程序分享使用  */;
    onlyCampusStaff: number /*** 减免金额。小程序分享使用 */;
    supportLeaderCollection: number /*** 是否仅校内员工开团。0:否,1:是。确认订单页面使用 */;
    status: number /*** 状态：1已成团,0未成团,-1已失效。根据开团状态来判断按钮的显示 */;
    goodsCover: string /*** 商品封面*/;
    needStudentVerify: number;
}
