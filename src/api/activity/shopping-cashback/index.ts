import { useRequest } from '@zsdx/mp-utils';

import type {
    GetPoolInfoParams,
    GetRankListParams,
    PoolInfo,
    RankListRes,
    RuleConfig
} from './types';

const request = useRequest();

/**
 * 获取活动规则
 */
export function getRule() {
    return request.post<RuleConfig>('/student-school-shop/userRewardPool/getRule');
}

/**
 * 获取活动基础信息
 */
export function getUserRewardInfo(params: GetPoolInfoParams) {
    return request.post<PoolInfo>('/student-school-shop/userRewardPool/getUserRewardInfo', params);
}

/**
 * 获取榜单排名列表
 */
export function getRankList(params: GetRankListParams) {
    return request.post<RankListRes>('/student-school-shop/userRewardPool/rankAwardList', params);
}

/**
 * 活动是否开启
 */
export function checkIsOpenWard() {
    return request.post<1 | 0>('/student-school-shop/userRewardPool/isOpenWard');
}
