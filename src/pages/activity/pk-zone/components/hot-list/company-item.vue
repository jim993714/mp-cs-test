<script setup lang="ts">
import type { HireGoodsUnit } from '@/api/activity/pk-zone/types';

import GoodsItem from './goods-item.vue';

const props = defineProps<{
    info: HireGoodsUnit;
}>();

const { info } = toRefs(props);
</script>

<template>
    <view class="company-item">
        <view class="header">
            <image
                class="logo"
                :src="info.companyLogo"
                mode="aspectFill"
            />
            <view class="name ellipsis">{{ info.companyName }}</view>
        </view>

        <scroll-view
            :scroll-x="true"
            :show-scrollbar="false"
            scroll-with-animation
            class="scroll-view"
        >
            <view class="goods-list">
                <GoodsItem
                    v-for="(item, index) in info.goods"
                    :key="item.goodsNo"
                    :info="item"
                    :is-last="index === info.goods.length - 1"
                    style="display: inline-block"
                />
            </view>
        </scroll-view>
    </view>
</template>

<style lang="scss" scoped>
.company-item {
    display: flex;
    width: 710rpx;
    height: 462rpx;
    padding: 24rpx 0;
    border-radius: 20rpx;
    background: #ffffff;
    box-sizing: border-box;
    flex-direction: column;
    gap: 24rpx;

    .header {
        display: flex;
        align-items: center;
        height: 64rpx;
        gap: 20rpx;
        padding: 0 24rpx;

        .logo {
            width: 64rpx;
            height: 64rpx;
            border-radius: 32rpx;
        }

        .name {
            color: $uni-text-color;
            font-size: 32rpx;
            font-weight: 500;
            line-height: 32rpx;
        }
    }

    .scroll-view {
        width: 710rpx;
        white-space: nowrap;
    }

    .goods-list {
        display: flex;
        gap: 18rpx;
        margin-left: 24rpx;
    }
}
</style>
