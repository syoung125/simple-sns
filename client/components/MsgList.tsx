import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import fetcher from "../fetcher";
import { Message } from "../types/message";

import MsgInput from "./MsgInput";
import MsgItem from "./MsgItem";

const MsgList = () => {
  const { query } = useRouter();
  const userId = query.userId || query.userid || "";
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [editingId, setEditingId] = useState<string>(null);

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
    const msgs = await fetcher("get", "/messages");
    setMsgs(msgs);
  };

  useEffect(() => {
    getMsgs();
  }, []);

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
    </>
  );
};

export default MsgList;
