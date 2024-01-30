import { useRequest } from '@zsdx/mp-utils';

import type { LotteryApplyResult, LotteryDetail, LotteryResult } from './types';

const request = useRequest();

/**
 * 获取抽奖信息
 */
export function getLotteryDetail(lotteryNo: string) {
    return request.post<LotteryDetail>('/student-school-shop/activity/lottery/detail', {
        lotteryNo
    });
}

/**
 * 获取抽奖通知列表
 */
export function getLotteryNoticeList(lotteryNo: string) {
    return request.post<string[]>('/student-school-shop/activity/lottery/notify/list', {
        lotteryNo
    });
}

/**
 * 申请抽奖
 */
export function applyLottery(lotteryNo: string) {
    return request.post<LotteryApplyResult>('/student-school-shop/activity/lottery/apply', {
        lotteryNo
    });
}

/**
 * 获取抽奖结果
 */
export function checkLotteryResult(params: { lotteryNo: string; tryNo: string }) {
    return request.post<LotteryResult>('/student-school-shop/activity/lottery/check', params);
}
