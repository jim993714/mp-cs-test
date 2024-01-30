<script setup lang="ts">
import { useLoadMore } from '@zsdx/mp-material/dist/lib/hooks/useLoadmore';
import { router, storage } from '@zsdx/mp-utils';

import {
    getCategoryList,
    getConfigStyle,
    getDiscountList,
    getTimeList
} from '@/api/activity/discount-area/index';
import type {
    ICategory,
    IConfigStyle,
    IListParams,
    ISearchList,
    ITimeList
} from '@/api/activity/discount-area/types';
import { useUserStore } from '@/stores/user/index';

import banner from './components/banner.vue';
import goodsList from './components/goods-list.vue';
import search from './components/search.vue';
import sortBar from './components/sort-bar.vue';

const localStorage = storage();
const showHead = ref(false);
const showHomeBtn = ref(false);
const zdHeader = ref();
const headerHeight = ref(0);
const statusBarHeight: number | undefined = uni.getSystemInfoSync().statusBarHeight || 0;
const pageHeight = uni.getWindowInfo().windowHeight || 0;
const activityNo = ref('');
const sortTop = statusBarHeight + uni.upx2px(300);
const categoryList = ref<ICategory[]>([]);
const timeList = ref<ITimeList[]>([]);
const configStyle = ref<IConfigStyle>();
const activityEndTime = ref(0);
const currentTimeIndex = ref(0);
const activityStartTime = ref(0);
const currentCategoryIndex = ref(0);
const categroyIndex = ref(0);
const currentStatus = ref(0);
const studentShopId = localStorage.get('studentShopId');
const timeIds = ref('');
const init = ref(false);
const load = ref(false);
const params = ref<IListParams>({
    timeId: '',
    categoryId: '',
    activityNo: '',
    scrollId: '',
    date: '',
    startLimitPrice: 0,
    endLimitPrice: 99999
});

const searchList = ref<ISearchList[]>();

const {
    dataList: discountList,
    loadList,
    reload,
    loadText
} = useLoadMore(getDiscountList, list => list);

const dataList = computed(() => {
    return discountList.value;
});

onLoad(async (options: any) => {
    try {
        const pages = getCurrentPages();
        showHomeBtn.value = pages.length === 1;
        activityNo.value = options.activityNo || '';
        uni.$on('loginSuccess', loginInit);
        getPageConfig();
        await getCategory();
    } catch (err) {
        console.error(err);
    }
});
const loginInit = async () => {
    getPageConfig();
    await getCategory();
};
const fnGoIndex = () => {
    if (showHomeBtn.value) {
        router.switchTab('home');
    } else {
        router.back();
    }
};

const getCategory = async (refresh?: boolean) => {
    try {
        init.value = false;
        const res = await getCategoryList(activityNo.value);

        categoryList.value = res.list.length
            ? res.list.map((item, index) => {
                  return {
                      ...item,
                      isActive: index === 0 ? true : false
                  };
              })
            : [];

        searchList.value = res.searchList.map((item, index) => {
            return {
                ...item,
                isActive: index === 0 ? true : false
            };
        });
        await getTime(refresh);
    } catch (err) {
        console.error(err);
    }
};

const getTime = async (refresh?: boolean) => {
    try {
        const res = await getTimeList(activityNo.value);
        init.value = true;
        timeList.value = res.list.map((item, index) => {
            return {
                ...item,
                activity: index === 0 ? 2 : 1
            };
        });
        activityEndTime.value = res.endTime || 0;
        activityStartTime.value = res.startTime || 0;

        if (timeList.value.length >= 1) {
            //如果refresh 有值代表是下拉刷新要保持状态,否则是初始化
            timeIds.value = timeList.value.map(item => item.timeId).join(',');
            currentStatus.value = timeList.value[0].activityStatus || 0;

            params.value = {
                ...params.value,
                timeId:
                    currentTimeIndex.value > -1 && refresh
                        ? timeList.value[currentTimeIndex.value].timeId
                        : timeList.value[0].timeId,
                date:
                    currentTimeIndex.value > -1 && refresh
                        ? timeList.value[currentTimeIndex.value].date
                        : timeList.value[0].date,
                categoryId: categoryList.value[0]?.categoryId,
                activityNo: activityNo.value
            };
        }
        load.value = true;
    } catch (err: any) {
        console.error(err);
        uni.showToast({
            icon: 'none',
            title: err.msg
        });
    }
};

