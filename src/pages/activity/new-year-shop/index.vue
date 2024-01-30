<script setup lang="ts">
import dayjs from 'dayjs';

import { getGoodsList } from '@/api/activity/new-year-shop';
import { getSystemTime } from '@/api/common';
import { useUserStore } from '@/stores/user';
import definePageProps from '@/utils/definePageProps';
import { router } from '@/utils/router/useRouter';

import CategroyList from './components/categroy-list.vue';
import GoodsCard from './components/goods-card.vue';
import PageHeader from './components/header.vue';
import WelcomePopup from './components/welcome-popup.vue';

const categroyListRef = ref<typeof CategroyList | null>(null);
const list = ref<any[]>([]);
const scrollId = ref('');
const showBg = ref(false);
const timeRange = ref<[number, number]>();
const refreshTimestamp = ref<number>(0);
const customerNo = ref('');
const popupVisible = ref(false);

const systemTime = ref<number>(0);
const scrollTop = ref(0);
const bannerMap = ref({ bg: '', fg: '' });

const userStore = useUserStore();
const { isLogin } = toRefs(userStore);

// 用户登录信息变化后，重新加载页面
watch(isLogin, () => {
    getList(true);
});

const props = definePageProps<{
    activityNo: string;
}>(() => {
    getList(true);
});

function initShare() {
    return {
        path: `/pages/activity/new-year-shop/index?activityNo=` + props.value?.activityNo,
        title: '欢迎来到我的校园店～'
    };
}

/** 强制刷新 */
function refresh() {
    refreshTimestamp.value = new Date().getTime();
    setTimeout(() => {
        getList(true);
        refreshTimestamp.value = 0;
    }, 200);
}

async function getTime() {
    const resp = await getSystemTime();
    systemTime.value = resp;
}

async function getList(init = false) {
    await getTime();
    if (init) {
        scrollId.value = '';
        list.value = [];
    }
    if (scrollId.value === 'null') return;
    const resp = await getGoodsList({
        activityNo: props.value?.activityNo ?? '',
        size: 10,
        scrollId: scrollId.value,
        customNo: customerNo.value
    });

    if (init) {
        list.value = resp.list || [];
    } else {
        list.value = [...list.value, ...(resp.list || [])];
    }
    scrollId.value = resp.scrollId || 'null';
    timeRange.value = [resp.startTime * 1000, resp.endTime * 1000];
    bannerMap.value = {
        bg: resp.cbackGroundImg,
        fg: resp.cthemeImg
    };
    uni.stopPullDownRefresh();
}

function handleCategroyChange(id: string) {
    customerNo.value = id;
    getList(true);
}

const countDownType = computed(() => {
    if (!systemTime.value || !timeRange.value) return false;
    if (systemTime.value > timeRange.value[0] && systemTime.value < timeRange.value[1]) {
        return {
            type: '距结束',
            time: timeRange.value[1]
        };
    } else if (systemTime.value < timeRange.value[0]) {
        return {
            type: '距开始',
            time: timeRange.value[0]
        };
    } else {
        return false;
    }
});

/**
 * 倒计时
 * @param endTime
 */
function filterCountDown(endTime: number) {
    let delta = (endTime - new Date(systemTime.value).getTime()) / 1000 + 1;

    const day = Math.floor(delta / 86400);
    delta = delta - day * 86400;
    const hour = Math.floor(delta / 3600);
    delta = delta - hour * 3600;
    const minute = Math.floor(delta / 60);
    const second = delta - minute * 60;

    return {
        showDay: day > 0,
        day,
        hour,
        minute,
        second
    };
}

function toRule() {
    router.push('activityRules', {
        type: 'NEW_YEAR_SHOP',
        params: {
            activityNo: props.value?.activityNo
        }
    });
}

function backTop() {
    uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
    });
}

onPageScroll(e => {
    if (e.scrollTop >= 40) {
        showBg.value = true;
        uni.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#f5f8fa'
        });
    } else {
        showBg.value = false;
        uni.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#f5f8fa'
        });
    }

    scrollTop.value = e.scrollTop;
});

/** pull down refresh */
onPullDownRefresh(() => {
    // getTimeList();
    getList(true);
});

