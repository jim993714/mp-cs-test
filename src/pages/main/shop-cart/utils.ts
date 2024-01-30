export function formatText(val: string) {
    if (val && val.length > 15) {
        return val.slice(0, 15) + '...';
    }
    return val;
}
