export enum PopupType {
    /**
     * 未中奖
     */
    Fail = 1,
    /**
     * 没有抽奖机会
     */
    NoChance = 2
}

export enum Result {
    /**
     * 没有抽奖机会
     */
    NoChance = -2,
    /**
     * 未中奖
     */
    Fail = -1,
    /**
     * 中奖
     */
    Success = 1
}
