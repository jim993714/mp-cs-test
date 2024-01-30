<script setup lang="ts">
import type { ChatMessageType, MessageItem } from '@/api/message/types';

const props = defineProps<{
    item: MessageItem & { msgType: ChatMessageType.Emoji };
}>();
</script>

<template>
    <image
        class="chat-item-emoji"
        :src="item?.msgContent.url"
        :style="{
            width: item?.msgContent.w + 'px'
        }"
        mode="widthFix"
    />
</template>

<style scoped lang="scss">
.chat-item-emoji {
    display: block;
    max-width: 320rpx;
}
</style>
