<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { confirmAddress } from '@/api/message';
import { ChatMessageType, CheckStatus, type MessageItem } from '@/api/message/types';

import { checkLabels } from '../../../constants';

const props = defineProps<{
    item: MessageItem & {
        msgType: ChatMessageType.OrderPaid | ChatMessageType.OrderReceived;
    };
}>();

const emits = defineEmits<{
    (
        event: 'confirm',
        item: MessageItem & {
            msgType: ChatMessageType.OrderPaid | ChatMessageType.OrderReceived;
        }
    ): void;
}>();

const btnClass = computed(() => {
    if (
        props.item.msgType === ChatMessageType.OrderReceived ||
        (props.item.msgType === ChatMessageType.OrderPaid &&
            props.item.msgContent.check_status === CheckStatus.None)
    ) {
        return 'chat-item-order-confirm__primary';
    } else {
        return 'chat-item-order-confirm__disable';
    }
});

function copyOrderNo() {
    uni.setClipboardData({
        data: props.item.msgContent.order_no,
        success: res => {
            if (res) {
                uni.showToast({
                    title: '复制成功',
                    icon: 'success'
                });
            }
        }
    });
}

async function click() {
    if (props.item.msgType === ChatMessageType.OrderPaid) {
        if (props.item.msgContent.check_status === CheckStatus.None) {
            try {
                await confirmAddress({
                    orderNo: props.item.msgContent.order_no,
                    msgId: props.item.msgId
                });
                emits('confirm', props.item);
            } catch (error: any) {
                uni.showToast({
                    title: error.msg,
                    icon: 'none'
                });
            }
        } else {
            router.push('orderDetail', {
                orderNo: props.item.msgContent.order_no
            });
        }
    } else {
        router.push('orderDetail', {
            orderNo: props.item.msgContent.order_no
        });
    }
}
</script>

<template>
    <view class="chat-item-header">
        {{
            item.msgType === ChatMessageType.OrderPaid
                ? '亲，请您核对订单信息'
                : '亲~快递显示你的订单已经签收了呢！确定收到商品后再点击确认收货哦~<'
        }}
    </view>
    <view class="chat-item-order-confirm">
        <view class="chat-item-order-confirm-order">
            <image :src="item.msgContent.goods_cover" />
            <view class="chat-item-order-confirm-order-detail">
                <view class="chat-item-order-confirm-order-detail-title">{{
                    item.msgContent.goods_title
                }}</view>
                <view class="chat-item-order-confirm-order-detail-total">
                    共{{ item.msgContent.goods_num }}件商品，合计
                    <text class="chat-item-order-confirm-order-detail-total-money">{{
                        item.msgContent.order_money
                    }}</text>
                </view>
            </view>
        </view>
        <template v-if="item.msgType === ChatMessageType.OrderPaid">
            <view class="chat-item-order-confirm-item">
                姓名：{{ item.msgContent.true_name }}
            </view>
            <view class="chat-item-order-confirm-item"> 电话：{{ item.msgContent.phone }} </view>
            <view class="chat-item-order-confirm-item"> 地址：{{ item.msgContent.address }} </view>
            <view class="chat-item-order-confirm-item chat-item-order-confirm-item__btn">
                <text> 订单编号：{{ item.msgContent.order_no }} </text>
                <view
                    class="chat-item-order-confirm-item-copy"
                    @tap="copyOrderNo"
                    >复制</view
                >
            </view>
        </template>
        <view
            :class="`chat-item-order-confirm__normal ${btnClass}`"
            @tap="click"
        >
            {{
                item.msgType === ChatMessageType.OrderPaid
                    ? checkLabels[item.msgContent.check_status]
                    : '查看订单'
            }}
        </view>
    </view>
</template>

<style scoped lang="scss">
.chat-item-header {
    overflow: hidden;
    margin-bottom: 20rpx;
    text-overflow: ellipsis;
    color: $uni-text-color;
    font-size: 28rpx;
    font-weight: 500;
    line-height: 28rpx;
}

.chat-item-order-confirm {
    display: flex;
    width: 478rpx;
    flex-direction: column;

    &-order {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 24rpx 0;
        background: $uni-text-color-inverse;
        flex: 1;
        gap: 20rpx;

        > image {
            display: block;
            width: 112rpx;
            height: 112rpx;
            border-radius: 8rpx;
            flex-shrink: 0;
        }

        &-detail {
            display: flex;
            justify-content: center;
            align-items: space-between;
            width: 0;
            flex: 1;
            flex-direction: column;
            gap: 18rpx;

            &-title {
                overflow: hidden;
                height: 34rpx;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: $uni-color-title;
                font-size: 24rpx;
                font-weight: 400;
                flex: 1;
                line-height: 34rpx;
            }

            &-total {
                color: $uni-color-paragraph;
                font-size: 24rpx;
                font-family: Bebas Neue;
                font-weight: 400;
                line-height: 32rpx;

                &-money {
                    color: $uni-color-subtitle;
                    font-size: 32rpx;

                    &::before {
                        content: '¥';
                        display: inline-block;
                        font-size: 24rpx;
                    }
                }
            }
        }
    }

    &-item {
        overflow: hidden;
        margin-top: 4rpx;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #576066;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 34rpx;

        &__btn {
            display: flex;
            flex: 1;
            align-items: center;

            > text {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }

        &-copy {
            width: 64rpx;
            height: 32rpx;
            margin-left: 10rpx;
            border: 2rpx solid $uni-color-subtitle;
            border-radius: 26rpx;
            text-align: center;
            color: $uni-color-subtitle;
            font-size: 20rpx;
            font-weight: 400;
            flex-shrink: 0;
            line-height: 32rpx;
        }
    }

    &__normal {
        width: auto;
        height: 24rpx;
        margin-top: 24rpx;
        padding: 12rpx 24rpx;
        border-radius: 24rpx;
        font-size: 24rpx;
        font-weight: 500;
        align-self: flex-end;
        line-height: 24rpx;
    }

    &__primary {
        border: 2rpx solid $zd-main-color;
        color: #fff;
        background: $zd-main-color;
    }

    &__disable {
        border: 2rpx solid $uni-text-color-placeholder;
        color: $uni-color-paragraph;
        background: #fff;
    }
}
</style>
