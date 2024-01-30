<script setup lang="ts">
import { useLoadMore } from '@zsdx/mp-material/dist/lib/hooks/useLoadmore';
import { router, storage } from '@zsdx/mp-utils';
import { ref } from 'vue';

import { getCoupon, getNewGoods } from '@/api/activity/new-arrivals/index';
import type { ICouponList, IGoodsList, IGoodsListParams } from '@/api/activity/new-arrivals/types';
import headerFix from '@/components/header/header-fix.vue';
import sortBar from '@/components/sort-bar/sort-bar.vue';
import type { ISortConfig } from '@/components/sort-bar/types';

import headerBar from './components/header-bar.vue';
import {
    getTimerOut,
    goodsConfig,
    showDay,
    sortConfig,
    sortStyleConfig,
    timeOutStyle
} from './utils';

const { dataList, loadList, reload, loadText } = useLoadMore(getNewGoods, list => list);
const stickyTop = (uni.getSystemInfoSync().statusBarHeight || 0) + uni.upx2px(88);

const localStorage = storage();
const couponList = ref<Array<ICouponList>>([]);
const studentShopId = ref('');
const showFixSet = ref(false);
const params = ref<IGoodsListParams>({
    sortField: '',
    sortType: ''
});

watch(
    () => params.value,
    (val, oldVal) => {
        if (val !== oldVal) {
            reload(params.value);
        }
    }
);

onLoad((options: any) => {
    studentShopId.value = localStorage.get('studentShopId') || '';
    initData();
});

onPageScroll(e => {
    showFixSet.value = e.scrollTop >= 80;
});

const initData = async () => {
    const data = await getCoupon();
    loadList(params.value);
    couponList.value = data;
};

const fnSort = (item: ISortConfig) => {
    params.value = {
        ...params.value,
        ...item
    };
};
const timeEnd = (item: IGoodsList) => {
    dataList.value = dataList.value?.filter(_item => item.goodsNo != _item.goodsNo);
};

const goDetail = (item: IGoodsList) => {
    router.push('goodsDetail', { goodsNo: item.goodsNo });
};

/** 下拉刷新 */

onPullDownRefresh(async () => {
    params.value = {
        ...params.value,
        scrollId: undefined
    };
    await initData();
    uni.stopPullDownRefresh();
});

/** 加载 */

onReachBottom(async () => {
    await loadList(params.value);
});

onShareAppMessage(() => {
    return {
        title: '欢迎来到我的校园店～',
        path: '/pages/activity/new-arrivals/index?studentShopId=' + studentShopId.value
    };
});
onShareTimeline(() => {
    return {
        title: '欢迎来到我的校园店～',
        query: `studentShopId=${studentShopId.value}`
    };
});
</script>

<template>
    <view class="page-warp">
        <view class="page-warp-box">
            <header-bar
                :coupon-list="couponList"
                :student-shop-id="studentShopId"
            >
            </header-bar>
            <view
                class="sort-warp"
                :style="{ top: stickyTop + 'px' }"
            >
                <sort-bar
                    :config="sortConfig"
                    :theme="sortStyleConfig"
                    :indicator-type="1"
                    :item-full="true"
                    @change="fnSort"
                ></sort-bar>
            </view>
            <template v-if="dataList.length">
                <view
                    v-for="item in dataList"
                    :key="item.goodsNo"
                    class="item-warp"
                >
                    <zd-goods-card
                        :item="item"
                        goods-tag="https://cdn.zsdx.cn/mp-cs/images/activity/new-arrivals/new-goods.png"
                        show-title-tag
                        v-bind="{ ...goodsConfig }"
                        :content-style="{ borderRadius: '16rpx' }"
                        @click="goDetail(item)"
                    >
                        <template #head-tag>
                            <view class="head-tag">
                                <zd-timer-out
                                    :time="getTimerOut(item.expireTime)"
                                    :splider-style="timeOutStyle"
                                    :unit-style="timeOutStyle"
                                    :show-second="false"
                                    :show-day="showDay(item.expireTime)"
                                    @time-end="timeEnd(item)"
                                ></zd-timer-out>
                            </view>
                        </template>
                        <template #footer>
                            <view class="goods-footer">
                                <view class="tag-list">
                                    <text
                                        v-if="item.isFullCut"
                                        class="tag tag-red"
                                        >满减</text
                                    >
                                    <text
                                        v-if="item.activityType == 3"
                                        class="tag tag-yellow"
                                        >大促</text
                                    >
                                    <text
                                        v-if="item.activityType == 4"
                                        class="tag tag-yellow"
                                        >校园团</text
                                    >
                                </view>
                                <view class="price-box">
                                    <zd-price
                                        :value="item.goodsPrice"
                                        :font-size-large="40"
                                        :font-size-small="28"
                                        :font-size-unit="20"
                                        color="rgba(255, 71, 52, 1)"
                                    ></zd-price>
                                    <text class="origin-price">￥{{ item.goodsPriceOrigin }}</text>
                                </view>
                            </view>
                        </template>
                    </zd-goods-card>
                </view>
            </template>
            <zd-empty
                v-if="!dataList.length"
                image="https://cdn.zsdx.cn/mp-cs/images/activity/newcomer-special/empty.png"
                :image-width="450"
                :image-height="250"
            >
                <template #description>
                    <text class="empty-text">商品正在马不停蹄的赶来~</text>
                </template>
            </zd-empty>
            <view
                v-if="loadText && dataList.length"
                class="loadText"
            >
                {{ loadText }}
            </view>
        </view>
        <header-fix
            v-if="showFixSet"
            title="新品专区"
            :title-style="{ paddingTop: '14rpx', textAlign: 'center' }"
        ></header-fix>
    </view>
</template>

<style lang="scss" scoped>
.page-warp {
    width: 750rpx;
    min-height: 100%;
    background-color: rgba(255, 0, 0, 1);
    .page-warp-box {
        width: 750rpx;
        height: 100%;
        padding-bottom: 40rpx;
        background-color: rgba(255, 0, 0, 1);
    }
}

.sort-warp {
    position: sticky;
    left: 0;
    z-index: 98;
}
.empty-text {
    color: #ffffff;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 40rpx;
}
.item-warp {
    margin-bottom: 20rpx;
    background-color: transparent;
}

.head-tag {
    display: flex;
    padding: 8rpx 16rpx;
    border-radius: 16rpx 0 16rpx 0;
    color: #fff2cc;
    font-size: 24rpx;
    font-weight: 400;
    background: #000000;
    line-height: 24rpx;
}
.goods-footer {
    flex: 1;
    display: flex;
    flex-direction: column;
    .tag-list {
        display: flex;
        align-items: flex-start;
        flex-direction: row;
        flex: 1;
    }
    .tag {
        height: 32rpx;
        margin-right: 8rpx;
        padding: 0 10rpx;
        border-radius: 4rpx;
        font-size: 20rpx;
        font-weight: 600;
        background: rgba(247, 141, 0, 0.1);
        line-height: 28rpx;
        &-red {
            color: #fb6f43;
            background-color: rgba(251, 111, 67, 0.1);
        }
        &-yellow {
            color: #f78d00;
            background-color: rgba(247, 141, 0, 0.1);
        }
    }
    .price-box {
        display: flex;
        align-items: flex-end;
    }
    .origin-price {
        margin-left: 8rpx;
        text-decoration: line-through;
        color: #8a9399;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 24rpx;
    }
}
.loadText {
    width: 750rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    color: #ffffff;
    font-size: 24rpx;
    font-weight: 400;
    background: transparent;
}
::v-deep .goods-tag-warp {
    margin-top: 16rpx !important;
}
</style>
