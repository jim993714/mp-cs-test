import { getSocket } from '../message';
import type { ReceiveRes, SendParams } from './types';

function socket() {
    let socket: any = null;
    const canSocket = ref(false);
    const data = ref<ReceiveRes>();

    const send = computed(() => {
        if (canSocket.value) {
            return (msg: SendParams) => {
                return uni.sendSocketMessage({
                    data: JSON.stringify(msg),
                    fail(res) {
                        console.log(res);
                    }
                });
            };
        }

        return undefined;
    });

    uni.onSocketOpen(() => {
        canSocket.value = true;
    });

    uni.onSocketMessage(res => {
        data.value = JSON.parse(res.data);
    });

    uni.onSocketClose(() => {
        socket = null;
        canSocket.value = false;
        data.value = undefined;
    });

    const _send = (msg: SendParams) => {
        if (canSocket.value) {
            send.value?.(msg);
        } else {
            const once = watch(send, () => {
                send.value?.(msg);
                once();
            });
        }
    };

    return {
        useSocket: () => {
            if (!socket) {
                (async () => {
                    const { socketUrl } = await getSocket();
                    socket = await uni.connectSocket({
                        url: socketUrl
                    });

                    _send({
                        cmd: 'stat',
                        data: {
                            client_type: 1
                        }
                    });
                })();
            }

            return {
                data,
                send: _send,
                close: () => {
                    socket.close();
                }
            };
        }
    };
}

export default socket();
