<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { generateTrackSearchSession } from '@/utils/track/search';

const props = defineProps<{
    activityNo: string;
}>();
const searchSession = generateTrackSearchSession();
function goSearchPage() {
    router.push('search', {
        to: 'pkZoneSearchResult',
        cacheKey: 'pkZoneSearchResult',
        activityNo: props.activityNo,
        __trackSearchSession: searchSession
    });
}
</script>

<template>
    <view class="page-header">
        <zd-navbar
            class="navbar"
            background="transparent"
            icon-color="#fff"
            left-width="custom"
        >
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
                    <zd-icon
                        class="search-icon"
                        type="zdmp-sousuo1"
                        :size="36"
                    />
                    <text class="search-text">搜索</text>
                </view>
            </track-view>
        </zd-navbar>
    </view>
</template>

<style lang="scss" scoped>
.page-header {
    .navbar {
        .search-bar {
            display: flex;
            align-items: center;
            width: 460rpx;
            height: 60rpx;
            margin-right: 20rpx;
            padding: 0 30rpx;
            border-radius: 30rpx;
            color: #999999;
            font-size: 28rpx;
            font-weight: 400;
            background: #ffffff;
            gap: 10rpx;
            line-height: 28rpx;

            .search-icon {
                color: #f77234;
            }
        }
    }
}
</style>
