<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { IList, IPackageList } from '@/api/activity/combination-package/types';

import goodsItemOne from './goods-item-one.vue';
import goodsItemTwo from './goods-item-two.vue';

const props = defineProps<{
    data: IList;
    repairImage: string;
}>();

const goTo = (item: IPackageList) => {
    console.log(item, 'item');
    router.push('combinationPackageGoodsDetail', {
        schoolSeasonCombinationPackageActivityId: item.schoolSeasonCombinationPackageActivityId
    });
};
</script>

<template>
    <view class="goods-list">
        <goodsItemOne
            v-if="props.data.list[0]?.goodsNum == 4 || props.data.list[0]?.goodsNum == 3"
            :data="props.data.list[0]"
            @go-to="goTo"
        />
        <goodsItemTwo
            v-else
            :data="props.data"
            :repair-image="repairImage"
            @go-to="goTo"
        />
    </view>
</template>

<style lang="scss" scoped>
.goods-list {
    display: flex;
    align-items: center;
    width: 750rpx;
    flex-direction: column;
    box-sizing: border-box;
}
</style>
