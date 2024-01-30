<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
import dayjs from 'dayjs';

import type { PacketItem } from '@/api/redpacket/types';
import { CardStatus, DiscountLimitType, LimitType } from '@/api/redpacket/types';
import { getPacketDetail } from '@/api/ucenter';

import { getGoodLimit } from '../../constants';
import { Tab } from '../../types';
import DetailAddon from '../detail-addon/index.vue';

const props = defineProps<{
    item: PacketItem;
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

async function gotoUse() {
    if (props.item.status === CardStatus.Unused) {
        if (props.item.isSingleGoods) {
            const { goodsInfo } = await getPacketDetail(props.item.packetNo);
            router.push('goodsDetail', {
                goodsNo: goodsInfo?.goodsNo
            });
        } else if (
            props.item.useLimitType === LimitType.SomeCan ||
            props.item.useLimitType === LimitType.SomeCant
        ) {
            if (props.type === Tab.Packet) {
                router.push('availableList', {
                    packetNo: props.item.packetNo,
                    studentPacketNo: props.item.studentPacketNo,
                    tab: props.type
                });
            } else {
                router.push('availableCommunityList', {
                    packetNo: props.item.packetId,
                    studentPacketNo: props.item.studentPacketId
                });
            }
        } else if (
            props.item.useLimitType === LimitType.All ||
            props.item.useLimitType === LimitType.StudentPrice
        ) {
            router.switchTab('home');
        }
    }
}

function gotoDetail() {
    if (props.type === Tab.CommunityPacket) {
        router.push('communityDetail', {
            studentPacketNo: props.item.studentPacketId
        });
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
                'packet-item': true,
                'packet-item__used': props.item.status === CardStatus.Used,
                'packet-item__invalid': props.item.status === CardStatus.Invalid
            }"
            @tap="gotoDetail"
        >
            <view class="packet-item-display">
                <view>
                    <text class="packet-item-display-rmb">¥</text>
                    <text
                        class="packet-item-display-num"
                        :style="{ fontSize }"
                        >{{ props.item.discountNum }}</text
                    >
                </view>
                <text class="packet-item-display-condition">{{ discountLimit }}</text>
                <view class="packet-item-display-tag">
                    {{ props.type === Tab.Packet ? '' : '社群' }}红包</view
                >
            </view>
            <view class="packet-item-detail">
                <text class="packet-item-detail-title">{{ props.item.title }}</text>
                <view class="packet-item-detail-info">
                    <text
                        >有效期: {{ dateFormatter(props.item.useStartTime) }} -
                        {{ dateFormatter(props.item.useEndTime) }}</text
                    >
                    <view
                        v-if="props.item.status !== CardStatus.Invalid"
                        class="packet-item-detail-info-use"
                        @tap.stop="gotoUse"
                    >
                        {{ props.item.status === CardStatus.Unused ? '去' : '已' }}使用
                    </view>
                    <image
                        v-else
                        src="https://nss1.zsdx.cn/mp-cs/images/ucenter/red-card-bg__invalid.png"
                    />
                </view>
                <view
                    class="packet-item-detail-more"
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
                <view> {{ getGoodLimit(props.item.useLimitType) }}</view>
                <view>{{ props.item.desc }}</view>
            </view>
            <view v-else>
                {{ props.item.invalidReason }}
            </view>
        </template>
    </DetailAddon>
</template>

<style scoped lang="scss">
.packet-item {
    display: flex;
    width: 710rpx;
    height: 176rpx;
    color: $zd-color-red;
    background-size: cover;
    background-image: url('https://nss1.zsdx.cn/mp-cs/images/ucenter/red-card-bg.png');

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
            line-height: 28rpx;
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
            margin-top: 12rpx;
            padding: 0rpx 22rpx;
            border-radius: 16rpx;
            color: rgba($color: #ffffff, $alpha: 0.9);
            font-size: 20rpx;
            background: $zd-color-red;
            box-sizing: border-box;
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

            > text {
                color: $uni-text-color-placeholder;
                font-size: 24rpx;
                line-height: 24rpx;
            }

            &-use {
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
        background-image: url('https://nss1.zsdx.cn/mp-cs/images/ucenter/red-card-bg__used.png');
        color: $uni-color-paragraph;

        .packet-item-display-tag {
            background: #576066;
        }

        .packet-item-detail-info-use {
            border: 2rpx solid $uni-color-paragraph;
            color: $uni-color-paragraph;
            background: #ffffff;
        }
    }

    &__invalid {
        background-image: url('https://nss1.zsdx.cn/mp-cs/images/ucenter/red-card-bg__used.png');
        color: $uni-color-paragraph;

        .packet-item-display-tag {
            background: #576066;
        }

        image {
            width: 120rpx;
            height: 120rpx;
        }
    }
}
</style>
