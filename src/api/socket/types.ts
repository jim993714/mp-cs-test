/** socket发送消息 */
export type SendParams =
    | {
          /** 初始化socket */
          cmd: 'stat';
          data: {
              client_type: 1;
          };
      }
    | {
          /** 初始化会话 */
          cmd: 'kf_customer_chat';
          data: {
              chat_no: string;
          };
      };

export type ReceiveRes = {
    tunnel: 'kf_customer';
} & (
    | {
          event: 'queue_change';
          data: {
              chat_no: string;
              queue_count: number;
          };
      }
    | {
          event: 'msg_receive';
          data: {
              chat_no: string;
              is_sender: number;
              msg_content: string;
              msg_id: number;
              msg_read: number;
              msg_time: number;
              msg_type: string;
              sender_info?: {
                  sender_head: string;
                  sender_name: string;
              };
          };
      }
    | {
          event: 'msg_read';
          data: {
              chat_no: string;
          };
      }
    | {
          event: 'chat_session_evaluate';
          data: {
              chat_no: string;
              session_no: string;
          };
      }
    | {
          event: 'msg_retract';
          data: {
              chat_no: string;
              msg_id: number;
          };
      }
);
