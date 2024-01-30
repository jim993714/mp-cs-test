<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
import dayjs from 'dayjs';

import type { CouponItem } from '@/api/redpacket/types';
import {
    CardStatus,
    CouponType,
    DiscountLimitType,
    LimitType,
    UsedStatus
} from '@/api/redpacket/types';
import { getCouponDetail } from '@/api/ucenter';

import { getGoodLimit } from '../../constants';
import { Tab } from '../../types';
import DetailAddon from '../detail-addon/index.vue';

const props = defineProps<{
    item: CouponItem;
    type: Tab;
}>();

const detailAddonRef = ref();
const isDetail = ref(false);

function openDetail() {
    detailAddonRef.value.openDetail();
    isDetail.value = !isDetail.value;
}

function dateFormatter(timestamp: number) {
    return dayjs(timestamp).format('YYYY.MM.DD');
}

const discountLimit = computed(() => {
    if (props.item.discountLimitType === DiscountLimitType.None) {
        return '无门槛';
    } else if (props.item.discountLimitType === DiscountLimitType.Money) {
        return `满${props.item.discountLimit}元可用`;
    } else {
        return `满${props.item.discountLimit}件可用`;
    }
});

const discountType = computed(() => {
    if (props.item.shopNo === 'sp_official') {
        return '掌大券';
    } else {
        return '校园店券';
    }
});

async function gotoUse() {
    if (props.item.status === CardStatus.Unused) {
        if (props.type === Tab.Coupon) {
            if (props.item.isSingleGoods) {
                const { goodsInfo } = await getCouponDetail(props.item.couponNo);
                router.push('goodsDetail', {
                    goodsNo: goodsInfo?.goodsNo
                });
            } else if (
                props.item.useLimitType === LimitType.SomeCan ||
                props.item.useLimitType === LimitType.SomeCant
            ) {
                router.push('availableList', {
                    couponNo: props.item.couponNo,
                    studentCouponNo: props.item.studentCouponNo,
                    tab: props.type
                });
            } else if (
                props.item.useLimitType === LimitType.All ||
                props.item.useLimitType === LimitType.StudentPrice
            ) {
                router.switchTab('home');
            } else {
                router.switchTab('home');
            }
        } else {
            router.push('newComerSpecial');
        }
    }
}

const fontSize = computed(() => {
    if (props.item.discountNum.toString().length > 5) {
        return '40rpx';
    } else {
        return '64rpx';
    }
});
</script>

<template>
    <DetailAddon ref="detailAddonRef">
        <view
            :class="{
                'coupon-item': true,
                'coupon-item__used': props.item.status === CardStatus.Used,
                'coupon-item__invalid': props.item.status === CardStatus.Invalid
            }"
        >
            <view class="coupon-item-display">
                <view style="display: flex; align-items: flex-end">
                    <template v-if="props.type === Tab.Coupon">
                        <view
                            v-if="props.item.couponType === CouponType.Money"
                            class="coupon-item-display-rmb"
                            >¥</view
                        >
                        <view
                            class="coupon-item-display-num"
                            :style="{ fontSize }"
                            >{{ props.item.discountNum }}</view
                        >
                        <view
                            v-if="props.item.couponType === CouponType.Coupon"
                            class="coupon-item-display-discount"
                            >折</view
                        >
                    </template>
                    <template v-else>
                        <text class="coupon-item-display-rmb">¥</text>
                        <text class="coupon-item-display-num">{{ ~~props.item.discountNum }}</text>
                    </template>
                </view>
                <text class="coupon-item-display-condition">{{ discountLimit }}</text>
                <view class="coupon-item-display-tag">{{ discountType }}</view>
            </view>
            <view class="coupon-item-detail">
                <text class="coupon-item-detail-title">{{ props.item.title }}</text>
                <view class="coupon-item-detail-info">
                    <view
                        >有效期:{{ dateFormatter(props.item.useStartTime) }}-{{
                            dateFormatter(props.item.useEndTime)
                        }}</view
                    >
                    <view
                        v-if="props.item.status !== CardStatus.Invalid"
                        class="coupon-item-detail-info-use"
                        @tap="gotoUse"
                        >{{ props.item.status === CardStatus.Unused ? '去' : '已' }}使用</view
                    >
                </view>
                <view
                    class="coupon-item-detail-more"
                    @tap.stop="openDetail"
                >
                    <text>详细信息</text>
                    <zd-icon
                        :type="isDetail ? 'zdmp-shengxu' : 'zdmp-jiangxu'"
                        color="#292f33"
                        :size="16"
                    />
                </view>
            </view>
        </view>
        <template #detail>
            <view v-if="props.item.status !== CardStatus.Invalid">
                <view v-if="props.item.couponType === CouponType.Coupon"
                    >封顶金额：最高可减{{ props.item.disCountNumMax }}元</view
                >
                <view>
                    {{ getGoodLimit(props.item.useLimitType) }}
                </view>
                <view>{{ props.item.desc }}</view>
            </view>
            <view v-else>
                {{ props.item.invalidReason }}
            </view>
        </template>
    </DetailAddon>
