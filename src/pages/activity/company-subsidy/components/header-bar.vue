<script lang="ts" setup>
import { router } from '@zsdx/mp-utils';

import { generateTrackSearchSession } from '@/utils/track/search';

const props = defineProps({
    showFixSet: {
        type: Boolean,
        default: false
    },
    bgImg: {
        type: String,
        default: ''
    },
    activityNo: {
        type: String,
        default: ''
    },
    params: {
        type: Object,
        default() {
            return {};
        }
    },
    init: {
        type: Boolean,
        default: false
    },
    fixBackground: {
        type: String,
        default: '#fffffff'
    },
    channel: {
        type: Boolean,
        default: false
    }
});
const searchSession = generateTrackSearchSession();
const back = () => {
    if (props.channel) {
        router.switchTab('home');
    } else {
        router.back();
    }
};
const goSearch = () => {
    if (props.init) {
        router.push('search', {
            to: 'searchResult',
            __trackSearchSession: searchSession,
            activityNo: props.activityNo
        });
    }
};
const goRule = () => {
    router.push('activityRules', { params: props.params, type: 'SUMMER_ZONE' });
};
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0;
</script>
<template>
    <zd-header
        class="header-warp"
        :height="480"
        :capsule="true"
        :bg-img="props.bgImg"
        :fix-background="props.showFixSet ? props.fixBackground : ''"
        :show-fixed="true"
    >
        <template #fix-set>
            <mp-sticky
                :offset-top="statusBarHeight"
                :z-index="9"
            >
                <view class="search-box">
                    <view
                        class="header-left"
                        @tap.prevent="back"
                    >
                        <zd-icon
                            v-if="!props.channel"
                            type="zdmp-fanhui"
                            color="#000000"
                            :size="32"
                            @tap.prevent="back"
                        ></zd-icon>
                        <zd-icon
                            v-else
                            class="go-home"
                            type="zdmp-huidaoshouye"
                            color="#fff"
                            :size="40"
                        ></zd-icon>
                    </view>
                    <track-view
                        :track-data="{
                            type: 'click',
                            eventData: {
                                path: 'bi_search',
                                search_session: searchSession
                            },
                            clickData: {
                                action: 1
                            }
                        }"
                    >
                        <view
                            class="search"
                            @tap="goSearch"
                        >
                            <view class="search-icon">
                                <zd-icon
                                    type="zdmp-sousuo1"
                                    :size="32"
                                    color="#8a9399"
                                ></zd-icon>
                            </view>
                            <text class="search-text">输入商品的名称</text>
                        </view>
                    </track-view>
                </view>
            </mp-sticky>
        </template>
        <template #header-bottom>
            <view
                class="rule-warp"
                :style="{ top: 5 + 'px' }"
                @tap.prevent="goRule"
            >
                <image
                    class="rule-icon"
                    src="https://cdn.zsdx.cn/mp-cs/images/activity/company-subsidy/rule-icon.png"
                    mode="aspectFill"
                ></image>
                <text class="rule-text">规则</text>
            </view>
        </template>
    </zd-header>
</template>
<style lang="scss" scoped>
.header-warp {
    overflow: hidden;
    width: 750rpx;
}
.header-left {
    margin: 0 28rpx 0 24rpx;
}
.search-box {
    display: flex;
    align-items: center;
    margin-top: 6rpx;
}

.search {
    display: flex;
    align-items: center;
    width: 430rpx;
    height: 64rpx;
    padding-left: 30rpx;
    border-radius: 32rpx;
    background: #ffffff;
    flex-direction: row;
    .search-icon {
        margin-right: 20rpx;
    }
    .search-text {
        color: #8a9399;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 28rpx;
    }
}

.rule-warp {
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
    width: 116rpx;
    height: 48rpx;
    padding-left: 16rpx;
    border-radius: 62rpx 0 0 62rpx;
    background: rgba(0, 0, 0, 0.4);
    flex-direction: row;
    .rule-icon {
        width: 32rpx;
        height: 32rpx;
    }

    .rule-text {
        margin-left: 4rpx;
        color: #ffffff;
        font-size: 24rpx;
        font-weight: 400;
    }
}
</style>
