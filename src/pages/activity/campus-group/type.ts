/**
 * tab栏
 */
export interface ITab {
    label: string;
    value: number;
    isActive: boolean;
}

/**
 * 商品卡片配置项
 */
export interface IGoodsCardConfig {
    titleLine: string;
    btnBg: string;
}

/**
 * banner类型
 */
export interface IBanner {
    bannerNo: string;
    imageUrl: string;
    backgroundColor: string;
    appAction: string;
}
