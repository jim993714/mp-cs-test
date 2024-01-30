<script setup lang="ts">
import { useLoadMore } from '@zsdx/mp-material/dist/lib/hooks/useLoadmore';
import { storage } from '@zsdx/mp-utils';

import { getNewPersonGoodsList } from '@/api/activity/newcomer-special/index';
import type { ICouponGoodsItem } from '@/api/activity/newcomer-special/types';
import { uploadImage } from '@/api/common';
import {
    getBannerList,
    getCategoryList,
    getGridList,
    getJinGangArea,
    getNewFansCoupon,
    getRecommendGoodsList,
    getSaleLeadCouponInfo,
    getShopGoodsList,
    getShopIndexModuleList,
    getShopInfo,
    WxDeny,
    WxSync
} from '@/api/home/index';
import type {
    IBannerList,
    ICategoryList,
    ICouponItem,
    IGridList,
    IGridPhaseGoodsList,
    IJinGang,
    IShopGoodsListParams,
    IShopIndexModule,
    IShopInfo,
    IWxUserParams
} from '@/api/home/types';
import type { Coupon } from '@/api/ucenter/types';
import { useAppStore } from '@/stores/app/index';
import { useUserStore } from '@/stores/user/index';

import authorizeCover from './components/authorize-cover.vue';
import banner from './components/banner.vue';
import CategoryBar from './components/category-bar.vue';
import couponNotify from './components/coupon-notify.vue';
import grid from './components/grid/grid.vue';
import headerBar from './components/header-bar.vue';
import jingGang from './components/jingGang.vue';
import newExclusive from './components/new-exclusive.vue';
import recommendGoods from './components/recommend-goods.vue';
import shopInfoPopup from './components/shopInfoPopup.vue';
import homeSkeleton from './components/skeleton.vue';
import waterfallWarp from './components/waterfall-warp.vue';
import { loadingIcon, theme } from './utils';

const userStore = useUserStore();
const { isLogin, userInfo } = toRefs(userStore);
const { studentShopId } = toRefs(userStore);
const {
    dataList: shopGoodsList,
    loadList,
    reload,
    loadText
} = useLoadMore(getShopGoodsList, list => list);
const pagePaddingTop = (uni.getSystemInfoSync().statusBarHeight || 0) + uni.upx2px(180);
const localStorage = storage();

const dataList = computed(() => shopGoodsList.value);
/** 基础信息 */
const shopInfo = ref<IShopInfo>();

/** 公告信息 */
const notice = ref<Array<string>>([]);

/** 模块排序 */
const moduleList = ref<Array<IShopIndexModule>>([]);

/** banner模块 */
const bannerList = ref<Array<IBannerList>>([]);

/** 是否显示骨架屏 */
const showNotice = ref(true);

/** 新人券列表 */
const newCouponList = ref<ICouponItem>();

/** 新人券商品列表 */
const newCouponGoods = ref<Array<ICouponGoodsItem>>([]);

/** 宫格列表 */
const gridList = ref<Array<IGridList>>([]);
/** 本店推荐 */
const recommendList = ref<Array<IGridPhaseGoodsList>>([]);
/** 本店商品列表的传参 */
const goodsListParams = ref<IShopGoodsListParams>({
    studentShopId: '',
    sortType: '',
    sortField: ''
});
/** 分类列表 */
const categoryList = ref<Array<ICategoryList>>([]);
/** 显示用户信息 */
const showShopInfoPopup = ref(false);
/** 显示分类列表 */

const showCategoryPopup = ref(false);
/** 初始化 */
const init = ref(false);
/** 分类弹窗 */
const waterfallRef = ref();
const scrollInto = ref('');

/** 金刚区列表 */
const jinGangList = ref<Array<IJinGang>>([]);
/** 主题 */

const currentTheme = computed(() => {
    switch (shopInfo.value?.themeType) {
        case 1:
            return theme.default;
        case 2:
            return theme.purple;
        case 3:
            return theme.orange;
        case 4:
            return theme.green;
        case 5:
            return theme.pk;
        case 6:
            return theme.doubleEleven;
        default:
            return theme.default;
    }
});

