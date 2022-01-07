import { useState } from "react";

import { Message } from "../types/message";

import MsgInput from "./MsgInput";
import MsgItem from "./MsgItem";

const UserIds = ["roy", "jay"];
const getRandomUserId = () => UserIds[Math.round(Math.random())];

const msgsSize = 50;

const originalMessages: Message[] = Array(msgsSize)
  .fill(0)
  .map((_, i) => ({
    id: msgsSize - i,
    userId: getRandomUserId(),
    timestamp: 123456890123 + (msgsSize - i) * 1000 * 60,
    text: `${msgsSize - i} mock text`,
  }));

const MsgList = () => {
  const [msgs, setMsgs] = useState<Message[]>(originalMessages);
  const [editingId, setEditingId] = useState<number>(null);

  const onCreate = (text: string) => {
    const newMsg: Message = {
      id: msgs.length + 1,
      userId: getRandomUserId(),
      timestamp: Date.now(),
      text: `${msgs.length + 1} ${text}`,
    };
    setMsgs((msgs) => [newMsg, ...msgs]);
    msgs.unshift(newMsg);
  };

  const onUpdate = (text: string, id: number) => {
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1, { ...msgs[targetIndex], text });
      return newMsgs;
    });
    doneEdit();
  };

  const onDelete = (id: number) => {
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
  };

  const doneEdit = () => setEditingId(null);

  return (
    <>
      <MsgInput mutate={onCreate} />
      <ul className="messages">
        {msgs.map((x) => (
          <MsgItem
            key={x.id}
            {...x}
            onUpdate={onUpdate}
            onDelete={() => onDelete(x.id)}
            startEdit={() => setEditingId(x.id)}
            isEditing={editingId === x.id}
          />
        ))}
      </ul>
    </>
  );
};

export default MsgList;
