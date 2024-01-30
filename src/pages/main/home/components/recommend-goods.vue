<script lang="ts" setup>
import { router } from '@zsdx/mp-utils';
import type { PropType } from 'vue';

import type { IGridPhaseGoodsList } from '@/api/home/types';

const props = defineProps({
    list: {
        type: Array as PropType<Array<IGridPhaseGoodsList>>,
        default: () => {
            return [];
        }
    },
    studentShopId: {
        type: String,
        default: ''
    },
    theme: {
        type: Object,
        default: () => {
            return {};
        }
    }
});
const groupList = computed(() => {
    if (!props.list.length) return [];
    return props.list.reduce(
        (result: Array<Array<IGridPhaseGoodsList>>, item: IGridPhaseGoodsList, index) => {
            if (index % 2 === 0) {
                result.push([item]);
            } else {
                result[result.length - 1].push(item);
            }
            return result;
        },
        []
    );
});
const fnGodetail = (item: IGridPhaseGoodsList) => {
    router.push('goodsDetail', { goodsNo: item.goodsNo });
};
</script>

<template>
    <view class="recommend-wrap">
        <image
            class="recommend-bg"
            src="https://cdn.zsdx.cn/mp-cs/images/home/recommend-bg.png"
            mode="scaleToFill"
        />
        <text class="recommend-title">本店推荐</text>
        <swiper
            autoplay
            class="swiper"
        >
            <swiper-item
                v-for="(item, index) in groupList"
                :key="index"
                class="swiper-item"
            >
                <template v-if="item.length > 1">
                    <view
                        v-for="(goods, gIndex) in item"
                        :key="gIndex"
                        class="goods-item"
                        :style="{ marginRight: gIndex == 0 ? '20rpx' : '' }"
                        @tap.prevent="fnGodetail(goods)"
                    >
                        <image
                            class="goods-cover"
                            :src="goods.goodsCover"
                            mode="scaleToFill"
                        />
                        <text class="goods-title ellipsis">{{ goods.goodsTitle }}</text>
                        <zd-price
                            :value="goods.goodsPrice"
                            :font-size-large="32"
                            :font-size-small="32"
                            :font-size-unit="20"
                        ></zd-price>
                    </view>
                </template>
                <template v-else>
                    <view
                        v-for="(goods, gIndex) in item"
                        :key="gIndex"
                        class="goods-item2"
                        @tap.prevent="fnGodetail(goods)"
                    >
                        <image
                            :src="goods.goodsCover"
                            class="goods-cover2"
                            mode="scaleToFill"
                        />
                        <text class="goods-title2 ellipsis">{{ goods.goodsTitle }}</text>
                        <zd-price
                            :value="goods.goodsPrice"
                            :font-size-large="32"
                            :font-size-small="32"
                            :font-size-unit="20"
                        ></zd-price>
                    </view>
                </template>
            </swiper-item>
        </swiper>
    </view>
</template>

<style lang="scss" scoped>
.recommend-wrap {
    position: relative;
    display: flex;
    overflow: hidden;
    width: 710rpx;
    height: 360rpx;
    margin: 0rpx 20rpx 0;
    padding: 20rpx;
    border-radius: 16rpx;
    flex-direction: row;
}
.recommend-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 710rpx;
    height: 360rpx;
}
.recommend-title {
    position: relative;
    color: #292f33;
    font-size: 32rpx;
    font-weight: 500;
    line-height: 40rpx;
}

.swiper {
    position: relative;
    width: 476rpx;
    height: 320rpx;
    margin-left: 66rpx;
}
.swiper-item {
    display: flex;
    justify-content: center;
    width: 476rpx;
    height: 320rpx;
    flex-direction: row;
}
.goods-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.goods-cover {
    width: 228rpx;
    height: 228rpx;
    background: #ffffff;
}
.goods-cover2 {
    width: 228rpx;
    height: 228rpx;
    background: #ffffff;
}
.goods-title {
    width: 228rpx;
    margin-top: 20rpx;
    text-align: center;
    color: rgba(0, 0, 0, 0.85);
    font-size: 24rpx;
    font-weight: 500;
    line-height: 24rpx;
}
.goods-title2 {
    width: 320rpx;
    margin-top: 20rpx;
    text-align: center;
    color: rgba(0, 0, 0, 0.85);
    font-size: 24rpx;
    font-weight: 500;
    line-height: 24rpx;
}
.goods-item2 {
    display: flex;
    align-items: center;
    width: 320rpx;
    height: 320rpx;
    border-radius: 16rpx;
    background: #ffffff;
    flex-direction: column;
}
</style>
