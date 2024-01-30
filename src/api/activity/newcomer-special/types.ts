/**商品列表类型*/
export interface IGoodsData {
    list: Array<ICouponGoodsItem>;
    scrollId: string;
}

/** 新人券商品类型 */
export interface ICouponGoodsItem {
    goodsNo: string;
    goodsCover: string;
    goodsTitle: string;
    recommendWords: string;
    goodsPriceOrigin: number;
    goodsPrice: number;
    activityId: string;
}

export interface IGoodsList {
    goodsPrice: number /**商品价格*/;
    activityId: string /**活动编号*/;
    activityNo: string /**活动编号,如果是大促就是大促的活动编号,如果是校园团就是校园团活动的编号*/;
    activityType: number /**3:大促,4:校园团	*/;
    isFullCut: number /**是否满减1满减,0没有满减*/;
    goodsNo: string /**商品编号*/;
    goodsCover: string /**商品封面*/;
    goodsTitle: string /**商品标题*/;
}
/**商品列表传参*/
export interface IGoodsDataParams {
    scrollId?: string;
    size?: number;
    studentShopId?: string;
    categoryId?: number | string;
    searchType?: number | string;
    sortField?: string;
    sortType?: string;
    keyWord?: string;
    priceRange?: string;
}

/**新粉券包类型*/
export interface INewCoupon {
    money: number /**新粉券包金额*/;
    isReceived: number /**是否已领取*/;
    num: number /**	数量*/;
    receiveStatus: number /**	1可领取,2已领过,3已领完*/;
    isSelf: number /**是否是自己的校园店1是0否*/;
    couponNum: number /**券包里面的优惠券的数量*/;
    showNewPerson: number /**是否有新人优惠券,1是否有新人专区,0没有*/;
}

/**券包领取返回值*/

export interface INewCouponReceive {
    ticket: string;
}

/**查询券包领取*/
export interface ICheckCouponData {
    result: number;
    failReason: string;
    couponList: Array<ICouponList>;
}

export interface ICouponList {
    useLimitStudentShopType: number;
    useEndTime: number;
    desc: string;
    isReceived: number;
    title: string;
    couponNo: string;
    discountNum: number;
    discountInfo: string;
    discountLimitType: number;
    discountLimit: number;
}
