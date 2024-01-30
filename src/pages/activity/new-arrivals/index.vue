<script setup lang="ts">
import { useLoadMore } from '@zsdx/mp-material/dist/lib/hooks/useLoadmore';
import { router, storage } from '@zsdx/mp-utils';
import { getCurrentInstance, ref } from 'vue';

import { getCoupon, getNewGoods } from '@/api/activity/new-arrivals/index';
import type { ICouponList, IGoodsList, IGoodsListParams } from '@/api/activity/new-arrivals/types';
import type { IBannerList } from '@/api/home/types';
import sortBar from '@/components/sort-bar/sort-bar.vue';
import type { ISortConfig } from '@/components/sort-bar/types';

import banner from './components/banner.vue';
import coupons from './components/coupons.vue';
import halfCircle from './components/half-circle.vue';
import primeGoods from './components/prime-goods.vue';
import { getGoodsConfig, sortConfig } from './utils';

// 标题栏高度
const headerHeight = ref(0);
// 监听对象
const sortBarObserver = ref();

const { dataList, loadList, reload, loadText, dataRes } = useLoadMore(getNewGoods, list => list);
const bannerList = ref<IBannerList[]>([]);
const primeGoodsList = ref<IGoodsList[]>([]);
const stickyTop = (uni.getSystemInfoSync().statusBarHeight || 0) + uni.upx2px(88);
const localStorage = storage();
const couponList = ref<Array<ICouponList>>([]);
const studentShopId = ref('');
const sortStyleConfig = ref({
    backgroundColor: 'rgba(245, 248, 250, 1)',
    backgroundTextStyle: '',
    textColor: 'rgba(138, 147, 153, 1)',
    textActiveColor: 'rgba(255, 71, 52, 1)',
    barBackgroundImage: '',
    borderRadius: '32rpx 32rpx 0 0'
});
const headerBackground = ref('rgba(234, 52, 36, 0)');
const params = ref<IGoodsListParams>({
    sortField: '',
    sortType: '',
    listType: 2
});
/**
 * 监听sortbar 位置信息, 修改样式
 */
const observeSortBar = () => {
    const instance = getCurrentInstance();
    const observer = uni.createIntersectionObserver(instance?.proxy, { observeAll: true });
    observer.relativeToViewport({ top: headerHeight.value }).observe('.sort-warp', res => {
        console.log('监听启动1', res);
    });
    return observer;
};
watch(
    () => params.value,
    (val, oldVal) => {
        if (val !== oldVal) {
            reload(params.value);
        }
    }
);

onLoad((options: any) => {
    headerHeight.value = uni.upx2px(88) + uni.getWindowInfo().statusBarHeight;
    studentShopId.value = localStorage.get('studentShopId') || '';
    initData();
});

onPageScroll(e => {
    headerBackground.value = e.scrollTop >= 10 ? 'rgba(234, 52, 36, 1)' : 'rgba(234, 52, 36, 0)';
});

