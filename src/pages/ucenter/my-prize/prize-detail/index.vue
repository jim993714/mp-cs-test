<script setup lang="ts">
import { getDefaultAddress } from '@/api/order-confirm';
import { getPrizeExchangeDetail, submitReceiveInfo } from '@/api/ucenter';
import { type PrizeExchangeResult, PrizeExchangeStatus } from '@/api/ucenter/types';
import type { Address } from '@/pages/shop/order-confirm/types';

import AddressBlock from './components/address.vue';
import Logistics from './components/logistics.vue';
import PrizeInfo from './components/prize-info.vue';
import Rules from './components/rules.vue';

const exchangeNo = ref<string>('');
const exchangeInfo = ref<PrizeExchangeResult>();

async function getInfo() {
    const result = await getPrizeExchangeDetail(exchangeNo.value);

    exchangeInfo.value = result;
}

async function submit() {
    if (!exchangeInfo.value || !exchangeInfo.value.receiveAddressInfo) {
        return;
    }
    const { addressId } = exchangeInfo.value.receiveAddressInfo;

    try {
        await submitReceiveInfo(exchangeNo.value, addressId);

        uni.showToast({
            title: '提交成功',
            icon: 'none'
        });
        await getInfo();
    } catch (error: any) {
        uni.showToast({
            title: error.msg,
            icon: 'none'
        });
    }
}

async function getAddress() {
    if (exchangeInfo.value?.receiveAddressInfo) {
        return;
    }
    const address = await getDefaultAddress({ type: 0 });

    setAddress(address);
}

function setAddress(address: Address) {
    if (!exchangeInfo.value) return;

    console.log(address);

    exchangeInfo.value.receiveAddressInfo = {
        addressId: String(address.id),
        userName: address.userName,
        phone: address.phone,
        detailInfo: address.detailInfo,
        provinceName: address.provinceName,
        cityName: address.cityName,
        countyName: address.countyName
    };
}

onLoad(async options => {
    exchangeNo.value = options?.exchangeNo;

    await getInfo();
    await getAddress();
});

onShow(async () => {
    uni.$on('address-selected', (addressInfo: Address) => {
        if (!exchangeInfo.value) {
            return;
        }

        setAddress(addressInfo);
    });
});

onUnmounted(() => {
    uni.$off('address-selected');
});
</script>

<template>
    <view class="page-wrap">
        <!-- 奖品信息 -->
        <PrizeInfo :info="exchangeInfo" />
        <!-- 地址 -->
        <AddressBlock
            :info="exchangeInfo?.receiveAddressInfo"
            :status="exchangeInfo?.status"
        />
        <!-- 物流 -->
        <Logistics
            v-if="exchangeInfo && exchangeInfo?.status !== PrizeExchangeStatus.WAITING_FOR_ADDRESS"
            :info="exchangeInfo"
            :exchange-no="exchangeNo"
        />
        <!-- 领取规则 -->
        <Rules :rule-list="exchangeInfo?.receiveRule || []" />
    </view>

    <view
        v-if="exchangeInfo?.status === PrizeExchangeStatus.WAITING_FOR_ADDRESS"
        class="footer"
    >
        <zd-button
            type="primary"
            :disabled="!exchangeInfo?.receiveAddressInfo"
            @tap="submit"
        >
            提交信息
        </zd-button>
    </view>
</template>

<style>
page {
    background-color: #f5f8fa;
}
</style>

<style lang="scss" scoped>
.page-wrap {
    display: flex;
    padding: 20rpx;
    flex-direction: column;
    gap: 20rpx;
}
.footer {
    position: fixed;
    bottom: 0;
    width: 750rpx;
    height: 188rpx;
    padding: 20rpx 40rpx 88rpx;
    background-color: #fff;
    box-sizing: border-box;
}
</style>