/** loadmore */
onReachBottom(() => {
    getList();
});
onShareAppMessage(initShare);
onShareTimeline(initShare);
</script>
<script lang="ts">
export default {
    options: {
        styleIsolation: 'shared'
    }
};
</script>
<template>
    <page-meta :page-style="'overflow:' + (popupVisible ? 'hidden' : 'visible')"></page-meta>
    <view class="header-wrapper">
        <image
            class="bg-image"
            :src="bannerMap.bg || 'http://cdn.zsdx.cn/mp-cs/images/activity/new-year-shop/bg.png'"
            mode="scaleToFill"
        ></image>
        <page-header
            :show-bg="showBg"
            :activity-no="props?.activityNo!"
        />
        <view class="banner">
            <view
                class="rule-enter"
                @tap="toRule"
            >
                规则
            </view>
            <image
                class="banner-image"
                :src="
                    bannerMap.fg ||
                    'http://cdn.zsdx.cn/mp-cs/images/activity/new-year-shop/banner.png'
                "
                mode="scaleToFill"
            ></image>
            <view
                v-if="countDownType"
                class="countdown-wrapper"
            >
                {{ countDownType.type }}
                <uni-countdown
                    v-if="refreshTimestamp === 0"
                    style="margin-left: 10rpx"
                    background-color="rgba(0,0,0,0.1)"
                    splitor-color="#fff"
                    color="#fff"
                    :font-size="14"
                    v-bind="filterCountDown(countDownType.time)"
                    @timeup="refresh"
                />
            </view>
        </view>
    </view>
    <view class="content">
        <CategroyList
            ref="categroyListRef"
            :activity-no="props?.activityNo!"
            @visible="v => (popupVisible = v)"
            @change="handleCategroyChange"
        />
        <goods-card
            v-for="(item, index) in list"
            :key="index"
            :index="index"
            :item="item"
            :system-time="systemTime"
        />
        <view
            v-if="list?.length > 0"
            class="bottom savepadding"
        >
            - 到底了 -
        </view>

        <zd-empty
            v-if="
                list?.length === 0 &&
                scrollId === 'null' &&
                new Date().getTime() < (timeRange?.[1] ?? 0)
            "
            :image-width="450"
            :image-height="280"
            image="http://cdn.zsdx.cn/mp-cs/images/activity/new-year-shop/empty-1.png"
            description="商品正在马不停蹄地赶来哦～"
        />
        <zd-empty
            v-if="
                list?.length === 0 &&
                scrollId === 'null' &&
                new Date().getTime() > (timeRange?.[1] ?? 0)
            "
            :image-width="450"
            :image-height="280"
            image="http://cdn.zsdx.cn/mp-cs/images/activity/new-year-shop/empty-1.png"
            description="你来晚啦，活动已结束～"
        />
    </view>

    <WelcomePopup
        :start-time="dayjs(timeRange?.[0]).format('M月D日 HH:mm')"
        :end-time="dayjs(timeRange?.[1]).format('M月D日 HH:mm')"
    />
    <view
        v-if="scrollTop > 200"
        class="back-top"
        @tap="backTop"
    >
        <zd-icon
            type="zdmp-zhiding"
            :size="36"
            color="#333"
        ></zd-icon>
    </view>
    <view
        v-if="popupVisible"
        style="height: 2000rpx"
    ></view>
</template>

<style lang="scss">
page {
    background-color: #f5f8fa;
}
</style>
<style scoped lang="scss">
.header-wrapper {
    position: relative;
    height: 600rpx;
    background: linear-gradient(180deg, #ffec97 0%, rgba(255, 235, 151, 0) 100%);
    .bg-image {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
        width: 750rpx;
        height: 600rpx;
    }
}
.banner {
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: column;
    margin-top: 18rpx;
    .banner-image {
        width: 750rpx;
        height: 240rpx;
    }
    .rule-enter {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 100;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 84rpx;
        height: 48rpx;
        border-radius: 62rpx 0rpx 0rpx 62rpx;
        color: #fff;
        font-size: 24rpx;
        background: rgba(0, 0, 0, 0.4);
    }
    .countdown-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 432rpx;
        height: 60rpx;
        margin-top: 30rpx;
        color: #fff;
        font-size: 24rpx;
        background-position: 0% 0%;
        background-repeat: no-repeat;
        background-size: 100% 99%;
        background-image: url(http://cdn.zsdx.cn/mp-cs/images/activity/new-year-shop/count-down-bg-2.png);
    }
}
.content {
    position: relative;
    z-index: 10;
    margin-top: -40rpx;
    padding: 20rpx;
    padding-top: 10rpx;
    border-radius: 40rpx 40rpx 0rpx 0rpx;
    background-color: #f5f8fa;
}
.bottom {
    text-align: center;
    color: #ccc;
    font-size: 24rpx;
}
.back-top {
    position: fixed;
    right: 20rpx;
    bottom: 50rpx;
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 72rpx;
    height: 72rpx;
    border: 4rpx solid #f5f8fa;
    border-radius: 36rpx;
    background-color: #fff;
    box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(19, 20, 48, 0.1);
}
</style>
