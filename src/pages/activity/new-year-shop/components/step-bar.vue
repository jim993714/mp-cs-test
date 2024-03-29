<script setup lang="ts">
import type { Level } from '@/api/activity/new-year-shop/types';

const props = defineProps<{
    step: Level[];
    saleNum: number;
}>();
const barWidth = 430;
const unitWidth = barWidth / 4;

const steps = computed(() => {
    return [
        {
            num: 1,
            discount: 0,
            money: 0
        }
    ].concat(props.step);
});
const currStep = computed(() => {
    return steps.value.reduce((result: number, item: Level, index: number) => {
        if (item.num <= props.saleNum) {
            return index;
        }
        return result;
    }, 0);
});
const stepWidth = computed(() => {
    if (steps.value.length <= 4) {
        return Math.floor((barWidth - unitWidth) / (steps.value.length - 1));
    }
    return unitWidth;
});
const totalWidth = computed(() => {
    return stepWidth.value * (steps.value.length - 1);
});
const currLeft = computed(() => {
    if (currStep.value >= steps.value.length - 1) {
        return totalWidth.value;
    } else if (props.saleNum <= 0) {
        return 0;
    }
    let total = steps.value[+currStep.value + 1].num - steps.value[currStep.value].num;
    let distNum = props.saleNum - steps.value[currStep.value].num;

    return stepWidth.value * (currStep.value + distNum / total);
});
const cashbackMoney = (item: Level) => {
    if (item.money === 0) {
        return '原价';
    }
    return `返${item.money}元`;
};
</script>

<template>
    <scroll-view
        class="step-bar"
        :scroll-x="true"
    >
        <view class="step-bar-inner">
            <view
                v-for="(item, index) in steps"
                :key="index"
                class="step-title"
                :style="{ width: unitWidth + 'rpx', left: stepWidth * index + 'rpx' }"
            >
                <view
                    class="step-title-text ellipsis"
                    :class="{ 'step-title-text-active': index == currStep }"
                    >{{ cashbackMoney(item) }}</view
                >
                <view
                    class="step-title-tail"
                    :class="{ 'step-title-tail-active': index == currStep }"
                ></view>
                <view class="step-title-number ellipsis"
                    >{{ index === 0 ? '团购' : '' }}满{{ item.num }}件</view
                >
            </view>
            <view
                class="step-bar-line"
                :style="{ width: totalWidth + 'rpx', left: unitWidth / 2 + 'rpx' }"
            >
                <view
                    class="step-bar-line-inner"
                    :style="{ width: currLeft + 'rpx' }"
                ></view>
            </view>
            <image
                class="step-bar-point"
                src="https://cdn.zsdx.cn/mp-cs/images/shop/cashback/cashback-pointer.png"
                :style="{ left: currLeft + (unitWidth / 2 - 12) + 'rpx' }"
                mode="aspectFill"
            ></image>
        </view>
    </scroll-view>
</template>

<style scoped lang="scss">
.step-bar {
    width: 430rpx;
    height: 88rpx;
}
.step-bar-inner {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
}
.step-bar-line {
    position: absolute;
    top: 44rpx;
    left: 0;
    height: 12rpx;
    border-radius: 8rpx;
    background: #ffe8e6;
    &-inner {
        height: 12rpx;
        border-radius: 8rpx;
        background: #ff4734;
    }
}
.step-bar-point {
    position: absolute;
    top: 38rpx;
    width: 24rpx;
    height: 24rpx;
}
.step-title {
    position: absolute;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 88rpx;
    flex-direction: column;
    flex-shrink: 0;
    &-text {
        position: relative;
        max-width: 100%;
        padding: 0 4rpx;
        color: #a03c01;
        font-size: 20rpx;
        font-weight: 600;
        line-height: 28rpx;
        flex-direction: column;
        &-active {
            border-radius: 4rpx;
            color: #fff;
            background: #ff4734;
        }
    }
    &-tail {
        width: 8rpx;
        height: 8rpx;
        margin-top: -4rpx;
        margin-bottom: 32rpx;
        background: transparent;
        transform: rotate(45deg);
        &-active {
            background: #ff4734;
        }
    }
    &-number {
        max-width: 100%;
        white-space: nowrap;
        color: #8a9399;
        font-size: 20rpx;
        font-weight: 400;
        line-height: 22rpx;
    }
}
</style>
