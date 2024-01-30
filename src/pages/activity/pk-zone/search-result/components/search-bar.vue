<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { generateTrackSearchSession } from '@/utils/track/search';

const props = defineProps<{
    keywords: string;
    activityNo: string;
}>();
const searchSession = generateTrackSearchSession();

function goSearchPage() {
    router.redirect('search', {
        to: 'pkZoneSearchResult',
        cacheKey: 'pkZoneSearchResult',
        keyword: props.keywords,
        activityNo: props.activityNo
    });
}
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
            class="search-bar"
            @tap="goSearchPage"
        >
            <view class="search-text ellipsis">{{ props.keywords || '搜索' }}</view>
            <view class="search-btn">搜索</view>
        </view>
    </track-view>
</template>

<style lang="scss" scoped>
.search-bar {
    display: flex;
    align-items: center;
    width: 456rpx;
    height: 64rpx;
    margin-right: 20rpx;
    padding: 0 8rpx 0 24rpx;
    border-radius: 30rpx;
    background: #f5f8fa;
    box-sizing: border-box;

    .search-text {
        flex: 1;
        color: $uni-text-color-placeholder;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 24rpx;
    }

    .search-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 88rpx;
        height: 48rpx;
        border-radius: 24rpx;
        color: #ffffff;
        font-size: 24rpx;
        font-weight: 400;
        background: $zd-main-color;
        line-height: 20rpx;
    }
}
</style>
