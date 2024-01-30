<script setup lang="ts">
import type { ShopCartExpired } from '@/api/shop-cart/types';
import { CDN_BASE_URL } from '@/base/constants';

import ProductSku from './product-sku.vue';

const props = defineProps<{
    goods: ShopCartExpired;
}>();
const emit = defineEmits(['delete']);

const { goods } = toRefs(props);
</script>

<template>
    <zd-swipe-action
        v-for="product in goods.shopCartItems"
        :key="product.productNo"
        :actions="['delete']"
        @click="emit('delete', product)"
    >
        <view class="product-item">
            <view class="goods-cover">
                <image
                    class="goods-cover-image"
                    :src="product.productImage"
                    mode="aspectFill"
                />
                <view class="mask">
                    <image
                        class="mask-img"
                        :src="`${CDN_BASE_URL}/mp-cs/images/shop-cart/expire-bg.png`"
                        mode="aspectFit"
                    />
                    <view class="mask-text">失效了</view>
                </view>
            </view>
            <view class="goods-main">
                <view class="goods-title">
                    {{ goods.goodsTitle }}
                </view>
                <view class="goods-sku"> </view>
                <view class="goods-price">
                    <product-sku :sku-list="product.shopCartGoodsSpecs" />
                    <zd-price
                        :value="product.goodsShowPrice"
                        color="#8A9399"
                        :font-size-large="40"
                        :font-size-small="24"
                        :font-size-unit="20"
                    />
                </view>
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
        position: relative;
        width: 180rpx;
        height: 180rpx;
        &-image {
            width: 180rpx;
            height: 180rpx;
            border-radius: 8rpx;
        }

        .mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 180rpx;
            height: 180rpx;
            border-radius: 8rpx;
            background-color: rgba(255, 255, 255, 0.5);

            .mask-img {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 88rpx;
                height: 88rpx;
                transform: translate(-50%, -50%);
            }
            &-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: flex;
                justify-content: center;
                align-items: center;
                color: #ffffff;
                font-size: 20rpx;
                font-weight: 400;
                line-height: 24rpx;
            }
        }
    }

    .goods-main {
        height: 180rpx;
        flex: 1;
        .goods-title {
            overflow: hidden;
            width: 418rpx;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: $uni-color-paragraph;
            font-size: 28rpx;
            font-weight: 400;
            line-height: 36rpx;
        }

        .goods-price {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 100rpx;
        }
    }
}
</style>
