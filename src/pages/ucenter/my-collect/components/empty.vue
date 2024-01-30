<script setup lang="ts">
import { CDN_BASE_URL } from '@/base/constants';
</script>

<template>
    <zd-empty
        :image-width="450"
        :image-height="250"
        :image="`${CDN_BASE_URL}/mp-cs/images/ucenter/collect/empty.png`"
    >
        <template #description>
            <view class="desc"> 暂无收藏订阅哦~ </view>
        </template>
    </zd-empty>
</template>

<style lang="scss" scoped>
.desc {
    text-align: center;
    color: $uni-text-color-placeholder;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 24rpx;
}
</style>
