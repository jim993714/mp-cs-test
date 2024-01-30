<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

const props = defineProps<{
    img?: string;
    color?: string;
    activityNo: string;
}>();
const goTo = () => {
    router.push('activityRules', {
        type: 'DISCOUNT_AREA',
        params: {
            activityNo: props.activityNo
        }
    });
};
</script>

<template>
    <view
        class="banner-warp"
        :style="{ background: color }"
    >
        <image
            class="banner-img"
            :src="props.img"
            mode="scaleToFill"
        />
        <view
            class="rule"
            @tap.prevent="goTo"
            >规则</view
        >
    </view>
</template>

<style lang="scss" scoped>
.banner-warp {
    position: relative;
    width: 750rpx;
    height: 240rpx;
}
.banner-img {
    width: 750rpx;
    height: 240rpx;
    box-sizing: border-box;
}
.rule {
    position: absolute;
    top: 20rpx;
    right: 0;
    z-index: 302;
    width: 84rpx;
    height: 48rpx;
    border-radius: 62rpx 0rpx 0rpx 62rpx;
    text-align: center;
    color: #ffffff;
    font-size: 24rpx;
    font-weight: 400;
    background: rgba(0, 0, 0, 0.4);
    line-height: 48rpx;
}
</style>
