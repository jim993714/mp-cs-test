import { useRequest } from '@zsdx/mp-utils';

import type {
    AllowanceResult,
    AvailableCommunityPacketParams,
    AvailableCommunityPacketResult,
    AvailableCouponParams,
    AvailableCouponResult,
    AvailablePacketParams,
    AvailablePacketResult,
    CouponItem,
    CouponResult,
    ListParams,
    MyAllowanceInfo,
    MyAllowanceInfoParams,
    MyCommunityInfo,
    MyCommunityInfoParams,
    PacketResult,
    PackResult
} from './types';

const request = useRequest();

/** 获取我的优惠券 */
export function getMyCouponList(params: ListParams) {
    return request.post<CouponResult>(
        '/student-school-shop/redEnvelopeCardVoucher/getMyCouponList',
        params
    );
}

/** 获取我的券包 */
export function getMyPacketList(params: ListParams) {
    return request.post<PackResult>(
        '/student-school-shop/redEnvelopeCardVoucher/getMyPacketList',
        params
    );
}

/** 获取红包列表 */
export function getMyRedPacketList(params: ListParams) {
    return request.post<PacketResult>(
        '/student-school-shop/redEnvelopeCardVoucher/getMyRedPacketList',
        params
    );
}

/** 获取社群红包列表 */
export function getMyCommunityRedPacketList(params: ListParams) {
    return request.post<PacketResult>(
        '/student-school-shop/redEnvelopeCardVoucher/getMyCommunityRedPacketList',
        params
    );
}

/** 获取津贴列表 */
export function getMyAllowanceList(params: ListParams) {
    return request.post<AllowanceResult>(
        '/student-school-shop/redEnvelopeCardVoucher/getMyAllowanceList',
        params
    );
}

/** 获取我的津贴信息 */
export function getMyAllowanceInfo(params: MyAllowanceInfoParams) {
    return request.post<MyAllowanceInfo>(
        '/student-school-shop/redEnvelopeCardVoucher/getMyAllowanceInfo',
        params
    );
}

/** 获取我的社群红包信息 */
export function getMyCommunityRedPacketInfo(params: MyCommunityInfoParams) {
    return request.post<MyCommunityInfo>(
        '/student-school-shop/redEnvelopeCardVoucher/getMyCommunityRedPacketInfo',
        params
    );
}

/** 获取优惠券可用商品列表 */
export function getAvailableGoodsList(params: AvailableCouponParams) {
    return request.post<AvailableCouponResult>(
        '/student-school-shop/redEnvelopeCardVoucher/getAvailableGoodsList',
        params
    );
}

/** 获取红包可用商品列表 */
export function getAvailablePacketList(params: AvailablePacketParams) {
    return request.post<AvailablePacketResult>(
        '/student-school-shop/redEnvelopeCardVoucher/getAvailablePacketList',
        params
    );
}

/** 获取社群红包商品 */
export function getAvailableCommunityRedPacketList(params: AvailableCommunityPacketParams) {
    return request.post<AvailableCommunityPacketResult>(
        '/student-school-shop/redEnvelopeCardVoucher/getAvailableCommunityRedPacketList',
        params
    );
}

/**
 * 查看新人认证奖励优惠券
 */
export function getVerifyAwardList() {
    return request.post<CouponItem[]>('/student-school-shop/Coupon/getVerifyPlatformAwardList');
}
