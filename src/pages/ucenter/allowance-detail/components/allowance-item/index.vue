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
    shopTitle: string;
}>();

const icon = computed(() => {
    if (props.type == UsedStatus.Get) {
        return 'zdmp-hongbao';
    } else {
        return 'zdmp-dianpu';
    }
});

const time = computed(() => {
    return dayjs(props.time).format('YYYY-MM-DD HH:mm:ss');
});

const money = computed(() => {
    return `${props.type === UsedStatus.Use ? '-' : '+'}${props.money}`;
});

const shopName = computed(() => {
    return props.type === UsedStatus.Get ? '领取津贴' : props.shopTitle;
});

function gotoOrder() {
    router.push('orderDetail', {
        orderNo: props.orderNo
    });
}
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
                    <text class="allowance-item-inner-header-left-shop">{{ shopName }}</text>
                </view>
                <text>{{ money }}</text>
            </view>
            <view class="allowance-item-inner-content">
                <text class="allowance-item-inner-content-time">{{ time }}</text>
                <text class="allowance-item-inner-content-status">{{
                    useStatusLabel[props.type]
                }}</text>
            </view>
            <view
                v-if="props.type !== UsedStatus.Get"
                class="allowance-item-inner-footer"
                @tap="gotoOrder"
            >
                查看详情
                <zd-icon
                    class="allowance-item-inner-footer-back"
                    :size="24"
                    type="zdmp-fanhui"
                    color="#8A9399"
                />
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

                &-shop {
                    font-size: 28rpx;
                    font-weight: 500;
                }
            }
        }

        &-content {
            display: flex;
            justify-content: space-between;
            margin: 20rpx 0 0 68rpx;

            &-time {
                color: $uni-color-paragraph;
                font-size: 24rpx;
                font-weight: 400;
                line-height: 24rpx;
            }

            &-status {
                color: #576066;
                font-size: 24rpx;
                font-weight: 400;
                line-height: 24rpx;
            }
        }

        &-footer {
            display: flex;
            align-items: center;
            gap: 8rpx;
            margin: 20rpx 0 0 68rpx;
            color: $uni-text-color-placeholder;
            font-size: 24rpx;
            font-weight: 400;
            line-height: 24rpx;
            &-back {
                transform: rotate(180deg);
            }
        }
    }
}
</style>
