<script setup lang="ts">
import { useVModel } from '@vueuse/core';

import type { Category } from '@/api/activity/pk-zone/types';

import CategoryPopup from './category-popup.vue';

const props = defineProps<{
    modelValue?: string;
    list: Category[];
}>();
const emit = defineEmits<{
    (event: 'update:modelValue', value: string): void;
    (event: 'tab-click', value: string): void;
}>();
const categoryPopup = ref();
const activeCategory = useVModel(props, 'modelValue', emit);
const instance = getCurrentInstance();

function showAllCategory() {
    uni.createSelectorQuery()
        .in(instance)
        .select('.all-btn')
        .boundingClientRect((data: any) => {
            categoryPopup.value.show(data.top);
        })
        .exec();
}

function onTabClick(categoryId: string) {
    activeCategory.value = categoryId;
    emit('tab-click', categoryId);
}
</script>

<template>
    <view class="goods-category">
        <scroll-view
            class="scroll-view"
            scroll-x
            scroll-with-animation
            :show-scrollbar="false"
            :scroll-into-view="`tab-${activeCategory}`"
        >
            <view class="category-list">
                <view
                    v-for="item in props.list"
                    :id="`tab-${item.categoryId}`"
                    :key="item.categoryId"
                    class="category-item"
                    :class="{ active: activeCategory === item.categoryId }"
                    @click="onTabClick(item.categoryId)"
                >
                    {{ item.categoryName }}
                </view>

                <view class="empty-block" />
            </view>
        </scroll-view>

        <view
            class="all-btn"
            @tap="showAllCategory"
        >
            <view class="shadow" />
            <zd-icon
                type="zdmp-zhankai"
                :size="28"
            />
        </view>
    </view>

    <CategoryPopup
        ref="categoryPopup"
        v-model="activeCategory"
        :list="props.list"
        @tab-click="onTabClick"
    />
</template>

<style lang="scss" scoped>
.goods-category {
    position: relative;
    padding: 20rpx 0;
    background-color: #f5f5f5;
    .scroll-view {
        white-space: nowrap;
    }
    .category-list {
        display: flex;
        align-items: center;
        gap: 20rpx;

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

        .empty-block {
            height: 20rpx;
            padding: 0 40rpx;
        }
    }

    .all-btn {
        position: absolute;
        top: 50%;
        right: 0;
        display: flex;
        align-items: center;
        height: 100%;
        color: #afafaf;
        background-color: #f5f5f5;
        transform: translateY(-50%);

        .shadow {
            position: absolute;
            left: -40rpx;
            z-index: -1;
            width: 50rpx;
            height: 100%;
            background: linear-gradient(90deg, rgba(251, 251, 251, 0) 0%, #f5f5f5 100%);
        }
    }
}
</style>
