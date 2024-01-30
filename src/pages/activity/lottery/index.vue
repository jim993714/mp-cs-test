<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { getLotteryDetail, getLotteryNoticeList } from '@/api/lottery';
import type { LotteryDetail } from '@/api/lottery/types';

import FailDialog from './components/fail-dialog.vue';
import NoticeBar from './components/notice-bar.vue';
import SuccessDialog from './components/success-dialog.vue';
import { useLottery } from './use-lottery';

const lotteryNo = ref('');
const failDialog = ref();
const successDialog = ref();
const lotteryDetail = ref<LotteryDetail>();
const noticeList = ref<string[]>([]);
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0;
const myPrizeTop = computed(() => {
    return `${statusBarHeight + uni.upx2px(88) + uni.upx2px(10)}px`;
});
const countTop = computed(() => {
    return `${(lotteryDetail.value?.pageConfig.turntable_top || 0) + 660 + 32}rpx`;
});

async function getLotteryInfo() {
    lotteryDetail.value = await getLotteryDetail(lotteryNo.value);
}

async function getNoticeList() {
    const list = await getLotteryNoticeList(lotteryNo.value);

    noticeList.value = list || [];
}

const { start, transition, rotateDeg, lotteryResult } = useLottery(result => {
    if (result === 1) {
        successDialog.value?.show(lotteryResult.value);
    } else {
        failDialog.value?.show(result);
    }

    if (lotteryDetail.value?.chanceCount) {
        lotteryDetail.value.chanceCount--;
    }
});

onLoad(options => {
    lotteryNo.value = options?.lotteryNo;

    // 获取抽奖信息
    getLotteryInfo();
    getNoticeList();
});
</script>

<template>
    <view class="lottery">
        <zd-navbar
            background="transparent"
            class="navbar"
        />
        <view
            class="wheel-wrap"
            :style="{ top: lotteryDetail?.pageConfig.turntable_top + 'rpx' }"
        >
            <image
                class="wheel-bg"
                :src="lotteryDetail?.pageConfig.turntable_image"
                mode="aspectFill"
                :style="{
                    transform: 'rotate(' + rotateDeg + 'deg)',
                    transition
                }"
            />
            <image
                class="wheel-pointer"
                :src="lotteryDetail?.pageConfig.turntable_hand_image"
                mode="aspectFill"
                @tap="start(lotteryNo)"
            />
        </view>

        <view
            class="count"
            :style="{ top: countTop }"
        >
            抽奖次数：{{ lotteryDetail?.chanceCount }}次
        </view>

        <view
            class="my-prize"
            :style="{ top: myPrizeTop }"
            @tap="router.push('myPrize')"
        >
            我的奖品
        </view>

        <view
            v-if="noticeList.length"
            class="notice-bar"
            :style="{ top: myPrizeTop }"
        >
            <notice-bar :list="noticeList" />
        </view>

        <view class="bg">
            <image
                v-for="(bg, bgIndex) in lotteryDetail?.pageConfig.background_images"
                :key="bgIndex"
                class="bg-img"
                :style="{ height: bg.height + 'rpx' }"
                :src="bg.url"
                mode="widthFix"
            />
        </view>
    </view>

    <fail-dialog ref="failDialog" />
    <success-dialog ref="successDialog" />
</template>

<style lang="scss" scoped>
.lottery {
    position: relative;

    .navbar {
        position: fixed;
        top: 0;
        z-index: 1001;
    }

    .wheel-wrap {
        position: relative;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 660rpx;
        height: 660rpx;
        margin: 0 auto;

        .wheel-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 660rpx;
            height: 660rpx;
            transform-origin: center;
        }

        .wheel-pointer {
            position: relative;
            width: 222rpx;
            height: 222rpx;
        }
    }

    .count {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 56rpx;
        padding: 0 28rpx;
        border-radius: 28rpx;
        color: #ffffff;
        font-size: 24rpx;
        font-weight: 600;
        background: rgba(0, 0, 0, 0.2);
        line-height: 24rpx;
    }

    .my-prize {
        position: fixed;
        right: 0;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 142rpx;
        height: 52rpx;
        border-radius: 200rpx 0rpx 0rpx 200rpx;
        color: #fb3e51;
        font-size: 24rpx;
        font-weight: 500;
        background: linear-gradient(180deg, #fffbf4 0%, #ffd6b0 100%);
        line-height: 24rpx;
    }

    .notice-bar {
        position: absolute;
        left: 30rpx;
        z-index: 1;
    }

    .bg {
        position: absolute;
        top: 0;
        left: 0;
        &-img {
            display: block;
            width: 750rpx;
        }
    }
}
</style>
