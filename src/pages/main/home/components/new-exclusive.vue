<script lang="ts" setup>
import { router } from '@zsdx/mp-utils';
import type { PropType } from 'vue';

import type { ICouponGoodsItem } from '@/api/activity/newcomer-special/types';
import type { ICouponItem } from '@/api/home/types';

import type { IThemeConfig } from '../type';
import { receiveFilterText } from '../utils';

const props = defineProps({
    /** 图片列表 */
    currentTheme: {
        type: Object as PropType<IThemeConfig>,
        default() {
            return {};
        }
    },
    newFansCoupon: {
        type: Object as PropType<ICouponItem>,
        default() {
            return {};
        }
    },
    goodsList: {
        type: Array as PropType<Array<ICouponGoodsItem>>,
        default() {
            return [];
        }
    },
    studentShopId: {
        type: String,
        default: ''
    }
});

const trackData = {
    type: 'all',
    clientTop: uni.getWindowInfo().windowHeight / 2
};
const fnGoDetail = () => {
    router.push('newComerSpecial');
};
</script>

<template>
    <view
        class="new-exclusive"
        @tap="fnGoDetail"
    >
        <track-view
            :track-data="{
                ...trackData,
                observerName: '.new-exclusive',
                eventData: {
                    path: 'bi_event',
                    student_shop_id: props.studentShopId,
                    element_name: '新人专享',
                    data_type: 'Banner',
                    data_info: props.newFansCoupon
                }
            }"
        >
            <view
                class="new-exclusive-warp"
                :style="{
                    background: !props.currentTheme.newExclusive.backgroundImage
                        ? props.currentTheme.newExclusive.background
                        : ''
                }"
            >
                <image
                    class="item-bg"
                    :src="props.currentTheme.newExclusive.backgroundImage"
                    mode="widthFix"
                />
                <view class="new-exclusive-head">
                    <image
                        :src="props.currentTheme.newExclusive.titleImg"
                        mode="aspectFill"
                        class="head-img"
                    />
                    <text
                        class="head-title"
                        :style="{
                            color: props.currentTheme.newExclusive.color
                                ? props.currentTheme.newExclusive.color
                                : '#7a8c99'
                        }"
                        >优惠福利立即领取</text
                    >
                </view>
                <view class="list-info">
                    <view class="coupon-wrap-multi">
                        <image
                            :src="props.currentTheme.newExclusive.couponImg"
                            mode="widthFix"
                            class="coupon-img"
                        />
                        <view class="coupon-wrap-multi-money">
                            <text class="coupon-wrap-multi-money-unit">￥</text>
                            <view class="coupon-wrap-multi-money-number">{{
                                props.newFansCoupon.money
                            }}</view>
                        </view>
                        <text class="coupon-count">共{{ props.newFansCoupon.couponNum }}张</text>
                        <text
                            class="coupon-wrap-multi-bottom"
                            :style="{
                                opacity: props.newFansCoupon.status > 1 ? 0.6 : 1
                            }"
                        >
                            {{ receiveFilterText(props.newFansCoupon.receiveStatus) }}
                        </text>
                    </view>
                    <view
                        v-for="(item, index) in props.goodsList"
                        :key="index"
                        class="goods-wrap-multi"
                        :style="{
                            background: props.currentTheme.newExclusive.goodsItemBg
                        }"
                    >
                        <view class="goods-cover-box">
                            <view class="goods-cover-mask"></view>
                            <image
                                class="goods-cover"
                                :src="item.goodsCover"
                                mode="aspectFill"
                            ></image>
                        </view>
                        <view class="coupon-wrap-multi-bottom">
                            <text class="coupon-warp-bottom-unit">￥</text>
                            <text class="coupon-warp-bottom-num">{{ item.goodsPrice }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </track-view>
    </view>
</template>

<style lang="scss" scoped>
.new-exclusive {
    width: 750rpx;
    height: 364rpx;
    margin-top: 20rpx;
    padding: 0 20rpx;
    box-sizing: border-box;
}
.item-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 710rpx;
    height: 364rpx;
}
.new-exclusive-warp {
    position: relative;
    overflow: hidden;
    width: 710rpx;
    height: 364rpx;
    padding: 28rpx 20rpx 18rpx;
    border-radius: 16rpx;
    box-sizing: border-box;
}
.new-exclusive-head {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
}
.head-img {
    width: 144rpx;
    height: 28rpx;
}
.head-title {
    margin-left: 20rpx;
    color: #7a8c99;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 24rpx;
}
.list-info {
    display: flex;
    flex-direction: row;
    margin-top: 18rpx;
}
.goods-wrap-multi {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    width: 216rpx;
    height: 272rpx;
    margin-right: 18rpx;
    border: 1px solid #ffffff;
    border-radius: 32rpx;
    flex-direction: column;
}
.coupon-wrap-multi {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 216rpx;
    height: 272rpx;
    margin-right: 36rpx;
    border-radius: 32rpx;
    flex-direction: column;
    box-sizing: border-box;
}

.coupon-wrap-multi-money {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-top: 62rpx;
    flex-direction: row;
}

.coupon-wrap-multi-money-unit {
    margin-bottom: 10rpx;
    color: #292f33;
    font-size: 24rpx;
    font-weight: 400;
}

.coupon-wrap-multi-money-number {
    color: #292f33;
    font-size: 80rpx;
    font-family: 'Bebas Neue' !important;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 400;
    line-height: 80rpx;
}

.coupon-count {
    position: relative;
    color: #ff8026;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 34rpx;
}

.coupon-wrap-multi-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 58rpx;
    border-radius: 0 0 32rpx 32rpx;
    text-align: center;
    color: #ffffff;
    font-size: 26rpx;
    font-weight: 600;
    line-height: 58rpx;
}

.coupon-warp-bottom-num {
    height: 58rpx;
    color: #ffffff;
    font-size: 36rpx;
    font-family: 'Bebas Neue' !important;
    font-weight: 600;
    line-height: 58rpx;
}

.coupon-warp-bottom-unit {
    height: 58rpx;
    color: #ffffff;
    font-size: 24rpx;
    font-weight: 600;
    line-height: 58rpx;
}
.goods-cover-box {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 212rpx;
    height: 212rpx;
}
.goods-cover-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 212rpx;
    height: 212rpx;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.5) 100%);
}
.goods-cover {
    position: relative;
    width: 160rpx;
    height: 160rpx;
}
.coupon-img {
    position: absolute;
    top: 0rpx;
    left: -1rpx;
    width: 216rpx;
    height: 272rpx;
}
</style>
