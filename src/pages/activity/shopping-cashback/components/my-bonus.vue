<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { PoolInfo } from '@/api/activity/shopping-cashback/types';
import { CDN_BASE_URL } from '@/base/constants';

const props = defineProps<{
    info?: PoolInfo;
}>();

const { info } = toRefs(props);

function showTips() {
    uni.showModal({
        title: '已完结订单金额',
        content: '确认收货并售后时效结束',
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#20A0FF'
    });
}
function goAuth() {
    router.push('studentAuth');
}
</script>

<template>
    <view class="my-bonus">
        <view class="title"> 我的奖金 </view>
        <view class="card">
            <view class="card-user">
                <image
                    class="user-avatar"
                    :src="info?.headImage"
                    mode="aspectFill"
                />
                <view class="user-info">
                    <view class="user-name ellipsis">{{ info?.nikeName }}</view>
                    <view
                        v-if="info?.isOpenReward"
                        class="user-rank"
                        >排名：{{ info?.rank || '--' }}</view
                    >
                    <view
                        v-else
                        class="user-rank"
                        >完成学生认证后才可参与瓜分奖励</view
                    >
                </view>
            </view>
            <view
                v-if="info?.isOpenReward"
                class="card-money"
            >
                <view class="money-value">{{
                    info?.rewardDivide ? `${info?.rewardDivide}元` : '--'
                }}</view>
                <view class="money-label">瓜分金额</view>
            </view>
            <view
                v-else
                class="card-btn"
                @tap.prevent="goAuth"
                >去认证</view
            >
            <image
                class="card-arrow"
                :src="`${CDN_BASE_URL}/mp-cs/images/activity/shopping-cashback/card-arrow.png`"
                mode="aspectFill"
            />
        </view>
        <view class="complete-money">
            <image
                class="complete-icon"
                :src="`${CDN_BASE_URL}/mp-cs/images/activity/shopping-cashback/complete-icon.png`"
                mode="aspectFill"
            />
            <view>已完结订单金额</view>
            <zd-icon
                class="tips-icon"
                type="zdmp-jieshi"
                :size="24"
                @tap="showTips"
            />
            <view class="value">
                {{ info?.completedOrderAmount ? `${info.completedOrderAmount}元` : '--' }}
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.my-bonus {
    .title {
        color: $uni-text-color;
        font-size: 32rpx;
        font-weight: 600;
        line-height: 44rpx;
    }

    .card {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 702rpx;
        height: 140rpx;
        margin-top: 24rpx;
        padding: 0 68rpx 0 40rpx;
        border-radius: 20rpx;
        background: #ffe6d4;
        box-sizing: border-box;

        &-user {
            display: flex;
            align-items: center;
            gap: 20rpx;
            width: 100%;
            height: 100%;

            .user-avatar {
                width: 72rpx;
                height: 72rpx;
                border-radius: 50%;
            }

            .user-info {
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 12rpx;

                .user-name {
                    max-width: 320rpx;
                    color: $uni-text-color;
                    font-size: 28rpx;
                    font-weight: 500;
                    line-height: 40rpx;
                }

                .user-rank {
                    color: $uni-color-paragraph;
                    font-size: 24rpx;
                    font-weight: 400;
                    line-height: 24rpx;
                }
            }
        }

        &-money {
            position: relative;
            z-index: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 16rpx;
            flex-shrink: 0;

            .money-value {
                color: #583124;
                font-size: 36rpx;
                font-weight: 600;
                line-height: 36rpx;
            }

            .money-label {
                color: $uni-color-paragraph;
                font-size: 24rpx;
                font-weight: 400;
                line-height: 24rpx;
            }
        }
        .card-btn {
            position: absolute;
            top: 50%;
            right: 30rpx;
            z-index: 99;
            width: 124rpx;
            height: 52rpx;
            border-radius: 26rpx;
            text-align: center;
            color: #ffffff;
            font-size: 24rpx;
            font-weight: 500;
            background: #ff9e59;
            line-height: 52rpx;
            transform: translateY(-50%);
        }

        .card-arrow {
            position: absolute;
            top: 0;
            right: 0;
            width: 138rpx;
            height: 98rpx;
        }
    }

    .complete-money {
        display: flex;
        align-items: center;
        height: 94rpx;
        color: #583124;
        font-size: 24rpx;
        font-weight: 500;
        line-height: 24rpx;

        .complete-icon {
            width: 24rpx;
            height: 24rpx;
            margin-right: 8rpx;
        }

        .value {
            margin-left: 20rpx;
            font-weight: 400;
        }

        .tips-icon {
            margin-left: 8rpx;
        }
    }
}
</style>
