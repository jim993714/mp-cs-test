<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { getFlashGoodsDetail, getGoodsDetail } from '@/api/goods-detail';
import { getChatMsgContent, getEmojiList, quitChatSession } from '@/api/message';
import type { CustomEmojiItem, GoodsType, SendMessageParams } from '@/api/message/types';
import { ChatMessageType } from '@/api/message/types';
import type { GoodListCommonItem } from '@/api/redpacket/types';
import { CDN_BASE_URL } from '@/base/constants';
import { emojiUrl, parseEmoji, registerEmoji, TextNodeType } from '@/pages/message/utils';

import { chatFunctions, FunctionType, mediaItems, MediaType } from '../constants';
import FabGoods from './components/fab-goods/index.vue';
import OrderList from './components/order-list/index.vue';
import Remark from './components/remark/index.vue';

const studentShopId = uni.getStorageSync('studentShopId');

const props = defineProps<{
    chatNo: string;
    userNo?: string;
}>();

const emits = defineEmits<{
    (event: 'send', msg: SendMessageParams): void;
    (event: 'footerTrigger'): void;
}>();

const msg = ref('');

const fabGoods = ref();
const remarkDialog = ref();
const orderListDialog = ref();

const emotionCollapse = ref(false);
const emotionCollapseAni = uni.createAnimation({
    duration: 250,
    delay: 0,
    timingFunction: 'ease'
});
const emotionCollapseActions = ref();
const emojiTab = ref(1);
const emojiInstance = ref();

const mediaCollapse = ref(false);
const mediaCollapseAni = uni.createAnimation({
    duration: 250,
    delay: 0,
    timingFunction: 'ease'
});
const mediaCollapseActions = ref();

const emojiHeight = uni.upx2px(416);
const padding = uni.upx2px(20);
const customEmotions = ref<CustomEmojiItem[]>([]);

const keyboardAni = uni.createAnimation();
const keyboardActions = ref<any>();
const height = ref(0);
const { safeArea, screenHeight } = uni.getSystemInfoSync();
const bottomAreaHeight = screenHeight - (safeArea?.bottom || 0);

watch(emotionCollapse, val => {
    if (val) {
        emotionCollapseAni.height('500rpx').step();
        emotionCollapseActions.value = emotionCollapseAni.export();
    } else {
        emotionCollapseAni.height(0).step();
        emotionCollapseActions.value = emotionCollapseAni.export();
    }
    emits('footerTrigger');
});

watch(mediaCollapse, val => {
    if (val) {
        mediaCollapseAni.height('192rpx').step();
        mediaCollapseActions.value = mediaCollapseAni.export();
    } else {
        mediaCollapseAni.height(0).step();
        mediaCollapseActions.value = mediaCollapseAni.export();
    }
    emits('footerTrigger');
});

function emotionCollapseTrigger() {
    mediaCollapse.value = false;
    emotionCollapse.value = true;
}

function mediaCollapseTrigger() {
    emotionCollapse.value = false;
    mediaCollapse.value = true;
}

function onEmojiTabChange(e: { detail: { current: number } }) {
    emojiTab.value = e.detail.current;
}

function onInsertEmoji(e: { detail: { emotionName: string } }) {
    msg.value += e.detail.emotionName;
}

async function onInput() {
    const data = await parseEmoji(msg.value + ']');
    if (data.slice(-1)[0].type === TextNodeType.Emoji) {
        msg.value = data
            .slice(0, -1)
            .map(item => item.content)
            .join('');
    }
}

async function onRemove() {
    const data = await parseEmoji(msg.value);
    if (data.slice(-1)[0].type === TextNodeType.Emoji) {
        msg.value = data
            .slice(0, -1)
            .map(item => item.content)
            .join('');
    } else {
        msg.value = msg.value.slice(0, -1);
    }
}

