/**优惠券列表*/
export interface ICouponList {
    title: string /** 优惠券标题	 */;
    desc: string /** 优惠券简介	*/;
    useLimitStudentShopType: number /**使用范围限制，1:全部校园店，2:用于购买的校园店，3:指定校园店可用，4:校园店不可用	 */;
    useEndTime: number /**使用结束时间	 */;
    discountLimitType: number /**优惠门槛类型，0:无门槛，1:满金额，2:满数量	 */;
    discountNum: number /** 优惠额度，根据discount_limit_type	*/;
    discountInfo: string /** 	*/;
    isReceived: number /** 领取状态, 0:未领取, 1:已领取*/;
    discountLimit: number /**优惠门槛	 */;
    getCount: number /**优惠券领取数量	 */;
    totalNum: number /**优惠券总量	 */;
    couponType: number /** */;
    discountNumMax: number /**最多优惠数量	 */;
    couponNo: string /** */;
}
/**特卖商品信息*/
export interface INewGoods {
    scrollId: string;
    list: IGoodsList[];
    bannerList: Banner[];
}
export interface Banner {
    bannerNo: string;
    imageUrl: string;
    appAction: string;
}
/**商品列表*/
export interface IGoodsList {
    goodsPriceOrigin: number /** 价格(划线价) 价格 v1.6字段废弃	*/;
    goodsPrice: number /**学生价 价格 v1.6字段废弃*/;
    goodsShowPrice: number /** 价格 */;
    goodsShowOriginPrice: number /** 原价 */;
    goodsShowPriceType: number /** 价格类型: 1:活动价, 2:学生价, 3:原价 */;
    activityId: string /**活动编号*/;
    activityNo: string /**活动编号,如果是大促就是大促的活动编号,如果是校园团就是校园团活动的编号 */;
    activityType: number /** 3:大促,4:校园团*/;
    isFullCut: number /** 	是否满减1满减,0没有满减 v1.6字段废弃 */;
    expireTime: number /** 新品过期时间	*/;
    goodsNo: string /** 商品编号	*/;
    goodsCover: string /** 商品封面	*/;
    goodsTitle: string /** 商品标题	*/;
    activityTagImg: string /** 活动图 */;
    width: number;
    height: number;
    fullCouponSubTag: number;
    fullCouponSub: number;
    crossShopDiscountTag: number;
}

/**商品列表请求传参*/

export interface IGoodsListParams {
    scrollId?: string;
    sortField?: string /** 排序字段，new：新品，sale：销量，price：价格	*/;
    sortType?: string /**排序方式，asc：正序，desc：逆序	*/;
    listType?: number /** 1精选,2非精选 */;
}
