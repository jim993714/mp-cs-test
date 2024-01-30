<script setup lang="ts">
import { storage } from '@zsdx/mp-utils';

import { setAlert } from '@/api/activity/new-year-shop';
import type { GoodsItem } from '@/api/activity/new-year-shop/types';
import { router } from '@/utils/router/useRouter';

import StepBar from './step-bar.vue';

const localStorage = storage();
const props = defineProps<{
    item: GoodsItem;
    systemTime: number;
    index: number;
}>();
const clientTop = uni.getWindowInfo().windowHeight / 2;

const { item } = toRefs(props);

const emits = defineEmits<{
    update: () => void;
}>();

const goodsStatus = computed(() => {
    if (
        new Date(props.systemTime).getTime() > new Date(props.item.startTime * 1000).getTime() &&
        new Date(props.systemTime).getTime() < new Date(props.item.endTime * 1000).getTime()
    ) {
        // 正在进行中
        return {
            bg: 'http://cdn.zsdx.cn/mp-cs/images/activity/new-year-shop/buy-bg-1.png',
            color: '#fff',
            height: 88,
            top: 5,
            status: 1
        };
    } else if (
        new Date(props.systemTime).getTime() < new Date(props.item.startTime * 1000).getTime()
    ) {
        return {
            bg: `http://cdn.zsdx.cn/mp-cs/images/activity/new-year-shop/buy-bg-${
                props.item.isSetAlter ? 2 : 3
            }.png`,
            color: '#FF4734',
            height: 72,
            top: 0,
            status: 0
        };
    } else {
        return {
            bg: '',
            color: '#FF4734',
            height: 72,
            top: 0
        };
    }
});

function toDetail() {
    // 跳转到商品详情页
    router.push('goodsDetail', {
        goodsNo: props.item.goodsNo
    });
}

async function toSetAlert() {
    if (goodsStatus.value.status === 1) {
        return toDetail();
    }
    try {
        const resp = await setAlert({
            activityNo: props.item.activityNo,
            goodsNo: props.item.goodsNo,
            status: props.item.isSetAlter ? 0 : 1
        });

        item.value.isSetAlter = item.value.isSetAlter === 0 ? 1 : 0;
        if (item.value.isSetAlter === 1) {
            uni.showToast({
                title: '开场前三分钟将以短信通知您',
                icon: 'none'
            });
        } else {
            uni.showToast({
                title: '已取消提醒',
                icon: 'none'
            });
        }
    } catch (err: any) {
        console.log(err);
        uni.showToast({
            title: (err as any).msg,
            icon: 'none'
        });
    }
}
</script>

<template>
    <track-view
        :track-data="{
            type: 'all',
            observerName: '.goodsCard' + props.index,
            clientTop,
            eventData: {
                path: 'bi_feeds',
                student_shop_id: localStorage.get('studentShopId') || '',
                data_type: 'Goods',
                data_id: item.goodsNo,
                data_info: item
            }
        }"
    >
        <view
            class="goods-item"
            @tap="toDetail"
        >
            <view class="left">
                <image
                    :src="item.goodsCover"
                    mode="scaleToFill"
                    class="goods-cover"
                />
                <view
                    v-if="item.maxSubsidy"
                    class="badge-wrapper"
                >
                    <image
                        :src="'http://cdn.zsdx.cn/mp-cs/images/activity/new-year-shop/widget.png'"
                        mode="scaleToFill"
                        class="badge-wrapper"
                    />
                    <view class="badge-text ellipsis"> 最多返{{ item.maxSubsidy }}元 </view>
                </view>
            </view>
            <view class="right">
                <view class="title ellipsis">
                    {{ item.goodsTitle }}
                </view>
                <view style="margin: 10rpx 0">
                    <step-bar
                        :step="item.levelList"
                        :sale-num="item.saleNum"
                    ></step-bar>
                </view>
                <view
                    class="buy-area"
                    :style="{ height: goodsStatus.height + 'rpx' }"
                    @tap.stop.prevent="toSetAlert"
                >
                    <image
                        :src="goodsStatus.bg"
                        mode="scaleToFill"
                        class="buy-bg"
                        :style="{ height: goodsStatus.height + 'rpx' }"
                    />
                    <view class="price-text-wrapper">
                        <zd-price
                            class="price-text"
                            :font-size-large="40"
                            :font-size-small="28"
                            :font-size-unit="20"
                            :value="item.goodsShowPrice"
                            :color="goodsStatus.color"
                        ></zd-price>
                        <view
                            class="price-text-2"
                            :style="{
                                color: goodsStatus.color,
                                marginTop: goodsStatus.top + 'rpx'
                            }"
                        >
                            {{ goodsStatus.top === 72 ? '学生价' : '全网低价' }}
                        </view>
                        <view
                            v-if="item.goodsShowPrice !== item.goodsShowOriginPrice"
                            class="price-text-3"
                            :style="{
                                color: goodsStatus.color,
                                marginTop: goodsStatus.top + 'rpx'
                            }"
                        >
                            ¥{{ item.goodsShowOriginPrice }}
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </track-view>
</template>

<style scoped lang="scss">
.goods-item {
    display: flex;
    width: 710rpx;
    height: 260rpx;
    margin-bottom: 20rpx;
    padding: 20rpx;
    border-radius: 16rpx;
    background-color: #fff;
    box-sizing: border-box;
    flex-direction: row;

    .left {
        position: relative;
        overflow: hidden;
        width: 220rpx;
        height: 220rpx;
        border-radius: 8rpx;
        .goods-cover {
            width: 220rpx;
            height: 220rpx;
        }
        .badge-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 80;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 156rpx;
            height: 36rpx;
            flex-direction: row;
            .badge-text {
                z-index: 80;
                max-width: 148rpx;
                margin-top: -6rpx;
                padding-left: 8rpx;
                color: #a03c01;
                font-size: 20rpx;
                font-weight: bold;
            }
        }
    }

    .right {
        flex: 1;
        margin-left: 12rpx;
        .title {
            max-width: 430rpx;
            color: #292f33;
            font-size: 28rpx;
            line-height: 40rpx;
        }

        .buy-area {
            position: relative;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 438rpx;
            height: 88rpx;
            .buy-bg {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 10;
                width: 438rpx;
                height: 88rpx;
            }
            .price-text-wrapper {
                position: relative;
                z-index: 80;
                display: flex;
                align-items: flex-end;
                margin-top: -18rpx;
                margin-left: 38rpx;
                flex-direction: row;

                .price-text-2 {
                    margin-bottom: -4rpx;
                    margin-left: 10rpx;
                    color: #fff;
                    font-size: 20rpx;
                }
                .price-text-3 {
                    margin-bottom: -4rpx;
                    margin-left: 10rpx;
                    text-decoration: line-through;
                    font-size: 20rpx;
                    opacity: 0.6;
                }
            }
        }
    }
}
</style>
