import { getPayInfo, getPayStatus } from '@/api/pay';
import type { PayInfo } from '@/api/pay/types';
import { getWechatLoginCode } from '@/pages/main/login/utils';
import type { OrderType } from '@/pages/shop/order-confirm/types';

export function fnPayEnd(orderNos: string[], jsCode: string) {
    return new Promise((resolve, reject) => {
        try {
            getPayStatus({
                orderNos: orderNos,
                jsCode: jsCode
            })
                .then(async (payResult: number) => {
                    // 订单状态, 1:未支付, 2:支付完成, -1:已取消
                    if (payResult === 2) {
                        // 只有支付成功才会resolve. 否则都会走catch
                        resolve(payResult);
                    } else if (payResult === -1) {
                        reject('订单已取消');
                    } else if (payResult === 1) {
                        // 支付中, 1s后重新获取
                        setTimeout(async () => {
                            try {
                                const nextPayResult = await fnPayEnd(orderNos, jsCode);
                                resolve(nextPayResult);
                            } catch (e) {
                                reject(e);
                            }
                        }, 1000);
                    } else {
                        reject('支付失败');
                    }
                })
                .catch((e: any) => {
                    console.log('catch');
                    reject(e);
                });
        } catch (error) {
            console.log('异常', error);
            reject('获取支付结果失败');
        }
    });
    // 支付之后获取支付结果
}
// 下单订阅模板消息
export function requestSubscribeMessage() {
    uni.requestSubscribeMessage({
        tmplIds: [
            '5HGa3hX8gi-wg-hInp4GlLDZjadi1_V0Zz1_YOfnIPA',
            'rLcWOo60uCgXCxANvMhdTtGpEED-9wkW5h7Wjx_PDNw',
            '33uFK-U3kwVJgGP4t_hBBO-kaW_N-jR0mxywJYnjBGM'
        ],
        success(res) {
            console.log('订阅成功：' + JSON.stringify(res));
        },
        fail(res) {
            console.log('订阅失败：' + JSON.stringify(res));
        }
    });
}
/**
 * 微信支付
 * @param orderNos 订单号列表
 * @returns
 */
export async function pay(orderNos: string[], orderType?: OrderType) {
    try {
        uni.showLoading({
            mask: true
        });
        const jsCode = await getWechatLoginCode();
        const payInfo: PayInfo = await getPayInfo({
            orderNos: orderNos,
            jsCode: jsCode
        });
        console.log(payInfo);

        return new Promise((res: any, rej: any) => {
            uni.hideLoading();
            uni.requestPayment({
                provider: 'wxpay',
                orderInfo: '', // 类型为必须,但是文档上没有...
                timeStamp: payInfo?.timeStamp,
                nonceStr: payInfo?.nonceStr,
                package: payInfo?.package,
                signType: payInfo?.signType,
                paySign: payInfo?.paySign,
                success: async function (resp) {
                    console.log('success:' + JSON.stringify(resp));
                    try {
                        await fnPayEnd(orderNos, jsCode);

                        if (orderType === 1) {
                            requestSubscribeMessage();
                        }
                        res(resp);
                    } catch (error) {
                        console.log('fail:', error);
                        rej(error);
                    }
                },
                fail: function (err) {
                    console.log('fail:' + JSON.stringify(err));
                    rej(err);
                }
            });
        });
    } catch (e) {
        uni.hideLoading();
        return Promise.reject(e);
    }
}
