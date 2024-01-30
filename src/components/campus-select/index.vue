<script setup lang="ts">
import type ZdPopup from '@zsdx/mp-material/dist/lib/components/zd-popup/index.vue';
import { debounce } from '@zsdx/mp-utils';
import { ref } from 'vue';

import { getSchoolCampusList } from '@/api/student-auth/index';
import type { Campus } from '@/api/student-auth/type';

const mode = ref<'select' | 'input'>('select');

const props = defineProps<{
    schoolId?: number;
}>();

const zdDrawerRef = ref<InstanceType<typeof ZdPopup> | null>(null);

const searchInput = ref('');

const activeItem = ref<Campus>();

const list = ref<Campus[]>([]);

const emits = defineEmits<{
    (e: 'change', item: Campus): void;
}>();

// watch(searchInput, _ => {
//     getList();
// });

watch(
    () => props.schoolId,
    _ => {
        getList();
    }
);

function open() {
    zdDrawerRef.value?.open();
    mode.value = 'select';
    getList();
}

function close() {
    zdDrawerRef.value?.close();
}

const getList = async function () {
    if (props.schoolId) {
        const resp = await getSchoolCampusList({
            schoolId: props.schoolId
        });
        list.value = resp;
    }
};

function select(item: Campus) {
    activeItem.value = item;
    emits('change', item);
    close();
}

function confirm() {
    emits('change', {
        campusName: searchInput.value
    } as Campus);
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
        ref="zdDrawerRef"
        type="bottom"
        header-text="选择校区"
    >
        <view class="search-bar">
            <uni-easyinput
                v-model="searchInput"
                :placeholder="mode === 'input' ? '请输入校区名称' : '查找校区'"
                closeable
            ></uni-easyinput>
        </view>
        <view
            v-if="mode === 'input'"
            class="tips"
        >
            注：如无校区，请填写本部
        </view>
        <scroll-view
            v-if="list?.length > 0 && mode === 'select'"
            scroll-y
            class="select-list"
        >
            <view
                v-for="item in list"
                :key="item.campusId"
                class="item ellipsis"
                :class="{
                    active: activeItem?.campusName === item.campusName
                }"
                @tap="select(item)"
            >
                <zd-keywords-text
                    :keywords="searchInput"
                    :value="item.campusName"
                ></zd-keywords-text>
            </view>
        </scroll-view>
        <view
            v-if="list?.length === 0"
            class="empty-container"
        >
            <image
                class="empty"
                src="http://cdn.zsdx.cn/mp-cs/images/ucenter/student-auth/empty.png"
                mode="widthFix"
            ></image>
        </view>
        <view
            v-if="mode === 'select'"
            class="empty-text"
            @tap="mode = 'input'"
        >
            没有你所在的校区?
        </view>
        <zd-button
            v-if="mode === 'input'"
            type="primary"
            class="confirm-btn"
            :disabled="!searchInput"
            @tap="confirm"
        >
            确认提交
        </zd-button>
    </zd-drawer-bottom>
</template>

<style scoped lang="scss">
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
.tips {
    margin-top: 20rpx;
    padding-left: 60rpx;
    color: $uni-text-color-placeholder;
    font-size: 24rpx;
}
.select-list {
    height: calc(66% - 200rpx);
    margin-top: 20rpx;
    flex: 1;
    .item {
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
}
.empty-text {
    margin-bottom: calc(env(safe-area-inset-bottom) + 10rpx);
    text-align: center;
    color: $zd-main-color;
    font-size: 28rpx;
}
.confirm-btn {
    position: absolute;
    bottom: calc(env(safe-area-inset-bottom));
    width: 680rpx;
    margin: 0 40rpx;
    box-sizing: border-box;
}
</style>
