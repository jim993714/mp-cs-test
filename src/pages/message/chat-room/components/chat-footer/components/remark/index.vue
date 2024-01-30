<script setup lang="ts">
import { evaluateChatSession, getEvaluateChatSession } from '@/api/message';

import type { ResolveResType } from './constants';
import { resolveRes } from './constants';

const popup = ref();
let sessionNo = '';

defineExpose({
    open: async (params: { chatNo: string }) => {
        try {
            const { sessionNo: _sessionNo } = await getEvaluateChatSession({
                chatNo: params.chatNo
            });
            sessionNo = _sessionNo;
            popup.value.open();
        } catch (error) {
            uni.showToast({
                title: (error as any).msg,
                icon: 'none'
            });
        }
    }
});

const form = reactive({
    content: '',
    score: 0,
    solveStatus: 0
});

function onInput(event: any) {
    form.content = event.detail.value;
}

function onSelectStatus(val: ResolveResType) {
    form.solveStatus = val;
}

const disabled = computed(() => {
    if (form.content && form.solveStatus) {
        return false;
    }

    return true;
});

async function submit() {
    await evaluateChatSession({
        sessionNo,
        ...form
    });

    close();
}

function close() {
    popup.value.close();
}
</script>

<template>
    <zd-popup
        ref="popup"
        type="bottom"
    >
        <view class="remark">
            <view class="remark-header">
                请对本次服务进行评价
                <view
                    class="remark-header-close"
                    @tap="close"
                >
                    <zd-icon
                        type="zdmp-guanbidefuben"
                        :size="36"
                    />
                </view>
            </view>
            <view class="remark-rate">
                <text>进行评分</text>
                <uni-rate
                    v-model="form.score"
                    allow-half
                />
                <view
                    v-if="form.score"
                    class="remark-rate-score"
                >
                    {{ form.score }}
                </view>
            </view>
            <textarea
                v-model="form.content"
                :maxlength="200"
                class="remark-content"
                placeholder="请输入您的反馈意见"
                @input="onInput"
            >
            <view class="remark-content__num">
                {{ form.content.length }} / 200
            </view>
        </textarea
            >
            <view class="remark-rate">
                <text>您的问题</text>
                <view
                    v-for="item in resolveRes"
                    :key="item.value"
                    :class="{
                        'remark-rate-item': true,
                        'remark-rate-item__active': form.solveStatus === item.value
                    }"
                    @tap="onSelectStatus(item.value)"
                >
                    <zd-icon
                        type="zdmp-yijiejue"
                        :size="32"
                    />
                    {{ item.label }}
                </view>
            </view>
            <view class="remark-submit">
                <zd-button
                    type="primary"
                    :disabled="disabled"
                    @tap="submit"
                >
                    提交评价
                </zd-button>
            </view>
        </view>
    </zd-popup>
</template>

<style scoped lang="scss">
.remark {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: calc(1016rpx + calc(env(safe-area-inset-bottom)));
    padding: 40rpx 30rpx calc(env(safe-area-inset-bottom)) 30rpx;
    border-radius: 32rpx 32rpx 0rpx 0rpx;
    background: #fff;
    box-sizing: border-box;
    &-header {
        position: relative;
        width: 100%;
        text-align: center;
        color: $uni-text-color;
        font-size: 32rpx;
        font-weight: 500;
        line-height: 40rpx;

        &-close {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 0;
        }
    }

    &-rate {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        margin-top: 80rpx;
        color: $uni-text-color;
        font-size: 28rpx;
        font-weight: 500;
        gap: 40rpx;
        line-height: 28rpx;

        &-score {
            position: absolute;
            right: 0;
            color: $zd-color-orange;
            font-size: 48rpx;
            font-family: 'Bebas Neue';
            line-height: 48rpx;

            &::after {
                display: inline-block;
                color: $zd-color-orange;
                font-size: 28rpx;
                content: '分';
                line-height: 28rpx;
            }
        }

        > text::before {
            display: inline-block;
            vertical-align: bottom;
            content: '';
            width: 8rpx;
            height: 28rpx;
            margin-right: 20rpx;
            background: $zd-main-color;
        }

        &-item {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10rpx;
            width: 154rpx;
            height: 56rpx;
            border: 2rpx solid rgba($color: $zd-main-color, $alpha: 0.2);
            border-radius: 8rpx;
            color: $zd-main-color;
            font-size: 28rpx;
            font-weight: 400;
            background: #fff;
            line-height: 28rpx;

            &__active {
                border-color: $zd-main-color;
                color: #fff;
                background: $zd-main-color;
            }
        }
    }

    &-content {
        position: relative;
        width: 670rpx;
        height: 204rpx;
        margin-top: 40rpx;
        padding: 14rpx 20rpx 56rpx 20rpx;
        border: 2rpx solid $uni-text-color-disable;
        border-radius: 8rpx;
        background: #ffffff;
        box-sizing: border-box;

        :deep(.remark-content__num) {
            position: absolute;
            right: 20rpx;
            bottom: 16rpx;
            color: $uni-color-paragraph;
            font-size: 24rpx;
            font-weight: 400;
            line-height: 24rpx;
        }
    }

    &-submit {
        position: absolute;
        bottom: calc(env(safe-area-inset-bottom));
        left: 50%;
        transform: translateX(-50%);
        width: 670rpx;
        height: 80rpx;
    }
}
</style>
