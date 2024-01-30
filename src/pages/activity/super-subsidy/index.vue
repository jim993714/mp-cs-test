<script setup lang="ts">
import { useLoadMore } from '@zsdx/mp-material/dist/lib/hooks/useLoadmore';
import { router, storage } from '@zsdx/mp-utils';
import { ref } from 'vue';

import { getGoodsList } from '@/api/activity/super-subsidy/index';
import type { IGoodsList, IGoodsListParams } from '@/api/activity/super-subsidy/types';
import headerFix from '@/components/header/header-fix.vue';

import headerBar from './components/header-bar.vue';
import tabBar from './components/tab-bar.vue';

const localStorage = storage();
const timeOut = computed(() => {
    console.log(dataRes?.value, 'kkkkk');

    if (cycleType.value == 1) {
        return dataRes?.value?.endTime - new Date().getTime() > 0
            ? (dataRes?.value?.endTime - new Date().getTime()) / 1000 + 1
            : 0;
    } else {
        return dataRes?.value?.startTime - new Date().getTime() > 0
            ? (dataRes?.value?.startTime - new Date().getTime()) / 1000 + 1
            : 0;
    }
});
const showFixSet = ref(false);
const params = ref<IGoodsListParams>({
    cycle: 1
});
const cycleType = ref(1);

const {
    dataList: goodsList,
    loadList,
    reload,
    loadText,
    dataRes
} = useLoadMore(getGoodsList, list => list);

const dataList = computed(() => goodsList.value);
const contentStyle = {
    borderRadius: '16rpx'
};
const itemStyle = {
    background: 'transparent',
    width: '750rpx',
    borderRadius: 'none'
};

const goodsConfig = {
    titleLine: '1',
    priceLabel: '补贴价',
    btnBg: 'linear-gradient(135deg, #FF8F40 0%, #FF4734 100%)',
    showHeaderTag: true
};
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0;
const fixTop = statusBarHeight + uni.upx2px(88);
const stickyTop = statusBarHeight + uni.upx2px(302);
const sticky = ref(false);
const studentShopId = ref('');
watch(
    () => params.value,
    (val, oldVal) => {
        if (val !== oldVal) {
            reload(params.value);
        }
    }
);

onLoad(() => {
    studentShopId.value = localStorage.get('studentShopId') || '';
});
const onTap = (type: number) => {
    cycleType.value = type;
    params.value = { ...params.value, cycle: type };
};
const goDetail = (item: IGoodsList) => {
    router.push('goodsDetail', { goodsNo: item.goodsNo });
};

onPageScroll(e => {
    showFixSet.value = e.scrollTop >= 10;
    sticky.value = e.scrollTop >= stickyTop;
});
/** 下拉刷新 */

onPullDownRefresh(async () => {
    await reload(params.value);
    uni.stopPullDownRefresh();
});

/** 加载 */

onReachBottom(async () => {
    await loadList(params.value);
});

onShareAppMessage(() => {
    return {
        title: '欢迎来到我的校园店～',
        path: '/pages/activity/super-subsidy/index?studentShopId=' + studentShopId.value
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
        <header-bar></header-bar>

        <view
            :class="{ 'tab-bar-warp': sticky }"
            :style="{ top: sticky ? fixTop + 'px' : stickyTop + 'px' }"
        >
            <tab-bar
                :time-out="timeOut"
                @select="onTap"
            ></tab-bar>
        </view>
        <view class="goods-box">
            <view
                v-for="(item, index) in dataList"
                :key="index"
                class="item-warp"
            >
                <zd-goods-card
                    :item="item"
                    v-bind="{ ...goodsConfig }"
                    :item-style="itemStyle"
                    :content-style="contentStyle"
                    btn-bg="linear-gradient(90deg, #F65B02 0%, #E40015 100%)"
                    btn-text="马上抢"
                    @click="goDetail"
                >
                    <template #footer>
                        <view class="goods-footer">
                            <view class="subsidy-price">
                                <text class="subsidy-price-label">补贴价</text>
                                <zd-price
                                    :value="item.subsidyPrice"
                                    :font-size-large="40"
                                    :font-size-small="28"
                                    :font-size-unit="20"
                                    color="rgba(255, 71, 52, 1)"
                                ></zd-price>
                            </view>
                            <view class="student-price">
                                <text class="student-price-text"
                                    >学生价￥{{ item.goodsPrice }}</text
                                >
                                <text class="remain-text">仅剩:{{ item.goodsStock }}</text>
                            </view>
                        </view>
                    </template>
                    <template #head-tag>
                        <text class="head-tag-text">已补{{ item.subsidyMoney }}元</text>
                    </template>
                </zd-goods-card>
            </view>
            <view
                v-if="loadText && dataList.length"
                class="loadText"
            >
                {{ loadText }}
            </view>
        </view>

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

        <header-fix
            v-if="showFixSet"
            title="超值补贴"
            :title-style="{ paddingTop: '14rpx', textAlign: 'center' }"
        >
        </header-fix>
    </view>
</template>

<style lang="scss" scoped>
.page-warp {
    display: flex;
    width: 750rpx;
    height: 100%;
    background: #ff000d;
    flex-direction: column;
}
.tab-bar-warp {
    position: fixed;
    left: 0;
    z-index: 101;
}
.goods-box {
    background: #ff000d;
}
.item-warp {
    margin-bottom: 20rpx;
    background: transparent;
}

.head-tag-text {
    padding: 8rpx 16rpx;
    border-radius: 16rpx 0 16rpx 0;
    color: #fff2cc;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 24rpx;
    background: #000000;
}
.box {
    position: relative;
    z-index: 8999;
    height: 100%;
}
.empty-text {
    color: #ffffff;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 40rpx;
}

.goods-footer {
    .subsidy-price {
        display: flex;
        align-items: flex-end;
        margin-right: 8rpx;
        margin-bottom: 10rpx;
        .subsidy-price-label {
            color: #ff4734;
            font-size: 24rpx;
            font-weight: 400;
            line-height: 24rpx;
        }
    }
    .student-price {
        display: flex;
        align-items: flex-end;
        .student-price-text {
            margin-right: 18rpx;
            text-decoration: line-through;
            color: #8a9399;
            font-size: 20rpx;
            font-weight: 400;
            line-height: 20rpx;
        }
        .remain-text {
            color: #ff8026;
            font-size: 20rpx;
            font-weight: 400;
            line-height: 20rpx;
        }
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
</style>
