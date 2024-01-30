<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
import dayjs from 'dayjs';

import { getFinanceInfo } from '@/api/user/index';
import type { LogoffFinanceInfo } from '@/api/user/types';
import { WEBVIEW_BASE_URL } from '@/base/constants';

import { VerifyType } from '../verifyMobile/constants';
import { deleteReasons } from './constants';

const reason = ref(0);
const isAgree = ref(false);
const financeInfo = ref<LogoffFinanceInfo>({
    money: '-',
    totalWaitMoney: '-'
});

function onSelect(val: number) {
    reason.value = val;
}

function back() {
    router.back();
}

function verifyMobile() {
    if (!isAgree.value) {
        uni.showToast({
            title: '需同意掌上大学注销账户说明',
            icon: 'none'
        });
    }

    router.push('verifyMobile', {
        type: VerifyType.Logoff,
        reason: reason.value
    });
}

onMounted(async () => {
    const data = await getFinanceInfo();
    if (data) {
        financeInfo.value = data;
    }
});

function gotoRule() {
    router.push('webview', {
        url: encodeURIComponent(
            `${WEBVIEW_BASE_URL}/pages/common/activity-rule?type=accountDeleteRule`
        )
    });
}
</script>

<template>
    <view class="logoff">
        <view class="logoff-tips"> 如果您是误操作，请选择“暂不注销” </view>
        <view class="logoff-content">
            <uni-list :border="false">
                <uni-list-item :border="false">
                    <template #header>
                        <view class="logoff-content-title">请选择注销原因</view>
                    </template>
                </uni-list-item>
                <uni-list-item
                    v-for="item in deleteReasons"
                    :key="item.value"
                    :title="item.label"
                    :border="false"
                    clickable
                    @click="onSelect(item.value)"
                >
                    <template #footer>
                        <zd-radio
                            v-model="reason"
                            :value="item.value"
                            :size="40"
                        />
                    </template>
                </uni-list-item>
            </uni-list>
            <view class="logoff-content-tips">
                <text>注销成功后，您将失去以下佣金，不可恢复；</text>
                <text>可提现金额：{{ financeInfo.money }}元</text>
                <text>累计待入账：{{ financeInfo.totalWaitMoney }}元</text>
                <text>*数据更新时间：{{ dayjs().format('YYYY-MM-DD HH:mm') }}</text>
                <text
                    >注：本页面仅为注销申请，验证手机号后，账号会强制下线。强制下线的180天反悔期内有再次重新登录成功的情况，注销申请会立即失效。</text
                >
            </view>
            <view class="logoff-content-agreement">
                <radio
                    :value="1"
                    :checked="isAgree"
                    color="#199fff"
                    style="transform: scale(0.7)"
                    @tap="isAgree = !isAgree"
                />
                我已阅读并同意
                <view @tap="gotoRule"> 《掌上大学注销账户说明》 </view>
            </view>
        </view>
        <view class="logoff-footer">
            <zd-button
                style="flex: 1"
                :disabled="!isAgree"
                @tap="verifyMobile"
                >继续注销</zd-button
            >
            <zd-button
                style="flex: 1"
                type="primary"
                @tap="back"
                >暂不注销</zd-button
            >
        </view>
    </view>
</template>

<style scoped lang="scss">
.logoff {
    width: 100%;
    height: 100vh;
    background: $uni-text-color-inverse;

    &-tips {
        padding: 30rpx 0;
        text-align: center;
        color: $zd-main-color;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 24rpx;
        background: transparent;
    }

    &-content {
        overflow: hidden;
        width: 710rpx;
        margin: 0 20rpx;
        padding-bottom: 42rpx;
        border-radius: 16rpx;
        background: #fff;
        box-sizing: border-box;

        &-title {
            color: $uni-text-color-placeholder;
            font-size: 28rpx;
            font-weight: 400;
            line-height: 40rpx;
        }

        &-tips {
            display: flex;
            margin: 20rpx;
            padding: 30rpx;
            border: 2rpx solid #fff1e8;
            border-radius: 16rpx;
            color: #ee5f00;
            color: #ee5f00;
            font-size: 24rpx;
            font-weight: 400;
            background: #fffaf2;
            flex-direction: column;
            gap: 16rpx;
            line-height: 34rpx;
            box-sizing: border-box;

            text:nth-of-type(4) {
                color: rgba(238, 95, 0, 0.7);
            }

            text:last-of-type {
                color: #fa2721;
            }
        }

        &-agreement {
            display: flex;
            align-items: center;
            margin: 0 20rpx;
            color: #8a9399;
            font-size: 24rpx;
            font-weight: 400;
            gap: 14rpx;
            line-height: 24rpx;

            > view {
                margin-left: -8rpx;
                color: $zd-main-color;
            }
        }
    }

    &-footer {
        display: flex;
        align-items: center;
        gap: 22rpx;
        margin: 30rpx 40rpx;
    }
}
</style>
