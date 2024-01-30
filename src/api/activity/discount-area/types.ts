/**时间列表*/
export interface ITimeData {
    list: ITimeList[];
    endTime: number;
    startTime: number;
    date: string;
}
export interface ITimeList {
    startTime: number;
    endTime: number;
    activityStatus: number;
    timeId: string;
    date: string;
    isTomorrow: number;
    showDate: string;
}
/** 分类类型*/

export interface ICategoryData {
    list: ICategory[];
    searchList: ISearchList[];
}
export interface ICategory {
    categoryId: string;
    categoryName: string;
    isActive?: boolean;
    index?: number;
}

/** 商品列表传参*/
export interface IListParams {
    scrollId?: string;
    size?: number;
    timeId: string;
    categoryId?: string;
    activityNo: string;
    date: string;
    startLimitPrice: number;
    endLimitPrice: number;
}

/** 商品列表类型*/
export interface IData {
    list: IGoodsList[];
    scrollId: string;
}
/** 价格区间类型*/
export interface ISearchList {
    name: string;
    startLimitPrice: number;
    endLimitPrice: number;
    isActive?: boolean;
}

export interface IGoodsList {
    actGoodsNo: string /** 活动商品编号	*/;
    goodsNo: string /**商品编号	 */;
    goodsType: number /**商品类型	 */;
    goodsCover: string /** 商品封面	*/;
    goodsTitle: string /**商品标题	 */;
    goodsPrice: number /** 商品价格	 */;
    goodsCommissionRate: number /** 商品佣金比例	*/;
    goodsPriceOrigin: number /**原价	 */;
    vacationPrice: number /** 活动价	*/;
    discount: number /** 折扣	*/;
    platformStudentPriceStatus: number /** 是否是学生价,1是,0不是	*/;
    timeId: number;
    subsidyMoney: number /** 立减	*/;
}

/** 样式配置类型*/
export interface IConfigStyle {
    headImg: string;
    ruleImages: string[];
    color: string;
    activityName: string;
    activityNo: string;
}
