import Timer from "./Timer";
import Hints from "./Hints";

const Menu = (props) => {
  return (
    <div className="flex justify-around py-2 px-10">
      <button onClick={props.clearGrid}>Reset</button>
      <Hints menuProps={props} />
      <Timer menuProps={props} />
    </div>
  );
};

export default Menu;
