<script setup lang="ts">
import doAction from '@/utils/action/index';

import type { IBanner } from '../type';

const props = defineProps<{
    bannerList: IBanner[];
}>();

const fnGoBannerDetail = (action: any) => {
    doAction(action);
};
</script>

<template>
    <view class="banner-list">
        <swiper
            class="banner-swiper-item"
            :circular="false"
            indicator-dots
            indicator-color="rgba(255,255,255,0.6)"
            indicator-active-color="rgba(255,255,255,1)"
            :autoplay="false"
        >
            <swiper-item
                v-for="(banner, index) in props.bannerList"
                :key="index"
            >
                <image
                    class="banner-swiper-item-img"
                    mode="aspectFill"
                    :src="banner.imageUrl"
                    @tap="fnGoBannerDetail(banner.appAction)"
                ></image>
            </swiper-item>
        </swiper>
    </view>
</template>

<style lang="scss" scoped>
.banner-list {
    position: relative;
    display: flex;
    align-items: center;
    width: 750rpx;
    height: 280rpx;
}
.banner-swiper-item {
    width: 750rpx;
    height: 240rpx;
}

.banner-swiper-item-img {
    width: 710rpx;
    height: 240rpx;
    margin: 0 20rpx;
    border-radius: 20rpx;
}
</style>
