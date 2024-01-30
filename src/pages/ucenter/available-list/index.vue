<script setup lang="ts">
import { useLoadMore } from '@zsdx/mp-material/dist/lib/hooks/useLoadmore';
import dayjs from 'dayjs';

import { getAvailableGoodsList, getAvailablePacketList } from '@/api/redpacket/index';
import {
    type AvailableCouponParams,
    type AvailableCouponResult,
    type AvailablePacketParams,
    type AvailablePacketResult,
    CouponType,
    DiscountLimitType,
    type GoodListCommonItem
} from '@/api/redpacket/types';

import List from '../components/list/index.vue';
import { Tab } from '../redpacket/components/list/types';
import GoodsItem from './components/goods-item/index.vue';
import { availableTabs } from './constants';

const dropdown = ref();
const searchKey = ref('');
const cur = ref(0);
const info = ref<AvailableCouponResult['couponInfo'] | AvailablePacketResult['packetInfo']>();
const isFilter = ref(false);

let studentNo = '';
let no = '';
let tab = ref<Tab>();
let height = ref(['100%', '100%']);

const time = computed(() => {
    return info.value
        ? `${formatDate(info.value.useStartTime)}-${formatDate(info.value.useEndTime)}`
        : '-';
});

const showRmb = computed(() => {
    return !(
        info.value &&
        'couponType' in info.value &&
        info.value.couponType === CouponType.Coupon
    );
});

const filter = reactive<{
    maxMoney: string | number;
    minMoney: string | number;
    sortField: 'price' | '';
    sortType: 'asc' | 'desc' | '';
    keyword: string;
}>({
    maxMoney: '',
    minMoney: '',
    sortField: '',
    sortType: '',
    keyword: ''
});

function formatDate(date: number) {
    return dayjs(date).format('YYYY.MM.DD');
}

function onSearch(val: { value: string }) {
    filter.keyword = val.value;
}

function beforeChange(tab: number) {
    if (tab === 2) {
        if (isFilter.value) {
            isFilter.value = false;
            dropdown.value.close();
        } else {
            isFilter.value = true;
            dropdown.value.open();
        }

        return false;
    } else isFilter.value = false;
    return true;
}

function getDiscountLimit(discountLimitType?: DiscountLimitType, discountLimit?: number) {
    if (discountLimitType === DiscountLimitType.Number) {
        return `满${discountLimit}件可用`;
    } else if (discountLimitType === DiscountLimitType.Money) {
        return `满${discountLimit}元可用`;
    } else {
        return '';
    }
}

async function getGoodsList(params: AvailableCouponParams | AvailablePacketParams) {
    if (tab.value === Tab.Coupon) {
        const { couponInfo, goodsInfo } = await getAvailableGoodsList(
            params as AvailableCouponParams
        );
        info.value = couponInfo;
        return goodsInfo;
    } else {
        const { packetInfo, goodsInfo } = await getAvailablePacketList(
            params as AvailablePacketParams
        );
        info.value = packetInfo;
        return goodsInfo;
    }
}

const {
    dataList,
    loadText,
    loadList: _loadList,
    reload,
    loadStatus
} = useLoadMore<any, any>(getGoodsList, list => list);

const params = computed(() => {
    if (tab.value === Tab.Coupon) {
        return {
            studentCouponNo: studentNo,
            couponNo: no,
            ...filter
        };
    } else {
        return {
            studentPacketId: studentNo,
            packetNo: no,
            ...filter
        };
    }
});

function loadList(params: AvailableCouponParams | AvailablePacketParams, i: number) {
    if (i === cur.value) {
        _loadList(params);
    }
}

onLoad(options => {
    studentNo = options?.studentCouponNo || options?.studentPacketNo;
    no = options?.couponNo || options?.packetNo;
    tab.value = +options?.tab;
});

function onUpdateHeight(val: number, tab: number) {
    height.value[tab] = `${val + 46}px`;
}

function onConfirmFilter(val: { max: number | string; min: number | string }) {
    if ((val.max === undefined && val.min === undefined) || (val.max === '' && val.min === '')) {
        isFilter.value = false;
    }

    filter.maxMoney = val.max;
    filter.minMoney = val.min;
}

