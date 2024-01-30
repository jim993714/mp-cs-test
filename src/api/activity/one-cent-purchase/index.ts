import { useRequest } from '@zsdx/mp-utils';

import type { BaseInfoResp, ExchangeItemResp, GoodsDetail, GoodsItem } from './types';

const request = useRequest();

/** 获取基本详情 */
export function fetchBaseInfo() {
    return request.post<BaseInfoResp>('/student-school-shop/pennyGoods/getAreaInfo');
}

/** 获取一分购列表 */
export function fetchPennyGoodsList(params: {
    scrollId: string;
    size: number;
    activityNo: string;
}) {
    return request.post<{
        list: GoodsItem[];
        scrollId: string;
    }>('/student-school-shop/pennyGoods/getPennyGoodsList', params);
}

/** 获取一分购列表2 */
export function fetchPennyGoodsList2(params: {
    scrollId: string;
    size: number;
    activityNo: string;
}) {
    return request.post<{
        list: GoodsItem[];
        scrollId: string;
    }>('/student-school-shop/pennyGoods/getSubGoodsList', params);
}

/** 获取兑换明细 */
export function fetchExchangeDetailList(params: { type: number; activityNo: string }) {
    return request.post<ExchangeItemResp>(
        '/student-school-shop/pennyGoods/getExchangeDetailList',
        params
    );
}

/** 获取一分购商品详情 */
export function fetchPennyGoodsDetail(params: {}) {
    return request.post<GoodsDetail>('/student-school-shop/pennyGoods/getPennyGoodsDetail', params);
}

/** 检查是否可以购买一分购商品 */
export function fetchLimit(params: {
    activityNo: string;
    goodsNo: string;
    studentShopId: string;
    zsdxPwd?: string;
}) {
    return request.post<{
        canBuy: boolean;
        desc: string;
    }>('/student-school-shop/pennyGoods/checkPennyGoodsLimit', params);
}
