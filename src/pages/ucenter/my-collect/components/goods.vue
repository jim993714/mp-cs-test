<script setup lang="ts">
import { router, storage } from '@zsdx/mp-utils';

import { cancelCollect } from '@/api/ucenter';
import type { CollectGoods } from '@/api/ucenter/types';

import { goodsCardConfig } from '../constants';
import Empty from './empty.vue';

const localStorage = storage();
const goodsList = ref<CollectGoods[]>([]);
const clientTop = uni.getWindowInfo().windowHeight / 2;

function goGoodsDetail(goodsNo: string) {
    router.push('goodsDetail', { goodsNo });
}

async function deleteGoodsCollect(goodsNo: string, index: number) {
    await cancelCollect([goodsNo], 'goods');

    goodsList.value.splice(index, 1);

    uni.showToast({
        title: '取消收藏成功',
        icon: 'none'
    });
}
</script>

<template>
    <view class="page-wrap">
        <zd-list
            v-model="goodsList"
            open-refresh
            :enhanced="false"
            height="calc(100vh - 88rpx)"
            url="/student-school-shop/collect/getGoodsCollectList"
        >
            <template #default="{ item, index }">
                <track-view
                    :track-data="{
                        type: 'all',
                        clientTop,
                        observerName: '.collectGoods' + index,
                        eventData: {
                            path: 'bi_feeds',
                            student_shop_id: localStorage.get('studentShopId'),
                            data_type: 'Goods',
                            data_id: item.goodsNo,
                            data_info: item,
                            index
                        }
                    }"
                >
                    <zd-swipe-action
                        :actions="['delete']"
                        @action="deleteGoodsCollect(item.goodsNo, index)"
                    >
                        <view @click="goGoodsDetail(item.goodsNo)">
                            <zd-goods-card
                                :item="item"
                                v-bind="{
                                    ...goodsCardConfig,
                                    priceLabel: item.isStudentPrice ? '学生价' : ''
                                }"
                            >
                                <template #footer>
                                    <view class="goods-item">
                                        <view
                                            v-if="item.goodsShowPriceType == 2"
                                            class="goods-price-label"
                                            >学生价</view
                                        >
                                        <zd-price
                                            :value="item.goodsShowPrice || 0"
                                            :font-size-large="40"
                                            :font-size-small="32"
                                            :font-size-unit="24"
                                        ></zd-price>
                                    </view>
                                </template>
                            </zd-goods-card>
                        </view>
                    </zd-swipe-action>
                </track-view>
            </template>

            <template #empty>
                <empty />
            </template>
        </zd-list>
    </view>
</template>

<style scoped lang="scss">
.goods-item {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
}
.goods-price-label {
    margin-right: 6rpx;
    font-size: 20rpx;
    font-weight: 500;
    line-height: 20rpx;
}
</style>
