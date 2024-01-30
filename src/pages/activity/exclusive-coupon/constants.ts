import dayjs from 'dayjs';

/**
 * 倒计时
 */
export const getTime = (time: number) => {
    const newTime = time - 1;
    const second = time % 60;
    let tmp = (time - second) / 60;
    const min = tmp % 60;
    tmp = tmp - min;
    const hour = tmp / 60;

    return {
        time: newTime,
        timeStr: `${friendlyNumber(hour)}${friendlyNumber(min)}${friendlyNumber(second)}`
    };
};

/**
 * 补0
 */
export const friendlyNumber = (num: number) => {
    return num > 9 ? num : '0' + num;
};

/**
 * 获取时分秒label
 */

export const getTimeLabel = (index: number) => {
    switch (index) {
        case 1:
            return '时';
        case 3:
            return '分';
        case 5:
            return '秒';
        default:
            return '--';
    }
};

export function formatDate(date: number) {
    return dayjs(date).format('YYYY.MM.DD');
}
