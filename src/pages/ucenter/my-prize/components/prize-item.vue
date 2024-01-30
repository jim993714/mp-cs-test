<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
import dayjs from 'dayjs';

import { getSummerGoodsDetail } from '@/api/ucenter';
import {
    type Prize,
    PrizeStatus,
    PrizeType,
    type SummerOneCentGoodsDetail
} from '@/api/ucenter/types';

const props = defineProps<{
    info: Prize;
    status: PrizeStatus;
}>();

const emit = defineEmits<{
    (event: 'receive-summer', goodsInfo: SummerOneCentGoodsDetail): void;
    (event: 'receive-coupon'): void;
    (event: 'go-page'): void;
}>();

const validTime = computed(() => {
    const { receiveStartTime, receiveEndTime } = props.info;

    return `${dayjs(receiveStartTime).format('YYYY.MM.DD')} - ${dayjs(receiveEndTime).format(
        'YYYY.MM.DD'
    )}`;
});

function goDetail() {
    if (props.status !== PrizeStatus.RECEIVED) {
        return;
    }
    switch (props.info.type) {
        case PrizeType.COUPON:
        case PrizeType.RED_PACKET:
            router.push('couponDetail', {
                isSingleGoods: props.info.isSingleGoods === 1,
                couponNo: props.info.couponNo,
                packetNo: props.info.packetNo,
                type: props.info.type,
                goodsNo: props.info.goodsNo
            });
            break;
        case PrizeType.GOODS:
            router.push('prizeDetail', {
                exchangeNo: props.info.exchangeNo
            });

            break;
        case PrizeType.SUMMER_ONE_CENT:
            router.push('orderDetail', {
                orderNo: props.info.orderNo
            });
            break;
        default:
            break;
    }
}

// 领取奖品
function handleReceive() {
    if (props.status !== PrizeStatus.UNRECEIVED) {
        return;
    }
    switch (props.info.type) {
        case PrizeType.COUPON:
        case PrizeType.RED_PACKET:
            emit('receive-coupon');
            break;
        case PrizeType.GOODS:
            router.push('prizeDetail', {
                exchangeNo: props.info.exchangeNo
            });
            emit('go-page');
            break;
        case PrizeType.SUMMER_ONE_CENT:
            receiveSummerOneCent();
            break;
        default:
            break;
    }
}

async function receiveSummerOneCent() {
    const detail = await getSummerGoodsDetail({
        goodsNo: props.info.goodsNo,
        awardNo: props.info.awardNo
    });

    if (!detail) {
        return;
    }

    emit('receive-summer', detail);
}
</script>

<template>
    <view
        class="prize-item"
        @tap="goDetail"
    >
        <view class="main-info">
            <image
                class="cover"
                :src="props.info.image"
                mode="aspectFill"
            />

            <view class="info">
                <view class="prize-title ellipsis2">
                    {{ props.info.title }}
                </view>
                <view class="source">
                    {{ props.info.fromType === 1 ? '来自转盘抽奖' : '' }}
                </view>
            </view>

            <view
                v-if="props.status === PrizeStatus.UNRECEIVED"
                class="receive-btn"
                @tap="handleReceive"
            >
                立即领取
            </view>
            <zd-icon
                v-else
                :size="120"
                class="receive-status"
                :class="[props.status === PrizeStatus.RECEIVED ? 'received' : 'expired']"
                :type="props.status === PrizeStatus.RECEIVED ? 'zdmp-yilingqu' : 'zdmp-yishixiao'"
            />
        </view>

        <view class="receive-date"> 领取有效期：{{ validTime }} </view>
    </view>
</template>

<style lang="scss" scoped>
.prize-item {
    position: relative;
    width: 710rpx;
    height: 248rpx;
    margin: 0 auto;
    margin-bottom: 20rpx;
    padding: 20rpx 20rpx 24rpx;
    background: url(https://nss1.zsdx.cn/mp-cs/images/ucenter/prize/prize-bg.png) no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;

    .main-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 124rpx;
        gap: 20rpx;

        .cover {
            width: 124rpx;
            height: 124rpx;
            border-radius: 8rpx;
        }

        .info {
            display: flex;
            width: 346rpx;
            font-weight: 400;
            flex-direction: column;
            gap: 12rpx;

            .prize-title {
                color: $uni-text-color;
                font-size: 28rpx;
                line-height: 40rpx;
            }

            .source {
                color: $uni-color-paragraph;
                font-size: 24rpx;
                line-height: 32rpx;
            }
        }

        .receive-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 160rpx;
            height: 56rpx;
            border-radius: 30rpx;
            color: #ffffff;
            font-size: 28rpx;
            font-weight: 500;
            background: $zd-main-color;
            line-height: 28rpx;
        }

        .receive-status {
            &.received {
                color: $zd-main-color;
            }

            &.expired {
                color: $uni-color-paragraph;
            }
        }
    }

    .receive-date {
        position: absolute;
        bottom: 24rpx;
        left: 20rpx;
        color: $uni-color-paragraph;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 32rpx;
    }
}
</style>
