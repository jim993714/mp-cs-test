<script setup lang="ts">
import type ZdPopup from '@zsdx/mp-material/dist/lib/components/zd-popup/index.vue';
import { debounce } from '@zsdx/mp-utils';
import { ref } from 'vue';

import { getClooegeClassList, getSchoolCollegeList } from '@/api/student-auth/index';
import type { College } from '@/api/student-auth/type';

const props = defineProps<{
    schoolId?: number;
}>();

const zdDrawerRef = ref<InstanceType<typeof ZdPopup> | null>(null);

const searchInput = ref('');

const activeItem = ref<College>();

const list = ref<College[]>([]);

const cur = ref(0);

const emits = defineEmits<{
    (e: 'change', item: College): void;
}>();

watch(searchInput, _ => {
    getList();
});

watch(
    () => props.schoolId,
    _ => {
        getList();
    }
);

function open() {
    zdDrawerRef.value?.open();
}

function close() {
    zdDrawerRef.value?.close();
}

const getList = async function () {
    if (props.schoolId) {
        const resp = await getSchoolCollegeList({
            schoolId: props.schoolId,
            keyword: searchInput.value
        });
        list.value = resp;
    }
};

async function select(item: College) {
    activeItem.value = item;

    emits('change', item);
    close();
}

function confirm() {
    emits('change', {
        collegeNo: searchInput.value
    } as College);
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
        header-text="选择学院"
    >
        <view class="search-bar">
            <uni-easyinput
                v-model="searchInput"
                placeholder="请输入学院名称"
                closeable
            ></uni-easyinput>
        </view>

        <swiper class="swiper">
            <swiper-item>
                <scroll-view
                    v-if="list?.length > 0"
                    scroll-y
                    class="select-list"
                >
                    <view
                        v-for="item in list"
                        :key="item.collegeNo"
                        class="item"
                        :class="{
                            active: activeItem?.collegeName === item.collegeName
                        }"
                        @tap="select(item)"
                    >
                        <zd-keywords-text
                            :keywords="searchInput"
                            :value="item.collegeName"
                        ></zd-keywords-text>
                    </view>
                </scroll-view>
            </swiper-item>
            <!-- <swiper-item>
                <scroll-view
                    v-if="list?.length > 0"
                    scroll-y
                    class="select-list"
                >
                    <view
                        v-for="item in list"
                        :key="item.collegeNo"
                        class="item"
                        :class="{
                            active: activeItem?.collegeName === item.collegeName
                        }"
                        @tap="select(item)"
                    >
                        <zd-keywords-text
                            :keywords="searchInput"
                            :value="item.collegeName"
                        ></zd-keywords-text>
                    </view>
                </scroll-view>
            </swiper-item>
            -->
        </swiper>

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

.swiper {
    height: calc(100% - 200rpx);
}
.select-list {
    height: 100%;
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
    text-align: center;
    color: $zd-main-color;
    font-size: 28rpx;
}
.confirm-btn {
    position: absolute;
    bottom: 88rpx;
    width: 680rpx;
    margin: 0 40rpx;
    box-sizing: border-box;
}
</style>
