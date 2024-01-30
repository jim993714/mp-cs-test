<script setup lang="ts">
import { getFile } from '@/api/common';
import type { ChatMessageType, MessageItem } from '@/api/message/types';

const props = defineProps<{
    item: MessageItem & { msgType: ChatMessageType.Video };
}>();

async function previewVideo() {
    const url = await getFile(props.item.msgContent.path);
    uni.previewMedia({
        sources: [
            {
                url,
                poster: props.item.msgContent.cover,
                type: 'video'
            }
        ]
    });
}

const time = computed(() => {
    let _duration = ~~props.item.msgContent.duration;

    let m: number | string = 0;
    let s: number | string = _duration;
    if (_duration > 60) {
        m = ~~(props.item.msgContent.duration / 60);
        s = _duration - m * 60;
    }

    if (m < 10) {
        m = `0${m}`;
    }
    if (s < 10) {
        s = `0${s}`;
    }

    return `${m}:${s}`;
});
</script>

<template>
    <view class="chat-item-video">
        <image
            :src="item?.msgContent.cover"
            :style="{
                width: item?.msgContent.w + 'px'
            }"
        />
        <text class="chat-item-video-time">
            {{ time }}
        </text>
        <view
            class="chat-item-video-icon"
            @tap="previewVideo"
        >
            <zd-icon
                type="zdmp-bofang"
                :size="60"
            />
        </view>
    </view>
</template>

<style scoped lang="scss">
.chat-item-video {
    position: relative;

    > image {
        display: block;
        max-width: 320rpx;
    }

    &-time {
        position: absolute;
        right: 12rpx;
        bottom: 12rpx;
        color: #fff;
        font-size: 24rpx;
        font-weight: 400;
        text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
        line-height: 24rpx;
    }

    &-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 60rpx;
        height: 60rpx;
        transform: translate(-50%, -50%);
    }
}
</style>