/** 是否显示领券通知 */
const showCouponNotify = ref(false);

/** 领券通知内容 */
const couponNotifyInfo = ref<Coupon>();

const saleLeadStudentCouponNo = ref('');
/** 是否授权头像 */
const showAuthCover = ref(false);

watch(
    () => goodsListParams.value,
    (val, oldVal) => {
        if (val !== oldVal) {
            reload(goodsListParams.value);
        }
    }
);

onLoad((options: any) => {
    /** 是否能使用grid view */
    if (!uni.canIUse('grid-view')) {
        uni.updateWeChatApp();
    }
    saleLeadStudentCouponNo.value = options.saleLeadStudentCouponNo || '';
});

onShow(async () => {
    try {
        const res = await userStore.updateStudentShopId();
        if (res) {
            studentShopId.value = res;
        }

        initData();
    } catch (err) {
        console.log(err);
    }

    if (isLogin.value) {
        useAppStore().updateShopCartCount();
    }
});

const upDateBaseInfo = () => {
    showAuthCover.value = true;
    uni.hideTabBar();
};
const initData = async () => {
    goodsListParams.value.studentShopId = studentShopId.value;
    if (studentShopId.value) {
        await fnInit(studentShopId.value);

        await fnInit2(studentShopId.value);

        if (userInfo?.value?.needAuthUpdateBaseInfo) {
            upDateBaseInfo();
        }
    }
};
const getShopShareInfo = (type: string) => {
    let imageUrl = dataList.value.length <= 0 ? '' : dataList.value[0].goodsCover;
    if (type === 'onShareAppMessage') {
        return {
            title: `${shopInfo.value?.shopName}，你的专属好物店铺~~享受全网最低、送货到寝、爆料送五折券福利`,
            path: '/pages/main/home/index?studentShopId=' + studentShopId.value,
            imageUrl: imageUrl
        };
    } else {
        return {
            title: `${shopInfo.value?.shopName}，你的专属好物店铺~~享受全网最低、送货到寝、爆料送五折券福利`,
            query: `studentShopId=${studentShopId.value}`,
            imageUrl: imageUrl
        };
    }
};
onShareAppMessage(() => {
    return getShopShareInfo('onShareAppMessage');
});
onShareTimeline(() => {
    return getShopShareInfo('onShareTimeline');
});
/** 初始化数据 */
const fnInit = async (studentShopId: string, refresh?: string) => {
    /** 判断是否有校园店ID 如果有直接获取店铺基础信息，没有则获取校园店ID 再获取店铺基础信息 并加店铺ID缓存到本地 */
    shopInfo.value = (await getShopInfo(studentShopId)) || {};

    /** 公告显示 */
    if (shopInfo.value.proclamationInfo) {
        notice.value.push(shopInfo.value.proclamationInfo.content);
    }
    /** 获取模块排序 */
    moduleList.value = (await getShopIndexModuleList(studentShopId)).list || [];
    /** 获取banner模块 */
    bannerList.value = (await getBannerList(studentShopId)).list || [];
    init.value = true;

    /** 获取本店商品 */
    if (!refresh) {
        loadList(goodsListParams.value);
    }
    /** 是否显示领券弹窗  一下逻辑是是否有弹过窗*/
    let couponNotifyArray = JSON.parse(localStorage.get('isCouponNotify') || '[]');

    let isReceiveSaleLeadCoupon = couponNotifyArray.includes(
        saleLeadStudentCouponNo.value + '' + studentShopId || ''
    );

    if (saleLeadStudentCouponNo.value && !isReceiveSaleLeadCoupon) {
        const res = await getSaleLeadCouponInfo(saleLeadStudentCouponNo.value);
        if (res.couponInfo === null || res.couponInfo.studentCouponStatus !== 0) return;
        showCouponNotify.value = true;
        uni.hideTabBar();
        couponNotifyInfo.value = res.couponInfo;
    }
};
const fnInit2 = async (studentShopId: string) => {
    /** 获取新人券模块 */
    newCouponList.value = await getNewFansCoupon(studentShopId);

    /** 获取新人专区的商品 */
    newCouponGoods.value = (
        await getNewPersonGoodsList({ scrollId: '', size: 2, studentShopId })
    ).list;

    /** 获取宫格 */
    gridList.value = (await getGridList()).list;

    /** 获取分类列表 */
    categoryList.value = (await getCategoryList(studentShopId)).list;
    categoryList.value.forEach((item, index) => {
        item.isActive = index === 0 ? true : false;
    });
    /** 获取本店推荐商品 */
    recommendList.value = (await getRecommendGoodsList(studentShopId)).list;
    /** 获取金刚区 */
    jinGangList.value = (await getJinGangArea()).list;
};

