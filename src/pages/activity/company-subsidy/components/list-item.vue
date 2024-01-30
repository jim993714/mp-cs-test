<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { IZoneGoodsList } from '@/api/activity/company-subsidy/types';

const props = defineProps<{
    item: IZoneGoodsList;
}>();

const goDetail = () => {
    router.push('goodsDetailSummer', {
        actGoodsNo: props.item.actGoodsNo,
        zoneId: props.item.zoneId,
        goodsNo: props.item.goodsNo
    });
};
</script>

<template>
    <view
        class="goods-item"
        @tap.prevent="goDetail"
    >
        <image
            class="goods-cover"
            :src="item.goodsCover"
            mode="scaleToFill"
        />
        <view class="goods-title ellipsis">{{ item.goodsTitle }}</view>
        <view class="goods-price-warp">
            <view class="goods-price-left">
                <view class="goods-price-active">
                    <view class="goods-price-label">活动价</view>
                    <zd-price
                        :value="item.vacationPrice"
                        color="red"
                        :font-size-large="32"
                        :font-size-small="24"
                        :font-size-unit="20"
                    ></zd-price>
                </view>
                <view class="goods-price-line">￥{{ item.goodsPrice }}</view>
            </view>
            <view class="goods-price-right">
                <text class="goods-price-right-num">{{ item.discount }}</text>
                <text class="goods-price-right-text">折</text>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.goods-item {
    display: flex;
    align-items: center;
    overflow: hidden;
    width: 346rpx;
    height: 484rpx;
    margin-bottom: 20rpx;
    border-radius: 12rpx;
    background: #ffffff;
    flex-direction: column;
    box-sizing: border-box;
    .goods-cover {
        width: 346rpx;
        height: 328rpx;
    }
    .goods-title {
        width: 346rpx;
        margin-bottom: 20rpx;
        padding: 16rpx 16rpx 0;
        color: #292f33;
        font-size: 24rpx;
        font-weight: 400;
        box-sizing: border-box;
        line-height: 24rpx;
    }
    .goods-price-warp {
        display: flex;
        justify-content: space-between;
        width: 314rpx;
        height: 80rpx;
        padding: 0 8rpx;
        background-size: 100% 100%;
        box-sizing: border-box;
        background-image: url('https://cdn.zsdx.cn/mp-cs/images/activity/company-subsidy/price-bg.png');
        .goods-price-left {
            margin-top: 10rpx;
            .goods-price-active {
                display: flex;
                flex-direction: row;
                align-items: flex-end;
                .goods-price-label {
                    margin-right: 4rpx;
                    color: #ff3119;
                    font-size: 20rpx;
                    font-weight: 400;
                    line-height: 20rpx;
                }
            }
            .goods-price-line {
                margin-top: 10rpx;
                text-decoration: line-through;
                color: #999999;
                font-size: 20rpx;
                font-weight: 400;
                line-height: 20rpx;
            }
        }
        .goods-price-right {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            width: 72rpx;
            padding-bottom: 18rpx;
            flex-direction: row;
        }
        .goods-price-right-num {
            color: #ffffff;
            font-size: 48rpx;
            font-family: Bebas Neue;
            line-height: 40rpx;
        }
        .goods-price-right-text {
            position: relative;
            z-index: 9;
            color: #ffffff;
            font-size: 24rpx;
            font-weight: 600;
        }
    }
}
</style>
