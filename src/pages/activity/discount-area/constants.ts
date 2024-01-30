import dayjs from 'dayjs';

import type { ITimeList } from '@/api/activity/discount-area/types';

export const getTimerOut = (expireTime: number, activityEndTime: number) => {
    const date = new Date().getTime();
    const endTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime() + expireTime * 1000;
    if (endTime > activityEndTime) {
        return activityEndTime > date ? Math.floor((activityEndTime - date) / 1000) : 0;
    } else {
        return endTime > date ? Math.floor((endTime - date) / 1000) : 0;
    }
};

/**
 * 倒计时样式
 */
export const timeOutStyle = {
    color: '#ffffff',
    fontSize: '32rpx',
    height: '28rpx',
    lineHeight: '32rpx',
    padding: '5rpx',
    background: '#FF4734',
    borderRadius: '5rpx'
};

export const spliderStyle = {
    fontSize: '24rpx',
    lineHeight: '32rpx'
};

export function formatDate(date: number) {
    const now = new Date(new Date().setHours(0, 0, 0, 0)).getTime() + date * 1000;
    return dayjs(now).format('HH:mm');
}

export const getTimeStatus = (item: ITimeList) => {
    if (item.activityStatus === 2) {
        return '疯抢中';
    } else {
        if (item.isTomorrow === 1) {
            return '明日开始';
        } else if (item.isTomorrow != 1 && !item.date) {
            return '即将开始';
        } else {
            return item.showDate + '开始';
        }
    }
};
