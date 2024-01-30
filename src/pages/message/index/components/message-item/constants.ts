import { ChatMessageType } from '@/api/message/types';

/** 消息展示名称 */
export const messageDisplay = {
    [ChatMessageType.Image]: '[图片]',
    [ChatMessageType.Video]: '[视频]',
    [ChatMessageType.Order]: '[订单信息]',
    [ChatMessageType.OrderPaid]: '[订单信息]',
    [ChatMessageType.OrderReceived]: '[订单信息]',
    [ChatMessageType.GoodsSelf]: '[商品]',
    [ChatMessageType.GoodsFree]: '[商品]',
    [ChatMessageType.GoodsDiscount]: '[商品]',
    [ChatMessageType.GoodsBargain]: '[商品]',
    [ChatMessageType.GoodsFlashSale]: '[商品]',
    [ChatMessageType.GoodsLottery]: '[商品]',
    [ChatMessageType.GoodsWelfare]: '[商品]',
    [ChatMessageType.Voice]: '',
    [ChatMessageType.Notice]: '',
    [ChatMessageType.Text]: '',
    [ChatMessageType.Emoji]: '',
    [ChatMessageType.Queue]: '',
    [ChatMessageType.Remark]: '',
    [ChatMessageType.Transfer]: ''
};
