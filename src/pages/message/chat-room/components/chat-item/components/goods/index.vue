<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { ChatMessageType, type MessageItem } from '@/api/message/types';

const props = defineProps<{
    item: MessageItem & {
        msgType:
            | ChatMessageType.GoodsSelf
            | ChatMessageType.GoodsBargain
            | ChatMessageType.GoodsDiscount
            | ChatMessageType.GoodsFlashSale
            | ChatMessageType.GoodsFree
            | ChatMessageType.GoodsLottery
            | ChatMessageType.GoodsWelfare;
    };
}>();

function gotoGoodsDetail() {
    if (props.item.msgType === ChatMessageType.GoodsSelf) {
        router.push('goodsDetail', {
            goodsNo: props.item.msgContent.goods_no
        });
    } else if (props.item.msgType === ChatMessageType.GoodsFlashSale) {
        router.push('goodsDetailFlash', {
            saleNo: props.item.msgContent.sale_no
        });
    }
}
</script>

<template>
    <view
        class="chat-item-goods"
        @tap="gotoGoodsDetail"
    >
        <image :src="item.msgContent.goods_cover" />
        <view class="chat-item-goods-detail">
            <view class="chat-item-goods-detail-title">{{ item.msgContent.goods_title }}</view>
            <view class="chat-item-goods-detail-price">
                {{ item.msgContent.goods_price }}
            </view>
        </view>
    </view>
</template>

<style scoped lang="scss">
.chat-item-goods {
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
            text-overflow: ellipsis;
            color: #576066;
            font-size: 24rpx;
            font-weight: 400;
            line-height: 34rpx;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        &-price {
            display: inline-block;
            text-align: left;
            color: $zd-color-red;
            font-size: 32rpx;
            font-family: Bebas Neue;
            line-height: 32rpx;

            &::before {
                content: '¥';
                display: inline-block;
                color: $zd-color-red;
                font-size: 24rpx;
                line-height: 32rpx;
            }
        }
    }
}
</style>
