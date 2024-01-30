<script setup lang="ts">
const props = defineProps<{
    isSender: boolean;
}>();

let ani: UniApp.Animation;
const actions = ref<any>();

watch(
    () => props.isSender,
    () => {
        ani = uni
            .createAnimation({
                duration: 200,
                delay: 0,
                timingFunction: 'ease-in-out'
            })
            //@ts-ignore
            .translate(props.isSender ? '-75%' : '-25%', '-100%')
            .scale(0, 0);

        ani?.step({
            duration: 0,
            delay: 0
        });

        actions.value = ani.export();
    },
    {
        immediate: true
    }
);
const visible = ref(false);
const emits = defineEmits<{
    (event: 'show'): void;
}>();

function onLongpress() {
    if (!visible.value) {
        ani.scale(1, 1).step();

        actions.value = ani.export();
        visible.value = false;
        emits('show');
    }
}

function onPageClick() {
    ani.scale(0, 0).step();

    actions.value = ani.export();
    visible.value = false;
}

onMounted(() => {
    uni.$on('pageClick', onPageClick);
});

onUnmounted(() => {
    uni.$off('pageClick', onPageClick);
});
</script>

<template>
    <view
        class="tooltip"
        @longpress="onLongpress"
    >
        <slot />
        <view
            :class="{
                'tooltip-popup': true,
                'tooltip-popup__not-sender': !props.isSender
            }"
            :animation="actions"
        >
            <slot name="tools" />
        </view>
    </view>
</template>

<style scoped lang="scss">
.tooltip {
    position: relative;
    overflow: visible;

    &-popup {
        position: absolute;
        top: -36rpx;
        left: 50%;
        border-radius: 8rpx;
        background: $uni-text-color;
        transform: scale(0);

        &::after {
            position: absolute;
            top: 100%;
            left: 75%;
            border-style: solid;
            border-width: 10rpx;
            border-color: $uni-text-color transparent transparent transparent;
            content: '';
        }

        &__not-sender {
            &::after {
                left: 25%;
            }
        }
    }
}
</style>
