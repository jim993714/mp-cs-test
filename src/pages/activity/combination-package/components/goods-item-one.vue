<script setup lang="ts">
import dayjs from 'dayjs';

import type { IPackageList } from '@/api/activity/combination-package/types';

const props = defineProps<{
    data: IPackageList;
}>();
const goTo = (item: IPackageList) => {
    emit('goTo', item);
};
const formatDate = (date: number) => {
    return dayjs(date).format('MM-DD');
};
const emit = defineEmits(['goTo']);
</script>

<template>
    <view
        class="goods-item"
        @tap.prevent="goTo(props.data)"
    >
        <view class="goods-mask"></view>
        <view class="item-head"> {{ props.data.categoryName }} </view>
        <view class="item">
            <view
                v-for="(goods, index) in props.data.goodsList"
                :key="index"
                class="item-box"
            >
                <image
                    class="goods-cover"
                    :class="{ 'goods-cover-three': props.data.goodsNum === 3 }"
                    :src="goods.goodsCover"
                    mode="scaleToFill"
                />
                <view class="goods-price">￥{{ goods.goodsPrice }}</view>
            </view>
        </view>
        <view class="goods-title ellipsis">{{ props.data.packageTitle }}</view>
        <view class="goods-price-warp">
            <view class="price-label">一口价</view>
            <zd-price
                :value="props.data.fixedMoney"
                :font-size-large="40"
                :font-size-small="28"
                :font-size-unit="20"
                color="#ffffff"
            ></zd-price>
            <view class="original-price">原价￥{{ props.data.originPrice }}</view>
            <image
                class="btn-icon"
                src="https://cdn.zsdx.cn/mp-cs/images/activity/combination-package/qiang.png"
                mode="scaleToFill"
            />
        </view>

        <view class="time-tag">{{ formatDate(props.data.startTime) }}开始</view>
    </view>
</template>

<style lang="scss" scoped>
.goods-item {
    position: relative;
    width: 710rpx;
    margin-top: 20rpx;
    padding: 32rpx 14rpx 20rpx;
    border-radius: 16rpx;
    background: #ffffff;
    box-sizing: border-box;
    .goods-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 710rpx;
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
    .item {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16rpx;
        margin-left: 8rpx;
        flex-direction: row;
        .item-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            .goods-cover {
                width: 156rpx;
                height: 156rpx;
                border-radius: 8rpx;
            }
            .goods-cover-three {
                width: 210rpx;
                height: 210rpx;
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
    }
    .goods-title {
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
        width: 674rpx;
        height: 96rpx;
        margin-top: 16rpx;
        padding: 34rpx 0 32rpx 40rpx;
        background-size: cover;
        background-image: url('https://cdn.zsdx.cn/mp-cs/images/activity/combination-package/price-tag-big.png');
        box-sizing: border-box;

        .price-label {
            margin-right: 10rpx;
            margin-bottom: 2rpx;
            color: #ffffff;
            font-size: 24rpx;
            font-weight: 400;
            line-height: 24rpx;
        }
        .original-price {
            margin-bottom: 2rpx;
            margin-left: 20rpx;
            color: #ffffff;
            font-size: 20rpx;
            font-weight: 400;
            line-height: 20rpx;
        }
        .btn-icon {
            position: absolute;
            top: 30rpx;
            right: 84rpx;
            width: 128rpx;
            height: 28rpx;
        }
    }
    .time-tag {
        position: absolute;
        top: 24rpx;
        right: -8rpx;
        width: 184rpx;
        height: 54rpx;
        padding-left: 30rpx;
        color: #ffffff;
        font-size: 28rpx;
        font-weight: 500;
        background-size: cover;
        background-image: url('https://cdn.zsdx.cn/mp-cs/images/activity/combination-package/time-tag.png');
        line-height: 44rpx;
    }
}
</style>
