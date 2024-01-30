<script setup lang="ts">
import { storage } from '@zsdx/mp-utils';

import {
    fetchBaseInfo,
    fetchPennyGoodsList,
    fetchPennyGoodsList2
} from '@/api/activity/one-cent-purchase/index';
import type { BaseInfoResp, GoodsItem } from '@/api/activity/one-cent-purchase/types';
import { CDN_BASE_URL } from '@/base/constants';
import definePageProps from '@/utils/definePageProps/index';
import { router } from '@/utils/router/useRouter';

import { RulesType } from '../rules/types';
import GoodsCard1 from './components/goods-card-1.vue';
import GoodsCard2 from './components/goods-card-2.vue';

const localStorage = storage();
const baseInfo = ref<BaseInfoResp>();
const list1 = ref<GoodsItem[]>([]);
const list2 = ref<GoodsItem[]>([]);
const error = ref('');
const scrollId1 = ref('');
const scrollId2 = ref('');

const headerOpacity = ref(0);
const showHome = ref(false);

const options = ref<{
    activityNo: string;
}>({
    activityNo: ''
});

onLoad(async () => {
    await getBaseInfo();
    getList1();
    getList2(true);
    uni.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: 'transparent'
    });

    const pages = getCurrentPages();
    showHome.value = pages.length === 1;
});
onShow(async () => {
    await getBaseInfo();
    getList1();
    getList2(true);
});

onPullDownRefresh(async () => {
    try {
        await Promise.all([getBaseInfo(), getList1(), getList2(true)]);
        console.log('结束');
    } catch (err) {
        //
    }
    uni.stopPullDownRefresh();
});

onReachBottom(() => {
    getList2();
});

onPageScroll(e => {
    headerOpacity.value = e.scrollTop >= 80 ? 1 : 0;
});

function toRule() {
    router.push('activityRules', {
        type: RulesType.ONE_CENT_PURCHASE,
        params: {
            activityNo: options.value?.activityNo
        }
    });
}

function toDetail() {
    router.push('oneCentPurchaseDetail', {
        activityNo: options.value?.activityNo ?? ''
    });
}

function toGoodsDetail(goods: GoodsItem, type: 19 | 20) {
    router.push('goodsDetailOnecent', {
        goodsNo: goods.goodsNo,
        studentShopId: localStorage.get('studentShopId') || '',
        activityNo: options.value?.activityNo ?? '',
        type: type,
        actGoodsNo: goods.actGoodsNo + ''
    });
}

function toHome() {
    uni.$emit('goIndex');
}

function onShare() {
    const studentShopId = localStorage.get('studentShopId') || '';
    const query = `studentShopId=${studentShopId}`;
    return {
        path: `/pages/activity/one-cent-purchase/index?${query}`,
        query,
        title: '欢迎来到我的校园店～'
    };
}
onShareAppMessage(onShare);
onShareTimeline(onShare);

/** 获取基础信息 */
async function getBaseInfo() {
    try {
        const resp = await fetchBaseInfo();
        baseInfo.value = resp;
        options.value.activityNo = resp.activityNo;
    } catch (err: any) {
        error.value = err.msg;
    }
}

/** 列表1 */
async function getList1() {
    const resp = await fetchPennyGoodsList({
        activityNo: options.value?.activityNo ?? '',
        scrollId: scrollId1.value,
        size: 6
    });
    scrollId1.value = resp.scrollId;
    list1.value = resp.list;
}

/** 列表2 */
async function getList2(init = false) {
    if (init) {
        scrollId2.value = '';
        list2.value = [];
    }
    let resp;
    if (scrollId2.value === 'null') return;
    resp = await fetchPennyGoodsList2({
        activityNo: options.value?.activityNo ?? '',
        scrollId: scrollId2.value,
        size: 10
    });
    scrollId2.value = resp.scrollId || 'null';

    list2.value = [...list2.value, ...resp.list];
}
</script>

