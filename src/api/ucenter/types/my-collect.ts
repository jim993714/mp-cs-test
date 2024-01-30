export interface CollectGoods {
    /**
     * 商品价格
     */
    goodsPrice: number;
    /**
     * 商品类型 1-拼团 2-淘宝
     */
    goodsType: number;
    /**
     * 商品原价
     */
    goodsPriceOrigin: number;
    /**
     * 商品编号
     */
    goodsNo: string;
    /**
     * 商品封面
     */
    goodsCover: string;
    /**
     * 商品标题
     */
    goodsTitle: string;
    /**
     * 销量
     */
    goodsSale: number;

    /**
     * 商品价格类型
     */
    goodsShowPriceType: number;
    /**
     * 显示的商品价格
     */
    goodsShowPrice: number;
    /**
     * 显示的商品原价
     */
    goodsShowOriginPrice: number;
}

export interface CollectShop {
    /**
     * 校园店id
     */
    studentShopId: string;
    /**
     * 是否买过
     */
    hasBuy: boolean;
    /**
     * logo
     */
    shopLogo: string;
    /**
     * 名字
     */
    shopName: string;
    /**
     * 订阅数量
     */
    collectCount: number;
}
