<script setup lang="ts">
import type { CollectShop } from '@/api/ucenter/types';

const props = defineProps<{
    info: CollectShop;
}>();
</script>

<template>
    <view class="shop-item">
        <image
            class="shop-logo"
            :src="props.info.shopLogo"
            mode="aspectFill"
        />
        <view class="shop-main">
            <view class="shop-title">
                <text class="shop-name">{{ props.info.shopName }}</text>
                <text
                    v-if="props.info.hasBuy"
                    class="has-buy"
                    >买过的店</text
                >
            </view>
            <view class="shop-info">
                <text class="shop-info-item">{{ props.info.collectCount }}人订阅</text>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.shop-item {
    display: flex;
    align-items: center;
    height: 150rpx;
    padding: 30rpx;
    background: #ffffff;
    box-sizing: border-box;
    gap: 20rpx;

    .shop-logo {
        width: 88rpx;
        height: 88rpx;
        border-radius: 50%;
        flex-shrink: 0;
    }
    .shop-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 24rpx;

        .shop-title {
            display: flex;
            gap: 20rpx;
            .shop-name {
                overflow: hidden;
                max-width: 308rpx;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: $uni-color-title;
                font-size: 28rpx;
                font-weight: 500;
                line-height: 28rpx;
            }

            .has-buy {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100rpx;
                height: 28rpx;
                border-radius: 18rpx;
                color: $zd-main-color;
                font-size: 20rpx;
                font-weight: 400;
                background: rgba($color: $zd-main-color, $alpha: 0.1);
                line-height: 20rpx;
            }
        }

        .shop-info {
            display: flex;
            color: $uni-color-paragraph;
            font-size: 24rpx;
            font-weight: 400;
            gap: 20rpx;
            line-height: 24rpx;
        }
    }
}
</style>
