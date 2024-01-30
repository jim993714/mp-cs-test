<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        type: string;
        r: number;
        color: string;
        bgColor: string;
        left: string;
        right: string;
        top: string;
    }>(),
    {
        type: 'left',
        r: 10,
        color: '#000',
        bgColor: '#fff',
        left: 'unset',
        right: 'unset',
        top: 'unset'
    }
);
</script>
<template>
    <view
        class="half-circle-outer"
        :style="{ width: 2 * r + 'rpx', height: 2 * r + 'rpx', left: left, top: top, right: right }"
    >
        <view
            class="half-circle-inner"
            :style="{
                borderColor: color,
                backgroundColor: bgColor,
                width: 2 * r + 'rpx',
                height: 2 * r + 'rpx',
                borderRadius: r + 'rpx',
                right: type == 'left' ? '-50%' : 'unset',
                left: type == 'right' ? '-50%' : 'unset'
            }"
        />
    </view>
</template>
<style lang="scss" scoped>
.half-circle-outer {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
}
.half-circle-inner {
    position: absolute;
    top: 0;
    left: 0;
    border-style: solid;
    border-width: 1px;
    border-radius: 40rpx;
    box-sizing: border-box;
}
</style>
