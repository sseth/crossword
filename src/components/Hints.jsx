import { useState, useEffect } from "react";

const Hints = ({ menuProps }) => {
  const { setGrid, cell, clue, dir, setSolved } = menuProps;
  const [hintType, setHintType] = useState("letter");

  const handleSelect = (e) => {
    setHintType(e.target.value);
  };

  const reveal = () => {
    switch (hintType) {
      case "letter":
        return setGrid((grid) =>
          grid.map((r) =>
            r.map((c) => (c === cell ? { ...c, input: c.letter } : c))
          )
        );
      case "word":
        return setGrid((grid) =>
          grid.map((r, i) => {
            return r.map((c, j) => {
              const cond = dir ? clue.num === c.across : clue.num === c.down;
              return cond ? { ...c, input: c.letter } : c;
            });
          })
        );
      case "grid":
        setGrid((grid) =>
          grid.map((r) => r.map((c) => ({ ...c, input: c.letter })))
        );
        return setSolved(true);
    }
  };

  const check = () => {
    console.log("check", hintType);
    switch (hintType) {
      case "letter":
      case "word":
      case "grid":
      default:
        return;
    }
  };

  return (
    <div className="flex gap-2">
      <button onClick={reveal} className="border border-black px-1">
        Reveal
      </button>
      <button onClick={check} className="border border-black px-1">
        Check
      </button>
      <select value={hintType} onChange={handleSelect} className="px-2">
        <option value="letter">Letter</option>
        <option value="word">Word</option>
        <option value="grid">Grid</option>
      </select>
    </div>
  );
};

export default Hints;

// return setGrid((grid) =>
//   grid.map((r, i) => {
//     return r.map((c, j) => {
//       const clueNum = dir ? across[c];
//       const x = dir ? i : j;
//       const y = dir ? j : i;
//       // TODO: change to N
//       const line = dir ? Math.floor(cell.id / 15) : cell.id % 15;
//       const start = dir ? Math.floor(clue.start / 15) : clue.start % 15;
//       const end = start + clue.answer.length;
//       // console.log(`line: ${line}\nstart: ${start}\nend: ${end}`);
//       return x == line && y >= start && y < end
//         ? { ...c, input: c.letter }
//         : c;
//     });
//   })
// );
