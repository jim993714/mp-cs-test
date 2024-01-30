<script setup lang="ts">
const props = defineProps<{
    ruleList: string[];
}>();
</script>

<template>
    <view class="rules">
        <view class="rules-title">
            <zd-icon
                :size="32"
                type="zdmp-tishi"
                class="icon"
            />
            <view class="title">领取规则</view>
        </view>
        <view class="rules-content">
            <view
                v-for="(item, index) in props.ruleList"
                :key="index"
            >
                {{ item }}
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.rules {
    height: 256rpx;
    padding: 30rpx 24rpx;
    border-radius: 12rpx;
    background: #ffffff;
    box-sizing: border-box;

    .rules-title {
        display: flex;
        align-items: center;
        gap: 20rpx;

        .title {
            color: $uni-text-color;
            font-size: 28rpx;
            font-weight: 500;
            line-height: 32rpx;
        }

        .icon {
            color: $zd-main-color;
        }
    }

    .rules-content {
        width: 606rpx;
        margin-top: 20rpx;
        margin-left: 52rpx;
        color: #576066;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 36rpx;
    }
}
</style>
