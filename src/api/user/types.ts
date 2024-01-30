export interface BasicStat {
    /**
     * 红包卡券数量
     */
    couponCount: number;
    /**
     * 收藏订阅
     */
    collectGoodsCount: number;
    /**
     * 浏览足迹
     */
    historyGoodsCount: number;
}

export interface OrderStat {
    /**
     * 待付款
     */
    unPayCount: number;
    /**
     * 待发货
     */
    processCount: number;
    /**
     * 待收货
     */
    shipCount: number;
    /**
     * 退款/售后
     */
    afterSaleCount: number;
}

export interface UserStat {
    basic: BasicStat;
    order: OrderStat;
}

/** 修改用户信息字段 */
export interface SetUserInfoParams {
    /** 头像 */
    headImg?: string;
    /** 昵称 */
    trueName?: string;
}

/** 旧手机号参数 */
export interface VerifyOldMobileParams {
    /** 验证码 */
    phoneVerifyCode: string;
}

/** 新手机获取验证码参数 */
export interface NewMobileParams {
    /** 手机号 */
    phone: string;
}

/** 新手机验证码校验参数 */
export interface NewMobileVerifyParams {
    /** 手机号 */
    phone: string;
    /** 验证码 */
    newPhoneVerifyCode: string;
}

export interface LogoffFinanceInfo {
    /** 可提现金额 */
    money: string;
    /** 待到账的金额 */
    totalWaitMoney: string;
}

export interface LogoffMobileParams {
    /** 注销验证码 */
    phoneVerifyCode: string;
    /** 注销原因 */
    deleteReason?: string;
}
