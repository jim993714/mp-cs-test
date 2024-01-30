<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
import dayjs from 'dayjs';

import { DiscountLimitType, LimitType } from '@/api/redpacket/types';
import type { Coupon, RedPacket } from '@/api/ucenter/types';
import { CouponType } from '@/api/ucenter/types';
import { Tab } from '@/pages/ucenter/redpacket/components/list/types';

import { PrizeType } from '../types';

const props = defineProps<{
    info: Coupon | RedPacket;
    // 优惠券2，红包3
    type: number;
    isSingleGoods?: boolean;
    goodsNo?: string;
}>();
const showDesc = ref(false);

const discountLimit = computed(() => {
    const { discountLimitType } = props.info;

    switch (discountLimitType) {
        case DiscountLimitType.None:
            return '';
        case DiscountLimitType.Money:
            return `满${props.info.discountLimit}元可用`;
        case DiscountLimitType.Number:
            return `满${props.info.discountLimit}件可用`;
        default:
            return '';
    }
});

function goUse() {
    if (props.info.useLimitType === LimitType.SomeCan) {
        if (!props.isSingleGoods) {
            router.push('availableList', {
                couponNo: props.type === PrizeType.COUPON ? (props.info as Coupon).couponNo : '',
                packetNo:
                    props.type === PrizeType.RED_PACKET ? (props.info as RedPacket).packetNo : '',
                tab: props.type === PrizeType.COUPON ? Tab.Coupon : Tab.Packet
            });
            return;
        }
        if (props.goodsNo) {
            router.push('goodsDetail', {
                goodsNo: props.goodsNo
            });
            return;
        }
    } else {
        router.switchTab('home');
    }
}
</script>

<template>
    <view class="info-wrap">
        <view class="title">
            恭喜你获得一张{{ props.type === PrizeType.COUPON ? '优惠券' : '红包' }}</view
        >
        <view class="main-info">
            <view class="main-top">
                <view class="basic">
                    <view class="main-title ellipsis">{{ props.info.title }}</view>
                    <view class="main-desc"
                        >使用时间 {{ dayjs(props.info.useStartTime).format('YYYY.MM.DD') }} -
                        {{ dayjs(props.info.useEndTime).format('YYYY.MM.DD') }}
                    </view>
                </view>
                <view class="line" />
                <view class="price">
                    <!-- 优惠券 -->
                    <view v-if="props.type === PrizeType.COUPON">
                        <text
                            v-if="(props.info as Coupon).couponType === CouponType.Money"
                            class="price-unit price-money"
                            >￥</text
                        ><text class="price-text bebas-neue-regular">
                            {{ props.info.discountNum }}
                        </text>
                        <text
                            v-if="(props.info as Coupon).couponType === CouponType.Coupon"
                            class="price-unit"
                        >
                            折
                        </text>
                    </view>
                    <!-- 红包 -->
                    <view v-if="props.type === PrizeType.RED_PACKET">
                        <text class="price-unit price-money">￥</text
                        ><text class="price-text bebas-neue-regular">
                            {{ props.info.discountNum }}
                        </text>
                    </view>

                    <view class="limit-text">{{ discountLimit }}</view>
                </view>
            </view>
            <view class="main-bottom">
                <view class="max">
                    <text
                        v-if="props.type === 2 && (props.info as Coupon).couponType === CouponType.Coupon"
                        >最高可减{{ (props.info as Coupon).discountNumMax }}元</text
                    >
                </view>
                <view
                    class="desc-btn"
                    @tap="showDesc = !showDesc"
                >
                    <text class="desc-text">详细信息</text>
                    <zd-icon
                        class="icon"
                        :class="{ active: showDesc }"
                        type="zdmp-fanhui"
                        :size="24"
                    />
                </view>
            </view>
        </view>
        <view
            v-show="showDesc"
            class="desc"
        >
            {{ props.info.desc }}
        </view>
        <view
            class="btn"
            @tap="goUse"
        >
            <text class="btn-text">去使用</text>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.info-wrap {
    padding-top: 40rpx;
    border-radius: 16rpx;
    background: #ffffff;
    box-sizing: border-box;

    .title {
        margin-bottom: 20rpx;
        text-align: center;
        color: $uni-text-color;
        font-size: 32rpx;
        font-weight: 400;
        line-height: 44rpx;
    }
    .main-info {
        height: 302rpx;
        padding: 18rpx 30rpx;
        background: url(https://nss1.zsdx.cn/mp-cs/images/ucenter/prize/coupon-bg.png) no-repeat;
        background-size: 100% 100%;
        box-sizing: border-box;

        .main-top {
            display: flex;
            align-items: center;
            height: 148rpx;

            .basic {
                display: flex;
                flex-direction: column;
                gap: 20rpx;
                flex: 1;
                padding: 0 30rpx;
                box-sizing: border-box;

                .main-title {
                    color: #ffffff;
                    font-size: 32rpx;
                    font-weight: 500;
                    line-height: 40rpx;
                }

                .main-desc {
                    color: #ffffff;
                    font-size: 24rpx;
                    font-weight: 400;
                    line-height: 28rpx;
                }
            }

            .line {
                width: 2rpx;
                height: 76rpx;
                border-radius: 1rpx;
                background-color: rgba(255, 255, 255, 0.44);
            }
            .price {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 178rpx;
                flex-direction: column;
                gap: 10rpx;

                .price-unit {
                    color: #ffffff;
                    font-size: 24rpx;
                    font-weight: 600;
                    line-height: 28rpx;

                    &.price-money {
                        font-size: 32rpx;
                        font-family: BebasNeue;
                    }
                }
                .price-text {
                    color: #ffffff;
                    font-size: 64rpx;
                    font-family: Bebas Neue;
                    line-height: 68rpx;
                }

                .limit-text {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 20rpx;
                    font-weight: 400;
                    line-height: 28rpx;
                }
            }
        }

        .main-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 88rpx;
            padding: 0 40rpx;
            color: #fff;
            font-size: 24rpx;
            font-weight: 400;
            line-height: 28rpx;

            .desc-btn {
                display: flex;
                gap: 12rpx;
                .icon {
                    transform: rotate(-90deg);

                    &.active {
                        transform: rotate(90deg);
                    }
                }
            }
        }
    }

    .desc {
        margin-top: -28rpx;
        padding: 0 30rpx;
        white-space: pre-wrap;
        color: $uni-color-paragraph;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 36rpx;
    }

    .btn {
        width: 590rpx;
        height: 144rpx;
        margin: 0 auto;
        margin-top: 40rpx;
        padding-top: 24rpx;
        text-align: center;
        background: url(https://nss1.zsdx.cn/mp-cs/images/ucenter/prize/coupon-btn.png) no-repeat;
        background-size: 100% 100%;
        box-sizing: border-box;

        &-text {
            color: #ffffff;
            font-size: 32rpx;
            font-weight: 500;
            line-height: 32rpx;
        }
    }
}
</style>
