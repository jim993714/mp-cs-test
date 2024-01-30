/**
 * 规则配置
 */
export interface RuleConfig {
    /**配置id */
    configId: string;
    /**规则 */
    imagesRule: string[];
    /**头图 */
    bannerImage: string;
    /**默认展示数据的月份 */
    mothsTime: string;
}

/**
 * 获取奖池信息参数
 */
export interface GetPoolInfoParams {
    /**活动id */
    configId: string;
    /**月份 */
    mothsTime: string;
}

/**
 * 获取奖池信息返回值
 */
export interface PoolInfo {
    /**总金额 */
    totalReward: number;
    /**昵称 */
    nikeName: string;
    /**头像 */
    headImage: string;
    /**排名 */
    rank: number;
    /**是否发放 */
    isGrant: 1 | 0;
    /**瓜分金额 */
    rewardDivide: number;
    /**已完结订单金额 */
    completedOrderAmount: number;
    /**是否认证 */
    isOpenReward: number;
}

/**
 * 获取榜单排名列表参数
 */
export interface GetRankListParams {
    /**活动id */
    configId: string;
    /**月份 */
    mothsTime: string;
    /**页码 */
    scrollId?: string;
}

/**
 * 榜单排名列表项
 */
export interface RankItem {
    /**昵称 */
    nikeName: string;
    /**头像 */
    headImg: string;
    /**学校名称 */
    college: string;
    /**排名 */
    rank: number;
    /**瓜分金额 */
    rewardDivide: number;
}

/**
 * 榜单排名列表
 */
export interface RankListRes {
    list: RankItem[];
    scrollId: string;
}
