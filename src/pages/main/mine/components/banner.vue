<script lang="ts" setup>
import type { IBannerList } from '@/api/home/types';
import doAction from '@/utils/action/index';

const props = defineProps<{
    list: Array<IBannerList>;
}>();
</script>

<template>
    <swiper
        autoplay
        circular
        indicator-dots
        indicator-color="rgba(255, 255, 255, 0.5)"
        indicator-active-color="#fff"
        class="swiper"
    >
        <swiper-item
            v-for="(item, index) in props.list"
            :key="index"
            class="swiper-item"
            @tap="doAction(item.appAction)"
        >
            <image
                :src="item.imageUrl"
                mode="aspectFill"
                class="item-img"
            />
        </swiper-item>
    </swiper>
</template>

<style lang="scss" scoped>
.swiper {
    overflow: hidden;
    width: 710rpx;
    height: 160rpx;
    margin-bottom: 20rpx;
    border-radius: 16rpx;

    &-item {
        width: 710rpx;
        height: 160rpx;
    }
}

.item-img {
    width: 710rpx;
    height: 160rpx;
    border-radius: 16rpx;
}
</style>
