<script setup lang="ts">
import ZdImagePicker from '@zsdx/mp-material/dist/lib/components/zd-image-picker/index.vue';
import { ref } from 'vue';

import { uploadImage } from '@/api/common';
import { getSchoolCampusList, getStudentVerify } from '@/api/student-auth';
import type {
    Campus,
    ChangeConsumerVerifyReq,
    College,
    School,
    StudentInfo
} from '@/api/student-auth/type';
import CampusSelect from '@/components/campus-select/index.vue';
import CollegeSelect from '@/components/college-select/index.vue';
import SchoolSelect from '@/components/school-select/index.vue';

import AddressSelect from './address-select.vue';

const props = defineProps<{
    detail: StudentInfo;
}>();

const campusSelectRef = ref<InstanceType<typeof CampusSelect>>();
const schoolSelectRef = ref<InstanceType<typeof SchoolSelect>>();
const collegeSelectRef = ref<InstanceType<typeof CollegeSelect>>();
const zdImagePickerRef = ref<InstanceType<typeof ZdImagePicker>>();
const selectSchool = ref<School>();
const selectCampus = ref<Campus>();
const selectAddress = ref<string[]>([]);
const selectCollege = ref<College>();

const form = reactive<Partial<ChangeConsumerVerifyReq>>({});

const { detail } = toRefs(props);

watch(selectAddress, newVal => {
    console.log(newVal, 'newVal');
    if (newVal[0]) {
        form.campusAid = newVal[3];
    }
});

watch(detail, val => {
    console.log('detail');

    const resp = val;
    form.schoolId = resp.schoolId;
    form.campusId = resp.campusId;
    form.campusName = resp.studentChangeDTO?.campusName || resp.campusName;
    form.campusAid = resp.studentChangeDTO?.campusAid || resp.campusAid;

    form.collegeNo = resp.studentChangeDTO?.collegeNo || resp.collegeNo;
    form.collegeName = resp.studentChangeDTO?.collegeName || resp.collegeName;

    selectSchool.value = {
        id: resp.schoolId,
        name: resp.studentChangeDTO?.schoolName || resp.schoolName
    } as any;
    selectCampus.value = {
        campusName: resp.studentChangeDTO?.campusName || resp.campusName
    } as any;
    selectAddress.value = [
        resp.studentChangeDTO?.campusProvinceName ?? '',
        resp.studentChangeDTO?.campusCityName ?? '',
        resp.studentChangeDTO?.campusAreaName ?? ''
    ];
    selectCollege.value = {
        collegeNo: resp.studentChangeDTO?.collegeNo || resp.collegeNo,
        collegeName: resp.studentChangeDTO?.collegeName || resp.collegeName
    } as College;

    updateCampus(resp.schoolId!);
});

async function updateCampus(schoolId: number) {
    const resp = await getSchoolCampusList({
        schoolId
    });
    const findItem = resp.find((item: Campus) => form.campusId === item.campusId);
    selectCampus.value = findItem;
    form.campusType = findItem?.campusId ? 0 : 1;
    form.campusAid = findItem?.campusAid ?? '';
}

function changeSchool(school: School) {
    form.schoolId = parseInt(school.id);
    selectSchool.value = school;

    form.campusName = '';
    form.campusId = '';
    selectCampus.value = undefined;

    selectAddress.value = [];

    form.collegeName = '';
    form.collegeNo = '';
    selectCollege.value = undefined;
}

function changeCampus(campus: Campus) {
    selectCampus.value = campus;
    form.campusName = campus.campusName;
    form.campusType = campus.campusId ? 0 : 1;
    form.campusId = campus.campusId ? campus.campusId + '' : '';
    form.campusAid = campus.campusAid;

    form.collegeName = '';
    form.collegeNo = '';
    selectCollege.value = undefined;
    selectAddress.value = [];

    console.log('form.campusAid', form, campus);
}

function changeCollege(college: College) {
    selectCollege.value = college;
    form.collegeName = college.collegeName;
    form.collegeNo = college.collegeNo;
}

function selectImage() {
    zdImagePickerRef.value?.open();
}

async function imageChange(images: any[]) {
    const { url } = await uploadImage(images[0].tempFilePath, images[0].size);
    form.images = [url];
}

/**
 * 表单校验
 * @param type 1: 在校学生，2:绿色通道
 */
