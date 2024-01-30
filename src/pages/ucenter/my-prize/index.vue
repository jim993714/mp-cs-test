<script setup lang="ts">
import { PrizeStatus } from '@/api/ucenter/types';

import PrizeList from './components/prize-list.vue';
import { tabList } from './constants';

const activeTab = ref(1);
const unReceivedRef = ref<InstanceType<typeof PrizeList>>();
const receivedRef = ref<InstanceType<typeof PrizeList>>();

watch(
    () => activeTab.value,
    () => {
        if (activeTab.value === 1) {
            unReceivedRef.value?.reloadList();
        } else {
            receivedRef.value?.reloadList();
        }
    }
);
</script>

<template>
    <view class="page-wrap">
        <zd-tabbar
            v-model="activeTab"
            :items="tabList"
            :scroll="false"
            sticky-top="0px"
        >
            <template #unreceived>
                <prize-list
                    ref="unReceivedRef"
                    :status="PrizeStatus.UNRECEIVED"
                />
            </template>
            <template #received>
                <prize-list
                    ref="receivedRef"
                    :status="PrizeStatus.RECEIVED"
                />
            </template>
        </zd-tabbar>
    </view>
</template>

<style lang="scss" scoped>
.page-wrap {
    position: relative;
    height: 100vh;
}
</style>
<style>
page {
    background-color: #f5f8fa;
}
</style>
