<script setup lang="ts">
import { router } from '@/utils/router/useRouter';
import { generateTrackSearchSession } from '@/utils/track/search';

const props = defineProps<{
    activityNo: string;
}>();
const searchSession = generateTrackSearchSession();

function toSearch() {
    router.push('search', {
        to: 'searchResult',
        from: 'NewYearShop',
        activityNo: props.activityNo,
        __trackSearchSession: searchSession
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
            class="search-bar-wrapper"
            @tap="toSearch"
        >
            <zd-icon
                type="zdmp-sousuo1"
                :size="42"
                color="#8C959B"
            ></zd-icon>
        </view>
    </track-view>
</template>

<style scoped lang="scss">
.search-bar-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 452rpx;
    height: 64rpx;
    padding-right: 4rpx;
    padding-left: 24rpx;
    border-radius: 34rpx;
    background-color: #fff;
    box-sizing: border-box;
    flex-direction: row;
}
</style>
