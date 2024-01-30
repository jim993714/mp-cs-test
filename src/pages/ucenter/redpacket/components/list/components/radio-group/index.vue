<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        options?: {
            label: string;
            value: string | number;
        }[];
        modelValue: string | number;
    }>(),
    {
        options: () => []
    }
);

const emits = defineEmits<{
    (e: 'update:modelValue', val: string | number): void;
}>();

function onChange(val: number | string) {
    emits('update:modelValue', val);
}
</script>

<template>
    <view class="radio-group">
        <view
            v-for="option in props.options"
            :key="option.value"
            :class="{
                'radio-group-item': true,
                'radio-group-item__active': props.modelValue === option.value
            }"
            @tap="onChange(option.value)"
        >
            {{ option.label }}
        </view>
    </view>
</template>

<style lang="scss" scoped>
.radio-group {
    display: flex;
    align-items: center;
    gap: 20rpx;

    &-item {
        padding: 14rpx 22rpx;
        border-radius: 68rpx;
        color: #3f454b;
        font-size: 24rpx;
        background: rgba($color: #000000, $alpha: 0.04);
        transition: 0.1s all linear;

        &__active {
            color: $zd-main-color;
            background: rgba($color: $zd-main-color, $alpha: 0.1);
        }
    }
}
</style>
