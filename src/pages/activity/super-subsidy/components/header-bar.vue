<script setup lang="ts">
import { back } from '../utils';
</script>

<template>
    <zd-header
        bg-img="https://cdn.zsdx.cn/mp-cs/images/activity/super-subsidy/subsidy-header-bg.png"
        :height="336"
    >
        <template #left>
            <view
                class="header-left"
                @tap.prevent="back"
            >
                <zd-icon
                    type="zdmp-fanhui"
                    :size="32"
                    color="#ffffff"
                ></zd-icon>
            </view>
        </template>
        <template #header-bottom>
            <view class="banner">
                <image
                    class="header-title"
                    src="https://cdn.zsdx.cn/mp-cs/images/activity/super-subsidy/subsidy-title.png"
                    mode="aspectFill"
                />
            </view>
        </template>
    </zd-header>
</template>

<style lang="scss" scoped>
.header-title {
    width: 592rpx;
    height: 206rpx;
}
.banner {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 750rpx;
}

.header-left,
.header-right {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80rpx;
    height: 88rpx;
}
</style>
