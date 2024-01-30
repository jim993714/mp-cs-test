import { useRequest } from '@zsdx/mp-utils';

import type { CategoryItem, GoodsList } from './types';

const request = useRequest();

export function getCategoryList(params: {
    activityNo: string;
    keywords?: string;
    sortField?: string;
    sortType?: string;
    size: number;
    scrollId: string;
}) {
    return request.post<{ list: CategoryItem[] }>(
        '/student-school-shop/stepGroup/getCategoryList',
        params
    );
}

/**
 * 获取阶梯团商品列表
 */
export function getGoodsList(params: {
    activityNo: string;
    keywords?: string;
    sortField?: string;
    sortType?: string;
    size: number;
    scrollId: string;
    customNo?: string;
}) {
    return request.post<GoodsList>('/student-school-shop/stepGroup/getGoodsList', params);
}

/**
 * 获取优惠券列表
 */
export function setAlert(params: { activityNo: string; goodsNo: string; status: 1 | 0 }) {
    return request.post('/student-school-shop/stepGroup/setAlert', params);
}
