import { ChatMessageType, CheckStatus, type MessageItem } from '@/api/message/types';

/** 聊天交互小工具类型 */
export enum FunctionType {
    OrderList,
    Remark,
    Report,
    Close
}

/** 聊天交互小工具 */
export const chatFunctions = [
    {
        label: '订单咨询',
        value: FunctionType.OrderList
    },
    {
        label: '服务评价',
        icon: 'zdmp-pingjia',
        iconColor: '#199fff',
        value: FunctionType.Remark
    },
    {
        label: '投诉举报',
        icon: 'zdmp-jubao',
        iconColor: '#199fff',
        value: FunctionType.Report
    },
    {
        label: '结束会话',
        icon: 'zdmp-guanbi',
        iconColor: '#F95B56',
        value: FunctionType.Close
    }
];

export enum MediaType {
    Album,
    Camera,
    Video
}

/** 多媒体功能数组 */
export const mediaItems = [
    {
        label: '图片',
        icon: 'zdmp-xiangce',
        value: MediaType.Album
    },
    {
        label: '拍照',
        icon: 'zdmp-xiangjidefuben',
        value: MediaType.Camera
    },
    {
        label: '短视频',
        icon: 'zdmp-shipindefuben',
        value: MediaType.Video
    }
];

/** 订单操作展示文案 */
export const checkLabels = {
    [CheckStatus.KFChange]: '联系客服修改',
    [CheckStatus.None]: '确认地址',
    [CheckStatus.Confirmed]: '已确认',
    [CheckStatus.Changed]: '已修改'
};

/** 获取聊天内容参数 */
export function getMsgContentParams(
    goodType: Pick<MessageItem, 'msgType'>['msgType'],
    goodsNo: string
) {
    switch (goodType) {
        case ChatMessageType.GoodsSelf:
        case ChatMessageType.GoodsFree:
        case ChatMessageType.GoodsDiscount:
        case ChatMessageType.GoodsBargain:
            return {
                goods_no: goodsNo
            };
        case ChatMessageType.GoodsFlashSale:
            return {
                sale_no: goodsNo
            };
        case ChatMessageType.GoodsLottery:
            return {
                lottery_no: goodsNo
            };
        case ChatMessageType.GoodsWelfare:
            return {
                welfare_no: goodsNo
            };
        default:
            return {};
    }
}
