<script setup lang="ts">
import type { GoodsItem } from '@/api/activity/one-cent-purchase/types';

defineProps<{
    /** 详情 */
    detail: GoodsItem;
}>();
</script>

<template>
    <view class="card-wrapper">
        <view class="cover">
            <image
                :src="detail.goodsImage"
                mode="scaleToFill"
            />
        </view>
        <view class="title ellipsis"> {{ detail.goodsTitle }} </view>
        <zd-price
            :value="(detail.goodsPrice ?? 0) * 1"
            :font-size-large="40"
            :font-size-small="24"
            color="rgba(255, 255, 255, 1)"
        ></zd-price>
    </view>
</template>

<style scoped lang="scss">
.card-wrapper {
    display: flex;
    flex-direction: column;
    width: 226rpx;
    .cover {
        overflow: hidden;
        width: 226rpx;
        height: 226rpx;
        border-radius: 16rpx;
        background-color: rgba($color: #fff, $alpha: 1);
        image {
            width: 100%;
            height: 100%;
        }
    }
    .title {
        margin-top: 16rpx;
        color: #fff;
        font-size: 24rpx;
    }
}
</style>
