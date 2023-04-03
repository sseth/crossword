import { useEffect, useRef } from "react";

const Grid = ({ grid, getBg, click }) => {
  // console.log('rendering grid');
  const gridRef = useRef();
  useEffect(() => {
    // if (gridRef.current)
    gridRef.current.focus();
  }, []);

  return (
    <div
      ref={gridRef}
      tabIndex={0}
      className="grid h-[750px] min-w-[750px] grid-cols-15 grid-rows-15
        border-2 border-black focus:outline-none"
    >
      {grid.map((row) =>
        row.map((cell) => (
          <div
            key={cell.id}
            ref={cell.ref}
            onClick={() => click(cell)}
            className={`relative select-none border border-black
              text-center text-[26px] font-light uppercase
              leading-[50px] ${getBg(cell)} ${cell.incorrect ? 'text-red-600' : ''}`}
          >
            <div className="absolute left-1 select-none text-xs font-normal text-black">
              {cell.label || ""}
            </div>
            {cell.input}
          </div>
        ))
      )}
    </div>
  );
};

export default Grid;
