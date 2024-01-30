<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { ITimeList } from '@/api/activity/discount-area/types';
import { generateTrackSearchSession } from '@/utils/track/search';

const props = defineProps<{
    background?: string;
    activityNo: string;
    timeList: ITimeList[];
    init: boolean;
}>();
const searchSession = generateTrackSearchSession();

const goTo = () => {
    if (!props.init) return;
    let timeId = props.timeList.map(item => item.timeId).join(',');

    router.push('search', {
        activityNo: props.activityNo,
        __trackSearchSession: searchSession,
        from: 'goodsDetailDiscount',
        discountAreaTimeId: timeId
    });
};
</script>

<template>
    <track-view
        :track-data="{
            type: 'click',
            eventData: {
                path: 'bi_search',
                search_session: searchSession
            },
            clickData: {
                action: 1
            }
        }"
    >
        <view
            class="search-warp"
            :style="{ background: props.background }"
            @tap="goTo"
        >
            <view class="input-box">
                <view class="search-left-text">搜索商品</view>
                <view
                    class="search-text"
                    :style="{ background: props.background }"
                    >搜索</view
                >
            </view>
        </view>
    </track-view>
</template>

<style lang="scss" scoped>
.search-warp {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 750rpx;
    height: 88rpx;
    .input-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 710rpx;
        height: 64rpx;
        border-radius: 34rpx;
        background: #ffffff;
        .search-left-text {
            padding-left: 30rpx;
            color: #8a9399;
            font-size: 28rpx;
            line-height: 56rpx;
            font-weight: 400;
        }
        .search-text {
            width: 112rpx;
            height: 56rpx;
            margin-right: 4rpx;
            border-radius: 28rpx;
            text-align: center;
            color: #ffffff;
            font-size: 24rpx;
            font-weight: 400;
            line-height: 56rpx;
        }
    }
}
</style>
