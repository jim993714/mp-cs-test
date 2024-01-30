import { useRequest } from '@zsdx/mp-utils';

import type { ICouponList, IGoodsListParams, INewGoods } from './types';

const request = useRequest();

/**
 * 获取优惠券列表
 */
export function getCoupon() {
    return request.post<Array<ICouponList>>(
        '/student-school-shop/newRecruitHireGoods/getCouponList'
    );
}

/**
 * 获取商品列表列表
 */
export function getNewGoods(params?: IGoodsListParams) {
    return request.post<INewGoods>('/student-school-shop/newRecruitHireGoods/getList', params);
}

/**
 * 领取券包
 */

export function receiveCoupon(params: { studentShopId: string }) {
    return request.post<any>('/student-school-shop/Coupon/receive', params);
}

/**
 * 查看券包领取
 */
export function checkPackage(params: { ticket: string }) {
    return request.post<any>('/student-school-shop/Coupon/checkReceive', params);
}
