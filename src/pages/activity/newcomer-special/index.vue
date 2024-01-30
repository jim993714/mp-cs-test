<script setup lang="ts">
import { useLoadMore } from '@zsdx/mp-material/dist/lib/hooks/useLoadmore';
import { router, storage } from '@zsdx/mp-utils';
import { ref } from 'vue';

import {
    checkPackage,
    getNewPersonCoupon,
    getNewPersonGoodsList,
    receiveNewCoupon
} from '@/api/activity/newcomer-special';
import type { ICouponList, IGoodsList, INewCoupon } from '@/api/activity/newcomer-special/types';
import headerFix from '@/components/header/header-fix.vue';
import studentAuthPop from '@/components/student-auth-pop/index.vue';

import headerBar from './components/header-bar.vue';
import receiveDialog from './components/receive-dialog.vue';

const store = storage();

const showFixSet = ref(false);
const isLogin = ref(store.get('isLogin'));
const studentShopId = ref('');
const newFansCoupon = ref({} as INewCoupon);
const packageCouponList = ref<Array<ICouponList>>([]);
const couponTimeout = ref();
const couponPackageModel = ref();
const studentAuth = ref();
const itemStyle = {
    background: 'transparent',
    width: '750rpx',
    borderRadius: 'none'
};
const params = ref({});
const contentStyle = {
    borderRadius: '16rpx'
};

const goodsConfig = {
    titleLine: '1',
    priceLabel: '市场价',
    btnBg: 'linear-gradient(135deg, #FF8F40 0%, #FF4734 100%)',
    showHeaderTag: true,
    fontSizeLarge: 40,
    fontSizeSmall: 28,
    fontSizeUnit: 20
};

const {
    dataList: newPersonList,
    loadList,
    reload,
    loadText
} = useLoadMore(getNewPersonGoodsList, list => list);
watch(
    () => params.value,
    (val, oldVal) => {
        if (val !== oldVal) {
            reload(params.value);
        }
    }
);
const dataList = computed(() => newPersonList.value);
onPageScroll(e => {
    showFixSet.value = e.scrollTop >= 80;
});

onLoad(() => {
    studentShopId.value = store.get('studentShopId') || '';
    initData();
});
const initData = async () => {
    try {
        await loadList(params.value);
        const data = await getNewPersonCoupon({ studentShopId: studentShopId.value });
        newFansCoupon.value = data || {};
    } catch (error) {
        console.log(error);
    }
};
const fnAccept = async () => {
    try {
        const auth = await studentAuth.value.validate();

        if (!auth) return;
        if (newFansCoupon.value.isSelf == 1) {
            return uni.showToast({
                title: '不能领取自己店铺的新人券',
                icon: 'none'
            });
        }
        if (newFansCoupon.value.isReceived) {
            return uni.showToast({
                title: '不可领取'
            });
        }

        if (couponTimeout.value) {
            clearTimeout(couponTimeout.value);
        }
        const data = await receiveNewCoupon({ studentShopId: studentShopId.value });
        if (data) {
            fnCheckPackage(data.ticket);
        }
    } catch (err: any) {
        if (err.code == 0) {
            uni.showToast({
                title: err.msg,
                icon: 'none'
            });
        }
    }
};

const fnCheckPackage = async (ticket: string, coupon?: INewCoupon) => {
    const data = await checkPackage({ ticket });
    if (data.result == 1) {
        newFansCoupon.value.isReceived = 1;
        newFansCoupon.value.receiveStatus = 2;
        packageCouponList.value = data.couponList || [];
        couponPackageModel.value.fnShow();
    } else if (data.result == 0) {
        couponTimeout.value = setTimeout(() => {
            fnCheckPackage(ticket, newFansCoupon.value);
        }, 1000);
    }
};

const goGoodsDetail = (item: any) => {
    router.push('goodsDetail', { goodsNo: item.goodsNo });
};
onShareAppMessage(() => {
    return {
        title: '欢迎来到我的校园店～',
        path: '/pages/activity/newcomer-special/index?studentShopId=' + studentShopId.value
    };
});

onShareTimeline(() => {
    return {
        title: '欢迎来到我的校园店～',
        query: `studentShopId=${studentShopId.value}`
    };
});

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
</script>

<template>
    <view class="page-warp">
        <view class="page-warp-box">
            <header-bar
                :new-fans-coupon="newFansCoupon"
                @fn-accept="fnAccept"
            ></header-bar>

            <template v-if="dataList.length">
                <view
                    v-for="(item, index) in (dataList as any)"
                    :key="index"
                    class="item-warp"
                >
                    <zd-goods-card
                        :item="item"
                        v-bind="{ ...goodsConfig }"
                        :item-style="itemStyle"
                        :content-style="contentStyle"
                        :price-label="item.platformStudentPriceStatus ? '学生价' : ''"
                        @click="goGoodsDetail(item)"
                    >
                        <template #tag>
                            <view class="goods-tags">
                                <text
                                    v-if="item.isFullCut == 1"
                                    class="goods-tags-one"
                                    >满减</text
                                >
                                <text
                                    v-if="item.activityType"
                                    class="goods-tags-two"
                                    >{{ item.activityType === 3 ? '大促' : '校园团' }}</text
                                >
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
        </view>
        <header-fix
            v-if="showFixSet"
            title="新人专享"
        ></header-fix>
        <view
            v-if="loadText && dataList.length"
            class="loadText"
        >
            {{ loadText }}
        </view>
        <receive-dialog
            ref="couponPackageModel"
            :coupon-list="packageCouponList"
        ></receive-dialog>
        <student-auth-pop
            v-if="isLogin"
            ref="studentAuth"
            content="未获取到你的学生认证记录，前往认证，认证成功后可享专属认证权益"
        ></student-auth-pop>
    </view>
</template>

<style lang="scss" scoped>
.page-warp {
    width: 750rpx;
    min-height: 100%;
    background-color: rgba(228, 0, 21, 1);
    .page-warp-box {
        width: 750rpx;
        height: 100%;
        background-color: rgba(228, 0, 21, 1);
    }
}
.item-warp {
    margin-bottom: 20rpx;
    background-color: transparent;
}
.empty-text {
    color: #ffffff;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 40rpx;
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

.goods-tags {
    display: flex;
    align-items: center;
    .goods-tags-one {
        padding: 10rpx;
        border-radius: 8rpx;
        color: #ff4734;
        font-size: 20rpx;
        font-weight: 500;
        background: rgba(255, 71, 52, 0.1);
        line-height: 20rpx;
    }
    .goods-tags-two {
        padding: 10rpx;
        border-radius: 8rpx;
        color: #ff8026;
        font-size: 20rpx;
        font-weight: 500;
        background: rgba(255, 128, 38, 0.1);
        line-height: 20rpx;
        line-height: 20rpx;
    }
}
::v-deep .goods-tag-warp {
    margin-top: 10rpx !important;
}
</style>
