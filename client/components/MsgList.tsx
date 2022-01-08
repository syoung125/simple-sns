import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

import MsgInput from "./MsgInput";
import MsgItem from "./MsgItem";

import useInfiniteScroll from "../hooks/useInfiniteScroll";
import fetcher from "../fetcher";
import { Message } from "../types/message";

const MsgList = () => {
  const { query } = useRouter();
  const userId = query.userId || query.userid || "";
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [editingId, setEditingId] = useState<string>(null);
  const [hasNext, setHasNext] = useState(true);
  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

  const onCreate = async (text: string) => {
    const newMsg = await fetcher("post", "/messages", { text, userId });
    if (!newMsg) throw Error("something wrong");
    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  const onUpdate = async (text: string, id: string) => {
    const newMsg = await fetcher("put", `/messages/${id}`, { text, userId });
    if (!newMsg) return;
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);
      if (!newMsg) throw Error("something wrong");
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1, newMsg);
      return newMsgs;
    });
    doneEdit();
  };

  const onDelete = async (id: string) => {
    const receviedId = await fetcher("delete", `/messages/${id}`, {
      params: { userId },
    });
    if (!receviedId) return;
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex(
        (msg) => msg.id === receviedId.toString()
      );
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
  };

  const doneEdit = () => setEditingId(null);

  const getMsgs = async () => {
    const newMsgs = await fetcher("get", "/messages", {
      params: { cursor: msgs[msgs.length - 1]?.id || "" },
    });
    if (newMsgs.length === 0) setHasNext(false);
    setMsgs((msgs) => [...msgs, ...newMsgs]);
  };

  useEffect(() => {
    if (intersecting && hasNext) getMsgs();
  }, [intersecting]);

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
            myId={userId.toString()}
          />
        ))}
      </ul>
      <div ref={fetchMoreEl} />
    </>
  );
};

export default MsgList;