function onChangeSortType() {
    if (cur.value === 1) {
        if (filter.sortType === 'asc') {
            filter.sortType = 'desc';
        } else {
            filter.sortType = 'asc';
        }
    }
}

watch(cur, async () => {
    if (cur.value === 0) {
        filter.sortField = '';
        filter.sortType = '';
    } else if (cur.value === 1) {
        filter.sortField = 'price';
        filter.sortType = 'asc';
    }
    // if (cur.value !== 2) {
    //     uni.pageScrollTo({
    //         scrollTop: 190,
    //         duration: 0
    //     });
    // }
});

watch(params, async () => {
    await reload(params.value);
    // if (cur.value !== 2) {
    //     uni.pageScrollTo({
    //         scrollTop: 190,
    //         duration: 0
    //     });
    // }
});
</script>

<template>
    <view class="list">
        <view class="list-card">
            <view class="list-card-detail">
                <view class="list-card-detail-left">
                    <view class="list-card-detail-left-title"> {{ info?.title }} </view>
                    <view class="list-card-detail-left-time">
                        <text>使用时间</text>
                        <text>{{ time }}</text>
                    </view>
                </view>
                <view class="list-card-detail-right">
                    <view>
                        <text
                            v-if="showRmb"
                            class="list-card-detail-right-rmb"
                            >¥</text
                        >
                        <text class="list-card-detail-right-num">{{
                            info?.discountNum || info?.disCountNum || 0
                        }}</text>
                        <text
                            v-if="!showRmb"
                            class="list-card-detail-right-discount"
                            >折</text
                        >
                    </view>
                    <text class="list-card-detail-right-require">
                        {{ getDiscountLimit(info?.discountLimitType, info?.discountLimit) }}
                    </text>
                </view>
            </view>
            <view class="list-card-footer">
                <template v-if="info && 'disCountNumMax' in info && info.disCountNumMax > 0">
                    最高可减{{ (info as AvailableCouponResult['couponInfo']).disCountNumMax }}元
                </template>
                <template v-else>
                    以下商品可使用此{{ tab === Tab.Packet ? '红包' : '优惠券' }}</template
                >
            </view>
        </view>
        <view class="list-title"> 适用商品 </view>
        <view class="list-sticky">
            <uni-search-bar
                v-model="searchKey"
                placeholder="输入商品的名称"
                @confirm="onSearch"
            >
                <template #searchIcon>
                    <zd-icon
                        :size="32"
                        type="zdmp-sousuo1"
                        color="#8A9399"
                    />
                </template>
            </uni-search-bar>
        </view>
        <zd-tabbar
            v-model="cur"
            :items="availableTabs"
            :scroll="false"
            :is-action="true"
            :before-change="beforeChange"
            :height="height[cur]"
            sticky-top="90rpx"
        >
            <template #header>
                <view style="position: relative">
                    <zd-filter-dropdown
                        ref="dropdown"
                        @confirm="onConfirmFilter"
                    />
                </view>
            </template>
            <template #label-price>
                <view
                    class="list-sticky-icon"
                    @tap="onChangeSortType"
                >
                    价格
                    <view class="list-sticky-icon-sort">
                        <zd-icon
                            type="zdmp-shengxu"
                            :color="filter.sortType === 'asc' ? '#199fff' : '#88909C'"
                            :size="16"
                        />
                        <zd-icon
                            type="zdmp-jiangxu"
                            :color="filter.sortType === 'desc' ? '#199fff' : '#88909C'"
                            :size="16"
                        />
                    </view>
                </view>
            </template>
            <template #label-filter>
                <view class="list-sticky-icon">
                    <view
                        :class="{
                            'zd-tab-bar-item__active': isFilter
                        }"
                        >筛选</view
                    >
                    <zd-icon
                        :size="16"
                        :type="isFilter ? 'zdmp-shengxu' : 'zdmp-jiangxu'"
                        :color="isFilter ? '#199fff' : ''"
                    />
                </view>
            </template>
            <template #all>
                <view class="list-sticky-content">
                    <List
                        :list="dataList"
                        :load-text="loadText"
                        custom-key="goodsNo"
                        @update-height="(val: number) => onUpdateHeight(val, 0)"
                        @load-more="loadList(params, 0)"
                    >
                        <template #default="{ item }">
                            <GoodsItem :item="item" />
                        </template>
                    </List>
                    {{ loadText }}
                </view>
            </template>
            <template #price>
                <view class="list-sticky-content">
                    <List
                        :list="dataList"
                        :load-text="loadText"
                        custom-key="goodsNo"
                        @update-height="(val: number) => onUpdateHeight(val, 1)"
                        @load-more="loadList(params, 1)"
                    >
                        <template #default="{ item }">
                            <GoodsItem :item="item" />
                        </template>
                    </List>
                    {{ loadText }}
                </view>
            </template>
        </zd-tabbar>
    </view>
