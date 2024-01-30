<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { CDN_BASE_URL } from '@/base/constants';
</script>

<template>
    <zd-empty
        :image-width="450"
        :image-height="250"
        :image="`${CDN_BASE_URL}/mp-cs/images/ucenter/collect/empty.png`"
    >
        <template #description>
            <view class="desc"> 没有搜索到符合条件的商品，换个关键词搜搜看~ </view>
            <view
                class="btn"
                @tap="router.back()"
            >
                返回专区
            </view>
        </template>
    </zd-empty>
</template>

<style lang="scss" scoped>
.desc {
    width: 378rpx;
    text-align: center;
    color: $uni-text-color-placeholder;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 24rpx;
    line-height: 44rpx;
}

.btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 360rpx;
    height: 80rpx;
    margin-top: 40rpx;
    border-radius: 40rpx;
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 500;
    background: $zd-main-color;
    line-height: 28rpx;
}

.footer {
    position: absolute;
    bottom: 68rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 690rpx;
    height: 114rpx;
    color: $zd-main-color;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 24rpx;
}
</style>
