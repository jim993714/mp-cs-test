<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { deleteAddress } from '@/api/address';
import type { AddressItem } from '@/api/address/types';
import { AddressType } from '@/api/address/types';

const props = defineProps<{
    item: AddressItem;
    extra?: string;
}>();

const emits = defineEmits<{
    (event: 'delete'): void;
    (event: 'edit'): void;
}>();

let lastX = 0;
const x = ref(0);
const height = ref(0);
const instance = getCurrentInstance();

function gotoAdd(e: Event) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();

    if (props.item.type === AddressType.School) {
        emits('edit');
    } else {
        router.push('addAddress', {
            type: props.item.type,
            id: props.item.id
        });
    }
}

async function onRemove() {
    uni.showModal({
        content: '确认删除该地址吗？',
        confirmText: '确定',
        confirmColor: '#199FFF',
        cancelColor: '#8A9399',
        success: async result => {
            if (result.confirm) {
                await deleteAddress({
                    id: props.item.id
                });
                emits('delete');
                uni.showToast({
                    title: '删除成功'
                });
            }
        }
    });
}

function onTouchMove(e: any) {
    lastX = e.detail.x;
}

function onTouchEnd() {
    if (Math.abs(lastX) > uni.upx2px(54)) {
        if (x.value === -uni.upx2px(108)) {
            x.value = -uni.upx2px(108) - 0.01;
        } else {
            x.value = -uni.upx2px(108);
        }
    } else {
        if (x.value === 0.01) {
            x.value = -0.01;
        } else {
            x.value = 0.01;
        }
    }
}

watch(
    () => props.item.detailInfo,
    async () => {
        await nextTick();
        uni.createSelectorQuery()
            .in(instance)
            .select('.address-item')
            .boundingClientRect(res => {
                height.value = (res as UniApp.NodeInfo).height!;
            })
            .exec();
    },
    {
        immediate: true
    }
);
</script>

<template>
    <view class="wrapper">
        <movable-area :style="{ height: `${height}px` }">
            <view class="wrapper-delete">
                <zd-icon
                    type="zdmp-shanchu"
                    color="#fff"
                    :size="32"
                />
                <view
                    class="wrapper-delete-text"
                    @tap.stop="onRemove"
                    >删除</view
                >
            </view>
            <movable-view
                :x="x"
                :damping="40"
                :disabled="item.type === AddressType.School"
                inertia
                direction="horizontal"
                @change="onTouchMove"
                @touchend="onTouchEnd"
                @touchcancel="onTouchEnd"
            >
                <view
                    :class="{
                        'address-item': true,
                        'address-item__school': item.type === AddressType.School
                    }"
                >
                    <view
                        v-if="item.type === AddressType.School"
                        class="address-item-school"
                        >{{ extra }}</view
                    >
                    <view class="address-item-header">
                        <template v-if="item.type === AddressType.Normal">
                            <view
                                v-if="item.isDefault"
                                class="address-item-header__default"
                                >默认</view
                            >
                        </template>
                        <view class="address-item-header-title">{{ item.userName }}</view>
                        <view class="address-item-header-mobile">{{ item.phone }}</view>
                        <view
                            class="address-item-header-edit"
                            @tap.stop="gotoAdd"
                        >
                            <zd-icon
                                type="zdmp-bianji"
                                color="#199fff"
                                :size="32"
                            />
                        </view>
                    </view>
                    <view
                        :class="{
                            'address-item-content': true
                        }"
                    >
                        <template v-if="item.type === AddressType.Normal">
                            {{ item.provinceName }} {{ item.cityName }}
                            {{ item.countyName }} </template
                        >{{ item.detailInfo }}
                    </view>
                </view>
            </movable-view>
        </movable-area>
    </view>
</template>

<style scoped lang="scss">
.wrapper {
    position: relative;
    padding-top: 20rpx;
    box-sizing: border-box;

    movable-area {
        position: relative;
        left: -88rpx;
        width: 818rpx;
        height: 204rpx;

        > movable-view {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 108rpx;
            width: 710rpx;
        }

        .wrapper-delete {
            position: absolute;
            top: 2rpx;
            right: 2rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 128rpx;
            height: calc(100% - 4rpx);
            border-radius: 0 16rpx 16rpx 0;
            color: #fff;
            background: #ff4734;
            flex-direction: column;
            gap: 8rpx;

            &-text {
                font-size: 24rpx;
                font-weight: 400;
            }
        }
    }
}

.address-item {
    width: 710rpx;
    min-height: 164rpx;
    max-height: 204rpx;
    padding: 36rpx 30rpx;
    border-radius: 16rpx;
    background: #fff;
    box-sizing: border-box;

    &__school {
        min-height: 204rpx;
        max-height: 260rpx;
    }

    &-school {
        height: 40rpx;
        margin-bottom: 20rpx;
        color: #292f33;
        font-size: 28rpx;
        font-weight: 400;
    }

    &-header {
        position: relative;
        display: flex;
        align-items: center;
        padding-right: 60rpx;

        &__default {
            width: 60rpx;
            height: 32rpx;
            margin-right: 10rpx;
            border-radius: 18rpx;
            text-align: center;
            color: #f95b56;
            font-size: 20rpx;
            font-weight: 500;
            background: rgba($color: #f95b56, $alpha: 0.1);
            line-height: 32rpx;
        }

        &__replace {
            width: 60rpx;
            height: 32rpx;
            margin-left: 10rpx;
            border-radius: 18rpx;
            text-align: center;
            color: #2fb67d;
            font-size: 20rpx;
            font-weight: 500;
            background: rgba($color: #2fb67d, $alpha: 0.1);
            line-height: 32rpx;
        }

        &-title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: $uni-text-color;
            font-size: 32rpx;
            font-weight: 500;
            line-height: 32rpx;
        }

        &-mobile {
            margin-left: 24rpx;
            color: $uni-text-color;
            font-size: 32rpx;
            font-weight: 500;
            line-height: 32rpx;
        }

        &-edit {
            position: absolute;
            right: 0;
        }
    }

    &-content {
        display: -webkit-box;
        overflow: hidden;
        max-height: 80rpx;
        margin-top: 26rpx;
        text-overflow: ellipsis;
        color: $uni-color-paragraph;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 40rpx;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
    }
}
</style>
