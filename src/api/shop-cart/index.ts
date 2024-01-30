import { useRequest } from '@zsdx/mp-utils';

import type { GetSkuInfoRes, RemoveGoodsParams, ShopCartRes, UpdateGoodsParams } from './types';

const request = useRequest();

/**
 * 获取学生购物车列表
 */
export function getShopCartList(studentShopId: string) {
    return request.post<ShopCartRes>('/student-school-shop/shopCart/getStudentShopCartList', {
        studentShopId
    });
}

/**
 * 移除学生购物车商品
 */
export function removeShopCartGoods(params: RemoveGoodsParams) {
    return request.post('/student-school-shop/shopCart/removeShopCart', params);
}

/**
 * 更新学生购物车商品数量
 */
export function updateShopCart(params: UpdateGoodsParams) {
    return request.post('/student-school-shop/shopCart/addOrUpdateShopCart', params);
}

/**
 * 获取sku信息
 */
export function getSkuInfo(goodsNo: string) {
    return request.post<GetSkuInfoRes>('/student-school-shop/shopCart/getGoodsProduct', {
        goodsNo
    });
}

/**
 * 获取购物车商品数量
 */
export function getShopCartCount(studentShopId: string) {
    return request.post<number>('/student-school-shop/shopCart/shopCartGoodsCount', {
        studentShopId
    });
}
