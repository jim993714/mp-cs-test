<script setup lang="ts">
import type { ISchoolDumplingDetail } from '@/api/activity/campus-group/type';

const props = defineProps<{
    data?: ISchoolDumplingDetail;
}>();

const onClick = () => {
    emit('onClick', 'openGroup');
};

const emit = defineEmits(['onClick']);
</script>

<template>
    <view
        class="goods-item"
        @tap.prevent="onClick"
    >
        <view class="item-left">
            <view class="goods-title ellipsis2"
                >【{{ props.data?.studentNum }}人团】{{ props.data?.goodsTitle }}</view
            >
            <view
                v-if="props.data?.allowsDeliveryToDormitory || props.data?.showRefundBeforeReturn"
                class="goods-tag"
            >
                <view
                    v-if="props.data?.allowsDeliveryToDormitory"
                    class="goods-tag-green"
                    >送货到寝</view
                >
                <view
                    v-if="props.data?.showRefundBeforeReturn"
                    class="goods-tag-blue"
                    >先退款后退货</view
                >
            </view>
            <view
                v-else
                class="goods-tag"
            ></view>
            <view class="goods-price-box">
                <view class="goods-price-label">团购价</view>
                <zd-price
                    :value="props.data?.groupBuyPrice || 0"
                    :font-size-large="40"
                    :font-size-small="28"
                    :font-size-unit="20"
                    color="rgba(255, 71, 52, 1)"
                ></zd-price>
            </view>
        </view>
        <image
            class="item-cover"
            :src="props.data?.goodsCover"
            mode="scaleToFill"
        />
    </view>
</template>

<style lang="scss" scoped>
.goods-item {
    display: flex;
    align-items: center;
    width: 670rpx;
    height: 260rpx;
    padding: 30rpx 30rpx 30rpx 40rpx;
    border-radius: 20rpx;
    background: #ffffff;
    box-sizing: border-box;
    .item-cover {
        width: 200rpx;
        height: 200rpx;
        border-radius: 16rpx;
    }
    .item-left {
        display: flex;
        height: 200rpx;
        flex: 1;
        flex-direction: column;
        .goods-title {
            color: #292f33;
            font-size: 28rpx;
            font-weight: 500;
            line-height: 40rpx;
        }
        .goods-tag {
            display: flex;
            align-items: center;
            height: 32rpx;
            margin-top: 12rpx;
            .goods-tag-green {
                margin-right: 12rpx;
                padding: 6rpx 8rpx;
                border-radius: 4rpx;
                color: #0bd994;
                font-size: 20rpx;
                font-weight: 500;
                background: rgba(11, 217, 148, 0.1);
                line-height: 20rpx;
            }
            .goods-tag-blue {
                margin-right: 12rpx;
                padding: 6rpx 8rpx;
                border-radius: 4rpx;
                border-radius: 4rpx;
                color: #199fff;
                font-size: 20rpx;
                font-weight: 500;
                background: rgba(25, 159, 255, 0.1);
                line-height: 20rpx;
            }
        }
        .goods-price-box {
            flex: 1;
            display: flex;
            align-items: flex-end;
            .goods-price-label {
                margin-right: 8rpx;
                color: #ff4734;
                font-size: 24rpx;
                font-weight: 400;
                line-height: 24rpx;
            }
        }
    }
}
</style>
