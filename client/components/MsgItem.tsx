import { Message } from "../types/message";
import MsgInput from "./MsgInput";

type MsgItemProps = Message & {
  onUpdate: (text: string, id: string) => void;
  onDelete: () => void;
  isEditing: boolean;
  startEdit: () => void;
  myId: string;
};

const MsgItem = ({
  id,
  userId,
  timestamp,
  text,
  onUpdate,
  onDelete,
  isEditing,
  startEdit,
  myId,
}: MsgItemProps) => (
  <li className="messages__item">
    <h3>
      {userId}{" "}
      <sub>
        {new Date(timestamp).toLocaleString("ko-KR", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </sub>
    </h3>
    {isEditing ? <MsgInput mutate={onUpdate} text={text} id={id} /> : text}
    {myId === userId && (
      <div className="messages_buttons">
        <button onClick={startEdit}>수정</button>
        <button onClick={onDelete}>삭제</button>
      </div>
    )}
  </li>
);

export default MsgItem;
