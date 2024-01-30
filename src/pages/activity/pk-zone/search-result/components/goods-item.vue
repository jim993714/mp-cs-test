<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { SearchGoods } from '@/api/activity/pk-zone/types';

const props = defineProps<{
    goods: SearchGoods;
}>();

const { goods } = toRefs(props);
</script>

<template>
    <view
        class="goods-item"
        @tap="router.push('goodsDetail', { goodsNo: goods.goodsNo })"
    >
        <image
            class="goods-cover"
            :src="goods.goodsCover"
            mode="aspectFill"
        />
        <view class="goods-title ellipsis2">
            {{ goods.goodsTitle }}
        </view>

        <view class="goods-price">
            <text class="label">活动价</text>
            <zd-price
                :value="goods.goodsPrice"
                :font-size-large="40"
                :font-size-small="28"
                :font-size-unit="20"
            />
        </view>
    </view>
</template>

<style lang="scss" scoped>
.goods-item {
    display: flex;
    width: 348rpx;
    padding-bottom: 20rpx;
    border-radius: 12rpx;
    background-color: #fff;
    flex-direction: column;
    gap: 20rpx;

    .goods-cover {
        width: 348rpx;
        height: 348rpx;
        border-radius: 12rpx 12rpx 0rpx 0rpx;
    }

    .goods-title {
        padding: 0 20rpx;
        color: $uni-text-color;
        font-size: 28rpx;
        font-weight: 500;
        line-height: 40rpx;
    }

    .goods-price {
        display: flex;
        align-items: flex-end;
        gap: 8rpx;
        padding: 0 20rpx;

        .label {
            color: $zd-color-red;
            font-size: 20rpx;
            font-weight: 400;
            line-height: 20rpx;
        }
    }
}
</style>
