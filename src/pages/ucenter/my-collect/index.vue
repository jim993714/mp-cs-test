<script setup lang="ts">
import Goods from './components/goods.vue';
import Shop from './components/shop.vue';
import { tabList } from './constants';

const activeTab = ref(1);
</script>

<template>
    <view class="page-wrap">
        <zd-tabbar
            v-model="activeTab"
            :items="tabList"
            :scroll="false"
            :is-action="true"
            sticky-top="0px"
        >
            <template #goods>
                <Goods />
            </template>
            <template #shop>
                <Shop />
            </template>
        </zd-tabbar>
    </view>
</template>

<style lang="scss" scoped>
.page-wrap {
    position: relative;
}

:deep(.zd-tab-bar-header) {
    padding: 0 88rpx;
}
</style>
<style>
page {
    background-color: #f5f8fa;
}
</style>
