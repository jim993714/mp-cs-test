<script lang="ts" setup>
import type { PropType } from 'vue';

import type { IGridGoodsDetailList, IGridList } from '@/api/home/types';

import type { IThemeConfig } from '../../type';
import { fnGoDetail } from '../../utils';

const props = defineProps({
    list: {
        type: Object as PropType<IGridList>,
        default: () => {
            return {};
        }
    },
    theme: {
        type: Object as PropType<IThemeConfig>,
        default: () => {
            return {};
        }
    },
    goods: {
        type: Object as PropType<IGridGoodsDetailList>,
        default: () => {
            return {};
        }
    },
    studentShopId: {
        type: String,
        default: ''
    }
});

const discountNum = computed(() => {
    return props.goods.discountNum;
});
const goDetail = (list: IGridList) => {
    fnGoDetail(list);
};
</script>

<template>
    <view
        class="grid-coupon"
        @tap.prevent="goDetail(props.list)"
    >
        <image
            class="grid-coupon-bg"
            src="https://cdn.zsdx.cn/mp-cs/images/home/coupon-bg.png"
            mode="aspectFill"
        ></image>
        <view class="grid-coupon-price">
            <text class="grid-coupon-price-unit">￥</text>
            <text class="grid-coupon-price-num">{{ discountNum }}</text>
        </view>
        <text class="grid-coupon-btn">{{ goods.isReceived ? '已领取' : '领取' }}</text>
    </view>
</template>
<style lang="scss" scoped>
.grid-coupon-price {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 132rpx;
    flex-direction: row;
}

.grid-coupon-price-unit {
    margin-top: 10rpx;
    color: #6c5aaa;
    font-size: 28rpx;
    font-weight: 500;
}

.grid-coupon-price-num {
    color: #6c5aaa;
    font-size: 52rpx;
    font-family: 'Bebas Neue' !important;
    font-weight: 500;
}

.grid-coupon-bg {
    position: absolute;
    top: 0;
    left: 6rpx;
    width: 132rpx;
    height: 132rpx;
}

.grid-coupon-btn {
    margin-top: 28rpx;
    padding: 4rpx 20rpx;
    border-radius: 18rpx;
    color: #ffffff;
    font-size: 20rpx;
    font-weight: 400;
    background: linear-gradient(to right, #bfa4fb, #8b6bf5);
    line-height: 28rpx;
}
.grid-coupon {
    position: relative;
    display: flex;
    align-items: center;
    width: 144rpx;
    height: 188rpx;
    flex-direction: column;
}
</style>
