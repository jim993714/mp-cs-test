<script lang="ts" setup>
import { router } from '@zsdx/mp-utils';

const props = defineProps({
    showFixSet: {
        type: Boolean,
        default: false
    },
    fixBackground: {
        type: String,
        default: '#0CCCF2'
    },
    channel: {
        type: Boolean,
        default: false
    }
});
const back = () => {
    router.back();
};
const goHome = () => {
    router.switchTab('home');
};

const statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0;
</script>
<template>
    <view>
        <zd-header
            :capsule="true"
            :fix-background="props.showFixSet ? props.fixBackground : ''"
            :show-fixed="showFixSet"
        >
            <template #left>
                <view class="head-left">
                    <image
                        v-if="!props.channel"
                        class="header-back"
                        src="https://cdn.zsdx.cn/mp-cs/images/activity/campus-group/back.png"
                        mode="scaleToFill"
                        @tap.prevent="back"
                    />
                    <zd-icon
                        v-else
                        class="go-home"
                        type="zdmp-huidaoshouye"
                        color="#fff"
                        :size="40"
                        @tap.prevent="goHome"
                    ></zd-icon>
                </view>
            </template>
            <template #center>
                <view class="head-center">
                    <image
                        class="head-title"
                        src="https://cdn.zsdx.cn/mp-cs/images/activity/campus-group/head-title.png"
                        mode="scaleToFill"
                    />
                </view>
            </template>
            <template #fix-set>
                <view class="fix-set">
                    <image
                        class="header-back"
                        src="https://cdn.zsdx.cn/mp-cs/images/activity/campus-group/back.png"
                        mode="scaleToFill"
                        @tap.prevent="back"
                    />
                    <image
                        class="head-title"
                        src="https://cdn.zsdx.cn/mp-cs/images/activity/campus-group/head-title.png"
                        mode="scaleToFill"
                    />
                </view>
            </template>
        </zd-header>
    </view>
</template>
<style scoped lang="scss">
.header {
    display: flex;
    align-items: center;
    height: 88rpx;
}
.header-back {
    width: 36rpx;
    height: 36rpx;
    margin: 0 18rpx 0 36rpx;
}
.go-home {
    margin-right: 20rpx;
    margin-left: 36rpx;
}
.head-title {
    width: 240rpx;
    height: 46rpx;
}
.head-left,
.head-center,
.fix-set {
    display: flex;
    align-items: center;
    height: 80rpx;
}
</style>
