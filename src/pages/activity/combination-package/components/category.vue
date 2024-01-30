<script setup lang="ts">
import type { ICategory } from '@/api/activity/combination-package/types';

const props = defineProps<{
    categoryList: ICategory[];
    scrollLeft: number;
}>();

/**  点击分类 */

const changeCategory = (item: ICategory, index: number) => {
    item.index = index;
    emit('changeCategory', item);
};

/**  显示分类弹窗 */
const showCategoryDialog = () => {
    emit('showCategoryDialog');
};

const emit = defineEmits(['changeCategory', 'showCategoryDialog']);
</script>
∏
<template>
    <view class="category-warp">
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
                :class="{ active: item.isActive }"
                @tap.prevent="changeCategory(item, index)"
            >
                {{ item.categoryName }}
            </view>
        </scroll-view>
        <view
            class="category-tag-box"
            @tap.prevent="showCategoryDialog"
        >
            <image
                class="category-tag"
                src="https://cdn.zsdx.cn/mp-cs/images/activity/combination-package/cate-tag.png"
                mode="scaleToFill"
            />
            <text class="zdfont zdmp-zhankai category-tag-icon"></text>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.category-warp {
    position: sticky;
    left: 0;
    width: 750rpx;
    height: 76rpx;
    background: #ffe9d9;
    .category-tag-box {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 76rpx;
        height: 76rpx;
        .category-tag {
            position: absolute;
            top: 0;
            left: 0;
            width: 76rpx;
            height: 76rpx;
        }
        .category-tag-icon {
            position: relative;
            color: #999999;
            font-size: 28rpx;
        }
    }

    .scroll-view {
        display: flex;
        width: 680rpx;
        height: 76rpx;
        .cate-item {
            margin-left: 30rpx;
            color: #ff501c;
            font-size: 28rpx;
            font-weight: 500;
            flex-shrink: 0;
            align-self: center;
            line-height: 28rpx;
            background: transparent;
        }
        .active {
            padding: 16rpx 44rpx;
            border-radius: 68rpx;
            color: #ffffff;
            background: #ff501c;
        }
    }

    .btn {
        border: 1px solid red;
    }
}
</style>
