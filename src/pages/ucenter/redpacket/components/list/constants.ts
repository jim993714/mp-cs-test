import { CardStatus, LimitType } from '@/api/redpacket/types';

import { Tab } from './types';

/** 红包卡券列表的切换类型 */
export const radios = [
    {
        label: '可使用',
        value: CardStatus.Unused + 1
    },
    {
        label: '已使用',
        value: CardStatus.Used + 1
    },
    {
        label: '已失效',
        value: CardStatus.Invalid + 1
    }
];

/** 通用获取列表数据 */
export function getCommonList(tab: Tab) {
    let api = '';
    switch (tab) {
        case Tab.Coupon:
            api = '/student-school-shop/redEnvelopeCardVoucher/getMyCouponList';
            break;
        case Tab.Package:
            api = '/student-school-shop/redEnvelopeCardVoucher/getMyPacketList';
            break;
        case Tab.Packet:
            api = '/student-school-shop/redEnvelopeCardVoucher/getMyRedPacketList';
            break;
        case Tab.CommunityPacket:
            api = '/student-school-shop/redEnvelopeCardVoucher/getMyCommunityRedPacketList';
            break;
        case Tab.Allowance:
            api = '/student-school-shop/redEnvelopeCardVoucher/getMyAllowanceList';
            break;
        default:
            break;
    }

    return api;
}

/** 获取商品适用范围 */
export function getGoodLimit(useLimitType: LimitType) {
    const range = '适用商品：';
    switch (useLimitType) {
        case LimitType.All:
            return range + '全部商品';
        case LimitType.SomeCan:
            return range + '指定商品可用';
        default:
            return range + '指定商品不可用';
    }
}
