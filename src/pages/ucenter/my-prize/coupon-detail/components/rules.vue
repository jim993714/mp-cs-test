<script setup lang="ts">
import type { RuleItem } from '@/api/ucenter/types';

import { PrizeType } from '../types';

const props = defineProps<{
    rules: string;
    type: PrizeType;
}>();

const packetRuleList = computed(() => {
    if (!props.rules) return [];
    return JSON.parse(props.rules).list as RuleItem[];
});
</script>

<template>
    <view class="rules">
        <view class="rules-title">使用规则</view>

        <view
            v-if="props.type === PrizeType.COUPON"
            class="rules-list"
        >
            <rich-text :nodes="props.rules" />
        </view>
        <view
            v-else
            class="rules-list"
        >
            <view
                v-for="(item, index) in packetRuleList"
                :key="index"
                class="rules-item"
            >
                {{ item.content }}
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.rules {
    padding: 28rpx 30rpx 30rpx;
    border-radius: 16rpx;
    background: #fff;
    box-sizing: border-box;

    &-title {
        margin-bottom: 30rpx;
        text-align: center;
        color: $uni-text-color;
        font-size: 32rpx;
        font-weight: 500;
        line-height: 32rpx;
    }

    &-list {
        display: flex;
        color: $uni-color-paragraph;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 40rpx;
        flex-direction: column;
        gap: 20rpx;
    }
}
</style>
