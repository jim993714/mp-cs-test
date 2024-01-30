<script lang="ts" setup>
import type { PropType } from 'vue';

import type { IGridList } from '@/api/home/types';

import type { IThemeConfig } from '../../type';
import { fnGetGridHeadBg, fnGoDetail } from '../../utils';
import gridCoupon from './grid-coupon.vue';

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
    },
    studentShopId: {
        type: String,
        default: ''
    }
});
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

const goDetail = (list: IGridList) => {
    fnGoDetail(list);
};
</script>

<template>
    <view class="grid-odd-item-left">
        <image
            v-if="props.list.image"
            class="grid-bg"
            :src="props.list.image"
            mode="aspectFill"
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
            <template
                v-for="(goods, gIndex) in props.list.goodsDetailList"
                :key="gIndex"
            >
                <!-- 商品的type 1 为商品， 2 为优惠券 -->
                <view
                    v-if="goods.type == 1"
                    class="grid-odd-goods"
                    @tap.prevent="goDetail(props.list)"
                >
                    <image
                        class="grid-odd-goods-cover"
                        :src="goods.goodsCover"
                        mode="aspectFill"
                    ></image>
                    <text class="grid-goods-name ellipsis">{{ goods.goodsTitle }}</text>
                    <view class="grid-goods-price">
                        <text class="grid-goods-price-unit">￥</text>
                        <text class="grid-goods-price-num">{{ goods.goodsPrice }}</text>
                    </view>
                </view>
                <view
                    v-else
                    class="coupon-warp"
                >
                    <grid-coupon
                        :student_shop_id="studentShopId"
                        :goods="goods"
                        :theme="props.theme"
                        :list="props.list"
                    ></grid-coupon>
                </view>
            </template>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.grid-odd-item-left {
    position: relative;
    overflow: hidden;
    width: 348rpx;
    height: 590rpx;
    margin-right: 14rpx;
    border-radius: 16rpx;
    background: #ffffff;
    box-sizing: border-box;
}
.grid-odd-goods-warp {
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 6rpx 20rpx 0;
}

.grid-odd-goods {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 240rpx;
}

.grid-odd-goods-cover {
    width: 144rpx;
    height: 144rpx;
    border-radius: 16rpx;
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

.grid-odd-item-bottom {
    display: flex;
    flex-direction: row;
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
    height: 100%;
}

.grid-head {
    position: relative;
    display: flex;
    height: 80rpx;
    padding-left: 20rpx;
    flex-direction: row;
}

.grid-title {
    color: #1b1b1b;
    font-size: 30rpx;
    font-weight: 500;
    line-height: 80rpx;
}

.grid-subtitle {
    margin-left: 10rpx;
    color: #576066;
    font-size: 24rpx;
    font-weight: 400;
}

.grid-goods-warp {
    display: flex;
    flex-direction: row;
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
    font-family: PingFangSC-Medium, PingFang SC;
    font-family: 'Bebas Neue' !important;
    font-weight: 500;
    line-height: 36rpx;
}
</style>
