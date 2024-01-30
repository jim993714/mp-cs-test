<script lang="ts" setup>
import type { IGridList } from '@/api/home/types';

import type { IThemeConfig } from '../../type';
import gridOddLeft from './grid-odd-left.vue';
import gridSmall from './grid-small.vue';
import gridSubsidy from './grid-subsidy.vue';

const props = defineProps<{
    currentTheme: IThemeConfig;
    studentShopId: string;
    gridList: Array<IGridList>;
}>();

const trackData = {
    type: 'all',
    clientTop: uni.getWindowInfo().windowHeight / 2
};

const showGridOdd = computed(() => {
    return dataList.value.length % 2 > 0 && dataList.value.length > 1;
});
const dataList = ref<Array<IGridList>>([]);
const gridRightList = ref<Array<IGridList>>([]);
const gridBottomList = ref<Array<IGridList>>([]);
const fnGetGridList = () => {
    dataList.value = props.gridList;
    gridRightList.value = props.gridList.slice(1, 3);
    gridBottomList.value = props.gridList.slice(3, 5);
};

fnGetGridList();
</script>
<template>
    <view class="page-warp">
        <view
            v-if="showGridOdd"
            class="grid-odd"
        >
            <view class="grid-odd-top">
                <track-view
                    :track-data="{
                        ...trackData,
                        observerName: '.grid-big',
                        eventData: {
                            path: 'bi_event',
                            student_shop_id: props.studentShopId,
                            element_name: '首页活动坑位',
                            data_type: 'Banner',
                            data_id: dataList[0].appAction,
                            data_info: dataList[0]
                        }
                    }"
                >
                    <grid-subsidy
                        v-if="dataList[0].type == 1"
                        :theme="props.currentTheme"
                        :list="dataList[0]"
                    ></grid-subsidy>
                    <grid-odd-left
                        v-else
                        :student_shop_id="props.studentShopId"
                        :theme="props.currentTheme"
                        :list="dataList[0]"
                    ></grid-odd-left>
                </track-view>
                <grid-small
                    :student_shop_id="props.studentShopId"
                    :theme="props.currentTheme"
                    :list="gridRightList"
                ></grid-small>
            </view>
            <view
                v-if="dataList.length > 3"
                class="grid-odd-bottom"
            >
                <grid-small
                    :student_shop_id="studentShopId"
                    direction="row"
                    :theme="currentTheme"
                    :list="gridBottomList"
                ></grid-small>
            </view>
        </view>
        <view
            v-else
            class="grid-even"
        >
            <grid-small
                :student_shop_id="props.studentShopId"
                direction="row"
                :theme="props.currentTheme"
                :list="dataList"
            ></grid-small>
        </view>
    </view>
</template>
<style scoped lang="scss">
.page-warp {
    margin-top: 30rpx;
    background: #f5f8f5;
    box-sizing: border-box;
}

.grid-even {
    display: flex;
    justify-content: center;
    width: 750rpx;
    flex-direction: row;
    flex-wrap: wrap;
}

.grid-item {
    position: relative;
    width: 340rpx;
    height: 294rpx;
    margin: 0 0 20rpx 20rpx;
    padding: 24rpx 18rpx 0rpx;
    border-radius: 16rpx;
    box-sizing: border-box;
}

.grid-head {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
}

.grid-title {
    color: #1b1b1b;
    font-size: 30rpx;
    font-weight: 500;
    line-height: 30rpx;
}

.grid-subtitle {
    margin-left: 10rpx;
    color: #728aa2;
    font-size: 22rpx;
    font-weight: 400;
    line-height: 22rpx;
}

.grid-goods-warp {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 30rpx;
}

.grid-goods {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.grid-goods-cover {
    width: 132rpx;
    height: 132rpx;
    margin-bottom: 18rpx;
}

.grid-goods-price {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
}

.grid-goods-price-unit {
    color: #ff5000;
    font-size: 20rpx;
    font-weight: 400;
    line-height: 32rpx;
}

.grid-goods-price-num {
    color: #ff5000;
    font-size: 26rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    line-height: 36rpx;
}
.grid-odd {
    width: 750rpx;
}
.grid-odd-top {
    display: flex;
    height: 590rpx;
    padding: 0 20rpx;
    flex-direction: row;
    box-sizing: border-box;
}

.grid-odd-bottom {
    display: flex;
    justify-content: space-between;
    width: 750rpx;
    margin-top: 20rpx;
    padding: 0 20rpx;
    box-sizing: border-box;
    flex-direction: row;
}
</style>
