<script setup lang="ts">
import { ChatMessageType, type GoodsType } from '@/api/message/types';
import type { GoodListCommonItem } from '@/api/redpacket/types';

const visible = ref(false);
const item = ref<
    GoodListCommonItem & {
        saleNo?: string;
    }
>();

const emits = defineEmits<{
    (
        event: 'send',
        item: GoodListCommonItem & {
            goodsType: GoodsType;
        }
    ): void;
}>();

function close() {
    visible.value = false;
}

function sendMsg() {
    const params: GoodListCommonItem & {
        goodsType: GoodsType;
        saleNo?: string;
    } = { ...item.value } as any;
    if (params.saleNo) {
        params.goodsType = ChatMessageType.GoodsFlashSale;
    } else {
        params.goodsType = ChatMessageType.GoodsSelf;
    }

    emits('send', params);
    visible.value = false;
}

defineExpose({
    open: (
        val: GoodListCommonItem & {
            saleNo?: string;
        }
    ) => {
        visible.value = true;
        item.value = val;
    }
});
</script>

<template>
    <view
        v-if="visible"
        class="chat-fab-goods"
    >
        <image :src="item?.goodsCover" />
        <view class="chat-fab-goods-detail">
            <view class="chat-fab-goods-detail-header">
                <view class="chat-fab-goods-detail-header-title">
                    {{ item?.goodsTitle }}
                </view>
                <view @tap="close">
                    <zd-icon
                        :size="34"
                        type="zdmp-guanbidefuben"
                        color="#8a9399"
                    />
                </view>
            </view>
            <view class="chat-fab-goods-detail-footer">
                <view class="chat-fab-goods-detail-footer-price">
                    {{ item?.goodsPrice }}
                </view>
                <view
                    class="chat-fab-goods-detail-footer-send"
                    @tap="sendMsg"
                    >发送商品</view
                >
            </view>
        </view>
    </view>
</template>

<style scoped lang="scss">
.chat-fab-goods {
    position: absolute;
    top: -20rpx;
    right: 20rpx;
    left: 20rpx;
    z-index: 1000;
    display: flex;
    align-items: center;
    height: 180rpx;
    padding: 20rpx;
    box-sizing: border-box;
    border-radius: 16rpx;
    background: #fff;
    transform: translateY(-100%);
    gap: 20rpx;

    > image {
        width: 140rpx;
        height: 140rpx;
        border-radius: 8rpx;
        flex-shrink: 0;
    }

    &-detail {
        flex: 1;
        display: flex;
        align-items: space-between;
        flex-direction: column;
        gap: 24rpx;

        &-header {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;

            &-title {
                display: -webkit-box;
                overflow: hidden;
                height: 80rpx;
                padding-right: 54rpx;
                text-overflow: ellipsis;
                color: $uni-color-title;
                font-size: 28rpx;
                font-weight: 400;
                line-height: 40rpx;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                word-break: break-all;
            }
        }

        &-footer {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;

            &-price {
                display: inline-block;
                color: $zd-color-red;
                font-size: 32rpx;
                line-height: 32rpx;
                font-family: Bebas Neue;

                &::before {
                    content: '¥';
                    display: inline-block;
                    color: $zd-color-red;
                    font-size: 24rpx;
                    line-height: 32rpx;
                }
            }

            &-send {
                width: 144rpx;
                height: 48rpx;
                border-radius: 24rpx;
                text-align: center;
                color: #fff;
                font-size: 24rpx;
                font-weight: 500;
                background: $zd-main-color;
                line-height: 48rpx;
            }
        }
    }
}
</style>
