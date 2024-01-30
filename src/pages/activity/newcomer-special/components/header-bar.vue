<script setup lang="ts">
import { router, storage } from '@zsdx/mp-utils';
import type { PropType } from 'vue';

import type { INewCoupon } from '@/api/activity/newcomer-special/types';

const props = defineProps({
    newFansCoupon: {
        type: Object as PropType<INewCoupon>,
        default() {
            return;
        }
    }
});

const localStorage = storage();

const fnAccept = () => {
    const isLogin = localStorage.get('isLogin');
    if (!isLogin) {
        router.push('login');
        return;
    }
    emit('fnAccept');
};
const back = () => {
    router.back();
};

const emit = defineEmits(['fnAccept']);
</script>

<template>
    <zd-header
        background="transparent"
        :height="616"
        bg-img="https://cdn.zsdx.cn/mp-cs/images/activity/newcomer-special/commer-boon-bg1.png"
    >
        <template #left>
            <view
                class="header-left"
                @tap.prevent="back"
            >
                <zd-icon
                    type="zdmp-fanhui"
                    :size="36"
                    color="#ffffff"
                ></zd-icon>
            </view>
        </template>
        <template #center>
            <view class="header-center">新人专享</view>
        </template>
        <template #right>
            <view class="header-right"> </view>
        </template>
        <template #header-bottom>
            <view class="banner">
                <image
                    class="banner-title"
                    src="https://cdn.zsdx.cn/mp-cs/images/activity/newcomer-special/commer-boone-title.png"
                    mode="aspectFill"
                />
                <view class="coupon-warp">
                    <image
                        class="coupon-img"
                        src="https://cdn.zsdx.cn/mp-cs/images/activity/newcomer-special/commer-boon-bg2.png"
                        mode="aspectFill"
                    ></image>
                    <view class="coupon-left">
                        <text class="coupon-left-num">{{ newFansCoupon.money || 0 }}</text>
                        <text class="coupon-left-label">元</text>
                    </view>
                    <view class="coupon-info">
                        <text class="coupon-info-top">新人专区</text>
                        <view class="coupon-info-bottom">
                            <text class="coupon-info-bottom-text">共</text>
                            <text class="coupon-info-bottom-num">{{
                                newFansCoupon.couponNum || 0
                            }}</text>
                            <text class="coupon-info-bottom-text">张券</text>
                        </view>
                    </view>
                    <view class="coupon-btn">
                        <image
                            v-if="newFansCoupon.receiveStatus == 1"
                            class="coupon-btn-img"
                            src="https://cdn.zsdx.cn/mp-cs/images/activity/newcomer-special/comer-btn.png"
                            mode="aspectFill"
                            @tap="fnAccept()"
                        ></image>
                        <image
                            v-if="newFansCoupon.receiveStatus == 2"
                            class="coupon-btn-img"
                            src="https://cdn.zsdx.cn/mp-cs/images/activity/newcomer-special/comer-btn-disabel.png"
                            mode="aspectFill"
                        ></image>
                        <image
                            v-if="newFansCoupon.receiveStatus == 3"
                            class="coupon-btn-img"
                            src="https://cdn.zsdx.cn/mp-cs/images/activity/newcomer-special/comer-btn-disabel1.png"
                            mode="aspectFill"
                        ></image>
                    </view>
                </view>
                <text class="banner-tips">新人券只适用于新人专区商品，仅限学生认证可领</text>
            </view>
        </template>
    </zd-header>
</template>

<style lang="scss" scoped>
.header-left,
.header-right {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80rpx;
    height: 88rpx;
}
.header-center {
    height: 88rpx;
    text-align: center;
    color: #ffffff;
    font-size: 36rpx;
    font-weight: 500;
    line-height: 88rpx;
}

.banner {
    position: relative;
    z-index: 9999;
    display: flex;
    align-items: center;
    width: 750rpx;
    flex-direction: column;
    .banner-title {
        width: 548rpx;
        height: 94rpx;
        margin-top: 60rpx;
    }
    .coupon-warp {
        position: relative;
        display: flex;
        align-items: center;
        width: 670rpx;
        height: 200rpx;
        margin-top: 72rpx;
        box-sizing: border-box;
    }

    .coupon-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 670rpx;
        height: 200rpx;
    }

    .coupon-left {
        z-index: 999;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 262rpx;
        padding-left: 10rpx;
        flex-direction: row;
        box-sizing: border-box;

        &-num {
            color: #ff1d05;
            font-size: 90rpx;
            font-family: KingnamBobo-Bold, KingnamBobo;
            font-weight: bold;
            line-height: 160rpx;
        }

        &-label {
            margin-top: 20rpx;
            color: #ff1d05;
            font-size: 52rpx;
            font-weight: bold;
            line-height: 160rpx;
        }
    }

    .coupon-info {
        z-index: 999;
        display: flex;
        justify-content: center;
        width: 224rpx;
        padding-left: 50rpx;
        flex-direction: column;

        &-top {
            color: #ffffff;
            font-size: 44rpx;
            font-weight: bold;
            line-height: 44px;
        }

        &-bottom {
            display: flex;
            flex-direction: row;
            align-items: center;

            &-text {
                color: #ffffff;
                font-size: 28rpx;
                line-height: 36rpx;
            }

            &-num {
                color: #ffffff;
                font-size: 36rpx;
                font-family: KingnamBobo-Bold, KingnamBobo;
                font-weight: bold;
                line-height: 36rpx;
            }
        }
    }

    .coupon-btn {
        z-index: 999;
        display: flex;
        flex-direction: row;
        &-img {
            width: 114rpx;
            height: 114rpx;
        }
    }

    .banner-tips {
        width: 670rpx;
        margin-top: 38rpx;
        margin-left: 40rpx;
        color: #fff8f5;
        font-size: 26rpx;
        font-weight: 400;
        line-height: 26rpx;
    }
}
</style>
