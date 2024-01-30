<script lang="ts" setup>
import type { PropType } from 'vue';

import type { IGridGoodsDetailList, IGridList } from '@/api/home/types';

import type { IThemeConfig } from '../../type';
import { fnGetGridHeadBg, fnGoDetail } from '../../utils';

const titleFilter = (val: number) => {
    switch (val) {
        case 1:
            return '超值补贴';
        case 2:
            return '新品专区';
        case 3:
            return '爆款跟买';
        case 4:
            return '校园团';
        case 5:
            return '组合包';
        case 6:
            return '秒杀';
        default:
            return '';
    }
};
const props = defineProps({
    theme: {
        type: Object as PropType<IThemeConfig>,
        default: () => {
            return {};
        }
    },
    list: {
        type: Object as PropType<IGridList>,
        default: () => {
            return {};
        }
    }
});

const goDetail = (list: IGridList, goods?: IGridGoodsDetailList) => {
    fnGoDetail(list);
};
</script>

<template>
    <view class="grid-odd-worth-subsidy">
        <image
            v-if="props.list.image"
            class="grid-bg"
            :src="props.list.image"
            mode="widthFix"
            @tap.prevent="goDetail(props.list)"
        ></image>
        <view
            v-if="props.list.type != 10"
            class="grid-head"
            :style="{
                background: props.list.image ? 'transparent' : fnGetGridHeadBg(props.list.type)
            }"
        >
            <text class="grid-title">{{ props.list.title }}</text>
            <text class="grid-subtitle">{{ props.list.recommendWords }}</text>
        </view>
        <view class="grid-odd-goods-warp">
            <view
                v-for="(current, cIndex) in list.currentPhaseGoodsList"
                :key="cIndex"
                class="grid-odd-goods"
                @tap.prevent="goDetail(props.list, current)"
            >
                <image
                    class="grid-odd-goods-cover"
                    :src="current.goodsCover"
                    mode="aspectFill"
                ></image>
                <text class="grid-goods-name ellipsis">{{ current.goodsTitle }}</text>
                <view class="grid-goods-price">
                    <text class="grid-goods-price-unit">￥</text>
                    <text class="grid-goods-price-num">{{ current.goodsPrice }}</text>
                </view>
            </view>
            <image
                class="grid-goods-tag"
                src="https://cdn.zsdx.cn/mp-cs/images/home/current-bg.png"
                mode="aspectFill"
            ></image>
        </view>
        <view class="grid-odd-goods-warp">
            <view
                v-for="(next, nIndex) in list.nextPhaseGoodsList"
                :key="nIndex"
                class="grid-odd-goods"
                @tap.prevent="goDetail(props.list, next)"
            >
                <image
                    class="grid-odd-goods-cover"
                    :src="next.goodsCover"
                    mode="aspectFill"
                ></image>
                <text class="grid-goods-name ellipsis">{{ next.goodsTitle }}</text>
                <view class="grid-goods-price">
                    <text class="grid-goods-price-unit">￥</text>
                    <text class="grid-goods-price-num">{{ next.goodsPrice }}</text>
                </view>
            </view>
            <image
                class="grid-goods-tag"
                src="https://cdn.zsdx.cn/mp-cs/images/home/next-bg.png"
                mode="aspectFill"
            ></image>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.grid-odd-worth-subsidy {
    position: relative;
    display: flex;
    overflow: hidden;
    width: 348rpx;
    height: 590rpx;
    margin-right: 20rpx;
    border-radius: 16rpx;
    background: #ffffff;
    box-sizing: border-box;
    flex-direction: column;
}

.grid-odd-goods-warp {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-bottom: 28rpx;
    padding: 0rpx 18rpx 0;
    flex-direction: row;
    flex-wrap: wrap;
}

.grid-goods-tag {
    position: absolute;
    top: 0rpx;
    left: 0;
    width: 86rpx;
    height: 38rpx;
}

.grid-odd-goods-cover {
    width: 144rpx;
    height: 144rpx;
    border: 1px solid #ffffff;
    border-radius: 16rpx;
}

.grid-odd-goods {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.grid-item {
    position: relative;
    width: 348rpx;
    height: 294rpx;
    margin: 0 0 20rpx 20rpx;
    padding: 24rpx 18rpx 0rpx;
    border-radius: 16rpx;
    box-sizing: border-box;
}

.grid-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 348rpx;
    border-radius: 16rpx;
}

.grid-head {
    position: relative;
    display: flex;
    align-items: center;
    height: 80rpx;
    padding-left: 20rpx;
    flex-direction: row;
    line-height: 80rpx;
}

.grid-title {
    color: #1b1b1b;
    font-size: 30rpx;
    font-weight: 500;
    line-height: 80rpx;
}

.grid-subtitle {
    margin-left: 10rpx;
    text-align: left;
    color: #728aa2;
    font-size: 22rpx;
    font-weight: 400;
    line-height: 22rpx;
}

.grid-goods-warp {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 30rpx;
}

.grid-goods {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.grid-goods-cover {
    width: 144rpx;
    height: 144rpx;
    margin-bottom: 18rpx;
    border-radius: 16rpx;
}

.grid-goods-price {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
}

.grid-goods-price-unit {
    color: #ff5000;
    font-size: 20rpx;
    font-weight: 400;
    line-height: 32rpx;
}

.grid-goods-price-num {
    color: #ff5000;
    font-size: 26rpx;
    font-family: 'Bebas Neue' !important;
    font-weight: 500;
    line-height: 36rpx;
}

.grid-goods-name {
    width: 144rpx;
    margin: 26rpx 0 6rpx;
    text-align: center;
    color: rgba(0, 0, 0, 0.85);
    font-size: 22rpx;
    font-weight: 400;
    line-height: 22rpx;
}
</style>
