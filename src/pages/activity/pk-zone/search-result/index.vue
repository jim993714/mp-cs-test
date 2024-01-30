<script setup lang="ts">
import { useLoadMore } from '@zsdx/mp-material/dist/lib/hooks/useLoadmore';

import { getSearchGoodsList } from '@/api/activity/pk-zone';
import type { SearchGoodsSortField, SearchGoodsSortType } from '@/api/activity/pk-zone/types';
import SortBar from '@/components/sort-bar/sort-bar.vue';

import Empty from './components/empty.vue';
import GoodsItem from './components/goods-item.vue';
import SearchBar from './components/search-bar.vue';
import { sortConfig, sortStyleConfig } from './constants';

const activityNo = ref('');
const keywords = ref('');
const sortType = ref<SearchGoodsSortType>('');
const sortField = ref<SearchGoodsSortField>('');
const navbarHeight = (uni.getSystemInfoSync().statusBarHeight || 0) + uni.upx2px(88);

const { loadList, dataList, loadText, reload, loadStatus } = useLoadMore(
    getSearchGoodsList,
    list => list
);
const goodsList = computed(() => dataList.value);
const loadingStatus = computed(() => loadStatus.value);

async function getData() {
    loadList({
        activityNo: activityNo.value,
        keywords: keywords.value,
        sortType: sortType.value,
        sortField: sortField.value
    });
}

function onSortChange(data: { sortField: SearchGoodsSortField; sortType: SearchGoodsSortType }) {
    sortField.value = data.sortField;
    sortType.value = data.sortType;

    reload({
        activityNo: activityNo.value,
        keywords: keywords.value,
        sortType: sortType.value,
        sortField: sortField.value
    });
}

onReachBottom(async () => {
    await getData();
});

onLoad(options => {
    activityNo.value = options?.activityNo;
    keywords.value = options?.keyword;

    getData();
});
</script>

<template>
    <view>
        <zd-navbar
            class="navbar"
            left-width="custom"
            fixed
        >
            <SearchBar
                :keywords="keywords"
                :activity-no="activityNo"
            />
        </zd-navbar>
        <view
            class="navbar-placeholder"
            :style="{ height: `${navbarHeight}px` }"
        />
        <view
            class="sort-bar"
            :style="{
                top: `${navbarHeight}px`
            }"
        >
            <SortBar
                :config="sortConfig"
                :theme="sortStyleConfig"
                :indicator-type="0"
                item-full
                @change="onSortChange"
            />
        </view>

        <view class="goods-list">
            <grid-view
                type="masonry"
                :cross-axis-count="2"
                :main-axis-gap="7"
                :cross-axis-gap="7"
            >
                <view
                    v-for="item in goodsList"
                    :key="item.goodsNo"
                >
                    <GoodsItem :goods="item" />
                </view>
            </grid-view>
        </view>

        <Empty v-if="goodsList.length === 0 && loadingStatus !== 2" />

        <view
            v-if="loadText && goodsList.length > 0"
            class="load-text"
        >
            {{ loadText }}
        </view>
    </view>
</template>

<style lang="scss" scoped>
.sort-bar {
    position: sticky;
    z-index: 99;
}

.goods-list {
    padding: 20rpx;
}

.load-text {
    height: 114rpx;
    padding-bottom: calc(env(safe-area-inset-bottom));
    text-align: center;
    color: $uni-color-paragraph;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 114rpx;
}
</style>

<style>
page {
    background-color: #f5f8fa;
}
</style>