/** 关闭公告 */
const closeNotice = () => {
    showNotice.value = false;
};
const fnSort = (item: ICategoryList, index: number) => {
    goodsListParams.value = {
        ...goodsListParams.value,
        categoryId: item.categoryId
    };
    scrollInto.value = 'item' + index;
};

/** 显示分类 */

const showCategory = (show: boolean) => {
    showCategoryPopup.value = show;
};

/** 关闭领券通知 */
const closeCouponNotify = () => {
    /** 存入券id+studentShopId */
    let isCouponNotify: any = localStorage.get('isCouponNotify');
    let saleLeadKey = saleLeadStudentCouponNo.value + '' + studentShopId.value;
    let saleLeadKeyArr = [];

    if (isCouponNotify) {
        saleLeadKeyArr = JSON.parse(isCouponNotify);
        saleLeadKeyArr.push(saleLeadKey);
        localStorage.set('isCouponNotify', JSON.stringify(saleLeadKeyArr));
    } else {
        saleLeadKeyArr.push(saleLeadKey);
        localStorage.set('isCouponNotify', JSON.stringify(saleLeadKeyArr));
    }
    showCouponNotify.value = false;
    uni.showTabBar();
};
/** 取消授权 */

const cancelAuth = async () => {
    try {
        await WxDeny();

        userStore.updateUserInfo();
        showAuthCover.value = false;
        uni.showTabBar();
    } catch (err) {
        console.error(err);
    }
};

/** 确定授权 */
const confirmAuth = async (params: IWxUserParams) => {
    try {
        uni.getFileInfo({
            filePath: params.avatarUrl,
            success: async ({ size, digest, errMsg }) => {
                const res = (await uploadImage(params.avatarUrl, size)) || '';
                await WxSync({ avatarUrl: res.url, nickName: params.nickName });
                showAuthCover.value = false;
                uni.showTabBar();
                userStore.updateUserInfo();
            }
        });
    } catch (err) {
        console.error(err);
    }
};

/** 下拉刷新 */

onPullDownRefresh(async () => {
    await fnInit(studentShopId.value, 'refresh');
    await fnInit2(studentShopId.value);
    goodsListParams.value = {
        ...goodsListParams.value,
        sortType: '',
        sortField: '',
        categoryId: ''
    };
    scrollInto.value = 'item0';
    uni.stopPullDownRefresh();
});

/** 加载 */

onReachBottom(async () => {
    await loadList(goodsListParams.value);
});
</script>

