<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
import dayjs from 'dayjs';

import { getMyCommunityRedPacketInfo } from '@/api/redpacket/index';
import { DiscountLimitType, LimitType, type MyHistoryItem } from '@/api/redpacket/types';

import AllowanceItem from './components/community-item/index.vue';
import { detailInfo } from './constants';

const basicInfo = ref([...detailInfo]);
const history = ref<MyHistoryItem[]>();

function formatDate(date: number) {
    return dayjs(date).format('YYYY-MM-DD');
}

function getDiscountLimit(discountLimitType: DiscountLimitType, discountLimit: number) {
    if (discountLimitType === DiscountLimitType.None) {
        return '无门槛';
    } else if (discountLimitType === DiscountLimitType.Money) {
        return `满${discountLimit}元可用`;
    } else {
        return `满${discountLimit}件可用`;
    }
}

onLoad(async options => {
    const {
        communityMarkDTOList,
        title,
        lastNum,
        discountNum,
        discountLimit,
        discountLimitType,
        useStartTime,
        useEndTime,
        useLimitType,
        studentShopName
    } = await getMyCommunityRedPacketInfo({
        studentPacketId: options?.studentPacketNo
    });
    const info = [...detailInfo];
    info[0].value = title;
    info[1].value = `¥${discountNum || 0}`;
    info[2].value = `¥${lastNum}`;
    info[3].value = getDiscountLimit(discountLimitType, discountLimit);
    info[4].value = `${formatDate(useStartTime)}-${formatDate(useEndTime)}`;
    info[5].value = `${studentShopName}${useLimitType === LimitType.All ? '全店商品' : '指定商品'}`;

    basicInfo.value = info;
    history.value = communityMarkDTOList;
});
</script>

<template>
    <view class="allowance-detail">
        <zd-navbar
            type="sub"
            title="社群红包专区"
            color="#ffffff"
            background="linear-gradient(270deg, #ff0844 0%, #ff8864 100%)"
        />
        <view class="allowance-detail-header" />
        <view class="allowance-detail-ticket">
            <view class="allowance-detail-ticket-line" />
            <view
                :class="{
                    'allowance-detail-ticket-header': true,
                    'allowance-detail-ticket-header__none': !history?.length
                }"
            >
                <text class="allowance-detail-ticket-header-title">基本信息</text>
                <view
                    v-for="info in basicInfo"
                    :key="info.label"
                    class="allowance-detail-ticket-header-info"
                >
                    <text class="allowance-detail-ticket-header-info-label">{{ info.label }}</text>
                    <text class="allowance-detail-ticket-header-info-value">{{ info.value }}</text>
                </view>
            </view>
            <view
                v-if="history?.length"
                class="allowance-detail-ticket-content"
            >
                <view class="allowance-detail-ticket-content-title">历史记录</view>
                <AllowanceItem
                    v-for="item in history"
                    :key="item.orderNo"
                    v-bind="item"
                />
            </view>
            <image
                :class="{
                    'allowance-detail-ticket-footer': true,
                    'allowance-detail-ticket-footer__none': !history?.length
                }"
                src="https://nss1.zsdx.cn/mp-cs/images/ucenter/serration-bg.png"
            />
        </view>
    </view>
</template>

<style lang="scss" scoped>
.allowance-detail {
    padding-bottom: calc(env(safe-area-inset-bottom));

    &-header {
        position: sticky;
        width: 100%;
        height: 206rpx;
        background: linear-gradient(270deg, #ff0844 0%, #ff8864 100%);
    }

    &-ticket {
        display: flex;
        align-items: center;
        width: 100%;
        margin-top: -138rpx;
        flex-direction: column;

        &-line {
            width: 690rpx;
            height: 24rpx;
            border-radius: 12rpx;
            background: #e50e0e;
        }

        &-header {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 24rpx;
            width: 682rpx;
            height: 536rpx;
            margin-top: -8rpx;
            padding: 54rpx 50rpx;
            box-sizing: border-box;
            background-size: 100% 100%;
            background-image: url('https://nss1.zsdx.cn/mp-cs/images/ucenter/red-ticket__shadow.png');

            &::after {
                position: absolute;
                bottom: 12rpx;
                left: 28rpx;
                width: 626rpx;
                height: 0;
                border: 2rpx dashed $uni-text-color-disable;
                content: '';
            }

            &-title {
                margin-bottom: 22rpx;
                color: $uni-text-color;
                font-size: 32rpx;
                font-weight: 500;
                line-height: 32rpx;
            }

            &-info {
                display: flex;
                align-items: center;
                gap: 24rpx;

                &-label {
                    width: 5em;
                    color: $uni-text-color-placeholder;
                    font-size: 28rpx;
                    font-weight: 400;
                    line-height: 36rpx;
                }

                &-value {
                    color: $uni-color-title;
                    font-size: 28rpx;
                    font-weight: 400;
                    line-height: 36rpx;
                }
            }

            &__none {
                background-size: cover;
                &::after {
                    display: none !important;
                }
            }
        }

        &-content {
            display: flex;
            width: 658rpx;
            flex-direction: column;
            box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);

            &-title {
                margin: 32rpx 50rpx;
                color: $uni-text-color;
                font-size: 32rpx;
                font-weight: 500;
                line-height: 32rpx;
            }

            allowance-item:last-of-type {
                :deep(.allowance-item) {
                    border-bottom: none !important;
                }
            }
        }

        &-footer {
            width: 658rpx;
            height: 32rpx;

            &__none {
                margin-top: -8rpx;

                &::before {
                    display: block;
                    content: '';
                    width: 100%;
                    height: 8rpx;
                    box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);
                }
            }
        }
    }
}
</style>
