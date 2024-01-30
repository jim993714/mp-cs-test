<script setup lang="ts">
import type { RankItem } from '@/api/activity/shopping-cashback/types';
import { CDN_BASE_URL } from '@/base/constants';

const props = defineProps<{
    info: RankItem;
}>();

const { info } = toRefs(props);
</script>

<template>
    <view class="rank-item">
        <view class="rank">
            <image
                v-if="info.rank <= 3"
                class="rank-icon"
                :src="`${CDN_BASE_URL}/mp-cs/images/activity/shopping-cashback/rank${info.rank}.png`"
                mode="aspectFill"
            />
            <view
                v-else
                class="rank-text"
            >
                {{ info.rank < 10 ? `0${info.rank}` : info.rank }}
            </view>
        </view>
        <view class="user-info">
            <image
                class="avatar"
                :src="info.headImg"
                mode="aspectFill"
            />
            <view class="user-info-main">
                <view class="username ellipsis">{{ info.nikeName }}</view>
                <view class="user-school ellipsis">{{ info.college }}</view>
            </view>
        </view>
        <view class="award"> {{ info.rewardDivide }}元 </view>
    </view>
</template>

<style lang="scss" scoped>
.rank-item {
    display: flex;
    align-items: center;
    height: 112rpx;
    background: #ffffff;
    box-sizing: border-box;

    .rank {
        display: flex;
        align-items: center;
        width: 88rpx;

        .rank-icon {
            width: 64rpx;
            height: 63rpx;
        }
        .rank-text {
            margin-left: 14rpx;
            color: $uni-color-paragraph;
            font-size: 28rpx;
            font-weight: 500;
            line-height: 28rpx;
        }
    }

    .user-info {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 16rpx;

        .avatar {
            width: 72rpx;
            height: 72rpx;
            border-radius: 50%;
        }

        &-main {
            display: flex;
            flex-direction: column;
            gap: 14rpx;
            flex: 1;

            .username {
                max-width: 300rpx;
                color: $uni-text-color;
                font-size: 26rpx;
                font-weight: 500;
                line-height: 28rpx;
            }

            .user-school {
                max-width: 300rpx;
                color: $uni-color-paragraph;
                font-size: 20rpx;
                font-weight: 400;
                line-height: 20rpx;
            }
        }
    }

    .award {
        width: 150rpx;
        text-align: right;
        color: $uni-text-color;
        font-size: 24rpx;
        font-weight: 500;
        line-height: 28rpx;
    }
}
</style>
