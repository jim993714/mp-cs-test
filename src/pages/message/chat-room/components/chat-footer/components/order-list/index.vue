<script setup lang="ts">
import { CDN_BASE_URL } from '@/base/constants';

import GoodsItem from './components/order/index.vue';

const emits = defineEmits<{
    (event: 'send', orderNo: string): void;
}>();
const popup = ref();
const params = ref({});

defineExpose({
    open: () => {
        params.value = {};
        popup.value.open();
    }
});

function close() {
    popup.value.close();
}

function sendOrder(orderNo: string) {
    emits('send', orderNo);
    popup.value.close();
}

const list = [];
</script>

<template>
    <zd-popup
        ref="popup"
        type="bottom"
    >
        <view class="order-list">
            <view class="order-list-header">
                请选择要咨询的订单
                <view
                    class="order-list-header-close"
                    @tap="close"
                >
                    <zd-icon
                        type="zdmp-guanbidefuben"
                        :size="36"
                    />
                </view>
            </view>
            <view class="order-list-content">
                <zd-list
                    :params="params"
                    url="/student-school-shop/order/getRecentOrderList"
                >
                    <template #default="{ item }">
                        <GoodsItem
                            :item="item"
                            @send="sendOrder"
                        />
                    </template>
                    <template #empty>
                        <zd-empty
                            :image="`${CDN_BASE_URL}/mp-cs/images/message/empty-order.png`"
                            description="您最近3个月內没有产生可咨询的订单哦～"
                        />
                    </template>
                </zd-list>
            </view>
        </view>
    </zd-popup>
</template>

<style scoped lang="scss">
.order-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: 1016rpx;
    border-radius: 32rpx 32rpx 0rpx 0rpx;
    background: #fff;
    box-sizing: border-box;
    &-header {
        position: relative;
        width: 100%;
        padding: 40rpx 30rpx;
        box-sizing: border-box;
        text-align: center;
        color: $uni-text-color;
        font-size: 32rpx;
        font-weight: 500;
        line-height: 40rpx;

        &-close {
            position: absolute;
            top: 40rpx;
            right: 30rpx;
        }
    }

    &-content {
        width: 100%;
        height: 964rpx;
        background-color: $uni-text-color-inverse;

        &-body {
            min-height: 100%;
            padding-bottom: calc(env(safe-area-inset-bottom));
        }
    }
}
</style>
