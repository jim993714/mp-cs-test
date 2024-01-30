<script setup lang="ts">
import { getZoneAreaList } from '@/api/activity/company-subsidy/index';
import { getConfigStyle } from '@/api/activity/discount-area/index';
import { getGoodsList } from '@/api/activity/new-year-shop';
import { fetchBaseInfo } from '@/api/activity/one-cent-purchase';
import { getZoneConfig } from '@/api/activity/pk-zone';
import { getRule } from '@/api/activity/shopping-cashback';
import { getHireQualification } from '@/api/goods-detail';

import { RulesType } from './types';

const params = ref<any>();
const type = ref<RulesType>(RulesType.NONE);
const imageList = ref<string[]>();

async function getConfig() {
    switch (type.value) {
        case RulesType.PK_ZONE:
            imageList.value = (await getZoneConfig(JSON.parse(params.value).activityNo)).imageList;
            break;
        case RulesType.SUMMER_ZONE:
            imageList.value = (await getZoneAreaList(params.value)).ruleImagesList;
            break;
        case RulesType.ONE_CENT_PURCHASE:
            imageList.value = (await fetchBaseInfo()).ruleImages;
            break;
        case RulesType.SHOPPING_CASHBACK:
            imageList.value = (await getRule()).imagesRule;
            break;
        case RulesType.MERCHANT_QUA:
            uni.setNavigationBarTitle({
                title: '资质证照'
            });
            imageList.value = (await getHireQualification(params.value)).list;
            break;
        case RulesType.DISCOUNT_AREA:
            imageList.value = (await getConfigStyle(params.value.activityNo)).ruleImages;
            break;
        case RulesType.NEW_YEAR_SHOP:
            // TODO 年货节接口
            imageList.value = (
                await getGoodsList({
                    activityNo: params.value.activityNo,
                    size: 1
                })
            ).rules;
            break;
    }
}

onLoad(options => {
    type.value = options?.type;
    params.value = JSON.parse(decodeURIComponent(options?.params));
    getConfig();
});
</script>

<template>
    <view class="rules">
        <image
            v-for="(item, index) in imageList"
            :key="index"
            class="rule-image"
            :src="item"
            mode="widthFix"
        />
    </view>
</template>

<style lang="scss" scoped>
.rules {
    .rule-image {
        display: block;
        width: 750rpx;
    }
}
</style>
