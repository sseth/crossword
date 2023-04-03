import { useState, useRef, useEffect, useLayoutEffect } from "react";

import { cells, across, down } from "./xwd";

import Grid from "./Grid";
import ClueBox from "./ClueBox";
import ClueList from "./ClueList";
// import Timer from "./Timer";
import Menu from "./Menu";

const gridInit = [];
let r = [];
let label = 0;
cells.forEach((cell, i) => {
  cell.id = i;
  if (cell.across === label + 1 || cell.down === label + 1) {
    label++;
    cell.label = label;
    if (across[label]) across[label].start = i;
    if (down[label]) down[label].start = i;
  }
  cell.input = null;
  // cell.ref = null;
  cell.isBlank = cell.letter === null;
  cell.incorrect = false;
  r.push(cell);
  if ((i + 1) % 15 === 0) {
    gridInit.push(r);
    r = [];
  }
});

const acrossKeys = Object.keys(across);
const downKeys = Object.keys(down);
const N = gridInit.length;
const GRID_START = cells.findIndex((cell) => cell.letter !== null);

const Crossword = () => {
  // console.log('rendering');
  const prevGridState = localStorage.getItem("grid");
  const [grid, setGrid] = useState(
    prevGridState ? JSON.parse(prevGridState) : gridInit
  );
  // const gridRefs = gridInit.map((r) => r.map((c) => useRef()));
  // const withRefs = (g) =>
  // g.map((r, i) => r.map((c, j) => ({ ...c, ref: gridRefs[i][j] })));
  // const [grid, setGrid] = useState(
  // prevGridState ? withRefs(JSON.parse(prevGridState)) : withRefs(gridInit)
  // );
  const rowInit = Math.floor(GRID_START / N);
  const [row, setRow] = useState(rowInit);
  const colInit = GRID_START % N;
  const [col, setCol] = useState(colInit);
  const [dir, setDir] = useState(true); // true = across, false = down
  const [activeCell, setActiveCell] = useState(grid[rowInit][colInit]);
  const [clue, setClue] = useState({ num: 1, text: across[1].text });
  const [solved, setSolved] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const [rebusMode, setRebusMode] = useState(false);
  // TODO? const [mistakeCount, setmistakeCount] = useState(0);

  const setActiveClue = (cell) => {
    // if (!cell) return;
    const num = dir ? cell.across : cell.down;
    const { text } = dir ? across[num] : down[num];
    setClue({ num, text });
  };

  const moveTo = (x, y) => {
    if (x === row && y === col) return;
    if (x < 0 || x > N - 1) return;
    if (y < 0 || y > N - 1) return;
    const newActive = grid[x][y];
    if (newActive.isBlank) return;
    if (rebusMode) setRebusMode(false);
    setRow(x);
    setCol(y);
    setActiveCell(newActive);
    setActiveClue(newActive);
  };

  const getIndices = (cellNum) => [Math.floor(cellNum / N), cellNum % N];

  const nextActiveCell = (targetClue = null, flip = false) => {
    if (flip) setDir(!dir);
    const direction = flip ? !dir : dir;
    const currentClue = targetClue
      ? targetClue
      : direction
      ? across[clue.num]
      : down[clue.num];

    const step = direction ? 1 : N;
    const end = currentClue.start + currentClue.answer.length * step;
    let nextCellNum = targetClue ? end : activeCell.id + step;
    // check current cell to end
    while (nextCellNum < end) {
      const [x, y] = getIndices(nextCellNum);
      if (grid[x] && grid[x][y] && !grid[x][y].input) return [x, y];
      nextCellNum += step;
    }
    // check start to current cell
    nextCellNum = currentClue.start;
    const stopIndex = targetClue ? end : activeCell.id;
    while (nextCellNum < stopIndex) {
      const [x, y] = getIndices(nextCellNum);
      if (grid[x][y] && !grid[x][y].input) return [x, y];
      nextCellNum += step;
    }
    // (TODO) ^option: don't skip over filled letters
    if (targetClue) return getIndices(currentClue.start);

    // if at end of clue, stay there
    // (or, optionally, move to next word)
    let [x, y] = getIndices(nextCellNum);
    if (direction) y++;
    else x++;
    if (!grid[x] || !grid[x][y] || grid[x][y].isBlank) return [row, col];
    // else move to next cell
    return [x, y];
  };

  const getNextClue = (prev = false) => {
    // TODO: add option to skip over filled clues
    if (dir)
      return acrossKeys[
        acrossKeys.findIndex((n) => n == clue.num) + (prev ? -1 : 1)
      ];
    else
      return downKeys[
        downKeys.findIndex((n) => n == clue.num) + (prev ? -1 : 1)
      ];
  };

  const clearGrid = () => {
    if (window.confirm("Reset?")) {
      setResetTimer(true);
      setGrid(gridInit);
      // setGrid(withRefs(gridInit));
    }
  };

  const handleKeyDown = (e) => {
    let x = 1;
    switch (e.key) {
      case "ArrowRight":
        if (!dir) return setDir(true);
        while (grid[row][col + x] && grid[row][col + x].isBlank) x++;
        return moveTo(row, col + x);
      case "ArrowLeft":
        if (!dir) return setDir(true);
        while (grid[row][col - x] && grid[row][col - x].isBlank) x++;
        return moveTo(row, col - x);
      case "ArrowUp":
        if (dir) return setDir(false);
        while (grid[row - x] && grid[row - x][col].isBlank) x++;
        return moveTo(row - x, col);
      case "ArrowDown":
        if (dir) return setDir(false);
        while (grid[row + x] && grid[row + x][col].isBlank) x++;
        return moveTo(row + x, col);

      case "Backspace":
        setGrid(
          grid.map((r, i) =>
            r.map((cell, j) =>
              row === i && col === j
                ? { ...cell, input: null, incorrect: false }
                : cell
            )
          )
        );
        // if (rebusMode) {}; TODO
        // if no/one letter in cell, clear and move left/down
        // else clear last letter in cell and inc. font size
        return dir ? moveTo(row, col - 1) : moveTo(row - 1, col);

      case "Tab":
      case "Enter":
        e.preventDefault();
        let cell;
        if (dir) {
          if (!e.shiftKey) {
            const nextClue = across[getNextClue()];
            // if (!nextClue) setDir(false);
            cell = nextClue
              ? nextActiveCell(nextClue)
              : nextActiveCell(across[acrossKeys[0]], true);
          } else {
            const prevClue = across[getNextClue(true)];
            // if (!prevClue) setDir(false);
            cell = prevClue
              ? nextActiveCell(prevClue)
              : nextActiveCell(down[downKeys[downKeys.length - 1]], true);
          }
        } else {
          if (!e.shiftKey) {
            const nextClue = down[getNextClue()];
            // if (!nextClue) setDir(true);
            cell = nextClue
              ? nextActiveCell(nextClue)
              : nextActiveCell(down[downKeys[0]], true);
          } else {
            const prevClue = down[getNextClue(true)];
            // if (!prevClue) setDir(true);
            cell = prevClue
              ? nextActiveCell(prevClue)
              : nextActiveCell(across[acrossKeys[acrossKeys.length - 1]], true);
          }
        }
        // console.log(cell);
        return moveTo(...cell);

      case "Home":
        const first = dir ? across[clue.num].start : down[clue.num].start;
        return moveTo(...getIndices(first));
      case "End":
        const c = dir ? across[clue.num] : down[clue.num];
        const last = c.start + (c.answer.length - 1) * (dir ? 1 : N);
        return moveTo(...getIndices(last));

      case " ":
        return setDir(!dir);

      case '+':
        return setRebusMode(true);

      case "F5":
        return clearGrid();

      default:
        if (e.metaKey) return;
        // if (rebusMode) {}; TODO
        // if num of letters in cell === cell max, return?
        // dec. font size and append e.key to cell.input
        if (e.keyCode >= 65 && e.keyCode <= 90) {
          setGrid(
            grid.map((r, i) => {
              return r.map((cell, j) =>
                row === i && col === j ? { ...cell, input: e.key, incorrect: false } : cell
              );
            })
          );
          moveTo(...nextActiveCell());
          // TODO (option):
          // if current clue filled, move to first empty cell of next clue
        }
        // return;
    }
  };

  const handleClick = (cell) => {
    if (cell === activeCell) {
      setDir(!dir);
    } else {
      moveTo(...getIndices(cell.id));
    }
  };

  useLayoutEffect(() => setActiveClue(activeCell), [dir]);

  const getBg = (cell) => {
    if (!cell.letter) return "bg-[#404040]";
    if (cell.id === activeCell.id) return "bg-blue-200";
    if (dir && cell.across === clue.num) return "bg-[#ccc]";
    if (!dir && cell.down === clue.num) return "bg-[#ccc]";
    return "";
  };

  useEffect(() => {
    if (solved) return;
    const allCorrect = grid.reduce(
      (x, row) =>
        x && row.reduce((y, cell) => y && cell.input === cell.letter, true),
      true
    );
    const timer = setTimeout(() => {
      setSolved(allCorrect);
      if (allCorrect) window.alert("congrats lol");
    }, 1000);
    return () => clearTimeout(timer);
  }, [grid]);

  useEffect(() => {
    localStorage.setItem("grid", JSON.stringify(grid));
    // localStorage.setItem(
    //   "grid",
    //   JSON.stringify(grid.map((r) => r.map((c) => ({ ...c, ref: null }))))
    // );
  }, [grid]);

  return (
    <div className="overflow-hidden">
      <Menu
        dir={dir}
        clue={clue}
        cell={activeCell}
        setGrid={setGrid}
        setSolved={setSolved}
        clearGrid={clearGrid}
        resetTimer={resetTimer}
        setResetTimer={setResetTimer}
      />
      <ClueBox clue={clue} />
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="ml-6 mt-2 flex w-screen gap-7 p-3 focus:outline-none"
      >
        <Grid grid={grid} getBg={getBg} click={handleClick} />
        <ClueList
          dir={dir}
          clue={clue}
          cell={activeCell}
          moveToCell={moveTo}
          getCell={nextActiveCell}
        />
      </div>
    </div>
  );
};

export default Crossword;
