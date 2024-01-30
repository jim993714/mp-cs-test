<script setup lang="ts">
import { cancelCollect } from '@/api/ucenter';
import type { CollectShop } from '@/api/ucenter/types';

import Empty from './empty.vue';
import ShopItem from './shop-item.vue';

const shopList = ref<CollectShop[]>([]);

async function deleteShopCollect(studentShopId: string, index: number) {
    await cancelCollect([studentShopId], 'shop');

    shopList.value.splice(index, 1);

    uni.showToast({
        title: '取消收藏成功',
        icon: 'none'
    });
}
</script>

<template>
    <view class="page-wrap">
        <zd-list
            v-model="shopList"
            open-refresh
            :enhanced="false"
            url="/student-school-shop/collect/getStudentShopCollectList"
            height="calc(100vh - 88rpx)"
        >
            <template #default="{ item, index }">
                <zd-swipe-action
                    :actions="['delete']"
                    @action="deleteShopCollect(item.studentShopId, index)"
                >
                    <shop-item :info="item" />
                </zd-swipe-action>
            </template>

            <template #empty>
                <empty />
            </template>
        </zd-list>
    </view>
</template>
