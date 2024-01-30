<script setup lang="ts">
import type { ICategory, ISearchList, ITimeList } from '@/api/activity/discount-area/types';

import { getTimerOut, getTimeStatus, spliderStyle, timeOutStyle } from '../constants';
import category from './category.vue';
import categoryDialog from './category-dialog.vue';
import timeOut from './time-out.vue';

const props = defineProps<{
    categoryList: ICategory[];
    timeList: ITimeList[];
    background?: string;
    activityEndTime: number;
    activityStartTime: number;
    currentCategoryIndex: number;
    searchList?: ISearchList[];
}>();
const statusBarHeight: number | undefined = uni.getSystemInfoSync().statusBarHeight || 0;

const headerHeight = statusBarHeight + uni.upx2px(88);
const sortTop = statusBarHeight + uni.upx2px(270);
const timeEnd = (time: any) => {
    setTimeout(() => {
        emit('onRefresh');
    }, 1000);
};
const scrollLeft = ref(0);

const timeIndex = ref(0);
const categoryPop = ref();
const categoryId = ref('');
const categoryIndex = ref(0);
categoryId.value = props?.categoryList[categoryIndex.value]?.categoryId || '';
const getSortBg = computed(() => {
    if (props.timeList?.length === 2) {
        if (timeIndex.value === 0) {
            return 'https://cdn.zsdx.cn/mp-cs/images/activity/discount-area/step-2-left.png';
        } else {
            return 'https://cdn.zsdx.cn/mp-cs/images/activity/discount-area/step-2-right.png';
        }
    } else if (props.timeList?.length === 3) {
        if (timeIndex.value === 0) {
            return 'https://cdn.zsdx.cn/mp-cs/images/activity/discount-area/step-3-left.png';
        } else if (timeIndex.value === 1) {
            return 'https://cdn.zsdx.cn/mp-cs/images/activity/discount-area/step-3-center.png';
        } else {
            return 'https://cdn.zsdx.cn/mp-cs/images/activity/discount-area/step-3-right.png';
        }
    }
    return '';
});

const changeCategory = (cate: ICategory, index: number) => {
    props.categoryList &&
        props.categoryList.forEach((item: ICategory) => {
            item.isActive = false;
        });
    categoryIndex.value = cate.index || 0;

    scrollLeft.value = cate.index ? cate.index * 40 : 0;
    cate.isActive = true;
    categoryId.value = cate.categoryId;

    props.searchList?.forEach((item, index) => {
        item.isActive = index ? false : true;
    });
    emit('changeList', {
        categoryIndex: categoryIndex.value,
        categoryId: cate.categoryId,
        timeId: (props.timeList && props.timeList[timeIndex.value]?.timeId) || '',
        status: props.timeList[timeIndex.value].activityStatus,
        reload: false,
        startLimitPrice: (props?.searchList?.length && props.searchList[0]?.startLimitPrice) || 0,
        endLimitPrice: (props?.searchList?.length && props.searchList[0]?.endLimitPrice) || 99999
    });
};

const changeTime = (index: number) => {
    timeIndex.value = index;

    emit('changeList', {
        categoryId: categoryId.value,
        categoryIndex: categoryIndex.value,
        timeId: (props.timeList && props.timeList[timeIndex.value]?.timeId) || '',
        reload: true,
        date: props.timeList[index].date,
        status: props.timeList[index].activityStatus
    });
};

const getTimeOut = (expireTime: number) => {
    const date = new Date().getTime();
    const endTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime() + expireTime * 1000;

    return endTime > date ? Math.floor((endTime - date) / 1000) : 0;
};

const changeSearchList = (item: ISearchList) => {
    emit('changeList', {
        categoryIndex: categoryIndex.value,
        categoryId: categoryId.value,
        timeId: (props.timeList && props.timeList[timeIndex.value]?.timeId) || '',
        status: props.timeList[timeIndex.value].activityStatus,
        ...item
    });
};

const showCategoryDialog = () => {
    emit('goTop');
    setTimeout(() => {
        categoryPop.value.fnShow();
    }, 300);
};

const getActivityText = () => {
    let date = new Date().getTime();
    if (date < props.activityStartTime) {
        return '活动未开始';
    } else {
        return '活动已结束';
    }
};

watch(
    () => props.currentCategoryIndex,
    val => {
        scrollLeft.value = val > -1 ? val * 40 : 0;
    }
);

const emit = defineEmits(['goTop', 'changeList', 'onRefresh']);
</script>

