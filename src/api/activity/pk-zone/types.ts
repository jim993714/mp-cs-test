export interface HireGoodsParams {
    /** 活动编号 */
    activityNo: string;
    /** 滚动id */
    scrollId?: string;
}

export interface ZoneConfig {
    /** 头图 */
    bannerImage: string;
    activityNo: string;
    /** 规则图片 */
    imageList: string[];
}

export interface HireGoods {
    goodsNo: string;
    /** 商品封面 */
    goodsCover: string;
    /** 商品标题 */
    goodsTitle: string;
    /** 商品价格 */
    goodsPrice: string;
}

export interface HireGoodsUnit {
    /** 公司编号 */
    hireNo: string;
    /** 公司名称 */
    companyName: string;
    /** 公司logo */
    companyLogo: string;
    /** 商品 */
    goods: HireGoods[];
}

export interface HireGoodsListRes {
    list: HireGoodsUnit[];
    /** 滚动id */
    scrollId: string;
}

export interface Category {
    /** 分类编号 */
    categoryId: string;
    /** 分类名称 */
    categoryName: string;
}

export interface SelectGoods {
    /** 商品编号 */
    goodsNo: string;
    /** 商品封面 */
    goodsCover: string;
    /** 商品标题 */
    goodsTitle: string;
    /** 商品价格 */
    goodsPrice: string;
}

export interface CategoryGoodsRes {
    categories: Category[];
    selects: SelectGoods[];
}

export interface SelectGoodsParams {
    /** 活动编号 */
    activityNo: string;
    /** 分类编号 */
    categoryId: string;
}

export type SearchGoodsSortField = 'goodsPrice' | 'saleNum' | '';
export type SearchGoodsSortType = 'asc' | 'desc' | '';

export interface SearchGoodsParams {
    /** 活动编号 */
    activityNo: string;
    /** 搜索关键字 */
    keywords: string;
    /** 排序字段 */
    sortField: SearchGoodsSortField;
    /** 排序方式 */
    sortType: SearchGoodsSortType;
}

export interface SearchGoods {
    /** 商品编号 */
    goodsNo: string;
    /** 商品封面 */
    goodsCover: string;
    /** 商品标题 */
    goodsTitle: string;
    /** 商品价格 */
    goodsPrice: string;
}
