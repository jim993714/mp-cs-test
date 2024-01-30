<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { AddressType } from '@/api/address/types';
import type { PrizeReceiveAddress } from '@/api/ucenter/types';
import { PrizeExchangeStatus } from '@/api/ucenter/types';

const props = defineProps<{
    info: PrizeReceiveAddress | undefined | null;
    status?: PrizeExchangeStatus;
}>();

function goAddressList() {
    if (props.status !== PrizeExchangeStatus.WAITING_FOR_ADDRESS) return;

    router.push('myAddress', {
        select: AddressType.Normal
    });
}
</script>

<template>
    <view
        class="address"
        @tap="goAddressList"
    >
        <view
            v-if="!props.info"
            class="no-address"
        >
            <zd-icon
                :size="24"
                type="zdmp-tianjia"
            />
            <view class="text">新增收货地址</view>
            <zd-icon
                class="go-icon"
                :size="20"
                type="zdmp-fanhui"
            />
        </view>
        <view
            v-else
            class="address-info"
        >
            <view class="header">
                <zd-icon
                    :size="32"
                    class="address-icon"
                    type="zdmp-weizhi"
                />
                <view class="text">
                    <text>{{ info?.userName }}</text>
                    <text>{{ info?.phone }}</text>
                </view>
                <zd-icon
                    v-if="props.status === PrizeExchangeStatus.WAITING_FOR_ADDRESS"
                    class="go-icon"
                    :size="20"
                    type="zdmp-fanhui"
                />
            </view>
            <view class="detail-text ellipsis2">
                {{ `${info?.provinceName}${info?.cityName}${info?.countyName}${info?.detailInfo}` }}
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.address {
    .no-address {
        display: flex;
        align-items: center;
        height: 92rpx;
        padding: 0 24rpx 0 28rpx;
        border-radius: 12rpx;
        color: $zd-main-color;
        font-size: 28rpx;
        font-weight: 500;
        background: #ffffff;
        line-height: 32rpx;
        gap: 24rpx;

        .text {
            flex: 1;
        }

        .go-icon {
            color: $uni-color-paragraph;
            transform: rotate(180deg);
        }
    }

    .address-info {
        display: flex;
        height: 184rpx;
        padding: 30rpx 24rpx;
        border-radius: 12rpx;
        background: #ffffff;
        flex-direction: column;
        gap: 20rpx;
        box-sizing: border-box;

        .header {
            display: flex;
            align-items: center;
            border-radius: 12rpx;
            color: $uni-text-color;
            font-size: 28rpx;
            font-weight: 500;
            line-height: 32rpx;
            gap: 24rpx;

            .text {
                flex: 1;
                display: flex;
                gap: 16rpx;
            }

            .address-icon {
                color: $zd-main-color;
            }

            .go-icon {
                color: $uni-color-paragraph;
                transform: rotate(180deg);
            }
        }

        .detail-text {
            margin-left: 52rpx;
            color: #576066;
            font-size: 24rpx;
            font-weight: 400;
            line-height: 36rpx;
        }
    }
}
</style>
