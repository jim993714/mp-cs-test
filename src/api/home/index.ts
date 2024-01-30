import { useRequest } from '@zsdx/mp-utils';

import type { CouponRes } from '@/api/ucenter/types';

import type {
    IBannerData,
    ICategoryData,
    ICollectParams,
    ICouponItem,
    IGridData,
    IJinGangData,
    IModuleData,
    IRecommendGoodsData,
    IShopGoodsData,
    IShopGoodsListParams,
    IShopInfo,
    IWxUserParams
} from './types';

const request = useRequest();

/** 获取校园店基础信息 */
export const getShopInfo = (studentShopId: string) => {
    return request.post<IShopInfo>('/student-school-shop/studentShop/getShopInfo', {
        studentShopId
    });
};

/** 获取校园店前置Id */
export const getStudentShopId = () => {
    return request.post<string>('/student-school-shop/studentShop/getShopId');
};

/**
 * 查询校园店是否有效
 *  data: 0 无效， 1 是自己的校园店， 2 是别人的校园店
 */
export const checkStudentShopId = (studentShopId: string) => {
    return request.post<number>('/student-school-shop/studentShop/checkShopId', { studentShopId });
};

/** 获取首页活动排序 */
export const getShopIndexModuleList = (studentShopId: string) => {
    return request.post<IModuleData>('/student-school-shop/studentShop/getShopIndexModuleList', {
        studentShopId
    });
};

/** 获取banner列表 */
export const getBannerList = (studentShopId: string) => {
    return request.post<IBannerData>('/student-school-shop/studentShop/getBannerList', {
        studentShopId
    });
};

/** 获取新人专区 */

export const getNewFansCoupon = (studentShopId: string) => {
    return request.post<ICouponItem>('/student-school-shop/studentShop/getNewFansCoupon', {
        studentShopId
    });
};

/** 获取宫格专 */

export const getGridList = () => {
    return request.post<IGridData>('/student-school-shop/studentShop/getShopGridLayoutList');
};

/** 获取本店推荐商品 */
export const getRecommendGoodsList = (studentShopId: string) => {
    return request.post<IRecommendGoodsData>(
        '/student-school-shop/studentShop/getRecommendGoodsList',
        {
            studentShopId
        }
    );
};

/** 获取本店商品列表*/
export const getShopGoodsList = (params: IShopGoodsListParams) => {
    return request.post<IShopGoodsData>('/student-school-shop/studentShop/getGoodsList', params);
};

/** 订阅校园店*/

export const collectShop = (params: ICollectParams) => {
    return request.post('/student-school-shop/collect/collect', params);
};

/** 订阅校园商品分类列表*/

export const getCategoryList = (studentShopId: string) => {
    return request.post<ICategoryData>('/student-school-shop/studentShop/getCategoryList', {
        studentShopId
    });
};

/** 获取金刚区*/

export const getJinGangArea = () => {
    return request.post<IJinGangData>('/student-school-shop/studentShop/getJinGangAreaList');
};

/** 确认授权*/

export const WxSync = (params: IWxUserParams) => {
    return request.post('/student-school-shop/user/info/wechat/sync', params);
};

/** 取消授权*/
export const WxDeny = () => {
    return request.post('/student-school-shop/user/info/wechat/sync/deny');
};

/**
 * 获取优惠券详情
 */
export function getSaleLeadCouponInfo(studentCouponNo: string) {
    return request.post<CouponRes>('/student-school-shop/Coupon/getSaleLeadCouponInfo', {
        studentCouponNo
    });
}
