<script setup lang="ts">
import { getZoneConfig } from '@/api/activity/pk-zone';
import type { ZoneConfig } from '@/api/activity/pk-zone/types';
import { CDN_BASE_URL } from '@/base/constants';
import { useUserStore } from '@/stores/user';

import HotList from './components/hot-list/index.vue';
import PageHeader from './components/page-header.vue';
import PageTab from './components/page-tab.vue';
import SelectList from './components/select-list/index.vue';

const userStore = useUserStore();

const navBarHeight = (uni.getSystemInfoSync().statusBarHeight || 0) + uni.upx2px(88);
const activeTab = ref(1);
const isTabTop = ref(false);
const activityNo = ref('');
const zoneConfig = ref<ZoneConfig>();
const hotListRef = ref<InstanceType<typeof HotList>>();
const selectListRef = ref<InstanceType<typeof SelectList>>();
const { studentShopId } = toRefs(userStore);
const zsdxPwd = ref('');

function onScroll(e: { detail: { isFixed: boolean } }) {
    isTabTop.value = e.detail.isFixed;
}

function onScrollToLower() {
    if (activeTab.value === 1) {
        hotListRef.value?.getList();
    } else {
        selectListRef.value?.getGoodsList();
    }
}

async function getConfig() {
    zoneConfig.value = await getZoneConfig(activityNo.value);
}

function onShare() {
    const query = `activityNo=${activityNo.value}&studentShopId=${studentShopId.value}&zsdxPwd=${zsdxPwd.value}`;

    return {
        path: `/pages/activity/pk-zone/index?${query}`,
        query,
        title: '欢迎来到我的校园店～'
    };
}

onShareAppMessage(onShare);
onShareTimeline(onShare);

onLoad(async options => {
    activityNo.value = options?.activityNo;
    zsdxPwd.value = await userStore.getShareZsdxPwd();

    getConfig();
});
</script>

<template>
    <view class="page-wrap">
        <image
            class="header-bg"
            :src="`${CDN_BASE_URL}/mp-cs/images/activity/pk-zone/hot-header-bg.png`"
            mode="aspectFill"
        />
        <page-header :activity-no="activityNo" />

        <scroll-view
            class="scroll-view"
            scroll-y
            enhanced
            :show-scrollbar="false"
            :style="{ height: `calc(100vh - ${navBarHeight}px)` }"
            @scrolltolower="onScrollToLower"
        >
            <view class="head">
                <image
                    class="head-image"
                    :src="zoneConfig?.bannerImage"
                    mode="aspectFill"
                />
            </view>

            <mp-sticky
                :offset-top="navBarHeight"
                :z-index="99"
                @scroll="onScroll"
            >
                <page-tab
                    v-model="activeTab"
                    :is-top="isTabTop"
                />
            </mp-sticky>

            <!-- 推荐热榜 -->
            <view v-show="activeTab === 1">
                <hot-list
                    ref="hotListRef"
                    :activity-no="activityNo"
                />
            </view>

            <!-- 精选商品 -->
            <view v-show="activeTab === 2">
                <select-list
                    ref="selectListRef"
                    :activity-no="activityNo"
                />
            </view>
        </scroll-view>
    </view>
</template>

<style lang="scss" scoped>
.page-wrap {
    display: flex;
    flex-direction: column;
    height: 100vh;

    .header-bg {
        position: fixed;
        top: 0;
        z-index: -3;
        width: 750rpx;
        height: 616rpx;
    }

    .head {
        position: relative;
    }

    .head-image {
        display: block;
        width: 750rpx;
        height: 174rpx;
    }

    .rule-icon {
        position: absolute;
        top: 24rpx;
        right: 24rpx;
        color: #fff;
    }
}
</style>

<style>
page {
    background-color: #f5f5f5;
}
</style>
