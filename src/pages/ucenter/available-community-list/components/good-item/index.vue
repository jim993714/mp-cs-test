<script setup lang="ts">
import type { AvailableCommunityPacketResult, CommunityGoods } from '@/api/redpacket/types';
import { DiscountLimitType } from '@/api/redpacket/types';

const props = defineProps<{
    item: CommunityGoods;
    info: AvailableCommunityPacketResult['communityInfoDTO'];
}>();

const discountRequire = computed(() => {
    if (props.info.discountLimitType === DiscountLimitType.Number) {
        return `满${props.info.discountLimit}件减${props.info.discountNum}`;
    } else if (props.info.discountLimitType === DiscountLimitType.Money) {
        return `满${props.info.discountLimit}减${props.info.discountNum}`;
    } else {
        return '';
    }
});

const emits = defineEmits<{
    (event: 'openSku', goodsNo: string): void;
}>();

function openSku() {
    emits('openSku', props.item.goodsNo);
}
</script>

<template>
    <view class="good-item">
        <image
            class="good-item-left"
            :src="item.goodsCover"
        />
        <view class="good-item-right">
            <text class="good-item-right-title">{{ item.goodsTitle }}</text>
            <view class="good-item-right-tag"> {{ discountRequire }} </view>
            <view class="good-item-right-content">
                <view class="good-item-right-content-info">
                    <text v-if="item?.isStudentPrice">学生价</text>
                    <zd-price
                        :value="item.goodsPrice"
                        :font-size-large="40"
                        :font-size-small="32"
                    />
                    <text class="good-item-right-content-info-old"
                        >¥{{ item.goodsPriceOrigin }}</text
                    >
                </view>
                <uni-badge
                    :text="+item.cartNum || ''"
                    :custom-style="{
                        color: '#FE0F45',
                        'border-color': '#FE0F45',
                        background: '#fff'
                    }"
                    :inverted="!item.cartNum"
                    :offset="[2, 2]"
                    absolute="leftTop"
                    type="default"
                    size="normal"
                >
                    <view
                        class="good-item-right-content-btn"
                        @tap="openSku"
                    >
                        <zd-icon
                            type="zdmp-jiagou"
                            color="#ffffff"
                            :size="48"
                        />
                    </view>
                </uni-badge>
            </view>
        </view>
    </view>
</template>

<style scoped lang="scss">
.good-item {
    display: flex;
    margin: 0 20rpx 20rpx 20rpx;
    padding: 20rpx 30rpx 20rpx 20rpx;
    border-radius: 20rpx;
    background: #ffffff;
    gap: 20rpx;
    box-sizing: border-box;

    &-left {
        width: 200rpx;
        height: 200rpx;
        border-radius: 12rpx;
    }

    &-right {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;

        &-title {
            display: -webkit-inline-box;
            overflow: hidden;
            height: 80rpx;
            text-overflow: ellipsis;
            color: $uni-text-color;
            font-size: 28rpx;
            font-weight: 500;
            line-height: 40rpx;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
        }

        &-tag {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 36rpx;
            margin-top: 16rpx;
            padding: 4rpx 10rpx;
            border-radius: 4rpx;
            color: $zd-color-red;
            font-size: 20rpx;
            font-weight: 500;
            background: rgba($color: $zd-color-red, $alpha: 0.1);
            align-self: flex-start;
            line-height: 28rpx;
        }

        &-content {
            display: flex;
            justify-content: space-between;
            align-items: center;

            &-info {
                display: flex;
                align-items: flex-end;
                gap: 6rpx;

                > text {
                    color: $zd-color-red;
                    font-size: 20rpx;
                    font-weight: 400;
                    line-height: 20rpx;
                }

                &-old {
                    text-decoration: line-through;
                    color: $uni-text-color-placeholder !important;
                }
            }

            &-btn {
                width: 64rpx;
                height: 64rpx;
                border-radius: 32rpx;
                text-align: center;
                background: $zd-color-red;
                line-height: 64rpx;
            }
        }
    }
}
</style>