<template>
    <view class="page">
        <view class="bg-container">
            <image
                src="https://cdn.zsdx.cn/mp-cs/images/activity/one-cent-purchase/bg.png"
                mode="scaleToFill"
                class="bg"
            />
        </view>
        <zd-header
            title="1分购"
            show-header-left
            class="zd-header"
            show-fixed
            :fix-background="
                headerOpacity
                    ? `linear-gradient(to right, #f88063 0%, #f44a47 39%, #f34245 100%);background-clip: padding-box`
                    : 'rgba(#000, 0)'
            "
            fix-color="#fff"
        >
            <template #fix-set>
                <view class="header">
                    <zd-icon
                        v-if="showHome"
                        class="back"
                        type="zdmp-huidaoshouye"
                        :size="48"
                        @tap="toHome"
                    />
                    <zd-icon
                        v-else
                        class="back"
                        type="zdmp-fanhui"
                        :size="48"
                        @tap="router.back()"
                    />
                    <view class="title">
                        <image
                            src="https://cdn.zsdx.cn/mp-cs/images/activity/one-cent-purchase/title.png"
                            mode="widthFix"
                        />
                    </view>
                </view>
            </template>
        </zd-header>
        <template v-if="!error">
            <view class="banner">
                <image
                    :src="baseInfo?.headImg"
                    mode="scaleToFill"
                />
                <view
                    class="rule"
                    @tap="toRule"
                >
                    规则
                </view>
            </view>
            <view class="block-1">
                <view class="title-wrapper">
                    <view class="title">
                        <text>当前可用兑换次数</text>
                        <text class="num">{{ baseInfo?.receiveCount }}次</text>
                    </view>
                    <view
                        class="detail"
                        @tap="toDetail"
                    >
                        明细
                    </view>
                </view>
                <view class="list">
                    <goods-card-1
                        v-for="(item, index) in list1"
                        :key="index"
                        :detail="item"
                        @tap="toGoodsDetail(item, 20)"
                    >
                    </goods-card-1>
                </view>
                <view
                    class="btn"
                    @tap="getList1"
                >
                    换一批
                </view>
            </view>

            <zd-empty
                v-if="list2.length === 0 && scrollId2 === 'null'"
                :image-width="450"
                :image-height="250"
                :image="`${CDN_BASE_URL}/mp-cs/images/activity/newcomer-special/empty.png`"
                description="商品正在马不停蹄的赶来"
                class="empty"
                :top="0"
            />
            <view
                v-else
                class="block-2 savepadding"
            >
                <goods-card-2
                    v-for="item in list2"
                    :key="item"
                    :detail="item"
                    @tap="toGoodsDetail(item, 19)"
                >
                </goods-card-2>
                <view class="list-bottom"> -到底了- </view>
            </view>
        </template>
        <template v-else>
            <zd-empty
                :image-width="450"
                :image-height="250"
                :image="`${CDN_BASE_URL}/mp-cs/images/activity/newcomer-special/empty.png`"
                :description="error"
                class="empty"
                :top="400"
            />
        </template>
    </view>
</template>

<style scoped lang="scss">
.page {
    display: flex;
    align-items: center;
    overflow-x: hidden;
    width: 750rpx;
    min-height: 100vh;
    background: linear-gradient(90deg, #f88063 0%, #f44a47 39%, #f34245 100%);
    flex-direction: column;
    .bg-container {
        position: absolute;
        top: 0;
        right: 0;
        overflow: hidden;
        width: 430rpx;
        height: 230rpx;
    }
    .bg {
        position: absolute;
        top: -72rpx;
        right: -88rpx;
        width: 518rpx;
    }
}

.header {
    display: flex;
    align-items: flex-end;
    .back {
        width: 48rpx;
        height: 48rpx;
        padding-left: 20rpx;
    }
    .title {
        height: 40rpx;
        margin-left: 20rpx;
        image {
            width: 130rpx;
            height: 40rpx;
        }
    }
}
.banner {
    position: relative;
    overflow: hidden;
    width: 710rpx;
    height: 240rpx;
    border-radius: 16rpx;
    background-color: rgba($color: #fff, $alpha: 0.2);
    image {
        width: 710rpx;
        height: 240rpx;
    }
    .rule {
        position: absolute;
        top: 0rpx;
        right: 0rpx;
        width: 80rpx;
        height: 40rpx;
        text-align: center;
        color: #fff;
        font-size: 24rpx;
        border-bottom-left-radius: 16rpx;
        border-top-right-radius: 16rpx;
        background-color: rgba($color: #000000, $alpha: 0.5);
        line-height: 40rpx;
    }
}

.block-1 {
    display: flex;
    width: 710rpx;
    margin: 0 20rpx;
    flex-direction: column;
    .title-wrapper {
        display: flex;
        justify-content: space-between;
        margin-top: 30rpx;
        .title {
            color: #fff;
            font-size: 28rpx;
            font-weight: bold;
            .num {
                margin-left: 6rpx;
                color: #ffefc1;
            }
        }
        .detail {
            width: 88rpx;
            height: 40rpx;
            border: 2rpx solid #fff;
            border-radius: 20rpx;
            text-align: center;
            color: #fff;
            font-size: 24rpx;
            line-height: 40rpx;
        }
    }
    .list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 16rpx;
        margin-top: 20rpx;
    }
    .btn {
        width: 360rpx;
        height: 68rpx;
        margin-top: 20rpx;
        border-radius: 34rpx;
        text-align: center;
        color: $zd-color-red;
        background: linear-gradient(180deg, #ffffff 0%, #ffbab3 100%);
        line-height: 68rpx;
        align-self: center;
    }
}

.block-2 {
    width: 750rpx;
    margin-top: 30rpx;
    padding: 30rpx 20rpx;
    padding-bottom: calc(env(safe-area-inset-bottom));
    background-color: $uni-text-color-inverse;
    box-sizing: border-box;
    border-top-left-radius: 40rpx;
    border-top-right-radius: 40rpx;
}

.empty {
    :deep(.empty-description) {
        color: #fff;
    }
}

.list-bottom {
    margin-bottom: calc(env(safe-area-inset-bottom));
    text-align: center;
    color: $uni-text-color-placeholder;
    font-size: 24rpx;
}
</style>
