<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { router } from '@zsdx/mp-utils';

import { logoffMobile, logoffMobileCode, verifyOldMobile, verifyOldMobileCode } from '@/api/user';
import { useUserStore } from '@/stores/user';

import { deleteReasons } from '../logoff/constants';
import { VerifyType } from './constants';

const { getUserInfo } = useUserStore();

const code = ref('');
const verifyType = ref(VerifyType.Change);
const reason = ref('');

const verifyText = computed(() => {
    return verifyType.value === VerifyType.Change ? '修改的手机' : '注销账号';
});

const verifyRequest = computed(() => {
    return function () {
        new Promise<void>((resolve, reject) => {
            (verifyType.value === VerifyType.Change ? verifyOldMobileCode : logoffMobileCode)()
                .then(() => {
                    resolve();
                })
                .catch((error: any) => {
                    uni.showToast({
                        title: error.msg,
                        icon: 'none'
                    });
                    reject();
                });
        });
    };
});

async function verify() {
    try {
        await (verifyType.value === VerifyType.Change ? verifyOldMobile : logoffMobile)({
            phoneVerifyCode: code.value,
            deleteReason: reason.value
        });

        if (verifyType.value === VerifyType.Change) {
            router.push('changeMobile');
        } else {
            router.push('logoffStatus');
        }
    } catch (err: any) {
        uni.showToast({
            title: err.msg,
            icon: 'none'
        });
    }
}

onLoad(options => {
    if (options?.type === VerifyType.Logoff) {
        uni.setNavigationBarTitle({ title: '账户注销' });
        verifyType.value = options?.type;
        reason.value = deleteReasons[options?.reason].label || '';
    } else {
        uni.setNavigationBarTitle({ title: '修改手机号' });
    }
});
</script>

<template>
    <view class="verify-mobile">
        <view class="verify-mobile-tips">
            <text>你正在{{ verifyText }}</text>
            <text>{{ getUserInfo?.maskedPhone }}</text>
        </view>
        <view class="verify-mobile-content">
            <text class="verify-mobile-content-prefix"> 请验证 </text>
            <zd-captcha
                v-model="code"
                :request="verifyRequest"
                :storage-key="
                    verifyType === VerifyType.Change ? 'verifyChangeMobile' : 'verifyLogoffMobile'
                "
            />
        </view>
    </view>
    <view class="next-btn">
        <zd-button
            :disabled="code.length !== 4"
            :style="{ width: '100%' }"
            type="primary"
            @tap="verify"
        >
            下一步
        </zd-button>
    </view>
</template>

<style scoped lang="scss">
.verify-mobile {
    display: flex;
    flex-direction: column;
    gap: 112rpx;
    padding: 112rpx 64rpx;
    box-sizing: border-box;
    color: $uni-color-title;

    &-tips {
        display: flex;
        align-items: center;
        color: $uni-color-title;
        gap: 24rpx;

        text:first-of-type {
            font-size: 28rpx;
            font-weight: 400;
            line-height: 40rpx;
        }

        text:last-of-type {
            font-size: 40rpx;
            font-weight: 500;
            line-height: 56rpx;
        }
    }

    &-content {
        display: flex;
        flex-direction: column;
        gap: 28rpx;

        &-prefix {
            font-size: 28rpx;
            font-weight: 400;
            line-height: 40rpx;
        }
    }
}

.next-btn {
    position: absolute;
    bottom: calc(env(safe-area-inset-bottom));
    left: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 670rpx;
    height: 80rpx;
    margin-bottom: 20rpx;
    transform: translateX(-50%);
    line-height: 32rpx;
}
</style>
