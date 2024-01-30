<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { SelectGoods } from '@/api/activity/pk-zone/types';
import { CDN_BASE_URL } from '@/base/constants';

const props = defineProps<{
    list: SelectGoods[];
    loadText: string;
}>();
</script>

<template>
    <view class="goods-list">
        <view
            v-for="item in props.list"
            :key="item.goodsNo"
            class="goods-item"
            @tap="router.push('goodsDetail', { goodsNo: item.goodsNo })"
        >
            <image
                class="goods-cover"
                :src="item.goodsCover"
                mode="aspectFill"
            />
            <view class="goods-main">
                <view class="goods-title ellipsis">
                    {{ item.goodsTitle }}
                </view>
                <view class="goods-price">
                    <text class="label">活动价</text>
                    <zd-price
                        :value="item.goodsPrice"
                        :font-size-large="44"
                        :font-size-small="36"
                        :font-size-unit="28"
                    />
                </view>

                <image
                    class="buy-btn"
                    :src="`${CDN_BASE_URL}/mp-cs/images/activity/pk-zone/buy-text.png`"
                    mode="aspectFill"
                />
            </view>
        </view>
        <view class="load-text">
            {{ props.loadText }}
        </view>
    </view>
</template>

<style lang="scss" scoped>
.goods-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;

    .goods-item {
        display: flex;
        align-items: center;
        height: 240rpx;
        border-radius: 20rpx;
        background: #ffffff;
        gap: 24rpx;

        .goods-cover {
            width: 240rpx;
            height: 240rpx;
            border-radius: 20rpx;
        }

        .goods-main {
            width: 430rpx;
            height: 240rpx;
            padding: 20rpx 0;
            box-sizing: border-box;

            .goods-title {
                color: #1d2023;
                font-size: 28rpx;
                font-weight: 500;
                line-height: 40rpx;
            }

            .goods-price {
                display: flex;
                align-items: flex-end;
                margin: 42rpx 0 20rpx;
                gap: 4rpx;

                .label {
                    color: #ff3119;
                    font-size: 20rpx;
                    font-weight: 400;
                    line-height: 20rpx;
                }
            }

            .buy-btn {
                width: 430rpx;
                height: 60rpx;
            }
        }
    }

    .load-text {
        height: 114rpx;
        margin-top: -20rpx;
        text-align: center;
        color: $uni-color-paragraph;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 114rpx;
    }
}
</style>
