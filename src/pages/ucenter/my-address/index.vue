<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app';
import { router } from '@zsdx/mp-utils';

import { addOrUpdateAddress, getAddressList } from '@/api/address/index';
import { type AddressItem, type AddressListRes, AddressType } from '@/api/address/types';
import { CDN_BASE_URL, WEBVIEW_BASE_URL } from '@/base/constants';
import StudentAuthPop from '@/components/student-auth-pop/index.vue';
import useStudentAuth from '@/components/student-auth-pop/useStudentAuth';
import { useUserStore } from '@/stores/user';

import { checkForm } from '../add-address/constants';
import AddressCell from './components/addressItem/index.vue';
import { addressTabs } from './constants';

const cur = ref(0);
const normalList = ref<AddressListRes>([]);
const schoolList = ref<AddressListRes>([]);
const dialog = ref();
const { getUserInfo } = useUserStore();
const form = ref<Partial<AddressItem>>({
    type: AddressType.School,
    isDefault: 1
});
const isAgree = ref(false);
const isEdit = ref(false);

let select = ref<AddressType>();
const { getAuthStatus, studentAuthDetail, validate } = useStudentAuth(dialog);

async function getList(type = AddressType.Normal) {
    const data = await getAddressList({
        type: type
    });
    if (type === AddressType.Normal) {
        normalList.value = data || [];
    } else {
        schoolList.value = data || [];
        form.value = {
            ...(data ? data[0] : form.value),
            type: AddressType.School
        };
    }
}

function onSelect(item?: AddressItem) {
    if (select.value !== undefined) {
        uni.$emit('address-selected', item);
        router.back();
    }
}

watch(cur, () => {
    if (cur.value === AddressType.School) {
        validate();
    }
});

function gotoAdd() {
    router.push('addAddress', {
        type: cur.value
    });
}

async function submit() {
    if (!checkForm(form.value)) {
        return;
    }

    if (!isAgree.value) {
        uni.showToast({
            title: '请阅读并同意《送货到寝协议》',
            icon: 'none'
        });

        return;
    }

    try {
        const id = await addOrUpdateAddress(form.value as AddressItem);

        if (select.value) {
            form.value.id = id;
            uni.$emit('address-selected', form.value);
            router.back();
        }
        uni.showToast({
            title: '保存成功'
        });
        getList(AddressType.School);
        isEdit.value = false;
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

onLoad(options => {
    if (options?.select) {
        select.value = options?.select ? +options?.select : undefined;
        cur.value = select.value as AddressType;
    }

    if (select.value === undefined) {
        getList(AddressType.School);
    }

    getAuthStatus();
});

onShow(() => {
    getList(cur.value);
    if (cur.value === AddressType.School) {
        validate();
    }
});

const tabs = computed(() => {
    return addressTabs.filter(item => item.value === select.value || select.value === undefined);
});

const schoolInfo = computed(() => {
    return `${studentAuthDetail.value?.schoolName},${studentAuthDetail.value?.campusName}`;
});
</script>

<template>
    <view class="address-list">
        <zd-tabbar
            v-model="cur"
            is-action
            :scroll="false"
            :items="tabs"
        >
            <template #normal>
                <scroll-view
                    v-if="normalList.length"
                    class="address-list-content"
                    scroll-y
                >
                    <AddressCell
                        v-for="item in normalList"
                        :key="item.id"
                        :item="item"
                        @delete="getList"
                        @tap="onSelect(item)"
                    />
                </scroll-view>
                <zd-empty
                    v-else
                    :image-width="450"
                    :image-height="250"
                    :image="CDN_BASE_URL + '/mp-cs/images/ucenter/empry-address.png'"
                    description="暂无收货地址哦~"
                />
                <view class="footer">
                    <zd-button
                        style="width: 670rpx"
                        type="primary"
                        @tap="gotoAdd"
                    >
                        <view class="footer-btn">
                            <zd-icon
                                type="zdmp-tianjia"
                                color="#fff"
                                :size="32"
                            />
                            新增{{ cur === 0 ? '普通' : '校内' }}地址
                        </view>
                    </zd-button>
                </view>
            </template>
            <template #school>
                <scroll-view
                    v-if="schoolList.length && !isEdit"
                    class="address-list-content"
                    scroll-y
                >
                    <AddressCell
                        v-for="item in schoolList"
                        :key="item.id"
                        :item="item"
                        :extra="schoolInfo"
                        @delete="getList"
                        @tap="onSelect(item)"
                        @edit="isEdit = true"
                    />
                </scroll-view>
                <view
                    v-else
                    class="add-address-card"
                >
                    <view>
                        <uni-list :border="false">
                            <uni-list-item :border="false">
                                <template #header>
                                    <view class="add-address-card-header default">学校校区</view>
                                </template>
                                <template #footer>
                                    <view class="add-address-card-footer default">
                                        {{ schoolInfo }}
                                    </view>
                                </template>
                            </uni-list-item>
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
                        </uni-list>
                    </view>
                    <view class="add-address-card-agreement">
                        <zd-checkbox v-model="isAgree" />
                        我已阅读并同意
                        <view
                            class="add-address-card-agreement-link"
                            @tap="gotoAgreement"
                            >《送货到寝协议》</view
                        >
                    </view>
                    <view style="margin: 0 20rpx">
                        <zd-button
                            type="primary"
                            @tap="submit"
                        >
                            保存
                        </zd-button>
                    </view>
                </view>
            </template>
        </zd-tabbar>
        <StudentAuthPop
            ref="dialog"
            @cancel="cur = 0"
        />
    </view>
</template>

<style scoped lang="scss">
.address-list {
    height: 100vh;
    background: #f5f8fa;

    &-content {
        height: 100%;
    }
}

.footer {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 120rpx;
    padding-bottom: calc(env(safe-area-inset-bottom));
    background: #fff;

    &-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 32rpx;
        font-weight: 500;
        gap: 12rpx;
    }
}

.add-address-card {
    overflow: hidden;
    width: calc(100% - 40rpx);
    height: auto;
    margin: 20rpx;
    // border-radius: 16rpx;

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
        line-height: 56rpx;
        text-align: right;
        color: $uni-color-title;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 56rpx;

        input {
            width: 100%;
            line-height: 56rpx;
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
        padding: 24rpx 0 44rpx 0;
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
</style>
