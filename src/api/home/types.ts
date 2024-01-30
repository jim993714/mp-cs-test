/** 获取校园店基础信息 */

export interface IShopInfo {
    studentShopId: string /** 校园店编号 */;
    money: number /** 累计收益 */;
    isSelf: number /** 是否是自己的校园店 1是 0否 */;
    collectionDeliveryType: number /** 代收备注 */;
    collectionCloseReason: number /** 代送关闭原因:1放假2考试3不在学校4其他 */;
    collectionStatus: number /** 代收状态 */;
    collectionAddress: ICollectionAddress /** 代收地址 */;
    otherPromoteCommissionRate: number /** 他人推广佣金比例 */;
    goodsCount: number /** 校园店商品数量 */;
    backgroundImage: string /** 背景图 */;
    intro: string /** 简介 */;
    groupQrcode: string /** 粉丝群二维码 */;
    hasTbkGoods: number /** 是否存在淘客商品 */;
    themeType: number /** 主题类型 */;
    status: number /** 校园店状态 1正常0关闭*/;
    shopLogo: string /**校园店logo*/;
    shopName: string /**校园店名称*/;
    isCollect: number /**是否订阅 1订阅0未订阅*/;
    countCollectionNum: number /**总代收订单数量*/;
    showNewPerson: number /**是否有新人专区,1是否有新人专区,0没有*/;
    shopIndexLayoutType: number /**校园店首页布局类型*/;
    templateType: number /**模板类型 模版1模版2*/;
    proxyNum: number /**授权学生数量*/;
    studentShopUser: StudentShopUser /**校内员工信息*/;
    proclamationInfo: ProclamationInfo /**公告信息*/;
    studentPriceslogan: IStudentPriceslogan /** 学生价slogan */;
}
/** 学生价slogan */
export interface IStudentPriceslogan {
    appAction: string;
    firstContent: string;
    firstIcon: string;
    pageNo: string;
    secondContent: string;
    secondIcon: string;
}
/** 代收收货地址 */
export interface ICollectionAddress {
    id: number;
    userName: string /**收货人姓名*/;
    provinceName: string /**省份*/;
    cityName: string /**城市*/;
    countyName: string /**区县*/;
    detailInfo: string /**详细地址*/;
    wechat: string /**微信*/;
    phone: number /**电话*/;
}

export interface ProclamationInfo {
    content: string /**公告内容*/;
    startTime: number /**公告开始时间*/;
    endTime: number /**公告结束时间*/;
}

export interface StudentShopUser {
    trueName: string /**校内员工名称*/;
    schoolName: string /**学校名称*/;
    sex: number /**校内员工性别*/;
    phone: number;
}

/** 首页模块 */
export interface IModuleData {
    list: Array<IShopIndexModule>;
}
export interface IShopIndexModule {
    type: string /** 模块类型[新人专区:new_person,轮播图:banner,本店推荐:recommend宫格区域:grid_layout(v264) */;
    name: string /** 模块名称:轮播图,本店推荐,新人专区,宫格区域 */;
    status: number /**  1显示0隐藏*/;
    sortStatus: number /** 是否支持排序1支持0不支持	  */;
    showHideStatus: number /** 是否支持显隐1支持0不支持	 */;
    contentEditStatus: number /** 是否支持编辑模块内容1支持0不支持	 */;
    info: Array<IRecommendInfo>;
}

/** 推荐商品内容 */
export interface IRecommendInfo {
    goodsCover: string /** 封面图片 */;
    goodsNum: number /** 已存在商品数据 */;
    totalGoodsNum: number /** 商品总数 */;
}

/** banner模块 */
export interface IBannerData {
    list: Array<IBannerList>;
}
export interface IBannerList {
    bannerNo: string;
    imageUrl: string;
    backgroundColor?: string;
    appAction?: string;
}

/** 首页券类型 */
export interface ICouponItem {
    money: number;
    isReceived: number;
    num: number;
    receiveStatus: number;
    isSelf: number;
    couponNum: number;
    status: number;
}

/** 宫格类型 */
export interface IGridData {
    list: Array<IGridList>;
}
export interface IGridList {
    appAction: string;
    type: number;
    title: string;
    recommendWords: string;
    image: string;
    goodsDetailList: Array<IGridGoodsDetailList>;
    currentPhaseGoodsList: Array<IGridGoodsDetailList>;
    nextPhaseGoodsList: Array<IGridGoodsDetailList>;
}
/** 宫格商品类型*/

export interface IGridGoodsDetailList {
    activityNo?: string;
    goodsNo: string;
    goodsTitle: string;
    goodsPrice: number;
    goodsCover: string;
    type?: number;
    couponNo?: string;
    title?: string;
    discountNum?: number;
    isReceived?: string;
}

/** 宫格超值补贴当期类型*/
export interface IGridPhaseGoodsList {
    goodsNo: string;
    goodsTitle: string;
    goodsPrice: number;
    goodsCover: string;
}

/** 本店推荐商品类型*/

export interface IRecommendGoodsData {
    list: Array<IGridPhaseGoodsList>;
}

/** 本店商品列表传参*/

export interface IShopGoodsListParams {
    scrollId?: string;
    size?: number;
    studentShopId: string;
    categoryId?: string;
    searchType?: number;
    sortField?: string;
    sortType?: string;
    keyWord?: string;
    priceRange?: [];
}

/** 本店商品数据*/

export interface IShopGoodsData {
    list: Array<IShopGoodsList>;
    scrollId: string;
}
/** 本店商品列表*/
export interface IShopGoodsList {
    goodsNo: string /** 商品编号*/;
    goodsCover: string /** 商品封面	*/;
    goodsTitle: string /**商品标题 */;
    goodsPrice: number /**商品价格	 */;
    isStudentPrice: number /** 是否是学生价：1-是 0-不是*/;
    goodsPriceOrigin: number /**商品原价格 */;
    isJoinActivity: number /**是否参加活动：1-是 0-不是 */;
    recommendWords: string /**推荐语*/;
    activityTagImg: string /**大促标签*/;
    width: number /**标签宽*/;
    height: number /**标签高*/;
    goodsShowPriceType: number;
    goodsShowPrice: number;
    goodsShowOriginPrice: number;
    subActivityType?: number /** 活动类型 1: 普通大促, 4:阶梯团购返现 */;
    maxSubsidy?: number /** 阶梯团购返现金额 */;
}

/** 收藏订阅*/
export interface ICollectParams {
    studentShopId: string;
    type: number;
    collectStatus: number;
}

/** 分类列表*/

export interface ICategoryData {
    list: Array<ICategoryList>;
}
export interface ICategoryList {
    categoryName: string /**分类名称*/;
    categoryId: string /**分类Id*/;
    isShow: number /**是否显示*/;
    studentShopId: string /**校园店ID*/;
    isActive?: Boolean;
}

/** 金刚区列表*/

export interface IJinGangData {
    list: Array<IJinGang>;
}
export interface IJinGang {
    title: string;
    imageUrl: string;
    badge: string;
    appAction: string;
    right?: string;
}

export interface IWxUserParams {
    avatarUrl: string;
    nickName: string;
}