const initData = async () => {
    fnGetBaseInfo();
    await loadList(params.value);
    const data = await getCoupon();
    couponList.value = data;
};
const fnGetBaseInfo = async () => {
    let resp = await getNewGoods({
        ...params.value,
        listType: 1
    });
    primeGoodsList.value = resp.list;
    bannerList.value = resp.bannerList;
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
onReady(() => {
    sortBarObserver.value = observeSortBar();
});
</script>

<template>
    <view class="page-warp savepadding">
        <image
            class="page-bg"
            src="https://cdn.zsdx.cn/mp-cs/images/activity/new-arrivals/page-bg.png"
            mode="widthFix"
        />
        <!-- 临时补丁 -->
        <view
            class="nav-seat"
            :style="{ height: headerHeight + 'px' }"
        ></view>
        <zd-navbar
            :background="headerBackground"
            class="navbar"
            title="新品专区"
            color="#ffffff"
            fixed
        >
        </zd-navbar>
        <banner
            :list="bannerList"
            :interval="2000"
            :student-shop-id="studentShopId"
        ></banner>
        <coupons
            :list="couponList"
            :student-shop-id="studentShopId"
        ></coupons>
        <primeGoods
            v-if="primeGoodsList.length > 0"
            :list="primeGoodsList"
            :student-shop-id="studentShopId"
        />
        <view
            class="sort-warp"
            :style="{
                top: stickyTop + 'px',
                backgroundColor: false ? sortStyleConfig.backgroundColor : ''
            }"
        >
            <sort-bar
                :config="sortConfig"
                :theme="sortStyleConfig"
                :indicator-type="1"
                :item-full="true"
                @change="fnSort"
            ></sort-bar>
        </view>
        <view class="list-wrap">
            <template v-if="dataList.length">
                <track-view
                    v-for="(item, index) in dataList"
                    :key="item.goodsNo"
                    :track-data="{
                        type: 'all',
                        observerName: '.item-warp' + item.goodsNo,
                        clientTop: 0,
                        eventData: {
                            path: 'bi_feeds',
                            student_shop_id: studentShopId,
                            data_type: 'Goods',
                            data_id: item.goodsNo,
                            data_info: item,
                            index: index
                        }
                    }"
                >
                    <view
                        class="item-warp"
                        :class="'item-warp' + item.goodsNo"
                        @click="goDetail(item)"
                    >
                        <zd-goods-card
                            :item="item"
                            :goods-tag="
                                item.activityTagImg ||
                                'https://cdn.zsdx.cn/mp-cs/images/activity/new-arrivals/new-goods.png'
                            "
                            :show-title-tag="true"
                            v-bind="{ ...getGoodsConfig(item) }"
                            :content-style="{ borderRadius: '16rpx' }"
                        >
                            <template #head-tag>
                                <view
                                    v-if="item.crossShopDiscountTag === 1"
                                    class="head-tag"
                                >
                                    跨店满减
                                </view>
                            </template>
                            <template #footer>
                                <view class="goods-footer">
                                    <view class="coupon-list">
                                        <view
                                            v-if="item.fullCouponSubTag === 1"
                                            class="coupon-item"
                                        >
                                            <view class="coupon-item-inner"
                                                >用券减{{ item.fullCouponSub }}</view
                                            >
                                            <half-circle
                                                type="right"
                                                :r="10"
                                                color="#ff4734"
                                                bg-color="#fff"
                                                left="0rpx"
                                                top="10rpx"
                                            />
                                            <half-circle
                                                type="left"
                                                :r="10"
                                                color="#ff4734"
                                                bg-color="#fff"
                                                right="0rpx"
                                                top="10rpx"
                                            />
                                        </view>
                                    </view>
                                    <view class="price-box">
                                        <view
                                            v-if="item.goodsShowPriceType === 2"
                                            class="price-box-title"
                                            >学生价</view
                                        >
                                        <zd-price
                                            :value="item.goodsShowPrice"
                                            :font-size-large="40"
                                            :font-size-small="28"
                                            :font-size-unit="20"
                                            color="#fff"
                                        ></zd-price>
                                        <text class="origin-price"
                                            >￥{{ item.goodsShowOriginPrice }}</text
                                        >
                                        <image
                                            class="price-box-decorator"
                                            src="https://cdn.zsdx.cn/mp-cs/images/activity/new-arrivals/btn-decorator1.png"
                                            mode="scaleToFill"
                                        />
                                        <image
                                            class="price-box-decorator2"
                                            src="https://cdn.zsdx.cn/mp-cs/images/activity/new-arrivals/btn-decorator2.png"
                                            mode="scaleToFill"
                                        />
                                    </view>
                                </view>
                            </template>
                        </zd-goods-card>
                    </view>
                </track-view>
            </template>
            <zd-empty
                v-if="!dataList.length"
                image="https://cdn.zsdx.cn/mp-cs/images/activity/new-arrivals/empty-img.png"
                :image-width="450"
                :image-height="250"
            >
                <template #description>
                    <text class="empty-text">商品正在马不停蹄的赶来哦~</text>
                </template>
            </zd-empty>
            <view
                v-if="loadText && dataList.length"
                class="loadText"
            >
                {{ loadText }}
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.page-warp {
    width: 750rpx;
    min-height: 100%;
    background-color: rgba(245, 248, 250, 1);
}
.page-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 750rpx;
}
.sort-warp {
    position: sticky;
    left: 0;
    z-index: 98;
}
.empty-text {
    color: rgba(138, 147, 153, 1);
    font-size: 24rpx;
    font-weight: 400;
    line-height: 40rpx;
}
.item-warp {
    margin-bottom: 20rpx;
    background-color: transparent;
}

.head-tag {
    padding: 0 10rpx;
    border-radius: 16rpx 0px 16rpx 0px;
    color: #ffffff;
    font-size: 24rpx;
    background: linear-gradient(135deg, #f65a03 0%, #ff4734 100%);
    line-height: 40rpx;
}
.goods-footer {
    flex: 1;
    display: flex;
    flex-direction: column;
    .coupon-list {
        display: flex;
        align-items: flex-start;
        flex-direction: row;
        flex: 1;
    }
    .coupon-item {
        position: relative;
        overflow: hidden;
        margin-right: 10rpx;
        &-inner {
            padding: 0 14rpx;
            border: 1px solid #ff4734;
            border-radius: 8rpx;
            color: #ff4734;
            font-size: 20rpx;
            background: rgba(255, 71, 52, 0.1);
            line-height: 32rpx;
        }
    }
    .price-box {
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        width: 450rpx;
        height: 72rpx;
        padding-bottom: 22rpx;
        padding-left: 20rpx;
        border-radius: 16rpx;
        background: linear-gradient(to right, #f65a03, #ff4734);
        flex-direction: row;
        box-sizing: border-box;
        &-title {
            margin-right: 4rpx;
            color: #ffffff;
            font-size: 24rpx;
            font-weight: 600;
            line-height: 24rpx;
        }
        &-decorator {
            position: absolute;
            top: 0;
            right: 64rpx;
            width: 58rpx;
            height: 72rpx;
        }
        &-decorator2 {
            position: absolute;
            top: 14rpx;
            right: 14rpx;
            width: 58rpx;
            height: 52rpx;
        }
    }
    .origin-price {
        margin-left: 10rpx;
        text-decoration: line-through;
        color: rgba(255, 255, 255, 0.6);
        font-size: 24rpx;
        line-height: 24rpx;
    }
}
.loadText {
    width: 750rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    color: #999;
    font-size: 24rpx;
    font-weight: 400;
    background: transparent;
}
::v-deep .goods-tag-warp {
    margin-top: 16rpx !important;
}
.list-wrap {
    position: relative;
    min-height: calc(100vh - 76rpx - 88rpx - 100rpx);
    background-color: rgba(245, 248, 250, 1);
}
</style>
