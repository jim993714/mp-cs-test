<script setup lang="ts">
import type { ChatMessageType, MessageItem } from '@/api/message/types';

const props = defineProps<{
    item: MessageItem & { msgType: ChatMessageType.Image };
}>();

function previewImage() {
    uni.previewImage({
        current: props.item.msgContent.url,
        urls: [props.item.msgContent.url]
    });
}
</script>

<template>
    <image
        class="chat-item-image"
        :src="item?.msgContent.url"
        :style="{
            width: item?.msgContent.w + 'px'
        }"
        mode="widthFix"
        @tap="previewImage"
    />
</template>

<style scoped lang="scss">
.chat-item-image {
    display: block;
    max-width: 320rpx;
}
</style>
