<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
import { ref } from 'vue';

import {
    getStudentVerify,
    getStudentVerifyTreatmentList,
    submitConsumerVerify,
    updateStudentCampus
} from '@/api/student-auth';
import type {
    StudentInfo,
    SubmitConsumerVerifyReq,
    Treatment,
    UpdateStudentCampus
} from '@/api/student-auth/type';
import { useUserStore } from '@/stores/user';
import { CampusVerifyStatus, UserVerify } from '@/stores/user/types';

import FormBase from './components/form-base.vue';
import FormBaseUpdate from './components/form-base-update.vue';

const tabIndex = ref<1 | 2>(1);
const mode = ref<'edit' | 'display' | 'update'>('edit');
const treatmentList = ref<Treatment[]>([]);
const currentTreatment = ref<Treatment>();
const formRef = ref<InstanceType<typeof FormBase>>();
const formUpdateRef = ref<InstanceType<typeof FormBaseUpdate>>();
const validateResp = ref<any>();

const headerTextColor = computed(() => {
    return showHeader.value ? '$uni-text-color' : 'rgba(0,0,0,0)';
});
const showHeader = ref(false);
const headerOpacity = ref(0);
const userStore = useUserStore();
const { userInfo } = toRefs(userStore);

const studentAuthDetail = ref<StudentInfo>();

onPageScroll((e: any) => {
    showHeader.value = e.scrollTop >= 80;
    headerOpacity.value = e.scrollTop / 80;
});

onBeforeMount(() => {
    getTreatmentList();
    getVerifyStatus();
});

function scrollBottom() {
    uni.pageScrollTo({
        scrollTop: 1000000
    });
}

function switchTab(index: 1 | 2) {
    if (mode.value === 'display') return;
    tabIndex.value = index;
}

/**
 * 获取学生权益
 */
async function getTreatmentList() {
    try {
        const resp = await getStudentVerifyTreatmentList();
        treatmentList.value = resp!;
        currentTreatment.value = treatmentList.value[0];
    } catch (err) {
        console.log(err);
    }
}

/** 查看是否已存在认证信息 */
async function getVerifyStatus() {
    const resp = await getStudentVerify();
    if (resp) {
        studentAuthDetail.value = resp;
        if (resp.userAuthMethodType === 4 || resp.userAuthMethodType === 1) {
            tabIndex.value = 2;
        }
        if (resp?.studentChangeDTO?.verify === 1) {
            // 信息变更
            mode.value = 'display';
        }
        if (
            userInfo.value?.userVerify === UserVerify.Pass &&
            userInfo.value?.campusVerifyStatus !== CampusVerifyStatus.Pass
        ) {
            // 需要完善
            mode.value = 'update';
        }
    }
}

// 信息完善
async function update() {
    const formRes = formUpdateRef.value?.formvalidate();
    if (typeof formRes === 'string') {
        return uni.showToast({
            title: formRes,
            duration: 2000,
            icon: 'none'
        });
    } else {
        try {
            updateStudentCampus(formRes as UpdateStudentCampus);
            router.redirect('studentAuthStatus');
        } catch (err) {
            uni.showToast({
                title: (err as any).msg,
                icon: 'error'
            });
        }
    }
}