const getPageConfig = async () => {
    try {
        const res = await getConfigStyle(activityNo.value);
        configStyle.value = res;
    } catch (err) {
        console.error(err);
    }
};
const goTop = () => {
    uni.createSelectorQuery()
        .select('#sortBarRef')
        .boundingClientRect(res => {
            uni.pageScrollTo({
                scrollTop: sortTop, // 滚动到的位置（距离顶部 px）
                duration: 300 //滚动所需时间 如果不需要滚动过渡动画，设为0（ms）
            });
        })
        .exec();
};
onMounted(() => {
    headerHeight.value = zdHeader.value.getNabBarHeight();
});
const sortList = (item: any) => {
    currentStatus.value = item.status || 0;
    categroyIndex.value = item.categoryIndex;

    if (item.reload) {
        params.value.timeId = item.timeId;
        params.value.date = item.date;
        reload(params.value);
    } else {
        params.value = {
            ...params.value,
            ...item
        };
    }
};

const onRefresh = (ref?: boolean) => {
    load.value = ref ? true : false;
    params.value.startLimitPrice = 0;
    params.value.endLimitPrice = 99999;
    getCategory(true);
};
/** 刷新 */
onPullDownRefresh(async () => {
    onRefresh();
    uni.stopPullDownRefresh();
});

/** 加载 */

onReachBottom(async () => {
    await loadList(params.value);
});
onPageScroll(e => {
    showHead.value = e.scrollTop >= 20;
});

watch(
    () => params.value,
    (val, oldVal) => {
        if (val !== oldVal) {
            reload(val);
        }
    }
);

onShareAppMessage(() => {
    return {
        title: '欢迎来到我的校园店～',
        path:
            '/pages/activity/discount-area/index?studentShopId=' +
            studentShopId +
            '&activityNo=' +
            activityNo.value
    };
});
</script>

<template>
    <view
        class="page-warp"
        :style="{
            paddingTop: headerHeight + 'px',
            height: pageHeight + 100 + 'px'
        }"
    >
        <zd-navbar
            ref="zdHeader"
            :background="configStyle?.color"
            class="navbar"
            color="#ffffff"
            type="main"
            fixed
        >
            <view class="header-left">
                <view
                    v-if="showHomeBtn"
                    class="zdfont zdmp-huidaoshouye icon-back"
                    @click="fnGoIndex()"
                ></view>
                <view
                    v-else
                    class="zdfont zdmp-fanhui icon-back"
                    @click="fnGoIndex()"
                ></view>
            </view>
            <view class="header-center">{{ configStyle?.activityName }}</view>
        </zd-navbar>
        <view
            class="head-bg-box"
            :style="{ height: headerHeight + 'px' }"
        >
            <image
                class="header-bg"
                src="https://cdn.zsdx.cn/mp-cs/images/activity/discount-area/head-bg.png"
                mode="scaleToFill"
            />
        </view>
        <search
            :activity-no="params.activityNo"
            :time-list="timeList"
            :background="configStyle?.color"
            :init="init"
        />
        <banner
            :img="configStyle?.headImg"
            :color="configStyle?.color"
            :activity-no="activityNo"
        />
        <sortBar
            v-if="load"
            id="sortBarRef"
            :background="configStyle?.color"
            :category-list="categoryList"
            :time-list="timeList"
            :current-category-index="currentCategoryIndex"
            :activity-end-time="activityEndTime"
            :activity-start-time="activityStartTime"
            :search-list="searchList"
            @go-top="goTop"
            @change-list="sortList"
            @on-refresh="onRefresh(true)"
        />
        <goods-list
            v-if="dataList.length"
            :list="dataList"
            :activity-no="activityNo"
            :current-status="currentStatus"
            :date="params.date"
            :time-id="timeIds"
            :category-name="categoryList.length ? categoryList[categroyIndex].categoryName : ''"
        />
        <view
            v-if="loadText && dataList.length"
            class="loadText"
        >
            {{ loadText }}
        </view>
        <view
            v-if="!dataList.length"
            class="page-empty"
        >
            <zd-empty
                v-if="!dataList.length"
                :image-width="450"
                :image-height="250"
                image="https://cdn.zsdx.cn/mp-cs/images/activity/combination-package/empty.png"
                description="商品正在马不停蹄的赶来~"
            />
        </view>
    </view>
</template>

<style lang="scss" scoped>
.page-warp {
    display: flex;
    width: 750rpx;
    height: 100%;
    flex-direction: column;
    background: #f5f8f5;
    .icon-back {
        width: 88rpx;
        height: 88rpx;
        line-height: 88rpx;
        text-align: center;
        font-size: 32rpx;
        font-weight: bold;
        flex-direction: row;
    }
    .header-center {
        color: #ffffff;
        font-size: 36rpx;
        font-weight: 600;
        line-height: 36rpx;
    }
    .head-bg-box {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 301;
        overflow: hidden;
        width: 334rpx;
    }
    .header-bg {
        width: 334rpx;
        height: 278rpx;
    }
}
.page-empty {
    background: #f5f8f5;
    flex: 1;
}

.loadText {
    width: 750rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    color: #999999;
    font-size: 24rpx;
    font-weight: 400;
    background: #f5f8f5;
}
</style>
