<script setup lang="ts">
import { useLoadMore } from '@zsdx/mp-material/dist/lib/hooks/useLoadmore';

import { getHireGoodsList } from '@/api/activity/pk-zone';

import CompanyItem from './company-item.vue';

const props = defineProps<{
    activityNo: string;
}>();

const { loadList, dataList, loadText } = useLoadMore(getHireGoodsList, list => {
    for (const item of list) {
        const delta = 3 - item.goods.length;
        for (let i = 0; i < delta; i++) {
            item.goods.push({} as any);
        }
    }
    return list;
});
const companyList = computed(() => dataList.value);

async function getList() {
    loadList({
        activityNo: props.activityNo
    });
}

onMounted(() => {
    getList();
});

defineExpose({
    getList
});
</script>

<template>
    <view class="hot-list">
        <CompanyItem
            v-for="item in companyList"
            :key="item.hireNo"
            :info="item"
        />
        <view class="load-text">
            {{ loadText }}
        </view>
    </view>
</template>

<style lang="scss" scoped>
.hot-list {
    display: flex;
    padding: 20rpx;
    padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
    background-color: #f5f5f5;
    flex-direction: column;
    gap: 20rpx;

    .load-text {
        height: 114rpx;
        margin-top: -20rpx;
        text-align: center;
        color: $uni-color-paragraph;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 114rpx;
    }
}
</style>
