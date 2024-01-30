import { useRequest } from '@zsdx/mp-utils';

import type {
    ISchoolDumplingData,
    ISchoolDumplingDetail,
    ISchoolDumplingDetailParams,
    ISchoolDumplingParams
} from './type';

const request = useRequest();

/**
 * 获取校园团活动列表
 */
export const getSchoolDumplingList = (params: ISchoolDumplingParams) => {
    return request.post<ISchoolDumplingData>(
        '/student-school-shop/activity/school-dumpling/list',
        params
    );
};

/**
 * 获取校园团活动明细
 */
export const getSchoolDumplingDetail = (params: ISchoolDumplingDetailParams) => {
    return request.post<ISchoolDumplingDetail>(
        '/student-school-shop/activity/school-dumpling/detail',
        params
    );
};

/**
 * 获取校园团活动头图
 */
export const getSchoolDumplingBanner = () => {
    return request.post<string>('/student-school-shop/activity/school-dumpling/head-img');
};

/**
 * 是否允许参团
 */

export const checkJoinGroup = (params: ISchoolDumplingDetailParams) => {
    return request.post<boolean>(
        '/student-school-shop/activity/school-dumpling/check/submit',
        params
    );
};
