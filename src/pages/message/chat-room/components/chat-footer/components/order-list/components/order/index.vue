<script setup lang="ts">
import dayjs from 'dayjs';

import type { ChatMessageType, MessageItem, OrderItem } from '@/api/message/types';

const props = defineProps<{
    item: OrderItem;
}>();

const emits = defineEmits<{
    (event: 'send', orderNo: string): void;
}>();

const time = computed(() => {
    return dayjs(props.item.createTime * 1000).format('YYYY-MM-DD HH:mm:ss');
});

const goodsSpec = computed(() => {
    return props.item.goodsSpec.map(item => `${item.specName}:${item.specValue}`).join(',');
});

function sendOrder() {
    emits('send', props.item.orderNo);
}
</script>

<template>
    <view
        class="order-item"
        @tap="sendOrder"
    >
        <view class="order-item-header"> 下单时间：{{ time }} </view>
        <view class="order-item-body">
            <image
                class="order-item-body-cover"
                :src="item.goodsCover"
            ></image>
            <view class="order-item-body-detail">
                <view class="order-item-body-detail-title"> {{ item.goodsTitle }} </view>
                <view class="order-item-body-detail-desc">{{ goodsSpec }}</view>
                <view class="order-item-body-detail-footer">
                    <view> 购买数量：{{ item.num }} </view>
                    <view>
                        实付款:
                        <text class="order-item-body-detail-footer-money"> ¥{{ item.money }} </text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<style scoped lang="scss">
.order-item {
    display: flex;
    width: calc(100% - 40rpx);
    width: 710rpx;
    height: 284rpx;
    margin: 20rpx;
    padding: 30rpx;
    border-radius: 12rpx;
    background: #fff;
    box-sizing: border-box;
    flex-direction: column;
    gap: 24rpx;

    &-header {
        padding-bottom: 24rpx;
        border-bottom: 2rpx solid $uni-text-color-disable;
        color: $uni-color-title;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 28rpx;
    }

    &-body {
        display: flex;
        align-items: center;
        gap: 20rpx;

        &-cover {
            width: 148rpx;
            height: 148rpx;
            border-radius: 8rpx;
            flex-shrink: 0;
        }

        &-detail {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: stretch;
            flex: 1;
            width: 0;
            height: 100%;

            &-title {
                overflow: hidden;
                width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: $uni-color-title;
                font-size: 28rpx;
                font-weight: 400;
                line-height: 40rpx;
            }

            &-desc {
                overflow: hidden;
                width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: $uni-color-paragraph;
                font-size: 24rpx;
                font-weight: 400;
                line-height: 28rpx;
            }

            &-footer {
                display: flex;
                align-items: center;
                gap: 48rpx;
                color: $uni-color-paragraph;
                font-size: 24rpx;
                font-weight: 400;
                line-height: 32rpx;

                &-money {
                    color: $uni-color-title;
                    font-size: 32rpx;
                    font-family: Bebas Neue;
                    line-height: 32rpx;
                }
            }
        }
    }
}
</style>
