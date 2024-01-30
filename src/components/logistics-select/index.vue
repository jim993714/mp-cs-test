<script setup lang="ts">
import type ZdPopup from '@zsdx/mp-material/dist/lib/components/zd-popup/index.vue';
import { ref } from 'vue';

import { getLogisticsList } from '@/api/order-after';
import type { LogisticsItem } from '@/api/order-after/types/order-after-list';
import debounce from '@/utils/tools/debounce';

const zdPopupRef = ref<InstanceType<typeof ZdPopup> | null>(null);

const searchInput = ref('');

const list = ref<LogisticsItem[]>([]);

const activeItem = ref<LogisticsItem>();

const emits = defineEmits<{
    (e: 'change', item: LogisticsItem): void;
}>();

watch(searchInput, val => {
    getList(val ? 0 : 1);
});

function open() {
    getList();
    zdPopupRef.value?.open();
}

function close() {
    zdPopupRef.value?.close();
}

const getList = debounce(async (type = 1) => {
    const resq = await getLogisticsList({
        type: 1,
        keyword: searchInput.value
    });
    list.value = resq.list;
}, 500);

function select(item: LogisticsItem) {
    activeItem.value = item;
    emits('change', item);
    close();
}

defineExpose({
    open,
    close
});
</script>
<script lang="ts">
export default {
    options: {
        styleIsolation: 'shared'
    }
};
</script>

<template>
    <zd-drawer-bottom
        ref="zdPopupRef"
        type="bottom"
        header-text="选择快递公司"
    >
        <view class="search-bar">
            <uni-easyinput
                v-model="searchInput"
                placeholder="搜索快递公司"
                closeable
            ></uni-easyinput>
        </view>
        <scroll-view
            v-if="list?.length > 0"
            scroll-y
            class="select-list"
        >
            <view
                v-for="item in list"
                :key="item.logisticsNo"
                class="item"
                :class="{
                    active: activeItem?.logisticsNo === item.logisticsNo
                }"
                @tap="select(item)"
            >
                <zd-keywords-text
                    :keywords="searchInput"
                    :value="item.name"
                ></zd-keywords-text>
            </view>
        </scroll-view>
        <view
            v-if="list?.length === 0 && searchInput"
            class="empty-container"
        >
            <image
                class="empty"
                src="http://cdn.zsdx.cn/mp-cs/images/ucenter/student-auth/empty.png"
                mode="widthFix"
            ></image>
            <view class="empty-text"> 未找到相关快递公司 </view>
        </view>
    </zd-drawer-bottom>
</template>

<style scoped lang="scss">
.container {
    z-index: 300;
    display: flex;
    justify-content: flex-start;
    width: 750rpx;
    background-color: #fff;
    flex-direction: column;
    border-top-left-radius: 32rpx;
    border-top-right-radius: 32rpx;
    .header {
        height: 120rpx;
        line-height: 120rpx;
        text-align: center;
        .close {
            position: absolute;
            top: 0rpx;
            right: 0rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 108rpx;
            height: 120rpx;
            color: $uni-text-color-placeholder;
            text {
                width: 36rpx;
                height: 36rpx;
            }
        }
    }
    .search-bar {
        padding: 0 40rpx;
        :deep(.uni-easyinput__content) {
            height: 64rpx;
            padding-left: 20rpx;
            border: none;
            border-radius: 32rpx;
            background-color: $uni-text-color-inverse !important;
        }
    }

    .select-list {
        height: calc(66% - 200rpx);
        margin-top: 20rpx;
        flex: 1;
        .item {
            width: 100%;
            height: 96rpx;
            padding: 0 40rpx;
            color: $uni-text-color;
            font-size: 28rpx;
            line-height: 96rpx;
        }
        .active {
            background-color: rgba($color: $zd-main-color, $alpha: 0.1);
        }
    }

    .empty-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 750rpx;
        margin-top: 146rpx;
        .empty {
            width: 450rpx;
            height: 250rpx;
        }
        .empty-text {
            color: $uni-text-color-placeholder;
            font-size: 28rpx;
        }
    }
}
</style>
