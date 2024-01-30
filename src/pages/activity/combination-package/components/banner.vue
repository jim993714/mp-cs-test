<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { IStyle } from '@/api/activity/combination-package/types';

const props = defineProps<{
    showHead: boolean;
    statusBarHeight: number;
    styleConfig: IStyle;
}>();
const showHomeBtn = ref(false);

onMounted(() => {
    const pages = getCurrentPages();
    showHomeBtn.value = pages.length === 1;
});
const fnGoBack = () => {
    router.back();
};
const fnGoIndex = () => {
    router.switchTab('home');
};
</script>

<template>
    <view class="banner-warp">
        <image
            class="banner-img"
            :src="styleConfig.headImage"
            mode="scaleToFill"
        />
        <text
            v-if="showHomeBtn"
            class="zdfont zdmp-huidaoshouye icon-back"
            :style="{ top: props.statusBarHeight + 'px' }"
            @click="fnGoIndex()"
        ></text>
        <text
            v-else
            class="zdfont zdmp-fanhui icon-back"
            :style="{ top: props.statusBarHeight + 'px' }"
            @click="fnGoBack()"
        ></text>
    </view>
</template>

<style lang="scss" scoped>
.banner-warp {
    position: relative;
    width: 750rpx;
    height: 444rpx;
    .banner-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 750rpx;
        height: 444rpx;
    }
    .icon-back {
        position: fixed;
        left: 0rpx;
        width: 88rpx;
        height: 88rpx;
        text-align: center;
        color: #ffffff;
        font-size: 32rpx;
        font-weight: bold;
        line-height: 88rpx;
        flex-direction: row;
    }
}
</style>
