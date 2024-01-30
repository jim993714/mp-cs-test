<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { CDN_BASE_URL } from '@/base/constants';

function gotoLogin() {
    router.reLaunch('login');
}
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
        <image
            class="status-icon"
            :src="CDN_BASE_URL + '/mp-cs/images/ucenter/logoff-success.png'"
            mode="heightFix"
        ></image>
        <view class="status-text">申请注销成功</view>
        <view class="info-text">
            申请注销成功！账号将会强制下线，掌上大学将在180天内处理你的申请并删除你的所有数据，180天内请不要登录掌上大学，以确保注销顺利完成～
        </view>
        <view class="info-tips">
            注：若180天反悔期内有再次重新登录成功的情况，注销申请会立即失效。
        </view>
        <zd-button
            class="btn submit-btn"
            type="primary"
            @tap="gotoLogin"
        >
            知道了
        </zd-button>
    </view>
</template>

<style scoped lang="scss">
.page {
    display: flex;
    align-items: center;
    height: 100%;
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
    color: $zd-main-color;
    font-size: 32rpx;
    font-weight: 500;
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

.info-tips {
    width: 522rpx;
    height: 68rpx;
    text-align: center;
    color: $zd-color-red;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 34rpx;
}

.btn {
    margin-top: 50rpx;
    :deep(button) {
        width: 360rpx;
        height: 80rpx;
        border: none;
    }
}
</style>
