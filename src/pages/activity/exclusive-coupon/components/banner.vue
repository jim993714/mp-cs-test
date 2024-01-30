<script setup lang="ts">
import type { IShareInfo } from '@/api/activity/exclusive-coupon/types';

import { getTime, getTimeLabel } from '../constants';

const props = defineProps<{
    shareInfo: IShareInfo;
}>();

const newTime = ref();
const timer = ref();
const timerArray = ref<Array<string>>(['0', '0', '0', '0', '0', '0']);

const resetTime = (time: number) => {
    newTime.value = time;
    newTime.value--;
};

watch(
    () => newTime.value,
    (value: number) => {
        clearInterval(timer.value);
        if (!value || value < 0) {
            emit('timeEnd');
            timerArray.value = ['0', '0', '0', '0', '0', '0'];
            return;
        }
        timer.value = setInterval(() => {
            const { time, timeStr } = getTime(value);
            newTime.value = time;
            timerArray.value = timeStr.split('');
        }, 1000);
    }
);

const emit = defineEmits(['timeEnd']);

defineExpose({
    resetTime
});
</script>

<template>
    <view class="banner-warp">
        <view
            v-if="props.shareInfo.isSelf === 1"
            class="tip-box"
        >
            你不能领取自己发放的优惠哦～快让小伙伴领取吧</view
        >
        <view
            v-else-if="newTime < 0"
            class="tip-box"
        >
            很抱歉，领取时间已过期不可再领取哦~
        </view>
        <view
            v-else
            class="tip-box-set"
        ></view>

        <view class="time-box">
            <image
                class="time-info-img"
                src="https://cdn.zsdx.cn/mp-cs/images/activity/exclusive-coupon/time-info.png"
                mode="aspectFill"
            />
            <view class="time-head-title">优惠券领取时间</view>
            <view v-if="newTime > 0">
                <view class="time-out">
                    <view
                        v-for="(item, index) in timerArray"
                        :key="index"
                        class="time-item-warp"
                    >
                        <view class="time-item">
                            <image
                                class="time-item-img"
                                src="https://cdn.zsdx.cn/mp-cs/images/activity/exclusive-coupon/num-icon.png"
                                mode="aspectFill"
                            />
                            <view class="time-item-text bebas-neue-regular">{{ item }}</view>
                        </view>
                        <view
                            v-if="[1, 3, 5].includes(index)"
                            class="time-item-label"
                            >{{ getTimeLabel(index) }}</view
                        >
                    </view>
                </view>
                <view class="coupon-receive-tip">优惠券每日限领一张</view>
            </view>

            <zd-empty
                v-else
                image="https://cdn.zsdx.cn/mp-cs/images/activity/exclusive-coupon/emty.png"
                :image-width="340"
                :image-height="190"
                :top="40"
                class="empty-warp"
            >
                <template #description>
                    <text class="empty-text">已超时</text>
                </template>
            </zd-empty>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.banner-warp {
    position: relative;
    display: flex;
    align-items: center;
    width: 750rpx;
    flex-direction: column;
}

.tip-box {
    position: relative;
    width: 650rpx;
    height: 72rpx;
    margin-top: 68rpx;
    border-radius: 40rpx;
    text-align: center;
    color: #0069c3;
    font-size: 26rpx;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.4);
    box-shadow: inset 0rpx 0rpx 34rpx 0rpx rgba(255, 255, 255, 0.5);
    line-height: 72rpx;
}
.tip-box-set {
    width: 650rpx;
    height: 72rpx;
}

.time-box {
    position: relative;
    display: flex;
    align-items: center;
    width: 650rpx;
    height: 398rpx;
    margin-top: 32rpx;
    flex-direction: column;
    .time-info-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 650rpx;
        height: 398rpx;
    }
    .time-head-title {
        position: relative;
        margin-top: 62rpx;
        text-align: center;
        color: #ad5200;
        font-size: 34rpx;
        font-weight: 600;
        line-height: 34rpx;
    }
    .time-out {
        display: flex;
        justify-content: center;
        margin-top: 98rpx;
        .time-item-warp {
            display: flex;
            align-items: flex-end;
        }
        .time-item {
            position: relative;
            display: flex;
            justify-content: center;
            width: 56rpx;
            height: 72rpx;
            margin-right: 8rpx;
        }
        .time-item-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 56rpx;
            height: 72rpx;
        }
        .time-item-text {
            position: relative;
            text-align: center;
            color: #ffffff;
            font-size: 76rpx;
            line-height: 80rpx;
        }
        .time-item-label {
            position: relative;
            margin-right: 8rpx;
            color: #f0465d;
            font-size: 28rpx;
            font-weight: 600;
            line-height: 28rpx;
        }
    }
    .coupon-receive-tip {
        position: relative;
        margin-top: 48rpx;
        text-align: center;
        color: #f0465d;
        font-size: 26rpx;
        font-weight: 400;
        line-height: 26rpx;
    }
    .time-empty {
        position: relative;
    }
    .empty-warp {
        position: relative;
        .empty-text {
            margin-top: 12rpx;
            color: #fcaca9;
            font-size: 28rpx;
            font-weight: 400;
            line-height: 28rpx;
        }
    }
}
</style>
