import { useRequest } from '@zsdx/mp-utils';

import type { PaginationResult } from '../types';
import type {
    CouponRes,
    CouponRuleType,
    Prize,
    PrizeExchangeResult,
    PrizeListParams,
    PrizeLogisticsInfo,
    RedPacketRes,
    SummerOneCentGoodsDetail,
    SummerOneCentGoodsDetailParams
} from './types';

const request = useRequest();

/**
 * 获取奖品列表
 */
export function getPrizeList(params: PrizeListParams) {
    return request.post<PaginationResult<Prize>>('/student-school-shop/user/award/list', params);
}

/**
 * 兑换奖品
 */
export function exchangePrize(exchangeNo: string) {
    return request.post('/student-school-shop/activity/lottery/exchange', {
        exchangeNo
    });
}

/**
 * 获取抽奖兑换详情
 */
export function getPrizeExchangeDetail(exchangeNo: string) {
    return request.post<PrizeExchangeResult>(
        '/student-school-shop/activity/lottery/exchange/detail',
        {
            exchangeNo
        }
    );
}

/**
 * 获取奖品物流信息
 */
export function getPrizeLogisticsInfo(exchangeNo: string) {
    return request.post<PrizeLogisticsInfo>(
        '/student-school-shop/activity/lottery/exchange/track/info',
        {
            exchangeNo
        }
    );
}

/**
 * 提交收货信息
 */
export function submitReceiveInfo(exchangeNo: string, addressId: string) {
    return request.post('/student-school-shop/activity/lottery/exchange/address/set', {
        exchangeNo,
        addressId
    });
}

/**
 * 获取优惠券详情
 */
export function getCouponDetail(couponNo: string) {
    return request.post<CouponRes>('/student-school-shop/Coupon/getCouponInfo', {
        couponNo
    });
}

/**
 * 获取红包详情
 */
export function getPacketDetail(packetNo: string) {
    return request.post<RedPacketRes>('/student-school-shop/RedPacket/getRedPacketInfo', {
        packetNo
    });
}

/**
 * 获取优惠券规则
 */
export function getCouponRule(type: CouponRuleType) {
    return request.post<{ content: string }>('/student-school-shop/Coupon/getRule', { type });
}

/**
 * 获取红包规则
 */
export function getPacketRule(params: { packetNo: string; type?: CouponRuleType }) {
    return request.post<{ content: string }>('/student-school-shop/RedPacket/getRule', params);
}

/**
 * 获取暑期一分购商品列表
 */
export function getSummerGoodsDetail(params: SummerOneCentGoodsDetailParams) {
    return request.post<SummerOneCentGoodsDetail>('/student-school-shop/user/award/detail', params);
}
