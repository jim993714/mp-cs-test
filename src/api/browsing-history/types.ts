/**
 * 分页列表返回结果
 */
export interface GoodsHistoryResp {
    /** 列表*/
    list: ListItem[];
    scrollId: string;
}
/**
 * 浏览足迹列表
 */
export interface ListItem {
    /** 商品编号*/
    goodsNo?: string;
    /** 商品标题*/
    goodsTitle?: string;
    /** 商品封面*/
    goodsCover?: string;
    /** 访问时间*/
    visitTime?: number;
    /** 访问Id*/
    visitId?: number;
    /** 商品原价*/
    goodsPriceOrigin?: number;
    /** 商品销量*/
    goodsSale?: number;
    /** 学生价*/
    goodsPrice: number;
    /** 店铺id*/
    shopNo?: string;
    /** 校园店id*/
    studentShopId?: number;
    /** 是否展示学生价 */
    isStudentPrice?: boolean;
    /**
     * 商品价格类型
     */
    goodsShowPriceType: number;
    /**
     * 显示的商品价格
     */
    goodsShowPrice: number;
    /**
     * 显示的商品原价
     */
    goodsShowOriginPrice: number;
}
