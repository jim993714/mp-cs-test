/**
 * 卡券状态
 */
export enum CardStatus {
    /** 未使用 */
    Unused = 0,
    /** 已使用 */
    Used,
    /** 已失效 */
    Invalid
}

/** 优惠券类型 */
export enum CouponType {
    /** 金钱 */
    Money = 1,
    /** 折扣 */ Coupon
}

/** 券包列表参数 */
export interface ListParams {
    /** 校园店id */
    studentShopId: number;
    /** 卡券状态 */
    type: CardStatus;
}

interface PreferentialCommonItem {
    /** 使用开始时间 */
    useStartTime: number;
    /** 使用结束时间 */
    useEndTime: number;
    /** 失效原因 */
    invalidReason: string;
    /** 优惠券简介 */
    desc: string;
    /** 优惠券状态 */
    status: CardStatus;
    /** 优惠券名称 */
    title: string;
    /** 优惠券使用商品  */
    useLimitType: LimitType;
    /** 是否单商品使用 */
    isSingleGoods: number;
}

/** 优惠券单元 */
export interface CouponItem extends PreferentialCommonItem {
    /** 优惠券no */
    couponNo: string;
    /** 用户优惠券编号 */
    studentCouponNo: string;
    /** 最高能优惠的额度 */
    disCountNumMax: number;
    /** 优惠信息 */
    discountInfo: string;
    /** 优惠门槛 */
    discountLimit: number;
    /** 优惠额度 */
    discountNum: number;
    /** 优惠门槛类型 */
    discountLimitType: DiscountLimitType;
    /** 优惠券类型 */
    couponType: CouponType;
    /** 限制商品 */
    useLimitType: LimitType;
    /** 店铺id */
    shopNo: string;
}

/** 优惠券返回值 */
export interface CouponResult {
    list: CouponItem[];
}

export interface PackResult {
    /** 优惠券 */
    list: {
        /** 状态 */
        validStatus: number;
        /** 截止时间 */
        validEndTime: number;
        /** 要求时长 */
        validHour: number;
        /** 券包名 */
        title: string;
        /** 券包内容 */
        packageCouponDTOS: CouponItem[];
    }[];
}

/**
 * 优惠门槛
 */
export enum DiscountLimitType {
    /** 无门槛 */
    None,
    /** 达到金额 */
    Money,
    /** 达到数量 */
    Number
}

/**
 * 优惠限制商品
 */
export enum LimitType {
    /** 全部商品 */
    All = 1,
    /** 指定可以 */
    SomeCan = 2,
    /** 指定不行 */
    SomeCant = 4,
    /** 学生价 */
    StudentPrice = 16
}

/** 红包单元 */
export interface PacketItem extends PreferentialCommonItem {
    /** 校园店id */
    studentShopId: string;
    /** 红包id */
    packetNo: string;
    /** 红包编号 */
    studentPacketNo: string;
    /** 红包id */
    packetId: string;
    /** 红包编号 */
    studentPacketId: string;
    /** 优惠门槛类型 */
    discountLimitType: DiscountLimitType;
    /** 优惠门槛 */
    discountLimit: number;
    /** 优惠额度 */
    discountNum: number;
}

/** 红包返回值 */
export interface PacketResult {
    list: PacketItem[];
}

/** 津贴单元 */
export interface AllowanceItem extends PreferentialCommonItem {
    /** 可用金额 */
    availableMoney: number;
    /** 津贴id */
    studentAllowanceId: string;
    desc: never;
    useLimitType: never;
}

/** 津贴返回值 */
export interface AllowanceResult {
    list: AllowanceItem[];
}

interface PreferentialCommonInfo {
    /** 使用开始时间 */
    useStartTime: number;
    /** 使用结束时间 */
    useEndTime: number;
    /** 标题 */
    title: string;
}

/** 优惠使用状态 */
export enum UsedStatus {
    /** 获得 */
    Get = 1,
    /** 已使用 */
    Use,
    /** 取消 */
    Cancel,
    /** 失败 */
    Fail
}

export interface MyHistoryItem {
    type: UsedStatus;
    /** 使用时间 */
    time: number;
    /** 金额 */
    money: number;
    /** 订单编号 */
    orderNo: string;
    /** 店铺名 */
    shopTitle: string;
}

