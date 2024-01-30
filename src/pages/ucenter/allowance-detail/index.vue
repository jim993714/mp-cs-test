<script setup lang="ts">
import dayjs from 'dayjs';

import { getMyAllowanceInfo } from '@/api/redpacket/index';
import type { MyHistoryItem } from '@/api/redpacket/types';

import AllowanceItem from './components/allowance-item/index.vue';
import { detailInfo } from './constants';

const basicInfo = ref([...detailInfo]);
const history = ref<MyHistoryItem[]>();

function formatDate(date: number) {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

onLoad(async options => {
    const { allowanceInfoMarkDTOS, title, initMoney, lastMoney, useStartTime, useEndTime } =
        await getMyAllowanceInfo({
            studentAllowanceId: options?.studentAllowanceId
        });
    const info = [...detailInfo];
    info[0].value = title;
    info[1].value = `¥${initMoney}`;
    info[2].value = `¥${lastMoney}`;
    info[3].value = formatDate(useStartTime);
    info[4].value = formatDate(useEndTime);

    basicInfo.value = info;
    history.value = allowanceInfoMarkDTOS;
});
</script>

<template>
    <view class="allowance-detail">
        <zd-navbar
            type="sub"
            title="购物津贴明细"
            color="#ffffff"
            background="linear-gradient(270deg, #CC47FF 0%, #944DFF 100%)"
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
        width: 100%;
        height: 206rpx;
        background: linear-gradient(270deg, #cc47ff 0%, #944dff 100%);
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
            background: #7d2be1;
        }

        &-header {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 24rpx;
            width: 682rpx;
            height: 476rpx;
            margin-top: -8rpx;
            padding: 54rpx 50rpx;
            box-sizing: border-box;
            background-size: 100% 100%;
            background-image: url('https://nss1.zsdx.cn/mp-cs/images/ucenter/purple-ticket__shadow.png');

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
                gap: 36rpx;

                &-label {
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
