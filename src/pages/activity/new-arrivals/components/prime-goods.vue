<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { IGoodsList } from '@/api/activity/new-arrivals/types';

const props = defineProps<{
    list: IGoodsList[];
    studentShopId: string;
}>();
const scrollId = ref('');
const scrollLeft = ref(0);
const scrollTimeout = ref(0);
const goDetail = (item: IGoodsList) => {
    router.push('goodsDetail', { goodsNo: item.goodsNo });
};
const fnScroll = (e: any) => {
    console.log('scroll', e);
    scrollLeft.value = e.detail.scrollLeft;
    fnAutoScroll();
};
const fnAutoScroll = () => {
    // console.log('call autoScrol', props.list.length <= 3);
    if (props.list.length <= 3) {
        return;
    }
    clearTimeout(scrollTimeout.value);
    scrollTimeout.value = setTimeout(() => {
        const nextId = Math.ceil((scrollLeft.value - uni.upx2px(32)) / uni.upx2px(240 + 16)) + 1;
        let currID = 'prime' + (nextId % (props.list.length - 1));
        if (currID === scrollId.value) {
            currID = 'prime' + ((nextId + 1) % (props.list.length - 1));
        }
        scrollId.value = currID;
    }, 5000);
};
</script>
<template>
    <view
        v-if="list && list.length > 0"
        class="prime-wrap"
    >
        <image
            class="prime-wrap-bg"
            src="https://cdn.zsdx.cn/student-app/images/mall/prime-bg.png"
            mode="scaleToFill"
        />
        <view class="prime-head">
            <image
                class="prime-head-title"
                src="https://cdn.zsdx.cn/mp-cs/images/activity/new-arrivals/prime-title.png"
                mode="scaleToFill"
            />
            <view class="prime-head-subtitle">买满就省</view>
        </view>
        <scroll-view
            :scroll-x="true"
            :show-scrollbar="false"
            :scroll-into-view="scrollId"
            :scroll-with-animation="true"
            :enable-flex="true"
            class="prime-scroller"
        >
            <view
                v-for="(goods, index) in list"
                :id="'prime' + index"
                :key="index"
                :class="{
                    'prime-goods-wrap-first': index === 0,
                    'prime-goods-wrap-last': index === list.length - 1
                }"
                class="prime-goods-wrap"
            >
                <track-view
                    :track-data="{
                        type: 'all',
                        observerName: '.goodsCard' + index,
                        clientTop: 0,
                        eventData: {
                            path: 'bi_feeds',
                            student_shop_id: studentShopId,
                            data_type: 'Goods',
                            data_id: goods.goodsNo,
                            data_info: goods,
                            index: index
                        }
                    }"
                >
                    <view
                        class="prime-goods"
                        :class="'prime-goods' + index"
                        @tap="goDetail(goods)"
                    >
                        <image
                            class="prime-goods-cover"
                            :src="goods.goodsCover"
                            mode="scaleToFill"
                        />
                        <view
                            v-if="goods.crossShopDiscountTag === 1"
                            class="prime-goods-tag"
                            >跨店满减</view
                        >
                        <view class="prime-goods-main">
                            <view class="prime-goods-main-title ellipsis">{{
                                goods.goodsTitle
                            }}</view>
                            <view class="prime-goods-main-bottom">
                                <zd-price
                                    :value="goods.goodsShowPrice"
                                    :font-size-large="36"
                                    :font-size-small="28"
                                    :font-size-unit="20"
                                    color="rgba(255, 71, 52, 1)"
                                ></zd-price>
                                <view
                                    v-if="goods.fullCouponSubTag === 1"
                                    class="prime-goods-main-bottom-coupon"
                                >
                                    <image
                                        class="prime-goods-main-bottom-coupon-bg"
                                        src="https://cdn.zsdx.cn/student-app/images/mall/agent-shop/new-goods-on-sale/coupon-bg-head.png?v=1"
                                        mode="scaleToFill"
                                    />
                                    <view class="prime-goods-main-bottom-coupon-text"
                                        >券减{{ goods.fullCouponSub }}</view
                                    >
                                </view>
                            </view>
                        </view>
                    </view>
                </track-view>
            </view>
        </scroll-view>
    </view>
</template>
<style lang="scss" scoped>
.prime-wrap {
    position: relative;
    width: 710rpx;
    height: 396rpx;
    margin: 20rpx 20rpx 0;
}
.prime-wrap-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 710rpx;
    height: 396rpx;
}
.prime-head {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 30rpx 24rpx 20rpx;
    flex-direction: row;
    &-title {
        width: 126rpx;
        height: 28rpx;
        margin-right: 20rpx;
    }
    &-subtitle {
        color: #292f33;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 40rpx;
    }
}
.prime-scroller {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: 710rpx;
    height: 288rpx;
    flex-direction: row;
    flex-wrap: nowrap;
    &-inner {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: max-content;
        flex-direction: row;
        flex-wrap: nowrap;
    }
}
.prime-goods-wrap {
    position: relative;
    padding-left: 16rpx;
    &-first {
        padding-left: 32rpx;
    }
    &-last {
        padding-right: 32rpx;
    }
}
.prime-goods {
    position: relative;
    width: 240rpx;
    height: 288rpx;
    border-radius: 16rpx;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.81) 0%, rgba(255, 255, 255, 0) 100%);

    &-cover {
        width: 200rpx;
        height: 200rpx;
        margin: 20rpx 20rpx 0;
        border-radius: 16px;
        border-radius: 16rpx;
    }
    &-tag {
        position: absolute;
        top: 0;
        left: 0;
        padding: 0 10rpx;
        border-radius: 16rpx 0px 16rpx 0px;
        color: #fff;
        font-size: 24rpx;
        background: linear-gradient(135deg, #f65a03, #ff4734);
        line-height: 40rpx;
    }
    &-main {
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: stretch;
        width: 240rpx;
        height: 88rpx;
        border-radius: 16rpx;
        background: linear-gradient(to bottom, #ffe4c8, #ffffff);
        box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.8);
        flex-direction: column;
        box-sizing: border-box;
        &-title {
            padding: 0 16rpx;
            color: #292f33;
            font-size: 24rpx;
            line-height: 24rpx;
            box-sizing: border-box;
        }
        &-bottom {
            display: flex;
            box-sizing: border-box;
            justify-content: flex-start;
            align-items: flex-end;
            width: 240rpx;
            margin-top: 8rpx;
            padding: 0 16rpx;
            flex-direction: row;
            flex-wrap: nowrap;
            &-coupon {
                position: relative;
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                overflow: visible;
                overflow-y: hidden;
                height: 32rpx;
                padding-left: 20rpx;
                box-sizing: border-box;
                flex-direction: row;
                &-bg {
                    width: 28rpx;
                    height: 34rpx;
                }
                &-text {
                    position: relative;
                    height: 100%;
                    padding: 0 4rpx 0 2rpx;
                    border-radius: 0px 8rpx 8rpx 0px;
                    white-space: nowrap;
                    color: #ffffff;
                    font-size: 20rpx;
                    font-weight: 400;
                    background: #ff4734;
                    line-height: 32rpx;
                }
            }
        }
    }
}
</style>
