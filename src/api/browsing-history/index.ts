import { useRequest } from '@zsdx/mp-utils';

import type { GoodsHistoryResp } from './types';

const request = useRequest();

/**
 * 历史浏览商品列表
 * @param params
 * @returns
 */
export function fetahHistoryList(params: { scrollId: string }) {
    return request.post<GoodsHistoryResp>(
        '/student-school-shop/goodsHistory/getGoodsHistoryList',
        params
    );
}

/**
 * 一键清空
 * @param params
 * @returns
 */
export function clearHistory() {
    return request.post('/student-school-shop/goodsHistory/clearAllGoodsHistory');
}

/**
 * 一键清空
 * @param params
 * @returns
 */
export function delHistory(params: { visitId: string[] }) {
    return request.post('/student-school-shop/goodsHistory/clearGoodsHistory', params);
}
