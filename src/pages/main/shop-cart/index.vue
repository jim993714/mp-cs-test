<script setup lang="ts">
import { storage } from '@zsdx/mp-utils';

import { getShopCartList, getSkuInfo, removeShopCartGoods, updateShopCart } from '@/api/shop-cart';
import type { ShopCartExpired, ShopCartGoods, ShopCartItem, SkuInfo } from '@/api/shop-cart/types';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';

import ActionBar from './components/action-bar.vue';
import Empty from './components/empty.vue';
import ExpireGoodsItem from './components/expire-goods-item.vue';
import GoodsItem from './components/goods-item.vue';

const userStore = useUserStore();
const appStore = useAppStore();
const { isLogin, studentShopId } = toRefs(userStore);

const actionBarRef = ref<InstanceType<typeof ActionBar>>();
const isManage = ref(false);
const isInit = ref(false);
const isRefresh = ref(false);
const goodsList = ref<ShopCartGoods[]>([]);
const navHeight = (uni.getSystemInfoSync().statusBarHeight || 0) + 44;
const expiredGoodsList = ref<ShopCartExpired[]>([]);
const localStorage = storage();

const trackData = {
    type: 'all',
    clientTop: uni.getWindowInfo().windowHeight / 2
};
const changeSkuInfo = ref<SkuInfo>({
    goodsInfo: {
        goodsNo: '',
        goodsCover: '',
        goodsPrice: 0,
        buyCount: 0,
        buyLimitCount: 0,
        goodsShowPrice: 0,
        goodsShowOriginPrice: 0,
        goodsShowPriceType: 0
    },
    productList: [],
    specList: []
});
const oldProduct = ref<ShopCartItem>();
const skuPop = ref();

async function getDataList() {
    uni.showLoading({
        title: '加载中'
    });

    try {
        const { shopCartGoods, shopCartExpireds } = await getShopCartList(studentShopId.value);

        goodsList.value = shopCartGoods;
        expiredGoodsList.value = shopCartExpireds;

        isInit.value = true;

        actionBarRef.value?.clearMoney();
        appStore.updateShopCartCount();
    } finally {
        uni.hideLoading();
    }
}

function onCheckAll(isChecked: boolean) {
    goodsList.value.forEach(goods => {
        goods.shopCartItems.forEach(product => {
            product.isChecked = isChecked;
        });
    });
}

function removeExpiredGoods() {
    const products = expiredGoodsList.value.map(goods => goods.shopCartItems).flat();

    remove(products);
}

async function remove(products: ShopCartItem[]) {
    await removeShopCartGoods({
        studentShopId: studentShopId.value,
        productNo: products.map(product => product.productNo)
    });

    uni.showToast({
        title: '删除成功',
        icon: 'none'
    });

    getDataList();
}

async function handleChangeSku(info: { product: ShopCartItem; goodsNo: string }) {
    oldProduct.value = info.product;
    // 获取sku详情
    const data = await getSkuInfo(info.goodsNo);

    changeSkuInfo.value = {
        goodsInfo: {
            goodsNo: data.goodsNo,
            goodsCover: data.goodsCover,
            goodsPrice: data.goodsPrice,
            buyCount: 0,
            buyLimitCount: 0,
            goodsShowPrice: data.goodsShowPrice,
            goodsShowOriginPrice: data.goodsShowOriginPrice,
            goodsShowPriceType: data.goodsShowPriceType
        },
        productList: data.shopCartProducts.map(product => ({
            ...product,
            specList: product.shopCartProductSpecs
        })),
        specList: data.shopCartSpecs.map(spec => ({
            ...spec,
            list: spec.shopCartGoodsSpecs
        }))
    };

    skuPop.value?.open();
}

/**
 * 确认选择sku
 */
async function onSelectSku(product: { productNo: string; count: number; price: number }) {
    await updateShopCart({
        oldProductNo: oldProduct.value?.productNo as string,
        productNo: product.productNo,
        buyNum: oldProduct.value?.buyNum as number,
        studentShopId: studentShopId.value
    });

    uni.showToast({
        title: '修改成功',
        icon: 'none'
    });

    getDataList();
}

// 商品发生变化
function onGoodsChange() {
    actionBarRef.value?.calcPayMoney();
}

async function init() {
    if (!isLogin.value) {
        goodsList.value = [];
        isInit.value = true;
        return;
    }
    await getDataList();
}

