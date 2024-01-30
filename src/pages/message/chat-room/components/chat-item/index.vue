<script setup lang="ts">
import dayjs from 'dayjs';

import { getSystemTime } from '@/api/common';
import { ChatMessageType, type MessageItem } from '@/api/message/types';
import { CDN_BASE_URL } from '@/base/constants';
import { getTime } from '@/utils/time';

import ChatEmoji from './components/emoji/index.vue';
import ChatGoods from './components/goods/index.vue';
import ChatImage from './components/image/index.vue';
import ChatOrder from './components/order/index.vue';
import ChatOrderConfirm from './components/order-confirm/index.vue';
import ChatText from './components/text/index.vue';
import Tooltip from './components/tooltip/index.vue';
import ChatVideo from './components/video/index.vue';

const props = defineProps<{
    item: MessageItem;
}>();

const emits = defineEmits<{
    (event: 'remove'): void;
    (event: 'recall'): void;
    (event: 'transfer', chatNo: string, sessionNo: string): void;
    (event: 'resend', item: any): void;
    (event: 'confirm', item: any): void;
}>();

const touchTime = ref(Date.now());

function copy() {
    let str = '';
    if (props.item.msgType === ChatMessageType.Text) {
        str = props.item.msgContent.text;
    } else if (props.item.msgType === ChatMessageType.Emoji) {
        str = props.item.msgContent.title;
    }

    uni.setClipboardData({
        data: str,
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

function remove() {
    emits('remove');
}

function recall() {
    emits('recall');
}

function transfer() {
    const item = props.item as MessageItem & { msgType: ChatMessageType.Transfer };
    emits('transfer', item.msgContent.chat_no, item.msgContent.session_no);
}

function resend() {
    emits('resend', props.item);
}

function confirm() {
    emits('confirm', props.item);
}

function onShow() {
    touchTime.value = getTime(Date.now());
}

const mediaStyle = computed(() => {
    if (
        props.item.msgType === ChatMessageType.Video ||
        props.item.msgType === ChatMessageType.Image ||
        props.item.msgType === ChatMessageType.Emoji
    ) {
        return {
            padding: '0 !important',
            maxWidth: 'unset'
        };
    }

    return {};
});

const showPopup = computed(() => {
    return !(
        props.item.msgType === ChatMessageType.GoodsSelf ||
        props.item.msgType === ChatMessageType.GoodsBargain ||
        props.item.msgType === ChatMessageType.GoodsDiscount ||
        props.item.msgType === ChatMessageType.GoodsFree ||
        props.item.msgType === ChatMessageType.GoodsFlashSale ||
        props.item.msgType === ChatMessageType.GoodsLottery ||
        props.item.msgType === ChatMessageType.GoodsWelfare ||
        props.item.msgType === ChatMessageType.Order ||
        props.item.msgType === ChatMessageType.OrderPaid ||
        props.item.msgType === ChatMessageType.OrderReceived
    );
});

const canRetract = computed(() => {
    if (props.item.isSender && dayjs(touchTime.value).diff(props.item.msgTime, 'second') <= 120) {
        return true;
    }
    return false;
});
</script>

<template>
    <view class="chat-item">
        <view
            v-if="!item.isRetract && item.msgType !== ChatMessageType.Notice"
            :class="{ 'chat-item-container': true, 'box__is-me': item.isSender }"
        >
            <view class="chat-item-container-avatar">
                <image
                    :src="item.senderInfo.senderHead"
                    mode="aspectFill"
                />
            </view>
            <view class="chat-item-container-content">
                <view
                    :class="{
                        'chat-item-container-content-container': true,
                        'content__is-me': item.isSender
                    }"
                    :style="mediaStyle"
                >
                    <Tooltip
                        v-if="showPopup"
                        :is-sender="!!props.item.isSender"
                        @show="onShow"
                    >
                        <template
                            v-if="
                                item.msgType === ChatMessageType.Text ||
                                item.msgType === ChatMessageType.Queue ||
                                item.msgType === ChatMessageType.Remark
                            "
                        >
                            <ChatText :item="item" />
                        </template>
                        <template v-if="item.msgType === ChatMessageType.Image">
                            <ChatImage :item="item" />
                        </template>
                        <template v-if="item.msgType === ChatMessageType.Video">
                            <ChatVideo :item="item" />
                        </template>
                        <template v-if="item.msgType === ChatMessageType.Emoji">
                            <ChatEmoji :item="item" />
                        </template>
                        <template #tools>
                            <view class="chat-item-tools">
                                <view
                                    v-if="
                                        item.msgType !== ChatMessageType.Image &&
                                        item.msgType !== ChatMessageType.Video
                                    "
                                    class="chat-item-tools-item"
                                    @tap="copy"
                                >
                                    复制
                                </view>
                                <view
                                    v-if="canRetract && item.msgId !== -1"
                                    class="chat-item-tools-item"
                                    @tap="recall"
                                >
                                    撤回
                                </view>
                                <view
                                    class="chat-item-tools-item"
                                    @tap="remove"
                                >
                                    删除
                                </view>
                            </view>
                        </template>
                    </Tooltip>
                    <template v-else>
                        <template
                            v-if="
                                item.msgType === ChatMessageType.GoodsSelf ||
                                item.msgType === ChatMessageType.GoodsBargain ||
                                item.msgType === ChatMessageType.GoodsDiscount ||
                                item.msgType === ChatMessageType.GoodsFree ||
                                item.msgType === ChatMessageType.GoodsFlashSale ||
                                item.msgType === ChatMessageType.GoodsLottery ||
                                item.msgType === ChatMessageType.GoodsWelfare
                            "
                        >
                            <ChatGoods :item="item" />
                        </template>
                        <template v-if="item.msgType === ChatMessageType.Order">
                            <ChatOrder :item="item" />
                        </template>
                        <template
                            v-if="
                                item.msgType === ChatMessageType.OrderPaid ||
                                item.msgType === ChatMessageType.OrderReceived
                            "
                        >
                            <ChatOrderConfirm
                                :item="item"
                                @confirm="confirm"
                            />
                        </template>
                    </template>
                </view>
            </view>
            <view class="chat-item-container__status">
                <template v-if="!item.msgId">
                    <view class="chat-item-container__status-waiting">
                        <image :src="`${CDN_BASE_URL}/mp-cs/images/message/icon-loading.png`" />
                    </view>
                </template>
                <template v-else-if="item.msgId === -1">
                    <view @tap="resend">
                        <zd-icon
                            :size="32"
                            type="zdmp-jinggao"
                            color="#FF4734"
                        />
                    </view>
                </template>
                <template v-else-if="item.isSender">
                    <view
                        class="chat-item-container__status-label"
                        :style="{ color: item.msgRead ? '#8A9399' : '#199FFF' }"
                    >
                        {{ item.msgRead ? '已读' : '未读' }}
                    </view>
                </template>
            </view>
        </view>
        <view
            v-else-if="item.isRetract"
            class="chat-item__retract"
        >
            {{ item.isSender ? '你' : item.senderInfo.senderName }}撤回了一条消息
        </view>
        <view
            v-else-if="
                item.msgType === ChatMessageType.Notice || item.msgType === ChatMessageType.Transfer
            "
            class="chat-item__notice"
        >
            {{ item.msgContent.text }}
            <text
                v-if="item.msgType === ChatMessageType.Transfer"
                @tap="transfer"
                >立即转接</text
            >
        </view>
    </view>
</template>

<style scoped lang="scss">
.chat-item {
    display: flex;
    padding: 20rpx;
    flex-direction: column;

    &-container {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        flex-wrap: wrap;

        &-avatar {
            margin-top: 12rpx;
            > image {
                width: 76rpx;
                height: 76rpx;
                border-radius: 50%;
                background: #fff;
            }
        }

        &-content {
            margin: 0rpx 20rpx;

            &-container {
                max-width: 500rpx;
                margin-top: 10rpx;
                padding: 14rpx 20rpx;
                border-radius: 12rpx;
                color: $uni-color-title;

                font-size: 28rpx;
                font-weight: 400;
                background: #fff;
                line-height: 36rpx;
            }

            .content__is-me {
                background-color: #cbe9ff;
            }
        }

        &__status {
            align-self: center;

            @keyframes rotate {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }

            &-waiting {
                animation: rotate 1s linear infinite;

                > image {
                    display: block;
                    width: 32rpx;
                    height: 32rpx;
                }
            }

            &-label {
                font-size: 24rpx;
                font-weight: 400;
                line-height: 24rpx;
            }
        }
    }

    .box__is-me {
        flex-direction: row-reverse;
        text-align: right;
    }

    &-tools {
        display: flex;
        align-items: center;

        &-item {
            padding: 20rpx 26rpx;
            white-space: nowrap;
            color: #fff;
            font-size: 24rpx;
            font-weight: 400;
            line-height: 24rpx;
        }
    }

    &__retract {
        max-width: 386rpx;
        padding: 8rpx 20rpx;
        border-radius: 8rpx;
        text-align: center;
        color: $uni-color-paragraph;
        font-size: 24rpx;
        font-weight: 400;
        background: $uni-text-color-disable;
        line-height: 36rpx;
        box-sizing: border-box;
        align-self: center;
        word-break: break-all;
    }

    &__notice {
        max-width: 386rpx;
        text-align: center;
        color: $uni-color-paragraph;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 40rpx;
        word-break: break-all;
        align-self: center;
    }
}
</style>
