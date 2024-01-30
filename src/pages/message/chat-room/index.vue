<script setup lang="ts">
import { onLoad, onPageScroll } from '@dcloudio/uni-app';
import { cloneDeep, router } from '@zsdx/mp-utils';
import { ref } from 'vue';

import { uploadFile, uploadImage } from '@/api/common';
import {
    getChatInfo,
    getChatMsgList,
    quitChatQueue,
    removeMessage,
    retractMessage,
    sendChatMsg,
    setMsgRead,
    transferChat
} from '@/api/message';
import {
    ChatMessageType,
    ChatType,
    CheckStatus,
    type MessageItem,
    MessageSendStatus,
    type SendMessageParams
} from '@/api/message/types';
import socket from '@/api/socket/hooks';
import { CDN_BASE_URL } from '@/base/constants';
import { useUserStore } from '@/stores/user';
import { getTime } from '@/utils/time';

import { formatDate } from '../utils/index';
import ChatInputBar from './components/chat-footer/index.vue';
import ChatItem from './components/chat-item/index.vue';

let scrollId: string;
let queue = 0;
const { send, data } = socket.useSocket();
const { nickname, headImgOri } = useUserStore().getUserInfo || {};

const paging = ref();
//v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
const dataList = ref<MessageItem[]>([]);

const chatInfo = reactive<{
    title: string;
    avatar: string;
    chatNo: string;
    userNo?: string;
    chatType: ChatType;
}>({
    title: '',
    avatar: '',
    chatNo: '',
    chatType: ChatType.Official
});

onPageScroll(e => {
    //如果滚动到顶部，触发加载更多聊天记录
    if (e.scrollTop < 10) {
        paging.value.doChatRecordLoadMore();
    }
});

const chatBar = ref();

async function onHeightChange() {
    setTimeout(() => {
        paging.value?.scrollToBottom(true);
    }, 300);
}

const queryList = async () => {
    if (scrollId === '') {
        paging.value.complete([]);
        return;
    }

    const { list, scrollId: _scrollId } = await getChatMsgList({
        chatNo: chatInfo.chatNo,
        scrollId
    });
    scrollId = _scrollId;

    // 最后消息为客服且未读需要标记已读
    if (list[0].isSender === 0 && !list[0].msgRead) {
        setMsgRead({
            chatNo: chatInfo.chatNo,
            messageId: list[0].msgId
        });
    }

    paging.value.complete(list);
};

async function doSend(msg: SendMessageParams) {
    const params = cloneDeep(msg);

    const data = {
        ...(msg as Pick<SendMessageParams, 'msgType' | 'msgContent'>),
        isSender: 1,
        msgTime: getTime(Date.now()),
        senderInfo: {
            senderName: nickname,
            senderHead: headImgOri
        },
        msgId: 0
    } as MessageItem;
    paging.value.addChatRecordData(data);

    if (params.msgType === ChatMessageType.Image) {
        const { url } = await uploadImage(params.msgContent.url, params.msgContent.size);
        params.msgContent.url = url;
    } else if (params.msgType === ChatMessageType.Video) {
        await Promise.all([
            (async () => {
                const { url } = await uploadImage(
                    params.msgContent.cover,
                    params.msgContent.coverSize
                );
                params.msgContent.cover = url as string;
            })(),
            (async () => {
                const { url } = await uploadFile(params.msgContent.path, params.msgContent.size);
                params.msgContent.path = url as string;
                (data.msgContent as any).path = url;
            })()
        ]);
    }

    try {
        const { msgId, msgCode } = await sendChatMsg({
            ...params,
            chatType: chatInfo.chatType,
            userNo: chatInfo.userNo
        });

        if (msgCode !== MessageSendStatus.Success) {
            data.msgId = -1;
        } else {
            data.msgId = msgId;
            data.msgRead = 0;
        }
    } catch (error) {
        data.msgId = -1;
    }

    dataList.value = [...dataList.value];
}

function onListClick() {
    chatBar.value.close();
}

function onListTouch() {
    uni.$emit('pageClick');
}

async function onRemove(i: number) {
    if (dataList.value[i].msgId !== -1) {
        await removeMessage({
            chatNo: chatInfo.chatNo,
            messageId: dataList.value[i].msgId
        });
    }

    dataList.value.splice(i, 1);
}

async function onRecall(i: number) {
    await retractMessage({
        chatNo: chatInfo.chatNo,
        messageId: dataList.value[i].msgId
    });
    dataList.value[i].isRetract = 1;
}

async function onTransfer(chatNo: string, sessionNo: string) {
    uni.showLoading({
        title: '转接中...',
        mask: true
    });
    try {
        await transferChat({
            chatNo: chatNo,
            sessionNo
        });
    } catch (error) {
        /** empty */
    } finally {
        uni.hideLoading();
    }
}

async function onCancelQueue() {
    await quitChatQueue({
        chatNo: chatInfo.chatNo
    });

    router.back();
}

function onConfirm(item: any) {
    item.msgContent.check_status = CheckStatus.Confirmed;
}

function getId(item: MessageItem, index: number) {
    if (!item.msgId || item.msgId === -1) {
        return `${index}#${item.msgId}`;
    }

    return '' + item.msgId;
}