function formvalidate(): string | Partial<ChangeConsumerVerifyReq> {
    if (!form.schoolId) {
        return '请选择学校';
    }
    if (!form.campusName) {
        return '请选择校区';
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
            class="list-item"
            title="学校"
            show-arrow
            :border="false"
            :right-text="selectSchool?.name ?? '请选择学校'"
            :style="{
                marginTop: '30rpx'
            }"
            @tap="schoolSelectRef?.open()"
        >
        </uni-list-item>
        <view class="divider"></view>
        <uni-list-item
            v-model="form.campusName"
            class="list-item"
            title="校区"
            show-arrow
            :border="false"
            :right-text="selectCampus?.campusName ?? '请选择校区'"
            @tap="campusSelectRef?.open()"
        >
        </uni-list-item>
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
            v-model="selectAddress"
            class="list-item"
        >
            <uni-list-item
                class="list-item"
                title="校区所在地"
                show-arrow
                :border="false"
                :right-text="selectAddress[1] + selectAddress[2] || '请选择地区'"
            >
            </uni-list-item>
        </address-select>
        <view class="divider"></view>
        <uni-list-item
            v-if="detail?.userAuthMethodType === 1 || detail?.userAuthMethodType === 2"
            class="list-item"
            title="学院"
            show-arrow
            :border="false"
            :right-text="selectCollege?.collegeName ?? '请选择学院'"
            @tap="collegeSelectRef?.open()"
        >
        </uni-list-item>

        <uni-list-item
            class="list-item"
            :border="false"
        >
            <template #header>
                <view class="list-header">
                    <text class="uni-list-item__content-title">上传证件图</text>
                    <text class="text2">(照片仅供掌上大学审核使用)</text>
                </view>
            </template>
        </uni-list-item>

        <zd-image-picker
            ref="zdImagePickerRef"
            @change="imageChange"
        >
            <view
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

        <view class="divider"></view>
    </uni-list>
    <view class="tips-content">
        注：如学校发生变更，请提供学生证/一卡通/录取通知书/学信网任意一个证件照片，上传的图片必须包含姓名、学校、学院、学制、入学年份
    </view>
    <view class="tips-images">
        <view class="item">
            <image
                class="item-img"
                src="http://cdn.zsdx.cn/mp-cs/images/ucenter/student-auth/example-1.png"
                mode="widthFix"
            ></image>
            <view class="item-text right">
                <zd-icon
                    :size="28"
                    type="zdmp-yigouxuan1"
                    color="#199FFF"
                />
                正确示例
            </view>
        </view>
        <view class="item">
            <image
                class="item-img"
                src="http://cdn.zsdx.cn/mp-cs/images/ucenter/student-auth/example-2.png"
                mode="widthFix"
            ></image>
            <view class="item-text">
                <zd-icon
                    :size="28"
                    type="zdmp-cuowu1"
                    color="#FF4734"
                />
                图片缺失
            </view>
        </view>
        <view class="item">
            <image
                class="item-img"
                src="http://cdn.zsdx.cn/mp-cs/images/ucenter/student-auth/example-3.png"
                mode="widthFix"
            ></image>
            <view class="item-text">
                <zd-icon
                    :size="28"
                    type="zdmp-cuowu1"
                    color="#FF4734"
                />
                照片模糊
            </view>
        </view>
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
    <college-select
        ref="collegeSelectRef"
        :school-id="form.schoolId"
        @change="changeCollege"
    ></college-select>
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
        :deep(.uni-list-item__extra) {
            overflow: hidden;
            max-width: 400rpx;
            text-overflow: ellipsis;
            white-space: nowrap;
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

.tips-content {
    margin-top: 20rpx;
    margin-bottom: 40rpx;
    color: #999;
    font-size: 20rpx;
    line-height: 28rpx;
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

.list-header {
    font-size: 28rpx;
    .text2 {
        margin-left: 10rpx;
        color: #999999;
        font-size: 20rpx;
    }
}

.upload-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 590rpx;
    height: 272rpx;
    padding: 28rpx;
    border: 2rpx solid #f2f5f7;
    border-radius: 12rpx;
    background: #ffffff;
    box-sizing: border-box;
    .content {
        display: flex;
        height: 168rpx;
        padding: 16rpx;
        background: url(http://cdn.zsdx.cn/mp-cs/images/ucenter/student-auth/upload-bg.png);
        background-size: 100% 100%;
        widows: 534rpx;
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

.tips-images {
    display: flex;
    justify-content: space-between;
    .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        &-img {
            width: 192rpx;
            height: 132rpx;
        }
        &-text {
            margin-top: 14rpx;
            color: #999;
            font-size: 24rpx;
            &.right {
                color: #333;
            }
        }
    }
}
</style>
