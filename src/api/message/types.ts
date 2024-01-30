/** 消息统计返回值 */
export interface MessageCountRes {
    /** 系统消息数 */
    systemMessage: number;
    /** 物流消息数 */
    logisticsMessage: number;
}

/** 消息类型 */
export enum MessageType {
    /** 系统消息 */
    System,
    /** 物流消息 */
    Logistics
}

/** 消息列表传参 */
export interface CommonMessageParams {
    /** 消息类型 */
    type: MessageType;
}

/** 消息读取状态 */
export enum MessageStatus {
    /** 未读 */
    Unread,
    /** 已读 */
    Read,
    /** 已点击 */
    Click
}

/** 消息单元 */
export interface CommonMessageItem {
    /** 消息 */
    messageId: number;
    /** 消息分类 */
    messageCategory: MessageType;
    /** 消息标题 */
    messageTitle: string;
    /** 消息状态 */
    status: MessageStatus;
    /** 消息时间 */
    messageTime: number;
    /** app行为 */
    appAction: string;
}

/** 通用消息列表数据 */
export interface CommonMessageRes {
    list: CommonMessageItem[];
}

export enum TopStatus {
    /** 非置顶 */
    NotTop,
    /** 置顶 */
    Top
}

/** 置顶参数 */
export interface TopParams {
    topStatus: TopStatus;
    messageId: number;
}

/** 聊天数据单元
 *
 */
export interface ChatItem {
    /** 聊天类别 */
    chatType: string;
    /** 聊天编号 */
    chatNo: string;
    /** 最后的消息 */
    latestMsg: {
        /** 消息id */
        msgId: number;
        /** 消息类型 */
        msgType: ChatMessageType;
        /** 消息内容 */
        msgContent: string;
    };
    /** 消息时间 */
    msgTime: number;
    /** 聊天用户编号 */
    chatUserNo: string;
    /** 未读消息数 */
    msgUnreadNum: number;
    /** 店铺信息 */
    shopInfo: {
        /** 店铺id */
        shopNo: string;
        /** 店铺标题 */
        shopTitle: string;
        /** 店铺logo */
        shopLogo: string;
    };
    /** 置顶状态 */
    topStatus: TopStatus;
}

/**
 * 聊天数据列表
 */
export interface ChatListRes {
    list: ChatItem[];
}

/** 点击已读参数 */
export interface AlreadyParams {
    /** 消息id */
    messageId: number;
}

export interface ChatMessageParams {
    chatNo: string;
    scrollId?: string;
}

/** 聊天消息类型 */
export enum ChatMessageType {
    /** 文字 */
    Text = 'text',
    /** 图片 */
    Image = 'image',
    /** 语音（暂不支持） */
    Voice = 'voice',
    /** 通知 */
    Notice = 'notice',
    /** 拼团/淘客商品 */
    GoodsSelf = 'goods_self',
    /** 0元购 */
    GoodsFree = 'goods_free',
    /** 折扣商品 */
    GoodsDiscount = 'goods_discount',
    /** 砍价 */
    GoodsBargain = 'goods_bargain',
    /** 秒杀 */
    GoodsFlashSale = 'goods_flash_sale',
    /** 抽奖 */
    GoodsLottery = 'goods_lottery',
    /** 新人 */
    GoodsWelfare = 'goods_welfare',
    /** 视频 */
    Video = 'video',
    /** 表情 */
    Emoji = 'emoji',
    /** 订单 */
    Order = 'order',
    /** 确认订单 */
    OrderPaid = 'order_paid',
    /** 订单签收 */
    OrderReceived = 'order_received',
    /** 队列消息 */
    Queue = 'queue',
    /** 评价 */
    Remark = 'chat_session_evaluate',
    /** 消息转接 */
    Transfer = 'chat_session_can_transfer'
}

interface CommonGoods {
    goods_title: string;
    goods_price: string;
    goods_cover: string;
}

interface CommonOrder {
    order_no: string;
    goods_no: string;
    goods_title: string;
    goods_cover: string;
    goods_price: number;
    goods_price_ori: number;
    goods_num: number;
    order_money: number;
    order_status_text: string;
}

