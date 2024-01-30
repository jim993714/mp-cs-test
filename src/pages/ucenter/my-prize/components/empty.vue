<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { CDN_BASE_URL } from '@/base/constants';

const props = defineProps<{
    showInvalid: boolean;
}>();
</script>

<template>
    <zd-empty
        :image-width="450"
        :image-height="250"
        :image="`${CDN_BASE_URL}/mp-cs/images/ucenter/collect/empty.png`"
    >
        <template #description>
            <view class="desc"> 暂无奖品哦~ </view>
        </template>
    </zd-empty>
    <view
        v-if="props.showInvalid"
        class="footer"
        @tap="router.push('invalidPrize')"
    >
        查看失效奖品
    </view>
</template>

<style lang="scss" scoped>
.desc {
    text-align: center;
    color: $uni-text-color-placeholder;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 24rpx;
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
