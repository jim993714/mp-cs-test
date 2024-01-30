import { useRequest } from '@zsdx/mp-utils';

import type {
    COMPONENT_TYPE_FOR_DATA,
    GoodsItem,
    PageConfig
} from '@/pages/shop/custom-page/types';

const request = useRequest();

interface Page {
    next_page: number;
}

/**
 * 获取自定义页面信息
 */
export function getCustomPage(pageNo: string) {
    return request.post<{
        result: 1 | -1;
        pageConfig: PageConfig;
    }>('/student-school-shop/customPage/getCustomPage', { pageNo });
}

/**
 * 获取自定义页面组件信息
 */
export function getCustomPageData(params: { type: COMPONENT_TYPE_FOR_DATA; dataJson: string }) {
    return request.post<{
        data: {
            list: GoodsItem[];
            page: Page;
        };
    }>('/student-school-shop/customPage/getCustomPageData', params);
}