function onMediaItemClick(type: MediaType) {
    if (type === MediaType.Album || type === MediaType.Camera) {
        uni.chooseImage({
            sourceType: [type === MediaType.Album ? 'album' : 'camera'],
            sizeType: ['original', 'compressed'],
            success: async res => {
                const list = (
                    Array.isArray(res.tempFiles) ? res.tempFiles : [res.tempFiles]
                ) as UniApp.ChooseImageSuccessCallbackResultFile[];

                list.map(image => {
                    uni.getImageInfo({
                        src: image.path,
                        success: res => {
                            emits('send', {
                                msgType: ChatMessageType.Image,
                                msgContent: {
                                    url: image.path,
                                    w: res.width,
                                    h: res.height,
                                    size: image.size
                                }
                            });
                        }
                    });
                });
            }
        });
    } else {
        uni.chooseMedia({
            sourceType: ['camera'],
            sizeType: ['original', 'compressed'],
            maxDuration: 10,
            mediaType: ['video'],
            success(res) {
                res.tempFiles.forEach(item => {
                    uni.getFileSystemManager().getFileInfo({
                        filePath: item.thumbTempFilePath,
                        success(cover) {
                            emits('send', {
                                msgType: ChatMessageType.Video,
                                msgContent: {
                                    path: item.tempFilePath,
                                    cover: item.thumbTempFilePath,
                                    duration: item.duration,
                                    w: item.width,
                                    h: item.height,
                                    size: item.size,
                                    coverSize: cover.size
                                }
                            });
                        }
                    });
                });
            }
        });
    }
}

function onFunctionItemClick(type: FunctionType) {
    if (type === FunctionType.Close) {
        uni.showModal({
            title: '确定结束会话吗',
            confirmText: '确定',
            cancelText: '取消',
            confirmColor: '#199FFF',
            cancelColor: '#8A9399',
            success: async res => {
                if (res.confirm) {
                    await quitChatSession({ chatNo: props.chatNo });
                    router.back();
                }
            }
        });
    } else if (type === FunctionType.Remark) {
        remarkDialog.value.open({
            chatNo: props.chatNo
        });
    } else if (type === FunctionType.Report) {
        router.push('report', {
            dataNo: props.userNo
        });
    } else {
        orderListDialog.value.open();
    }
}

const sendText = () => {
    if (!msg.value.length) return;
    emits('send', {
        msgType: ChatMessageType.Text,
        msgContent: {
            text: msg.value
        }
    });
    msg.value = '';
};

function sendCustomEmoji(item: CustomEmojiItem) {
    uni.getImageInfo({
        src: item.imageUrl,
        success(res) {
            emits('send', {
                msgType: ChatMessageType.Emoji,
                msgContent: {
                    url: item.imageUrl,
                    title: item.emojiTitle,
                    w: res.width,
                    h: res.height
                }
            });
        }
    });
}

async function sendOrder(orderNo: string) {
    const { msgContent } = await getChatMsgContent({
        msgType: ChatMessageType.Order,
        msgContent: JSON.stringify({
            order_no: orderNo
        })
    });

    emits('send', {
        msgType: ChatMessageType.Order,
        msgContent: JSON.parse(msgContent) as (SendMessageParams & {
            msgType: ChatMessageType.Order;
        })['msgContent']
    });
}

async function sendGoods(
    item: GoodListCommonItem & {
        goodsType: GoodsType;
        saleNo?: string;
    }
) {
    let params: {
        goods_no?: string;
        sale_no?: string;
        welfare_no?: string;
        lottery_no?: string;
    } = {};

    if (
        item.goodsType === ChatMessageType.GoodsSelf ||
        item.goodsType === ChatMessageType.GoodsDiscount ||
        item.goodsType === ChatMessageType.GoodsFree ||
        item.goodsType === ChatMessageType.GoodsBargain
    ) {
        params.goods_no = item.goodsNo;
    } else if (item.goodsType === ChatMessageType.GoodsLottery) {
        params.lottery_no = item.goodsNo;
    } else if (item.goodsType === ChatMessageType.GoodsWelfare) {
        params.welfare_no = item.goodsNo;
    } else {
        params.sale_no = item.saleNo;
    }

    const { msgContent } = await getChatMsgContent({
        msgType: item.goodsType,
        msgContent: JSON.stringify(params)
    });

    emits('send', {
        msgType: item.goodsType,
        msgContent: JSON.parse(msgContent)
    });
}

function onRemark() {
    remarkDialog.value.open({
        chatNo: props.chatNo
    });
}

function onKeyBoardHeightChange(e: any) {
    if (e.height) {
        height.value = e.height;
        emotionCollapse.value = false;
        mediaCollapse.value = false;
        keyboardAni.height(`${e.height - bottomAreaHeight}px`).step({
            duration: 250,
            delay: 0,
            timingFunction: 'ease'
        });
        keyboardActions.value = keyboardAni.export();
    } else {
        keyboardAni.height(0).step({
            duration: 250,
            delay: 0,
            timingFunction: 'ease'
        });
        keyboardActions.value = keyboardAni.export();
    }
    emits('footerTrigger');
}

