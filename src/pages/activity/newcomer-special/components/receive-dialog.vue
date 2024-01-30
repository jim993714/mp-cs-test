<script setup lang="ts">
import dayjs from 'dayjs';
import { ref } from 'vue';

import type { ICouponList } from '@/api/activity/newcomer-special/types';

import { limitFilter } from '../utils';

const props = defineProps({
    couponList: {
        type: Array as PropType<Array<ICouponList>>,
        required: true,
        default() {
            return [];
        }
    }
});

const showFlag = ref(false);
const dialogVisible = ref(false);
const pageHeight = ref(0);

const scrollHeight = computed(() => {
    if (props.couponList.length == 1) {
        return uni.upx2px(184 + 130);
    } else if (props.couponList.length < 3) {
        return uni.upx2px(184 * props.couponList.length + 100);
    } else {
        return uni.upx2px(184 * 2.5 + 100);
    }
});

pageHeight.value = uni.getSystemInfoSync().windowHeight || 0;

const moveHandle = (e: any) => {
    e && e.stopPropagation();
    return;
};

const fnShow = () => {
    showFlag.value = true;
    dialogVisible.value = true;
};

const close = () => {
    uni.hideKeyboard();
    dialogVisible.value = false;
    setTimeout(() => {
        showFlag.value = false;
    }, 300);
};

const fnGoPage = () => {
    emit('fnGoPage');
    close();
};

const emit = defineEmits(['fnGoPage']);
defineExpose({
    fnShow
});
</script>

<template>
    <view
        class="modal-wrapper"
        :class="{ 'modal-wrapper-show': showFlag }"
        :style="{ height: `${pageHeight}px` }"
        @touchmove.stop.prevent="moveHandle"
    >
        <!-- 遮罩层 -->
        <view
            class="mask-view"
            :class="{ 'mask-view-hidden': !dialogVisible }"
            :style="{ height: `${pageHeight}px` }"
            @tap="close()"
        ></view>
        <view
            class="content-wrapper"
            :class="{ 'content-wrapper-show': dialogVisible }"
            @touchmove.stop.prevent="moveHandle"
            @tap.prevent.stop="moveHandle"
        >
            <view class="content-inner">
                <view class="content-title">恭喜您！获得以下优惠券</view>

                <scroll-view
                    class="dialog-scroller"
                    :style="{ height: scrollHeight + 'px' }"
                    scroll-y="true"
                    :show-scrollbar="false"
                >
                    <view
                        v-for="(coupon, index) in couponList"
                        :key="index"
                        class="scroll-item"
                    >
                        <view class="scroll-item-inner">
                            <view class="scroll-item-left">
                                <text class="scroll-item-money-unit">￥</text>
                                <text class="scroll-item-money-value">{{
                                    coupon.discountNum
                                }}</text>
                            </view>
                            <view class="scroll-item-spliter"> </view>
                            <view class="scroll-item-right">
                                <text class="scroll-item-title">{{ coupon.title }}</text>
                                <text class="scroll-item-sub-title">{{
                                    limitFilter(coupon.discountLimit, coupon.discountLimitType)
                                }}</text>
                                <text class="scroll-item-sub-title"
                                    >有效期至{{
                                        dayjs(coupon.useEndTime).format('YYYY-MM-DD HH:mm:ss')
                                    }}</text
                                >
                            </view>
                        </view>
                        <view class="scroll-item-decorate"></view>
                        <view class="scroll-item-decorate2"></view>
                    </view>
                    <view class="scroll-seat"> </view>
                </scroll-view>
            </view>
            <image
                class="scroll-decorate1"
                src="https://cdn.zsdx.cn/mp-cs/images/activity/newcomer-special/quan-package-decorate1.png"
                mode="aspectFit"
            ></image>
            <image
                class="scroll-decorate2"
                src="https://cdn.zsdx.cn/mp-cs/images/activity/newcomer-special/quan-package-decorate2.png"
                mode="aspectFit"
            ></image>
            <image
                class="scroll-decorate3"
                src="https://cdn.zsdx.cn/mp-cs/images/activity/newcomer-special/quan-package-decorate2.png"
                mode="aspectFit"
            ></image>

            <view class="dialog-foot">
                <image
                    class="dialog-foot-bg"
                    src="https://cdn.zsdx.cn/mp-cs/images/activity/newcomer-special/quan-package-bg.png"
                    mode="aspectFit"
                ></image>
                <view class="dialog-foot-tip">请移至『掌上大学app-我的红包卡券』中查看</view>
                <view
                    class="dialog-foot-btn"
                    @tap="fnGoPage"
                    >知道了</view
                >
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.modal-wrapper {
    position: fixed;
    top: 0;
    left: -999rpx;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 750rpx;
    flex-direction: column;

    &-show {
        left: 0;
    }
}

