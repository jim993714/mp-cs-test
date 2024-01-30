<script setup lang="ts">
import dayjs from 'dayjs';

import { receiveCoupon } from '@/api/coupon/index';
import { getCouponDetail, getCouponRule } from '@/api/ucenter';
import type { Coupon, CouponRes, RedPacket, RedPacketRes, RuleItem } from '@/api/ucenter/types';
import { CouponRuleType } from '@/api/ucenter/types';
import { CouponType } from '@/api/ucenter/types/my-prize';
import definePageProps from '@/utils/definePageProps';
import useRouter from '@/utils/router/useRouter';
import { subscribeCouponMsg } from '@/utils/subscribe';

const router = useRouter();
const showHome = ref(false);
const detail = ref<CouponRes>();
const unfold = ref(false);
const rules = ref<string[]>([]);

const options = definePageProps<{
    coupon_no?: string;
    couponNo?: string;
    studentCouponNo?: string;
}>(() => {
    const pages = getCurrentPages();
    showHome.value = pages.length === 1;
    getDetail();
    getRules();
});

onShow(() => {
    getDetail();
    getRules();
});

onPullDownRefresh(() => {
    getDetail();
    getRules();
});

function toHome() {
    uni.$emit('goIndex');
}

async function getDetail() {
    try {
        detail.value = await getCouponDetail(
            options.value?.couponNo ?? options.value?.coupon_no ?? ''
        );
        uni.stopPullDownRefresh();
    } catch (err: any) {
        uni.showToast({
            title: err.msg,
            icon: 'none'
        });
    }
}

/**
 * 获取规则
 */
async function getRules() {
    const res = (await getCouponRule(CouponRuleType.ORDER)).content;
    rules.value = res.split(',');
}

/** 领取 */
async function accept() {
    try {
        await receiveCoupon({
            couponNo: detail.value?.couponInfo.couponNo ?? options.value?.couponNo ?? ''
        });
        uni.showToast({
            title: '优惠券领取成功',
            icon: 'success'
        });
        getDetail();
        subscribeCouponMsg();
    } catch (err: any) {
        uni.showToast({
            title: err.msg,
            icon: 'none'
        });
    }
}
</script>

<template>
    <zd-header
        title="物流信息"
        color="red"
        show-header-left
        class="zd-header"
        show-fixed
        fix-background="#fff"
        fix-color="#333"
    >
        <template #fix-set>
            <view class="header">
                <zd-icon
                    v-if="showHome"
                    type="zdmp-huidaoshouye"
                    :size="46"
                    style="z-index: 100"
                    @tap="toHome"
                />
                <zd-icon
                    v-else
                    type="zdmp-fanhui"
                    :size="36"
                    style="z-index: 100"
                    @tap="router.back()"
                />
                <view class="title"> 领取优惠券 </view>
            </view>
        </template>
    </zd-header>
    <view
        class="card"
        style="padding-bottom: 0rpx"
    >
        <view class="title">恭喜你获得一张优惠券</view>
        <view class="img-wrapper">
            <image
                mode="scaleToFill"
                src="https://cdn.zsdx.cn/mp-cs/images/activity/discount-coupon/card-bg-3.png"
                class="card-bg-img"
            />
            <image
                v-if="detail?.couponInfo.receiveStatus === 1"
                class="tag-accepted"
                src="https://cdn.zsdx.cn/mp-cs/images/activity/discount-coupon/coupon-accept1.png"
                mode="aspectFit"
            ></image>
            <view class="card-info">
                <view class="info-left">
                    <view class="text-1"> {{ detail?.couponInfo.title }} </view>
                    <view class="text-2">
                        使用时间
                        {{ dayjs(detail?.couponInfo.useStartTime).format('YYYY-MM-DD') }}-{{
                            dayjs(detail?.couponInfo.useEndTime).format('YYYY-MM-DD')
                        }}
                    </view>
                </view>
                <view class="split"></view>
                <view class="info-right">
                    <text
                        v-if="detail?.couponInfo.couponType === CouponType.Money"
                        style="font-size: 32rpx"
                        >¥</text
                    >
                    <text
                        class="bebas-neue-regular"
                        style="font-size: 64rpx"
                        >{{ detail?.couponInfo?.discountNum }}</text
                    >
                    <text
                        v-if="detail?.couponInfo.couponType === CouponType.Coupon"
                        style="font-size: 32rpx"
                        >折</text
                    >
                </view>
            </view>
            <view
                class="card-info"
                @click="() => (unfold = !unfold)"
            >
                <view class="unfold">
                    详细信息
                    <view
                        class="icon-wrapper"
                        :style="{
                            transform: `rotate(${unfold ? '90deg' : '0'}) `
                        }"
                    >
                        <zd-icon
                            :size="24"
                            type="zdmp-qianwang"
                            color="#fff"
                        ></zd-icon>
                    </view>
                </view>
            </view>
        </view>
        <view
            v-if="unfold"
            class="desc-wrapper"
        >
            <rich-text
                :nodes="detail?.couponInfo.desc?.replace(/\r?\n|(?<!\n)\r/g, '<br>')"
            ></rich-text>
        </view>
        <view>
            <view
                v-if="detail?.couponInfo.receiveStatus === 0"
                class="btn-wrapper"
            >
                <image
                    mode="scaleToFill"
                    src="https://cdn.zsdx.cn/mp-cs/images/activity/discount-coupon/btn-1.png"
                    class="card-btn"
                />
                <view
                    class="btn-text"
                    @click="accept"
                >
                    立即领取
                </view>
            </view>
            <view
                v-else-if="detail?.couponInfo.receiveStatus === 1"
                class="btn-wrapper"
            >
                <image
                    mode="scaleToFill"
                    src="https://cdn.zsdx.cn/mp-cs/images/activity/discount-coupon/btn-1.png"
                    class="card-btn"
                />
                <view
                    class="btn-text"
                    @click="toHome"
                >
                    去使用
                </view>
            </view>
            <view
                v-else
                class="btn-group"
            >
                <view class="btn-wrapper-small">
                    <image
                        mode="scaleToFill"
                        src="https://cdn.zsdx.cn/mp-cs/images/activity/discount-coupon/coupon-small-btn-bg5.png"
                        class="card-btn-small"
                    />
                    <view
                        class="btn-text-small"
                        :style="{
                            color: '#e24300'
                        }"
                        @click="accept"
                    >
                        继续领取
                    </view>
                </view>
                <view class="btn-wrapper-small">
                    <image
                        mode="scaleToFill"
                        src="https://cdn.zsdx.cn/mp-cs/images/activity/discount-coupon/coupon-small-btn-bg4.png"
                        class="card-btn-small"
                        :style="{
                            width: '355rpx',
                            height: '150rpx'
                        }"
                    />
                    <view
                        class="btn-text-small"
                        @click="toHome"
                    >
                        去使用
                    </view>
                </view>
            </view>
        </view>
    </view>
    <view class="card">
        <view class="title">使用规则</view>
        <view
            v-for="(item, index) in rules"
            :key="index"
            class="section"
        >
            {{ item }}
        </view>
    </view>
