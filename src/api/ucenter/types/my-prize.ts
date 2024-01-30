import type { Product, Spec } from '@zsdx/mp-material/dist/lib/components/zd-sku-pop/types';

import type { TrackingDetailStatus, TrackingStatus } from '@/api/order/types';
import type { DiscountLimitType, LimitType } from '@/api/redpacket/types';

/** 优惠券类型 */
export enum CouponType {
    /** 金钱 */
    Money = '1',
    /** 折扣 */
    Coupon = '2'
}

export enum PrizeStatus {
    /**
     * 未领取
     */
    UNRECEIVED = 1,
    /**
     * 已领取
     */
    RECEIVED = 2,
    /**
     * 已失效
     */
    INVALID = -1
}

export enum PrizeType {
    /**
     * 商品
     */
    GOODS = 1,
    /**
     * 优惠券
     */
    COUPON,
    /**
     * 红包
     */
    RED_PACKET,
    /**
     * 盲盒
     */
    BLIND_BOX,
    /**
     * 暑期一分购
     */
    SUMMER_ONE_CENT
}

export interface PrizeListParams {
    status: PrizeStatus;
}

/**
 * 奖品信息
 */
export interface Prize {
    /**
     * 奖品编号
     */
    awardNo: string;

    /**
     * 奖品类型
     */
    type: PrizeType;
    /**
     * 优惠券编号
     */
    couponNo: string;
    /**
     * 红包编号
     */
    packetNo: string;
    /**
     * 是否是单个商品可用
     */
    isSingleGoods: 1 | 0;
    /**
     * 奖品名称
     */
    title: string;
    /**
     * 奖品图片
     */
    image: string;
    /**
     * 奖品来源 1：转盘抽奖
     */
    fromType: 1;
    /**
     * 兑换编号
     */
    exchangeNo: string;
    /**
     * 领取有效期开始时间
     */
    receiveStartTime: number;
    /**
     * 领取有效期结束时间
     */
    receiveEndTime: number;
    /**
     * 状态
     */
    status: PrizeStatus;
    /**
     * 商品编号
     */
    goodsNo: string;
    /**
     * 订单编号 type = 5
     */
    orderNo: string;
}

/**
 * 奖品兑换状态
 */
export enum PrizeExchangeStatus {
    /**
     * 待填写收货地址
     */
    WAITING_FOR_ADDRESS = 1,
    /**
     * 待发货
     */
    WAITING_FOR_DELIVERY,
    /**
     * 已发货
     */
    DELIVERED,
    /**
     * 已签收
     */
    RECEIVED,
    /**
     * 过期未领取
     */
    EXPIRED = -1
}

/**
 * 收货地址信息
 */
export interface PrizeReceiveAddress {
    addressId: string;
    /**
     * 收货人姓名
     */
    userName: string;
    /**
     * 收货人手机号
     */
    phone: string;
    /**
     * 收货详细地址
     */
    detailInfo: string;
    /**
     * 省份
     */
    provinceName: string;
    /**
     * 城市
     */
    cityName: string;
    /**
     * 区县
     */
    countyName: string;
}

/**
 * 奖品兑换详情
 */
export interface PrizeExchangeResult {
    /**
     * 奖品名称
     */
    title: string;
    /**
     * 奖品图片
     */
    image: string;
    /**
     * 领取有效期开始时间
     */
    receiveStartTime: number;
    /**
     * 领取有效期结束时间
     */
    receiveEndTime: number;
    /**
     * 奖品兑换状态
     */
    status: PrizeExchangeStatus;
    /**
     * 收货地址信息
     */
    receiveAddressInfo: PrizeReceiveAddress | null;
    /**
     * 领取规则
     */
    receiveRule: string[];
}