.mask-view {
    position: absolute;
    top: 0;
    left: 0;
    width: 750rpx;
    background-color: rgba(0, 0, 0, 0.5);
    transition-duration: 0.3s;
    transition-delay: 0s;
    transition-timing-function: ease-out;
    transition-property: background-color;

    &-hidden {
        background-color: rgba(0, 0, 0, 0);
    }
}

.content-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 692rpx;
    padding-bottom: 280rpx;
    opacity: 0;
    transition-duration: 0.3s;
    transition-delay: 0s;
    transition-timing-function: ease-out;
    transition-property: opacity;
    flex-direction: column;

    &-show {
        opacity: 1;
    }
}

.dialog-scroller {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    width: 562rpx;
    flex-direction: column;
}

.content-inner {
    display: flex;
    align-items: center;
    width: 654rpx;
    border-radius: 40rpx;
    background: #fd3d33;
    flex-direction: column;
}

.content-title {
    padding: 56rpx 0 46rpx;
    text-align: center;
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 600;
    line-height: 32rpx;
}

.scroll-seat {
    width: 562rpx;
    height: 100rpx;
    /* #ifdef H5 */
    flex-shrink: 0;
    /* #endif */
}

.dialog-foot {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 692rpx;
    height: 466rpx;
    padding-top: 200rpx;
    flex-direction: column;
    box-sizing: border-box;
}

.dialog-foot-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 692rpx;
    height: 404rpx;
}

.dialog-foot-time-tip {
    z-index: 99;
    width: 690rpx;
    margin-bottom: 8rpx;
    text-align: center;
    color: #fff1b1;
    font-size: 26rpx;
    font-weight: 500;
    line-height: 44rpx;
}

.dialog-foot-tip {
    position: relative;
    margin-bottom: 40rpx;
    color: rgba(255, 241, 177, 1);
    font-size: 24rpx;
    font-weight: 600;
    line-height: 24rpx;
}

.dialog-foot-btn {
    position: relative;
    width: 330rpx;
    border-radius: 44rpx;
    text-align: center;
    color: #f1312b;
    font-size: 32rpx;
    font-weight: 600;
    background: #ffee9e;
    line-height: 72rpx;
}

.scroll-item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    width: 562rpx;
    height: 184rpx;
    flex-direction: row;
}

.scroll-item-inner {
    display: flex;
    align-items: center;
    width: 562rpx;
    height: 164rpx;
    border-radius: 24rpx;
    background-color: #fff;
    flex-direction: row;
}

.scroll-item-left {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    width: 160rpx;
    flex-direction: row;
    flex-shrink: 0;
}

.scroll-item-money-unit {
    color: #f95b56;
    font-size: 28rpx;
    font-weight: 600;
    line-height: 34rpx;
}

.scroll-item-money-value {
    margin-left: 8rpx;
    color: #f95b56;
    font-size: 56rpx;
    font-weight: 600;
    line-height: 56rpx;
}

.scroll-item-spliter {
    height: 164rpx;
    border-right: 2rpx dashed #e0e0e0;
}

.scroll-item-right {
    display: flex;
    justify-content: center;
    align-items: stretch;
    padding-left: 50rpx;
    flex: 1;
    flex-direction: column;
    box-sizing: border-box;
}

.scroll-item-title {
    color: #333333;
    font-size: 28rpx;
    font-weight: 500;
    line-height: 40rpx;
}

.scroll-item-sub-title {
    margin-top: 8rpx;
    color: #999999;
    font-size: 20rpx;
    font-weight: 500;
    line-height: 28rpx;
}

.scroll-item-decorate,
.scroll-item-decorate2 {
    position: absolute;
    top: -8rpx;
    left: 144rpx;
    width: 32rpx;
    height: 32rpx;
    border-radius: 32rpx;
    background-color: rgba(253, 61, 51, 1);
}

.scroll-item-decorate2 {
    top: 160rpx;
}

.scroll-decorate1 {
    position: absolute;
    right: 0;
    bottom: 380rpx;
    width: 120rpx;
    height: 120rpx;
}

.scroll-decorate2,
.scroll-decorate3 {
    position: absolute;
    width: 38rpx;
    height: 36rpx;
}

.scroll-decorate2 {
    top: 42rpx;
    right: 32rpx;
}

.scroll-decorate3 {
    bottom: 380rpx;
    left: 42rpx;
    transform: rotate(180deg);
}
</style>
@/api/activity/newcomer-special/types
