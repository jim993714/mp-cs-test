<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { router } from '@zsdx/mp-utils';

import { addOrUpdateAddress, deleteAddress, getAddressDetail } from '@/api/address';
import { type AddressItem, AddressType } from '@/api/address/types';
import { WEBVIEW_BASE_URL } from '@/base/constants';
import AddressSelect from '@/components/address-select/index.vue';
import { useUserStore } from '@/stores/user';

import { checkForm } from './constants';

const form = ref<Partial<AddressItem>>({});
const isAgree = ref(false);
const { getUserInfo } = useUserStore();
let needsEmits = false;

const departments = computed<string[]>({
    get() {
        return [
            form.value.provinceName || '',
            form.value.cityName || '',
            form.value.countyName || ''
        ];
    },
    set(val) {
        form.value.provinceName = val[0];
        form.value.cityName = val[1];
        form.value.countyName = val[2];
    }
});

onLoad(async options => {
    if (options?.select) {
        needsEmits = true;
        delete options.select;
    }

    form.value = options as any;
    form.value.type = +form.value.type!;
    form.value.isDefault = 0;

    uni.enableAlertBeforeUnload({
        message: '填写的信息还未保存，确定返回吗？'
    });

    let action = !form.value.id ? '新增' : '修改';
    uni.setNavigationBarTitle({
        title: action + (form.value.type === AddressType.Normal ? '收货' : '校内') + '地址'
    });

    if (form.value.id) {
        await getDetail(+form.value.id!);
    }
});

async function getDetail(id: number) {
    const data = await getAddressDetail({
        id
    });

    form.value = data || {
        isDefault: 0
    };
}

async function onRemove() {
    uni.showModal({
        content: '确认删除该地址吗？',
        confirmText: '确定',
        confirmColor: '#199FFF',
        cancelColor: '#8A9399',
        success: async result => {
            if (result.confirm) {
                await deleteAddress({
                    id: form.value.id!
                });
                uni.showToast({
                    title: '删除成功'
                });
                uni.disableAlertBeforeUnload({
                    success() {
                        router.back();
                    }
                });
            }
        }
    });
}

function checkDefault(event: any) {
    form.value.isDefault = +event.detail.value as 0 | 1;
}

async function submit() {
    if (!checkForm(form.value)) {
        return;
    }

    if (form.value.type === AddressType.School) {
        if (!isAgree.value) {
            uni.showToast({
                title: '请阅读并同意《送货到寝协议》',
                icon: 'none'
            });

            return;
        }
    }

    try {
        const id = await addOrUpdateAddress(form.value as AddressItem);

        if (needsEmits) {
            form.value.id = id;
            uni.$emit('address-selected', form.value);
        }

        uni.disableAlertBeforeUnload({
            success() {
                router.back();
            }
        });
    } catch (error: any) {
        uni.showToast({
            title: error.msg,
            icon: 'none'
        });
    }
}

function gotoAgreement() {
    router.push('webview', {
        url: encodeURIComponent(
            `${WEBVIEW_BASE_URL}/pages/common/activity-rule?type=agentAddress&t=${Date.now()}`
        )
    });
}
</script>