</template>

<style lang="scss">
page {
    background-color: #ff6050;
}
</style>
<style scoped lang="scss">
.zd-header {
    z-index: 100;
    .header {
        top: 0;
        display: flex;
        align-items: center;
        height: 100rpx;
        padding-left: 20rpx;
        color: $uni-color-title;
        .title {
            z-index: 10;
            width: 200rpx;
            margin-left: -80rpx;
            text-align: center;
            font-weight: bold;
            flex: 1;
            image {
                width: 148rpx;
            }
        }
    }
}
.card {
    width: 710rpx;
    margin: 20rpx;
    padding-bottom: 30rpx;
    border-radius: 16rpx;
    background-color: #fff;
    .title {
        height: 90rpx;
        line-height: 90rpx;
        text-align: center;
    }

    .img-wrapper {
        position: relative;
        width: 710rpx;
        height: 302rpx;
        .card-bg-img {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
            width: 710rpx;
            height: 302rpx;
        }
        .tag-accepted {
            position: absolute;
            top: 114rpx;
            right: 154rpx;
            z-index: 11;
            width: 120rpx;
            height: 120rpx;
        }
        .card-info {
            position: relative;
            z-index: 100;
            display: flex;
            align-items: center;
            width: 650rpx;
            padding-top: 46rpx;
            padding-left: 60rpx;
            color: #fff;
            flex-direction: row;
            .info-left {
                flex: 1;
                .text-1 {
                    font-size: 32rpx;
                    font-weight: 500;
                }
                .text-2 {
                    margin-top: 20rpx;
                    font-size: 24rpx;
                }
            }
            .split {
                width: 2rpx;
                height: 76rpx;
                background: rgba(255, 255, 255, 0.44);
            }
            .info-right {
                width: 184rpx;
                text-align: center;
            }
        }
        .unfold {
            position: absolute;
            right: 60rpx;
            display: flex;
            display: flex;
            align-items: baseline;
            margin-top: 40rpx;
            text-align: right;
            font-size: 24rpx;
            .icon-wrapper {
                display: flex;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 24rpx;
                height: 24rpx;
                transition: all 0.4s;
                transform-origin: center;
            }
        }
    }
    .btn-group {
        position: relative;
        display: flex;
        width: 710rpx;
        .card-btn-small {
            position: absolute;
            width: 355rpx;
            height: 150rpx;
        }
        .btn-wrapper-small {
            position: relative;
            width: 355rpx;
            height: 150rpx;
        }
        .btn-text-small {
            position: relative;
            z-index: 100;
            width: 100%;
            padding-top: 30rpx;
            text-align: center;
            color: #fff;
            font-size: 32rpx;
            font-weight: 500;
        }
    }
    .btn-wrapper {
        position: relative;
        width: 590rpx;
        height: 144rpx;
        margin: 0 60rpx;
        .card-btn {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
            width: 590rpx;
            height: 144rpx;
        }
        .btn-text {
            position: relative;
            z-index: 100;
            width: 100%;
            padding-top: 20rpx;
            text-align: center;
            color: #fff;
            font-size: 32rpx;
            font-weight: 500;
        }
    }
    .section {
        margin: 0 30rpx;
        margin-bottom: 16rpx;
        color: #666;
        font-size: 24rpx;
        line-height: 40rpx;
    }

    .desc-wrapper {
        width: 650rpx;
        margin: -68rpx 30rpx 20rpx;
        padding: 40rpx 30rpx 20rpx;
        border-radius: 12rpx;
        font-size: 24rpx;
        background: linear-gradient(315deg, rgba(255, 8, 68, 0.1), rgba(255, 136, 100, 0.1));
        box-sizing: border-box;
        line-height: 36rpx;
    }
}
</style>
