<script setup lang="ts">
import { formatDate } from '../constants';

const props = defineProps<{
    color?: string;
    time: number;
    startTime: number;
}>();
const timer = ref();
const newTime = ref(0);
newTime.value = props.time || 0;
const getTime = () => {
    --newTime.value;
    clearInterval(timer.value);
};
watch(
    () => newTime.value,
    value => {
        if ((!value || value < 0) && props.time) {
            return emit('timeEnd');
        }

        timer.value = setInterval(() => {
            getTime();
        }, 1000);
    },
    {
        immediate: true
    }
);

const emit = defineEmits(['timeEnd']);
</script>

<template>
    <view
        class="start-time bebas-neue-regular"
        :style="{ color: props.color }"
    >
        {{ formatDate(props.startTime) }}
    </view>
</template>

<style lang="scss" scoped>
.start-time {
    font-size: 40rpx;
    line-height: 40rpx;
    letter-spacing: 1px;
}
</style>
