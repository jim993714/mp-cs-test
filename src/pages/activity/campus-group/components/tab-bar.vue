<script setup lang="ts">
import { tabList } from '../constants';
import type { ITab } from '../type';

const props = defineProps<{
    tabIndex: number;
}>();

const initTab = () => {
    tabList.value.forEach(item => {
        item.isActive = false;
    });

    tabList.value[props.tabIndex].isActive = true;
};

initTab();

const changeTab = (item: ITab, index: number) => {
    tabList.value.forEach(item => {
        item.isActive = false;
    });
    item.isActive = true;

    emit('changeTab', item, index);
};

const emit = defineEmits(['changeTab']);
</script>

<template>
    <view class="tab-bar-warp">
        <view class="tab-bar">
            <view
                v-for="(item, index) in tabList"
                :key="item.value"
                :class="{ 'tab-item': true, 'is-active': item.isActive }"
                @tap.prevent="changeTab(item, index)"
            >
                {{ item.label }}
            </view>
        </view>
    </view>
</template>
<style lang="scss" scoped>
.tab-bar-warp {
    display: flex;
    justify-content: center;
    width: 750rpx;
    flex-direction: row;
}
.tab-bar {
    z-index: 9999;
    display: flex;
    align-items: center;
    width: 710rpx;
    height: 80rpx;
    padding: 10rpx;
    border-radius: 20rpx;
    background: #edf0f2;
    box-sizing: border-box;
}
.tab-item {
    height: 60rpx;
    border-radius: 12rpx;
    text-align: center;
    color: #576066;
    font-size: 28rpx;
    font-weight: 700;
    background: transparent;
    flex: 1;
    line-height: 60rpx;
}
.is-active {
    color: #292f33;
    font-size: 28rpx;
    font-weight: 700;
    background: linear-gradient(180deg, #ffffff 0%, #ffffff 100%);
}
</style>
