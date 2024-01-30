<script setup lang="ts">
import { getCouponDetail, getCouponRule, getPacketDetail, getPacketRule } from '@/api/ucenter';
import type { Coupon, CouponRes, RedPacket, RedPacketRes, RuleItem } from '@/api/ucenter/types';
import { CouponRuleType } from '@/api/ucenter/types';

import Info from './components/info.vue';
import Rules from './components/rules.vue';
import { PrizeType } from './types';

const couponNo = ref('');
const packetNo = ref('');
const isSingleGoods = ref(false);
const goodsNo = ref();
const info = ref<Coupon | RedPacket>();
const rules = ref('');
const type = ref<PrizeType>(PrizeType.NONE);

async function getInfo() {
    const requestFunc = type.value === 2 ? getCouponDetail : getPacketDetail;
    const res = await requestFunc(type.value === 2 ? couponNo.value : packetNo.value);

    if (type.value === 2) {
        info.value = (res as CouponRes).couponInfo;
    } else {
        info.value = (res as RedPacketRes).packetInfo;
    }
    goodsNo.value = (res as CouponRes).goodsInfo?.goodsNo;
}

/**
 * 获取规则
 */
async function getRules() {
    if (type.value === PrizeType.COUPON) {
        rules.value = (await getCouponRule(CouponRuleType.COUPON_DETAIL)).content;
    } else if (type.value === PrizeType.RED_PACKET) {
        rules.value = (
            await getPacketRule({
                packetNo: packetNo.value
            })
        ).content;
    }
}

onLoad(options => {
    couponNo.value = options?.couponNo;
    packetNo.value = options?.packetNo;
    isSingleGoods.value = options?.isSingleGoods === 'true';
    goodsNo.value = options?.goodsNo;
    type.value = Number(options?.type);

    getInfo();
    getRules();
});
</script>

<template>
    <view class="coupon-detail">
        <info
            v-if="info"
            :info="info"
            :type="type"
            :is-single-goods="isSingleGoods"
            :goods-no="goodsNo"
        />
        <rules
            :rules="rules"
            :type="type"
        />
    </view>
</template>

<style lang="scss" scoped>
.coupon-detail {
    display: flex;
    padding: 20rpx;
    flex-direction: column;
    gap: 20rpx;
}
</style>

<style>
page {
    background-color: #ff6050;
}
</style>
