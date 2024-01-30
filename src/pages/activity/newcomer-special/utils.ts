/**
 * 过滤优惠券文案
 */

export const limitFilter = (val: number, type: number) => {
    switch (type) {
        case 0:
            return '无门槛';
        case 1:
            return `满${val}元可用`;
        case 2:
            return `满${val}件可用`;
        default:
            return '无门槛';
    }
};
