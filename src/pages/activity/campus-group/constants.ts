import type { ISchoolDumplingList } from '@/api/activity/campus-group/type';

import type { IGoodsCardConfig, ITab } from './type';

/**
 * tab栏
 */
export const tabList = ref<Array<ITab>>([
    {
        label: '可参团',
        value: 0,
        isActive: true
    },
    {
        label: '可开团',
        value: 1,
        isActive: false
    }
]);

/**
 * 商品卡片设置
 */
export const goodsConfig = ref<IGoodsCardConfig>({
    titleLine: '1',
    btnBg: 'linear-gradient(90deg, #31E7FF 0%, #18BFFF 100%)'
});

/**
 * 获取倒计 label
 */
export const getTimeLabel = (status: string) => {
    if (status) {
        return '距团购结束';
    } else {
        return '距结束';
    }
};

/**
 * 获取倒计时间
 */
export const getTime = (item: ISchoolDumplingList) => {
    const date = Date.parse(new Date() + '');
    if (item.showAwaitingGroupFormation || item.schoolDumplingId) {
        return (item.expireTime - date) / 1000;
    } else if (!item.schoolDumplingId) {
        return (item.endTime - date) / 1000;
    }
    return 0;
};
