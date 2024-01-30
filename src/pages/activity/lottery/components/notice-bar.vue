<script setup lang="ts">
const props = defineProps<{
    list: string[];
}>();
</script>

<template>
    <swiper
        class="notice-swiper"
        :indicator-dots="false"
        :autoplay="true"
        :interval="3000"
        vertical
        circular
    >
        <swiper-item
            v-for="(item, index) in props.list"
            :key="index"
            class="swiper-item"
        >
            <text class="notice-text ellipsis">{{ item }}</text>
        </swiper-item>
    </swiper>
</template>

<style lang="scss" scoped>
.notice-swiper {
    width: 280rpx;
    height: 52rpx;
    border-radius: 26rpx;
    background: rgba(0, 0, 0, 0.6);

    .swiper-item {
        display: flex;
        align-items: center;
        padding: 0 20rpx;
        box-sizing: border-box;
        .notice-text {
            color: #ffffff;
            font-size: 20rpx;
            font-weight: 500;
            line-height: 20rpx;
        }
    }
}
</style>
