<script setup lang="ts">
import { router, storage } from '@zsdx/mp-utils';
import { ref } from 'vue';

import type { ICouponList } from '@/api/activity/new-arrivals/types';
import { receiveCoupon, receiveCouponCheck } from '@/api/goods-detail/index';
import studentAuthPop from '@/components/student-auth-pop/index.vue';

import { limitFilter } from '../utils';

const localStorage = storage();

const props = defineProps<{
    couponList: ICouponList[];
    studentShopId: string;
}>();
const isLogin = localStorage.get('isLogin');

const couponTimeout = ref();
const studentAuth = ref();
const fnAcceptPackage = async (item: ICouponList) => {
    try {
        if (!isLogin) {
            router.push('login');
            return;
        }
        const auth = await studentAuth.value.validate();

        if (!auth) return;

        if (couponTimeout.value) {
            clearTimeout(couponTimeout.value);
        }
        const data = await receiveCoupon({
            couponNo: item.couponNo,
            studentShopId: props.studentShopId,
            isNeedReturnResultCheck: 0
        });
        if (data.result === 1) {
            item.isReceived = 1;
            return uni.showToast({
                title: '领取成功',
                icon: 'none'
            });
        }
        if (data.result === 2) {
            fnCheckPackage(data.receiveTicket || '', item);
        }
        if (data.result === -1) {
            return uni.showToast({
                title: data.failReason + '',
                icon: 'none'
            });
        }
    } catch (err: any) {
        if (err.code === 0) {
            uni.showToast({
                title: err.msg + '',
                icon: 'none'
            });
        }
    }
};

const fnCheckPackage = async (receiveTicket: string, item: ICouponList) => {
    try {
        const data = await receiveCouponCheck({ receiveTicket });
        if (data.result == 0) {
            fnCheckPackage(receiveTicket, item);
        } else if (data.result == 1) {
            item.isReceived = 1;
            return uni.showToast({
                title: '领取成功',
                icon: 'none'
            });
        } else {
            return uni.showToast({
                title: data.failReason + '',
                icon: 'none'
            });
        }
    } catch (err: any) {
        if (err.code === 0) {
            uni.showToast({
                title: err.msg + '',
                icon: 'none'
            });
        }
    }
};

const back = () => {
    router.back();
};

const emit = defineEmits(['showNewComerTip']);
</script>

<template>
    <zd-header
        bg-img="https://cdn.zsdx.cn/mp-cs/images/activity/new-arrivals/on-sale-bg.png"
        :height="578"
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
        <template #header-bottom>
            <view class="banner">
                <image
                    class="banner-title"
                    src="https://cdn.zsdx.cn/mp-cs/images/activity/new-arrivals/on-sale-title.png"
                    mode="widthFix"
                ></image>
                <view class="banner-subtitle-warp">
                    <image
                        class="head-subtitle-img"
                        src="https://cdn.zsdx.cn/mp-cs/images/activity/new-arrivals/on-sale-subtitle.png"
                        mode="aspectFill"
                    ></image>
                </view>
                <view class="coupon-list">
                    <image
                        class="coupon-bg"
                        src="https://cdn.zsdx.cn/mp-cs/images/activity/new-arrivals/coupon-wrap.png"
                        mode="aspectFit"
                    ></image>
                    <scroll-view
                        class="coupon-scroller"
                        :scroll-x="true"
                        :show-scrollbar="false"
                        :scroll-with-animation="true"
                        :enable-flex="true"
                    >
                        <view
                            v-for="(item, index) in props.couponList"
                            :key="index"
                            class="coupon-item"
                            :class="{
                                'coupon-item-first': index == 0,
                                'coupon-item-last': index == props.couponList.length - 1
                            }"
                        >
                            <image
                                class="coupon-item-bg"
                                src="https://cdn.zsdx.cn/mp-cs/images/activity/new-arrivals/coupon-item-bg1.png"
                                mode="widthFix"
                            ></image>
                            <view class="coupon-money">
                                <view class="coupon-money-unit">¥</view>
                                <view class="coupon-money-number">{{ item.discountNum }}</view>
                            </view>
                            <text class="coupon-tip">{{
                                limitFilter(item.discountLimit, item.discountLimitType)
                            }}</text>
                            <text
                                v-if="item.totalNum <= item.getCount"
                                class="coupon-btn coupon-btn-disable"
                                >已领完</text
                            >
                            <text
                                v-else-if="item.isReceived"
                                class="coupon-btn coupon-btn-disable"
                                >已领取</text
                            >
                            <text
                                class="coupon-btn"
                                @tap="fnAcceptPackage(item)"
                                >领取</text
                            >
                        </view>
                    </scroll-view>
                </view>
            </view>
        </template>
    </zd-header>
    <student-auth-pop
        v-if="isLogin"
        ref="studentAuth"
        content="未获取到你的学生认证记录，前往认证，认证成功后可享专属认证权益"
    ></student-auth-pop>
</template>

<style lang="scss" scoped>
.banner {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 750rpx;
    .banner-title {
        width: 448rpx;
    }
    .banner-subtitle-warp {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 588rpx;
        height: 70rpx;
        margin-top: 8rpx;
        border-radius: 40rpx;
        background: rgba(255, 255, 255, 0.41);
        flex-direction: row;
    }
    .head-subtitle-img {
        width: 420rpx;
        height: 32rpx;
    }
}
.coupon-list {
    position: relative;
    width: 710rpx;
    height: 248rpx;
    margin: 40rpx 20rpx;
}

.coupon-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 710rpx;
    height: 248rpx;
}

.coupon-scroller {
    display: flex;
    align-items: flex-start;
    width: 710rpx;
    height: 248rpx;
    flex-direction: row;
    flex-wrap: nowrap;
}

.coupon-item {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 196rpx;
    height: 216rpx;
    margin-top: 20rpx;
    margin-right: 14rpx;
    margin-left: 0;
    flex-direction: column;
    flex-shrink: 0;
    &-first {
        margin-left: 22rpx;
    }

    &-last {
        margin-right: 22rpx;
    }
}

.coupon-item-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 196rpx;
    height: 216rpx;
}

.coupon-money {
    z-index: 9;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-top: 24rpx;
    flex-direction: row;
}

.coupon-money-unit {
    z-index: 9;

    color: #882309;
    font-size: 30rpx;
    font-weight: 600;
    line-height: 60rpx;
}

.coupon-money-number {
    z-index: 9;
    color: #882309;
    font-size: 60rpx;
    font-family: 'Bebas Neue' !important;
    font-weight: 600;
    line-height: 70rpx;
}

.coupon-tip {
    z-index: 9;
    margin-top: 6rpx;
    color: #ff8026;
    font-size: 20rpx;
    font-weight: 400;
    line-height: 24rpx;
}

.coupon-btn {
    z-index: 9;
    width: 152rpx;
    margin-top: 10rpx;
    padding: 8rpx 0;
    border-radius: 25rpx;
    text-align: center;
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 600;
    background: linear-gradient(to right, #f65b02, #e40015);
    &-disable {
        opacity: 0.5;
    }
}

.header-left,
.header-right {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80rpx;
    height: 88rpx;
}
</style>
