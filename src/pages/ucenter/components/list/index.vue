<script setup lang="ts">
import { onReachBottom } from '@dcloudio/uni-app';
import { getCurrentInstance } from 'vue';

const props = defineProps<{
    list: any[];
    customKey: string;
    loadText: string;
}>();

const emits = defineEmits<{
    (event: 'updateHeight', val: number): void;
    (event: 'loadMore'): Promise<void>;
}>();

let isBusy = false;
const comp = getCurrentInstance();

onReachBottom(async () => {
    if (!isBusy) {
        isBusy = true;
        await emits('loadMore');
        isBusy = false;
    }
});

watch(
    () => props.list,
    async () => {
        setTimeout(() => {
            const selector = uni.createSelectorQuery();
            selector
                .in(comp)
                .select('.goods-list')
                .boundingClientRect(res => {
                    //@ts-ignore
                    emits('updateHeight', res.height);
                })
                .exec();
        });
    },
    {
        immediate: true
    }
);
</script>

<script lang="ts">
export default {
    options: {
        multipleSlots: true,
        styleIsolation: 'shared',
        addGlobalClass: true,
        virtualHost: true
    }
};
</script>
<template>
    <view class="goods-list">
        <template v-if="list.length">
            <slot
                v-for="item in list"
                :key="item[customKey]"
                :item="item"
            />
            <view class="goods-list-tips">
                {{ loadText }}
            </view>
        </template>
        <view
            v-else
            class="good-list__empty"
        >
            <zd-empty
                :image-width="450"
                :image-height="250"
                description="暂无可使用优惠券的商品哦～"
                image="https://nss1.zsdx.cn/mp-cs/images/ucenter/empty-goods.png"
            />
        </view>
    </view>
</template>

<style scoped lang="scss">
.goods-list {
    padding-bottom: calc(env(safe-area-inset-bottom));

    &__empty {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }
    &-tips {
        width: 750rpx;
        height: 114rpx;
        text-align: center;
        color: $uni-color-paragraph;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 114rpx;
    }
}
</style>