</template>

<style scoped lang="scss">
.coupon-item {
    display: flex;
    width: 100%;
    height: 176rpx;
    color: $zd-color-red;
    background-size: cover;
    background-image: url('https://nss1.zsdx.cn/mp-cs/images/ucenter/packet-card-bg.png');

    &-display {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 156rpx;
        gap: 4rpx;
        flex-direction: column;

        &-num {
            margin-right: 4rpx;
            font-size: 64rpx;
            font-family: Bebas Neue;
            line-height: 68rpx;
        }

        &-discount {
            font-size: 24rpx;
            font-weight: 600;
            line-height: 52rpx;
        }

        &-rmb {
            font-size: 32rpx;
            font-family: Bebas Neue;
            line-height: 48rpx;
        }

        &-condition {
            font-size: 20rpx;
            line-height: 28rpx;
        }

        &-tag {
            height: 32rpx;
            padding: 0 12rpx;
            border-radius: 16rpx;
            color: rgba($color: #ffffff, $alpha: 0.9);
            font-size: 20rpx;
            background: $zd-color-red;
            box-sizing: border-box;
            line-height: 32rpx;
        }
    }

    &-detail {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 34rpx 20rpx 28rpx 20rpx;
        box-sizing: border-box;

        &-title {
            color: $uni-color-title;
            font-size: 28rpx;
            font-weight: 500;
            line-height: 28rpx;
        }

        &-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-height: 56rpx;
            white-space: nowrap;
            color: $uni-text-color-placeholder;
            font-size: 24rpx;
            line-height: 24rpx;

            &-use {
                flex-shrink: 0;
                padding: 16rpx 24rpx;
                box-sizing: border-box;
                border-radius: 28rpx;
                color: #ffffff;
                font-size: 24rpx;
                font-weight: 500;
                background: $zd-color-red;
                line-height: 24rpx;
            }
        }

        &-more {
            display: flex;
            align-items: center;
            margin-top: 12rpx;
            color: $uni-color-title;
            font-size: 20rpx;
            gap: 6rpx;
            line-height: 20rpx;
        }
    }

    &__used {
        background-image: url('https://nss1.zsdx.cn/mp-cs/images/ucenter/packet-card-bg__used.png');
        color: rgba($color: $uni-color-paragraph, $alpha: 0.5);

        .coupon-item-display-tag {
            background: $uni-color-paragraph;
        }

        .coupon-item-detail-info-use {
            border: 2rpx solid rgba($color: $uni-color-paragraph, $alpha: 0.5);
            color: rgba($color: $uni-color-paragraph, $alpha: 0.5);
            background: #ffffff;
        }
    }

    &__invalid {
        background-image: url('https://nss1.zsdx.cn/mp-cs/images/ucenter/packet-card-bg__invalid.png');
        color: $uni-color-paragraph;

        .coupon-item-display-tag {
            background: $uni-color-paragraph;
        }
    }
}
</style>
