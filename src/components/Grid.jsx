import { useEffect, useRef } from "react";

const Grid = ({ grid, getBg, click }) => {
  // console.log('rendering grid');
  const gridRef = useRef();

  useEffect(() => {
    gridRef.current.focus();
  }, []);

  return (
    <div
      ref={gridRef}
      tabIndex={0}
      // onFocus={(() => console.log('focus'))}
      // onBlur={(() => console.log('blur'))}
      className="grid h-[750px] min-w-[750px] grid-cols-15 grid-rows-15
        border-2 border-black focus:outline-none"
    >
      {grid.map((row) =>
        row.map((cell) => (
          <div
            key={cell.id}
            // id={`cell${cell.id}`}
            onClick={() => click(cell)}
            className={`relative select-none border border-black
              text-center text-[26px] font-light uppercase
              leading-[50px] ${getBg(cell)}`}
          >
            <div className="absolute left-1 select-none text-xs font-normal">
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
