<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { ChatMessageType, MessageItem } from '@/api/message/types';

const props = defineProps<{
    item: MessageItem & {
        msgType: ChatMessageType.Order;
    };
}>();

function gotoOrder() {
    router.push('orderDetail', {
        orderNo: props.item.msgContent.order_no
    });
}
</script>

<template>
    <view @tap="gotoOrder">
        <view class="chat-item-header"> 订单编号：{{ item.msgContent.order_no }} </view>
        <view class="chat-item-order">
            <image :src="item.msgContent.goods_cover" />
            <view class="chat-item-order-detail">
                <view class="chat-item-order-detail-title">{{ item.msgContent.goods_title }}</view>
                <view class="chat-item-order-detail-status">
                    订单状态：{{ item.msgContent.order_status_text }}
                </view>
            </view>
        </view>
    </view>
</template>

<style scoped lang="scss">
.chat-item-header {
    overflow: hidden;
    margin-bottom: 20rpx;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: $uni-text-color;
    font-size: 28rpx;
    font-weight: 500;
    line-height: 32rpx;
}

.chat-item-order {
    display: flex;
    align-items: center;
    width: 478rpx;
    gap: 20rpx;

    > image {
        width: 112rpx;
        height: 112rpx;
        border-radius: 8rpx;
        flex-shrink: 0;
    }

    &-detail {
        display: flex;
        align-items: space-between;
        flex-direction: column;
        gap: 24rpx;

        &-title {
            display: -webkit-box;
            overflow: hidden;
            height: 68rpx;
            text-align: left;
            text-overflow: ellipsis;
            color: #576066;
            font-size: 24rpx;
            font-weight: 400;
            line-height: 34rpx;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        &-status {
            color: #ff3030;
            font-size: 24rpx;
            line-height: 28rpx;
        }
    }
}
</style>
