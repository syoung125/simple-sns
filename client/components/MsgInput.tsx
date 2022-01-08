const { useRef } = require("react");

type MsgInputProps = {
  mutate: (input: { text: string; id?: string }) => void;
  text?: string;
  id?: string;
};

const MsgInput = ({ mutate, text = "", id }: MsgInputProps) => {
  const textRef = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const text = textRef.current.value;
    textRef.current.value = "";
    mutate({ text, id });
  };

  return (
    <form className="messages__input" onSubmit={onSubmit}>
      <textarea
        ref={textRef}
        defaultValue={text}
        placeholder="내용을 입력하세요."
      />
      <button type="submit">완료</button>
    </form>
  );
};

export default MsgInput;
