<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { getMessageCount } from '@/api/message';
import { type ChatItem, type MessageType, TopStatus } from '@/api/message/types';
import { BASE_URL, CDN_BASE_URL } from '@/base/constants';

import MessageCell from './components/message-item/index.vue';
import { tabs } from './constants';

const counts = ref<(string | number)[]>(['', '']);
const dataList = ref<ChatItem[]>([]);
const params = ref({});
let isInit = false;

function gotoCommonList(type: MessageType) {
    router.push('commonList', {
        type
    });
}

function onTop(messageId: number, topStatus: TopStatus) {
    let _dataList = dataList.value;

    _dataList.some((item, i) => {
        if (item.latestMsg.msgId === messageId) {
            item.topStatus = topStatus;
            if (topStatus === TopStatus.Top) {
                _dataList.splice(i, 1);
                _dataList.splice(0, 0, item);
            } else {
                _dataList = [
                    ..._dataList.filter(item => item.topStatus),
                    ..._dataList
                        .filter(item => !item.topStatus)
                        .sort((a, b) => b.msgTime - a.msgTime)
                ];
            }
            return true;
        }
    });
    dataList.value = [..._dataList];
}

function onDelete(messageId: number) {
    dataList.value.some((item, i) => {
        if (item.latestMsg.msgId === messageId) {
            dataList.value.splice(i, 1);
            return true;
        }
    });

    dataList.value = [...dataList.value];
}

onShow(async () => {
    if (isInit) {
        params.value = {};
    } else {
        isInit = true;
    }

    const data = await getMessageCount();
    let logisticsMessage: number | string = data.logisticsMessage || '';
    let systemMessage: number | string = data.systemMessage || '';
    if (data.logisticsMessage > 99) {
        logisticsMessage = '99+';
    }
    if (data.systemMessage > 99) {
        systemMessage = '99+';
    }

    counts.value = [systemMessage, logisticsMessage];
});
</script>

<template>
    <view class="message">
        <view class="message-header">
            <view
                v-for="tab in tabs"
                :key="tab.value"
                :style="{ background: tab.color }"
                class="message-header-item"
                @tap="gotoCommonList(tab.value)"
            >
                <image :src="tab.icon" />
                <view
                    v-if="counts[tab.value]"
                    class="message-header-item-badge"
                    >{{ counts[tab.value] }}</view
                >
                {{ tab.label }}
            </view>
        </view>
        <zd-list
            v-model="dataList"
            :open-refresh="true"
            :show-scrollbar="false"
            :params="params"
            :enhanced="false"
            url="/student-school-shop/message/getChatList"
            height="calc(100% - 224rpx)"
        >
            <template #default="{ item }">
                <MessageCell
                    :item="item"
                    @top="onTop"
                    @delete="onDelete"
                />
            </template>
            <template #empty>
                <zd-empty
                    :image-width="450"
                    :image-height="250"
                    :image="CDN_BASE_URL + '/mp-cs/images/ucenter/empry-address.png'"
                    description="暂无聊天内容哦~"
                />
            </template>
        </zd-list>
    </view>
</template>

<style scoped lang="scss">
.message {
    width: 100%;
    height: 100vh;
    background: $uni-text-color-inverse;

    &-header {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 204rpx;
        margin-bottom: 20rpx;
        background: #fff;
        gap: 30rpx;

        &-item {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 22rpx 58rpx 22rpx 40rpx;
            border-radius: 16rpx;
            color: $uni-color-title;
            font-size: 28rpx;
            font-weight: 400;
            line-height: 24rpx;
            gap: 20rpx;

            image {
                width: 100rpx;
                height: 100rpx;
            }

            &-badge {
                position: absolute;
                top: 24rpx;
                left: 100rpx;
                min-width: 32rpx;
                height: 32rpx;
                margin-left: 10rpx;
                border: 2rpx solid #fff;
                border-radius: 18rpx;
                text-align: center;
                color: #fff;
                font-size: 20rpx;
                font-weight: 400;
                background: $zd-color-red;
                flex-grow: 0;
                flex-shrink: 0;
                line-height: 32rpx;
            }
        }
    }
}
</style>