</template>

<style scoped lang="scss">
.list {
    position: relative;
    width: 100%;
    text-align: center;

    &-card {
        display: inline-flex;
        width: 710rpx;
        height: 238rpx;
        margin-bottom: 30rpx;
        text-align: left;
        background-size: 100% 100%;
        flex-direction: column;
        background-image: url('https://nss1.zsdx.cn/mp-cs/images/ucenter/preferential-card-bg.png');

        &-detail {
            display: flex;
            justify-content: space-between;
            flex: 1;
            height: 150rpx;
            padding: 30rpx 40rpx;
            box-sizing: border-box;

            &-left {
                display: flex;
                flex-direction: column;
                gap: 20rpx;

                &-title {
                    color: $uni-color-title;
                    font-size: 32rpx;
                    font-weight: 500;
                    line-height: 40rpx;
                }

                &-time {
                    display: flex;
                    align-items: center;
                    color: $uni-color-paragraph;
                    font-size: 28rpx;
                    font-weight: 400;
                    gap: 16rpx;
                    line-height: 28rpx;
                }
            }

            &-right {
                display: flex;
                justify-content: center;
                color: #e94f48;
                flex-direction: column;
                gap: 10rpx;

                &-rmb {
                    font-size: 32rpx;
                    font-family: Bebas Neue;
                    line-height: 48rpx;
                }

                &-num {
                    font-size: 64rpx;
                    font-family: Bebas Neue;
                    line-height: 68rpx;
                }

                &-discount {
                    font-size: 24rpx;
                    font-weight: 600;
                    line-height: 28rpx;
                }

                &-require {
                    color: #ff786b;
                    font-size: 20rpx;
                    font-weight: 400;
                    line-height: 28rpx;
                }
            }
        }

        &-footer {
            padding: 30rpx 40rpx;
            color: $uni-text-color-placeholder;
            font-size: 24rpx;
            font-weight: 400;
            line-height: 28rpx;
        }
    }

    &-title {
        padding: 20rpx 30rpx;
        border-top: 2rpx solid $uni-text-color-inverse;
        box-sizing: border-box;
        text-align: left;
        color: $uni-color-title;
        font-size: 32rpx;
        font-weight: 500;
        box-sizing: border-box;
        line-height: 44rpx;
    }

    &-sticky {
        position: sticky;
        top: 0;
        z-index: 100;
        text-align: left;
        background: #ffffff;

        &-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 4rpx;

            &-sort {
                display: flex;
                flex-direction: column;
                height: 40rpx;
                margin-top: -32rpx;

                zd-icon:first-of-type {
                    transform: translateY(10rpx);
                }
                zd-icon:last-of-type {
                    transform: translateY(-10rpx);
                }
            }
        }

        :deep(.uni-searchbar__box) {
            justify-content: flex-start;
            border-radius: 36rpx !important;
        }

        :deep(.uni-searchbar__text-placeholder) {
            margin-left: 0;
        }

        :deep(.uni-searchbar__box-icon-search) {
            padding: 0 20rpx 0 30rpx;
            color: $uni-color-paragraph;
            font-weight: 400;
            line-height: 28rpx;
        }

        &-content {
            z-index: 1000;
            height: auto;

            &__empty {
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }

    .zd-tab-bar-item__active {
        color: $zd-main-color;
        font-weight: 500;
    }
}
</style>
