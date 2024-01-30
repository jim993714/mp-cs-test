import { useRequest } from '@zsdx/mp-utils';

import type { ICategoryData, IPackageData, IPackageListParams, IStyle } from './types';

const request = useRequest();

/**获取组合包分类*/
export const getCategoryList = () => {
    return request.post<ICategoryData>(
        '/student-school-shop/activity/schoolSeasonCombinationPackage/getSchoolSeasonCategoryList'
    );
};
/**获取组合包样式配置*/

export const getPackageStyle = () => {
    return request.post<IStyle>(
        '/student-school-shop/activity/schoolSeasonCombinationPackage/getActivityImage'
    );
};

/**获取组合包列表*/
export const getActivityList = (params: IPackageListParams) => {
    return request.post<IPackageData>(
        '/student-school-shop/activity/schoolSeasonCombinationPackage/getActivityList',
        params
    );
};