async function refresh() {
    if (!isLogin.value) {
        isInit.value = true;
        goodsList.value = [];
        return;
    }
    isRefresh.value = true;
    await getDataList();

    setTimeout(() => {
        isRefresh.value = false;
    }, 500);
}

onShow(init);
</script>

<template>
    <zd-header
        class="page-header"
        capsule
    >
        <template #left>
            <view class="page-title">购物车</view>
        </template>
        <template #right>
            <view
                class="manage"
                @tap="isManage = !isManage"
            >
                {{ isManage ? '完成' : '管理' }}
            </view>
        </template>
    </zd-header>
    <view :style="{ height: `${navHeight}px` }" />
    <scroll-view
        v-if="goodsList.length > 0 && isInit && isLogin"
        scroll-y
        refresher-enabled
        :refresher-triggered="isRefresh"
        :style="{ height: `calc(100vh - ${navHeight}px)` }"
        @refresherrefresh="refresh"
    >
        <view class="page-main">
            <!-- 商品列表 -->
            <view class="goods-list">
                <view
                    v-for="(goods, gIdx) in goodsList"
                    :key="goods.goodsNo"
                    class="goods-item"
                >
                    <track-view
                        :track-data="{
                            ...trackData,
                            observerName: '.shopCart' + gIdx,
                            eventData: {
                                path: 'bi_feeds',
                                student_shop_id: localStorage.get('studentShopId'),
                                page_data_type: 'shopCart',
                                data_type: 'Goods',
                                data_id: goods.goodsNo,
                                data_info: goods,
                                index: gIdx
                            }
                        }"
                    >
                        <goods-item
                            :goods="goods"
                            :student-shop-id="studentShopId"
                            @delete="remove([$event])"
                            @change-sku="handleChangeSku"
                            @change="onGoodsChange"
                        />
                    </track-view>
                </view>
            </view>

            <!-- 失效列表 -->
            <view
                v-if="expiredGoodsList.length > 0"
                class="goods-list"
            >
                <view class="block-title">
                    <view class="count">
                        失效商品共<text>{{ expiredGoodsList.length }}</text
                        >件
                    </view>
                    <view
                        class="remove"
                        @tap="removeExpiredGoods"
                        >清空失效商品</view
                    >
                </view>
                <view
                    v-for="goods in expiredGoodsList"
                    :key="goods.goodsNo"
                    class="goods-item"
                >
                    <expire-goods-item
                        :goods="goods"
                        @delete="remove([$event])"
                    />
                </view>
            </view>
        </view>
    </scroll-view>

    <view
        v-if="goodsList.length > 0 && isInit"
        class="action-view"
    >
        <action-bar
            ref="actionBarRef"
            :goods-list="goodsList"
            :is-manage="isManage"
            :student-shop-id="studentShopId"
            @check-all="onCheckAll"
            @remove="remove($event)"
        />
    </view>
    <empty v-if="isInit && goodsList.length === 0" />

    <zd-sku-pop
        ref="skuPop"
        :show-number="false"
        :info="changeSkuInfo.goodsInfo"
        :product-list="changeSkuInfo?.productList"
        :spec-list="changeSkuInfo?.specList"
        @submit="onSelectSku"
    />
</template>

<style>
page {
    padding-bottom: 100rpx;
    background-color: #f5f8fa;
}
</style>

<style lang="scss" scoped>
.page-header {
    position: fixed;
    top: 0;
    z-index: 99;
    background-color: #ffffff;
    line-height: 88rpx;

    .page-title {
        margin-left: 40rpx;
        color: $uni-color-title;
        font-size: 36rpx;
        font-weight: 600;
    }

    .manage {
        margin-right: 20rpx;
        color: #576066;
        font-size: 28rpx;
        font-weight: 500;
    }
}
.page-main {
    padding: 20rpx 20rpx 120rpx;

    .goods-list {
        margin-bottom: 20rpx;
        padding: 20rpx 0;
        border-radius: 16rpx;
        background: #ffffff;
    }
}

.action-view {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 750rpx;
    height: 100rpx;
    background: #ffffff;
}

.block-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10rpx 20rpx 20rpx;

    .count {
        color: $uni-text-color;
        font-size: 32rpx;
        font-weight: 500;
        line-height: 40rpx;

        text {
            color: $zd-color-red;
        }
    }

    .remove {
        color: $zd-color-red;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 40rpx;
    }
}
</style>
