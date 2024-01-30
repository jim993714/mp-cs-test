<script lang="ts" setup>
import { clickTrack } from '@zsdx/mp-utils';

import type { IBannerList } from '@/api/home/types';
import doAction from '@/utils/action/index';

const props = defineProps<{
    list: Array<IBannerList>;
    interval: number;
    studentShopId: string;
}>();

const fnGoPage = (item: IBannerList) => {
    doAction(item.appAction);
    track(item, 2);
};
const track = (item: IBannerList, action: number) => {
    let data = {
        type: 'click',
        eventData: {
            path: 'bi_event',
            student_shop_id: props.studentShopId,
            element_name: '首页banner',
            data_type: 'Banner',
            data_id: item.appAction,
            data_info: item,
            action
        }
    };

    clickTrack(data);
};

onMounted(() => {
    props.list.forEach(item => {
        track(item, 1);
    });
});
</script>

<template>
    <swiper
        autoplay
        circular
        :indicator-dots="props.list.length > 1"
        indicator-color="rgba(250, 250, 250, 0.5)"
        :interval="props.interval"
        indicator-active-color="#ffffff"
        class="swiper"
    >
        <view
            v-for="(item, index) in props.list"
            :key="index"
        >
            <swiper-item class="swiper-item">
                <image
                    :src="item.imageUrl"
                    mode="aspectFill"
                    class="item-img"
                    @tap="fnGoPage(item)"
                />
            </swiper-item>
        </view>
    </swiper>
</template>

<style lang="scss" scoped>
.swiper {
    width: 710rpx;
    height: 240rpx;
}
.swiper-item {
    width: 710rpx;
    height: 240rpx;
}
.item-img {
    width: 710rpx;
    height: 240rpx;
    border-radius: 16rpx;
}
</style>
