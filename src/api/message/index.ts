import { useRequest } from '@zsdx/mp-utils';

import type {
    ChatInfo,
    ChatInfoParams,
    ChatListRes,
    ChatMessageParams,
    ChatSessionInfo,
    CommonMessageParams,
    CommonMessageRes,
    ConfirmAddressParams,
    CustomEmojiItem,
    GetSocketRes,
    MessageCountRes,
    MessageItem,
    MessageListRes,
    MessageOperationParams,
    RemarkParams,
    ReportParams,
    SendMessageParams,
    SendMessageRes,
    TopParams,
    TransferParams
} from './types';

const request = useRequest();

/** 获取消息统计数 */
export function getMessageCount() {
    return request.post<MessageCountRes>('/student-school-shop/message/getMessageCount');
}

/** 获取通用信息列表 */
export function getMessageList(params: CommonMessageParams) {
    return request.post<CommonMessageRes>('/student-school-shop/message/getMessageList', params);
}

/** 获取聊天列表 */
export function getChatList(params: {}) {
    return request.post<ChatListRes>('/student-school-shop/message/getChatList', params);
}

/** 置顶操作 */
export function topMessage(params: TopParams) {
    return request.post('/student-school-shop/message/topMessage', params);
}

/** 删除消息 */
export function deleteChat(params: { messageId: number[] }) {
    return request.post('/student-school-shop/message/deleteKfMessage', params);
}

/** 点击已读 */
export function clickAlready(params: { messageId: number }) {
    return request.post('/student-school-shop/message/clickAlready', params);
}

/** 获取聊天记录 */
export async function getChatMsgList(params: ChatMessageParams) {
    const { list, scrollId } = await request.post<MessageListRes>(
        '/student-school-shop/customerService/getChatMsgList',
        params
    );

    list.forEach(message => {
        message.msgContent = JSON.parse(message.msgContent as any);
    });

    return {
        list: list.reverse(),
        scrollId
    };
}

/** 获取聊天信息 */
export function getChatInfo(params: ChatInfoParams) {
    return request.post<ChatInfo>('/student-school-shop/customerService/getChatInfo', params);
}

/** 获取socket */
export function getSocket() {
    return request.post<GetSocketRes>('/student-school-shop/customerService/getSocket');
}

/** 获取自定义表情 */
export function getEmojiList() {
    return request.post<CustomEmojiItem[]>('/student-school-shop/customerService/getEmojiList');
}

/** 转接客服 */
export function transferChat(params: TransferParams) {
    return request.post('/student-school-shop/customerService/setChatSessionCanTransfer', params);
}

/** 删除消息 */
export function removeMessage(params: MessageOperationParams) {
    return request.post('/student-school-shop/customerService/deleteMsg', params);
}

/** 撤回消息 */
export function retractMessage(params: MessageOperationParams) {
    return request.post('/student-school-shop/customerService/retractMsg', params);
}

/** 退出排队 */
export function quitChatQueue(params: { chatNo: string }) {
    return request.post('/student-school-shop/customerService/quitChatQueue', params);
}

/** 发送消息 */
export function sendChatMsg(params: SendMessageParams) {
    params.msgContent = JSON.stringify(params.msgContent) as any;
    return request.post<SendMessageRes>('/student-school-shop/customerService/sendChatMsg', params);
}

/** 举报 */
export function submitReport(params: ReportParams) {
    return request.post('/student-school-shop/customerService/submitReport', params);
}

/** 获取待评价会话 */
export function getEvaluateChatSession(params: { chatNo: string }) {
    return request.post<ChatSessionInfo>(
        '/student-school-shop/customerService/getEvaluateChatSession',
        params
    );
}

/** 获取聊天内容 */
export function getChatMsgContent(params: Pick<MessageItem, 'msgType'> & { msgContent: string }) {
    return request.post<Pick<MessageItem, 'msgType'> & { msgContent: string }>(
        '/student-school-shop/customerService/getChatMsgContent',
        params
    );
}

/** 评价客服 */
export function evaluateChatSession(params: RemarkParams) {
    return request.post('/student-school-shop/customerService/evaluateChatSession', params);
}

/** 设置聊天消息已读 */
export function setMsgRead(params: MessageOperationParams) {
    return request.post('/student-school-shop/customerService/setMsgRead', params);
}

/** 退出聊天 */
export function quitChatSession(params: { chatNo: string }) {
    return request.post('/student-school-shop/customerService/quitChatSession', params);
}

/** 近期订单列表 */
export function getRecentOrderList(params: {}) {
    return request.post('/student-school-shop/order/getRecentOrderList', params);
}

/** 确认地址 */
export function confirmAddress(params: ConfirmAddressParams) {
    return request.post('/student-school-shop/customerService/confirmAddress', params);
}
