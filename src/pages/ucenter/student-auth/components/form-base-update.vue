<script setup lang="ts">
import type {
    Campus,
    StudentInfo,
    SubmitConsumerVerifyReq,
    UpdateStudentCampus
} from '@/api/student-auth/type';
import CampusSelect from '@/components/campus-select/index.vue';

import AddressSelect from '../../student-auth-update/components/address-select.vue';

const props = withDefaults(
    defineProps<{
        tabIndex: 1 | 2;

        defaultData?: StudentInfo;
    }>(),
    {
        tabIndex: 1
    }
);

const campusSelectRef = ref<InstanceType<typeof CampusSelect>>();

const form = reactive<Partial<UpdateStudentCampus>>({});
const selectCampus = ref<Campus>();
const selectCampusArea = ref([]);

watch(selectCampusArea, val => {
    form.campusAid = val[3];
});

function changeCampus(campus: Campus) {
    selectCampus.value = campus;
    form.campusName = campus.campusName;
    form.campusType = campus.campusId ? 0 : 1;
    form.campusId = campus.campusId ? campus.campusId + '' : '';
    form.campusAid = campus.campusAid + '';
}

/**
 * 表单校验
 * @param type 1: 在校学生，2:绿色通道
 */
function formvalidate(type: 1 | 2 = props.tabIndex): string | Partial<SubmitConsumerVerifyReq> {
    if (!form.campusName) {
        return '请选择校区';
    }

    if (!form.campusAid) {
        return '请选择校区所在地';
    }

    return form;
}

defineExpose({
    formvalidate
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
    <uni-list
        :border="false"
        class="list-container"
    >
        <uni-list-item
            v-model="form.campusName"
            class="list-item"
            title="校区"
            show-arrow
            :border="false"
            :right-text="selectCampus?.campusName ?? '请选择校区'"
            @tap="campusSelectRef?.open()"
        />
        <view class="divider"></view>

        <uni-list-item
            v-if="form.campusAid && form.campusType === 0"
            class="list-item"
            title="校区所在地"
            show-arrow
            :border="false"
            :right-text="
                (selectCampus?.campusCityName ?? '') + (selectCampus?.campusAreaName ?? '')
            "
        >
        </uni-list-item>
        <address-select
            v-else
            v-model="selectCampusArea"
            class="list-item"
        >
            <uni-list-item
                class="list-item"
                title="校区所在地"
                show-arrow
                :border="false"
                :right-text="
                    selectCampusArea[0] + selectCampusArea[1] + selectCampusArea[2] ||
                    '请选择校区所在地'
                "
            />
        </address-select>

        <view class="divider"></view>
    </uni-list>

    <campus-select
        ref="campusSelectRef"
        :school-id="props.defaultData?.schoolId"
        @change="changeCampus"
    ></campus-select>
</template>

<style scoped lang="scss">
.list-container {
    width: 100%;
    :deep(.uni-list) {
        display: flex;
        align-items: flex-end;
        width: 100%;
        flex-direction: column;
    }
    .list-item {
        width: 100%;
        height: 84rpx;
        :deep(.uni-list-item) {
            height: 84rpx;
        }
        :deep(.uni-list-item__container) {
            display: flex;
            align-items: center;
            padding: 0 !important;
        }
        :deep(.uni-icon-wrapper) {
            padding-right: 0;
        }
        :deep(input) {
            text-align: right;
        }
        :deep(.uni-list-item__content-title) {
            font-weight: bold;
        }
        :deep(.uni-list-item__extra-text) {
            display: block;
            overflow: hidden;
            max-width: 400rpx;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 28rpx;
        }
    }
    .divider {
        width: 475rpx;
        height: 2rpx;
        background-color: #f5f6f8;
    }
}

.tips-row {
    display: flex;
    justify-content: space-between;
    margin-top: 28rpx;
    color: #666;
    font-size: 24rpx;
    flex-direction: row;
    .feedback {
        text-decoration: underline;
        color: $zd-main-color;
    }
}
.tips-content {
    margin-top: 20rpx;
    margin-bottom: 40rpx;
    color: #999;
    font-size: 20rpx;
    line-height: 28rpx;
}

.upload-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 590rpx;
    min-height: 272rpx;
    padding: 28rpx;
    border: 2rpx solid #f2f5f7;
    border-radius: 12rpx;
    background: #ffffff;
    box-sizing: border-box;

    image {
        width: 550rpx;
    }
    .content {
        display: flex;
        width: 534rpx;
        height: 168rpx;
        padding: 16rpx;
        background: url(http://cdn.zsdx.cn/mp-cs/images/ucenter/student-auth/upload-bg.png);
        background-size: 100% 100%;
        box-sizing: border-box;
        view {
            display: flex;
            align-items: center;
            padding: 0 48rpx;
            text-align: center;
            color: #81c2fc;
            font-size: 24rpx;
            background-color: #eaf5ff;
        }
    }
    .upload-text {
        margin-top: 18rpx;
        color: #999;
        font-size: 28rpx;
    }
}
</style>
