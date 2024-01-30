import { useRequest } from '@zsdx/mp-utils';

import type { IBannerData } from '../home/types';

export * from './my-collect';
export * from './my-prize';

const request = useRequest();

/** 获取banner列表 */
export const getBannerList = (studentShopId: string) => {
    return request.post<IBannerData>('/student-school-shop/user/info/banner/list', {
        studentShopId
    });
};
