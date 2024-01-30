<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { GoodListCommonItem } from '@/api/redpacket/types';

const props = defineProps<{
    item?: GoodListCommonItem;
}>();

function click() {
    router.push('goodsDetail', {
        goodsNo: props.item?.goodsNo
    });
}
</script>

<template>
    <view
        class="good-item"
        @tap="click"
    >
        <image
            class="good-item-left"
            :src="item?.goodsCover"
        />
        <view class="good-item-right">
            <text class="good-item-right-title">{{ item?.goodsTitle }}</text>
            <view class="good-item-right-content">
                <view class="good-item-right-content-info">
                    <text v-if="item?.isStudentPrice">学生价</text>
                    <zd-price
                        :value="item?.goodsPrice"
                        :font-size-large="40"
                        :font-size-small="32"
                    />
                </view>
                <view class="good-item-right-content-btn">
                    <zd-icon
                        type="zdmp-gouwuche"
                        color="#199FFF"
                        :size="42"
                    />
                </view>
            </view>
        </view>
    </view>
</template>

<style scoped lang="scss">
.good-item {
    display: flex;
    gap: 20rpx;
    padding: 20rpx 30rpx 20rpx 20rpx;
    box-sizing: border-box;

    &-left {
        width: 200rpx;
        height: 200rpx;
        border-radius: 12rpx;
    }

    &-right {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;

        &-title {
            display: -webkit-inline-box;
            overflow: hidden;
            height: 80rpx;
            text-align: left;
            text-overflow: ellipsis;
            color: $uni-text-color;
            font-size: 28rpx;
            font-weight: 500;
            line-height: 40rpx;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
        }

        &-content {
            display: flex;
            justify-content: space-between;
            align-items: center;

            &-info {
                display: flex;
                align-items: flex-end;
                gap: 6rpx;

                > text {
                    color: $zd-color-red;
                    font-size: 20rpx;
                    font-weight: 400;
                    line-height: 20rpx;
                }
            }

            &-btn {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 64rpx;
                height: 64rpx;
                border-radius: 32rpx;
                background: rgba($color: #199fff, $alpha: 0.1);
            }
        }
    }
}
</style>
