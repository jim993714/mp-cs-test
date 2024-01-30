<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { HireGoods } from '@/api/activity/pk-zone/types';
import { CDN_BASE_URL } from '@/base/constants';

const props = defineProps<{
    info: HireGoods;
    isLast?: boolean;
}>();
const { info } = toRefs(props);
</script>

<template>
    <view
        v-if="info.goodsNo"
        class="goods-item"
        :style="{ marginRight: isLast ? '24rpx' : '' }"
        @tap="router.push('goodsDetail', { goodsNo: info.goodsNo })"
    >
        <image
            class="goods-cover"
            :src="info.goodsCover"
            mode="aspectFill"
        />
        <view class="name ellipsis">{{ info.goodsTitle }}</view>
        <view class="price-btn">
            <view class="price">
                <zd-price
                    :value="info.goodsPrice"
                    :font-size-large="28"
                    :font-size-small="24"
                    :font-size-unit="20"
                />
            </view>
            <view class="text">活动价</view>
        </view>
    </view>
    <image
        v-else
        class="goods-empty-image"
        :src="`${CDN_BASE_URL}/mp-cs/images/activity/pk-zone/goods-empty.png`"
        mode="scaleToFill"
    />
</template>

<style lang="scss" scoped>
.goods-item {
    display: flex;
    width: 200rpx;
    height: 326rpx;
    border-radius: 12rpx 12rpx 0 0;
    background: #ffffff;
    flex-direction: column;
    gap: 12rpx;

    .goods-cover {
        width: 200rpx;
        height: 200rpx;
        border-radius: 12rpx;
    }

    .name {
        padding: 0 16rpx;
        color: $uni-text-color;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 34rpx;
    }

    .price-btn {
        display: flex;
        width: 200rpx;
        height: 68rpx;
        color: $zd-color-red;
        background: url(https://nss1.zsdx.cn/mp-cs/images/activity/pk-zone/text-qiang.png) no-repeat;
        background-size: 100% 100%;
        flex-direction: column;
        gap: 4rpx;

        .price {
            margin-top: 4rpx;
            margin-left: 8rpx;
            font-size: 20rpx;
            font-weight: 600;
            line-height: 32rpx;

            &-value {
                font-size: 24rpx;
            }
        }
        .text {
            margin-left: 12rpx;
            font-size: 20rpx;
            font-weight: 400;
            line-height: 20rpx;
        }
    }
}

.goods-empty-image {
    width: 200rpx;
    height: 326rpx;
}
</style>
