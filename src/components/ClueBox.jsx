import { useRef } from "react";

const ClueBox = ({ clue }) => {
  const clueBoxRef = useRef();

  // useEffect(() => {
  //   if (!clue) return;

  //   if (clue.text.length > 70) {
  //     clueBoxRef.current.classList.remove("leading-[56px]");
  //     clueBoxRef.current.classList.add("leading-[28px]");
  //     clueBoxRef.current.classList.add("text-center");
  //   } else {
  //     clueBoxRef.current.classList.add("leading-[56px]");
  //     clueBoxRef.current.classList.remove("leading-[28px]");
  //     clueBoxRef.current.classList.remove("text-center");
  //   }
  // }, [clue]);

  return (
    <div
      ref={clueBoxRef}
      className="mt-3 h-fit w-full bg-blue-200 py-3 pl-10 pr-5 text-lg"
    >
      {`${clue.num}. ${clue.text}`}
    </div>
  );
};

export default ClueBox;
