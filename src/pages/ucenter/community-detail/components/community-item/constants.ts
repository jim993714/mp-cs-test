import { UsedStatus } from '@/api/redpacket/types';

/** 津贴状态 */
export const useStatusLabel = {
    [UsedStatus.Get]: '领取红包',
    [UsedStatus.Cancel]: '取消使用',
    [UsedStatus.Use]: '下单使用',
    [UsedStatus.Fail]: '售后退回'
};
