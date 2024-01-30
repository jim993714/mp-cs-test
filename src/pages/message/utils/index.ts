import dayjs from 'dayjs';

import { CDN_BASE_URL } from '@/base/constants';
import { getTime } from '@/utils/time';

export function formatDate(date: number, lastDate?: number, show?: boolean) {
    const dateObj = dayjs(date);
    const nowObj = dayjs(getTime(Date.now())).startOf('day');
    const _show = show || Math.abs(dayjs(lastDate).diff(dateObj, 'second')) >= 300;

    if (!_show) {
        return '';
    }

    console.log(dateObj, nowObj);

    const days = Math.abs(nowObj.diff(dateObj.startOf('day'), 'day'));

    if (days < 1) {
        return dateObj.format('HH:mm');
    } else if (days >= 1) {
        return dayjs(date).format('MM-DD HH:mm');
    } else if (show) {
        return dateObj.format('HH:mm');
    }

    return '';
}

export enum TextNodeType {
    Text = 1,
    Emoji
}

export type TextNodes = (
    | {
          type: TextNodeType.Text;
          content: string;
      }
    | {
          type: TextNodeType.Emoji;
          content: string;
          imageClass: string;
      }
)[];

const emoji = ref<{ parseEmoji: (str: string) => TextNodes }>();

/** 注册表情组件 */
export function registerEmoji(_emoji: any) {
    emoji.value = _emoji;
}

/** 转译表情 */
export async function parseEmoji(content: string): Promise<TextNodes> {
    if (emoji.value) {
        return Promise.resolve(emoji.value.parseEmoji(content));
    } else {
        return new Promise(resolve => {
            const event = watch(emoji, () => {
                event();
                resolve(emoji.value!.parseEmoji(content));
            });
        });
    }
}

export const emojiUrl = `${CDN_BASE_URL}/mp-cs/images/message/wx-emoji.png`;