<template>
    <view class="add-address">
        <view class="add-address-card">
            <uni-list :border="false">
                <uni-list-item :border="false">
                    <template #header>
                        <view class="add-address-card-header">收货人</view>
                    </template>
                    <template #footer>
                        <view class="add-address-card-footer">
                            <input
                                v-model="form.userName"
                                maxlength="40"
                                placeholder="请填写收货人姓名"
                            />
                        </view>
                    </template>
                </uni-list-item>
                <uni-list-item :border="false">
                    <template #header>
                        <view class="add-address-card-header">联系电话</view>
                    </template>
                    <template #footer>
                        <view class="add-address-card-footer">
                            <input
                                v-model="form.phone"
                                maxlength="11"
                                inputmode="numeric"
                                placeholder="请填写收货人电话"
                            />
                        </view>
                    </template>
                </uni-list-item>
                <uni-list-item
                    v-if="form?.type === AddressType.School"
                    :border="false"
                >
                    <template #header>
                        <view class="add-address-card-header">微信</view>
                    </template>
                    <template #footer>
                        <view class="add-address-card-footer">
                            <input
                                v-model="form.wechat"
                                maxlength="11"
                                inputmode="numeric"
                                placeholder="请填写收货人微信"
                            />
                        </view>
                    </template>
                </uni-list-item>
                <uni-list-item
                    v-if="form?.type === AddressType.School"
                    :border="false"
                >
                    <template #header>
                        <view class="add-address-card-header default">学校</view>
                    </template>
                    <template #footer>
                        <view class="add-address-card-footer default">
                            {{ getUserInfo?.school }}
                        </view>
                    </template>
                </uni-list-item>
                <uni-list-item
                    v-if="form?.type === AddressType.School"
                    :border="false"
                >
                    <template #header>
                        <view class="add-address-card-header">院系</view>
                    </template>
                    <template #footer>
                        <view class="add-address-card-footer">
                            {{ getUserInfo?.schoolCollege }}
                        </view>
                    </template>
                </uni-list-item>
                <uni-list-item
                    v-if="form.type === AddressType.Normal"
                    :border="false"
                >
                    <template #header>
                        <view class="add-address-card-header">收货地址</view>
                    </template>
                    <template #footer>
                        <AddressSelect
                            v-model="departments"
                            style="width: calc(100% - 7em)"
                        >
                            <view
                                class="add-address-card-footer"
                                style="width: 100%"
                            >
                                <template v-if="!form.provinceName">
                                    <span style="color: #8a9399">请选择</span>
                                </template>
                                <view
                                    v-else
                                    class="add-address-card-footer-content"
                                >
                                    {{ form.provinceName }} {{ form.cityName }}
                                    {{ form.countyName }}
                                </view>
                                <zd-icon
                                    :size="32"
                                    type="zdmp-qianwang"
                                    color="#8a9399"
                                />
                            </view>
                        </AddressSelect>
                    </template>
                </uni-list-item>
                <uni-list-item :border="false">
                    <template #header>
                        <view class="add-address-card-header">详细地址</view>
                    </template>
                    <template #footer>
                        <view class="add-address-card-footer">
                            <input
                                v-model="form.detailInfo"
                                maxlength="120"
                                placeholder="请填写详细地址，如1号楼101"
                            />
                        </view>
                    </template>
                </uni-list-item>
                <uni-list-item :border="false">
                    <template #header>
                        <view class="add-address-card-header">设置默认地址</view>
                    </template>
                    <template #footer>
                        <view
                            :class="{
                                'add-address-card-footer': true,
                                'add-address-card-footer__no-line': form.type === AddressType.Normal
                            }"
                        >
                            <switch
                                :checked="!!form?.isDefault"
                                color="#199fff"
                                @change="checkDefault"
                            />
                        </view>
                    </template>
                </uni-list-item>
                <view
                    v-if="form.type === AddressType.School"
                    class="add-address-card-agreement"
                >
                    <zd-checkbox v-model="isAgree" />
                    我已阅读并同意
                    <view
                        class="add-address-card-agreement-link"
                        @tap="gotoAgreement"
                        >《送货到寝协议》</view
                    >
                </view>
            </uni-list>
        </view>
        <view class="add-address-btn">
            <zd-button
                v-if="form.id"
                :button-style="{
                    background: '#F5F8FA',
                    'border-color': '#8A9399',
                    color: '#8A9399'
                }"
                style="flex: 1"
                @tap="onRemove"
                >删除</zd-button
            >
            <zd-button
                type="primary"
                style="flex: 1"
                @tap="submit"
                >保存</zd-button
            >
        </view>
    </view>
</template>

<style scoped lang="scss">
.add-address {
    height: 100vh;
    padding: 20rpx;
    background: #f5f8fa;

    &-card {
        overflow: hidden;
        border-radius: 16rpx;

        &-header {
            font-size: 28rpx;
            font-weight: 500;
            line-height: 56rpx;
        }

        &-footer {
            position: relative;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            width: calc(100% - 8em);
            height: 56rpx;
            text-align: right;
            color: $uni-color-title;
            font-size: 28rpx;
            font-weight: 400;
            line-height: 56rpx;

            input {
                width: 100%;
                height: 56rpx;
            }

            &-content {
                overflow: hidden;
                width: 0;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex: 1;
            }

            &::after {
                position: absolute;
                bottom: -24rpx;
                left: -1em;
                width: calc(100% + 1em);
                height: 2rpx;
                background: $uni-text-color-disable;
                content: '';
            }

            &__no-line {
                &::after {
                    display: none;
                }
            }

            .default {
                color: #576066;
            }
        }

        &-agreement {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 40rpx 0 40rpx 40rpx;
            color: $uni-text-color-placeholder;
            font-size: 24rpx;
            font-weight: 400;
            gap: 12rpx;
            line-height: 24rpx;

            &-link {
                color: $zd-main-color;
            }
        }
    }

    &-btn {
        display: flex;
        justify-content: center;
        gap: 22rpx;
        margin-top: 30rpx;
    }
}
</style>
