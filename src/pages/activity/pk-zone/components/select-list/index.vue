<script setup lang="ts">
import { useLoadMore } from '@zsdx/mp-material/dist/lib/hooks/useLoadmore';

import { getGoodsCategoryList, getSelectGoodsList } from '@/api/activity/pk-zone';
import type { Category, SelectGoods } from '@/api/activity/pk-zone/types';

import CategoryTab from './category-tab.vue';
import GoodsList from './goods-list.vue';
import TopGoods from './top-goods.vue';

const props = defineProps<{
    activityNo: string;
}>();

const topGoodsList = ref<SelectGoods[]>([]);
const categoryList = ref<Category[]>([]);
const activeCategory = ref('');

const { loadList, reload, dataList, loadText } = useLoadMore(getSelectGoodsList, list => list);
const selectGoodsList = computed(() => dataList.value);
const loadingText = computed(() => loadText.value);

async function getCategory() {
    const data = await getGoodsCategoryList(props.activityNo);

    topGoodsList.value = data.selects;
    categoryList.value = data.categories;

    if (data.categories.length) {
        activeCategory.value = data.categories[0].categoryId;

        getGoodsList();
    }
}

async function getGoodsList() {
    loadList({
        activityNo: props.activityNo,
        categoryId: activeCategory.value
    });
}

function onTabChange() {
    reload({
        activityNo: props.activityNo,
        categoryId: activeCategory.value
    });
}

onMounted(() => {
    getCategory();
});

defineExpose({
    getGoodsList
});
</script>

<template>
    <view class="select-list">
        <TopGoods
            v-if="topGoodsList.length"
            :list="topGoodsList"
        />

        <view class="sticky">
            <CategoryTab
                v-model="activeCategory"
                :list="categoryList"
                @tab-click="onTabChange"
            />
        </view>

        <GoodsList
            :list="selectGoodsList"
            :load-text="loadingText"
        />
    </view>
</template>

<style lang="scss" scoped>
.select-list {
    position: relative;
    display: flex;
    padding: 20rpx;
    padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
    background-color: #f5f5f5;
    flex-direction: column;

    .sticky {
        position: sticky;
        top: 138rpx;
        z-index: 99;
    }
}
</style>
