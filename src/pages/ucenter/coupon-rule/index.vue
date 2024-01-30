<script setup lang="ts">
import { article } from './constants';
</script>

<template>
    <scroll-view
        scroll-y
        class="article"
    >
        <view
            v-for="(item, i) in article"
            :key="i"
            class="article-paragraph"
        >
            <view class="article-paragraph-p"> {{ item.p }} </view>
            <view
                v-for="(subItem, j) in item.text"
                :key="j"
                class="article-paragraph-text"
            >
                {{ subItem }}
            </view>
        </view>
    </scroll-view>
</template>

<style scoped lang="scss">
.article {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: 100vh;
    padding-bottom: calc(env(safe-area-inset-bottom));
    background: $uni-text-color-inverse;

    &-paragraph {
        margin: 20rpx 20rpx 10rpx 20rpx;
        padding: 30rpx 20rpx;
        border-radius: 12rpx;
        background: #fff;
        box-sizing: border-box;

        &-p {
            margin-bottom: 20rpx;
            color: $uni-color-title;
            font-size: 28rpx;
            font-weight: 500;
            line-height: 28rpx;
        }

        &-text {
            color: #576066;
            font-size: 28rpx;
            font-weight: 400;
            line-height: 40rpx;
        }
    }
}
</style>