onMounted(async () => {
    uni.onKeyboardHeightChange(onKeyBoardHeightChange);

    //@ts-ignore
    const options = getCurrentPages().slice(-1)[0].options;
    registerEmoji(emojiInstance.value);
    uni.$on('remark', onRemark);
    const data = await getEmojiList();
    customEmotions.value = data;

    const goodsNo = options?.goodsNo as string;
    const saleNo = options?.saleNo as string;

    if (goodsNo || saleNo) {
        const { goodsCover, goodsTitle, goodsPrice } = await (saleNo
            ? getFlashGoodsDetail({
                  saleNo,
                  goodsNo,
                  studentShopId
              })
            : getGoodsDetail({
                  goodsNo: goodsNo,
                  studentShopId
              }));

        fabGoods.value.open({
            goodsCover,
            goodsTitle,
            goodsPrice,
            goodsNo,
            saleNo
        });
    }
});

onUnmounted(() => {
    uni.$off('remark', onRemark);
    uni.offKeyboardHeightChange(onKeyBoardHeightChange);
});

defineExpose({
    close: () => {
        emotionCollapse.value = false;
        mediaCollapse.value = false;
    }
});
</script>

<template>
    <view class="chat-footer">
        <FabGoods
            ref="fabGoods"
            @send="sendGoods"
        />
        <view class="chat-footer-function">
            <view
                v-for="func in chatFunctions"
                :key="func.value"
                class="chat-footer-function-item"
                @tap="onFunctionItemClick(func.value)"
            >
                <zd-icon
                    v-if="func.icon"
                    :type="func.icon"
                    :color="func.iconColor"
                    :size="30"
                />
                {{ func.label }}
            </view>
        </view>
        <view class="chat-footer-input">
            <input
                v-model="msg"
                :cursor-spacing="40"
                :always-embed="true"
                :adjust-position="false"
                placeholder-class="chat-footer-input__placeholder"
                confirm-type="send"
                confirm-hold
                placeholder="请输入信息…"
                @confirm="sendText"
                @input="onInput"
            />
            <view class="chat-footer-input-extra">
                <view @tap="emotionCollapseTrigger">
                    <zd-icon
                        type="zdmp-biaoqing"
                        :size="52"
                    />
                </view>
                <view @tap="mediaCollapseTrigger">
                    <zd-icon
                        type="zdmp-tianjiadefuben"
                        :size="52"
                    />
                </view>
            </view>
        </view>
        <view
            class="chat-footer-trigger"
            :animation="emotionCollapseActions"
        >
            <view class="chat-footer-trigger-emotion">
                <swiper
                    :current="emojiTab"
                    :style="{ height: '416rpx' }"
                    @change="onEmojiTabChange"
                >
                    <swiper-item>
                        <scroll-view
                            style="height: 100%"
                            scroll-y
                        >
                            <view class="chat-footer-trigger-emotion-custom">
                                <image
                                    v-for="(emotion, i) in customEmotions"
                                    :key="i"
                                    :src="emotion.thumbUrl"
                                    class="chat-footer-trigger-emotion-custom-item"
                                    @tap="sendCustomEmoji(emotion)"
                                />
                            </view>
                        </scroll-view>
                    </swiper-item>
                    <swiper-item>
                        <emoji
                            ref="emojiInstance"
                            :padding="padding"
                            :height="emojiHeight"
                            background-color="#F5F8FA"
                            :source="emojiUrl"
                            @insertemoji="onInsertEmoji"
                        />
                    </swiper-item>
                </swiper>
                <view class="chat-footer-trigger-emotion-switch">
                    <view class="chat-footer-trigger-emotion-switch-left">
                        <view @tap="emojiTab = 0">
                            <zd-icon
                                type="zdmp-shoucangbiaoqing"
                                color="#FF6026"
                                :size="50"
                            />
                        </view>
                        <view @tap="emojiTab = 1">
                            <image
                                class="chat-footer-trigger-emotion-switch-left-emoji"
                                :src="`${CDN_BASE_URL}/mp-cs/images/message/icon-emoji.png`"
                            />
                        </view>
                    </view>
                    <view class="chat-footer-trigger-emotion-switch-right">
                        <view @tap="onRemove">
                            <zd-icon
                                type="zdmp-shanchu1"
                                :size="36"
                            />
                        </view>
                        <view
                            class="chat-footer-trigger-emotion-switch-right-send"
                            @tap="sendText"
                            >发送</view
                        >
                    </view>
                </view>
            </view>
        </view>
        <view
            class="chat-footer-trigger"
            :animation="mediaCollapseActions"
        >
            <view class="chat-footer-trigger-media">
                <view
                    v-for="item in mediaItems"
                    :key="item.value"
                    class="chat-footer-trigger-media-item"
                    @tap="onMediaItemClick(item.value)"
                >
                    <view class="chat-footer-trigger-media-item-icon">
                        <zd-icon
                            :type="item.icon"
                            :size="60"
                        />
                    </view>
                    <text>{{ item.label }}</text>
                </view>
            </view>
        </view>
        <view
            class="chat-footer-trigger"
            :animation="keyboardActions"
        >
            <view
                :style="{
                    width: '100%',
                    height: `${height}px`
                }"
            />
        </view>
        <Remark ref="remarkDialog" />
        <OrderList
            ref="orderListDialog"
            @send="sendOrder"
        />
    </view>
