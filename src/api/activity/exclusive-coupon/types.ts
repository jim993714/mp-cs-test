/**优惠券转赠分享列表请求参数*/

export interface ISubfitCouponParams {
    shareKey: string;
}
/**转赠分享*/
export interface IShareCouponData {
    couponListDTO: Array<ICoupon>;
    shareInfoDTO: IShareInfo;
}

/**优惠券类型*/
export interface ICoupon {
    useStartTime: number /**  使用开始时间	 */;
    discountNum: number /** 优惠金额	  */;
    useEndTime: number /** 使用结束时间	  */;
    shopNo: string /** 店铺编号	  */;
    invalidReason: string /**  失效原因 */;
    receiveStatus: number /** 领取状态：0未使用；1已使用；2已失效  */;
    desc: string /** 优惠券简介 */;
    status: number /**  优惠券状态：0未使用；1已使用；2已失效 */;
    shopLogo: string /**店铺logo   */;
    isSingleGoods: number /** 是否单个商品使用 */;
    useLimitType: number /**  使用范围限制，1:全部商品, 2:指定商品可用, 4:指定商品不可用 */;
    studentCouponNo: string /**  用户优惠券编号	 */;
    title: string /** 优惠券标题	 */;
    couponNo: string /**  优惠券编号	 */;
    discountLimitType: number /** 使用门槛类型，0:无门槛, 1:满金额, 2:满数量 */;
    discountLimit: number /**  使用门槛(discount_limit_type=1:最低要求金额, =2:在最低要求商品数量) */;
    category: number /**  优惠券分类,0:商城,1:校园店*/;
    couponType: number /**  优惠券类型 1:金额减免券, 2:折扣券	 */;
}
/**分享用户信息*/
export interface IShareInfo {
    studentShopId: string /**  分享者的校园店id	 */;
    shareTrueName: string /**  分享者昵称	 */;
    shareHeadImg: string /** 分享者头像	  */;
    shareStartTime: number /**  分享开始时间	 */;
    shareEndTime: number /**  分享结束时间	 */;
    isSelf: number /** 	是否是分享者，1:是,0否  */;
    isReceiveForToday: number /** 今日是否已经领取	  */;
}

/**领取优惠券参数*/
export interface IReceiveParams {
    shareKey: string;
    studentCouponNo: string;
}

/**领取优惠券结果*/

export interface IReceiveResult {
    result: number;
    studentCouponNo: string;
    receiveTicket: string;
}

/**领取优惠券队列结果*/
export interface ICheckReceiveResult {
    result: number;
    studentCouponNo: string;
    failReason: string;
}
