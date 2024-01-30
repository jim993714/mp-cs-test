<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
import dayjs from 'dayjs';

import { LogisticsFromType, TrackingStatus } from '@/api/order/types';
import { getPrizeLogisticsInfo } from '@/api/ucenter';
import type { PrizeLogisticsInfo } from '@/api/ucenter/types';

import { formatLogisticsInfo } from '../utils';

const props = defineProps<{
    exchangeNo: string;
}>();

const logisticsInfo = ref<PrizeLogisticsInfo>();
const showInfo = computed(() => {
    if (!logisticsInfo.value) {
        return {
            icon: 'zdmp-zaituzhong',
            text: '等待发货',
            createTime: '',
            showTime: false,
            showGoIcon: false
        };
    }
    const { trackingStatus } = logisticsInfo.value;
    const lastTrackingInfo = logisticsInfo.value?.trackingInfoList?.[0];
    return {
        icon: formatLogisticsInfo(logisticsInfo.value).icon,
        text: formatLogisticsInfo(logisticsInfo.value).text,
        info:
            trackingStatus < 0
                ? formatLogisticsInfo(logisticsInfo.value).info
                : lastTrackingInfo?.info,
        createTime: lastTrackingInfo?.createTime,
        showTime: trackingStatus !== undefined && trackingStatus >= 0,
        showGoIcon: trackingStatus !== TrackingStatus.NotDelivered
    };
});

async function getData() {
    logisticsInfo.value = await getPrizeLogisticsInfo(props.exchangeNo);
}

// 跳转到物流详情
function goLogisticsDetail() {
    router.push('logistics', {
        exchangeNo: props.exchangeNo,
        fromType: LogisticsFromType.Prize
    });
}

onMounted(() => {
    getData();
});
</script>

<template>
    <view
        class="logistics"
        @tap="goLogisticsDetail"
    >
        <view class="header">
            <zd-icon
                :size="32"
                class="left-icon"
                :type="showInfo.icon"
            />
            <view class="text">
                <text>{{ showInfo.text }}</text>
            </view>

            <view class="header-right">
                <view
                    v-if="showInfo.showTime"
                    class="time"
                >
                    {{ dayjs(showInfo.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                </view>
                <zd-icon
                    v-if="showInfo.showGoIcon"
                    class="go-icon"
                    :size="20"
                    type="zdmp-fanhui"
                />
            </view>
        </view>

        <view class="content ellipsis2">
            {{ showInfo.info }}
        </view>
    </view>
</template>

<style lang="scss" scoped>
.logistics {
    display: flex;
    padding: 30rpx 24rpx;
    border-radius: 12rpx;
    background-color: #fff;
    box-sizing: border-box;
    flex-direction: column;
    gap: 20rpx;

    .header {
        display: flex;
        align-items: center;
        border-radius: 12rpx;
        color: $uni-text-color;
        font-size: 28rpx;
        font-weight: 500;
        line-height: 32rpx;
        gap: 24rpx;

        .text {
            flex: 1;
            display: flex;
            gap: 16rpx;
        }

        .left-icon {
            color: $zd-main-color;
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 28rpx;
            .time {
                color: $uni-color-paragraph;
                font-size: 24rpx;
                font-weight: 400;
                line-height: 32rpx;
            }
            .go-icon {
                color: $uni-color-paragraph;
                transform: rotate(180deg);
            }
        }
    }

    .content {
        margin-left: 52rpx;
        color: #576066;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 36rpx;
    }
}
</style>
