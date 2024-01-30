<script setup lang="ts">
import { ref } from 'vue';

import { getHasNext } from '@/api/activity/super-subsidy';

const props = defineProps({
    timeOut: {
        type: Number,
        default: 0
    }
});
const hasNext = ref(0);
const init = ref(false);
const getNext = async () => {
    hasNext.value = (await getHasNext()).hasNext;

    let selectType = 2;
    switch (hasNext.value) {
        case 1:
            selectType = 2;
            break;
        case 0:
            selectType = 0;
            break;
        default:
            selectType = 1;
    }

    selectItem(selectType);
};
getNext();

const timeEnd = async () => {
    if (!init.value) {
        await getNext();
    }
};
const selectName = ref(1);
const selectItem = (type: number) => {
    selectName.value = type;
    emit('select', type);
};
const emit = defineEmits(['select']);
</script>

<template>
    <view
        v-if="hasNext"
        class="fix-box"
    >
        <view class="banner-tab">
            <view
                v-if="hasNext === 2 || hasNext === 3"
                class="banner-tab-item"
                :class="{ 'banner-tab-item-active': selectName === 1 }"
                @tap.prevent="selectItem(1)"
                >本周必买</view
            >
            <view
                v-if="hasNext == 3"
                class="banner-tab-line"
            ></view>
            <view
                v-if="hasNext === 1 || hasNext === 3"
                class="banner-tab-item"
                :class="{ 'banner-tab-item-active': selectName === 2 }"
                @tap.prevent="selectItem(2)"
                >下周预告</view
            >
        </view>
        <view
            v-if="props.timeOut && hasNext > 0"
            class="time-out"
        >
            <text class="time-out-label">
                {{ selectName === 1 ? '距本期结束：' : '距本期开始：' }}</text
            >
            <view class="time-out-num">
                <uni-countdown
                    color="#ffffff"
                    splitor-color="#ffffff"
                    :second="props.timeOut"
                    :show-colon="false"
                    @timeup="timeEnd"
                />
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.fix-box {
    display: flex;
    align-items: center;
    width: 750rpx;
    height: 150rpx;
    padding: 10rpx 0 30rpx;
    background: #ff000d;
    flex-direction: column;
    .banner-tab {
        z-index: 99;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 18rpx;
        .banner-tab-item {
            padding: 16rpx 24rpx;
            border-radius: 35rpx;
            color: rgba(255, 255, 255, 0.5);
            font-size: 28rpx;
            font-weight: 400;
            background: rgba(255, 255, 255, 0.25);
            line-height: 28rpx;
            &-active {
                color: #ffffff;
                font-weight: 500;
                background: #ff7b63;
            }
        }
        .banner-tab-line {
            width: 2rpx;
            height: 84rpx;
            margin: 0 60rpx;
            background: rgba(255, 255, 255, 0.4);
        }
    }
    .time-out {
        z-index: 99;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 690rpx;
        height: 60rpx;
        border-radius: 8rpx;
        background: rgba(255, 255, 255, 0.2);
        .time-out-label {
            text-align: center;
            color: #ffffff;
            font-size: 26rpx;
            font-weight: 500;
        }
        .time-out-num {
            height: 60rpx;
            line-height: 60rpx;
        }
    }
    .header-left {
        width: 80rpx;
        height: 88rpx;
        padding-left: 20rpx;
        line-height: 88rpx;
    }
}
</style>
