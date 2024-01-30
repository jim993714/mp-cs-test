import type { IGoodsList } from '@/api/activity/new-arrivals/types';
import type { ISortConfig, IStyleConfig } from '@/components/sort-bar/types';

/**
 * 过滤优惠券
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

/**
 * 排序配置
 */
export const sortConfig: Array<ISortConfig> = [
    {
        sortField: '',
        sortTitle: '默认',
        sortRank: false,
        sortType: ''
    },
    {
        sortField: 'new',
        sortTitle: '最新',
        sortRank: false,
        sortType: 'asc'
    },
    {
        sortField: 'sale',
        sortTitle: '销量',
        sortRank: true,
        sortType: 'asc'
    },
    {
        sortField: 'price',
        sortTitle: '价格',
        sortRank: true,
        sortType: 'asc'
    }
];

/**
 * 倒计时计算
 */

export const getTimerOut = (expireTime: number) => {
    const date = new Date().getTime();
    return expireTime > date ? Math.floor((expireTime - date) / 1000) : 0;
};
export const showDay = (expireTime: number) => {
    const date = Math.floor(new Date().getTime());
    const diff = expireTime > date ? Math.floor((expireTime - date) / 1000) : 0;
    return diff / 60 / 60 / 24 < 7;
};
/**
 * 倒计时样式
 */
export const timeOutStyle = {
    color: '#fff2cc',
    fontSize: '24rpx',
    height: '24rpx',
    lineHeight: '24rpx'
};
/**
 * 排序样式配置
 */
export const sortStyleConfig: IStyleConfig = {
    backgroundColor: 'rgba(255, 0, 0, 1)',
    backgroundTextStyle: '',
    textColor: 'rgba(255,255,255,0.8)',
    textActiveColor: 'rgba(255,255,255,1)',
    barBackgroundImage: ''
};

export const goodsConfig = {
    titleLine: '1',
    showHeaderTag: true,
    fontSizeLarge: 40,
    fontSizeSmall: 28,
    fontSizeUnit: 20,
    titleIndent: '2rem',
    titleTagWidth: '56rpx'
};
export const getGoodsConfig = (goods: IGoodsList) => {
    let titleIndent = '0';
    let titleTagWidth = '0';

    if (goods.activityTagImg && goods.width) {
        const height = 32;
        const width = (goods.width * height) / goods.height;
        titleIndent = width + 8 + 'rpx';
        titleTagWidth = width + 'rpx';
    } else {
        titleIndent = 60 + 'rpx';
        titleTagWidth = 56 + 'rpx';
    }
    return {
        titleLine: '1',
        showHeaderTag: true,
        fontSizeLarge: 40,
        fontSizeSmall: 28,
        fontSizeUnit: 20,
        titleIndent: titleIndent,
        titleTagWidth: titleTagWidth,
        btnText: false
    };
};
