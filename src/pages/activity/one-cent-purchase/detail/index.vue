<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { fetchExchangeDetailList } from '@/api/activity/one-cent-purchase';
import type { ExchangeItemResp } from '@/api/activity/one-cent-purchase/types';
import { CDN_BASE_URL } from '@/base/constants';
import definePageProps from '@/utils/definePageProps/index';

const tabIndex = ref(0);
const detail = ref<ExchangeItemResp>();
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0;
const tabbarTop = computed(() => {
    return `${statusBarHeight + uni.upx2px(88)}px`;
});

onLoad(() => {
    uni.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: 'transparent'
    });
});

onShow(async () => {
    getData(0);
});

onPullDownRefresh(() => {
    getData(tabIndex.value);
});

watch(tabIndex, idx => {
    getData(idx);
});

const options = definePageProps<{
    activityNo: string;
}>(() => {
    getData(0);
});

const list = computed(() => {
    type Status = 'unUsedList' | 'usedList' | 'inValidList';
    const status: Status = ['unUsedList', 'usedList', 'inValidList'][tabIndex.value] as Status;
    return (detail.value?.[status] ?? []) as any;
});

async function getData(idx = 0) {
    const resp = await fetchExchangeDetailList({
        type: idx + 1,
        activityNo: options.value?.activityNo ?? ''
    });
    detail.value = resp;
    console.log('detail.value', detail.value);
    uni.stopPullDownRefresh();
}
</script>

<template>
    <view class="page">
        <zd-header
            title="1分购"
            show-header-left
            class="zd-header"
            show-fixed
            fix-background="linear-gradient(90deg, #f88063 0%, #f44a47 39%, #f34245 100%);"
            fix-color="#fff"
        >
            <template #fix-set>
                <view class="header">
                    <zd-icon
                        class="back"
                        type="zdmp-fanhui"
                        :size="48"
                        @tap="router.back()"
                    />
                    <view class="title"> 详细 </view>
                </view>
            </template>
        </zd-header>
        <view
            class="tabbar-wrapper"
            :style="{
                top: tabbarTop
            }"
        >
            <view class="tabbar">
                <view
                    class="tabbar-item"
                    :class="{ 'tabbar-active': tabIndex === 0 }"
                    @tap="tabIndex = 0"
                >
                    未使用
                </view>
                <view
                    class="tabbar-item"
                    :class="{ 'tabbar-active': tabIndex === 1 }"
                    @tap="tabIndex = 1"
                >
                    已使用
                </view>
                <view
                    class="tabbar-item"
                    :class="{ 'tabbar-active': tabIndex === 2 }"
                    @tap="tabIndex = 2"
                >
                    已失效
                </view>
            </view>
        </view>
        <template v-if="list?.length > 0">
            <view class="table">
                <view class="table-row table-header">
                    <view
                        v-if="list?.[0]?.receiveTime"
                        class="table-cell ellipsis"
                        style="flex: 1"
                    >
                        获得时间
                    </view>
                    <view
                        v-if="list?.[0]?.invalidTime || list?.[0]?.inValidTime"
                        class="table-cell ellipsis"
                        style="flex: 1"
                    >
                        失效时间
                    </view>
                    <view
                        v-if="list?.[0]?.exchangeTime"
                        class="table-cell ellipsis"
                        style="flex: 1"
                    >
                        兑换时间
                    </view>
                    <view
                        v-if="list?.[0]?.receiveCount"
                        class="table-cell ellipsis"
                        style="flex: 1"
                    >
                        获得兑换次数
                    </view>
                    <view
                        v-if="list?.[0]?.goodsTitle"
                        class="table-cell ellipsis"
                        style="flex: 2"
                    >
                        兑换商品
                    </view>
                    <view
                        v-if="list?.[0]?.invalidCount"
                        class="table-cell ellipsis"
                        style="flex: 2"
                    >
                        失效次数
                    </view>
                </view>
                <view
                    v-for="(item, index) in list"
                    :key="index"
                    class="table-row"
                >
                    <view
                        v-if="item?.receiveTime"
                        class="table-cell ellipsis"
                        style="flex: 1"
                    >
                        {{ item.receiveTime }}
                    </view>
                    <view
                        v-if="item?.invalidTime || item?.inValidTime"
                        class="table-cell ellipsis"
                        style="flex: 1"
                    >
                        {{ item.invalidTime || item.inValidTime }}
                    </view>
                    <view
                        v-if="item?.exchangeTime"
                        class="table-cell ellipsis"
                        style="flex: 1"
                    >
                        {{ item.exchangeTime }}
                    </view>
                    <view
                        v-if="item?.receiveCount"
                        class="table-cell ellipsis"
                        style="flex: 1"
                    >
                        {{ item.receiveCount }}
                    </view>
                    <view
                        v-if="item?.goodsTitle"
                        class="table-cell ellipsis"
                        style="flex: 2"
                    >
                        {{ item.goodsTitle }}
                    </view>
                    <view
                        v-if="item?.invalidCount"
                        class="table-cell ellipsis"
                        style="flex: 2"
                    >
                        {{ item.invalidCount }}
                    </view>
                </view>
            </view>
        </template>
        <template v-else>
            <zd-empty
                :image-width="450"
                :image-height="250"
                :image="`${CDN_BASE_URL}/mp-cs/images/activity/newcomer-special/empty.png`"
                description="暂无数据"
                class="empty"
                :top="400"
            />
        </template>
    </view>
</template>

<style scoped lang="scss">
.page {
    display: flex;
    align-items: center;
    min-height: 100vh;
    padding-bottom: calc(env(safe-area-inset-bottom));
    background: linear-gradient(90deg, #f88063 0%, #f44a47 39%, #f34245 100%);
    flex-direction: column;
    .bg {
        position: absolute;
        top: -72rpx;
        right: -88rpx;
        width: 518rpx;
    }
}
.header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 88rpx;
    .back {
        position: absolute;
        top: 24rpx;
        width: 48rpx;
        height: 48rpx;
        padding-left: 20rpx;
    }
    .title {
        flex: 1;
        height: 88rpx;
        line-height: 88rpx;
        text-align: center;
        justify-items: center;
        font-size: 36rpx;
    }
}

.tabbar-wrapper {
    position: fixed;
    z-index: 10000;
    width: 750rpx;
    height: 100rpx;
    border-width: 0;
    background: linear-gradient(90deg, #f88063 0%, #f44a47 39%, #f34245 100%);
}
.tabbar {
    display: flex;
    overflow: hidden;
    width: 702rpx;
    height: 64rpx;
    margin: 0 24rpx;
    margin-top: 20rpx;
    border-radius: 32rpx;
    background-color: rgba($color: #fff, $alpha: 0.2);
    line-height: 64rpx;
    &-item {
        flex: 1;
        text-align: center;
        color: #fff;
    }
    &-active {
        color: $zd-color-red;
        background-color: #fff;
    }
}

.table {
    overflow: hidden;
    width: 702rpx;
    margin: 0 24rpx;
    margin-top: 20rpx;
    margin-top: 100rpx;
    border-radius: 32rpx;
    background-color: #fff;
    &-row {
        display: flex;
        align-items: center;
        width: 100%;
        color: #576066;
    }
    &-header {
        color: $zd-color-red;
        font-weight: bold;
    }
    &-cell {
        flex: 1;
        height: 64rpx;
        padding: 0 20rpx;
        border: 1rpx solid #edf0f2;
        text-align: center;
        line-height: 64rpx;
        border-collapse: collapse;
    }
}

.empty {
    :deep(.empty-description) {
        color: #fff;
    }
}
</style>
