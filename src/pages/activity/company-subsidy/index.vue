<script setup lang="ts">
import { useLoadMore } from '@zsdx/mp-material/dist/lib/hooks/useLoadmore';
import { router, storage } from '@zsdx/mp-utils';

import {
    getZoneAreaList,
    getZoneCategoryList,
    getZoneGoodsList
} from '@/api/activity/company-subsidy/index';
import type {
    ICategoryList,
    IConfigInfo,
    IZoneGoodsParams,
    IZoneList
} from '@/api/activity/company-subsidy/types';

import headerBar from './components/header-bar.vue';
import listItem from './components/list-item.vue';
import listTab from './components/list-tab.vue';

const store = storage();
const configInfo = ref<IConfigInfo>({} as IConfigInfo);

const studentShopId = ref('');
const activityNo = ref('');
const tabIndex = ref(0);
const tabList = ref<Array<IZoneList>>();
const lotteryNo = ref('');
const categoryIndex = ref(0);
const categoryList = ref<Array<ICategoryList>>();
const showTabBar = ref(false);
const listTabs = ref();
const zoneParams = ref({
    isPreview: 0,
    studentShopId: ''
});
const trackData = {
    type: 'all',
    clientTop: uni.getWindowInfo().windowHeight / 2
};
const goodsListParams = ref<IZoneGoodsParams>({
    zoneId: '',
    categoryId: '',
    studentShopId: ''
});

let headerHeight = uni.getSystemInfoSync().statusBarHeight || 0;
const stickTop = (uni.getSystemInfoSync().statusBarHeight || 0) + uni.upx2px(80);

headerHeight = headerHeight + uni.upx2px(184);
const channel = ref(false);
const init = ref(false);

const { dataList: zoneList, loadList, reload } = useLoadMore(getZoneGoodsList, list => list);
const dataList = computed(() => zoneList.value);
const isRadius = ref(true);
onLoad((options: any) => {
    channel.value = getCurrentPages().length == 1 ? true : false;
    studentShopId.value = store.get('studentShopId') || '';
    zoneParams.value.studentShopId = studentShopId.value;
    zoneParams.value.isPreview = options.isPreview || 0;
    goodsListParams.value.studentShopId = studentShopId.value;
});
onShow(() => {
    initList();
});

/**  初始化数据 */

const initList = async () => {
    categoryIndex.value = 0;
    await getZoneArea();
};

/**  获取专区列表 */
const getZoneArea = async () => {
    try {
        const res = await getZoneAreaList(zoneParams.value);

        tabList.value =
            res.list.map((item, index) => {
                return {
                    ...item,
                    isActive: index == 0
                };
            }) || [];
        configInfo.value = res.configMaterialInfo;
        goodsListParams.value.zoneId = tabList.value[0].zoneId;
        activityNo.value = res.activityNo;
        getCategory(tabList.value[0].zoneId, tabList.value[0].activityNo);
    } catch (err) {
        console.error(err);
    }
};
/**  获取分类列表 */
const getCategory = async (zoneId: string, activityNo: string) => {
    try {
        const res = await getZoneCategoryList({ zoneId, activityNo });
        categoryList.value = res.list;
        goodsListParams.value = {
            ...goodsListParams.value,
            categoryId: categoryList.value[0].categoryId
        };
        init.value = true;
    } catch (err) {
        console.error(err);
    }
};
const changeTab = (item: IZoneList, index: number) => {
    tabIndex.value = index;
    categoryIndex.value = 0;
    goodsListParams.value.zoneId = item.zoneId;
    getCategory(item.zoneId, item.activityNo);
};

const changeCategory = (item: ICategoryList, index: number) => {
    categoryIndex.value = index;
    goodsListParams.value = {
        ...goodsListParams.value,
        categoryId: item.categoryId
    };
};
/**  页面滚动 */

onPageScroll(e => {
    showTabBar.value = e.scrollTop >= 80;
    isRadius.value = e.scrollTop <= 200;
});

onReachBottom(async () => {
    await loadList(goodsListParams.value);
});

const goLotter = () => {
    router.push('lottery', { lotteryNo: lotteryNo.value });
};
/** 下拉刷新 */

onPullDownRefresh(async () => {
    await initList();
    console.log(listTabs.value.scrollLeft, 'listTabs.value.scrollLeft=======');

    listTabs.value.resetScrollLeft();
    uni.stopPullDownRefresh();
});

onShareAppMessage(() => {
    return {
        title: '欢迎来到我的校园店～',
        path: '/pages/activity/company-subsidy/index?studentShopId=' + studentShopId.value
    };
});
onShareTimeline(() => {
    return {
        title: '欢迎来到我的校园店～',
        query: `studentShopId=${studentShopId.value}`
    };
});

watch(
    () => goodsListParams.value,
    (val, oldVal) => {
        if (val !== oldVal) {
            reload(goodsListParams.value);
        }
    }
);
</script>

<template>
    <view
        class="page-warp"
        :style="{ background: configInfo.backgroundColor }"
    >
        <header-bar
            :show-fix-set="showTabBar"
            :bg-img="configInfo.coverImage"
            :activity-no="activityNo"
            :init="init"
            :fix-background="configInfo.backgroundColor"
            :channel="channel"
            :params="zoneParams"
        ></header-bar>
        <mp-sticky
            :offset-top="stickTop"
            :z-index="99"
        >
            <list-tab
                ref="listTabs"
                :tab-list="tabList"
                :category-list="categoryList"
                :category-index="categoryIndex"
                :is-radius="isRadius"
                @change-tab="changeTab"
                @change-category="changeCategory"
            ></list-tab>
        </mp-sticky>
        <view class="list-warp">
            <track-view
                v-for="(item, index) in dataList"
                :key="index"
                :track-data="{
                    ...trackData,
                    observerName: '.subsidyGoods' + index,
                    eventData: {
                        path: 'bi_feeds',
                        student_shop_id: zoneParams.studentShopId,
                        nav_name: categoryList && categoryList[categoryIndex].categoryName,
                        data_type: 'Activity',
                        data_id: item.goodsNo,
                        data_info: item,
                        index
                    }
                }"
            >
                <list-item :item="item"></list-item>
            </track-view>
        </view>

        <view
            v-if="!dataList.length"
            class="page-empty"
        >
            <zd-empty
                :image-width="450"
                :image-height="250"
                image="https://cdn.zsdx.cn/mp-cs/images/activity/combination-package/empty.png"
                description="暂无商品哦~"
            />
        </view>
        <image
            v-if="lotteryNo"
            class="fixed-suspend"
            src="https://cdn.zsdx.cn/mp-cs/images/activity/company-subsidy/suspend.png"
            mode="aspectFill"
            @tap.prevent="goLotter"
        ></image>
    </view>
</template>

<style lang="scss" scoped>
.page-warp {
    display: flex;
    height: 100%;
    background: #d8d8d8;
    flex-direction: column;
}
.fixed-suspend {
    position: fixed;
    right: 0;
    bottom: 144rpx;
    width: 162rpx;
    height: 180rpx;
}
.list-warp {
    display: flex;
    justify-content: space-between;
    width: 750rpx;
    padding: 0 20rpx;
    background: #f5f8fa;
    box-sizing: border-box;
    flex-wrap: wrap;
}
.page-empty {
    background: #f5f8fa;
    flex: 1;
}
</style>
