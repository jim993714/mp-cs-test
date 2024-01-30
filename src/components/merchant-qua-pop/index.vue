<script lang="ts" setup>
import { getVerify } from '@/api/common/index';
import { getHireQualification } from '@/api/goods-detail/index';
import useRouter from '@/utils/router/useRouter';

const props = defineProps<{
    hireNo: string;
}>();

const router = useRouter();

const key = ref(new Date().getTime() + '');

const zdPopupRef = ref();
const inputRef = ref();
const authCode = ref('');
const qrcodeImage = ref('');

function open() {
    authCode.value = '';
    zdPopupRef.value?.open();
    inputRef.value?.focus();
    getQrCode();
}

function close() {
    zdPopupRef.value?.close();
}

async function confirm() {
    const params = {
        key: key.value,
        code: authCode.value,
        hireNo: props.hireNo
    };
    try {
        const resp = await getHireQualification(params);
        if (resp.list) {
            close();
            router.push('activityRules', {
                type: 'MERCHANT_QUA',
                params
            });
        }
    } catch (err: any) {
        uni.showToast({
            title: err.msg,
            icon: 'none'
        });
    }
}

async function getQrCode() {
    try {
        const resp = await getVerify(key.value);
        qrcodeImage.value = 'data:image/jpeg;base64, ' + resp;
    } catch (err: any) {
        uni.showToast({
            title: err.msg,
            icon: 'none'
        });
    }
}

defineExpose({
    open,
    close
});
</script>

<template>
    <zd-popup ref="zdPopupRef">
        <view class="content">
            <view class="header"> 查看商家资质证照 </view>
            <view class="content-center">
                <input
                    ref="inputRef"
                    v-model="authCode"
                    class="input"
                    placeholder="输入验证码"
                />
                <image
                    :src="qrcodeImage"
                    class="auth-code-img"
                    @tap="getQrCode"
                ></image>
            </view>
            <view class="btn-group">
                <view
                    class="btn cancel"
                    @tap="close"
                >
                    取消
                </view>
                <view
                    class="btn"
                    style="margin-left: 22rpx"
                    @tap="confirm"
                >
                    确定
                </view>
            </view>
        </view>
    </zd-popup>
</template>

<style lang="scss" scoped>
.mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100000;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 750rpx;
    height: 100vh;
    background-color: rgba($color: #000000, $alpha: 0.5);
    flex: 1;
}
.content {
    display: flex;
    align-items: center;
    width: 582rpx;
    height: 384rpx;
    border-radius: 32rpx;
    background-color: #fff;
    flex-direction: column;
    .header {
        position: relative;
        width: 100%;
        margin: 48rpx 0;
        text-align: center;
        color: #333;
        font-size: 32rpx;
        font-weight: bold;
        .close {
            position: absolute;
            top: -15rpx;
            right: 30rpx;
            opacity: 0.6;
        }
    }

    .content-center {
        display: flex;
        .input {
            width: 322rpx;
            height: 68rpx;
            padding-left: 20rpx;
            border: 2rpx solid $uni-text-color-disable;
            border-radius: 8rpx;
            background-color: #fff;
        }

        .auth-code-img {
            width: 160rpx;
            height: 68rpx;
            margin-left: 20rpx;
            border-radius: 8rpx;
        }
    }

    .btn-group {
        display: flex;
        .btn {
            width: 240rpx;
            height: 80rpx;
            margin-top: 60rpx;
            border-radius: 40rpx;
            text-align: center;
            color: #fff;
            font-size: 28rpx;
            font-weight: bold;
            background-color: #20a0ff;
            line-height: 80rpx;
            &.cancel {
                border: 2rpx solid rgba($color: #8a9399, $alpha: 0.3);
                color: $uni-text-color-placeholder;
                background-color: #fff;
            }
        }
    }
}
</style>
