import { useRequest } from '@zsdx/mp-utils';

import type { PaginationResult } from '../types';
import type { CollectGoods, CollectShop } from './types';

const request = useRequest();

/**
 * 获取收藏商品列表
 */
export function getCollectGoodsList() {
    return request.post<PaginationResult<CollectGoods>>(
        '/student-school-shop/collect/getGoodsCollectList'
    );
}

/**
 * 获取收藏校园店列表
 */
export function getCollectShopList() {
    return request.post<PaginationResult<CollectShop>>(
        '/student-school-shop/collect/getStudentShopCollectList'
    );
}

/**
 * 取消收藏商品或校园店
 */
export function cancelCollect(ids: string[], type: 'goods' | 'shop') {
    return request.post('/student-school-shop/collect/cancelCollect', {
        goodsNos: type === 'goods' ? ids : [],
        studentShopIds: type === 'shop' ? ids : []
    });
}
