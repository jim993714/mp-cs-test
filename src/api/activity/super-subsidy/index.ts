import { useRequest } from '@zsdx/mp-utils';

import type { IGoodsData, IGoodsListParams } from './types';

const request = useRequest();

/**
 * 获取活动商品列表
 */
export function getGoodsList(params: IGoodsListParams) {
    return request.post<IGoodsData>('student-school-shop/tenBillionSubsidy/getGoodsList', params);
}

/**
 * 获取活动期数
 */
export function getHasNext() {
    return request.post<{ hasNext: number }>('/student-school-shop/tenBillionSubsidy/hasNext');
}
