export enum ResolveResType {
    No = -1,
    Yes = 1
}

export const resolveRes = [
    {
        label: '已解决',
        value: ResolveResType.Yes
    },
    {
        label: '未解决',
        value: ResolveResType.No
    }
];
