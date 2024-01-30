<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
import { ref } from 'vue';

import { changeConsumerVerify, changeStudentVerify, getStudentVerify } from '@/api/student-auth';
import type { ChangeConsumerVerifyReq, StudentInfo } from '@/api/student-auth/type';

import FormBase from './components/form-base.vue';

onLoad(() => {
    getAuthStatus();
});

const formRef = ref<InstanceType<typeof FormBase>>();
const detail = ref<StudentInfo>();

async function getAuthStatus() {
    const resp = await getStudentVerify();
    detail.value = resp;
}

async function submit() {
    const formRes = formRef.value?.formvalidate();
    if (typeof formRes === 'string') {
        return uni.showToast({
            title: formRes,
            duration: 2000,
            icon: 'none'
        });
    } else {
        try {
            if (detail.value?.userAuthMethodType === 1 || detail.value?.userAuthMethodType === 2) {
                formRes!.campusType = formRes?.campusId ? 0 : 1;
                formRes!.schoolId = formRes!.schoolId + '';
                await changeStudentVerify(formRes as ChangeConsumerVerifyReq);
                router.redirect('studentAuthStatus', {
                    status: 1
                });
            } else {
                await changeConsumerVerify(formRes as ChangeConsumerVerifyReq);
                router.redirect('studentAuthStatus', {
                    status: 1
                });
            }
        } catch (err) {
            uni.showToast({
                title: (err as any).msg ?? '未知错误',
                icon: 'none'
            });
        }
    }
}
</script>

<template>
    <view class="page">
        <view class="banner">
            <image
                class="banner-img"
                src="http://cdn.zsdx.cn/mp-cs/images/ucenter/student-auth/banner-2.png"
                mode="widthFix"
            ></image>
        </view>
        <view class="title">
            <view class="main"> 学生认证 </view>
            <view class="tips"> 审核周期为三个工作日，审核成功后信息自动变更 </view>
        </view>
        <view class="form-card">
            <form-base
                ref="formRef"
                :detail="detail!"
            ></form-base>
        </view>
        <zd-button
            type="primary"
            class="confirm-btn"
            @tap="submit"
        >
            提交
        </zd-button>
    </view>
</template>

<style scoped lang="scss">
.page {
    display: flex;
    height: 100%;
    padding-bottom: 50rpx;
    background-color: #f1f8ff;
    flex-direction: column;
    flex: 1;
}
.banner {
    position: absolute;
    top: 0;
    z-index: 0;
    width: 750rpx;
    &-img {
        width: 100%;
    }
    &-float-tag {
        position: absolute;
        right: 0;
        bottom: 100rpx;
        width: 232rpx;
    }
}
.title {
    position: relative;
    z-index: 10;
    margin: 0 30rpx;
    margin-top: 40rpx;
    color: #ffffff;
    .main {
        font-size: 36rpx;
        font-weight: bold;
    }
    .tips {
        margin-top: 18rpx;
        margin-bottom: 40rpx;
        font-size: 26rpx;
    }
}

.form-card {
    z-index: 10;
    margin: 0 30rpx;
    margin-bottom: 20rpx;
    padding: 0 50rpx;
    padding-bottom: 58rpx;
    border-radius: 30rpx;
    background-color: #fff;
    .tips {
        font-size: 24rpx;
    }
}

.confirm-btn {
    width: 630rpx;
    height: 80rpx;
    margin: 0 60rpx;
    margin-top: 20rpx;
    border: none;
    :deep(button) {
        border: none;
        font-weight: bold;
    }
}
</style>
