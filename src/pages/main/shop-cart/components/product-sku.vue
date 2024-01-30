<script setup lang="ts">
import type { ShopCartGoodsSpec } from '@/api/shop-cart/types';

const props = defineProps<{
    skuList: ShopCartGoodsSpec[];
}>();

const formatSku = computed(() => {
    return props.skuList.reduce((res, item) => {
        res += item.specValue + ';';
        return res;
    }, '');
});
</script>

<template>
    <view class="sku">
        <text class="sku-text ellipsis">{{ formatSku }}</text>
        <text class="arrow-bottom" />
    </view>
</template>

<style lang="scss" scoped>
.sku {
    display: inline-flex;
    align-items: center;
    width: max-content;
    max-width: 100%;
    height: 44rpx;
    padding: 0 16rpx;
    border-radius: 8rpx;
    color: #576066;
    font-size: 24rpx;
    font-weight: 400;
    background: $uni-text-color-inverse;
    line-height: 24rpx;
    gap: 8rpx;

    .sku-text {
        max-width: 372rpx;
    }

    .arrow-bottom {
        width: 12rpx;
        height: 12rpx;
        margin-top: -6rpx;
        border-top: 2rpx solid #88909c;
        border-right: 2rpx solid #88909c;
        transform: rotate(135deg);
    }
}
</style>
