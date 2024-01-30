<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { type LotteryResult, LotteryResultPrizeType } from '@/api/lottery/types';
import { CDN_BASE_URL } from '@/base/constants';

const popup = ref();
const lotterInfo = ref<LotteryResult>();

function close() {
    popup.value?.close();
}

/**
 * 查看奖品
 */
function viewPrize() {
    close();
    if (lotterInfo.value?.type === LotteryResultPrizeType.GOODS) {
        router.push('prizeDetail', {
            exchangeNo: lotterInfo.value?.exchangeNo
        });
        return;
    }
    router.push('myPrize');
}

defineExpose({
    show: (data: LotteryResult) => {
        lotterInfo.value = data;
        popup.value?.open();
    }
});
</script>

<template>
    <zd-popup
        ref="popup"
        type="center"
        :is-mask-click="false"
    >
        <view class="modal-content">
            <image
                class="main-bg"
                :src="`${CDN_BASE_URL}/mp-cs/images/activity/lottery/success-bg.png`"
                mode="aspectFill"
            />

            <image
                class="light-bg"
                :src="`${CDN_BASE_URL}/mp-cs/images/activity/lottery/light-bg.png`"
                mode="aspectFill"
            />
            <image
                class="light"
                :src="`${CDN_BASE_URL}/mp-cs/images/activity/lottery/light.png`"
                mode="aspectFill"
            />

            <view class="lottery-info">
                <image
                    class="lottery-image"
                    :src="lotterInfo?.image"
                    mode="aspectFill"
                />
                <view class="lottery-name ellipsis2">
                    {{ lotterInfo?.title }}
                </view>
            </view>

            <view class="tips">温馨提示: 奖品是有有效期的, 请尽快使用</view>

            <view
                class="btn"
                @tap="viewPrize"
            >
                查看奖品
            </view>
            <zd-icon
                type="zdmp-tianjiadefuben"
                class="close-btn"
                :size="40"
                @tap="close"
            />
        </view>
    </zd-popup>
</template>

<style lang="scss" scoped>
.modal-content {
    position: relative;
    width: 594rpx;
    height: 684rpx;

    .main-bg {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 594rpx;
        height: 684rpx;
    }

    .light-bg {
        position: absolute;
        top: -62rpx;
        left: 66rpx;
        width: 460rpx;
        height: 460rpx;
    }

    .light {
        position: absolute;
        top: -100rpx;
        left: 28rpx;
        width: 538rpx;
        height: 538rpx;
        transform: translate3d(0, 0, 0);
        animation: light 5s linear infinite;
    }

    .lottery-info {
        position: absolute;
        top: 300rpx;
        left: 92rpx;
        z-index: 2;
        display: flex;
        align-items: center;
        width: 594rpx;
        gap: 58rpx;

        .lottery-image {
            width: 138rpx;
            height: 138rpx;
            border-radius: 8rpx;
        }

        .lottery-name {
            width: 200rpx;
            color: #933b3e;
            font-size: 28rpx;
            font-weight: 600;
            line-height: 40rpx;
        }
    }

    .tips {
        position: absolute;
        bottom: 180rpx;
        left: 78rpx;
        z-index: 2;
        width: 438rpx;
        color: #ffffff;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 24rpx;
    }

    .btn {
        position: absolute;
        bottom: 60rpx;
        left: 124rpx;
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 342rpx;
        height: 80rpx;
        color: #fb1863;
        font-size: 28rpx;
        font-weight: 500;
        background: url(https://nss1.zsdx.cn/mp-cs/images/activity/lottery/success-btn.png)
            no-repeat;
        background-size: 100% 100%;
        line-height: 28rpx;
    }

    .close-btn {
        position: absolute;
        top: 20rpx;
        right: -20rpx;
        color: #f5f8fa;
        transform: rotate(45deg);
    }
}
@keyframes light {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
