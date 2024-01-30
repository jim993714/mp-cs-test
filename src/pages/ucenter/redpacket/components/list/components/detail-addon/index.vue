<script setup lang="ts">
let visible = ref(false);

const height = ref(0);
const ani = uni.createAnimation({
    duration: 200,
    delay: 0,
    timingFunction: 'ease'
});
const actions = ref(
    (() => {
        ani.height(0).step({
            duration: 0,
            delay: 0
        });

        return ani.export();
    })()
);

defineExpose({
    openDetail: () => {
        if (visible.value) {
            ani.height(0).step();
            visible.value = false;
        } else {
            ani.height(height.value).step();
            visible.value = true;
        }
        actions.value = ani.export();
    }
});

onMounted(() => {
    const observer = uni.createIntersectionObserver(getCurrentInstance());
    observer.relativeToViewport();
    observer.observe('.detail-addon-content__slot', res => {
        height.value = (res.boundingClientRect as any).height;
    });
});
</script>

<template>
    <view class="detail-addon">
        <slot />
        <view
            class="detail-addon-content"
            :animation="actions"
        >
            <view class="detail-addon-content__slot">
                <slot name="detail" />
            </view>
        </view>
    </view>
</template>

<style scoped lang="scss">
.detail-addon {
    padding: 20rpx 20rpx 0 20rpx;
    box-sizing: border-box;

    &-content {
        overflow: hidden;
        // border-radius: 0 0 12rpx 12rpx;
        color: $uni-color-paragraph;
        font-size: 24rpx;
        background: #ffffff;

        &__slot {
            padding: 16rpx 20rpx;
            box-sizing: border-box;
        }
    }
}
</style>
