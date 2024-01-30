<script setup lang="ts">
import { storage } from '@zsdx/mp-utils';

const props = defineProps<{
    startTime: string;
    endTime: string;
}>();

const zdmodalRef = ref<any>(null);
const localStorage = storage();

function handleOnChange(e: any) {
    console.log(e);
    if (!e.show) {
        localStorage.set('NEW_YEAR_SHOP_LOADED', true);
    }
}

onMounted(() => {
    const isLoaded = localStorage.get('NEW_YEAR_SHOP_LOADED');
    if (!isLoaded) {
        zdmodalRef.value?.open?.('center');
    }
});
</script>

<template>
    <zd-popup
        ref="zdmodalRef"
        @change="handleOnChange"
    >
        <image
            :src="'http://cdn.zsdx.cn/mp-cs/images/activity/new-year-shop/popup-1.png'"
            mode="scaleToFill"
            class="popup-image"
            @tap="zdmodalRef.close()"
        />
        <view class="time"> 活动时间：{{ startTime }} — {{ endTime }} </view>
    </zd-popup>
</template>

<style scoped>
.popup-image {
    width: 600rpx;
    height: 692rpx;
}
.time {
    position: absolute;
    top: 250rpx;
    width: 100%;
    text-align: center;
    color: #fff;
    font-size: 24rpx;
    font-weight: bold;
}
</style>
