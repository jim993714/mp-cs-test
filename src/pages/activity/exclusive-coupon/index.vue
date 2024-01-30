<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { getSubgiftShareList } from '@/api/activity/exclusive-coupon/index';
import type {
    ICoupon,
    IShareInfo,
    ISubfitCouponParams
} from '@/api/activity/exclusive-coupon/types';

import banner from './components/banner.vue';
import couponList from './components/coupon-list.vue';

const headerBar = ref();
const headerTop = ref(0);
const couponData = ref({} as ICoupon);
const shareInfo = ref({} as IShareInfo);
const bannerWrap = ref();
const showGoTo = computed(() => {
    return shareInfo.value.shareEndTime && shareInfo.value.shareEndTime > new Date().getTime()
        ? true
        : false;
});

onMounted(() => {
    headerTop.value = headerBar.value.getNabBarHeight();
});
const params = ref<ISubfitCouponParams>({ shareKey: '' });
onLoad((options: any) => {
    params.value.shareKey = options.shareKey || '';
});
onShow(() => {
    getShareData();
});

const getShareData = async () => {
    try {
        const res = await getSubgiftShareList(params.value);
        couponData.value = res.couponListDTO[0] || {};
        shareInfo.value = res.shareInfoDTO || {};
        bannerWrap.value.resetTime(
            Math.floor((shareInfo.value.shareEndTime - new Date().getTime()) / 1000) || 0
        );
    } catch (err) {
        console.error(err);
    }
};

const onRefresh = async () => {
    await getShareData();
};

const goTo = () => {
    router.switchTab('home');
};
const timeEnd = () => {
    onRefresh();
};

onPullDownRefresh(async () => {
    onRefresh();
    uni.stopPullDownRefresh();
});
</script>

<template>
    <view class="page-warp">
        <image
            :style="{ top: headerTop + 'px' }"
            class="banner-img"
            src="https://cdn.zsdx.cn/mp-cs/images/activity/exclusive-coupon/banner.png"
            mode="aspectFill"
        />
        <zd-navbar
            ref="headerBar"
            class="navbar"
            title="领取优惠券"
        >
        </zd-navbar>
        <banner
            v-if="shareInfo"
            ref="bannerWrap"
            :share-info="shareInfo"
            @time-end="timeEnd"
        ></banner>
        <view class="coupon">
            <coupon-list
                :data="couponData"
                :share-info="shareInfo"
                :share-key="params.shareKey"
                @on-refresh="onRefresh"
            ></coupon-list>
        </view>
        <view
            v-if="showGoTo"
            class="btn-box"
        >
            <image
                class="btn-bg"
                src="https://cdn.zsdx.cn/mp-cs/images/activity/exclusive-coupon/btn-bg.png"
                mode="scaleToFill"
            />

            <view
                class="btn-text"
                @tap.prevent="goTo"
            >
                进店购买
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.page-warp {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    .coupon {
        flex: 1;
        margin-top: 44rpx;
        background: #fff4ea;
    }
    .banner-img {
        position: absolute;
        left: 0;
        width: 750rpx;
        height: 700rpx;
    }
    .btn-box {
        position: absolute;
        bottom: 20rpx;
        left: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 442rpx;
        height: 130rpx;
        transform: translateX(-50%);
        flex-direction: row;
        .btn-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 442rpx;
            height: 130rpx;
        }
        .btn-text {
            position: relative;
            color: #ffffff;
            font-size: 32rpx;
            font-weight: 500;
            line-height: 32rpx;
        }
    }

    .disable {
        opacity: 0.5;
    }
}
button::after {
    border: none !important;
}
button {
    padding: 0;
    border: 1rpx solid transparent;
    background: transparent;
}
</style>
