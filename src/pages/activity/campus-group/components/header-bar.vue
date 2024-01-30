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
    }
});
const back = () => {
    router.back();
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
                        class="header-back"
                        src="https://cdn.zsdx.cn/mp-cs/images/activity/campus-group/back.png"
                        mode="scaleToFill"
                        @tap.prevent="back"
                    />
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
