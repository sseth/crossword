import { useEffect, useRef } from "react";

import { across, down } from "./xwd";

const acrossList = Object.keys(across).map((n) => ({
  num: n,
  text: across[n].text,
}));
const downList = Object.keys(down).map((n) => ({
  num: n,
  text: down[n].text,
}));

const ClueList = ({ dir, clue: activeClue }) => {
  // console.log('rendering clue list');
  // const activeClueRef = useRef();

  const handleClick = (clue) => {
    // setClue(clue);
  };

  // useEffect(() => {
  //   activeClueRef.current.scrollIntoView();
  // }, [clue])
  const listStyles = "mb-3 p-2 h-[330px] w-[400px] overflow-scroll";

  return (
    <div className="mt-[10px] h-full foc" tabIndex={-1}>
      <div>
        <div className="border-b text-lg font-bold">Across</div>
        <div className={listStyles}>
          {acrossList.map((clue) => (
            <div
              key={clue.num}
              onClick={() => handleClick(clue)}
              className={`p-1
                ${dir && activeClue.num == clue.num ? "bg-blue-200" : ""}
                ${!dir && activeClue.num == clue.num ? "bg-[#ccc]" : ""}`}
            >
              <span className="mr-2 font-bold">{`${clue.num}.`}</span>
              {clue.text}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="border-b text-lg font-bold">Down</div>
        <div className={listStyles}>
          {downList.map((clue) => (
            <div
              key={clue.num}
              onClick={() => handleClick(clue)}
              className={`p-1
                ${!dir && activeClue.num == clue.num ? "bg-blue-200" : ""}
                ${dir && activeClue.num == clue.num ? "bg-[#ccc]" : ""}`}
            >
              <span className="mr-2 font-bold">{`${clue.num}.`}</span>
              {clue.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClueList;