export enum CheckStatus {
    KFChange = -1,
    None = 0,
    Confirmed = 1,
    Changed = 2
}

export enum Scene {
    Common = 'common',
    SessionStart = 'session_start',
    SessionQuit = 'session_quit'
}

/** 商品类型 */
export type GoodsType =
    | ChatMessageType.GoodsBargain
    | ChatMessageType.GoodsSelf
    | ChatMessageType.GoodsFree
    | ChatMessageType.GoodsDiscount
    | ChatMessageType.GoodsFlashSale
    | ChatMessageType.GoodsWelfare
    | ChatMessageType.GoodsLottery;

/** 聊天数据单元  */
export type MessageItem = (
    | {
          msgType: ChatMessageType.Text;
          msgContent: {
              text: string;
          };
      }
    | {
          msgType: ChatMessageType.Image;
          msgContent: {
              url: string;
              w: number;
              h: number;
          };
      }
    | {
          msgType: ChatMessageType.Emoji;
          msgContent: {
              url: string;
              title: string;
              w: number;
              h: number;
          };
      }
    | {
          msgType: ChatMessageType.Video;
          msgContent: {
              path: string;
              url?: string;
              cover: string;
              duration: number;
              w: number;
              h: number;
          };
      }
    | {
          msgType: ChatMessageType.GoodsSelf;
          msgContent: {
              goods_type: number;
              goods_no: string;
          } & CommonGoods;
      }
    | {
          msgType:
              | ChatMessageType.GoodsFree
              | ChatMessageType.GoodsDiscount
              | ChatMessageType.GoodsBargain;
          msgContent: CommonGoods;
      }
    | {
          msgType: ChatMessageType.GoodsFlashSale;
          msgContent: {
              sale_no: string;
          } & CommonGoods;
      }
    | {
          msgType: ChatMessageType.GoodsLottery;
          msgContent: {
              lottery_no: string;
          } & CommonGoods;
      }
    | {
          msgType: ChatMessageType.GoodsWelfare;
          msgContent: {
              welfare_no: string;
          } & CommonGoods;
      }
    | {
          msgType: ChatMessageType.Order;
          msgContent: Partial<CommonOrder>;
      }
    | {
          msgType: ChatMessageType.OrderPaid;
          msgContent: {
              true_name: string;
              phone: string;
              address: string;
              check_status: CheckStatus;
          } & CommonOrder;
      }
    | {
          msgType: ChatMessageType.OrderReceived;
          msgContent: CommonOrder;
      }
    | {
          msgType: ChatMessageType.Notice;
          msgContent: {
              scene: Scene;
              text: string;
          };
      }
    | {
          msgType: ChatMessageType.Queue;
          msgContent: {
              text: string;
          };
      }
    | {
          msgType: ChatMessageType.Remark;
          msgContent: {
              text: string;
          };
      }
    | {
          msgType: ChatMessageType.Transfer;
          msgContent: {
              text: string;
              chat_no: string;
              session_no: string;
          };
      }
) & {
    isSender: number;
    msgTime: number;
    isRetract: number;
    msgRead: number;
    senderInfo: {
        senderName: string;
        senderHead: string;
    };
    msgId: number;
};

/** 聊天列表数据 */
export interface MessageListRes {
    list: MessageItem[];
    scrollId: string;
}

/** 聊天信息参数 */
export interface ChatInfoParams {
    chatType: ChatType;
    /** 校园店id */
    userNo: string;
}

/** 聊天类型 */
export enum ChatType {
    Shop = 'shop',
    Official = 'official'
}

export interface ChatInfo {
    /** 聊天id */
    chatNo: string;
    /** 聊天类型 */
    chatType: ChatType;
    /** 排队位置 */
    queueCount: string;
    /** 官方聊天信息 */
    officialInfoDTO: {
        /** 官方头像 */
        officialHead: string;
        /** 官方名 */
        officialTitle: string;
    };
    /** 店铺信息 */
    shopInfo: {
        /** 店铺id */
        shopId: string;
        /** 店铺名 */
        shopTitle: string;
        /** 店铺头像 */
        shopLogo: string;
    };
}

