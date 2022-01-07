import { Message } from "../types/message";
import MsgInput from "./MsgInput";

type MsgItemProps = Message & {
  onUpdate: (text: string, id: number) => void;
  onDelete: () => void;
  isEditing: boolean;
  startEdit: () => void;
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
    <div className="messages_buttons">
      <button onClick={startEdit}>수정</button>
      <button onClick={onDelete}>삭제</button>
    </div>
  </li>
);

export default MsgItem;
