import { useRequest } from '@zsdx/mp-utils';

import type {
    ICheckReceiveResult,
    IReceiveParams,
    IReceiveResult,
    IShareCouponData,
    ISubfitCouponParams
} from './types';

const request = useRequest();

/**获取分享优惠券列表*/

export const getSubgiftShareList = (params: ISubfitCouponParams) => {
    return request.post<IShareCouponData>(
        '/student-school-shop/Coupon/getSubgiftShareList',
        params
    );
};
/**领取优惠券*/
export const subgiftReceive = (params: IReceiveParams) => {
    return request.post<IReceiveResult>('/student-school-shop/Coupon/subgiftReceive', params);
};

/**领取优惠券队列*/
export const checkSubgiftReceive = (receiveTicket: string) => {
    return request.post<ICheckReceiveResult>('/student-school-shop/Coupon/checkSubgiftReceive', {
        receiveTicket
    });
};
