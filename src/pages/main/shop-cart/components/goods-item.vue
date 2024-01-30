<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { updateShopCart } from '@/api/shop-cart';
import type { ShopCartGoods, ShopCartItem } from '@/api/shop-cart/types';

import ProductSku from './product-sku.vue';

const props = defineProps<{
    goods: ShopCartGoods;
    studentShopId: string;
}>();
const emit = defineEmits<{
    (event: 'change', product: ShopCartItem): void;
    (event: 'delete', product: ShopCartItem): void;
    (event: 'change-sku', info: { product: ShopCartItem; goodsNo: string }): void;
}>();

const { goods } = toRefs(props);

function showOverTip() {
    uni.showToast({
        title: '已达购买上限',
        icon: 'none'
    });
}

function fnGoActivity(no?: string) {
    if (!no) {
        uni.showToast({
            title: '参数缺失',
            icon: 'none'
        });
        return;
    }
    router.push('newYearShop', {
        activityNo: no
    });
}

function handleCheck(product: ShopCartItem) {
    emit('change', product);
}

async function update(product: ShopCartItem) {
    await updateShopCart({
        buyNum: product.buyNum,
        oldProductNo: product.productNo,
        studentShopId: props.studentShopId
    });

    emit('change', product);
}
</script>

<template>
    <zd-swipe-action
        v-for="product in goods.shopCartItems"
        :key="product.productNo"
        :actions="['delete']"
        @click="emit('delete', product)"
    >
        <view class="product-item">
            <zd-checkbox
                v-model="product.isChecked"
                @change="handleCheck(product)"
            />

            <view
                class="goods-cover"
                @tap="router.push('goodsDetail', { goodsNo: goods.goodsNo })"
            >
                <image
                    class="goods-cover-image"
                    :src="product.productImage"
                    mode="aspectFill"
                />
            </view>
            <view class="goods-main">
                <view
                    class="goods-title"
                    @tap="router.push('goodsDetail', { goodsNo: goods.goodsNo })"
                >
                    {{ goods.goodsTitle }}
                </view>
                <view class="goods-sku">
                    <product-sku
                        :sku-list="product.shopCartGoodsSpecs"
                        @tap.stop="
                            emit('change-sku', {
                                product: product,
                                goodsNo: goods.goodsNo
                            })
                        "
                    />
                </view>
                <view class="goods-price">
                    <zd-price
                        :value="product.goodsShowPrice"
                        :font-size-large="40"
                        :font-size-small="24"
                        :font-size-unit="20"
                    />
                    <zd-number-box
                        v-model="product.buyNum"
                        :min="1"
                        :max="
                            goods.buyLimitCount === -1 ? product.productStock : goods.buyLimitCount
                        "
                        @over="showOverTip"
                        @change="update(product)"
                    />
                </view>
            </view>
        </view>
        <view
            v-if="product.maxSubsidy && product.subActivityType === 4"
            class="cashback-wrap"
        >
            <view class="cashback-tag">年货团</view>
            <view class="cashback-text">最多返{{ product.maxSubsidy }}元</view>
            <view
                class="cashback-btn"
                @tap="fnGoActivity(product.activityNo)"
            >
                <view class="cashback-btn-text">查看更多</view>
                <zd-icon
                    :size="24"
                    type="zdmp-qianwang"
                    color="rgba(25, 159, 255, 1)"
                />
            </view>
        </view>
    </zd-swipe-action>
</template>

<style lang="scss" scoped>
.product-item {
    display: flex;
    align-items: center;
    height: 220rpx;
    padding: 20rpx;
    box-sizing: border-box;
    gap: 20rpx;

    .goods-cover {
        width: 180rpx;
        height: 180rpx;
        &-image {
            width: 180rpx;
            height: 180rpx;
            border-radius: 8rpx;
        }
    }

    .goods-main {
        height: 180rpx;
        .goods-title {
            overflow: hidden;
            width: 418rpx;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: $uni-text-color;
            font-size: 28rpx;
            font-weight: 400;
            line-height: 36rpx;
        }

        .goods-sku {
            max-width: 400rpx;
            margin-top: 20rpx;
        }

        .goods-price {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 32rpx;
        }
    }
}
.cashback-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 54rpx;
    padding-left: 72rpx;
    flex-direction: row;
    box-sizing: border-box;
    .cashback-tag {
        margin-right: 12rpx;
        padding: 0 10rpx;
        border: 1px solid rgba(25, 159, 255, 1);
        border-radius: 4rpx;
        color: rgba(25, 159, 255, 1);
        font-size: 20rpx;
        font-weight: 600;
        line-height: 34rpx;
    }
    .cashback-text {
        color: #000000;
        font-size: 26rpx;
        font-weight: 400;
        line-height: 26rpx;
        flex: 1;
    }
    .cashback-btn {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;
        margin-right: 20rpx;
        &-text {
            color: #199fff;
            font-size: 24rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 600;
            line-height: 24px;
        }
    }
}
</style>
