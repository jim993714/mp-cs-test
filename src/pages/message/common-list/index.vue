<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';

import { type CommonMessageItem, MessageStatus, MessageType } from '@/api/message/types';
import { CDN_BASE_URL } from '@/base/constants';

import MessageItem from './components/message-item.vue';

let type = ref<MessageType>();
const dataList = ref<CommonMessageItem[]>([]);

onLoad(options => {
    type.value = +options?.type as MessageType;

    if (type.value === MessageType.Logistics) {
        uni.setNavigationBarTitle({
            title: '交易物流'
        });
    } else {
        uni.setNavigationBarTitle({
            title: '系统消息'
        });
    }
});

const emptyTip = computed(() => {
    return `暂无${type.value === MessageType.Logistics ? '交易物流' : '系统消息'}哦~`;
});

const params = computed(() => {
    return {
        type: type.value
    };
});

function uploadDataList(index: number) {
    dataList.value[index].status = MessageStatus.Click;
    dataList.value = [...dataList.value];
}
</script>

<template>
    <view class="common-list">
        <zd-list
            v-if="type !== undefined"
            v-model="dataList"
            :open-refresh="true"
            :show-scrollbar="false"
            :params="params"
            :enhanced="false"
            url="/student-school-shop/message/getMessageList"
        >
            <template #default="{ item, index }">
                <MessageItem
                    :item="item"
                    @already="uploadDataList(index)"
                />
            </template>
            <template #empty>
                <zd-empty
                    :image-width="450"
                    :image-height="250"
                    :image="CDN_BASE_URL + '/mp-cs/images/ucenter/empry-address.png'"
                    :description="emptyTip"
                />
            </template>
        </zd-list>
    </view>
</template>

<style scoped lang="scss">
.common-list {
    width: 100%;
    height: 100vh;
    background: $uni-text-color-inverse;

    &-content {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}
</style>
