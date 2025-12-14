// Import your module if it exists
import { drawPhase } from "../phases/drawPhase.js";

console.log(drawPhase);
console.log("frontend running");

// Example child component
const Phase = ({ phaseName }) => {
  return React.createElement("div", { style: { padding: "10px", border: "1px solid #ccc", margin: "5px" } }, `Phase: ${phaseName}`);
};

// Main Home component
const Home = () => {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement("h1", { style: { textAlign: "center" } }, "Game Home"),
    React.createElement("p", null, "Welcome to the game!"),
    // Render a few example components
    React.createElement(Phase, { phaseName: drawPhase || "Draw Phase Example" }),
    React.createElement(Phase, { phaseName: "Phase 2" }),
    React.createElement(Phase, { phaseName: "Phase 3" })
  );
};

// Render to the root element
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(Home));
