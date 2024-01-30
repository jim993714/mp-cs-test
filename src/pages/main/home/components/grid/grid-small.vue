<script lang="ts" setup>
import type { PropType } from 'vue';

import type { IGridGoodsDetailList, IGridList } from '@/api/home/types';

import type { IThemeConfig } from '../../type';
import { fnGetGridHeadBg, fnGoDetail } from '../../utils';
import gridCoupon from './grid-coupon.vue';

const trackData = {
    type: 'all',
    clientTop: uni.getWindowInfo().windowHeight / 2
};

const props = defineProps({
    theme: {
        type: Object as PropType<IThemeConfig>,
        default: () => {
            return {};
        }
    },
    list: {
        type: Array as PropType<Array<IGridList>>,
        default: () => {
            return [];
        }
    },
    direction: {
        type: String,
        default: 'column'
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

const goDetail = (list: IGridList, goods?: IGridGoodsDetailList) => {
    fnGoDetail(list);
};
</script>

<template>
    <view
        class="grid-odd-item"
        :style="{ width: props.direction == 'column' ? '348rpx' : '710rpx' }"
    >
        <track-view
            v-for="(item, index) in props.list"
            :key="index"
            :track-data="{
                ...trackData,
                observerName: '.grid-big' + index,
                eventData: {
                    path: 'bi_event',
                    student_shop_id: props.studentShopId,
                    element_name: '首页活动坑位',
                    data_type: 'Banner',
                    data_id: item.appAction,
                    data_info: item
                }
            }"
        >
            <view
                class="grid-item"
                @tap.prevent="goDetail(item)"
            >
                <image
                    v-if="item.image"
                    class="grid-bg"
                    :src="item.image"
                    mode="aspectFill"
                >
                </image>
                <view
                    v-if="item.type != 10"
                    class="grid-head"
                    :style="{ background: item.image ? '' : fnGetGridHeadBg(item.type) }"
                >
                    <text class="grid-title">{{ item.title }}</text>
                    <text class="grid-subtitle">{{ item.recommendWords }}</text>
                </view>
                <view
                    v-if="item.type == 1"
                    class="grid-goods-warp"
                >
                    <view
                        v-if="item.currentPhaseGoodsList.length > 0"
                        class="grid-odd-goods"
                        @tap.prevent="goDetail(item, item.currentPhaseGoodsList[0])"
                    >
                        <image
                            class="grid-odd-goods-cover"
                            :src="item.currentPhaseGoodsList[0].goodsCover"
                            mode="aspectFill"
                        ></image>
                        <view class="grid-goods-price">
                            <text class="grid-goods-price-unit">￥</text>
                            <text class="grid-goods-price-num">{{
                                item.currentPhaseGoodsList[0].goodsPrice
                            }}</text>
                        </view>
                    </view>
                    <view
                        v-if="item.nextPhaseGoodsList.length > 0"
                        class="grid-odd-goods"
                        @tap.prevent="goDetail(item, item.nextPhaseGoodsList[0])"
                    >
                        <image
                            class="grid-odd-goods-cover"
                            :src="item.nextPhaseGoodsList[0].goodsCover"
                            mode="aspectFill"
                        ></image>
                        <view class="grid-goods-price">
                            <text class="grid-goods-price-unit">￥</text>
                            <text class="grid-goods-price-num">{{
                                item.nextPhaseGoodsList[0].goodsPrice
                            }}</text>
                        </view>
                    </view>
                </view>
                <view
                    v-else
                    class="grid-goods-warp"
                >
                    <template
                        v-for="(goods, gIndex) in item.goodsDetailList"
                        :key="gIndex"
                    >
                        <view
                            v-if="goods.type == 1"
                            :key="gIndex"
                            class="grid-odd-goods"
                        >
                            <image
                                class="grid-odd-goods-cover"
                                :src="goods.goodsCover"
                                mode="aspectFill"
                            ></image>
                            <view class="grid-goods-price">
                                <text class="grid-goods-price-unit">￥</text>
                                <text class="grid-goods-price-num">{{ goods.goodsPrice }}</text>
                            </view>
                        </view>
                        <grid-coupon
                            v-else
                            :student_shop_id="studentShopId"
                            :goods="goods"
                            :theme="theme"
                            :list="item"
                        ></grid-coupon>
                    </template>
                </view>
            </view>
        </track-view>
    </view>
</template>

<style lang="scss" scoped>
.grid-odd-item {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
}

.grid-odd-goods {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.grid-odd-goods-cover {
    width: 144rpx;
    height: 144rpx;
}

.grid-item {
    position: relative;
    overflow: hidden;
    width: 348rpx;
    height: 288rpx;
    margin-bottom: 20rpx;
    border-radius: 16rpx;
    background: #ffffff;
    box-sizing: border-box;
}

.grid-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 348rpx;
    height: 288rpx;
    border-radius: 16rpx;
}

.grid-head {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 80rpx;
    padding-left: 20rpx;
}

.grid-title {
    color: #1b1b1b;
    font-size: 30rpx;
    font-weight: 500;
    line-height: 30rpx;
}

.grid-subtitle {
    margin-left: 10rpx;
    color: #576066;
    font-size: 24rpx;
    font-weight: 400;
}

.grid-goods-warp {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 0 20rpx;
    flex-direction: row;
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
    justify-content: center;
    align-items: flex-end;
    margin-top: 8rpx;
    flex-direction: row;
}

.grid-goods-price-unit {
    color: #ff5000;
    font-size: 20rpx;
    font-weight: 400;
    line-height: 32rpx;
}

.grid-goods-price-num {
    color: #ff5000;
    font-size: 32rpx;
    font-family: 'Bebas Neue' !important;
    font-weight: 500;
    line-height: 36rpx;
}
</style>
