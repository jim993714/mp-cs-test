<script setup lang="ts">
import type { ICategory } from '@/api/activity/combination-package/types';

const pageHeight = ref(0);

const props = defineProps<{
    headerHeight: number;
    categoryList?: ICategory[];
    color?: string;
}>();
const show = ref(false);

onMounted(() => {
    pageHeight.value = uni.getWindowInfo().windowHeight || 0;
});

const fnStop = (e: any) => {
    e && e.stopPropagation();
};

const fnShow = () => {
    show.value = true;
};
const fnClose = () => {
    show.value = false;
    emit('close');
};

const changeCategory = (item: ICategory, index: number) => {
    item.index = index;
    fnClose();
    emit('changeCategory', item);
};

const emit = defineEmits(['close', 'changeCategory']);
defineExpose({
    fnShow
});
</script>

<template>
    <view
        class="dialog"
        :class="{ 'dialog-show': show }"
        :style="{
            height: pageHeight - props.headerHeight + 'px',
            marginTop: props.headerHeight + 'px'
        }"
        @touchmove.stop.prevent="fnStop"
    >
        <view
            class="mask"
            :style="{ height: pageHeight - props.headerHeight + 'px' }"
            @tap.prevent="fnClose"
        ></view>
        <view class="category-warp">
            <image
                class="category-warp-bg"
                src="https://cdn.zsdx.cn/mp-cs/images/activity/discount-area/category-bg.png"
                mode="scaleToFill"
            />
            <view class="category-head-title">分类</view>

            <view class="item-warp-box">
                <view class="item-warp">
                    <view
                        v-for="(item, index) in props.categoryList"
                        :key="index"
                        class="item"
                        :class="{ 'item-active': item.isActive }"
                        :style="{
                            marginRight: index % 2 === 0 ? '22rpx' : '0rpx',
                            color: item.isActive ? props.color : '#333333',
                            border: item.isActive ? `2rpx solid ${props.color}` : 'none'
                        }"
                        @tap.prevent="changeCategory(item, index)"
                        >{{ item.categoryName }}
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.dialog {
    position: fixed;
    top: 0;
    left: -999rpx;
    z-index: 99999;
    width: 750rpx;

    &-show {
        left: 0;
    }
    .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 750rpx;
        background: rgba(0, 0, 0, 0.6);
    }
    .category-warp {
        position: absolute;
        top: 0;
        right: 8rpx;
        width: 512rpx;
        padding: 50rpx 0 30rpx;
        border-radius: 32rpx;
        background: transparent;
        box-sizing: border-box;
        .category-head-title {
            position: absolute;
            top: 30rpx;
            left: 40rpx;
            z-index: 10;
            color: #292f33;
            font-size: 28rpx;
            font-weight: 500;
            line-height: 40rpx;
        }
        .item-warp-box {
            overflow-y: scroll;
            width: 512rpx;
            max-height: 595rpx;
            padding: 30rpx;
            border-radius: 0 0 32rpx 32rpx;
            background: #f5f8fa;
            box-sizing: border-box;
        }
        .item-warp {
            display: flex;
            align-items: center;
            margin: 20rpx 0 20rpx;
            flex-wrap: wrap;

            .item {
                width: 210rpx;
                height: 68rpx;
                margin: 0 20rpx 20rpx 0;
                border-radius: 34rpx;
                text-align: center;
                color: #292f33;
                font-size: 28rpx;
                font-weight: 400;
                background: #ffffff;
                box-sizing: border-box;
                line-height: 68rpx;
            }
        }
        .status-head-title {
            color: #292f33;
            font-size: 28rpx;
            font-weight: 500;
            line-height: 40rpx;
        }
    }
    .category-warp-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 512rpx;
        height: 98rpx;
    }
}
</style>
