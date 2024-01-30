<script setup lang="ts">
import { useVModel } from '@vueuse/core';

import { CDN_BASE_URL } from '@/base/constants';

const props = defineProps<{
    modelValue: number;
    isTop: boolean;
}>();
const emit = defineEmits(['update:modelValue']);

const activeTab = useVModel(props, 'modelValue', emit);
</script>

<template>
    <view
        class="page-tab"
        :style="{
            background: props.isTop ? '#ffb069' : '',
            borderRadius: props.isTop ? 0 : '30rpx 30rpx 0 0'
        }"
    >
        <image
            class="tab-bg"
            :src="`${CDN_BASE_URL}/mp-cs/images/activity/pk-zone/tab-bg.png`"
            mode="widthFix"
            :style="{
                transform: `rotateY(${activeTab === 1 ? 0 : 180}deg)`
            }"
        />
        <view
            class="tab-item tab1"
            :class="{ active: activeTab === 1 }"
            @tap="activeTab = 1"
        >
            <view class="tab-item-inner">
                <image
                    class="tab-item-title"
                    :src="`${CDN_BASE_URL}/mp-cs/images/activity/pk-zone/hot-text${
                        activeTab === 1 ? '-active' : ''
                    }.png`"
                    mode="aspectFill"
                />
                <view class="tab-item-desc">企业热销排行榜</view>
            </view>
        </view>
        <view
            class="tab-item tab2"
            :class="{ active: activeTab === 2 }"
            @tap="activeTab = 2"
        >
            <view class="tab-item-inner">
                <image
                    class="tab-item-title"
                    :src="`${CDN_BASE_URL}/mp-cs/images/activity/pk-zone/jx-text${
                        activeTab === 2 ? '-active' : ''
                    }.png`"
                    mode="aspectFill"
                />
                <view class="tab-item-desc">千所高校 综合评选推荐</view>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.page-tab {
    display: flex;
    align-items: center;
    width: 750rpx;
    height: 150rpx;
    border-radius: 30rpx 30rpx 0 0;
    background-color: rgba(255, 255, 255, 0.38);

    .tab-item {
        position: relative;
        flex: 1;
        height: 100%;

        .tab-item-inner {
            position: absolute;
            top: 12rpx;
            display: flex;
            flex-direction: column;
            gap: 10rpx;
        }
        &.tab1 {
            .tab-item-inner {
                left: 40rpx;
            }

            .tab-item-desc {
                margin-left: 8rpx;
            }
        }

        &.tab2 {
            .tab-item-inner {
                right: 48rpx;
                align-items: flex-end;
            }
        }

        &-title {
            width: 200rpx;
            height: 56rpx;
        }

        &-desc {
            color: #fff;
            font-size: 24rpx;
            font-weight: 400;
            line-height: 34rpx;
        }

        &.active {
            .tab-item-desc {
                color: #999999;
            }
        }
    }

    .tab-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 750rpx;
    }
}
</style>
