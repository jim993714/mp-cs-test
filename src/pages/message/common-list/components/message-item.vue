<script setup lang="ts">
import dayjs from 'dayjs';

import { clickAlready } from '@/api/message';
import { type CommonMessageItem, MessageStatus, MessageType } from '@/api/message/types';
import { CDN_BASE_URL } from '@/base/constants';
import doAction from '@/utils/action';

const emits = defineEmits(['already']);
const props = defineProps<{
    item: CommonMessageItem;
}>();

async function gotoLogistics() {
    doAction(props.item.appAction);
    await clickAlready({
        messageId: props.item.messageId
    });
    emits('already');
}

const icon = computed(() => {
    return (
        CDN_BASE_URL +
        (props.item.messageCategory === MessageType.Logistics
            ? '/mp-cs/images/ucenter/message-icon.png'
            : '/mp-cs/images/ucenter/nofity-icon.png')
    );
});

const date = computed(() => {
    return dayjs(props.item.messageTime).format('YYYY/MM/DD');
});
</script>

<template>
    <view class="wrapper">
        <view
            class="message-item"
            @tap="gotoLogistics"
        >
            <view class="message-item-body">
                <image :src="icon" />
                <text
                    :class="{
                        'message-item-body-title': true,
                        read: item.status === MessageStatus.Click
                    }"
                >
                    {{ props.item.messageTitle }}
                </text>
            </view>
            <text class="message-item-footer">{{ date }}</text>
        </view>
    </view>
</template>

<style scoped lang="scss">
.wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
}

.message-item {
    display: flex;
    width: 710rpx;
    min-height: 172rpx;
    margin-top: 20rpx;
    padding: 24rpx 20rpx;
    border-radius: 12rpx;
    color: $uni-text-color-placeholder;
    font-size: 24rpx;
    font-weight: 400;
    background: #ffffff;
    box-sizing: border-box;
    flex-direction: column;
    gap: 12rpx;
    line-height: 24rpx;

    &-body {
        display: flex;
        align-items: flex-start;
        color: $uni-text-color;
        font-size: 26rpx;
        font-weight: 400;
        line-height: 40rpx;
        gap: 20rpx;

        > image {
            flex-shrink: 0;
            width: 88rpx;
            height: 88rpx;
        }

        &-title {
            word-break: break-all;
        }

        .read {
            color: $uni-text-color-placeholder;
        }
    }

    &-footer {
        margin-left: 108rpx;
    }
}
</style>
