<script setup lang="ts">
import { checkSubgiftReceive, subgiftReceive } from '@/api/activity/exclusive-coupon/index';
import type { ICoupon, IReceiveParams, IShareInfo } from '@/api/activity/exclusive-coupon/types';
import { subscribeCouponMsg } from '@/utils/subscribe';

import { formatDate } from '../constants';

const props = defineProps<{
    data: ICoupon;
    shareInfo: IShareInfo;
    shareKey: string;
}>();
const params = ref<IReceiveParams>({
    shareKey: '',
    studentCouponNo: ''
});
const btnText = computed(() => {
    if (props.data.receiveStatus === 0) {
        return '领取';
    } else if (props.data.receiveStatus === 1) {
        return '已领取';
    } else {
        return '--';
    }
});

const receive = async () => {
    try {
        if (props.data.receiveStatus === 0) {
            params.value.shareKey = props.shareKey || '';
            params.value.studentCouponNo = props.data.studentCouponNo;
            const res = await subgiftReceive(params.value);
            if (res.result === 1) {
                uni.showToast({
                    icon: 'none',
                    title: '领取成功'
                });
                emit('onRefresh');
                subscribeCouponMsg();
            } else if (res.result === 2) {
                checkReceive(res.receiveTicket);
            }
        }
    } catch (err: any) {
        console.error(err);
        uni.showToast({
            title: err.msg,
            icon: 'none'
        });
    }
};

const checkReceive = async (receiveTicket: string) => {
    try {
        const res = await checkSubgiftReceive(receiveTicket);
        if (res.result === 0) {
            checkSubgiftReceive(receiveTicket);
        } else if (res.result === 1) {
            uni.showToast({
                icon: 'none',
                title: '领取成功'
            });
            emit('onRefresh');
        } else {
            uni.showToast({
                icon: 'none',
                title: res.failReason
            });
            emit('onRefresh');
        }
    } catch (err) {
        console.error(err);
    }
};
const emit = defineEmits(['onRefresh']);
</script>

<template>
    <view class="list-warp">
        <view class="list-head">
            <image
                class="list-head-img"
                src="https://cdn.zsdx.cn/mp-cs/images/activity/exclusive-coupon/list-head.png"
                mode="scaleToFill"
            />
            <view class="list-head-info">
                <image
                    class="list-head-info-icon"
                    src="https://cdn.zsdx.cn/mp-cs/images/activity/exclusive-coupon/unit-icon.png"
                    mode="scaleToFill"
                />
                <image
                    class="list-head-info-cover"
                    :src="props.shareInfo?.shareHeadImg"
                    mode="scaleToFill"
                />
                <view class="list-head-info-title"
                    >{{ props.shareInfo?.shareTrueName }}的优惠券</view
                >
                <image
                    class="list-head-info-icon"
                    src="https://cdn.zsdx.cn/mp-cs/images/activity/exclusive-coupon/unit-icon.png"
                    mode="scaleToFill"
                />
            </view>
        </view>
        <view class="coupon-item">
            <view class="coupon-item-left">
                <view class="discount-warp">
                    <view class="discount-num bebas-neue-regular">{{
                        props.data?.discountNum || 0
                    }}</view>
                    <view class="discount-label">{{
                        props.data?.couponType === 1 ? '元' : '折'
                    }}</view>
                </view>
                <view
                    v-if="props.data?.discountLimitType > 0"
                    class="discount-condition"
                    >满{{ props.data?.discountLimit || 0
                    }}{{ props.data?.discountLimitType === 1 ? '元' : '件' }}可用</view
                >
                <view
                    v-else
                    class="discount-condition"
                    >无门槛</view
                >
                <view class="discount-tag">{{
                    props.data?.category === 1 ? '校园店券' : '掌大券'
                }}</view>
            </view>
            <view class="coupon-item-right">
                <view class="coupon-name">{{ props.data?.title }}</view>
                <view class="coupon-effective-time"
                    >有效期:{{ formatDate(props.data?.useStartTime) }}-{{
                        formatDate(props.data?.useEndTime)
                    }}</view
                >
                <view
                    v-if="props.data.receiveStatus === 1"
                    class="coupon-receive-tips"
                    >优惠券已发放至账户</view
                >
            </view>
            <view
                v-if="props.data?.receiveStatus === 0 || props.data?.receiveStatus === 1"
                class="receive"
                :class="{ 'receive-disable': props.data?.receiveStatus === 1 }"
                @tap.prevent="receive"
                >{{ btnText }}</view
            >
        </view>
    </view>
</template>

<style lang="scss" scoped>
.list-warp {
    .list-head {
        position: relative;
        width: 750rpx;
        height: 160rpx;
        .list-head-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 750rpx;
            height: 160rpx;
        }
        .list-head-info {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 160rpx;

            .list-head-info-icon {
                width: 52rpx;
                height: 48rpx;
            }
            .list-head-info-cover {
                width: 72rpx;
                height: 72rpx;
                margin: 0 16rpx 0 26rpx;
                border-radius: 50%;
            }
            .list-head-info-title {
                margin-right: 24rpx;
                color: #333333;
                font-size: 28rpx;
                font-weight: 600;
                line-height: 24rpx;
            }
        }
    }
    .coupon-item {
        position: relative;
        display: flex;
        width: 710rpx;
        height: 176rpx;
        margin-left: 20rpx;
        background-size: cover;
        background-image: url('https://nss1.zsdx.cn/mp-cs/images/ucenter/packet-card-bg.png');
        .coupon-item-left {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 156rpx;
            height: 176rpx;
            flex-direction: column;
            .discount-warp {
                display: flex;
                justify-content: center;
                align-items: flex-end;
                .discount-num {
                    color: #ff4734;
                    font-size: 64rpx;
                    font-family: BebasNeue;
                }
                .discount-label {
                    margin-left: 4rpx;
                    color: #ff4734;
                    font-size: 24rpx;
                    font-weight: 600;
                    line-height: 64rpx;
                }
            }
            .discount-condition {
                color: #ff4734;
                font-size: 20rpx;
                font-weight: 400;
                line-height: 28rpx;
            }
            .discount-tag {
                margin-top: 8rpx;
                padding: 6rpx 12rpx;
                border-radius: 16rpx;
                color: rgba(255, 255, 255, 0.9);
                font-size: 20rpx;
                font-weight: 400;
                background: #ff4734;
                line-height: 20rpx;
            }
        }
        .coupon-item-right {
            display: flex;
            padding-top: 34rpx;
            padding-left: 20rpx;
            flex: 1;
            flex-direction: column;
            .coupon-name {
                color: #292f33;
                font-size: 28rpx;
                font-weight: 500;
                line-height: 28rpx;
            }
            .coupon-effective-time {
                margin-top: 20rpx;
                color: #8a9399;
                font-size: 24rpx;
                font-weight: 400;
                line-height: 24rpx;
            }
            .coupon-receive-tips {
                margin-top: 20rpx;
                color: #ff4734;
                font-size: 24rpx;
                font-weight: 400;
                line-height: 24rpx;
            }
        }
        .receive {
            position: absolute;
            top: 60rpx;
            right: 20rpx;
            padding: 16rpx 36rpx;
            border-radius: 28rpx;
            color: #ffffff;
            font-size: 24rpx;
            font-weight: 500;
            background: #ff4734;
            line-height: 24rpx;
        }
        .receive-disable {
            opacity: 0.5;
        }
    }
}
</style>
