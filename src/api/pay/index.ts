import { useRequest } from '@zsdx/mp-utils';

import type { PayInfo } from './types';

const request = useRequest();

/**
 * 获取支付信息
 * @param params
 */
export function getPayInfo(params: { orderNos: string[]; jsCode: string }) {
    return request.post<PayInfo>('/student-school-shop/pay/wechat/info', params);
}

/**
 * 获取支付结果
 * @param params
 */
export function getPayStatus(params: { orderNos: string[]; jsCode: string }) {
    return request.post<number>('/student-school-shop/pay/wechat/status', params);
}
