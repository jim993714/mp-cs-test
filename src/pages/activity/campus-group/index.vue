<script setup lang="ts">
import { useLoadMore } from '@zsdx/mp-material/dist/lib/hooks/useLoadmore';
import { router, storage } from '@zsdx/mp-utils';

import { getSchoolDumplingList } from '@/api/activity/campus-group';
import type { ISchoolDumplingList, ISchoolDumplingParams } from '@/api/activity/campus-group/type';
import studentAuthPop from '@/components/student-auth-pop/index.vue';

import bannerList from './components/banner-list.vue';
import headerBar from './components/header-bar.vue';
import tabBar from './components/tab-bar.vue';
import { getTime, getTimeLabel, goodsConfig } from './constants';
import type { ITab } from './type';

const localStorage = storage();
const showTabBar = ref(false);
const params = ref<ISchoolDumplingParams>({
    scrollId: '',
    type: 0,
    studentShopId: ''
});
const studentAuth = ref();
const tabIndex = ref(0);
const isLogin = ref(localStorage.get('isLogin'));
const studentShopId = ref('');
const stickyTop = (uni.getSystemInfoSync().statusBarHeight || 0) + uni.upx2px(88);

const timeOutStyle = {
    color: '#ffffff',
    fontSize: '20rpx',
    height: '20rpx',
    lineHeight: '20rpx',
    margin: '0',
    fontWeight: 700
};
const {
    dataList: dumpData,
    loadList,
    loadText,
    reload,
    dataRes
} = useLoadMore(getSchoolDumplingList, list => list);

const dataList = computed(() => {
    dumpData.value.forEach(item => {
        item.goodsTitle = `【${item.studentNum}人团】${item.goodsTitle}`;
    });
    return dumpData.value;
});

watch(
    () => params.value,
    (val, oldVal) => {
        if (val !== oldVal) {
            reload(params.value);
        }
    }
);

onShow(() => {
    studentShopId.value = localStorage.get('studentShopId') || '';
    params.value.studentShopId = studentShopId.value;
    initData();
});
const getBtnText = (item: ISchoolDumplingList) => {
    if (item.showAwaitingGroupFormation == 1) {
        return '待成团';
    }
    if (tabIndex.value == 1) {
        return '开团';
    } else if (tabIndex.value == 0) {
        return '参团';
    }
};
const initData = async () => {
    try {
        reload(params.value);
    } catch (err) {
        console.error(err);
    }
};

/**  切换Tab */

const changeTab = (item: ITab, index: number) => {
    tabIndex.value = index;
    params.value = {
        ...params.value,
        type: item.value
    };
};
/**  倒计时结束 */
const timeEnd = (item: ISchoolDumplingList) => {
    dumpData.value = dumpData.value.filter(_item => _item.goodsNo != item.goodsNo);
};
/**  点击参团，查询学生认证与是否已参团购买, 通过校验跳转商品详情*/

const onClickGoods = async (item: ISchoolDumplingList) => {
    try {
        if (item.needStudentVerify) {
            const auth = await studentAuth.value.validate();
            if (!auth) return;
        }

        if (item.schoolDumplingId) {
            router.push('campusGroupDetail', {
                activityNo: item.activityNo,
                schoolDumplingId: item.schoolDumplingId,
                channel: 'groupList'
            });
        } else {
            router.push('goodsDetail', {
                goodsNo: item.goodsNo,
                activityNo: item.activityNo,
                schoolDumplingId: item.schoolDumplingId
            });
        }
    } catch (err) {
        console.error(err);
    }
};
/** 下拉刷新 */

onPullDownRefresh(async () => {
    params.value = {
        ...params.value,
        scrollId: undefined
    };
    uni.stopPullDownRefresh();
});

/** 加载 */

onReachBottom(async () => {
    await loadList(params.value);
});

/**  页面滚动 */

onPageScroll(e => {
    showTabBar.value = e.scrollTop >= 40;
});
</script>

