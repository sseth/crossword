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

const ClueList = ({ dir, clue: activeClue, cell, getCell, moveToCell }) => {
  // console.log('rendering clue list');
  const activeClueRef = useRef();
  const otherClueRef = useRef();

  const moveTo = (clue, isAcrossClue) =>
    moveToCell(
      ...getCell(
        isAcrossClue ? across[clue.num] : down[clue.num],
        dir !== isAcrossClue
      )
    );

  const getRef = (clue, across) => {
    if (dir === across)
      return clue.num == activeClue.num ? activeClueRef : null;
    if (dir && clue.num == cell.down) return otherClueRef;
    if (!dir && clue.num == cell.across) return otherClueRef;
  };

  const getBg = (clue, across) => {
    if (dir === across) return clue.num == activeClue.num ? "bg-blue-200" : "";
    if (dir && clue.num == cell.down) return "bg-[#ccc]";
    if (!dir && clue.num == cell.across) return "bg-[#ccc]"; 
    return "";
  };

  useEffect(() => {
    // TODO: don't scroll if clue already visible
    if (activeClueRef.current) activeClueRef.current.scrollIntoView();
    if (otherClueRef.current) otherClueRef.current.scrollIntoView();
  }, [activeClue]);

  const listStyles = "mb-3 p-2 h-[330px] w-[400px] overflow-scroll";

  return (
    <div className="foc mt-[10px] h-full" tabIndex={-1}>
      <div>
        <div className="mb-2 border-b text-lg font-bold">Across</div>
        <div className={listStyles}>
          {acrossList.map((clue) => (
            <div
              key={clue.num}
              onClick={() => moveTo(clue, true)}
              ref={getRef(clue, true)}
              className={`cursor-pointer p-1 ${getBg(clue, true)}`}
            >
              <span className="mr-2 font-bold">{`${clue.num}.`}</span>
              {clue.text}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-2 border-b text-lg font-bold">Down</div>
        <div className={listStyles}>
          {downList.map((clue) => (
            <div
              key={clue.num}
              onClick={() => moveTo(clue, false)}
              ref={getRef(clue, false)}
              className={`cursor-pointer p-1 ${getBg(clue, false)}`}
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
