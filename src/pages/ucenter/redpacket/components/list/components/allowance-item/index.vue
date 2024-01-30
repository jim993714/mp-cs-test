<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
import dayjs from 'dayjs';

import type { AllowanceItem } from '@/api/redpacket/types';
import { CardStatus } from '@/api/redpacket/types';

import type { Tab } from '../../types';

const props = defineProps<{
    item: AllowanceItem;
    type: Tab;
}>();

function dateFormatter(timestamp: number) {
    return dayjs(timestamp).format('YYYY.MM.DD');
}

function gotoDetail() {
    router.push('allowanceDetail', {
        studentAllowanceId: props.item.studentAllowanceId
    });
}

const fontSize = computed(() => {
    if (props.item.availableMoney.toString().length > 5) {
        return '40rpx';
    } else {
        return '64rpx';
    }
});
</script>

<template>
    <view class="wrapper">
        <view
            :class="{
                'allowance-item': true,
                'allowance-item__used': props.item.status === CardStatus.Used,
                'allowance-item__invalid': props.item.status === CardStatus.Invalid
            }"
        >
            <view class="allowance-item-display">
                <view>
                    <text class="allowance-item-display-rmb">¥</text>
                    <text
                        class="allowance-item-display-num"
                        :style="{ fontSize }"
                        >{{ props.item.availableMoney }}</text
                    >
                </view>
                <text class="allowance-item-display-condition">无门槛</text>
                <view class="allowance-item-display-tag">津贴</view>
            </view>
            <view class="allowance-item-detail">
                <view class="allowance-item-detail-info">
                    <text class="allowance-item-detail-info-title">{{ props.item.title }}</text>
                    <text
                        >有效期: {{ dateFormatter(props.item.useStartTime) }}-{{
                            dateFormatter(props.item.useEndTime)
                        }}</text
                    >
                </view>
                <view
                    v-if="props.item.status !== CardStatus.Invalid"
                    class="allowance-item-detail-use"
                    @tap="gotoDetail"
                    >查看</view
                >
            </view>
        </view>
    </view>
</template>

<style scoped lang="scss">
.wrapper {
    width: 100%;
    padding: 20rpx 20rpx 0 20rpx;
    box-sizing: border-box;
}

.allowance-item {
    display: flex;
    width: 710rpx;
    height: 176rpx;
    color: $zd-color-purple;
    background-size: cover;
    background-image: url('https://nss1.zsdx.cn/mp-cs/images/ucenter/allowance-card-bg.png');

    &-display {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 156rpx;
        gap: 4rpx;
        flex-direction: column;

        &-num {
            margin-right: 4rpx;
            font-size: 64rpx;
            font-family: Bebas Neue;
            line-height: 68rpx;
        }

        &-discount {
            font-size: 24rpx;
            font-weight: 600;
            line-height: 28rpx;
        }

        &-rmb {
            font-size: 32rpx;
            font-family: Bebas Neue;
            line-height: 48rpx;
        }

        &-condition {
            font-size: 20rpx;
            line-height: 28rpx;
        }

        &-tag {
            padding: 6rpx 21rpx;
            border-radius: 16rpx;
            color: rgba($color: #ffffff, $alpha: 0.9);
            font-size: 20rpx;
            background: $zd-color-purple;
            box-sizing: border-box;
        }
    }

    &-detail {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 34rpx 20rpx;
        flex: 1;
        box-sizing: border-box;

        &-info {
            display: flex;
            justify-content: space-between;
            min-height: 56rpx;
            flex-direction: column;
            gap: 24rpx;

            &-title {
                color: $uni-color-title;
                font-size: 28rpx;
                font-weight: 500;
                line-height: 28rpx;
            }

            > text:last-of-type {
                color: $uni-text-color-placeholder;
                font-size: 24rpx;
                line-height: 24rpx;
            }
        }

        &-use {
            padding: 16rpx 24rpx;
            box-sizing: border-box;
            border-radius: 28rpx;
            color: #ffffff;
            font-size: 24rpx;
            font-weight: 500;
            background: $zd-color-purple;
            line-height: 24rpx;
        }
    }

    &__used {
        background-image: url('https://nss1.zsdx.cn/mp-cs/images/ucenter/packet-card-bg__used.png');
        color: $uni-color-paragraph;

        .allowance-item-display-tag {
            background: $uni-color-paragraph;
        }

        .allowance-item-detail-info-use {
            border: 2rpx solid $uni-color-paragraph;
            color: $uni-color-paragraph;
            background: #ffffff;
        }
    }

    &__invalid {
        background-image: url('https://nss1.zsdx.cn/mp-cs/images/ucenter/packet-card-bg__invalid.png');
        color: $uni-color-paragraph;

        .allowance-item-display-tag {
            background: $uni-color-paragraph;
        }
    }
}
</style>
