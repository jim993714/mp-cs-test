<script setup lang="ts">
import { useLoadMore } from '@zsdx/mp-material/dist/lib/hooks/useLoadmore';

import {
    getActivityList,
    getCategoryList,
    getPackageStyle
} from '@/api/activity/combination-package/index';
import type {
    ICategory,
    IPackageListParams,
    IStyle
} from '@/api/activity/combination-package/types';
import { useUserStore } from '@/stores/user/index';

import banner from './components/banner.vue';
import category from './components/category.vue';
import categoryDialog from './components/category-dialog.vue';
import goodsList from './components/goods-list.vue';

const showHead = ref(false);
const statusBarHeight: number | undefined = uni.getSystemInfoSync().statusBarHeight || 0;
const headerHeight = statusBarHeight + uni.upx2px(88);
const cateDialog = ref();
const scrollLeft = ref(0);
const categoryList = ref([] as Array<ICategory>);
const styleConfig = ref({} as IStyle);
const userStore = useUserStore();
const { studentShopId } = toRefs(userStore);
const firstInit = ref(0);
const params = ref({
    activityStatus: 2,
    studentShopId: studentShopId.value,
    categoryId: ''
} as IPackageListParams);

const {
    dataList: packageList,
    loadList,
    reload,
    loadText,
    onResponse
} = useLoadMore(getActivityList, list => list);

onResponse &&
    onResponse(() => {
        firstInit.value++;
    });

const dataList = computed(() => {
    return packageList.value;
});

onLoad(async () => {
    try {
        await getCategory();
        await getPackageStyleConfig();
    } catch (err) {
        console.error(err);
    }
});

/** 获取分类 */

const getCategory = async () => {
    try {
        const res = await getCategoryList();
        categoryList.value = res.list.map((item, index) => {
            return {
                ...item,
                isActive: index === 0 ? true : false
            };
        });

        params.value = {
            ...params.value,
            categoryId: categoryList.value[0].categoryId
        };
    } catch (err) {
        console.error(err);
    }
};

const getPackageStyleConfig = async () => {
    try {
        const res = await getPackageStyle();
        styleConfig.value = res;
    } catch (err) {
        console.error(err);
    }
};

/**  显示分类弹窗 */

const showCategoryDialog = () => {
    cateDialog.value.fnShow(JSON.stringify(categoryList.value));
    showHead.value = true;
};

/**  切换分类 */

const changeCategory = (item: ICategory) => {
    scrollLeft.value = item.index ? item.index * 40 : 0;
    categoryList.value.forEach(_item => {
        _item.isActive = false;
    });
    categoryList.value[item.index || 0].isActive = true;
    params.value = {
        ...params.value,
        categoryId: item.categoryId
    };
};

const cateDialogConfirm = (item: any) => {
    params.value = {
        ...params.value,
        activityStatus: item.currentStatus?.status || 2
    };
    if (item.currentCategory) {
        changeCategory(item.currentCategory);
    }
};
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

onPageScroll(e => {
    showHead.value = e.scrollTop >= 20;
});

watch(
    () => params.value,
    (val, oldVal) => {
        if (val !== oldVal) {
            reload(params.value);
        }
    }
);
watch(
    () => firstInit.value,
    value => {
        if (value === 1 && dataList.value?.length <= 0) {
            params.value = {
                ...params.value,
                activityStatus: 1
            };
        }
    }
);

onShareAppMessage(() => {
    return {
        title: '欢迎来到我的校园店～',
        path: '/pages/activity/combination-package/index?studentShopId=' + studentShopId.value
    };
});
</script>

<template>
    <view
        class="page-warp"
        :style="{ background: styleConfig.backgroundColor }"
    >
        <zd-navbar
            v-if="showHead"
            :background="styleConfig.backgroundColor"
            class="navbar"
            title="组合大礼包"
            color="#ffffff"
            fixed
        >
        </zd-navbar>
        <banner
            :style-config="styleConfig"
            :show-head="showHead"
            :status-bar-height="statusBarHeight"
        ></banner>
        <category
            :scroll-left="scrollLeft"
            :category-list="categoryList"
            @show-category-dialog="showCategoryDialog"
            @change-category="changeCategory"
        ></category>
        <category-dialog
            ref="cateDialog"
            :header-height="headerHeight"
            :category-list="categoryList"
            :activity-status="params.activityStatus"
            @close="showHead = false"
            @confirm="cateDialogConfirm"
        ></category-dialog>
        <goodsList
            v-for="(list, index) in dataList"
            :key="index"
            :data="list"
            :repair-image="styleConfig.repairImage"
        />
        <view
            v-if="loadText && dataList.length"
            class="loadText"
        >
            {{ loadText }}
        </view>
        <zd-empty
            v-if="!dataList.length"
            class="page-empty"
            :image-width="450"
            :image-height="250"
            image="https://cdn.zsdx.cn/mp-cs/images/activity/combination-package/empty.png"
            description="暂无组合大礼包哦~"
        />
    </view>
</template>

<style lang="scss" scoped>
.page-warp {
    display: flex;
    width: 750rpx;
    min-height: 100%;
    flex-direction: column;
}
.page-empty {
    flex: 1;
    background: #f5f8fa;
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
