import type { PaginationRes } from '@zsdx/mp-material/dist/lib/hooks/useLoadmore/types';
import { useRequest } from '@zsdx/mp-utils';

import type {
    CategoryGoodsRes,
    HireGoodsListRes,
    HireGoodsParams,
    SearchGoods,
    SearchGoodsParams,
    SelectGoods,
    SelectGoodsParams,
    ZoneConfig
} from './types';

const request = useRequest();

/**
 * 获取专区基础配置
 */
export const getZoneConfig = (activityNo: string) => {
    return request.post<ZoneConfig>('/student-school-shop/schoolAgentPkActivityZone/getInfo', {
        activityNo,
        // 1: B端 2: C端 此处固定为C端
        type: 2
    });
};

/**
 * 获取推荐热榜列表
 */
export const getHireGoodsList = (params: HireGoodsParams) => {
    return request.post<HireGoodsListRes>(
        '/student-school-shop/schoolAgentPkActivityZone/getHireGoodsList',
        {
            ...params,
            // 1: B端 2: C端 此处固定为C端
            type: 2
        }
    );
};

/**
 * 获取商品分类列表
 */
export const getGoodsCategoryList = (activityNo: string) => {
    return request.post<CategoryGoodsRes>(
        '/student-school-shop/schoolAgentPkActivityZone/getCategoryList',
        {
            activityNo,
            // 1: B端 2: C端 此处固定为C端
            type: 2
        }
    );
};

/**
 * 获取精选商品列表
 */
export const getSelectGoodsList = (params: SelectGoodsParams) => {
    return request.post<PaginationRes<SelectGoods>>(
        '/student-school-shop/schoolAgentPkActivityZone/getSelectGoodsList',
        {
            ...params,
            // 1: B端 2: C端 此处固定为C端
            type: 2
        }
    );
};

/**
 * 获取搜索商品列表
 */
export const getSearchGoodsList = (params: SearchGoodsParams) => {
    return request.post<PaginationRes<SearchGoods>>(
        '/student-school-shop/schoolAgentPkActivityZone/getSearchList',
        {
            ...params,
            // 1: B端 2: C端 此处固定为C端
            type: 2
        }
    );
};
