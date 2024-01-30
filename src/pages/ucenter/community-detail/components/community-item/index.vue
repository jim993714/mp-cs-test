<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
import dayjs from 'dayjs';

import { UsedStatus } from '@/api/redpacket/types';

import { useStatusLabel } from './constants';

const props = defineProps<{
    time: number;
    type: UsedStatus;
    money: number;
    orderNo: string;
}>();

const icon = computed(() => {
    switch (props.type) {
        case UsedStatus.Get:
            return 'zdmp-hongbao';
        case UsedStatus.Use:
            return 'zdmp-xinxi';
        default:
            return 'zdmp-jine';
    }
});

function gotoOrder() {
    router.push('orderDetail', {
        orderNo: props.orderNo
    });
}

const time = computed(() => {
    return dayjs(props.time).format('YYYY-MM-DD HH:mm:ss');
});

const money = computed(() => {
    return props.money;
});
</script>

<script lang="ts">
export default {
    options: {
        styleIsolation: 'shared'
    }
};
</script>

<template>
    <view class="allowance-item">
        <view class="allowance-item-inner">
            <view class="allowance-item-inner-header">
                <view class="allowance-item-inner-header-left">
                    <zd-icon
                        :size="28"
                        :type="icon"
                    />
                    <text class="allowance-item-inner-header-left-title">{{
                        useStatusLabel[props.type]
                    }}</text>
                </view>
                <text>{{ money }}</text>
            </view>
            <view class="allowance-item-inner-content">
                <text
                    v-if="props.orderNo"
                    class="allowance-item-inner-content-order"
                >
                    订单编号：{{ props.orderNo }}
                </text>
                <view class="allowance-item-inner-content-footer">
                    <view class="allowance-item-inner-content-footer-time">
                        {{ time }}
                    </view>
                    <view
                        v-if="props.type !== UsedStatus.Get"
                        class="allowance-item-inner-content-footer-btn"
                        @tap="gotoOrder"
                    >
                        查看详情
                        <zd-icon
                            class="allowance-item-inner-content-footer-btn-back"
                            :size="24"
                            type="zdmp-fanhui"
                            color="#8A9399"
                        />
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<style scoped lang="scss">
.allowance-item {
    width: 100%;
    padding: 0 16rpx;
    box-sizing: border-box;
    border-bottom: 3rpx dashed #edf0f2;

    &-inner {
        padding: 40rpx 34rpx;
        box-sizing: border-box;

        &-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: $uni-text-color;
            font-size: 32rpx;
            font-weight: 600;
            line-height: 32rpx;

            &-left {
                display: flex;
                align-items: center;
                gap: 10rpx;

                &-title {
                    font-size: 28rpx;
                    font-weight: 500;
                }
            }
        }

        &-content {
            display: flex;
            flex-direction: column;
            margin: 20rpx 0 0 40rpx;
            gap: 20rpx;

            &-order {
                color: $uni-color-paragraph;
                font-size: 24rpx;
                font-weight: 400;
                line-height: 24rpx;
            }

            &-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;

                &-time {
                    color: $uni-color-paragraph;
                    font-size: 24rpx;
                    font-weight: 400;
                    line-height: 24rpx;
                }

                &-btn {
                    display: flex;
                    align-items: center;
                    gap: 8rpx;
                    color: $uni-text-color-placeholder;
                    font-size: 24rpx;
                    font-weight: 400;
                    line-height: 24rpx;
                    &-back {
                        transform: rotate(180deg);
                    }
                }
            }

            &-status {
                color: #576066;
                font-size: 24rpx;
                font-weight: 400;
                line-height: 24rpx;
            }
        }
    }
}
</style>
