<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import RedPacketList from './components/list/index.vue';
import { Tab } from './components/list/types';
import { tabs } from './constants';

const cur = ref<Tab>(Tab.Coupon);

function gotoRule() {
    router.push('couponRule');
}
</script>

<template>
    <view class="list">
        <zd-tabbar
            v-model="cur"
            :items="tabs"
        >
            <template
                v-for="tab in tabs"
                :key="tab.key"
            >
                <!-- eslint-disable-next-line vue/valid-v-slot -->
                <template #[tab.key]>
                    <RedPacketList
                        :is-visible="tab.value === cur"
                        :tab="tab.value"
                    />
                </template>
            </template>
        </zd-tabbar>
    </view>
    <view
        class="list-footer"
        @tap="gotoRule"
    >
        <zd-icon
            type="zdmp-xinxidefuben"
            :size="32"
        />
        券规则
    </view>
</template>

<style scoped lang="scss">
.list {
    height: calc(100vh - 70rpx - calc(env(safe-area-inset-bottom)));

    &-footer {
        position: sticky;
        bottom: 0;
        display: flex;
        justify-content: center;
        height: 70rpx;
        padding-top: 30rpx;
        color: $uni-text-color;
        font-weight: 400;
        background: #ffffff;
        gap: 12rpx;
        box-sizing: border-box;
        line-height: 28rpx;
    }
}
</style>
