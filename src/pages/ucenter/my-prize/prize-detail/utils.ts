import { TrackingStatus } from '@/api/order/types';
import type { PrizeLogisticsInfo } from '@/api/ucenter/types';

export function formatLogisticsInfo(data: PrizeLogisticsInfo) {
    switch (data.trackingStatus) {
        case TrackingStatus.NotDelivered:
            return { text: '等待发货', info: '商家正在加紧发货…', icon: 'zdmp-zaituzhong' };
        case TrackingStatus.None:
            return {
                text: '等待揽收',
                info: '商家已经发货，等待快递公司揽收',
                icon: 'zdmp-zaituzhong1'
            };
        case TrackingStatus.Collected:
        case TrackingStatus.Transport:
            return { text: '运送途中', info: '', icon: 'zdmp-zaituzhong' };
        case TrackingStatus.Delivery:
            return { text: '正在派件', info: '', icon: 'zdmp-paijian' };
        case TrackingStatus.Signed:
            return { text: '已签收', info: '', icon: 'zdmp-qianshou' };
        case TrackingStatus.Failed:
            return { text: '派送失败', info: '', icon: 'zdmp-paijian' };
        case TrackingStatus.Problem:
            return { text: '疑难件', info: '', icon: 'zdmp-paijian' };
        case TrackingStatus.Exit:
            return { text: '退件签收', info: '', icon: 'zdmp-paijian' };
        default:
            return { text: '', info: '', icon: '' };
    }
}
