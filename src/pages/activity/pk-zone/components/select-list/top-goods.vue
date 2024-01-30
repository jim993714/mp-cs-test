<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { SelectGoods } from '@/api/activity/pk-zone/types';
import { CDN_BASE_URL } from '@/base/constants';

const props = defineProps<{
    list: SelectGoods[];
}>();
</script>

<template>
    <view class="top-goods">
        <image
            :src="`${CDN_BASE_URL}/mp-cs/images/activity/pk-zone/today-buy.png`"
            class="title-image"
            mode="aspectFill"
        />

        <view class="goods-list">
            <view
                v-for="item in props.list"
                :key="item.goodsNo"
                class="goods-item"
                @tap="router.push('goodsDetail', { goodsNo: item.goodsNo })"
            >
                <image
                    class="goods-cover"
                    :src="item.goodsCover"
                    mode="aspectFill"
                />
                <view class="goods-price">
                    <zd-price
                        :value="item.goodsPrice"
                        :font-size-large="28"
                        :font-size-small="28"
                        :font-size-unit="18"
                    />
                </view>
                <image
                    class="goods-tag"
                    :src="`${CDN_BASE_URL}/mp-cs/images/activity/pk-zone/buy-text-3.png`"
                    mode="aspectFill"
                />
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.top-goods {
    height: 306rpx;
    padding: 26rpx 20rpx 20rpx;
    border-radius: 20rpx;
    background: linear-gradient(180deg, #ffebd4 0%, #ffffff 100%);
    box-sizing: border-box;

    .title-image {
        width: 128rpx;
        height: 30rpx;
        margin-bottom: 14rpx;
        margin-left: 10rpx;
    }

    .goods-list {
        display: flex;
        align-items: center;
        gap: 10rpx;

        .goods-item {
            position: relative;
            display: flex;
            align-items: center;
            padding: 10rpx 10rpx 4rpx;
            border-radius: 12rpx;
            background: #ffffff;
            flex-direction: column;
            gap: 20rpx;
            box-sizing: border-box;

            .goods-cover {
                display: block;
                width: 140rpx;
                height: 140rpx;
                border-radius: 12rpx;
            }

            .goods-price {
                display: flex;
                height: 40rpx;
                margin-top: 6rpx;
                color: $zd-color-red;
                font-size: 28rpx;
                font-weight: 600;
                line-height: 26rpx;

                &-unit {
                    font-size: 18rpx;
                }
            }

            .goods-tag {
                position: absolute;
                top: 134rpx;
                left: 20rpx;
                width: 118rpx;
                height: 34rpx;
            }
        }
    }
}
</style>