<template>
    <view class="page-warp">
        <header-bar :show-fix-set="showTabBar"></header-bar>
        <image
            class="head-banner"
            src="https://cdn.zsdx.cn/mp-cs/images/activity/campus-group/banner.png"
            mode="scaleToFill"
        />
        <banner-list
            v-if="dataRes?.bannerList?.length"
            :banner-list="dataRes?.bannerList"
        ></banner-list>
        <view class="tab-warp">
            <mp-sticky
                :offset-top="stickyTop"
                :z-index="9"
            >
                <tab-bar
                    :tab-index="tabIndex"
                    @change-tab="changeTab"
                ></tab-bar>
            </mp-sticky>
        </view>

        <template v-if="dataList.length">
            <view
                v-for="item in dataList"
                :key="item.goodsNo"
                class="item-warp"
            >
                <zd-goods-card
                    :item="item"
                    v-bind="{ ...goodsConfig }"
                    :content-style="{ borderRadius: '16rpx' }"
                    show-header-tag
                    @tap.prevent="onClickGoods(item)"
                >
                    <template #head-tag>
                        <view class="head-tag">
                            <view class="head-tag-label">{{
                                getTimeLabel(item.schoolDumplingId)
                            }}</view>
                            <zd-timer-out
                                :key="item.activityStatus + item.goodsNo"
                                :time="getTime(item)"
                                :unit-type="1"
                                :splider-style="timeOutStyle"
                                :unit-style="timeOutStyle"
                                :show-second="true"
                                zero
                                :show-day="true"
                                @time-end="timeEnd(item)"
                            ></zd-timer-out>
                        </view>
                    </template>
                    <template #footer>
                        <view class="goods-footer">
                            <view class="tag-list">
                                <view class="tag-top">
                                    <text
                                        v-if="item.allowsDeliveryToDormitory"
                                        class="tag tag-green"
                                        >送货到寝</text
                                    >
                                    <text
                                        v-if="item.showRefundBeforeReturn"
                                        class="tag tag-blue"
                                        >先退款后退货</text
                                    >
                                </view>
                                <view
                                    v-if="item.remainingMemberNum && item.schoolDumplingId"
                                    class="tag-bottom"
                                    >还差{{ item.remainingMemberNum }}人成团</view
                                >
                            </view>
                            <view class="price-box">
                                <view class="price-label">团购价</view>
                                <zd-price
                                    :value="item.groupBuyPrice"
                                    :font-size-large="40"
                                    :font-size-small="28"
                                    :font-size-unit="20"
                                    color="rgba(255, 71, 52, 1)"
                                ></zd-price>
                            </view>
                        </view>
                    </template>
                    <template #btn>
                        <view class="item-btn"> {{ getBtnText(item) }}</view>
                    </template>
                </zd-goods-card>
            </view>
        </template>
        <view
            v-if="!dataList.length"
            class="empty-warp"
        >
            <zd-empty
                image="https://cdn.zsdx.cn/mp-cs/images/activity/newcomer-special/empty.png"
                :image-width="450"
                :image-height="250"
            >
                <template #description>
                    <text class="empty-text">商品正在马不停蹄的赶来~</text>
                </template>
            </zd-empty>
        </view>
        <view
            v-if="loadText && dataList.length"
            class="loadText"
        >
            {{ loadText }}
        </view>
        <student-auth-pop
            v-if="isLogin"
            ref="studentAuth"
            content="未获取到你的学生认证记录，请前往认证"
        ></student-auth-pop>
    </view>
</template>

<style lang="scss" scoped>
.page-warp {
    position: relative;
    min-height: 100%;
    background: #f5f8fa;
}
.head-banner {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 750rpx;
    height: 780rpx;
}

.tab-warp {
    position: relative;
    margin: 20rpx 0;
}

.head-tag {
    display: flex;
    align-items: center;
    padding: 8rpx 16rpx;
    border-radius: 16rpx 0 16rpx 0;
    color: #fff2cc;
    font-size: 24rpx;
    font-weight: 400;
    background: rgba(0, 0, 0, 0.5);
    line-height: 24rpx;
}
.head-tag-label {
    color: #ffffff;
    font-size: 20rpx;
    line-height: 20rpx;
}
.item-warp {
    margin-bottom: 20rpx;
    background-color: transparent;

    .goods-footer {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        flex: 1;
        .tag-list {
            display: flex;
            flex-direction: column;
            .tag-top {
                display: flex;
                align-items: center;
                .tag {
                    margin-right: 8rpx;
                    padding: 8rpx 10rpx;
                    border-radius: 8rpx;
                    font-size: 20rpx;
                    font-weight: 500;
                    line-height: 20rpx;
                }
                .tag-green {
                    color: #0bd983;
                    background: rgba(11, 217, 131, 0.1);
                }
                .tag-blue {
                    color: #199fff;
                    background: rgba(25, 159, 255, 0.1);
                }
            }
            .tag-bottom {
                margin-top: 16rpx;
                color: #b7b7b7;
                font-size: 24rpx;
                font-weight: 400;
                line-height: 24rpx;
            }
        }
    }
    .price-box {
        display: flex;
        align-items: flex-end;
        margin-bottom: 10rpx;
    }
    .price-label {
        margin-right: 8rpx;
        color: #ff4734;
        font-size: 20rpx;
        font-weight: 500;
        line-height: 20rpx;
    }
}
::v-deep .goods-tag-warp {
    margin-top: 10rpx !important;
}
.loadText {
    width: 750rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    color: #999999;
    font-size: 24rpx;
    font-weight: 400;
    background: transparent;
}

.empty-warp {
    position: relative;
}
.empty-text {
    color: #999999;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 40rpx;
}

.item-btn {
    width: 160rpx;
    height: 60rpx;
    border-radius: 30rpx;
    text-align: center;
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 700;
    background: linear-gradient(90deg, #31e7ff 0%, #18bfff 100%);
    line-height: 60rpx;
}
</style>
