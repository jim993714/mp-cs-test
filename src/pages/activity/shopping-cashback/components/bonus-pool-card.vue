<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        money: number;
        hasSend: boolean;
    }>(),
    {
        money: 0,
        hasSend: false
    }
);

const money = computed(() => {
    if (!props.money) return ['', '', ''];

    return Math.floor(props.money).toString().split('');
});
</script>

<template>
    <view class="bonus-pool">
        <view class="title">奖池总金额</view>
        <view class="sub-title">
            <view v-if="hasSend">已发放</view>
        </view>
        <view class="money">
            <view
                v-for="(item, index) in money"
                :key="index"
                class="money-item"
            >
                {{ item }}
            </view>
        </view>
        <view class="tips"> 奖励金额会发放至账户余额，提现目前仅支持APP提现哦～ </view>
    </view>
</template>

<style lang="scss" scoped>
.bonus-pool {
    width: 750rpx;
    height: 396rpx;
    padding: 52rpx 64rpx 0;
    color: #583124;
    background: url(https://nss1.zsdx.cn/mp-cs/images/activity/shopping-cashback/card-bg.png)
        no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;

    .title {
        font-size: 40rpx;
        font-weight: 600;
        line-height: 40rpx;
    }

    .sub-title {
        height: 24rpx;
        margin-top: 16rpx;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 24rpx;
    }

    .money {
        display: flex;
        align-items: center;
        gap: 20rpx;
        margin: 40rpx 0 30rpx;

        &-item {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 66rpx;
            height: 80rpx;
            border-radius: 20rpx;

            font-size: 48rpx;
            font-weight: 600;
            background: #fff4ec;
            line-height: 48rpx;
        }
    }

    .tips {
        font-size: 24rpx;
        font-weight: 400;
        line-height: 24rpx;
    }
}
</style>
