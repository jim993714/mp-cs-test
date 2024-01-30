<script setup lang="ts">
import type ZdPopup from '@zsdx/mp-material/dist/lib/components/zd-popup/index.vue';
import { ref } from 'vue';

import { getSchoolSuggest } from '@/api/student-auth/index';
import type { School } from '@/api/student-auth/type';
import debounce from '@/utils/tools/debounce';

const zdPopupRef = ref<InstanceType<typeof ZdPopup> | null>(null);

const searchInput = ref('');

const list = ref<School[]>([]);

const activeItem = ref<School>();

const emits = defineEmits<{
    (e: 'change', item: School): void;
}>();

watch(searchInput, _ => {
    getList();
});

function open() {
    if (!searchInput.value) list.value = [];
    zdPopupRef.value?.open();
}

function close() {
    zdPopupRef.value?.close();
}

const getList = debounce(async () => {
    if (!searchInput.value) return (list.value = []);
    const resq = await getSchoolSuggest({
        keyword: searchInput.value
    });
    list.value = resq;
}, 1000);

function select(item: School) {
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
        header-text="选择学校"
    >
        <view class="search-bar">
            <uni-easyinput
                v-model="searchInput"
                placeholder="查找学校"
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
                :key="item.id"
                class="item"
                :class="{
                    active: activeItem?.id === item.id
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
            <view class="empty-text"> 啊哦～没有找到对应的学校哦～ </view>
        </view>
    </zd-drawer-bottom>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 750rpx;
    background-color: #fff;
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
