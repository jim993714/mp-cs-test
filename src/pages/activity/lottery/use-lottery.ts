import { applyLottery, checkLotteryResult } from '@/api/lottery';
import { LotteryApplyResultType, type LotteryResult, LotteryResultType } from '@/api/lottery/types';

import { Result } from './types';

export function useLottery(onResult: (result: Result) => void) {
    const isRolling = ref(false);
    const transition = ref('transform linear 1s');
    const rotateDeg = ref(0);
    const animationTimer = ref(0);
    const lotteryResult = ref<LotteryResult | null>(null);

    async function apply(lotteryNo: string) {
        try {
            const { result, tryNo } = await applyLottery(lotteryNo);

            if (result === LotteryApplyResultType.SUCCESS) {
                return tryNo;
            } else {
                onResult(Result.NoChance);
                return false;
            }
        } catch (error: any) {
            uni.showToast({
                title: error.msg,
                icon: 'none'
            });
        }
    }

    async function getLotteryResult(params: { lotteryNo: string; tryNo: string }) {
        const res = await checkLotteryResult(params);

        lotteryResult.value = res;
    }

    async function start(lotteryNo: string) {
        if (isRolling.value) return;
        const tryNo = await apply(lotteryNo);
        if (!tryNo) return;

        isRolling.value = true;
        lotteryResult.value = null;

        lottery(tryNo, lotteryNo);
    }

    async function lottery(tryNo: string, lotteryNo: string) {
        transition.value = 'transform linear 1s';

        if (animationTimer.value) {
            clearTimeout(animationTimer.value);
        }

        // 请求接口获取抽奖结果
        getLotteryResult({
            lotteryNo,
            tryNo
        });

        rotateDeg.value += 360 * 2;

        animationTimer.value = setTimeout(() => {
            if (lotteryResult.value) {
                // 中奖
                const grow =
                    ((Number(lotteryResult.value.rotateAngle) - rotateDeg.value) % 360) + 360;
                const growTime = (2 * grow) / 360;

                rotateDeg.value += grow;
                transition.value = 'transform cubic-bezier(.51,.86,.64,.89) ' + growTime + 's';

                setTimeout(() => {
                    isRolling.value = false;
                    // 中奖弹窗
                    onResult(
                        lotteryResult.value?.result === LotteryResultType.SUCCESS
                            ? Result.Success
                            : Result.Fail
                    );
                }, growTime * 1000);
            } else {
                lottery(tryNo, lotteryNo);
            }
        }, 1000);
    }

    return {
        start,
        isRolling,
        transition,
        rotateDeg,
        lotteryResult
    };
}
