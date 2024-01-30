interface BackgroundImage {
    /**
     * 地址
     */
    url: string;
    /**
     * 宽度
     */
    width: number;
    /**
     * 高度
     */
    height: number;
}
export interface LotteryPageConfig {
    /**
     * 背景图
     */
    background_images: BackgroundImage[];
    /**
     * 转盘指针图片
     */
    turntable_hand_image: string;
    /**
     * 转盘图片
     */
    turntable_image: string;
    /**
     * 转盘距离顶部距离
     */
    turntable_top: number;
}

export interface LotteryDetail {
    /**
     * 活动标题
     */
    description: string;
    /**
     * 抽奖页面配置
     */
    pageConfig: LotteryPageConfig;
    /**
     * 剩余抽奖次数
     */
    chanceCount: number;
}

export enum LotteryApplyResultType {
    /**申请成功 */
    SUCCESS = '1',
    /**次数不足 */
    NO_CHANCE = '-1'
}

export interface LotteryApplyResult {
    /**
     * 申请抽奖结果 1: 成功 -1: 次数不足
     */
    result: LotteryApplyResultType;
    /**
     * 抽奖申请编号，用于查询抽奖结果
     */
    tryNo: string;
}

export enum LotteryResultType {
    /**
     * 待开奖
     */
    WAIT = '0',
    /**
     * 中奖
     */
    SUCCESS = '1',
    /**
     * 未中奖
     */
    FAIL = '-1'
}

export enum LotteryResultPrizeType {
    /**
     * 商品
     */
    GOODS = 1,
    /**
     * 优惠券
     */
    COUPON = 2,
    /**
     * 红包
     */
    REDPACKET = 3,
    /**
     * 暑期一分购
     */
    SUMMER = 5
}

export interface LotteryResult {
    result: LotteryResultType;
    /**
     * 旋转角度
     */
    rotateAngle: string;
    /**
     * 奖品类型
     */
    type: LotteryResultPrizeType;
    /**
     * 兑换编号
     */
    exchangeNo: string;
    /**
     * 优惠券是否领取成功
     */
    couponReceive: 1 | 0;
    /**
     * 优惠券编号
     */
    couponNo: string;
    /**
     * 红包是否领取成功
     */
    redPacketReceive: 1 | 0;
    /**
     * 红包编号
     */
    packetNo: string;
    /**
     * 是否单商品使用
     */
    isSingleGoods: 1 | 0;
    /**
     * 奖品名称
     */
    title: string;
    /**
     * 奖品图片
     */
    image: string;
}
