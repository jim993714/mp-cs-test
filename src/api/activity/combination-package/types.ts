/**  分类类型 */
export interface ICategoryData {
    list: Array<ICategory>;
}
export interface ICategory {
    categoryName: string;
    categoryId: string;
    isActive?: boolean;
    index?: number;
}

/**  活动状态 */

export interface IStatus {
    label: string;
    status: number;
    isActive?: boolean;
}

/**  活动样式 */

export interface IStyle {
    headImage: string;
    backgroundColor: string;
    repairImage: string;
}

/**  组合包列表传参 */
export interface IPackageListParams {
    activityStatus: number;
    studentShopId: string;
    categoryId: string;
    scrollId?: string;
}

/**  组合包类型*/
export interface IPackageData {
    list: Array<IList>;
    scrollId: string;
}
export interface IList {
    list: Array<IPackageList> /**每一行数据*/;
}

export interface IPackageList {
    schoolSeasonCombinationPackageActivityId: number /**活动ID*/;
    goodsList: Array<IGoods> /**商品列表*/;
    goodsNum: number /** 商品个数 */;
    goodsNumType: number /** 1=>2个或者图 2=> 3个 3=> 4个 */;
    packageTitle: string /** 包名称 */;
    packageCover: string /** 包封面 */;
    fixedMoney: number /**  一口价*/;
    originPrice: string /** 原价 */;
    categoryName: string /**  分类名*/;
    startTime: number /**  包开始时间*/;
}

export interface IGoods {
    goodsTitle: string /** 商品名称 */;
    goodsCover: string /** 商品封面 */;
    goodsPrice: number /** 团购价 */;
}
