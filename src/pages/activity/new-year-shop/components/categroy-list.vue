<script setup lang="ts">
import type ZdPopup from '@zsdx/mp-material/dist/lib/components/zd-popup/index.vue';

import { getCategoryList } from '@/api/activity/new-year-shop';

const instance = getCurrentInstance();
const activeIndex = ref(0);
const categroyList = ref<Array<any>>([]);
const popupRef = ref<typeof ZdPopup | null>(null);
const popupTop = ref(0);
const popupVisible = ref(false);
const top = ref(0);

const props = defineProps<{
    activityNo: string;
}>();

defineExpose({
    close
});

function close(e?: any) {
    popupRef.value?.close();
    popupVisible.value = false;
    emits('visible', false);
}

const emits = defineEmits<{
    (e: 'change', id: string): void;
    (e: 'visible', show: boolean): void;
}>();

async function getList() {
    try {
        const resp = await getCategoryList({
            activityNo: props.activityNo,
            size: 1000,
            scrollId: ''
        });
        const list = resp.list;
        categroyList.value = list;
    } catch (err) {
        uni.showToast({
            icon: 'none',
            message: err
        });
    }
}

async function showMore() {
    emits('visible', true);
    setTimeout(async () => {
        await uni.pageScrollTo({
            duration: 100,
            scrollTop: uni.upx2px(600 - 20) - top.value
        });
        const query = uni.createSelectorQuery().in(instance);
        query
            .select('#showmore')
            .boundingClientRect((data: any) => {
                console.log(data.top);
                popupTop.value = data.top;
            })
            .exec();
        popupVisible.value = true;
        popupRef.value?.open?.('top');
    }, 200);
}

function select(idx: number) {
    activeIndex.value = idx;
    emits('change', categroyList.value[idx].customNo);
    close();
}

onMounted(() => {
    getList();
    top.value = (uni.getSystemInfoSync()?.statusBarHeight ?? 0) + uni.upx2px(88);
});
</script>

<template>
    <view
        v-if="categroyList.length > 1"
        class="categroy-wrapper"
        :style="{
            'border-radius': popupVisible ? 0 : '20rpx',
            top: top + 'px'
        }"
    >
        <scroll-view
            class="categroy-scroll"
            scroll-x
            :scroll-into-view="'#categroy-' + (activeIndex - 2 < 0 ? 0 : activeIndex - 2)"
            scroll-with-animation
        >
            <view class="categroy">
                <view
                    v-for="(item, index) in categroyList"
                    :id="'categroy-' + index"
                    :key="index"
                    class="categroy-item"
                    :class="{ active: activeIndex === index }"
                    @tap="select(index)"
                >
                    <view>{{ item.title }}</view>
                    <view
                        v-if="activeIndex === index"
                        class="line"
                    ></view>
                </view>
            </view>
        </scroll-view>
        <view
            v-if="categroyList.length > 5"
            id="showmore"
            class="gradient-wrapper"
            @tap="showMore"
        >
            <zd-icon
                type="zdmp-zhankai"
                color="red"
            />
        </view>
    </view>
    <uni-popup
        ref="popupRef"
        @maskClick="close"
    >
        <view
            class="popup-wrapper"
            :style="{
                right: '8rpx',
                top: popupTop + 54 + 'px'
            }"
        >
            <view class="header">
                分类
                <view class="arrow"></view>
            </view>
            <scroll-view
                scroll-y
                class="content-scroll"
                scroll-with-animation
                :scroll-into-view="'#popup-list-item-' + (activeIndex - 2)"
            >
                <view class="content-list">
                    <view
                        v-for="(item, index) in categroyList"
                        :id="'popup-list-item-' + index"
                        :key="index"
                        class="list-item"
                        :class="{
                            'list-item-active': activeIndex === index
                        }"
                        @tap="select(index)"
                    >
                        {{ item.title }}
                    </view>
                </view>
            </scroll-view>
        </view>
    </uni-popup>
</template>

<style scoped lang="scss">
.categroy-wrapper {
    position: sticky;
    top: 180rpx;
    z-index: 100;
    overflow: hidden;
    width: 750rpx;
    margin-left: -20rpx;
    border-radius: 20rpx;
}
.categroy-scroll {
    width: 100%;
    height: 100%;
}
.categroy {
    display: flex;
    justify-content: space-around;
    width: 710rpx;
    width: max-content;
    min-width: 710rpx;
    height: 88rpx;
    margin-bottom: 10rpx;
    background-color: #f5f8fa;
    flex-direction: row;
    box-sizing: border-box;
    .categroy-item {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 142rpx;
        height: 88rpx;
        text-align: center;
        color: $uni-color-title;
        font-size: 28rpx;
        flex-direction: column;
        box-sizing: border-box;
        flex: 1;
    }
    .active {
        font-size: 32rpx;
        font-weight: bold;
    }
    .line {
        width: 40rpx;
        height: 6rpx;
        margin-top: 10rpx;
        margin-bottom: -10rpx;
        border-radius: 3rpx;
        background-color: $zd-color-red;
    }
}
.gradient-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    width: 100rpx;
    height: 88rpx;
    padding-right: 20rpx;
    box-sizing: border-box;
    text-align: right;
    background: linear-gradient(to right, rgba(#f5f8fa, 0), #f5f8fa, #f5f8fa);
    line-height: 88rpx;
}

.popup-wrapper {
    position: absolute;
    top: 200rpx;
    right: 100rpx;
    width: 512rpx;
    height: 605rpx;
    border-radius: 32rpx;
    background-color: #f5f8fa;

    .header {
        position: relative;
        height: 88rpx;
        padding-left: 40rpx;
        font-size: 28rpx;
        font-weight: bold;
        line-height: 88rpx;
        box-sizing: border-box;
        .arrow {
            position: absolute;
            top: -10rpx;
            right: 30rpx;
            width: 0;
            height: 0;
            border-right: 10rpx solid transparent;
            border-bottom: 10rpx solid #f5f8fa;
            border-left: 10rpx solid transparent;
        }
    }
    .content-scroll {
        height: 448rpx;
        .content-list {
            display: flex;
            justify-content: space-between;
            width: 100%;
            padding: 0 30rpx;
            flex-direction: row;
            flex-wrap: wrap;
            box-sizing: border-box;
            .list-item {
                width: 210rpx;
                height: 68rpx;
                margin-bottom: 20rpx;
                border: 2rpx solid #fff;
                border-radius: 34rpx;
                text-align: center;
                font-size: 24rpx;
                background-color: #fff;
                line-height: 68rpx;
            }
            .list-item-active {
                border: 2rpx solid $zd-color-red;
                color: $zd-color-red;
            }
        }
    }
}
</style>
