import { MessageType } from '@/api/message/types';
import { CDN_BASE_URL } from '@/base/constants';

/** 消息列表类型 */
export const tabs = [
    {
        label: '交易物流',
        value: MessageType.Logistics,
        icon: CDN_BASE_URL + '/mp-cs/images/ucenter/message-icon.png',
        color: '#F0FFFD'
    },
    {
        label: '系统消息',
        value: MessageType.System,
        icon: CDN_BASE_URL + '/mp-cs/images/ucenter/nofity-icon.png',
        color: '#FFF5F6'
    }
];
