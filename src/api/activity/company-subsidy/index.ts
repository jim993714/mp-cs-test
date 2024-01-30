import { useRequest } from '@zsdx/mp-utils';

import type {
    ICategory,
    ISummerGoodsListReq,
    IZoneCategoryReqParams,
    IZoneConfig,
    IZoneGoods,
    IZoneGoodsParams,
    IZoneReqParams
} from './types';

const request = useRequest();

/**
 * 暑期专区搜索结果列表
 * @param params
 * @returns
 */
export function getSummerGoodsList(params: ISummerGoodsListReq) {
    return request.post(
        '/student-school-shop/summerVacationDiscountActivity/getSearchList',
        params
    );
}

/**
 * 自由折扣专区搜索列表
 * @param params
 * @returns
 */
export function getSummerFreeGoodsList(params: ISummerGoodsListReq) {
    return request.post(
        '/student-school-shop/summerVacationFreeDiscountActivity/getSearchList',
        params
    );
}

/**
 * 获取专区列表
 * @param params
 * @returns
 */

export function getZoneAreaList(params: IZoneReqParams) {
    return request.post<IZoneConfig>(
        '/student-school-shop/summerVacationDiscountActivity/getZoneList',
        params
    );
}

/**
 * 获取分类列表
 * @param params
 * @returns
 */

export function getZoneCategoryList(params: IZoneCategoryReqParams) {
    return request.post<ICategory>(
        '/student-school-shop/summerVacationDiscountActivity/getCategoryList',
        params
    );
}

/**
 * 获取商品列表
 * @param params
 * @returns
 */
export function getZoneGoodsList(params: IZoneGoodsParams) {
    return request.post<IZoneGoods>(
        '/student-school-shop/summerVacationDiscountActivity/getMoreList',
        params
    );
}
