<script setup lang="ts">
import { router, storage } from '@zsdx/mp-utils';

import { exchangePrize } from '@/api/ucenter';
import type { Prize, PrizeStatus, SummerOneCentGoodsDetail } from '@/api/ucenter/types';
import { useOrderStore } from '@/stores/order';

import Empty from './empty.vue';
import PrizeItem from './prize-item.vue';

const localstorage = storage();
const props = defineProps<{
    status: PrizeStatus;
}>();
const isClose = ref(true);
const loadText = ref('暂无更多奖品');

const orderStore = useOrderStore();

const actionAwardNo = ref('');
const goodsDetail = ref<SummerOneCentGoodsDetail>({
    goodsNo: '',
    goodsCover: '',
    goodsPrice: 0,
    goodsTitle: '',
    productList: [],
    specList: []
});
const skuPop = ref();

const prizeList = ref<Prize[]>([]);
const { status } = toRefs(props);
const params = ref({
    status
});

// 领取优惠券或者红包
async function receiveCoupon(prize: Prize, index: number) {
    try {
        uni.showLoading({
            title: '领取中'
        });

        await exchangePrize(prize.exchangeNo);

        uni.hideLoading();
        prizeList.value.splice(index, 1);
        uni.showToast({
            title: '领取成功',
            icon: 'none'
        });
    } catch (error: any) {
        uni.hideLoading();

        uni.showToast({
            title: error.msg,
            icon: 'none'
        });
    }
}

// 领取暑期一分购商品
function handleReceiveSummer(goodsInfo: SummerOneCentGoodsDetail, awardNo: string) {
    goodsDetail.value = goodsInfo;
    actionAwardNo.value = awardNo;
    skuPop.value?.open();
}

function onSelectSku(product: { productNo: string; count: number; price: number }) {
    orderStore.setSelectedProducts([
        {
            goodsNo: goodsDetail.value.goodsNo,
            awardNo: actionAwardNo.value,
            productNo: product.productNo,
            num: product.count,
            studentShopId: localstorage.get('studentShopId') as string
        }
    ]);
    router.push('orderConfirm', { buyType: 15 });

    isClose.value = false;
}

function onGoPage() {
    isClose.value = false;
}

function reloadList() {
    params.value = {
        status: props.status
    };
}

function onLoadMore(e: { loadText: Ref<string> }) {
    loadText.value = e.loadText.value === '- 到底了 -' ? '暂无更多奖品' : e.loadText.value;
}

onShow(() => {
    if (!isClose.value) {
        reloadList();
    }
});

defineExpose({
    reloadList
});
</script>

<template>
    <view class="page-wrap">
        <zd-list
            v-model="prizeList"
            url="/student-school-shop/user/award/list"
            :enhanced="false"
            open-refresh
            :params="params"
            :show-scrollbar="false"
            :load-text-style="{ display: 'none' }"
            height="calc(100vh - 128rpx)"
            @load-more="onLoadMore"
        >
            <template #default="{ item, index }">
                <PrizeItem
                    :info="item"
                    :status="props.status"
                    @receive-summer="handleReceiveSummer($event, item.awardNo)"
                    @receive-coupon="receiveCoupon(item, index)"
                    @go-page="onGoPage"
                />
            </template>

            <template #custom>
                <view
                    v-if="prizeList.length"
                    class="footer"
                >
                    <view>{{ loadText }}</view>
                    <view class="divider" />
                    <view
                        class="btn"
                        @tap="router.push('invalidPrize')"
                    >
                        查看失效奖品
                    </view>
                </view>
            </template>

            <template #empty>
                <Empty show-invalid />
            </template>
        </zd-list>
    </view>

    <zd-sku-pop
        ref="skuPop"
        :show-number="false"
        :info="goodsDetail"
        :product-list="goodsDetail?.productList"
        :spec-list="goodsDetail?.specList"
        @submit="onSelectSku"
    />
</template>

<style lang="scss" scoped>
.page-wrap {
    padding: 20rpx;

    .footer {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 114rpx;
        color: $uni-color-paragraph;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 24rpx;

        .divider {
            width: 2rpx;
            height: 20rpx;
            margin: 0 20rpx;
            background: $uni-color-paragraph;
            opacity: 0.3;
        }
        .btn {
            color: $zd-main-color;
        }
    }
}
</style>
