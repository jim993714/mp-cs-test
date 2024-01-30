<script setup lang="ts">
import { router, storage } from '@zsdx/mp-utils';

import type { IGoodsList } from '@/api/activity/discount-area/types';

const localStorage = storage();

const props = defineProps<{
    list: IGoodsList[];
    activityNo: string;
    timeId: string;
    currentStatus: number;
    date: string;
    categoryName?: string;
}>();

const trackData = {
    type: 'all',
    clientTop: uni.getWindowInfo().windowHeight / 2
};
const goTo = (goodsNo: string, id: number) => {
    router.push('goodsDetailDiscount', {
        goodsNo,
        activityNo: props.activityNo,
        timeId: id,
        date: props.date
    });
};
</script>

<template>
    <view class="goods-list">
        <view
            v-for="(item, index) in props.list"
            :key="item.actGoodsNo"
        >
            <track-view
                :track-data="{
                    ...trackData,
                    observerName: '.discount-goods' + index,
                    eventData: {
                        path: 'bi_feeds',
                        student_shop_id: localStorage.get('studentShopId'),
                        page_data_type: 'discountArea',
                        page_data_id: props.activityNo,
                        data_type: 'Goods',
                        data_id: item.goodsNo,
                        data_info: item,
                        nav_name: props.categoryName,
                        index
                    }
                }"
            >
                <view
                    class="list-item"
                    @tap.prevent="goTo(item.goodsNo, item.timeId)"
                >
                    <image
                        class="goods-cover"
                        :src="item.goodsCover"
                        mode="scaleToFill"
                    />
                    <view class="goods-title ellipsis">{{ item.goodsTitle }}</view>
                    <view class="goods-discount">
                        <image
                            :src="`https://cdn.zsdx.cn/mp-cs/images/activity/discount-area/price-bg${
                                props.currentStatus === 2 ? '3' : '2'
                            }.png`"
                            class="goods-discount-img"
                            mode="scaleToFill"
                        />
                        <view class="goods-discount-left">
                            <view class="activity-price">
                                <view
                                    class="activity-price-label"
                                    :style="{
                                        color: props.currentStatus === 2 ? '#ffffff' : '#FF4734'
                                    }"
                                    >活动价</view
                                >
                                <zd-price
                                    :value="item.vacationPrice"
                                    :font-size-large="36"
                                    :font-size-small="24"
                                    :font-size-unit="20"
                                    :color="props.currentStatus === 2 ? '#ffffff' : '#FF4734'"
                                ></zd-price>
                            </view>
                            <view class="student-price">
                                <!-- <view class="student-price-label">学生价</view> -->
                                <view
                                    class="student-price-num"
                                    :style="{
                                        color: props.currentStatus === 2 ? '#ffffff' : '#999999'
                                    }"
                                    >￥{{ item.goodsPrice }}</view
                                >
                            </view>
                        </view>
                        <view
                            v-if="props.currentStatus == 2"
                            class="goods-discount-warp"
                        >
                            <zd-price
                                :value="item.subsidyMoney"
                                :font-size-large="28"
                                :font-size-small="28"
                                :font-size-unit="20"
                                color="#833D00"
                            ></zd-price>
                            <view class="goods-discount-label">立减</view>
                        </view>
                    </view>
                </view>
            </track-view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.goods-list {
    z-index: -1;
    display: flex;
    justify-content: space-between;
    width: 750rpx;
    padding: 0 20rpx;
    background: #f5f8fa;
    flex-wrap: wrap;
    box-sizing: border-box;
    .list-item {
        display: flex;
        align-items: center;
        overflow: hidden;
        width: 348rpx;
        height: 524rpx;
        margin-bottom: 20rpx;
        border-radius: 12rpx;
        box-sizing: border-box;
        flex-direction: column;
        background: #ffffff;
        .goods-cover {
            width: 348rpx;
            height: 348rpx;
        }
        .goods-title {
            width: 308rpx;
            margin-top: 20rpx;
            color: #292f33;
            font-size: 28rpx;
            font-weight: 400;
            line-height: 40rpx;
        }
        .goods-discount {
            position: relative;
            display: flex;
            justify-content: space-between;
            width: 308rpx;
            height: 80rpx;
            margin-top: 16rpx;
            border-radius: 8rpx;
            background-size: cover;
            box-sizing: border-box;
            .goods-discount-img {
                position: absolute;
                top: 0;
                left: 0;
                width: 308rpx;
                height: 80rpx;
            }
            .goods-discount-left {
                position: relative;
                display: flex;
                padding-left: 12rpx;
                flex-direction: column;
            }
            .activity-price {
                display: flex;
                align-items: flex-end;
                margin-top: 6rpx;
                .activity-price-label {
                    margin-right: 4rpx;
                    color: #ffffff;
                    font-size: 20rpx;
                    font-weight: 400;
                    line-height: 20rpx;
                }
            }
            .student-price {
                display: flex;
                margin-top: 12rpx;
                .student-price-label {
                    margin-right: 4rpx;
                    color: #ffffff;
                    font-size: 20rpx;
                    font-weight: 400;
                    line-height: 20rpx;
                }
                .student-price-num {
                    text-decoration: line-through;
                    color: #ffffff;
                    font-size: 20rpx;
                    font-weight: 400;
                    line-height: 20rpx;
                }
            }
            .goods-discount-warp {
                position: relative;
                right: 12rpx;
                display: flex;
                align-items: center;
                width: 94rpx;
                flex-direction: column;
                height: 80rpx;
                .goods-discount-label {
                    margin-top: 10rpx;
                    margin-right: 4rpx;
                    color: #833d00;
                    font-size: 16rpx;
                    font-weight: 500;
                    line-height: 20rpx;
                }
            }
        }
    }
}
</style>
