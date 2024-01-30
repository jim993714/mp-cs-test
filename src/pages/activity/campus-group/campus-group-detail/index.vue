<script setup lang="ts">
import { router, storage } from '@zsdx/mp-utils';

import { checkJoinGroup, getSchoolDumplingDetail } from '@/api/activity/campus-group/index';
import type {
    ISchoolDumplingDetail,
    ISchoolDumplingDetailParams
} from '@/api/activity/campus-group/type';
import studentAuthPop from '@/components/student-auth-pop/index.vue';

import goodsItem from './components/goods-item.vue';
import headerBar from './components/header-bar.vue';
import teamItem from './components/team-item.vue';

const studentAuth = ref();
const localStorage = storage();
const showTabBar = ref(false);
const isLogin = ref(localStorage.get('isLogin'));
const detailData = ref<ISchoolDumplingDetail>();
const params = ref<ISchoolDumplingDetailParams>({
    activityNo: '',
    schoolDumplingId: ''
});
const studentShopId = ref('');
const channel = ref(false);
onLoad((options: any) => {
    studentShopId.value = localStorage.get('studentShopId') || '';
    params.value.activityNo = options.activityNo || '';
    params.value.schoolDumplingId = options.schoolDumplingId || '';
    channel.value = getCurrentPages().length == 1 ? true : false;
});

onShow(() => {
    initData();
    isLogin.value = localStorage.get('isLogin');
});
const initData = async () => {
    try {
        detailData.value = await getSchoolDumplingDetail(params.value);
    } catch (err) {
        console.error(err);
    }
};
/** 参团或邀请 */
const onClick = async (type: string) => {
    try {
        if (!isLogin.value) {
            return router.push('login');
        }
        if (detailData.value?.needStudentVerify) {
            const auth = await studentAuth.value.validate();
            if (!auth) return;
        }
        const isJoin = await checkJoinGroup(params.value);
        console.log(isJoin, 'isJoin');
        if (type === 'openGroup' && isJoin) {
            //TODO 跳转商品详情进行购买参团
            goGoodsDetail();
        }
    } catch (error: any) {
        console.error(error);
        uni.showToast({
            icon: 'none',
            title: error.msg
        });
    }
};
const goGoodsDetail = async () => {
    router.push('goodsDetail', {
        goodsNo: detailData?.value?.goodsNo,
        activityNo: detailData?.value?.activityNo,
        schoolDumplingId: detailData?.value?.schoolDumplingId
    });
};
/** 下拉刷新 */

onPullDownRefresh(async () => {
    uni.stopPullDownRefresh();
    initData();
});

/**  页面滚动 */

onPageScroll(e => {
    showTabBar.value = e.scrollTop >= 40;
});

onShareAppMessage(() => {
    return {
        title: '欢迎来到我的校园店～',
        path:
            '/pages/activity/campus-group/campus-group-detail/index?studentShopId=' +
            studentShopId.value +
            '&activityNo=' +
            params.value.activityNo +
            '&schoolDumplingId=' +
            params.value.schoolDumplingId
    };
});
onShareTimeline(() => {
    return {
        title: '欢迎来到我的校园店～',
        query: `studentShopId=${studentShopId.value}'&activityNo=${params.value.activityNo}&schoolDumplingId=${params.value.schoolDumplingId}`
    };
});
</script>

<template>
    <view class="page-warp">
        <header-bar
            :show-fix-set="showTabBar"
            :channel="channel"
        ></header-bar>
        <image
            class="head-banner"
            src="https://cdn.zsdx.cn/mp-cs/images/activity/campus-group/banner.png"
            mode="widthFix"
        />
        <view class="goods-item-warp">
            <goods-item
                :data="detailData"
                @on-click="onClick"
            ></goods-item>
        </view>
        <view class="team-item-warp">
            <team-item
                :data="detailData"
                :student-shop-id="studentShopId"
                @time-end="initData"
                @on-click="onClick"
            ></team-item>
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
    width: 750rpx;
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
.goods-item-warp {
    position: relative;
    width: 750rpx;
    padding: 40rpx 40rpx 30rpx;
    box-sizing: border-box;
}
.team-item-warp {
    position: relative;
    width: 750rpx;
    padding: 0 40rpx;
    box-sizing: border-box;
}
</style>