<template>
    <mp-sticky
        :offset-top="headerHeight"
        :z-index="9"
    >
        <view
            class="sort-bar"
            :style="{
                background: props.background,
                height: props?.searchList?.length ? '264rpx' : '188rpx'
            }"
        >
            <view class="sort-bar-bg-mask"></view>

            <image
                class="sort-bar-bg"
                :src="getSortBg"
                mode="scaleToFill"
            />
            <view
                v-for="(time, index) in props.timeList"
                :key="index"
                class="time-warp"
                @tap.prevent="changeTime(index)"
            >
                <view
                    v-if="props.timeList?.length === 1"
                    class="step"
                >
                    <view class="step-one">
                        <view
                            class="step-text mr20"
                            :style="{
                                color: index === timeIndex ? props.background : '#ffffff',
                                fontSize: '28rpx'
                            }"
                        >
                            {{ getTimeStatus(time) }}</view
                        >
                        <zd-timer-out
                            v-if="time.activityStatus > 1"
                            :time="
                                getTimerOut(
                                    time.activityStatus === 1 ? time.startTime : time.endTime,
                                    props.activityEndTime
                                )
                            "
                            :splider-style="{
                                ...spliderStyle,
                                color: index === timeIndex ? props.background : '#ffffff'
                            }"
                            :unit-style="{
                                ...timeOutStyle,
                                background: props.background
                            }"
                            :show-second="true"
                            :unit-type="1"
                            zero
                            :bebas-neueregular="true"
                            @time-end="timeEnd(time)"
                        ></zd-timer-out>
                    </view>
                </view>

                <view
                    v-else
                    class="step"
                >
                    <view class="step-head">
                        <zd-timer-out
                            v-if="time.activityStatus > 1"
                            :time="getTimerOut(time.endTime, props.activityEndTime)"
                            :splider-style="{
                                ...spliderStyle,
                                color: index === timeIndex ? props.background : '#ffffff'
                            }"
                            :unit-style="{
                                ...timeOutStyle,
                                background: props.background
                            }"
                            :show-second="true"
                            :unit-type="1"
                            zero
                            :bebas-neueregular="true"
                            @time-end="timeEnd(time)"
                        ></zd-timer-out>
                        <time-out
                            v-else
                            :color="index === timeIndex ? props.background : '#ffffff'"
                            :start-time="time.startTime"
                            :time="getTimeOut(time.startTime)"
                            @time-end="timeEnd(time)"
                        >
                        </time-out>
                        <view
                            class="step-text mt8"
                            :style="{
                                color: index === timeIndex ? props.background : '#ffffff'
                            }"
                        >
                            {{ getTimeStatus(time) }}</view
                        >
                    </view>
                </view>
            </view>
            <view
                v-if="props.timeList.length < 1"
                class="time-warp"
            >
                <view class="step">
                    <view class="step-one">
                        <view
                            class="step-text mr20"
                            :style="{
                                color: props.background || '#333333',
                                fontSize: '28rpx'
                            }"
                            >{{ getActivityText() }}</view
                        >
                    </view>
                </view>
            </view>
            <category
                v-if="props.timeList?.length"
                class="category"
                :category-list="props.categoryList"
                :scroll-left="scrollLeft"
                :color="props.background"
                :current-category-index="currentCategoryIndex"
                :search-list="props.searchList"
                @change-category="changeCategory"
                @show-category-dialog="showCategoryDialog"
                @change-search-list="changeSearchList"
            />
            <view
                v-else
                class="category-set"
            ></view>
            <category-dialog
                ref="categoryPop"
                :color="props.background"
                :header-height="sortTop"
                :category-list="props.categoryList"
                @change-category="changeCategory"
            ></category-dialog>
        </view>
    </mp-sticky>
</template>

<style lang="scss" scoped>
.sort-bar {
    display: flex;
    width: 750rpx;

    box-sizing: border-box;
}
.sort-bar-bg-mask {
    position: absolute;
    top: 8rpx;
    left: 0;
    width: 750rpx;
    height: 94rpx;
    border-radius: 20rpx 20rpx 0 0;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 8rpx rgba(0, 0, 0, 1) inset;
}
.sort-bar-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 750rpx;
    height: 190rpx;
}
.time-warp {
    position: relative;
    height: 102rpx;
    flex: 1;
    background: transparent;
}
.step {
    flex: 1;
    display: flex;
    align-items: center;
    height: 102rpx;
    border-radius: 16rpx 16rpx 0 0;
    flex-direction: column;
    .step-one {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 750rpx;
        height: 102rpx;
        border-radius: 16rpx 16rpx 0 0;
        background: #f5f8fa;
    }
    .step-head {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 102rpx;
        flex: 1;
    }
    .step-text {
        color: #ffffff;
        font-size: 20rpx;
        font-weight: 500;
        line-height: 20rpx;
    }
    .start-time {
        color: #ffffff;
        font-size: 40rpx;
        line-height: 40rpx;
        letter-spacing: 1px;
    }
}
.mr20 {
    margin-right: 20rpx;
}
.mt8 {
    margin-top: 8rpx;
}
.category {
    position: absolute;
    bottom: 0;
    left: 0;
}
.category-set {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 750rpx;
    height: 88rpx;
    background: #f5f8f5;
}
</style>
