export interface BaseInfoResp {
    alertImage: string;
    receiveCount: number;
    headImg: string;
    ruleImages: string[];
    activityNo: string;
    error?: string;
}

/** 一分购列表*/
export interface GoodsItem {
    /** 商品号 */
    goodsNo: string;
    /** 商品图片*/
    goodsImage?: string;
    /** 商品标题*/
    goodsTitle?: string;
    /** 商品价格*/
    goodsPrice?: number;
    /** 已补贴价格 */
    subsidyPrice?: number;
    /** 商品原价 */
    originPrice?: number;
    /** 活动商品ID */
    actGoodsNo?: number;
}

/** 兑换明细 */
export interface ExchangeItemResp {
    /**
     * 未使用列表
     */
    unUsedList?: UnUsedItem[];
    /**
     * 已使用列表
     */
    usedList?: UsedItem[];
    /**
     * 已失效列表
     */
    inValidList?: InValidItem[];
}
/**
 * 未使用列表
 */
export interface UnUsedItem {
    /**
     * 获得时间
     */
    receiveTime?: string;
    /**
     * 失效时间
     */
    invalidTime?: string;
    /**
     * 获得兑换次数
     */
    receiveCount?: number;
}
/**
 * 已使用列表
 */
export interface UsedItem {
    /**
     * 兑换时间
     */
    exchangeTime?: string;
    /**
     * 兑换商品title
     */
    goodsTitle?: string;
}
/**
 * 已失效列表
 */
export interface InValidItem {
    /**
     * 失效时间
     */
    inValidTime?: string;
    /**
     * 失效次数
     */
    invalidCount?: number;
}

/** 商品详情 */
export interface GoodsDetail {
    goodsNo: string;
    goodsType: number;
    goodsTitle: string;
    goodsCover: string;
    goodsPrice: number;
    goodsPricePay: number;
    goodsImageList: any[];
    goodsTagList: GoodsTagList[];
    goodsFreight: number;
    goodsPriceOrigin: number;
    goodsHeaderExtra: GoodsHeaderExtra[];
    goodsContent: string;
    zsdxPwd: string;
    specList: SpecList[];
    shopInfo: ShopInfo;
    buyLimitCount: number;
    lastBuyCount: number;
    couponMoney: string;
    coverVideo: CoverVideo;
    productList: ProductList[];
    goodsSale: number;
    goodsStatus: number;
    studentShopInfo: StudentShopInfo;
    delayDay: number;
    goodsNum: number;
    status: number;
    freightInfo: FreightInfo;
    companyName: string;
    hireNo: string;
    platformStudentPriceStatus: number;
    recommendWords: string;
    goodsReductionMoney: number;
    activityType: number;
    activityInfo: ActivityInfo;
    buyCount: number;
    collectStatus: number;
    reductionInfo: ReductionInfo;
    newRecruitHireGoodsStatus: number;
}

export interface ActivityInfo {
    isActivityGoods: number;
    activityTitle: string;
    activityStatus: number;
    activityStartTime: number;
    activityEndTime: number;
    activityPrice: number;
    activityPriceOrigin: number;
    activitySubsidy: number;
    goodsBanner: string;
}

export interface CoverVideo {
    videoUrl: string;
    videoCover: string;
}

export interface FreightInfo {
    freightType: number;
    freightMoney: number;
}

export interface GoodsHeaderExtra {
    title: string;
    content: string;
}

export interface GoodsTagList {
    title: string;
    desc: string;
}

export interface ProductList {
    goodsTitle: string;
    productNo: string;
    productPrice: number;
    productImage: string;
    productStock: number;
    productIdentify: string;
    specList: SpecListElement[];
    lastDays: number;
    buyLimitCount: number;
    buyCount: number;
}

export interface SpecListElement {
    specNo: string;
    specValue: string;
}

export interface ReductionInfo {
    reductionType: number;
    list: ReductionInfoList[];
}

export interface ReductionInfoList {
    requireNum: number;
    reductionPrice: number;
}

export interface ShopInfo {
    shopNo: string;
    shopType: number;
    shopTitle: string;
    shopLogo: string;
    levelMoney: number;
    levelLogo: string;
    goodsNum: number;
    goodsSale: number;
    shopStatus: number;
    closeTime: number;
    content: string;
}

export interface SpecList {
    name: string;
    list: SpecListElement[];
}

export interface StudentShopInfo {
    shopName: string;
    shopLogo: string;
    shopSubtitle: string;
    schoolName: string;
    trueName: string;
}
