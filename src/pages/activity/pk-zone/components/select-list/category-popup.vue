<script setup lang="ts">
import { useVModel } from '@vueuse/core';

import type { Category } from '@/api/activity/pk-zone/types';

const props = defineProps<{
    modelValue?: string;
    list: Category[];
}>();
const emit = defineEmits<{
    (event: 'update:modelValue', value: string): void;
    (event: 'tab-click', value: string): void;
}>();
const activeCategory = useVModel(props, 'modelValue', emit);
const visible = ref(false);
const fixTop = ref(0);

function show(top: number) {
    fixTop.value = top;
    visible.value = true;
}

function hide() {
    visible.value = false;
}

function onSelect(categoryId: string) {
    activeCategory.value = categoryId;
    emit('tab-click', categoryId);
    hide();
}

defineExpose({
    show,
    hide
});
</script>

<template>
    <view
        v-if="visible"
        class="category-popup"
    >
        <view
            class="mask"
            @tap="hide"
        />

        <view
            class="container"
            :style="{ top: `${fixTop + 30}px` }"
        >
            <view class="arrow" />
            <view class="header">分类</view>
            <scroll-view
                scroll-y
                enhanced
                :show-scrollbar="false"
                style="height: 400rpx"
            >
                <view class="category-list">
                    <view
                        v-for="item in props.list"
                        :id="item.categoryId"
                        :key="item.categoryId"
                        class="category-item"
                        :class="{ active: activeCategory === item.categoryId }"
                        @click="onSelect(item.categoryId)"
                    >
                        {{ item.categoryName }}
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.category-popup {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1100;
    width: 100%;
    height: 100%;

    .mask {
        width: 750rpx;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        flex: 1;
    }

    .container {
        position: absolute;
        right: 20rpx;
        width: 500rpx;
        height: 500rpx;
        padding: 20rpx;
        border-radius: 20rpx;
        background-color: #f5f5f5;
        box-sizing: border-box;

        .arrow {
            position: absolute;
            top: -32rpx;
            right: 12rpx;
            width: 0;
            height: 0;
            border-top: 16rpx solid rgba(0, 0, 0, 0);
            border-right: 16rpx solid rgba(0, 0, 0, 0);
            border-bottom: 16rpx solid #f5f5f5;
            border-left: 16rpx solid rgba(0, 0, 0, 0);
        }
    }
    .header {
        font-size: 32rpx;
    }

    .category-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 20rpx;
        padding-top: 20rpx;

        .category-item {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 56rpx;
            padding: 0 40rpx;
            border: 1px solid #fff;
            border-radius: 68rpx;
            color: #666666;
            font-size: 24rpx;
            font-weight: 400;
            background: #ffffff;
            line-height: 28rpx;

            &.active {
                border: 2rpx solid rgba(248, 45, 73, 0.8);
                background: rgba(248, 45, 73, 0.1);
            }
        }
    }
}
</style>
