<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { router } from '@zsdx/mp-utils';

import { uploadImage } from '@/api/common';
import { submitReport } from '@/api/message';
import { ReportKF } from '@/api/message/types';
import { feedback } from '@/api/student-auth';

const content = ref('');
const images = ref<string[]>(['']);

let uploadImages: string[] = [];
let dataNo = '';

function chooseImage() {
    uni.chooseImage({
        count: 3,
        sourceType: ['album', 'camera'],
        sizeType: ['original', 'compressed'],
        success: async res => {
            const list = (
                Array.isArray(res.tempFiles) ? res.tempFiles : [res.tempFiles]
            ) as UniApp.ChooseImageSuccessCallbackResultFile[];

            uni.showLoading({
                title: '上传中...',
                mask: true
            });
            try {
                const data = (
                    await Promise.all(list.map(image => uploadImage(image.path, image.size)))
                ).map(item => item.url);

                const _images = [...images.value.slice(0, -1), ...data];
                uploadImages = [..._images];
                if (_images.length < 3) {
                    _images.push('');
                }

                images.value = _images;
            } catch (error: any) {
                uni.showToast({
                    title: error.msg,
                    icon: 'none'
                });
            } finally {
                uni.hideLoading();
            }
        }
    });
}

function deleteImage(i: number) {
    uploadImages.splice(i, 1);
    images.value.splice(i, 1);

    if (images.value.length < 3 && images.value.slice(-1)[0] !== '') {
        images.value.push('');
    }
}

function preview(i: number) {
    uni.previewImage({
        current: i,
        urls: uploadImages
    });
}

async function submit() {
    await feedback({
        aimNo: '',
        type: 7,
        content: content.value,
        images: uploadImages
    });

    uni.showToast({
        title: '反馈成功',
        icon: 'success',
        success: () => {
            setTimeout(() => router.back(), 1000);
        }
    });
}

onLoad(options => {
    dataNo = options?.dataNo;
});
</script>

<template>
    <view class="report">
        <textarea
            v-model="content"
            class="report-textarea"
            placeholder="感谢你提供建议和投诉，你提供的有效截图将有助于我们沟通和解决问题哦"
            placeholder-class="textarea-placeholder"
        />
        <view class="report-upload">
            <view class="report-upload-tips">
                <text>上传图片</text>
                <text>（选填）</text>
            </view>
            <view class="report-upload-content">
                <template
                    v-for="(image, i) in images"
                    :key="image"
                >
                    <view
                        v-if="!image"
                        class="report-upload-content-btn"
                        @tap="chooseImage"
                    >
                        <zd-icon
                            type="zdmp-xiangji"
                            :size="32"
                        />
                        上传凭证
                    </view>
                    <view
                        v-else
                        class="report-upload-content-wrapper"
                    >
                        <image
                            class="report-upload-content-wrapper-image"
                            :src="image"
                            @tap="preview(i)"
                        />
                        <view
                            class="report-upload-content-wrapper-close"
                            @tap="deleteImage(i)"
                        >
                            <zd-icon
                                :size="28"
                                type="zdmp-guanbidefuben"
                                color="#bbb"
                            />
                        </view>
                    </view>
                </template>
            </view>
        </view>
        <view class="report-submit">
            <zd-button
                style="width: 670rpx"
                type="primary"
                @tap="submit"
            >
                提交
            </zd-button>
            <view
                class="report-contact"
                @tap="router.push('chatRoom')"
                >联系客服</view
            >
        </view>
    </view>
</template>

<style scoped lang="scss">
.report {
    display: flex;
    width: 100%;
    height: 100vh;
    background: #f5f8fa;
    flex-direction: column;
    gap: 20rpx;

    &-textarea {
        width: 100%;
        height: 330rpx;
        margin-top: 20rpx;
        padding: 24rpx 30rpx;
        color: $uni-text-color;
        font-size: 28rpx;
        background: #fff;
        box-sizing: border-box;
    }

    :deep(.textarea-placeholder) {
        color: #8a9399;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 40rpx;
    }

    &-upload {
        display: flex;
        width: 100%;
        height: 330rpx;
        padding: 36rpx 30rpx;
        flex-direction: column;
        gap: 40rpx;
        box-sizing: border-box;
        background: #fff;

        &-tips {
            display: flex;
            align-items: center;
            color: $uni-text-color;
            font-size: 32rpx;
            font-weight: 500;
            line-height: 32rpx;

            > text:last-of-type {
                color: $uni-color-paragraph;
                font-size: 24rpx;
                font-weight: 500;
                line-height: 32rpx;
            }
        }

        &-content {
            display: flex;
            align-items: center;
            gap: 20rpx;
            flex-shrink: 0;
            flex-wrap: wrap;

            &-btn {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 198rpx;
                height: 198rpx;
                border: 2rpx solid rgba(138, 147, 153, 0.3);
                border-radius: 12rpx;
                color: #88909c;
                font-size: 24rpx;
                font-weight: 400;
                background: $uni-text-color-inverse;
                line-height: 24rpx;
                flex-direction: column;
                gap: 16rpx;
            }

            &-wrapper {
                position: relative;
                &-image {
                    display: block;
                    width: 198rpx;
                    height: 198rpx;
                    border-radius: 12rpx;
                }

                &-close {
                    position: absolute;
                    top: -4rpx;
                    right: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 32rpx;
                    height: 32rpx;
                    border-radius: 16rpx;
                    background: #edf0f2;
                }
            }
        }
    }

    &-submit {
        position: fixed;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 160rpx;
        padding-bottom: calc(env(safe-area-inset-bottom));
        background: #fff;
        flex-direction: column;
    }
    &-contact {
        margin-top: 20rpx;
        color: $uni-text-color-placeholder;
        font-size: 28rpx;
    }
}
</style>
