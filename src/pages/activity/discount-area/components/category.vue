<script setup lang="ts">
import type { ICategory } from '@/api/activity/combination-package/types';
import type { ISearchList } from '@/api/activity/discount-area/types';

import priceRange from './price-range.vue';

const props = defineProps<{
    categoryList?: ICategory[];
    searchList?: ISearchList[];
    scrollLeft: number;
    color?: string;
}>();
const instance = getCurrentInstance();
const categoryTop = ref(0);
/**  点击分类 */

const changeCategory = (item: ICategory, index: number) => {
    item.index = index;
    emit('changeCategory', item);
};

const changeSearchList = (item: ISearchList) => {
    emit('changeSearchList', item);
};

/**  显示分类弹窗 */
const showCategoryDialog = async () => {
    emit('showCategoryDialog');
};

const emit = defineEmits(['changeCategory', 'changeSearchList', 'showCategoryDialog']);
</script>
<template>
    <view
        class="category-warp"
        :style="{ height: props?.searchList?.length ? '164rpx' : '88rpx' }"
    >
        <scroll-view
            scroll-x
            class="scroll-view"
            :show-scrollbar="false"
            :scroll-left="props.scrollLeft"
            :scroll-with-animation="true"
            :enable-flex="true"
        >
            <view
                v-for="(item, index) in props.categoryList"
                :key="index"
                class="cate-item"
                :style="{ color: item.isActive ? props.color : '#292f33' }"
                @tap.prevent="changeCategory(item, index)"
            >
                {{ item.categoryName }}
                <view class="cate-item-name"></view>
                <view
                    v-if="item.isActive"
                    :style="{ background: props.color }"
                    class="cate-item-line"
                ></view>
                <view
                    v-else
                    class="item-line-set"
                ></view>
            </view>
        </scroll-view>
        <view
            class="category-tag-box"
            @tap.prevent="showCategoryDialog"
        >
            <image
                id="categoryTag"
                class="category-tag"
                src="https://cdn.zsdx.cn/mp-cs/images/activity/discount-area/cate-tag.png"
                mode="scaleToFill"
            />
            <text
                class="zdfont zdmp-zhankai category-tag-icon"
                :style="{ color: props.color }"
            ></text>
        </view>
        <price-range
            v-if="props.searchList?.length"
            :color="props.color"
            :search-list="props.searchList"
            @change-search-list="changeSearchList"
        ></price-range>
    </view>
</template>

<style lang="scss" scoped>
.category-warp {
    position: sticky;
    left: 0;
    width: 750rpx;
    background: #f5f8fa;
    .category-tag-box {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100rpx;
        height: 88rpx;
        .category-tag {
            position: absolute;
            top: 0;
            left: 0;
            width: 100rpx;
            height: 88rpx;
        }
        .category-tag-icon {
            position: relative;
            margin-right: 28rpx;
            margin-bottom: 16rpx;
            font-size: 24rpx;
        }
    }

    .scroll-view {
        display: flex;
        width: 700rpx;
        height: 88rpx;

        .cate-item {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 88rpx;
            margin-left: 40rpx;
            flex-direction: column;
            flex-shrink: 0;
            box-sizing: border-box;
            .cate-item-name {
                color: #292f33;
                font-size: 28rpx;
                font-weight: 500;
                align-self: center;
                line-height: 28rpx;
                background: transparent;
            }
            .cate-item-line {
                width: 40rpx;
                height: 6rpx;
                margin-top: 10rpx;
                border-radius: 3rpx;
            }
            .item-line-set {
                width: 40rpx;
                height: 6rpx;
                margin-top: 10rpx;
                background: transparent;
            }
        }
    }
}
</style>
