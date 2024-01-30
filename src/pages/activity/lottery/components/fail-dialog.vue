<script setup lang="ts">
import { CDN_BASE_URL } from '@/base/constants';

import { Result } from '../types';

const popup = ref();
const showType = ref<Result>(Result.Fail);

function close() {
    popup.value?.close();
}

defineExpose({
    show: (type: Result) => {
        showType.value = type;
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
            <view class="modal-content-inner">
                <view class="title"> 哎呀～就差那么一点点 </view>
                <view
                    v-if="showType === Result.Fail"
                    class="desc"
                >
                    别灰心，再来一次
                </view>
                <view
                    v-else-if="showType === Result.NoChance"
                    class="desc"
                >
                    抽奖次数不足，快去获取吧
                </view>
                <image
                    class="fail-img"
                    :src="`${CDN_BASE_URL}/mp-cs/images/activity/lottery/fail-img.png`"
                    mode="aspectFill"
                />
                <view class="btn">
                    <view
                        class="btn-text"
                        @tap="close"
                    >
                        {{ showType === Result.Fail ? '再抽一次' : '知道了' }}
                    </view>
                </view>
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
    display: flex;
    justify-content: center;
    align-items: center;
    width: 542rpx;
    height: 568rpx;
    border-radius: 32rpx;
    background-image: linear-gradient(to right bottom, #ffae41, #fb1c59, #ff3288, #ff6f22, #ffbd2d);

    &-inner {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 522rpx;
        height: 552rpx;
        border-radius: 28rpx;
        background: #fae7e2;
        flex-direction: column;

        .title {
            color: #ea3054;
            font-size: 36rpx;
            font-weight: 500;
            line-height: 50rpx;
        }

        .desc {
            margin-top: 12rpx;
            color: #634a4f;
            font-size: 32rpx;
            font-weight: 400;
            line-height: 44rpx;
        }

        .fail-img {
            display: block;
            width: 186rpx;
            height: 202rpx;
            margin-top: 32rpx;
        }

        .btn {
            width: 406rpx;
            height: 172rpx;
            background: url(https://nss1.zsdx.cn/mp-cs/images/activity/lottery/fail-btn.png)
                no-repeat;
            background-position: center;
            background-size: cover;

            &-text {
                margin-top: 58rpx;
                text-align: center;
                color: #ffffff;
                font-size: 28rpx;
                font-weight: 500;
                line-height: 28rpx;
            }
        }
    }

    .close-btn {
        position: absolute;
        top: -40rpx;
        right: -40rpx;
        color: #f5f8fa;
        transform: rotate(45deg);
    }
}
</style>
