<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { verifyNewMobile, verifyNewMobileCode } from '@/api/user';
import { useUserStore } from '@/stores/user';

const form = reactive({
    phone: '',
    code: ''
});

const { updateUserInfo } = useUserStore();

async function request() {
    if (!form.phone) {
        uni.showToast({
            title: '请输入手机号',
            icon: 'none'
        });
        return Promise.reject();
    }

    try {
        await verifyNewMobileCode({
            phone: form.phone
        });
    } catch (error: any) {
        uni.showToast({
            title: error.msg,
            icon: 'none'
        });
        return Promise.reject();
    }
}

async function changeMobile() {
    try {
        await verifyNewMobile({
            phone: form.phone,
            newPhoneVerifyCode: form.code
        });

        await updateUserInfo();
        router.back({ delta: 2 });
    } catch (err: any) {
        uni.showToast({
            title: err.msg,
            icon: 'none'
        });
    }
}
</script>

<template>
    <view class="page-wrap">
        <view class="title"> 请输入新手机号 </view>
        <view class="form">
            <zd-captcha
                v-model="form.phone"
                placeholder="输入手机号"
                no-cutdown
                focus
                maxlength="11"
                type="number"
                confirm-type="next"
            />
            <zd-captcha
                v-model="form.code"
                :request="request"
                type="number"
                confirm-type="done"
                storage-key="changeMobile"
            />
        </view>
        <view class="next-btn">
            <zd-button
                style="width: 100%"
                :disabled="form.code.length !== 4 || form.phone.length !== 11"
                type="primary"
                @tap="changeMobile"
            >
                下一步
            </zd-button>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.page-wrap {
    padding: 0 40rpx;

    .title {
        margin: 80rpx 0;
        color: #1d2023;
        font-size: 48rpx;
        font-weight: 500;
        line-height: 48rpx;
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 48rpx;
    }

    .btn-group {
        display: flex;
        flex-direction: column;
        gap: 12rpx;
        margin-top: 60rpx;

        .wx-login-btn {
            text-align: center;
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
}
</style>
