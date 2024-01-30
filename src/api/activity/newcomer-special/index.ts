import { useRequest } from '@zsdx/mp-utils';

import type {
    ICheckCouponData,
    IGoodsData,
    IGoodsDataParams,
    INewCoupon,
    INewCouponReceive
} from './types';

const request = useRequest();

/**
 * 获取优惠券列表
 */
export function getNewPersonCoupon(params: { studentShopId: string }) {
    return request.post<INewCoupon>('/student-school-shop/studentShop/getNewFansCoupon', params);
}

/**
 * 领取券包
 */

export function receiveNewCoupon(params: { studentShopId: string }) {
    return request.post<INewCouponReceive>(
        '/student-school-shop/studentShop/receiveNewFansCoupon',
        params
    );
}

/**
 * 查看券包领取
 */
export function checkPackage(params: { ticket: string }) {
    return request.post<ICheckCouponData>(
        '/student-school-shop/studentShop/checkReceiveNewFansCoupon',
        params
    );
}

/**
 * 获取新人专区商品列表
 */
export function getNewPersonGoodsList(params: IGoodsDataParams) {
    return request.post<IGoodsData>(
        '/student-school-shop/newPersonPrefecture/getGoodsList',
        params
    );
}