</template>

<style scoped lang="scss">
.chat-footer {
    position: relative;
    display: flex;
    justify-content: center;
    margin-bottom: calc(env(safe-area-inset-bottom));

    padding: 24rpx 20rpx 0 20rpx;
    border-top: solid 1px #f5f5f5;
    background-color: $uni-text-color-inverse;
    flex-direction: column;

    &-function {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1;
        margin-bottom: 24rpx;

        &-item {
            display: flex;
            align-items: center;
            height: 58rpx;
            padding: 0 16rpx;
            border: 2rpx solid $uni-text-color-placeholder;
            border-radius: 26rpx;
            color: #576066;

            font-size: 24rpx;
            font-weight: 400;
            gap: 12rpx;
            box-sizing: border-box;
            line-height: 24rpx;
        }
    }

    &-input {
        display: flex;
        height: 72rpx;
        margin-bottom: 24rpx;
        flex: 1;
        line-height: 72rpx;

        > input {
            height: 72rpx;
            padding-left: 30rpx;
            border-radius: 8rpx;
            font-size: 28rpx;
            background: #fff;
            flex: 1;
        }

        &-extra {
            display: flex;
            justify-content: space-evenly;
            width: 140rpx;
            flex-grow: 0;
            flex-shrink: 0;
            gap: 24rpx;
            padding-left: 20rpx;
            box-sizing: border-box;
        }

        :deep(.chat-footer-input__placeholder) {
            color: $uni-color-paragraph;
            font-size: 28rpx;
            font-weight: 400;
            line-height: 32rpx;
        }
    }

    &-trigger {
        overflow: hidden;
        height: 0;

        &-emotion {
            width: 100%;
            height: 500rpx;

            &-custom {
                display: flex;
                gap: 40rpx;
                flex-wrap: wrap;
                padding: 20rpx;
                box-sizing: border-box;

                &-item {
                    width: 136rpx;
                    height: 136rpx;
                }
            }

            &-switch {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 84rpx;
                flex-shrink: 0;

                &-left {
                    display: flex;
                    align-items: center;
                    gap: 40rpx;

                    &-emoji {
                        display: block;
                        width: 48rpx;
                        height: 48rpx;
                    }
                }

                &-right {
                    display: flex;
                    align-items: center;
                    gap: 40rpx;

                    &-send {
                        width: 144rpx;
                        height: 56rpx;
                        border-radius: 28rpx;
                        text-align: center;
                        color: #fff;
                        font-size: 24rpx;
                        font-weight: 500;
                        background: $zd-main-color;
                        line-height: 56rpx;
                    }
                }
            }
        }

        &-media {
            display: flex;
            height: 192rpx;
            padding: 36rpx 50rpx;
            box-sizing: border-box;
            gap: 70rpx;

            &-item {
                display: flex;
                align-items: center;
                width: 92rpx;
                height: 138rpx;
                color: $uni-text-color-placeholder;
                font-size: 24rpx;
                font-weight: 400;
                line-height: 24rpx;
                flex-direction: column;
                gap: 22rpx;

                &-icon {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 92rpx;
                    height: 92rpx;
                    border-radius: 20rpx;
                    background: #fff;

                    > zd-icon {
                        margin-top: 18rpx;
                    }
                }
            }
        }
    }
}
</style>
