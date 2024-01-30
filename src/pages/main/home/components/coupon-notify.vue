<script setup lang="ts">
import dayjs from 'dayjs';

import type { Coupon } from '@/api/ucenter/types';

const props = defineProps<{
    couponNotifyInfo?: Coupon;
    name?: String;
}>();
const { safeArea, screenHeight } = uni.getSystemInfoSync();
const bottomAreaHeight = screenHeight - (safeArea?.bottom || 0);

const pageHeight = uni.getWindowInfo().windowHeight + 50 + bottomAreaHeight || 0;
const fnStop = (e: any) => {
    e && e.stopPropagation();
};

function formatDate(date: number) {
    return dayjs(date).format('YYYY.MM.DD');
}

const close = () => {
    emit('close');
};
const emit = defineEmits(['close']);
</script>

<template>
    <view
        class="coupon-notify"
        :style="{ height: pageHeight + 'px' }"
        @touchmove.stop="fnStop"
    >
        <view class="notify-info">
            <image
                class="notify-bg"
                src="https://cdn.zsdx.cn/mp-cs/images/home/coupon-tip.png"
                mode="aspectFill"
            />
            <view class="notify-title">{{ name }}送你一张优惠券</view>
            <view class="coupon-price">
                <view class="bebas-neue-regular coupon-price-text">{{
                    props?.couponNotifyInfo?.discountNum || 0
                }}</view>
                <view class="price-label">元</view>
            </view>
            <view class="door-text">满足{{ props?.couponNotifyInfo?.discountLimit }}可用</view>
            <view class="time-text"
                >领取有效期：{{ formatDate(props?.couponNotifyInfo?.useStartTime || 0) }}-{{
                    formatDate(props?.couponNotifyInfo?.useEndTime || 0)
                }}</view
            >
            <view
                class="btn"
                @tap.prevent="close"
            ></view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.coupon-notify {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 750rpx;
    background: rgba(0, 0, 0, 0.5);
}
.notify-info {
    position: relative;
    display: flex;
    align-items: center;
    width: 630rpx;
    height: 754rpx;
    flex-direction: column;
    .notify-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 630rpx;
        height: 754rpx;
    }
    .notify-title {
        position: relative;
        margin-top: 254rpx;
        color: #de6200;
        font-size: 28rpx;
        font-weight: 500;
        line-height: 40rpx;
    }

    .coupon-price {
        position: relative;
        display: flex;
        align-items: flex-end;
        margin-top: 30rpx;
        .coupon-price-text {
            color: #ff4734;
            font-size: 80rpx;
            line-height: 80rpx;
        }
        .price-label {
            margin-left: 12rpx;
            color: #ff4734;
            font-size: 28rpx;
            font-weight: 400;
            line-height: 60rpx;
        }
    }
    .door-text {
        position: relative;
        margin-top: 16rpx;
        color: #ff4734;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 24rpx;
    }
    .time-text {
        position: relative;
        margin-top: 44rpx;
        color: #ff4734;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 34rpx;
    }
    .btn {
        position: relative;
        width: 400rpx;
        height: 80rpx;
        margin-top: 54rpx;
    }
}
</style>