// /**
//  * 物流状态
//  */
// export enum TrackingStatus {
//     /**
//      * 未发货
//      */
//     NOT_DELIVERED = -2,
//     /**
//      * 暂无信息
//      */
//     NO_INFO = -1,
//     /**
//      * 揽件
//      */
//     COLLECTED,
//     /**
//      * 途中
//      */
//     ON_THE_WAY,
//     /**
//      * 派件中
//      */
//     DELIVERING,
//     /**
//      * 已签收
//      */
//     RECEIVED,
//     /**
//      * 派送失败
//      */
//     DELIVERY_FAILED,
//     /**
//      * 疑难件
//      */
//     DIFFICULT,
//     /**
//      * 退件签收
//      */
//     RETURNED
// }

/**
 * 奖品物流信息
 */
export interface PrizeLogisticsInfo {
    /**
     * 奖品图片
     */
    image: string;
    /**
     * 物流状态
     */
    trackingStatus: TrackingStatus;
    /**
     * 物流单号
     */
    trackingNo: string;
    /**
     * 快递公司名称
     */
    logisticsName: string;
    /**
     * 快递公司手机号
     */
    logisticsPhone: string;
    /**
     * 快递员姓名
     */
    courierName: string;
    /**
     * 快递员手机号
     */
    courierPhone: string;
    /**
     * 物流信息列表
     */
    trackingInfoList: {
        /** 物流状态 */
        type: TrackingDetailStatus;
        /** 物流信息 */
        info: string;
        /** 时间 */
        createTime: number;
    }[];
}

export interface RuleItem {
    content: string;
}

export interface Coupon {
    /**
     * 优惠券编号
     */
    couponNo: string;
    /**
     * 优惠券名称
     */
    title: string;
    /**
     * 使用开始时间
     */
    useStartTime: number;
    /**
     * 使用结束时间
     */
    useEndTime: number;
    /**
     * 详细信息
     */
    desc: string;
    /**
     * 最高优惠金额
     */
    discountNumMax?: number;
    /**
     * 优惠券门槛类型 0 无门槛 1满金额 2满件数
     */
    discountLimitType: DiscountLimitType;
    /**
     * 优惠券门槛
     */
    discountLimit: number;
    /**
     * 优惠额度
     */
    discountNum: number;
    /**
     * 优惠券类型 1 金额 2 折扣
     */
    couponType: CouponType;
    /**
     * 使用限制
     */
    useLimitType: LimitType;
    /**
     * 是否过期
     */
    studentCouponStatus: number;

    /** 领取状态 */
    receiveStatus: number;
}

export interface RedPacket {
    /**
     * 编号
     */
    packetNo: string;
    /**
     * 红包名称
     */
    title: string;
    /**
     * 使用开始时间
     */
    useStartTime: number;
    /**
     * 使用结束时间
     */
    useEndTime: number;
    /**
     * 详细信息
     */
    desc: string;
    /**
     * 优惠券门槛类型 0 无门槛 1满金额 2满件数
     */
    discountLimitType: DiscountLimitType;
    /**
     * 优惠券门槛
     */
    discountLimit: number;
    /**
     * 优惠额度
     */
    discountNum: number;
    /**
     * 使用限制
     */
    useLimitType: LimitType;
}

export interface CouponRes {
    couponInfo: Coupon;
    goodsInfo?: {
        goodsNo?: string;
    };
}

export interface RedPacketRes {
    packetInfo: RedPacket;
    goodsInfo?: {
        goodsNo?: string;
    };
}

/**
 * 暑期一分购商品详情参数
 */
export interface SummerOneCentGoodsDetailParams {
    /**商品编号 */
    goodsNo: string;
    /**奖励编号 */
    awardNo: string;
}

/**
 * 暑期一分购商品详情
 */
export interface SummerOneCentGoodsDetail {
    /**商品编号 */
    goodsNo: string;
    /**商品名称 */
    goodsTitle: string;
    /**商品图片 */
    goodsCover?: string;
    /**商品价格 */
    goodsPrice?: number;
    /**商品库存 */
    goodsStock?: number;
    /**规格信息 */
    specList: Spec[];
    /**产品信息 */
    productList: Product[];
}

export enum CouponRuleType {
    /**我的优惠券规则 */
    MY_COUPON = 1,
    /**优惠券详情 */
    COUPON_DETAIL = 2,
    /**下单规则 */
    ORDER = 3
}
