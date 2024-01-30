import { type AddressItem, AddressType } from '@/api/address/types';

export function checkForm(form: Partial<AddressItem>) {
    if (!form.userName) {
        uni.showToast({
            title: '请填写收货人',
            icon: 'none'
        });
        return false;
    } else if (!form.phone) {
        uni.showToast({
            title: '请填写联系电话',
            icon: 'none'
        });
        return false;
    } else if (!form.detailInfo) {
        uni.showToast({
            title: '请填写详细地址',
            icon: 'none'
        });
        return false;
    }

    if (form.type === AddressType.Normal) {
        if (!form.cityName || !form.provinceName || !form.countyName) {
            uni.showToast({
                title: '请填写收货地址',
                icon: 'none'
            });
            return false;
        }
    }
    // else {
    //     if (!form.wechat) {
    //         uni.showToast({
    //             title: '请填写微信',
    //             icon: 'none'
    //         });
    //         return false;
    //     }
    // }

    if (form.phone.length !== 11) {
        uni.showToast({
            title: '请填写正确的手机号',
            icon: 'none'
        });
        return false;
    }

    return true;
}
