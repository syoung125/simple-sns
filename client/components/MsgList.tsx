import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Query, useMutation, useQuery, useQueryClient } from "react-query";

import MsgInput from "./MsgInput";
import MsgItem from "./MsgItem";

import IMessage from "../interfaces/message";
import IUser from "../interfaces/user";

// import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { fetcher, QueryKeys } from "../queryClient";
import {
  GET_MESSAGES,
  CREATE_MESSAGE,
  UPDATE_MESSAGE,
  DELETE_MESSAGE,
} from "../graphql/message";

type MsgListProps = {
  smsgs: IMessage[];
  users: IUser[];
};

const MsgList = ({ smsgs, users }: MsgListProps) => {
  const client = useQueryClient();
  const { query } = useRouter();
  const userId: string =
    query.userId?.toString() || query.userid?.toString() || "";
  const [msgs, setMsgs] = useState<IMessage[]>(smsgs);
  const [editingId, setEditingId] = useState<string>(null);
  // const [hasNext, setHasNext] = useState(true);
  // const fetchMoreEl = useRef(null);
  // const intersecting = useInfiniteScroll(fetchMoreEl);

  const { mutate: onCreate } = useMutation<
    { createMessage: IMessage[] },
    unknown,
    Pick<IMessage, "text">
  >(({ text }) => fetcher(CREATE_MESSAGE, { text, userId }), {
    onSuccess: ({ createMessage }) => {
      client.setQueryData(
        QueryKeys.MESSAGES,
        (old: { messages: IMessage[] }) => {
          return {
            messages: [createMessage, ...old.messages],
          };
        }
      );
    },
  });

  const { mutate: onUpdate } = useMutation<
    { updateMessage: IMessage },
    unknown,
    Pick<IMessage, "text" | "id">
  >(({ text, id }) => fetcher(UPDATE_MESSAGE, { text, id, userId }), {
    onSuccess: ({ updateMessage }) => {
      client.setQueryData(
        QueryKeys.MESSAGES,
        (old: { messages: IMessage[] }) => {
          const targetIndex = msgs.findIndex(
            (msg) => msg.id === updateMessage.id
          );
          if (targetIndex < 0) return old;
          const newMsgs = [...old.messages];
          newMsgs.splice(targetIndex, 1, updateMessage);
          return { messages: newMsgs };
        }
      );
      doneEdit();
    },
  });

  const { mutate: onDelete } = useMutation<
    { deleteMessage: IMessage["id"] },
    unknown,
    IMessage["id"]
  >((id) => fetcher(DELETE_MESSAGE, { id, userId }), {
    onSuccess: ({ deleteMessage: deletedId }) => {
      client.setQueryData(
        QueryKeys.MESSAGES,
        (old: { messages: IMessage[] }) => {
          const targetIndex = msgs.findIndex((msg) => msg.id === deletedId);
          if (targetIndex < 0) return old;
          const newMsgs = [...old.messages];
          newMsgs.splice(targetIndex, 1);
          return { messages: newMsgs };
        }
      );
    },
  });

  const doneEdit = () => setEditingId(null);

  const { data, error, isError } = useQuery(QueryKeys.MESSAGES, () =>
    fetcher(GET_MESSAGES)
  );

  useEffect(() => {
    if (!data?.messages) return;
    setMsgs(data?.messages || []);
  }, [data?.messages]);

  if (isError) {
    console.error(error);
    return null;
  }

  // const getMsgs = async () => {
  //   const newMsgs = await fetcher("get", "/messages", {
  //     params: { cursor: msgs[msgs.length - 1]?.id || "" },
  //   });
  //   if (newMsgs.length === 0) setHasNext(false);
  //   setMsgs((msgs) => [...msgs, ...newMsgs]);
  // };

  // useEffect(() => {
  //   if (intersecting && hasNext) getMsgs();
  // }, [intersecting]);

  return (
    <>
      {userId && <MsgInput mutate={onCreate} />}
      <ul className="messages">
        {msgs.map((x) => (
          <MsgItem
            key={x.id}
            {...x}
            onUpdate={onUpdate}
            onDelete={() => onDelete(x.id)}
            startEdit={() => setEditingId(x.id)}
            isEditing={editingId === x.id}
            myId={userId}
            user={users.find((u) => u.id === x.userId)}
          />
        ))}
      </ul>
      {/* <div ref={fetchMoreEl} /> */}
    </>
  );
};

export default MsgList;
