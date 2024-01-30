<script setup lang="ts">
import ZdImagePicker from '@zsdx/mp-material/dist/lib/components/zd-image-picker/index.vue';
import { isIdNumber, router } from '@zsdx/mp-utils';

import { uploadImage } from '@/api/common';
import type {
    Campus,
    College,
    School,
    StudentInfo,
    SubmitConsumerVerifyReq
} from '@/api/student-auth/type';
import CampusSelect from '@/components/campus-select/index.vue';
import SchoolSelect from '@/components/school-select/index.vue';

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
const schoolSelectRef = ref<InstanceType<typeof SchoolSelect>>();
const zdImagePickerRef = ref<InstanceType<typeof ZdImagePicker>>();

const form = reactive<Partial<SubmitConsumerVerifyReq>>({});
const selectSchool = ref<School>();
const selectCampus = ref<Campus>();
const mode = ref<'edit' | 'display' | 'update'>('edit');
const emits = defineEmits<{
    (e: 'validate', result: string | Partial<SubmitConsumerVerifyReq>): void;
}>();

watch(
    () => props.defaultData,
    val => {
        if (val?.studentChangeDTO?.verify === 1) {
            mode.value = 'display';
            form.idNumber = val?.idNumber;
            form.realName = val?.realName;
            selectCampus.value = {
                campusName: val.studentChangeDTO?.campusName || val.campusName
            } as Campus;
            selectSchool.value = {
                name: val.studentChangeDTO?.schoolName || val.schoolName
            } as School;

            form.images = val.images;
        }
    }
);

watch(form, val => {
    const resp = formvalidate();
    emits('validate', resp);
});

function changeSchool(school: School) {
    form.schoolId = parseInt(school.id);
    selectSchool.value = school;
}

function changeCampus(campus: Campus) {
    selectCampus.value = campus;
    form.campusName = campus.campusName;
    form.campusId = campus.campusId;
    form.campusType = campus.campusId ? 0 : 1;
}

function selectImage() {
    zdImagePickerRef.value?.open();
}

function feedback() {
    router.push('studentAuthReport', {});
}

async function imageChange(images: any[]) {
    const { url } = await uploadImage(images[0].tempFilePath, images[0].size);
    form.images = [url];
}

/**
 * 表单校验
 * @param type 1: 在校学生，2:绿色通道
 */
function formvalidate(type: 1 | 2 = props.tabIndex): string | Partial<SubmitConsumerVerifyReq> {
    if (!form.schoolId) {
        return '请选择学校';
    }
    if (!form.campusName) {
        return '请选择校区';
    }
    if (!form.idNumber) {
        return '请填写身份证号';
    }
    if (!isIdNumber(form.idNumber)) {
        return '请填写正确的身份证号';
    }
    if (
        type === 1 &&
        !(
            new Date().getFullYear() - 24 <= form.idNumber.substring(6, 10) * 1 &&
            form.idNumber.substring(6, 10) * 1 <= new Date().getFullYear() - 17
        )
    ) {
        return '出生年份不符合';
    }
    if (!form.realName) {
        return '请填写真实姓名';
    }
    if (type === 2 && (!form.images || form.images?.length === 0)) {
        return '请上传图片';
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
            v-if="mode === 'edit'"
            class="list-item"
            title="学校"
            :show-arrow="mode === 'edit'"
            :border="false"
            :right-text="selectSchool?.name ?? '请选择学校'"
            @tap="schoolSelectRef?.open()"
        />
        <uni-list-item
            v-else
            class="list-item"
            title="学校"
            :show-arrow="false"
            :border="false"
            :style="{
                marginTop: '30rpx'
            }"
        >
            <template #footer>
                <view class="extra-text ellipsis">{{ selectSchool?.name }}</view>
            </template>
        </uni-list-item>
        <view class="divider"></view>
        <uni-list-item
            v-if="mode === 'edit'"
            v-model="form.campusName"
            class="list-item"
            title="校区"
            :show-arrow="mode === 'edit'"
            :border="false"
            :right-text="selectCampus?.campusName ?? '请选择校区'"
            @tap="mode === 'edit' ? campusSelectRef?.open() : () => {}"
        />
        <uni-list-item
            v-else
            v-model="form.campusName"
            class="list-item"
            title="校区"
            :show-arrow="false"
            :border="false"
        >
            <template #footer>
                <view class="extra-text ellipsis">{{ selectCampus?.campusName }}</view>
            </template>
        </uni-list-item>
        <view class="divider"></view>
        <uni-list-item
            class="list-item"
            title="身份证号"
            :border="false"
        >
            <template #footer>
                <uni-easyinput
                    v-if="mode === 'edit'"
                    v-model="form.idNumber"
                    trim="all"
                    :input-border="false"
                    placeholder="请输入"
                    :clearable="false"
                    :maxlength="18"
                ></uni-easyinput>
                <view
                    v-else
                    class="extra-text ellipsis"
                >
                    {{ form.idNumber }}
                </view>
            </template>
        </uni-list-item>
        <view class="divider"></view>
        <uni-list-item
            class="list-item"
            title="真实姓名"
            :border="false"
        >
            <template #footer>
                <uni-easyinput
                    v-if="mode === 'edit'"
                    v-model="form.realName"
                    trim="all"
                    :clearable="false"
                    :input-border="false"
                    placeholder="请输入"
                    style="text-align: right"
                ></uni-easyinput>
                <view
                    v-else
                    class="extra-text ellipsis"
                >
                    {{ form.realName }}
                </view>
            </template>
        </uni-list-item>
        <view class="divider"></view>
    </uni-list>
    <zd-image-picker
        ref="zdImagePickerRef"
        @change="imageChange"
    >
        <view
            v-if="props.tabIndex === 2"
            class="upload-card"
            @tap="selectImage"
        >
            <template v-if="form.images?.length === 0 || !form.images">
                <view class="content">
                    <view class=""> 提供学生证/一卡通/录取通知书/学信网任意一个证件照片 </view>
                </view>
                <view class="upload-text">点击上传</view>
            </template>
            <template v-else>
                <image
                    :src="form.images?.[0]"
                    mode="widthFix"
                />
            </template>
        </view>
    </zd-image-picker>

    <view class="tips-row">
        <view class="tips-row-title"> 温馨提示 </view>
        <view
            class="feedback"
            @tap="feedback"
        >
            问题反馈
        </view>
    </view>
    <view
        v-if="props.tabIndex === 1"
        class="tips-content"
    >
        <view> 1、目前仅限出生年份在1999年-2006年的用户可使用在校学生认证 </view>
        <view> 2、请认真填写信息，审核通过后，不支持修改，请谨慎操作 </view>
    </view>
    <view
        v-if="props.tabIndex === 2"
        class="tips-content"
    >
        <view> 请认真填写信息，审核通过后，不支持修改，请谨慎操作</view>
    </view>

    <school-select
        ref="schoolSelectRef"
        @change="changeSchool"
    ></school-select>
    <campus-select
        ref="campusSelectRef"
        :school-id="form.schoolId"
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
        .extra-text {
            max-width: 400rpx;
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
