<script setup lang="ts">
import { getMyPacketList } from '@/api/redpacket';
import { CardStatus, type PacketResult, type PackResult } from '@/api/redpacket/types';

import AllowanceItem from './components/allowance-item/index.vue';
import CouponItem from './components/coupon-item/index.vue';
import PacketItem from './components/packet-item/index.vue';
import RadioGroup from './components/radio-group/index.vue';
import { getCommonList, radios } from './constants';
import { Tab } from './types';

const studentShopId = uni.getStorageSync('studentShopId');

const props = withDefaults(
    defineProps<{
        tab?: Tab;
        isVisible?: boolean;
    }>(),
    {
        tab: Tab.Coupon,
        isVisible: false
    }
);

const cur = ref<CardStatus>(CardStatus.Unused + 1);

const url = computed(() => {
    return getCommonList(props.tab);
});

const params = computed(() => {
    return {
        type: cur.value,
        studentShopId
    };
});

const _dataList = ref<any[]>([]);

const dataList = computed({
    set(val: any) {
        if (props.tab === Tab.Package) {
            _dataList.value = val.filter((item: any) => item.packageCouponDTOS.length);
        } else {
            _dataList.value = val;
        }
    },
    get() {
        return _dataList.value;
    }
});
</script>

<template>
    <view class="red-packet-list">
        <view class="red-packet-list-radios">
            <RadioGroup
                v-model="cur"
                :options="radios"
            />
        </view>
        <view class="red-packet-list-content">
            <zd-list
                v-model="dataList"
                :open-refresh="true"
                :params="params"
                :url="url"
                :enhanced="false"
            >
                <template #default="{ item }">
                    <template v-if="props.tab === Tab.Coupon">
                        <CouponItem
                            :item="item"
                            :type="props.tab"
                        />
                    </template>
                    <template v-if="props.tab === Tab.Package">
                        <view class="red-packet-list-content-pack">
                            <view class="red-packet-list-content-pack-title">校园店新粉券包</view>
                            <CouponItem
                                v-for="(subItem, i) in item.packageCouponDTOS"
                                :key="i"
                                :item="subItem"
                                :type="props.tab"
                            />
                        </view>
                    </template>
                    <template v-if="props.tab === Tab.Packet || props.tab === Tab.CommunityPacket">
                        <PacketItem
                            :item="item"
                            :type="props.tab"
                        />
                    </template>
                    <template v-if="props.tab === Tab.Allowance">
                        <AllowanceItem
                            :item="item"
                            :type="props.tab"
                        />
                    </template>
                </template>
                <template #empty>
                    <zd-empty
                        :image-width="450"
                        :image-height="250"
                        description="暂无优惠券哦～"
                        image="https://nss1.zsdx.cn/mp-cs/images/ucenter/empty-coupon.png"
                    />
                </template>
            </zd-list>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.red-packet-list {
    display: flex;
    flex-direction: column;
    height: 100%;

    &-radios {
        padding: 12rpx 30rpx;
        box-sizing: border-box;
    }

    &-content {
        width: auto;
        flex: 1;
        height: calc(100% - 80rpx);
        background: $uni-text-color-inverse;

        &__empty {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
        }

        &-pack {
            width: calc(100% - 40rpx);
            margin: 20rpx 0 20rpx 20rpx;
            padding-bottom: 20rpx;
            border-radius: 20rpx;
            background: #fff;

            &-title {
                margin-bottom: 40rpx;
                padding: 40rpx 0 0 40rpx;
                color: $uni-text-color;
                font-size: 28rpx;
                font-weight: 500;
                line-height: 28rpx;
                box-sizing: border-box;
            }
        }
    }
}
</style>
