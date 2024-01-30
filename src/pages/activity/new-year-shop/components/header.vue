<script setup lang="ts">
import { router } from '@/utils/router/useRouter';

import SearchBar from './search-bar.vue';

defineProps<{
    activityNo: string;
    showBg: Boolean;
}>();

const showHome = ref(false);

onMounted(() => {
    const pages = getCurrentPages();
    showHome.value = pages.length === 1;
});

function toHome() {
    uni.$emit('goIndex');
}
</script>

<template>
    <zd-header
        title=""
        color="red"
        show-header-left
        class="zd-header"
        show-fixed
        :fix-background="showBg ? '#f5f8fa' : 'transparent'"
        fix-color="#fff"
    >
        <template #fix-set>
            <view class="header">
                <zd-icon
                    v-if="showHome"
                    type="zdmp-huidaoshouye"
                    :size="36"
                    class="left-icon"
                    :style="{
                        color: showBg ? '#292f33' : '#fff'
                    }"
                    @tap="toHome"
                />
                <zd-icon
                    v-else
                    type="zdmp-fanhui"
                    :size="36"
                    class="left-icon"
                    :style="{
                        color: showBg ? '#292f33' : '#fff'
                    }"
                    @tap="router.back()"
                />
                <view
                    :style="{
                        paddingLeft: '20rpx',
                        paddingBottom: '12rpx',
                        marginTop: '-12rpx'
                    }"
                >
                    <search-bar :activity-no="activityNo" />
                </view>
            </view>
        </template>
    </zd-header>
</template>

<style scoped lang="scss">
.zd-header {
    z-index: 100;
    .header {
        top: 0;
        display: flex;
        align-items: center;
        height: 100rpx;
        padding-left: 20rpx;
        color: $uni-color-title;
        .left-icon {
            margin-top: -20rpx;
        }
        .title {
            margin-left: 20rpx;
            image {
                width: 252rpx;
            }
        }
    }
}
</style>
