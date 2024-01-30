<script setup lang="ts">
import { type Prize, PrizeStatus } from '@/api/ucenter/types';

import Empty from '../components/empty.vue';
import PrizeItem from '../components/prize-item.vue';

const prizeList = ref<Prize[]>([]);
const params = {
    status: -1
};
</script>

<template>
    <view class="page-wrap">
        <zd-list
            v-model="prizeList"
            url="/student-school-shop/user/award/list"
            :enhanced="false"
            open-refresh
            :params="params"
            :show-scrollbar="false"
            height="calc(100vh - 68rpx)"
        >
            <template #default="{ item }">
                <PrizeItem
                    :info="item"
                    :status="PrizeStatus.INVALID"
                />
            </template>

            <template #empty>
                <Empty :show-invalid="false" />
            </template>
        </zd-list>
    </view>
</template>

<style>
page {
    background-color: #f5f8fa;
}
</style>

<style lang="scss" scoped>
.page-wrap {
    padding: 20rpx;
}
</style>
