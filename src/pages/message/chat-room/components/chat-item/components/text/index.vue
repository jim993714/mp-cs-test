<script setup lang="ts">
import { ChatMessageType, type MessageItem } from '@/api/message/types';
import { emojiUrl, parseEmoji, type TextNodes, TextNodeType } from '@/pages/message/utils';

const props = defineProps<{
    item: MessageItem & {
        msgType: ChatMessageType.Text | ChatMessageType.Remark | ChatMessageType.Queue;
    };
}>();

const textNodes = ref<TextNodes>([]);

function cancelQueue() {
    uni.$emit('cancelQueue');
}

function remark() {
    uni.$emit('remark');
}

watch(
    () => props.item,
    async () => {
        if (props.item.msgContent) {
            const data = await parseEmoji(props.item.msgContent.text);
            textNodes.value = data;
        }
    },
    {
        immediate: true
    }
);
</script>

<template>
    <view class="chat-item-text">
        <template
            v-for="(node, i) in textNodes"
            :key="i"
        >
            <view
                v-if="node.type === TextNodeType.Text"
                class="chat-item-text-content"
                >{{ node.content }}</view
            >
            <view
                v-if="node.type === TextNodeType.Emoji"
                class="chat-item-text__emoji"
            >
                <view
                    :style="{
                        'background-image': `url(${emojiUrl})`,
                        'transform-origin': '0 0',
                        transform: 'scale(0.375)'
                    }"
                    :class="node.imageClass"
                />
            </view>
        </template>
        <view
            v-if="item.msgType === ChatMessageType.Queue"
            class="chat-item-text__operation"
            @tap="cancelQueue"
            >取消排队</view
        >
        <view
            v-else-if="item.msgType === ChatMessageType.Remark"
            class="chat-item-text__operation"
            @tap="remark"
            >评价</view
        >
    </view>
</template>

<style scoped lang="scss">
.chat-item-text {
    display: inline-block;
    text-align: left;
    word-break: break-all;

    &-content {
        display: inline;
        color: $uni-color-title;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 48rpx;
        vertical-align: super;
    }

    &__emoji {
        display: inline-block;
        overflow: hidden;
        width: 48rpx;
        height: 48rpx;
    }

    &__operation {
        width: 390rpx;
        height: 52rpx;
        margin-top: 20rpx;
        border: 2rpx solid $zd-main-color;
        border-radius: 8rpx;
        text-align: center;
        color: $zd-main-color;
        font-size: 24rpx;
        font-weight: 400;
        background: #fff;
        line-height: 52rpx;
    }
}
</style>
