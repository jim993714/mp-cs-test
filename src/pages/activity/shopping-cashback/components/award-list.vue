<script setup lang="ts">
import type { RankItem as RankItemTypes } from '@/api/activity/shopping-cashback/types';
import { CDN_BASE_URL } from '@/base/constants';

import RankItem from './rank-item.vue';

const props = defineProps<{
    list: RankItemTypes[];
    loadText?: string;
}>();
</script>

<template>
    <view class="award-list">
        <view class="title"> 获奖名单 </view>

        <view
            v-if="props.list.length"
            class="rank-list"
        >
            <view class="list-header">
                <view class="list-header-item rank">排名</view>
                <view class="list-header-item user">用户信息</view>
                <view class="list-header-item award">奖励金额</view>
            </view>

            <RankItem
                v-for="(item, i) in props.list"
                :key="i"
                :info="item"
            />
        </view>

        <zd-empty
            v-else
            :image-width="450"
            :image-height="250"
            :top="120"
            :image="`${CDN_BASE_URL}/mp-cs/images/activity/shopping-cashback/empty.png`"
        >
            <template #description>
                <view class="empty-tips"> 暂无获奖信息哦~ </view>
            </template>
        </zd-empty>
    </view>
    <view class="load-text">
        {{ props.loadText }}
    </view>
</template>

<style lang="scss" scoped>
.award-list {
    width: 702rpx;
    min-height: 670rpx;
    padding: 48rpx 36rpx 20rpx;
    border-radius: 20rpx;
    background: #ffffff;
    box-sizing: border-box;

    .title {
        position: relative;
        text-align: center;
        color: $uni-text-color;
        font-size: 32rpx;
        font-weight: 600;
        line-height: 32rpx;

        &::before,
        &::after {
            position: absolute;
            top: 50%;
            width: 68rpx;
            height: 8rpx;
            border-radius: 4rpx;
            content: '';
            transform: translateY(-50%);
        }

        &::before {
            left: 158rpx;
            background: linear-gradient(270deg, #ff8026 0%, rgba(255, 128, 38, 0) 100%);
        }

        &::after {
            right: 158rpx;
            background: linear-gradient(90deg, #ff8026 0%, rgba(255, 128, 38, 0) 100%);
        }
    }

    .rank-list {
        .list-header {
            display: flex;
            align-items: flex-end;
            height: 84rpx;
            padding-bottom: 20rpx;
            background: #ffffff;
            box-sizing: border-box;

            &-item {
                color: $uni-text-color;
                font-size: 24rpx;
                font-weight: 500;
                line-height: 24rpx;
            }

            .rank {
                width: 88rpx;
            }
            .user {
                flex: 1;
            }
            .award {
                width: 150rpx;
                text-align: right;
                flex-shrink: 0;
            }
        }
    }
}

.empty-tips {
    margin-top: 26rpx;
    color: #606972;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 28rpx;
}

.load-text {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 114rpx;
    color: $uni-color-paragraph;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 34rpx;
}
</style>
