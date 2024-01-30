<script setup lang="ts">
import { useLoadMore } from '@zsdx/mp-material/dist/lib/hooks/useLoadmore';
import { router } from '@zsdx/mp-utils';

import { getRankList, getRule, getUserRewardInfo } from '@/api/activity/shopping-cashback';
import type { PoolInfo, RuleConfig } from '@/api/activity/shopping-cashback/types';

import AwardList from './components/award-list.vue';
import BonusPoolCard from './components/bonus-pool-card.vue';
import MyBonus from './components/my-bonus.vue';

const headerOpacity = ref(0);
const showHeader = ref(false);
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0;
const rulesTop = computed(() => {
    return `${statusBarHeight + uni.upx2px(88) + uni.upx2px(10)}px`;
});
const mothsTime = ref('');
const scrollId = ref();
const config = ref<RuleConfig>();
const baseInfo = ref<PoolInfo>();
const pickerValue = computed(() => {
    return `${mothsTime.value.slice(0, 4)}-${mothsTime.value.slice(4, 6)}`;
});

const { loadList, reload, dataList, loadText } = useLoadMore(getRankList, list => list);
const rankList = computed(() => dataList.value);
const loadingText = computed(() => loadText.value);

function onDateChange(e: any) {
    const month = e.detail.value.replace(/-/g, '');

    mothsTime.value = `${month}01`;
    scrollId.value = undefined;
    getBaseInfo();

    reload({
        configId: config.value?.configId || '',
        mothsTime: mothsTime.value
    });
}

function goRulePage() {
    router.push('activityRules', { type: 'SHOPPING_CASHBACK', params: {} });
}

function goTop() {
    uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
    });
}

onPageScroll((e: any) => {
    showHeader.value = e.scrollTop >= 112;
    headerOpacity.value = e.scrollTop / 112;
});

async function getBaseInfo() {
    baseInfo.value = await getUserRewardInfo({
        configId: config.value?.configId || '',
        mothsTime: mothsTime.value
    });
}

async function getAwardRankList() {
    if (!config.value) return;

    loadList({
        configId: config.value?.configId || '',
        mothsTime: mothsTime.value
    });
}

async function init() {
    config.value = await getRule();

    if (!config.value) return;
    if (!mothsTime.value) mothsTime.value = config.value.mothsTime;
    getBaseInfo();
    getAwardRankList();
}

onReachBottom(() => {
    getAwardRankList();
});

onShow(() => {
    init();
});
</script>

<template>
    <view class="page-wrap">
        <zd-navbar
            :title="`现金奖池`"
            :background="`rgba(255, 255, 255, ${headerOpacity})`"
            :color="`rgba(0, 0, 0, ${headerOpacity})`"
            icon-color="#000"
            fixed
        />

        <view
            class="rule-btn"
            :style="{ top: rulesTop }"
            @tap="goRulePage"
        >
            <zd-icon
                type="zdmp-chakan"
                :size="30"
                class="rule-btn-icon"
            />
            <view class="rule-btn-text">规则</view>
        </view>

        <image
            class="head-image"
            :src="config?.bannerImage"
            mode="aspectFill"
        />
        <view class="date-wrap">
            <!-- TODO: 上线前调整为2023-09-01 -->
            <picker
                :value="pickerValue"
                mode="date"
                start="2023-07-01"
                fields="month"
                @change="onDateChange"
            >
                <view class="date-picker">
                    {{ mothsTime.slice(0, 4) }}年{{ mothsTime.slice(4, 6) }}月
                    <view class="arrow" />
                </view>
            </picker>
        </view>
        <!-- 奖池 -->
        <BonusPoolCard
            :money="baseInfo?.totalReward"
            :has-send="baseInfo?.isGrant === 1"
        />

        <view class="padding-wrap">
            <!-- 我的奖金 -->
            <MyBonus :info="baseInfo" />

            <!-- 奖励列表 -->
            <AwardList
                :list="rankList"
                :load-text="loadingText"
            />
        </view>

        <view
            v-if="showHeader"
            class="go-top"
            @tap="goTop"
        >
            <zd-icon
                type="zdmp-zhiding"
                :size="32"
            />
        </view>
    </view>
</template>

<style>
page {
    background-color: #fff4ec;
}
</style>

<style lang="scss" scoped>
.page-wrap {
    .head-image {
        width: 750rpx;
        height: 400rpx;
    }

    .rule-btn {
        position: fixed;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 116rpx;
        height: 48rpx;
        border-radius: 62rpx 0rpx 0rpx 62rpx;
        background: rgba(0, 0, 0, 0.4);
        gap: 4rpx;

        &-icon {
            color: #ffffff;
        }

        &-text {
            color: #ffffff;
            font-size: 24rpx;
            font-weight: 400;
            line-height: 24rpx;
        }
    }

    .date-wrap {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 80rpx;
        padding: 0 48rpx;
    }
    .date-picker {
        display: flex;
        align-items: center;
        color: #583124;
        font-size: 28rpx;
        font-weight: 500;
        line-height: 40rpx;
        gap: 12rpx;

        .arrow {
            width: 0;
            height: 0;
            margin-top: 10rpx;
            border: 10rpx solid transparent;
            border-top: 10rpx solid #583124;
        }
    }

    .padding-wrap {
        padding: 0 24rpx;
        padding-bottom: calc(env(safe-area-inset-bottom));
    }

    .go-top {
        position: fixed;
        right: 24rpx;
        bottom: 224rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 72rpx;
        height: 72rpx;
        border: 2rpx solid #f4f4f4;
        border-radius: 50%;
        color: #000;
        background: #ffffff;
        box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(0, 0, 0, 0.12);
    }
}
</style>
