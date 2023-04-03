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
            r.map((c) => (c === cell ? { ...c, input: c.letter, incorrect: false } : c))
          )
        );
      case "word":
        return setGrid((grid) =>
          grid.map((r) => {
            return r.map((c) => {
              const isCurrentWord = dir
                ? clue.num === c.across
                : clue.num === c.down;
              return isCurrentWord ? { ...c, input: c.letter, incorrect: false } : c;
            });
          })
        );
      case "grid":
        setGrid((grid) =>
          grid.map((r) => r.map((c) => ({ ...c, input: c.letter, incorrect: false })))
        );
        return setSolved(true);
    }
  };

  const check = () => {
    switch (hintType) {
      case "letter":
        return setGrid((grid) =>
          grid.map((r) =>
            r.map((c) => {
              if (c === cell && c.input && c.input !== c.letter)
                return { ...c, incorrect: true };
              return c;
            })
          )
        );
      case "word":
        return setGrid((grid) =>
          grid.map((r) => {
            return r.map((c) => {
              if (c.input && c.input !== c.letter) {
                const isCurrentWord = dir
                  ? clue.num === c.across
                  : clue.num === c.down;
                return isCurrentWord ? { ...c, incorrect: true } : c;
              }
              return c;
            });
          })
        );
      case "grid":
        return setGrid((grid) =>
          grid.map((r) =>
            r.map((c) => {
              if (c.input && c.input !== c.letter)
                return { ...c, incorrect: true };
              return c;
            })
          )
        );
    }
  };

  return (
    <div className="flex gap-2">
      <button onClick={reveal} className="border border-black px-1" tabIndex={-1}>
        Reveal
      </button>
      <button onClick={check} className="border border-black px-1" tabIndex={-1}>
        Check
      </button>
      <select value={hintType} onChange={handleSelect} className="px-2" tabIndex={-1}>
        <option value="letter">Letter</option>
        <option value="word">Word</option>
        <option value="grid">Grid</option>
      </select>
    </div>
  );
};

export default Hints;
