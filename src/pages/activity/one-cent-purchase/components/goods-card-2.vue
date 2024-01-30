<script setup lang="ts">
import type { GoodsItem } from '@/api/activity/one-cent-purchase/types';

defineProps<{
    /** 详情 */
    detail: GoodsItem;
}>();
</script>

<template>
    <view class="card-wrapper">
        <view class="cover">
            <image
                :src="detail.goodsImage"
                mode="scaleToFill"
            />
        </view>
        <view class="content">
            <view class="title ellipsis"> {{ detail.goodsTitle }}</view>
            <view class="price-block">
                <view class="text-left">¥{{ detail.originPrice }}</view>
                <view class="text-center-block">
                    <zd-price
                        class="text-center-block"
                        :value="(detail.goodsPrice ?? 0) * 1"
                        :font-size-large="40"
                        :font-size-small="24"
                        :font-size-unit="20"
                        color="#FF4734"
                    ></zd-price>
                    <text class="text-center-bottom"> 已补贴{{ detail.subsidyPrice }}元 </text>
                </view>
                <view
                    class="text-right"
                    style="text-align: right"
                    >即将恢复</view
                >
            </view>
            <view class="btn"> 马上抢 </view>
        </view>
    </view>
</template>

<style scoped lang="scss">
.card-wrapper {
    display: flex;
    width: 710rpx;
    height: 268rpx;
    margin-bottom: 20rpx;
    padding: 20rpx;
    border-radius: 16rpx;
    background-color: #fff;
    flex-direction: row;
    box-sizing: border-box;
    .cover {
        width: 228rpx;
        height: 228rpx;
        border-radius: 16rpx;
        background-color: rgba($color: #fff, $alpha: 1);
        image {
            width: 100%;
            height: 100%;
            background-color: red;
        }
    }
    .content {
        display: flex;
        flex-direction: column;
        margin-left: 20rpx;
        .title {
            max-width: 442rpx;
            font-size: 28rpx;
        }
        .price-block {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 422rpx;
            height: 72rpx;
            margin-top: 16rpx;
            background: url(https://cdn.zsdx.cn/mp-cs/images/activity/one-cent-purchase/curve.png);
            background-size: 100% 100%;
            .text-left,
            .text-right {
                color: $uni-text-color-placeholder;
                font-size: 20rpx;
                flex: 1;
            }
            .text-center-block {
                display: flex;
                flex-direction: column;
                align-items: center;
                height: 100%;
                flex: 1;
                margin-bottom: 10rpx;
                .text-center-bottom {
                    margin-bottom: -28rpx;
                    color: $zd-color-red;
                    font-size: 20rpx;
                }
            }
        }
        .btn {
            width: 160rpx;
            height: 60rpx;
            margin-top: 40rpx;
            border-radius: 30rpx;
            text-align: center;
            color: #fff;
            background: linear-gradient(90deg, #ff6a4d 0%, #f03b42 100%);
            line-height: 60rpx;
            align-self: flex-end;
        }
    }
}
</style>
