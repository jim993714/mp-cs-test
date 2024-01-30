<script setup lang="ts">
import type { ICategory, IStatus } from '@/api/activity/combination-package/types';

const pageHeight = ref(0);

const props = defineProps<{
    headerHeight: number;
    activityStatus: number;
}>();
const currentCategory = ref<ICategory>();
const currentStatus = ref<IStatus>();
const show = ref(false);
const category = ref<ICategory[]>();
const statusList = ref<IStatus[]>([
    {
        label: '进行中',
        status: 2,
        isActive: false
    },
    {
        label: '未开始',
        status: 1,
        isActive: false
    }
]);
onMounted(() => {
    pageHeight.value = uni.getWindowInfo().windowHeight || 0;
});

const fnStop = (e: any) => {
    e && e.stopPropagation();
};

const fnShow = (list: string) => {
    show.value = true;
    category.value = JSON.parse(list);
};
const fnClose = () => {
    show.value = false;
    emit('close');
};

const cancel = () => {
    fnClose();
    console.log('cancel');
};
const confirm = () => {
    fnClose();

    emit('confirm', {
        currentCategory: currentCategory.value,
        currentStatus: currentStatus.value
    });
};
const changeCategory = (item: ICategory, index: number) => {
    item.index = index;
    category.value?.forEach((_item: ICategory) => (_item.isActive = false));
    item.isActive = true;
    currentCategory.value = item;
};
const checkStatus = (item: IStatus) => {
    statusList.value.forEach(_item => (_item.isActive = false));
    item.isActive = true;
    currentStatus.value = item;
};
const emit = defineEmits(['close', 'confirm']);

watch(
    () => props.activityStatus,
    () => {
        statusList.value.forEach((item: IStatus) => {
            item.isActive = item.status === props.activityStatus;
        });
    },
    {
        immediate: true
    }
);
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
            <view class="category-head-title">分类</view>
            <view class="item-warp">
                <view
                    v-for="(item, index) in category"
                    :key="index"
                    class="item"
                    :class="{ 'item-active': item.isActive }"
                    @tap.prevent="changeCategory(item, index)"
                    >{{ item.categoryName }}</view
                >
            </view>
            <view class="status-head-title">状态</view>
            <view class="item-warp">
                <view
                    v-for="(item, index) in statusList"
                    :key="index"
                    class="item"
                    :class="{ 'item-active': item.isActive }"
                    @tap.prevent="checkStatus(item)"
                    >{{ item.label }}</view
                >
            </view>
            <view class="btn">
                <view
                    class="cancel"
                    @tap.prevent="cancel"
                    >取消</view
                >
                <view
                    class="confirm"
                    @tap.prevent="confirm"
                    >确认</view
                >
            </view>
            <view style="height: 120rpx"></view>
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
        position: relative;
        width: 750rpx;
        min-height: 542rpx;
        padding: 20rpx 20rpx 0;
        background: #ffffff;
        box-sizing: border-box;
        .category-head-title {
            color: #292f33;
            font-size: 28rpx;
            font-weight: 500;
            line-height: 40rpx;
        }
        .item-warp {
            display: flex;
            align-items: center;
            margin: 20rpx 0 20rpx;
            flex-wrap: wrap;

            .item {
                margin: 0 20rpx 20rpx 0;
                padding: 16rpx 24rpx;
                border-radius: 30rpx;
                color: #292f33;
                font-size: 28rpx;
                font-weight: 400;
                background: #f5f8fa;
                line-height: 28rpx;
                &-active {
                    color: #ff4734;
                    background: rgba(255, 71, 52, 0.1);
                }
            }
        }
        .status-head-title {
            color: #292f33;
            font-size: 28rpx;
            font-weight: 500;
            line-height: 40rpx;
        }
    }
    .btn {
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 750rpx;
        height: 120rpx;
        padding: 20rpx 40rpx;
        border-top: 2rpx solid #edf0f2;
        background: #ffffff;
        box-sizing: border-box;
        .cancel,
        .confirm {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 320rpx;
            height: 80rpx;
            border-radius: 46rpx;
            font-size: 32rpx;
            font-weight: 500;
            line-height: 32rpx;
        }
        .cancel {
            border: 2rpx solid #8a9399;
            color: #8a9399;
            opacity: 0.5;
        }
        .confirm {
            color: #ffffff;
            background: #ff4734;
        }
    }
}
</style>
