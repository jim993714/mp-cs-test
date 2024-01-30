<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
import { ref } from 'vue';

import { getVerifyAwardList } from '@/api/redpacket/index';
import useStudentAuth from '@/components/student-auth-pop/useStudentAuth';

import CouponItem from '../redpacket/components/list/components/coupon-item/index.vue';

const { getAuthStatus } = useStudentAuth();

const options = ref<{
    status: number; // 1: 进行中 2，未通过, 99,认证成功
    reason: string;
    from: 'add' | 'update';
}>({
    status: 1,
    reason: '',
    from: 'add'
});

const couponList = ref<any[]>([]);

//
const getStatus = async () => {
    let authData = await getAuthStatus();

    if (authData?.verify === 1) {
        try {
            // 获取优惠券列表
            couponList.value = await getVerifyAwardList();
            options.value.status = 99;
        } catch (e) {
            console.log(e);
        }
    }
};

onLoad(options_ => {
    options.value.status = parseInt(options_?.status ?? '1');
    options.value.reason = options_?.reason;
    options.value.from = options_?.from;
    if (options.value.status === 1) {
        getStatus();
    }
});
</script>
<script lang="ts">
export default {
    options: {
        styleIsolation: 'shared'
    }
};
</script>

<template>
    <view class="container">
        <template v-if="options.status === 99">
            <image
                class="status-icon"
                src="http://cdn.zsdx.cn/mp-cs/images/ucenter/student-auth/auth-success.png"
                mode="heightFix"
            ></image>
            <view class="status-text status-3">恭喜你，学生认证成功</view>
            <view class="info-text-seat"></view>
            <zd-button
                class="btn submit-btn"
                type="primary"
                @tap="router.back()"
            >
                知道了~
            </zd-button>
        </template>
        <template v-if="options.status === 1">
            <image
                class="status-icon"
                src="http://cdn.zsdx.cn/mp-cs/images/ucenter/student-auth/under-way.png"
                mode="heightFix"
            ></image>
            <view class="status-text status-1">审核中</view>
            <view class="info-text">
                <template v-if="options.from === 'update'">
                    信息变更已提交，掌大学长将会加急审核，预计审核时间1-3个工作日，请及时关注审核结果
                </template>
                <template v-else>
                    已收到您提交的信息了，掌大学长将会加急审核哦，预计审核时间1～3个工作日，通过后将及时通知您哦，请静候佳音哦～
                </template>
            </view>
            <zd-button
                class="btn submit-btn"
                type="primary"
                @tap="router.back()"
            >
                知道了~
            </zd-button>
        </template>

        <template v-if="options.status === 2">
            <image
                class="status-icon"
                src="http://cdn.zsdx.cn/mp-cs/images/ucenter/student-auth/failed.png"
                mode="heightFix"
            ></image>
            <view class="status-text status-2">审核未通过</view>
            <view class="info-text">
                {{ options.reason }}
            </view>
            <zd-button
                v-if="options.from === 'add'"
                class="btn submit-btn"
                type="primary"
                @tap="router.redirect('studentAuth')"
            >
                重新提交
            </zd-button>
            <view
                v-if="options.from === 'update'"
                style="display: flex"
            >
                <zd-button
                    type="outline"
                    :button-style="{
                        width: '230rpx'
                    }"
                    @tap="router.back()"
                >
                    返回
                </zd-button>
                <zd-button
                    type="primary"
                    style="margin-left: 40rpx"
                    :button-style="{
                        width: '230rpx'
                    }"
                    @tap="router.redirect('studentAuthUpdate')"
                >
                    重新填写
                </zd-button>
            </view>
        </template>
        <view
            v-if="couponList.length > 0"
            class="coupon-list"
        >
            <image
                class="coupon-list-title"
                src="https://cdn.zsdx.cn/mp-cs/images/ucenter/student-auth/auth-coupon-title.png"
                mode="widthFix"
            />
            <view
                v-for="(coupon, cIndex) in couponList"
                :key="cIndex"
                class="coupon-list-item"
            >
                <CouponItem
                    :item="coupon"
                    :type="1"
                />
            </view>
            <view class="coupon-list-tip"
                >说明：新人券包中的优惠券只允许使用一张，使用一张后， 其他优惠券也将失效</view
            >
        </view>
    </view>
</template>

<style scoped lang="scss">
.page {
    display: flex;
    align-items: center;
    height: 100%;
    padding-bottom: 50rpx;
    flex-direction: column;
    flex: 1;
}
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 200rpx;
}
.status-icon {
    width: 230rpx;
    height: 194rpx;
}
.status-text {
    margin-top: 40rpx;
    font-size: 32rpx;
    font-weight: 500;
    &.status-1 {
        color: $zd-color-orange;
    }
    &.status-2 {
        color: $zd-color-red;
    }
    &.status-3 {
        color: #199fff;
    }
}
.info-text {
    width: 522rpx;
    height: 132rpx;
    margin-top: 48rpx;
    margin-bottom: 90rpx;
    text-align: center;
    color: #999999;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 44rpx;
}
.info-text-seat {
    margin-top: 60rpx;
}
.btn {
    :deep(button) {
        width: 360rpx;
        height: 80rpx;
        border: none;
    }
}
.coupon-list {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 750rpx;
    margin-top: 60rpx;
    padding: 0 0 200rpx;
    background-color: #f5f6f8;
    flex-direction: column;
    &-title {
        width: 494rpx;
        margin-top: 40rpx;
        margin-bottom: 10rpx;
    }
    &-tip {
        width: 710rpx;
        margin-top: 20rpx;
        color: #999999;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 34rpx;
    }
}
</style>
