import { useRequest } from '@zsdx/mp-utils';

import type { ICategoryData, IConfigStyle, IData, IListParams, ITimeData } from './types';

const request = useRequest();

/**获取分类*/
export const getCategoryList = (activityNo: string) => {
    return request.post<ICategoryData>(
        '/student-school-shop/summerVacationFreeDiscountActivity/getCategoryList',
        {
            activityNo
        }
    );
};

/**获取活动时间段*/

export const getTimeList = (activityNo: string) => {
    return request.post<ITimeData>(
        '/student-school-shop/summerVacationFreeDiscountActivity/getTimeList',
        {
            activityNo
        }
    );
};

/**获取商品列表*/
export const getDiscountList = (params: IListParams) => {
    return request.post<IData>(
        '/student-school-shop/summerVacationFreeDiscountActivity/getList',
        params
    );
};

/**获取配置样式*/

export const getConfigStyle = (activityNo: string) => {
    return request.post<IConfigStyle>(
        '/student-school-shop/summerVacationFreeDiscountActivity/getRule',
        {
            activityNo
        }
    );
};