<template>
    <homeSkeleton v-if="!init" />

    <view
        v-else
        class="page-warp"
        :style="{ paddingTop: pagePaddingTop + 'px' }"
    >
        <view class="loading-box">
            <image
                class="loading-icon"
                :src="loadingIcon"
                mode="scaleToFill"
            />
        </view>
        <!-- 头部 -->
        <view
            class="page-head"
            :style="{ zIndex: showShopInfoPopup ? 99 : 101 }"
        >
            <header-bar
                :student-shop-id="studentShopId"
                :current-theme="currentTheme"
                :shop-info="shopInfo"
                @show-shop-info="showShopInfoPopup = true"
            ></header-bar>
        </view>
        <!-- 公告 -->
        <zd-notice-bar
            v-if="notice.length && showNotice"
            :color="currentTheme.noticeBar.color"
            :background="currentTheme.noticeBar.background"
            :content-list="notice"
            @close="closeNotice"
        ></zd-notice-bar>
        <view
            v-for="(module, mindex) in moduleList"
            :key="mindex"
        >
            <!-- banner -->

            <view
                v-if="module.status == 1 && module.type == 'banner' && bannerList.length"
                class="banner-warp"
            >
                <banner
                    :list="bannerList"
                    :interval="2000"
                    :student-shop-id="studentShopId"
                ></banner>
            </view>
            <!-- 新人专享 -->
            <jing-gang
                v-if="module.status == 1 && module.type == 'banner' && jinGangList.length"
                :list="jinGangList"
                :student-shop-id="studentShopId"
            ></jing-gang>
            <new-exclusive
                v-if="
                    module.status == 1 &&
                    module.type == 'newPerson' &&
                    shopInfo?.showNewPerson &&
                    (newCouponList || newCouponGoods.length)
                "
                :student-shop-id="studentShopId"
                :current-theme="currentTheme"
                :new-fans-coupon="newCouponList"
                :goods-list="newCouponGoods"
            ></new-exclusive>
            <!-- 宫格 -->
            <grid
                v-if="module.status == 1 && module.type == 'gridLayout' && gridList.length"
                :grid-list="gridList"
                :current-theme="currentTheme"
                :student-shop-id="studentShopId"
            ></grid>
            <view
                v-if="module.status == 1 && module.type == 'recommend' && recommendList.length"
                class="recommend-top-set"
                :style="{ height: gridList.length == 3 ? '20rpx' : '0' }"
            >
            </view>
            <!-- 本店推荐 -->
            <view
                v-if="module.status == 1 && module.type == 'recommend' && recommendList.length"
                class="recommend-box"
            >
                <recommend-goods
                    v-if="module.status == 1 && module.type == 'recommend' && recommendList.length"
                    :list="recommendList"
                ></recommend-goods>
            </view>
        </view>
        <waterfall-warp
            ref="waterfallRef"
            :list="dataList"
            :category-list="categoryList"
            :show-category-popup="showCategoryPopup"
            :scroll-into="scrollInto"
            :student-shop-id="studentShopId"
            @on-sort="fnSort"
            @show-category="showCategory"
        ></waterfall-warp>

        <view
            v-if="loadText && dataList.length"
            class="loadText"
        >
            {{ loadText }}
        </view>
    </view>
    <shop-info-popup
        :shop-info="shopInfo"
        :show="showShopInfoPopup"
        @close-shop-info-popup="showShopInfoPopup = false"
    ></shop-info-popup>
    <category-bar
        :show="showCategoryPopup"
        :category-list="categoryList"
        @close-category-bar="showCategory"
        @on-sort="fnSort"
    ></category-bar>
    <coupon-notify
        v-if="showCouponNotify"
        :coupon-notify-info="couponNotifyInfo"
        :name="shopInfo?.studentShopUser.trueName"
        @close="closeCouponNotify"
    ></coupon-notify>
    <authorize-cover
        v-if="showAuthCover"
        @close="cancelAuth"
        @confirm="confirmAuth"
    ></authorize-cover>
</template>

<style lang="scss" scoped>
.page-warp {
    display: flex;
    width: 750rpx;
    height: 100%;
    background: #f5f8fa;
    flex-direction: column;
}
.page-head {
    position: fixed;
    top: 0;
    left: 0;
}
.banner-warp {
    display: flex;
    justify-content: center;
    width: 750rpx;
    margin-top: 30rpx;
    flex-direction: row;
}

.loadText {
    width: 750rpx;
    height: 114rpx;
    text-align: center;
    color: $uni-color-paragraph;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 114rpx;
    background: #f5f8fa;
}

.recommend-box {
    overflow: hidden;
    width: 750rpx;
    background: #f5f8fa;
}
.loading-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 750rpx;
    height: 100rpx;
}
.loading-icon {
    width: 36rpx;
    height: 36rpx;
}
.recommend-top-set {
    width: 750rpx;
    background: #f5f8fa;
}
</style>
