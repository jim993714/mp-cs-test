<script setup lang="ts">
import type { IJinGang } from '@/api/home/types';
import doAction from '@/utils/action/index';

const props = defineProps<{
    list: Array<IJinGang>;
    studentShopId: string;
}>();
const trackData = {
    type: 'all',
    clientTop: uni.getWindowInfo().windowHeight / 2
};
watch(
    () => props.list,
    () => {
        getBadgeRight();
    }
);
const scrollWidth = ref(0);
const instance = getCurrentInstance();
const scrollLeft = ref(0);
const onScroll = (e: any) => {
    let rate: number =
        e.detail.scrollLeft <= scrollWidth.value * 0.5
            ? Number((e.detail.scrollLeft / scrollWidth.value).toFixed(2))
            : 0.5;
    if (rate >= 0.45) {
        return (scrollLeft.value = 20);
    } else if (rate <= 0) {
        return (scrollLeft.value = 0);
    }
    scrollLeft.value = 40 * rate;
};

const getScrollWidth = () => {
    uni.createSelectorQuery()
        .in(instance)
        .select('.scroll-view')
        .boundingClientRect((data: any) => {
            scrollWidth.value = data.width || 0;
        })
        .exec();
};
const getBadgeRight = () => {
    props.list.forEach((item: any, index: number) => {
        uni.createSelectorQuery()
            .in(instance)
            .select('#badgeId' + index)
            .boundingClientRect((res: any) => {
                if (res) {
                    if (res.width >= 50) {
                        item.right = '-100%';
                    } else if (res.width >= 40 && res.width < 50) {
                        item.right = '-70%';
                    } else {
                        item.right = '-50%';
                    }
                }
            })
            .exec();
    });
};

const goDetail = (item: IJinGang) => {
    doAction(item.appAction);
};
onMounted(() => {
    getScrollWidth();
    getBadgeRight();
});
</script>

<template>
    <view class="jing-gang-warp">
        <scroll-view
            class="scroll-view"
            scroll-x
            :show-scrollbar="false"
            :scroll-with-animation="true"
            :enable-flex="true"
            @scroll="onScroll"
        >
            <track-view
                v-for="(item, index) in props.list"
                :key="index"
                :track-data="{
                    ...trackData,
                    observerName: '.jinggang' + index,
                    eventData: {
                        path: 'bi_event',
                        student_shop_id: props.studentShopId,
                        element_name: '金刚区',
                        data_type: 'Banner',
                        data_id: item.appAction,
                        data_info: item
                    }
                }"
            >
                <view
                    class="scroll-item"
                    @tap="goDetail(item)"
                >
                    <view class="img-box">
                        <image
                            class="item-img"
                            :src="item.imageUrl"
                            mode="scaleToFill"
                        />
                        <view
                            v-if="item.badge"
                            :id="'badgeId' + index"
                            class="badge"
                            :style="{
                                right: item.right
                            }"
                            >{{ item.badge }}</view
                        >
                    </view>
                    <view class="item-title">{{ item.title }}</view>
                </view>
            </track-view>
        </scroll-view>
        <view
            v-if="list.length > 4"
            class="item-line"
        >
            <view
                class="item-line-unit"
                :style="{ left: scrollLeft + 'rpx' }"
            ></view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.jing-gang-warp {
    display: flex;
    align-items: center;
    width: 750rpx;
    box-sizing: border-box;
    flex-direction: column;

    .scroll-view {
        display: flex;
        width: 750rpx;
        height: 174rpx;
        flex-direction: row;
        .scroll-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 186rpx;
            height: 170rpx;
            flex-direction: column;
            flex-shrink: 0;
        }
        .img-box {
            position: relative;
            height: 100rpx;
            margin-top: 30rpx;
        }
        .item-img {
            width: 100rpx;
            height: 100rpx;
        }
        .badge {
            position: absolute;
            top: -50%;
            padding: 8rpx;
            border: 2rpx solid #ffffff;
            border-radius: 16rpx 16rpx 16rpx 0px;
            text-align: center;
            color: #ffffff;
            font-size: 20rpx;
            font-weight: 400;
            background: #ff4734;
            line-height: 20rpx;
            transform: translate(-50%, 70%);
        }

        .item-title {
            color: #292f33;
            font-size: 24rpx;
            font-weight: 400;
            line-height: 24rpx;
        }
    }
    .item-line {
        position: relative;
        width: 40rpx;
        height: 4rpx;
        margin-top: 20rpx;
        border-radius: 2rpx;
        background: #8a9399;
        opacity: 0.5;
        .item-line-unit {
            position: absolute;
            top: 0;
            width: 20rpx;
            height: 4rpx;
            border-radius: 2rpx;
            background: #199fff;
        }
    }
}
</style>
