<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { CDN_BASE_URL } from '@/base/constants';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<template>
    <view class="empty">
        <image
            class="image"
            :src="`${CDN_BASE_URL}/mp-cs/images/shop-cart/empty.png`"
            mode="aspectFit"
        />
        <view class="desc">购物车空空的～</view>
        <zd-button
            v-if="userStore.isLogin"
            type="primary"
            :button-style="{ width: '360rpx' }"
            @tap="router.switchTab('home')"
        >
            去逛逛
        </zd-button>
        <zd-button
            v-else
            type="primary"
            :button-style="{ width: '360rpx' }"
            @tap="router.push('login')"
        >
            去登录
        </zd-button>
    </view>
</template>

<style lang="scss" scoped>
.empty {
    display: flex;
    flex-direction: column;
    align-items: center;

    .image {
        width: 200rpx;
        height: 168rpx;
        margin-top: 222rpx;
    }

    .desc {
        margin: 40rpx 0 48rpx;
        color: $uni-color-paragraph;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 28rpx;
    }
}
</style>
