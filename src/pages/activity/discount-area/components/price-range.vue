<script setup lang="ts">
import type { ISearchList } from '@/api/activity/discount-area/types';

const props = defineProps<{
    color?: string;
    searchList?: ISearchList[];
}>();
let scrollLeft = ref(0);

const changeCategory = (item: any, index: number) => {
    scrollLeft.value = index * 40;
    props.searchList && props.searchList.forEach(_item => (_item.isActive = false));
    item.isActive = true;
    let params = {
        startLimitPrice: item.startLimitPrice,
        endLimitPrice: item.endLimitPrice
    };
    emits('changeSearchList', params);
};

const emits = defineEmits(['changeSearchList']);
</script>

<template>
    <view class="price-range-warp">
        <scroll-view
            scroll-x
            class="scroll-view"
            :show-scrollbar="false"
            :scroll-with-animation="true"
            :enable-flex="true"
            :scroll-left="scrollLeft"
        >
            <view
                v-for="(item, index) in props.searchList"
                :key="index + item.name"
                :class="{ 'cate-item': true, 'is-active': item.isActive }"
                :style="{
                    color: item.isActive ? props.color : '#666666',
                    borderColor: item.isActive ? props.color : ''
                }"
                @tap.prevent="changeCategory(item, index)"
            >
                <view
                    class="cate-item-name"
                    :style="{ color: item.isActive ? props.color : '' }"
                    >{{ item.name }}</view
                >
            </view>
        </scroll-view>
    </view>
</template>

<style lang="scss" scoped>
.price-range-warp {
    width: 750rpx;
    height: 76rpx;
}

.scroll-view {
    display: flex;
    width: 750rpx;
    height: 76rpx;
    flex-direction: row;
}

.cate-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 56rpx;
    margin-left: 20rpx;
    border-radius: 68rpx;
    background: #ffffff;
    flex-direction: column;
    box-sizing: border-box;
    flex-shrink: 0;
}

.cate-item-name {
    padding: 14rpx 40rpx;
    color: #666666;
    font-size: 24rpx;
    font-weight: 500;
    background: transparent;
    align-self: center;
    line-height: 24rpx;
    box-sizing: border-box;
}

.is-active {
    border: 2rpx solid;
    border-radius: 68rpx;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 28rpx;
}
</style>
