export type GoodsDetailParams = {
    goodsNo?: string;
    actGoodsNo?: string;
    studentShopId: string;
    saleNo?: string;
    activityNo?: string;
    zsdxPwd?: string;
    zoneId?: string;
    schoolDumplingId?: string;
    timeId?: string;
    date?: string;
};
export type GoodsCouponParams = {
    goodsNo: string;
    studentShopId: string;
    onlyHireCoupon: number;
};
export type CollectParam = {
    goodsNo: string;
    studentShopId: string;
    type: number;
    collectStatus: number;
};

export interface ReceiveResult {
    result: number;
    errorResult: number;
    studentCouponNo: string;
    receiveTicket?: string;
    failReason: number;
}
