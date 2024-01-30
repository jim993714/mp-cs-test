<script setup lang="ts">
import { router, storage } from '@zsdx/mp-utils';
import dayjs from 'dayjs';

import { clearHistory, delHistory, fetahHistoryList } from '@/api/browsing-history/index';
import type { ListItem } from '@/api/browsing-history/types';

const currentSelect = ref<ListItem>();
const scrollId = ref('');
const localStorage = storage();

const trackData = {
    type: 'all',
    clientTop: uni.getWindowInfo().windowHeight / 2
};
onLoad(() => {
    getList(true);
});

const list = ref<Record<string, ListItem[]>>({});
const lock = ref(false);

onReachBottom(() => {
    getList();
});

onPullDownRefresh(() => {
    getList(true);
});

async function getList(init?: boolean) {
    if (init) {
        list.value = {};
        scrollId.value = '';
    }
    if (scrollId.value === 'null') return;
    const resp = await fetahHistoryList({
        scrollId: scrollId.value
    });
    resp.list?.forEach?.((item: ListItem) => {
        console.log(dayjs(item.visitTime ?? 0).format('YYYY-MM-DD HH:mm:ss'));
        const time = dayjs(item.visitTime ?? 0).format('MM月DD日');
        if (!list.value[time]) list.value[time] = [];
        list.value[time].push(item);
    });
    scrollId.value = resp.scrollId || 'null';
    uni.stopPullDownRefresh();
}

async function clear() {
    const resp = await new Promise(resolve => {
        uni.showModal({
            content: '是否清空你所有的商品浏览记录？',
            confirmColor: '#199fff',
            cancelColor: '#8A9399',
            success: function (res) {
                if (res.confirm) {
                    resolve(1);
                } else if (res.cancel) {
                    resolve(0);
                }
            }
        });
    });
    if (resp) {
        await clearHistory();
        getList(true);
    }
}

async function del(item: ListItem, key: string, idx: number) {
    delHistory({
        visitId: [item.visitId + '']
    });
    list.value[key].splice(idx, 1);
    if (list.value[key].length === 0) {
        delete list.value[key];
    }
}

function toGoodsDetail(goods: ListItem) {
    if (!lock.value) {
        router.push('goodsDetail', { goodsNo: goods.goodsNo });
    }
    lock.value = false;
}

function longpress(goods: ListItem) {
    lock.value = true;
    currentSelect.value = goods;
}
</script>
<script lang="ts">
export default {
    options: {
        styleIsolation: 'shared'
    }
};
</script>

<template>
    <view class="page">
        <zd-empty
            v-if="Object.keys(list).length < 1 && scrollId === 'null'"
            image="https://nss1.zsdx.cn/mp-cs/images/shop/price-break/empty.png"
        >
            <template #description>
                <view class="empty"> 暂无浏览记录哦～</view>
            </template>
        </zd-empty>

        <view
            v-else
            class="list"
        >
            <view
                v-for="(key, index) in Object.keys(list)"
                :key="index"
                class="list-item"
            >
                <view class="time">{{ key }}</view>
                <view class="goods-list">
                    <view
                        v-for="(goods, gIdx) in list[key]"
                        :key="'g' + gIdx"
                    >
                        <track-view
                            :track-data="{
                                ...trackData,
                                observerName: '.goods' + gIdx,
                                eventData: {
                                    path: 'bi_feeds',
                                    student_shop_id: localStorage.get('studentShopId'),
                                    page_data_type: 'browsingHistory',
                                    data_type: 'Goods',
                                    data_id: goods.goodsNo,
                                    data_info: goods,
                                    index: gIdx
                                }
                            }"
                        >
                            <view
                                class="goods-item"
                                :style="{
                                    marginLeft: (gIdx + 1) % 3 === 1 ? 0 : '16rpx'
                                }"
                                @tap.stop="toGoodsDetail(goods)"
                                @longpress.stop="longpress(goods)"
                            >
                                <image
                                    :src="goods.goodsCover"
                                    mode="aspectFill"
                                />
                                <view class="title ellipsis">{{ goods.goodsTitle }}</view>
                                <zd-price
                                    class="price"
                                    :value="goods.goodsShowPrice"
                                    :font-size-large="44"
                                    :font-size-small="28"
                                    :font-size-unit="20"
                                />
                                <view
                                    v-if="currentSelect?.goodsNo === goods.goodsNo"
                                    class="mask"
                                    @tap="currentSelect = {} as ListItem"
                                >
                                    <zd-button
                                        type="outline"
                                        @tap.stop="del(goods, key, gIdx)"
                                    >
                                        删除
                                    </zd-button>
                                </view>
                            </view>
                        </track-view>
                    </view>
                </view>
            </view>
            <view class="list-bottom"> -到底了- </view>
        </view>

        <view class="footer">
            <view @tap="clear">
                <zd-icon
                    type="zdmp-shanchu"
                    :size="32"
                />
                一键清除
            </view>
        </view>
    </view>
</template>

<style scoped lang="scss">
.page {
    min-height: 100vh;
    background-color: #f5f8fa;
}
.list {
    padding: 20rpx;
    box-sizing: border-box;
    padding-bottom: calc(env(safe-area-inset-bottom) + 90rpx);

    .list-item {
        display: flex;
        width: 100%;
        margin-bottom: 10rpx;
        flex-direction: column;
        .time {
            margin: 20rpx 0;
            font-size: 36rpx;
            font-weight: 500;
            line-height: 50rpx;
        }
        .goods-list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            .goods-item {
                position: relative;
                display: flex;
                align-items: flex-start;
                overflow: hidden;
                width: 226rpx;
                height: 342rpx;
                margin-bottom: 16rpx;
                border-radius: 12rpx;
                background-color: #fff;
                flex-direction: column;
                image {
                    width: 226rpx;
                    height: 226rpx;
                    border-radius: 12rpx;
                }
                .title {
                    width: 192rpx;
                    margin-top: 10rpx;
                    padding: 0 16rpx;
                    color: #292f33;
                    font-size: 28rpx;
                    font-weight: 400;
                    line-height: 40rpx;
                }
                .price {
                    padding: 0 16rpx;
                }

                .mask {
                    position: absolute;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 226rpx;
                    height: 342rpx;
                    background-color: rgba($color: #000000, $alpha: 0.4);
                    :deep(button) {
                        width: 130rpx;
                        height: 60rpx;
                        border-color: #fff;
                        color: #fff;
                        font-size: 28rpx;
                        background: transparent;
                        line-height: 58rpx;
                    }
                }
            }
        }
    }

    .list-bottom {
        font-size: #8a9399;
    }
    .list-bottom {
        text-align: center;
        color: #8a9399;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 34rpx;
    }
}
.empty {
    margin-top: -100rpx;
    color: $uni-text-color-placeholder;
    font-size: 24rpx;
}
.footer {
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 750rpx;
    height: 70rpx;
    padding-bottom: calc(env(safe-area-inset-bottom));
    color: $uni-text-color;
    font-size: 32rpx;
    background-color: #fff;
    line-height: 70rpx;
    box-shadow: 0rpx -2rpx 8rpx 0rpx rgba(0, 0, 0, 0.03);
}
</style>
