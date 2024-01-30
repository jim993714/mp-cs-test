<script setup lang="ts">
import { router, storage } from '@zsdx/mp-utils';

import type { ICouponList } from '@/api/activity/new-arrivals/types';
import { receiveCoupon, receiveCouponCheck } from '@/api/goods-detail/index';

import { limitFilter } from '../utils';

const props = defineProps<{
    list: Array<ICouponList>;
    studentShopId: string;
}>();
const localStorage = storage();
const couponTimeout = ref();
const isLogin = localStorage.get('isLogin');
const fnAcceptPackage = async (item: ICouponList) => {
    try {
        if (!isLogin) {
            router.push('login');
            return;
        }
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
</script>
<template>
    <scroll-view
        v-if="list && list.length > 0"
        class="coupon-scroller"
        :scroll-x="true"
        :show-scrollbar="false"
        :scroll-with-animation="true"
        :enable-flex="true"
    >
        <view class="coupon-scroller-inner">
            <view
                v-for="(item, index) in list"
                :key="index"
                class="coupon"
            >
                <image
                    class="coupon-bg"
                    src="https://cdn.zsdx.cn/mp-cs/images/activity/new-arrivals/coupon-bg.png"
                    mode="scaleToFill"
                />
                <view class="coupon-left">
                    <view class="coupon-left-main">
                        <view
                            v-if="item.couponType === 1"
                            class="coupon-left-main-unit"
                            >¥</view
                        >
                        <view class="coupon-left-main-number">{{ item.discountNum }}</view>
                        <view
                            v-if="item.couponType === 2"
                            class="coupon-left-main-unit"
                            >折</view
                        >
                    </view>
                    <view class="coupon-left-desc">{{
                        limitFilter(item.discountLimit, item.discountLimitType)
                    }}</view>
                </view>
                <view
                    v-if="item.totalNum <= item.getCount"
                    class="coupon-right coupon-right-disabled"
                    >已领完</view
                >
                <view
                    v-else-if="item.isReceived"
                    class="coupon-right coupon-right-disabled"
                    >已领取</view
                >
                <view
                    v-else
                    class="coupon-right"
                    @tap="fnAcceptPackage(item)"
                    >领取</view
                >
            </view>
        </view>
    </scroll-view>
</template>
<style lang="scss" scoped>
.coupon-scroller {
    display: flex;
    align-items: flex-start;
    width: 750rpx;
    height: 168rpx;
    flex-direction: row;
    flex-wrap: nowrap;
    &-inner {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;
        flex-wrap: nowrap;
        width: max-content;
    }
}

.coupon {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 256rpx;
    height: 160rpx;
    margin-top: 20rpx;
    margin-right: 4rpx;
    margin-left: 0;
    flex-direction: row;
    flex-shrink: 0;
    box-sizing: border-box;
    padding-bottom: 4rpx;
    &:first-child {
        margin-left: 12rpx;
    }
    &:last-child {
        margin-right: 12rpx;
    }
    &-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 256rpx;
        height: 160rpx;
    }
    &-left {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 8rpx;
        flex: 1;
        flex-direction: column;
        &-main {
            display: flex;
            justify-content: center;
            align-items: flex-end;
            flex-direction: row;
            &-unit {
                color: #ff4734;
                font-size: 32rpx;
                font-weight: 600;
                line-height: 40rpx;
            }
            &-number {
                color: #ff4734;
                font-size: 80rpx;
                font-family: Bebas Neue;
                font-weight: 600;
                line-height: 74rpx;
            }
        }
        &-desc {
            color: #ff8026;
            font-size: 24rpx;
            font-weight: 600;
            line-height: 24rpx;
        }
    }
    &-right {
        box-sizing: border-box;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 44rpx;
        height: 104rpx;
        margin: 0 20rpx 0 16rpx;
        border-radius: 22rpx;
        color: #ffffff;
        font-size: 24rpx;
        font-weight: 600;
        background: linear-gradient(180deg, #f65a03 0%, #ff4734 100%);
        writing-mode: vertical-rl;
        line-height: 34rpx;
        flex-direction: row;
        &-disabled {
            opacity: 0.7;
        }
    }
}
</style>
