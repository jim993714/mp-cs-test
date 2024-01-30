<script setup lang="ts">
import dayjs from 'dayjs';

import type { IList, IPackageList } from '@/api/activity/combination-package/types';

const formatDate = (date: number) => {
    return dayjs(date).format('MM-DD');
};
const props = defineProps<{
    data: IList;
    repairImage: string;
}>();

const goTo = (item: IPackageList) => {
    emit('goTo', item);
};
const emit = defineEmits(['goTo']);
</script>

<template>
    <view class="goods-item-warp">
        <view
            v-for="(list, index) in props.data.list"
            :key="index"
            class="item"
            @tap.prevent="goTo(list)"
        >
            <view class="item-mask"></view>
            <view class="item-head"> {{ list.categoryName }}</view>
            <view class="time-tag">{{ formatDate(list.startTime) }}开始</view>
            <view class="goods-box">
                <view
                    v-for="(goods, gIndex) in list.goodsList"
                    :key="gIndex"
                    class="goods-item"
                >
                    <image
                        class="goods-cover"
                        :src="goods.goodsCover"
                        mode="scaleToFill"
                    />
                    <view class="goods-price">￥{{ goods.goodsPrice }}</view>
                </view>
            </view>
            <view class="item-title ellipsis2">{{ list.packageTitle }}</view>
            <view class="goods-price-warp">
                <view class="price-label">一口价</view>
                <zd-price
                    :value="list.fixedMoney"
                    :font-size-large="40"
                    :font-size-small="28"
                    :font-size-unit="20"
                    color="#ffffff"
                ></zd-price>
            </view>
        </view>
        <view
            v-if="props.data.list.length === 1"
            class="item-bg"
            :style="{
                backgroundImage: `url(${props.repairImage})`
            }"
        ></view>
    </view>
</template>

<style lang="scss" scoped>
.goods-item-warp {
    display: flex;
    justify-content: space-between;
    width: 710rpx;
    margin-top: 20rpx;
    .item {
        position: relative;
        width: 350rpx;
        height: 522rpx;
        padding: 36rpx 22rpx 32rpx 14rpx;
        border-radius: 16rpx;
        background: #ffffff;
        box-sizing: border-box;

        .item-mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 350rpx;
            height: 172rpx;
            border-radius: 16rpx;
            background: linear-gradient(180deg, #ffccc0 0%, #ffffff 100%);
        }
        .item-head {
            position: relative;
            width: 184rpx;
            height: 42rpx;
            text-align: center;
            color: #ffffff;
            font-size: 28rpx;
            font-weight: 600;
            background-size: cover;
            background-image: url('https://cdn.zsdx.cn/mp-cs/images/activity/combination-package/title-tag.png');
            line-height: 42rpx;
        }
        .time-tag {
            position: absolute;
            top: 38rpx;
            right: -8rpx;
            width: 148rpx;
            height: 54rpx;
            padding-left: 18rpx;
            color: #ffffff;
            font-size: 28rpx;
            font-weight: 500;
            background-size: cover;
            background-image: url('https://cdn.zsdx.cn/mp-cs/images/activity/combination-package/time-tag.png');
            line-height: 44rpx;
        }
        .goods-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
            margin-left: 8rpx;
        }
        .goods-item {
            position: relative;
            display: flex;
            align-items: center;
            flex-direction: column;
            margin-top: 16rpx;
            .goods-cover {
                width: 144rpx;
                height: 144rpx;
                border-radius: 8rpx;
            }
            .goods-price {
                margin-top: 12rpx;
                text-decoration: line-through;
                color: #8a9399;
                font-size: 28rpx;
                font-weight: 400;
                line-height: 32rpx;
            }
        }
        .item-title {
            height: 88rpx;
            margin-top: 20rpx;
            margin-left: 8rpx;
            color: #292f33;
            font-size: 30rpx;
            font-weight: 500;
            line-height: 44rpx;
        }
        .goods-price-warp {
            position: relative;
            display: flex;
            align-items: flex-end;
            width: 312rpx;
            height: 96rpx;
            margin-top: 20rpx;
            padding: 24rpx 40rpx 32rpx 40rpx;
            background-size: cover;
            background-image: url('https://cdn.zsdx.cn/mp-cs/images/activity/combination-package/price-tag-small.png');
            box-sizing: border-box;

            .price-label {
                margin-right: 10rpx;
                margin-bottom: 2rpx;
                color: #ffffff;
                font-size: 24rpx;
                font-weight: 400;
                line-height: 24rpx;
            }
        }
    }
    .item-bg {
        width: 344rpx;
        height: 522rpx;
        border-radius: 16rpx;
        background-size: cover;
    }
}
</style>