function addSystemMsg(msg: string, type: ChatMessageType) {
    if (type === ChatMessageType.Queue) {
        paging.value.addChatRecordData({
            msgType: ChatMessageType.Queue,
            isSender: 0,
            senderInfo: {
                senderHead: `${CDN_BASE_URL}/mp-cs/images/message/icon-kf-avatar`,
                senderName: chatInfo.title
            },
            msgId: -Date.now(),
            msgContent: {
                text: msg
            }
        } as MessageItem);
    } else if (type === ChatMessageType.Remark) {
        paging.value.addChatRecordData({
            msgType: ChatMessageType.Remark,
            isSender: 0,
            senderInfo: {
                senderHead: chatInfo.avatar,
                senderName: chatInfo.title
            },
            msgId: -Date.now(),
            msgContent: {
                text: msg
            }
        } as MessageItem);
    }
}

onLoad(async options => {
    const shopNo = options?.shopNo;
    const { chatNo, queueCount, shopInfo, officialInfoDTO } = await getChatInfo({
        chatType: options?.shopNo ? ChatType.Shop : ChatType.Official,
        userNo: shopNo
    });

    if (shopNo) {
        chatInfo.userNo = shopNo;
    }

    chatInfo.chatNo = chatNo;

    // 注册会话
    send({
        cmd: 'kf_customer_chat',
        data: {
            chat_no: chatNo
        }
    });

    if (+queueCount > 0) {
        queue = +queueCount;
        addSystemMsg(`排队中，您前面还有${queueCount}人咨询，排到自动接入`, ChatMessageType.Queue);
    }
    if (shopNo) {
        chatInfo.title = shopInfo.shopTitle;
        chatInfo.avatar = shopInfo.shopLogo;
        chatInfo.chatType = options?.shopNo ? ChatType.Shop : ChatType.Official;
        uni.setNavigationBarTitle({
            title: shopInfo.shopTitle
        });
    } else {
        chatInfo.title = officialInfoDTO.officialTitle;
        chatInfo.avatar = officialInfoDTO.officialHead;
    }
    uni.setNavigationBarTitle({
        title: chatInfo.title
    });
});

onMounted(() => {
    uni.$on('cancelQueue', onCancelQueue);
});

onUnmounted(() => {
    uni.$off('cancelQueue', onCancelQueue);
});

watch(data, val => {
    if (data.value?.data.chat_no !== chatInfo.chatNo) {
        return;
    }

    if (val?.event === 'queue_change') {
        if (val.data.queue_count > 0 && queue !== +val.data.queue_count) {
            queue = +val.data.queue_count;
            addSystemMsg(
                `排队中，您前面还有${val.data.queue_count}人咨询，排到自动接入`,
                ChatMessageType.Queue
            );
        }
    } else if (val?.event === 'msg_read') {
        dataList.value.some(item => {
            if (item.isSender) {
                if (!item.msgRead) {
                    item.msgRead = 1;
                } else {
                    return true;
                }
            }
        });
    } else if (val?.event === 'msg_receive') {
        const msg: MessageItem = {} as MessageItem;
        msg.msgContent = JSON.parse(val.data.msg_content);
        msg.isSender = val.data.is_sender;
        msg.msgId = val.data.msg_id;
        msg.msgTime = val.data.msg_time * 1000;
        msg.msgRead = val.data.msg_read;
        msg.msgType = val.data.msg_type as any;
        msg.senderInfo = {
            senderHead: val.data.sender_info?.sender_head || '',
            senderName: val.data.sender_info?.sender_name || ''
        };

        paging.value.addChatRecordData(msg);
        setMsgRead({
            chatNo: chatInfo.chatNo,
            messageId: msg.msgId
        });
    } else if (val?.event === 'msg_retract') {
        dataList.value.some(item => {
            if (item.msgId === val.data.msg_id) {
                item.isRetract = 1;
                return true;
            }
        });
    } else if (val?.event === 'chat_session_evaluate') {
        addSystemMsg(`您对${chatInfo.title}的服务还满意吗？`, ChatMessageType.Remark);
    }
});
</script>

<template>
    <view class="content">
        <zd-virtual-list
            v-if="chatInfo.chatNo"
            ref="paging"
            v-model="dataList"
            use-chat-record-mode
            :paging-style="{ background: '#f5f8fa' }"
            @query="queryList"
        >
            <view
                class="chat-list"
                @tap="onListClick"
                @touchstart="onListTouch"
            >
                <view
                    v-for="(item, index) in dataList"
                    :id="getId(item, index)"
                    :key="getId(item, index)"
                >
                    <view
                        v-if="formatDate(item.msgTime, dataList[index - 1]?.msgTime)"
                        class="chat-list-item-date"
                    >
                        {{ formatDate(item.msgTime, dataList[index - 1]?.msgTime) }}</view
                    >
                    <ChatItem
                        :item="item"
                        @remove="onRemove(index)"
                        @recall="onRecall(index)"
                        @transfer="onTransfer"
                        @resend="doSend"
                        @confirm="onConfirm"
                    />
                </view>
            </view>

            <!-- 底部聊天输入框 -->
            <template #bottom>
                <ChatInputBar
                    ref="chatBar"
                    :chat-no="chatInfo.chatNo"
                    :user-no="chatInfo.userNo"
                    @send="doSend"
                    @footer-trigger="onHeightChange"
                />
            </template>
        </zd-virtual-list>
    </view>
</template>

<style scoped lang="scss">
.chat-list {
    min-height: calc(100% - 20rpx);
    padding-top: 20rpx;
    &-item-date {
        padding: 20rpx;
        text-align: center;
        color: $uni-text-color-placeholder;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 24rpx;
    }
}
</style>
