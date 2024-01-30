/**
 * 活动商品列表传参
 */

export interface IGoodsListParams {
    cycle: number;
}

/**
 * 活动数据类型
 */
export interface IGoodsData {
    startTime: number /**开始时间*/;
    endTime: number /**结束时间*/;
    list: Array<IGoodsList>;
}

/**
 * 活动商品列表
 */
export interface IGoodsList {
    startTime: number /**开始时间*/;
    endTime: number /**结束时间*/;
    goodsNo: string /**商品编号*/;
    activityNo: string /** 活动编号 */;
    productNo: string /** sku编号 */;
    goodsCover: string /** 商品封面 */;
    goodsTitle: string /** 商品标题 */;
    goodsPrice: number /** 商品价格 */;
    subsidyPrice: number /** 补贴价格 */;
    subsidyMoney: number /** 补贴金额 */;
    goodsStock: number /** 商品库存 */;
    isSetAlter: number /**是否已预约  */;
}
