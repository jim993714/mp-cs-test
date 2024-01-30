<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { getAboutUs } from '@/api/user';
import { CDN_BASE_URL, WEBVIEW_BASE_URL } from '@/base/constants';

const { appVersion } = uni.getAppBaseInfo();

function goto(url: string) {
    router.push('webview', {
        url: `${WEBVIEW_BASE_URL}${url}`
    });
}

function gotoPrivacy(url: string) {
    router.push('webview', {
        url: `${CDN_BASE_URL}/mp-cs/privacy-v2.html`
    });
}

async function gotoAboutUs() {
    const { aboutUsUrl } = await getAboutUs();
    router.push('webview', {
        url: encodeURIComponent(aboutUsUrl)
    });
}
</script>

<template>
    <view class="about">
        <view class="about-header">
            <image :src="CDN_BASE_URL + '/mp-cs/images/ucenter/about-logo.png'" />
            <view class="about-header-title">掌上大学</view>
            <view class="about-header-info">当前版本 {{ appVersion }}</view>
        </view>
        <uni-list :border="false">
            <uni-list-item
                link
                clickable
                @tap="gotoPrivacy"
            >
                <template #body>
                    <view class="about-header-info-title">隐私政策</view>
                </template>
            </uni-list-item>
            <uni-list-item
                link
                clickable
                @click="goto('/pages/ucenter/agreement?type=1')"
            >
                <template #body>
                    <view class="about-header-info-title">服务协议</view>
                </template>
            </uni-list-item>
        </uni-list>
    </view>
</template>

<style scoped lang="scss">
.about {
    width: 100%;
    height: 100vh;
    background: $uni-text-color-inverse;

    &-header {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 494rpx;
        background-color: #fff;
        gap: 40rpx;

        > image {
            width: 160rpx;
            height: 160rpx;
        }

        &-title {
            color: $uni-color-title;
            font-size: 32rpx;
            font-weight: 500;
            line-height: 44rpx;
        }

        &-info {
            color: $uni-color-paragraph;
            font-size: 28rpx;
            font-weight: 400;
            line-height: 40rpx;

            &-title {
                padding: 24rpx 10rpx;
                color: $uni-text-color;
                font-size: 28rpx;
                font-weight: 500;
                line-height: 28rpx;
            }
        }
    }
}
</style>
