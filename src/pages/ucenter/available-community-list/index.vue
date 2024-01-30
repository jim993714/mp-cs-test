<script setup lang="ts">
import { useLoadMore } from '@zsdx/mp-material/dist/lib/hooks/useLoadmore';
import { router } from '@zsdx/mp-utils';
import dayjs from 'dayjs';

import { getGoodsDetail } from '@/api/goods-detail';
import { getAvailableCommunityRedPacketList } from '@/api/redpacket/index';
import type {
    AvailableCommunityPacketParams,
    AvailableCommunityPacketResult,
    CommunityGoods,
    GoodListCommonItem
} from '@/api/redpacket/types';
import { updateShopCart } from '@/api/shop-cart';
import type { UpdateGoodsParams } from '@/api/shop-cart/types';
import { CDN_BASE_URL } from '@/base/constants';

import List from '../components/list/index.vue';
import GoodItem from './components/good-item/index.vue';

const studentShopId = uni.getStorageSync('studentShopId');
const skuPop = ref();
const info = ref<AvailableCommunityPacketResult['communityInfoDTO']>();
const nav = ref();
const showTop = ref(false);
const alpha = ref(0);

const goodInfo = ref<any>({});
const productList = ref<any>([]);
const specList = ref<any>([]);

let selectRow: CommunityGoods;

let studentPacketNo = '';
let packetNo = '';

async function getDataList(params: AvailableCommunityPacketParams) {
    const { communityGoodsInfos, communityInfoDTO } = await getAvailableCommunityRedPacketList(
        params
    );

    info.value = communityInfoDTO;
    return communityGoodsInfos;
}

const { dataList, loadList } = useLoadMore<GoodListCommonItem, any>(getDataList, list => list);

function formatDate(date: number) {
    return dayjs(date).format('YYYY.MM.DD');
}

onLoad(options => {
    studentPacketNo = options?.studentPacketNo;
    packetNo = options?.packetNo;

    loadList({
        packetId: packetNo,
        studentPacketId: studentPacketNo
    });
});

onPageScroll(({ scrollTop }) => {
    alpha.value = scrollTop / 193;
    if (alpha.value >= 0.9) {
        showTop.value = true;
    } else {
        showTop.value = false;
    }
});

const navHeight = computed(() => {
    const { navigationBarHeight, statusBarHeight } = uni.getSystemInfoSync();

    return (navigationBarHeight || 0) + (statusBarHeight || 0) + 44;
});

const titleColor = computed(() => {
    return `rgba(41,47,51,${alpha.value})`;
});

const backgroundColor = computed(() => {
    return `rgba(255,255,255,${alpha.value})`;
});

const iconColor = computed(() => {
    let channel = 255 * (1 - alpha.value);
    if (channel < 0) {
        channel = 0;
    }
    return `rgb(${channel}, ${channel}, ${channel})`;
});

async function loadMore() {
    loadList({
        packetId: studentPacketNo,
        studentPacketId: packetNo
    });
}

async function openSku(item: CommunityGoods) {
    selectRow = item;
    const data = await getGoodsDetail({
        goodsNo: item.goodsNo,
        studentShopId
    });

    skuPop.value.open();
    goodInfo.value = data;
    goodInfo.value.buyCount = data.buyCount;
    productList.value = data.productList;
    specList.value = data.specList;
}

async function submit({ productNo, count }: { productNo: string; count: number }) {
    const params: UpdateGoodsParams = {
        buyNum: count,
        studentShopId,
        productNo
    };

    try {
        await updateShopCart(params);
        selectRow.cartNum = count;
        dataList.value = [...dataList.value];
    } catch (err) {
        uni.showToast({
            title: 'err',
            icon: 'error'
        });
    }
}

function gotoTop() {
    uni.pageScrollTo({
        scrollTop: 0
    });
}

function gotoShop() {
    router.switchTab('home');
}
</script>

<template>
    <view class="list">
        <zd-navbar
            ref="nav"
            :background="backgroundColor"
            :color="titleColor"
            :icon-color="iconColor"
            type="sub"
            title="社群红包专区"
        >
        </zd-navbar>
        <view
            :style="{ background: `url(${info?.bannerImage}) no-repeat` }"
            class="list-card"
        />
        <view class="list-header">
            <view class="list-header-title"> 本页商品为社群红包专享商品 </view>
        </view>
        <view
            class="list-sticky"
            :style="{
                height: `calc(100vh - ${navHeight}px)`,
                top: `${navHeight}px`
            }"
        >
            <view class="list-sticky-content">
                <List
                    :list="dataList"
                    @load-more="loadMore"
                >
                    <template #default="{ item }">
                        <GoodItem
                            :item="item"
                            :info="info!"
                            @open-sku="openSku(item)"
                        />
                    </template>
                </List>
            </view>
        </view>
        <zd-sku-pop
            ref="skuPop"
            :info="goodInfo"
            :product-list="productList"
            :spec-list="specList"
            @submit="submit"
        />
        <view
            v-if="showTop"
            class="fab-top"
            @tap="gotoTop"
        >
            <zd-icon
                type="zdmp-zhiding"
                :size="32"
            ></zd-icon>
        </view>
        <image
            v-if="!showTop"
            class="fab-shop"
            :src="CDN_BASE_URL + '/mp-cs/images/ucenter/shop-icon.png'"
            @tap="gotoShop"
        />
    </view>
</template>

<style scoped lang="scss">
.list {
    position: relative;
    width: 100%;
    height: 100vh;
    text-align: center;

    &-card {
        width: 100%;
        height: 602rpx;
        background-size: 100% 100%;
    }

    &-header {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 120rpx;
        margin-top: -160rpx;
        padding: 0 20rpx;
        box-sizing: border-box;
        border-radius: 48rpx 48rpx 0 0;
        background: $uni-text-color-inverse;

        &-title {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20rpx 30rpx;
            border: 2rpx solid #ffd49c;
            border-radius: 40rpx;
            text-align: left;
            color: $uni-color-title;
            font-size: 32rpx;
            font-weight: 500;
            background: #ffeed6;
            box-sizing: border-box;
            line-height: 44rpx;
        }
    }

    &-sticky {
        position: sticky;
        top: 0;
        text-align: left;
        background: $uni-text-color-inverse;

        &-content {
            height: auto;
        }
    }
}

.fab-top {
    position: fixed;
    right: 30rpx;
    bottom: 72rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 72rpx;
    height: 72rpx;
    border: 4rpx solid #e6e6e6;
    border-radius: 36rpx;
    background: #ffffff;
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.18);
}

.fab-shop {
    position: fixed;
    top: 532rpx;
    left: 0rpx;
    width: 172rpx;
    height: 172rpx;
}
</style>