/** 津贴信息参数 */
export interface MyAllowanceInfoParams {
    /** 学生津贴id */
    studentAllowanceId: string;
}

/** 津贴信息 */
export interface MyAllowanceInfo extends PreferentialCommonInfo {
    /** 津贴编号 */
    allowanceId: string;
    /** 学生津贴编号 */
    studentAllowanceId: string;
    /** 初始金额 */
    initMoney: number;
    /** 剩余金额 */
    lastMoney: number;
    /** 历史记录 */
    allowanceInfoMarkDTOS: MyHistoryItem[];
}

/** 社群红包信息参数 */
export interface MyCommunityInfoParams {
    /** 学生社群红包id */
    studentPacketId: string;
}

/** 社群红包详情 */
export interface MyCommunityInfo extends PreferentialCommonInfo {
    /** 红包编号 */
    packetId: string;
    /** 剩余额度 */
    lastNum: number;
    /** 优惠门槛 */
    discountLimit: number;
    /** 门槛类型 */
    discountLimitType: DiscountLimitType;
    /** 使用限制 */
    useLimitType: LimitType;
    /** 初始面额 */
    discountNum: number;
    /** 小店名称 */
    studentShopName: string;
    /** 历史记录 */
    communityMarkDTOList: MyHistoryItem[];
}

export interface CommonGoodsParams {
    /** 搜索内容 */
    keyword?: string;
    /** 筛选字段 */
    sortField?: string;
    /** 筛选字段类型 */
    sortType?: string;
}

/** 优惠券可用列表请求参数 */
export interface AvailableCouponParams extends CommonGoodsParams {
    /** 学生优惠券 */
    studentCouponNo: string;
    /** 优惠券 */
    couponNo: string;
    /** 最大价格 */
    maxMoney?: number | string;
    /** 最小价格 */
    minMoney?: number | string;
}

/** 红包可用列表请求参数 */
export interface AvailablePacketParams extends CommonGoodsParams {
    /** 学生红包 */
    studentPacketId: string;
    /** 红包  */
    packetNo: string;
    /** 最大价格 */
    maxMoney?: number | string;
    /** 最小价格 */
    minMoney?: number | string;
}

export interface GoodListCommonItem {
    /** 商品id */
    goodsNo: string;
    /** 学生价 */
    goodsPrice: number;
    /** 商品标题 */
    goodsTitle: string;
    /** 商品封面 */
    goodsCover: string;
    /** 是否是学生价 */
    isStudentPrice: 0 | 1;
}

export interface AvailableCouponResult {
    couponInfo: {
        /** 最大优惠金额 */
        disCountNumMax: number;
        /** 优惠门槛 */
        discountLimit: number;
        /** 优惠门槛类型 */
        discountLimitType: DiscountLimitType;
        /** 优惠额度 */
        disCountNum: number;
        /** 优惠券类型 */
        couponType: CouponType;
    } & PreferentialCommonInfo;
    goodsInfo: {
        list: GoodListCommonItem[];
    };
}

/** 红包可用商品列表 */
export interface AvailablePacketResult {
    packetInfo: {
        /** 优惠门槛 */
        discountLimit: number;
        /** 优惠门槛类型 */
        discountLimitType: DiscountLimitType;
        /** 优惠额度 */
        discountNum: number;
    } & PreferentialCommonInfo;
    goodsInfo: {
        list: GoodListCommonItem[];
    };
}

/** 社群红包可用商品列表参数 */
export interface AvailableCommunityPacketParams {
    /** 学生红包id */
    studentPacketId: string;
    /** 红包id */
    packetId: string;
}

/** 社区活动商品 */
export interface CommunityGoods extends GoodListCommonItem {
    /** 原价 */
    goodsPriceOrigin: number;
    /** 购物车数量 */
    cartNum: number;
}

/** 社群红包可用商品列表返回值 */
export interface AvailableCommunityPacketResult {
    communityInfoDTO: {
        /** banner图 */
        bannerImage: string;
        /** 优惠类型 */
        discountLimitType: DiscountLimitType;
        /** 优惠门槛 */
        discountLimit: number;
        /** 优惠额度 */
        discountNum: number;
    };
    communityGoodsInfos: {
        list: CommunityGoods[];
    };
}
