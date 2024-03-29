import { useRequest } from '@zsdx/mp-utils';

import type {
    GetBuyAlertListItem,
    GetSaleGoodsDetailResp,
    GetTimeGoodsListReq,
    GoodsListItemResp,
    SaleGoodsDetailReq,
    TimeListResp
} from './types';

const request = useRequest();

/**
 * 获取场次信息
 * @returns
 */
export function fetchTimeList() {
    // return Promise.resolve({
    //     imageUrl: 'https://pic.wxhand.com/phaadmin_image/3e5c5985771393469be3d6f8ba19688c.jpg',
    //     appAction: '',
    //     list: [
    //         {
    //             timeNo: '1',
    //             startTime: '08:00',
    //             endTime: 4234234
    //         },
    //         {
    //             timeNo: '2',
    //             startTime: 24234,
    //             endTime: 4234
    //         }
    //     ]
    // } as TimeListResp);
    return request.post<TimeListResp>('/student-school-shop/flashSale/getTimeList');
}

/**
 * 获取商品列表
 * @param params
 * @returns
 */
export function fetchTimeGoodsList(params: GetTimeGoodsListReq) {
    return request.post<GoodsListItemResp>(
        '/student-school-shop/flashSale/getTimeGoodsList',
        params
    );
}

/**
 * 秒杀商品详情
 * @param params
 * @returns
 */
export function fetchSaleGoodsDetail(params: SaleGoodsDetailReq) {
    return request.post<GetSaleGoodsDetailResp>(
        '/student-school-shop/flashSale/getSaleGoodsDetail',
        params
    );
}

/**
 * 秒杀预约
 * @param params
 * @returns
 */
export function setSaleAlert(params: { saleNo: string; status: number }) {
    return request.post('/student-school-shop/flashSale/setSaleAlert', params);
}

/**
 * 大促预约
 * @returns
 */
export function fetchBuyAlertList() {
    return request.post<GetBuyAlertListItem>('/student-school-shop/flashSale/getBuyAlertList');
}
