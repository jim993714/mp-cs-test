<script setup lang="ts">
import dayjs from 'dayjs';

import type { PrizeExchangeResult } from '@/api/ucenter/types';

const props = defineProps<{
    info?: PrizeExchangeResult;
}>();

const validTime = computed(() => {
    const { receiveStartTime, receiveEndTime } = props.info || {};

    return `${dayjs(receiveStartTime || 0).format('YYYY.MM.DD')} - ${dayjs(
        receiveEndTime || 0
    ).format('YYYY.MM.DD')}`;
});
</script>

<template>
    <view class="prize-info">
        <image
            class="cover"
            :src="props.info?.image"
        />
        <view class="info-main">
            <view class="title ellipsis2">
                {{ props.info?.title }}
            </view>
            <view class="date"> 领取有效期：{{ validTime }} </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.prize-info {
    display: flex;
    align-items: center;
    height: 232rpx;
    padding: 24rpx;
    border-radius: 12rpx;
    background: #ffffff;
    gap: 20rpx;

    .cover {
        width: 184rpx;
        height: 184rpx;
        border-radius: 8rpx;
        flex-shrink: 0;
    }

    .info-main {
        display: flex;
        justify-content: space-between;
        height: 184rpx;
        font-weight: 400;
        flex-direction: column;

        .title {
            width: 458rpx;
            color: $uni-text-color;
            font-size: 28rpx;
            line-height: 40rpx;
        }

        .date {
            color: $uni-color-paragraph;
            font-size: 24rpx;
            line-height: 28rpx;
        }
    }
}
</style>
