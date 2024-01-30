import type {
    GoodsInfo,
    Product,
    Spec
} from '@zsdx/mp-material/dist/lib/components/zd-sku-pop/types';

export interface ShopCartGoodsSpec {
    /**
     * 规格编号
     */
    specNo: string;
    /**
     * 规格名称
     */
    specName: string;
    /**
     * 规格值
     */
    specValue: string;
}

export interface ShopCartItem {
    /**
     * 是否选中
     */
    isChecked?: boolean;
    /**
     * 产品状态 1:有效 0:无效
     */
    productStatus: number;
    /**
     * 产品库存
     */
    productStock: number;
    /**
     * 产品图片
     */
    productImage: string;
    /**
     * 购买数量
     */
    buyNum: number;
    /**
     * 产品编号
     */
    productNo: string;
    /**
     * 产品价格
     */
    productPrice: string;
    /**
     * 产品价格
     */
    goodsShowPrice: number;
    /**
     * 产品原价格
     */
    goodsShowOriginPrice: number;
    /**
     * 产品价格类型: 1: 活动价, 2: 学生价, 3: 原价
     */
    goodsShowPriceType: number;
    /**
     * 是否有会员折扣
     */
    hasVipDiscount: number;
    /**
     * 会员折扣
     */
    goodsDiscountVip: number;
    /**
     * 学生店铺id
     */
    studentShopId: string;
    /**
     * 规格集
     */
    shopCartGoodsSpecs: ShopCartGoodsSpec[];
    /**
     * 阶梯团购返现金额
     */
    maxSubsidy?: number;
    /**
     * 大促活动类型: 0普通大促, 4阶梯团购返现
     */
    subActivityType?: number;
    /**
     * 阶梯团购活动编号
     */
    activityNo?: string;
}

export interface ShopCartGoods {
    /**
     * 学生店铺id
     */
    studentShopId: string;
    /**
     * 商品编号
     */
    goodsNo: string;
    /**
     * 商品标题
     */
    goodsTitle: string;
    /**
     * 商品封面
     */
    goodsCover: string;
    /**
     * 商品是否跨境
     */
    goodsIsCrossBorder: number;
    /**
     * 限购数量
     */
    buyLimitCount: number;
    /**
     * 购买数量
     */
    buyCount: number;
    /**
     * 公司名称
     */
    companyName: string;
    /**
     * 规格列表
     */
    shopCartItems: ShopCartItem[];
}

export interface ShopCartExpired {
    /**
     * 商品编号
     */
    goodsNo: string;
    /**
     * 商品标题
     */
    goodsTitle: string;
    /**
     * 商品封面
     */
    goodsCover: string;
    /**
     * 规格列表
     */
    shopCartItems: ShopCartItem[];
}

export interface ShopCartRes {
    /**
     * 学生店铺id
     */
    studentShopId: string;
    /**
     * 商品列表
     */
    shopCartGoods: ShopCartGoods[];
    /**
     * 过期商品列表
     */
    shopCartExpireds: ShopCartExpired[];
}

export interface RemoveGoodsParams {
    studentShopId: string;
    productNo: string[];
}

export interface UpdateGoodsParams {
    studentShopId: string;
    oldProductNo?: string;
    productNo?: string;
    buyNum: number;
}

export interface ShopCartSpec {
    name: string;
    shopCartGoodsSpecs: ShopCartGoodsSpec[];
}

export interface ShopCartProduct {
    shopCartProductSpecs: ShopCartGoodsSpec[];
    productNo: string;
    productImage: string;
    productPrice: number;
    productStock: number;
    productIdentify: string;
}

export interface GetSkuInfoRes {
    /**商品价格 */
    goodsPrice: number;
    /**商品类型 */
    goodsType: number;
    /**商品原价 */
    goodsPriceOrigin: number;
    /**商品编号 */
    goodsNo: string;
    /**商品标题 */
    goodsTitle: string;
    /**商品封面 */
    goodsCover: string;
    /**付款金额 */
    goodsPricePay: number;
    /**优惠金额 */
    couponMoney: number;
    shopCartSpecs: ShopCartSpec[];
    shopCartProducts: ShopCartProduct[];
    /**
     * 产品价格
     */
    goodsShowPrice: number;
    /**
     * 产品原价格
     */
    goodsShowOriginPrice: number;
    /**
     * 产品价格类型: 1: 活动价, 2: 学生价, 3: 原价
     */
    goodsShowPriceType: number;
}

export interface SkuInfo {
    goodsInfo: GoodsInfo;
    productList: Product[];
    specList: Spec[];
}
