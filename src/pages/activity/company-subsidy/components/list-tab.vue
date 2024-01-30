<script setup lang="ts">
import type { ICategoryList, IZoneList } from '@/api/activity/company-subsidy/types';

const props = defineProps<{
    tabList?: IZoneList[];
    categoryList?: ICategoryList[];
    categoryIndex: number;
    isRadius: boolean;
}>();

const scrollLeft = ref(0);
const tabIndex = ref(0);
const changeTab = (item: any, index: number) => {
    props.tabList?.forEach(item => (item.isActive = false));
    tabIndex.value = index;
    item.isActive = true;
    emit('changeTab', item, index);
};
const changeCategory = (item: any, index: number) => {
    scrollLeft.value = index * 40;
    emit('changeCategory', item, index);
};

const resetScrollLeft = () => {
    scrollLeft.value = 0;
};

const emit = defineEmits(['changeTab', 'changeCategory']);

defineExpose({
    resetScrollLeft
});
</script>

<template>
    <view
        class="sort-bar"
        :class="{ 'border-radius': props.isRadius }"
    >
        <view class="tab-warp">
            <view
                v-for="(item, index) in tabList"
                :key="index"
                class="tab-item"
                @tap.prevent="changeTab(item, index)"
            >
                <view
                    class="tab-item-label"
                    :class="{ 'tab-active': item.isActive }"
                    >{{ item.title }}</view
                >
                <image
                    v-if="item.isActive"
                    class="tab-item-line"
                    src="https://cdn.zsdx.cn/mp-cs/images/activity/company-subsidy/tab-line.png"
                    mode="scaleToFill"
                />
            </view>
        </view>
        <view class="category-warp">
            <scroll-view
                :show-scrollbar="false"
                class="scroll-view"
                :scroll-left="scrollLeft"
                :scroll-with-animation="true"
                :enable-flex="true"
                scroll-x
            >
                <view
                    v-for="(item, cIndex) in categoryList"
                    :id="'tabItem' + cIndex"
                    :key="cIndex"
                    :class="{
                        'category-item': true,
                        'category-item-active': props.categoryIndex == cIndex
                    }"
                    @tap.stop.prevent="changeCategory(item, cIndex)"
                >
                    {{ item.categoryName }}
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.sort-bar {
    width: 750rpx;
    height: 152rpx;
    padding-top: 20rpx;
    background: #f5f8fa;

    .tab-warp {
        display: flex;
        align-items: center;
        width: 750rpx;
        height: 72rpx;
        margin-bottom: 4rpx;
        padding: 0 20rpx;
        flex-direction: row;
        box-sizing: border-box;
        .tab-item {
            position: relative;
            display: flex;
            justify-content: center;
            width: 128rpx;
            height: 72rpx;
            margin-right: 20rpx;
        }
        .tab-item-label {
            margin-top: 14rpx;
            color: #8a9399;
            font-size: 28rpx;
            font-weight: 500;
            line-height: 28rpx;
        }
        .tab-active {
            color: #292f33;
            font-size: 32rpx;
            font-weight: 700;
            line-height: 32rpx;
        }
        .tab-item-line {
            position: absolute;
            top: 0;
            left: 0;
            width: 128rpx;
            height: 72rpx;
        }
    }
    .category-warp {
        position: relative;
        display: flex;
        align-items: center;
        width: 700rpx;
        padding: 0 20rpx;
    }
    .scroll-view {
        display: flex;
        height: 58rpx;
        flex-direction: row;
    }
    .category-item {
        display: flex;
        height: 54rpx;
        margin-right: 20rpx;
        padding: 0rpx 40rpx;
        border-radius: 68rpx;
        color: #666666;
        font-size: 24rpx;
        font-weight: 400;
        background: #ffffff;
        flex-shrink: 0;
        line-height: 54rpx;

        &-active {
            border: 2rpx solid rgba(248, 45, 73, 0.8);
            color: rgba(248, 45, 73, 1);
            background: #ffe6e9;
        }
    }
}
.border-radius {
    border-radius: 48rpx 48rpx 0 0;
}
</style>
