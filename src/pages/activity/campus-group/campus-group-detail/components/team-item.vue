<script setup lang="ts">
import type { ISchoolDumplingDetail } from '@/api/activity/campus-group/type';

import { timeOutStyle, timeUnitStyle } from '../constants';

const props = defineProps<{
    data?: ISchoolDumplingDetail;
    studentShopId?: string;
}>();
const shareType = ref('');
watch(
    () => props.data,
    () => {
        shareType.value = props.data?.hasJoined ? 'share' : '';
    }
);
const timeEnd = ref(false);
const timeOut = () => {
    console.log('倒计时结束');

    timeEnd.value = true;
    emit('timeEnd');
};

const onClickBtn = () => {
    if (props?.data?.status == 1 || props?.data?.status == -1) return;
    let type = props.data?.hasJoined ? 'share' : 'openGroup';
    emit('onClick', type);
};
const emit = defineEmits(['timeEnd', 'onClick']);
</script>

<template>
    <view class="team-item">
        <view
            v-if="props.data?.timeRemaining && props.data?.timeRemaining > 0"
            class="time-out-warp"
        >
            <zd-timer-out
                :time="props.data?.timeRemaining"
                :splider-style="timeOutStyle"
                :unit-type="2"
                :unit-style="timeUnitStyle"
                :show-second="true"
                :show-day="false"
                :zero="true"
                @time-end="timeOut()"
            ></zd-timer-out>
            <view class="time-out-end-text">后结束</view>
        </view>
        <view
            v-else
            class="time-out-set"
        ></view>
        <view
            v-if="props.data?.status === 0"
            class="group-status-tips"
        >
            <view class="group-status-tips-text">还差</view>
            <view class="group-status-tips-red">{{ props.data?.remainingMemberNum }}</view>
            <view class="group-status-tips-text">人即可成团</view>
        </view>
        <view
            v-else-if="props.data?.status === 1"
            class="group-status-tips"
        >
            <view class="group-status-tips-text">已成团</view>
        </view>
        <view
            v-else-if="props.data?.status === -1"
            class="group-status-tips"
        >
            <view class="group-status-tips-text">已失效</view>
        </view>
        <view class="team-cover-warp">
            <template
                v-for="(item, index) in props.data?.memberHeadImgs"
                :key="index"
            >
                <view
                    v-if="index <= 2"
                    class="team-item"
                >
                    <view class="team-item-cover">
                        <image
                            class="team-cover-img"
                            :src="item"
                            mode="scaleToFill"
                        />
                        <view
                            v-if="index === 0"
                            class="team-leader-tag"
                            >团长</view
                        >
                    </view>
                </view>
            </template>
            <view
                v-if="props.data?.status === 0 && props.data?.memberHeadImgs.length > 3"
                class="team-more-item"
            >
                <view class="team-item-cover">
                    <image
                        class="team-more-img"
                        src="https://cdn.zsdx.cn/mp-cs/images/activity/campus-group/more.png"
                        mode="widthFix"
                    />
                </view>
            </view>
            <view
                v-if="props.data?.status === 0"
                class="team-more-item"
                style="margin-right: 0"
            >
                <track-view
                    :track-data="{
                        type: 'click',
                        eventData: {
                            path: 'bi_event',
                            student_shop_id: props.studentShopId,
                            element_name: '校园团-添加团员',
                            page_data_info: props.data
                        }
                    }"
                >
                    <button
                        class="team-item-cover"
                        open-type="share"
                    >
                        <image
                            class="team-add-img"
                            src="https://cdn.zsdx.cn/mp-cs/images/activity/campus-group/add.png"
                            mode="widthFix"
                        />
                    </button>
                </track-view>
            </view>
        </view>
        <track-view
            :track-data="{
                type: 'click',
                eventData: {
                    path: 'bi_event',
                    student_shop_id: props.studentShopId,
                    element_name: props.data?.hasJoined ? '校园团-立即参团' : '校园团-添加团员',
                    page_data_info: props.data
                }
            }"
        >
            <button
                class="btn"
                :open-type="shareType"
                :disabled="props.data?.status == -1"
                :style="{ opacity: props.data?.status == -1 || props.data?.status == 1 ? 0.5 : 1 }"
                @tap="onClickBtn"
            >
                {{ props.data?.hasJoined ? '邀请好友参团' : '立即参团' }}
            </button>
        </track-view>
    </view>
</template>

<style lang="scss" scoped>
.team-item {
    display: flex;
    align-items: center;
    width: 670rpx;
    height: 510rpx;
    border-radius: 20rpx;
    background: #ffffff;
    flex-direction: column;
    .time-out-warp {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 352rpx;
        height: 60rpx;
        border-radius: 0rpx 0rpx 30rpx 30rpx;
        background: linear-gradient(90deg, #31e7ff 0%, #18bfff 100%);
        flex-direction: row;
        box-sizing: border-box;
        .time-out-end-text {
            height: 36rpx;
            color: #fff2cc;
            font-size: 20rpx;
            line-height: 40rpx;
        }
    }
    .time-out-set {
        height: 60rpx;
    }
    .group-status-tips {
        display: flex;
        align-items: flex-end;
        margin-top: 66rpx;
        .group-status-tips-text {
            color: #292f33;
            font-size: 32rpx;
            font-weight: 500;
            line-height: 44rpx;
        }
        .group-status-tips-red {
            margin: 0 12rpx;
            color: #ff4734;
            font-size: 40rpx;
            font-weight: 600;
            line-height: 42rpx;
        }
    }
    .team-cover-warp {
        display: flex;
        align-items: center;
        height: 88rpx;
        margin-top: 66rpx;
        .team-more-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 80rpx;
            height: 88rpx;
            margin-right: 38rpx;
            flex-direction: column;
            .team-more-img {
                width: 34rpx;
                height: 6rpx;
                margin-top: 40rpx;
            }
            .team-add-img {
                width: 80rpx;
                height: 80rpx;
            }
        }
        .team-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 80rpx;
            height: 88rpx;
            flex-direction: column;
            margin-right: 38rpx;
            .team-item-cover {
                position: relative;
                height: 88rpx;
            }

            .team-cover-img {
                width: 80rpx;
                height: 80rpx;
                border-radius: 50%;
            }
            .team-leader-tag {
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translate(-50%);
                width: 56rpx;
                height: 28rpx;
                border-radius: 8rpx;
                text-align: center;
                color: #ffffff;
                font-size: 20rpx;
                font-weight: 500;
                background: #0cccf2;
                line-height: 28rpx;
            }
        }
    }
    .btn {
        width: 614rpx;
        height: 80rpx;
        margin-top: 60rpx;
        border-radius: 40rpx;
        text-align: center;
        color: #ffffff;
        font-size: 28rpx;
        font-weight: 500;
        background: linear-gradient(90deg, #31e7ff 0%, #18bfff 100%);
        line-height: 80rpx;
    }
}
button::after {
    border: none !important;
}
button {
    padding: 0;
    border: 1rpx solid transparent;
    background: transparent;
}
</style>