/** 获取socket返回值 */
export interface GetSocketRes {
    socketUrl: string;
    userToken: string;
}

/** 自定义表情数据单元 */
export interface CustomEmojiItem {
    emojiTitle: string;
    imageUrl: string;
    thumbUrl: string;
}

/** 转接参数 */
export interface TransferParams {
    chatNo: string;
    sessionNo: string;
}

/** 删除撤回消息参数 */
export interface MessageOperationParams {
    chatNo: string;
    messageId: number;
}

/** 发送消息参数 */
export type SendMessageParams = {
    chatType?: ChatType;
    userNo?: string;
} & (
    | {
          msgType: ChatMessageType.Text;
          msgContent: (MessageItem & {
              msgType: ChatMessageType.Text;
          })['msgContent'];
      }
    | {
          msgType: ChatMessageType.Image;
          msgContent: (MessageItem & {
              msgType: ChatMessageType.Image;
          })['msgContent'] & {
              size: number;
          };
      }
    | {
          msgType: ChatMessageType.Emoji;
          msgContent: (MessageItem & {
              msgType: ChatMessageType.Emoji;
          })['msgContent'];
      }
    | {
          msgType: ChatMessageType.Video;
          msgContent: (MessageItem & {
              msgType: ChatMessageType.Video;
          })['msgContent'] & {
              size: number;
              coverSize: number;
          };
      }
    | {
          msgType:
              | ChatMessageType.GoodsSelf
              | ChatMessageType.GoodsFree
              | ChatMessageType.GoodsDiscount
              | ChatMessageType.GoodsBargain;
          msgContent: {
              goods_no: string;
          };
      }
    | {
          msgType: ChatMessageType.GoodsFlashSale;
          msgContent: {
              sale_no: string;
          };
      }
    | {
          msgType: ChatMessageType.GoodsLottery;
          msgContent: {
              lottery_no: string;
          };
      }
    | {
          msgType: ChatMessageType.GoodsWelfare;
          msgContent: {
              welfare_no: string;
          };
      }
    | {
          msgType: ChatMessageType.Order;
          msgContent: {
              order_no: string;
          };
      }
);

/** 发送消息状态 */
export enum MessageSendStatus {
    Success = 2,
    NotCivilization = 1,
    Failed = -1,
    ShouldFollow = -2,
    ShutUp = -3,
    Shield = -4,
    Black = -5,
    Sensitive = -6
}

/** 发送消息结果 */
export interface SendMessageRes {
    msgId: number;
    msgCode: MessageSendStatus;
}

/** 举报类型 */
export enum ReportKF {
    Official = 'official_kf',
    User = 'kf_user'
}

/** 举报参数 */
export interface ReportParams {
    reportReason: string;
    reportImages: string;
    dataType: ReportKF;
    dataNo: string;
    reportType: 'i';
}

/** 解决状态 */
export enum SolveStatus {
    UnSolved = -1,
    Solved = 1
}

/** 获取待评价会话 */
export interface ChatSessionInfo {
    chatNo: string;
    sessionNo: string;
}

/** 评价参数 */
export interface RemarkParams {
    sessionNo: string;
    score: number;
    content: string;
    solveStatus: SolveStatus;
}

/** 订单数据单元 */
export interface OrderItem {
    /** 创建时间 */
    createTime: number;
    /** 商品封面 */
    goodsCover: string;
    /** 商品标题 */
    goodsTitle: string;
    /** 商品规格 */
    goodsSpec: {
        /** 规格名 */
        specName: string;
        /** 规格值 */
        specValue: string;
    }[];
    /** 商品数量 */
    num: number;
    /** 商品价格 */
    money: number;
    /** 订单编号 */
    orderNo: string;
}

/** 最近订单列表返回值 */
export interface OrderListRes {
    list: OrderItem[];
}

/** 确认地址参数 */
export interface ConfirmAddressParams {
    /** 订单名 */
    orderNo: string;
    /** 消息id */
    msgId: number;
}