// 信息添加
async function submit() {
    const formRes = formRef.value?.formvalidate();
    if (typeof formRes === 'string') {
        return uni.showToast({
            title: formRes,
            duration: 2000,
            icon: 'none'
        });
    } else {
        formRes!.verifyType = tabIndex.value;
        try {
            await submitConsumerVerify(formRes as SubmitConsumerVerifyReq);
            router.redirect('studentAuthStatus');
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
    <zd-navbar
        title="学生认证"
        :background="`rgba(255,255,255, ${headerOpacity})`"
        :color="headerTextColor"
        class="header"
    >
        <template #prefix>
            <view
                class="back-btn"
                @tap="router.back()"
            >
                <zd-icon
                    type="zdmp-fanhui"
                    color="#000"
                    :size="40"
                ></zd-icon>
            </view>
        </template>
    </zd-navbar>
    <view class="page">
        <view class="banner">
            <image
                class="banner-img"
                src="http://cdn.zsdx.cn/mp-cs/images/ucenter/student-auth/banner.png"
                mode="widthFix"
            ></image>
            <image
                v-if="mode !== 'update'"
                class="banner-float-tag"
                src="http://cdn.zsdx.cn/mp-cs/images/ucenter/student-auth/float-tag.png"
                mode="widthFix"
                @tap="scrollBottom"
            ></image>
        </view>
        <view
            v-if="mode !== 'update'"
            class="tabbar"
        >
            <image
                class="tabbar-bg-img"
                :src="`http://cdn.zsdx.cn/mp-cs/images/ucenter/student-auth/tag-bg-${tabIndex}.png`"
                mode="widthFix"
            ></image>
            <view
                class="tabbar-item tabbar-item-1"
                @tap="switchTab(1)"
            >
                <image
                    class="tabbar-text-img"
                    :src="`http://cdn.zsdx.cn/mp-cs/images/ucenter/student-auth/tab-text-1${
                        tabIndex === 1 ? '_active' : ''
                    }.png`"
                    mode="heightFix"
                ></image>
            </view>
            <view
                class="tabbar-item tabbar-item-2"
                @tap="switchTab(2)"
            >
                <image
                    class="tabbar-text-img"
                    :src="`http://cdn.zsdx.cn/mp-cs/images/ucenter/student-auth/tab-text-2${
                        tabIndex === 2 ? '__active' : ''
                    }.png`"
                    mode="heightFix"
                ></image>
                <text class="extra">(无法在校学生认证)</text>
            </view>
        </view>

        <image
            v-if="mode === 'update'"
            class="banner-img"
            src="http://cdn.zsdx.cn/mp-cs/images/ucenter/student-auth/xinxiwanshan.png"
            mode="widthFix"
            style="width: 148rpx; margin-bottom: 34rpx; margin-left: 60rpx"
        ></image>
        <view
            class="tab tab1"
            :class="{ update: mode === 'update' }"
        >
            <view
                class="tips"
                :style="{
                    marginTop: mode === 'update' ? '48rpx' : 0
                }"
            >
                *校区及所在地仅供判断同校粉丝使用
            </view>
            <form-base
                v-if="mode !== 'update'"
                ref="formRef"
                :tab-index="tabIndex"
                :default-data="studentAuthDetail"
                @validate="v => (validateResp = v)"
            ></form-base>
            <form-base-update
                v-else
                ref="formUpdateRef"
                :default-data="studentAuthDetail"
            />
        </view>
        <zd-button
            v-if="mode === 'display'"
            type="primary"
            class="confirm-btn"
            @tap="router.redirect('studentAuthUpdate')"
        >
            信息变更
        </zd-button>
        <zd-button
            v-if="mode === 'edit'"
            type="primary"
            class="confirm-btn"
            :class="{
                disabled: typeof validateResp === 'string' ? true : false
            }"
            @tap="submit"
        >
            确认提交
        </zd-button>
        <zd-button
            v-if="mode === 'update'"
            type="primary"
            class="confirm-btn"
            @tap="update"
        >
            确认提交
        </zd-button>

        <template v-if="mode !== 'update'">
            <view class="equity-list">
                <view
                    v-for="(item, index) in treatmentList"
                    :key="item.treatmentId + '-' + index"
                    class="item"
                    @tap="currentTreatment = item"
                >
                    <image
                        :src="item.logoImage"
                        mode="heightFix"
                    ></image>
                    <view>{{ item.title }}</view>
                </view>
            </view>
            <view class="equity-content">
                <image
                    :src="currentTreatment?.contentImage"
                    mode="widthFix"
                ></image>
            </view>
        </template>
    </view>
</template>

<style scoped lang="scss">
.page {
    display: flex;
    min-height: 96vh;
    padding-bottom: 50rpx;
    background-color: #f4fed0;
    flex-direction: column;
    flex: 1;
}

.back-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60rpx;
    height: 60rpx;
    margin-left: 20rpx;
    flex-direction: row;
}

.header {
    position: fixed;
    top: 0;
    z-index: 1000;
}
.banner {
    position: relative;
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
.tabbar {
    position: relative;
    display: flex;
    align-items: center;
    height: 138rpx;
    margin: 0 30rpx;
    background-color: #fff;
    flex-direction: row;
    border-top-left-radius: 30rpx;
    border-top-right-radius: 30rpx;
    &-bg-img {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 5;
        width: 100%;
    }
    &-text-img {
        width: 200rpx;
        height: 32rpx;
    }
    &-item {
        z-index: 10;
        display: flex;
        align-items: center;
        height: 138rpx;
        margin-bottom: 30rpx;
        &-1 {
            display: flex;
            justify-content: center;
            width: 300rpx;
        }
        &-2 {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 400rpx;
            .extra {
                margin-left: 20rpx;
                color: #576066;
                font-size: 20rpx;
            }
        }
    }
}

.tab {
    margin: 0 30rpx;
    margin-bottom: 20rpx;
    padding: 0 50rpx;
    background-color: #fff;
    border-bottom-left-radius: 30rpx;
    border-bottom-right-radius: 30rpx;
    .tips {
        margin-bottom: 30rpx;
        font-size: 24rpx;
    }
    &.update {
        border-radius: 30rpx;
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
.disabled {
    :deep(button) {
        border: none;
        font-weight: bold;
        opacity: 0.6;
    }
}

.equity-list {
    display: flex;
    justify-content: space-around;
    height: 250rpx;
    margin: 0 30rpx;
    margin-top: 50rpx;
    padding-top: 84rpx;
    box-sizing: border-box;
    background: url(http://cdn.zsdx.cn/mp-cs/images/ucenter/student-auth/card-title.png);
    background-size: 100% 100%;
    .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        image {
            width: 104rpx;
            height: 104rpx;
        }
        view {
            color: $uni-text-color;
            font-size: 20rpx;
        }
    }
}
.equity-content {
    width: 690rpx;
    margin: 0 30rpx;
    margin-top: 20rpx;
    margin-bottom: 80rpx;
    padding: 0;
    border-radius: 30rpx;
    background-color: $uni-bg-color;
    box-sizing: border-box;
    image {
        width: 690rpx;
    }
}
</style>
