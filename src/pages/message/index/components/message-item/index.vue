<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { clickAlready, deleteChat, topMessage } from '@/api/message';
import { type ChatItem, ChatMessageType } from '@/api/message/types';
import { TopStatus } from '@/api/message/types';
import { getTime } from '@/utils/time';

import { formatDate } from '../../../utils/index';
import { messageDisplay } from './constants';

const props = defineProps<{
    item: ChatItem;
}>();

const emits = defineEmits<{
    (event: 'top', msgId: number, topStatus: TopStatus): void;
    (event: 'delete', msgId: number): void;
}>();

const actions = computed(() => {
    if (props.item.topStatus === TopStatus.NotTop) {
        return ['top', 'delete'];
    } else {
        return ['cancelTop', 'delete'];
    }
});

const badge = computed(() => {
    if (props.item.msgUnreadNum > 99) {
        return '99+';
    } else {
        return props.item.msgUnreadNum;
    }
});

function gotoChat() {
    clickAlready({
        messageId: props.item.latestMsg.msgId
    });
    router.push('chatRoom', {
        shopNo: props.item.chatUserNo
    });
}

async function clickSwipe(type: 'top' | 'cancelTop' | 'delete') {
    if (type === 'top' || type === 'cancelTop') {
        await topMessage({
            messageId: props.item.latestMsg.msgId,
            topStatus: +!props.item.topStatus
        });
        emits('top', props.item.latestMsg.msgId, +!props.item.topStatus);
    } else {
        await deleteChat({
            messageId: [props.item.latestMsg.msgId]
        });
        emits('delete', props.item.latestMsg.msgId);
    }
}

const content = computed(() => {
    if (props.item.latestMsg.msgType === ChatMessageType.Text) {
        return JSON.parse(props.item.latestMsg.msgContent).text;
    } else if (props.item.latestMsg.msgType === ChatMessageType.Emoji) {
        return JSON.parse(props.item.latestMsg.msgContent).title;
    } else {
        return messageDisplay[props.item.latestMsg.msgType];
    }
});

const time = computed(() => {
    return formatDate(props.item.msgTime, undefined, true);
});
</script>

<template>
    <zd-swipe-action
        :actions="actions"
        @click="clickSwipe"
    >
        <view
            class="message-item"
            @tap="gotoChat"
        >
            <image
                class="message-item-left"
                :src="item.shopInfo.shopLogo"
            />
            <view class="message-item-right">
                <view class="message-item-right-header">
                    <view style="display: flex; flex: 1; align-items: center">
                        <view class="message-item-right-header-title"
                            >{{ item.shopInfo.shopTitle }}
                        </view>
                        <view
                            v-if="badge"
                            class="message-item-right-header-badge"
                            >{{ badge }}</view
                        >
                    </view>
                    <text class="message-item-right-header-date">{{ time }}</text>
                </view>
                <view class="message-item-right-body">{{ content }}</view>
            </view>
        </view>
    </zd-swipe-action>
</template>

<style scoped lang="scss">
.message-item {
    display: flex;
    align-items: center;
    height: 136rpx;
    padding: 24rpx 0 0 40rpx;
    gap: 20rpx;
    box-sizing: border-box;
    background: #fff;

    &-left {
        width: 88rpx;
        height: 88rpx;
        margin-bottom: 24rpx;
        border-radius: 44rpx;
        flex-shrink: 0;
    }

    &-right {
        flex: 1;
        display: flex;
        gap: 20rpx;
        flex-direction: column;
        padding: 0 40rpx 30rpx 0;
        border-bottom: 2rpx solid #f4f4f4;

        &-header {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;

            &-title {
                align-items: center;
                overflow: hidden;
                max-width: 364rpx;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: $uni-color-title;
                font-size: 28rpx;
                font-weight: 500;
                line-height: 40rpx;
            }

            &-badge {
                min-width: 32rpx;
                height: 32rpx;
                margin-left: 10rpx;
                border-radius: 16rpx;
                text-align: center;
                color: #ffffff;
                font-size: 20rpx;
                font-weight: 400;
                background: $zd-color-red;
                flex-grow: 0;
                flex-shrink: 0;
                line-height: 32rpx;
            }

            &-date {
                flex-shrink: 0;
                color: $uni-text-color-placeholder;
                font-size: 24rpx;
                font-weight: 400;
                line-height: 40rpx;
            }
        }

        &-body {
            overflow: hidden;
            max-width: 550rpx;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: $uni-text-color-placeholder;
            font-size: 24rpx;
            font-weight: 400;
            line-height: 24rpx;
        }
    }
}
</style>
