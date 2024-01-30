<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { preview } from '@/api/order-confirm';
import type { ShopCartGoods, ShopCartItem } from '@/api/shop-cart/types';
import useStudentAuth from '@/components/student-auth-pop/useStudentAuth';
import { useOrderStore } from '@/stores/order';
import { useUserStore } from '@/stores/user';

const { getAuthStatus, toStudentAuth } = useStudentAuth();

const props = defineProps<{
    goodsList: ShopCartGoods[];
    isManage: boolean;
    studentShopId: string;
}>();
const emit = defineEmits(['checkAll', 'remove']);

const orderMoney = ref(0);
const checkAllStatus = ref<boolean>(false);

const orderStore = useOrderStore();

const checkedProductList = computed(() => {
    return props.goodsList.reduce((prev, curr) => {
        const list = curr.shopCartItems.filter(item => item.isChecked);
        return prev.concat(list);
    }, [] as ShopCartGoods['shopCartItems']);
});

async function onCheckAll() {
    checkAllStatus.value = !checkAllStatus.value;

    emit('checkAll', checkAllStatus.value);
    calcPayMoney();
}

function removeAll() {
    if (checkedProductList.value.length === 0) {
        return;
    }

    emit('remove', checkedProductList.value);
}

function findGoodsNo(item: ShopCartItem) {
    return props.goodsList.find(goods => {
        return goods.shopCartItems.some(product => product.productNo === item.productNo);
    })?.goodsNo;
}

/**
 * 获取支付学生价 1: 原价支付
 */
const getUsePayType = async (): Promise<number> => {
    const userStore = useUserStore();
    const { userInfo } = toRefs(userStore);
    // 用户是否已经认证
    return new Promise((resolve: Function, reject: Function) => {
        // 检测是否有学生价商品选中
        let hasStudentPrice = checkedProductList.value.reduce((result, item) => {
            if (item.goodsShowPriceType === 2) {
                return true;
            }
            return result;
        }, false);
        if (userInfo.value?.userVerify === '1') {
            resolve(hasStudentPrice ? 0 : 1);
            return true;
        }

        if (hasStudentPrice) {
            // 未认证, 提示是否进行学生认证
            uni.showModal({
                title: '完成学生认证后才可以以学生价购买',
                confirmText: '去认证',
                cancelText: '原价购买',
                confirmColor: '#199FFF',
                cancelColor: '#8A9399',
                success: async res => {
                    console.log('res', res);
                    if (res.confirm) {
                        // 去认证, 无需继续执行
                        console.log('需要认证');
                        toStudentAuth();
                        reject();
                    } else {
                        // 原价购买
                        resolve(1);
                    }
                }
            });
        } else {
            // 直接购买
            resolve(1);
        }
    });
};

async function onPay() {
    if (checkedProductList.value.length === 0) {
        return;
    }

    try {
        // 检测是否有学生价商品, 是否进行学生认证
        let usePayType = await getUsePayType();

        const orderItemList = checkedProductList.value.map(item => {
            return {
                goodsNo: findGoodsNo(item) as string,
                productNo: item.productNo,
                num: item.buyNum,
                studentShopId: props.studentShopId,
                usePayType: usePayType || (item.goodsShowPriceType === 2 ? 0 : 1)
            };
        });

        orderStore.setSelectedProducts(orderItemList);
        router.push('orderConfirm', {
            orderFrom: 'shopCart'
        });
    } catch (e: any) {
        console.log(e);
    }
}

// 选中商品变化时，调用接口计算价格
async function calcPayMoney() {
    const checkedProductList = props.goodsList.reduce((prev, curr) => {
        const list = curr.shopCartItems.filter(item => item.isChecked);
        return prev.concat(list);
    }, [] as ShopCartGoods['shopCartItems']);

    // 本地计算价格
    orderMoney.value = checkedProductList.reduce((prev, curr) => {
        return prev + Number(curr.productPrice) * curr.buyNum;
    }, 0);

    if (checkedProductList.length === 0) {
        return;
    }

    // 调用接口计算价格
    const params = {
        result: 6,
        buyType: 1,
        orderItemList: checkedProductList.map(item => {
            return {
                goodsNo: findGoodsNo(item) as string,
                productNo: item.productNo,
                num: item.buyNum,
                studentShopId: props.studentShopId
            };
        })
    };

    const res = await preview(params);

    orderMoney.value = res.orderMoney;
}

watchEffect(() => {
    checkAllStatus.value = props.goodsList.every(goodsList => {
        return goodsList.shopCartItems.every(product => product.isChecked);
    });
});

defineExpose({
    calcPayMoney,
    clearMoney: () => {
        orderMoney.value = 0;
    }
});
</script>

<template>
    <view class="action-bar">
        <view
            class="checkbox"
            @tap="onCheckAll"
        >
            <zd-checkbox
                :model-value="checkAllStatus"
                style="margin-top: 4rpx"
            />
            <text>全选</text>
        </view>
        <view class="total-view">
            <view
                v-if="!isManage"
                class="price-text"
            >
                <view style="margin-bottom: -2rpx">
                    <text
                        v-if="checkedProductList.length > 0"
                        class="count"
                        >已选{{ checkedProductList.length }}件，</text
                    ><text class="total">合计：</text>
                </view>
                <zd-price
                    :value="orderMoney"
                    :font-size-large="48"
                    :font-size-small="28"
                    :font-size-unit="20"
                />
            </view>
            <view class="button-view">
                <view
                    v-if="!isManage"
                    class="pay-btn"
                    :class="{ disabled: checkedProductList.length === 0 }"
                    @tap="onPay"
                >
                    去结算<text v-if="checkedProductList.length"
                        >({{ checkedProductList.length }})</text
                    >
                </view>

                <view
                    v-else
                    class="pay-btn outline"
                    :class="{ disabled: checkedProductList.length === 0 }"
                    @tap="removeAll"
                >
                    删除
                </view>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100rpx;
    padding: 0 20rpx;
    background-color: #fff;

    .checkbox {
        display: flex;
        align-items: center;
        color: $uni-color-paragraph;
        font-size: 28rpx;
        font-weight: 400;
        gap: 16rpx;
    }

    .total-view {
        display: flex;
        align-items: center;
        gap: 20rpx;

        .price-text {
            display: flex;
            align-items: flex-end;
            height: 40rpx;
            color: $uni-color-title;
            font-size: 24rpx;
            font-weight: 400;
            gap: 8rpx;
            line-height: 32rpx;

            .count {
                color: $uni-color-paragraph;
            }
            .total {
                color: $uni-color-title;
            }
        }

        .button-view {
            width: 212rpx;

            .pay-btn {
                width: 212rpx;
                height: 68rpx;
                border-radius: 36rpx;
                text-align: center;
                color: #ffffff;
                font-size: 28rpx;
                font-weight: 600;
                background: $zd-main-color;
                line-height: 68rpx;

                &.disabled {
                    opacity: 0.5;
                }

                &.outline {
                    border: 2rpx solid $zd-main-color;
                    color: $zd-main-color;
                    background: #ffffff;
                }
            }
        }
    }
}
</style>
