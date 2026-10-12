import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [input, setInput] = useState(1);

  return (
    <div className="container">
      <h1>React Counter</h1>

      <h2>{count}</h2>

      <div className="buttons">
        <button onClick={() => setCount(count + 1)}>
          +1
        </button>

        <button onClick={() => setCount(count - 1)}>
          -1
        </button>

        <button onClick={() => setCount(0)}>
          Reset
        </button>
      </div>

      <div className="custom-input">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a number"
        />

        <button onClick={() => setCount(count + Number(input))}>
          Add
        </button>

        <button onClick={() => setCount(count - Number(input))}>
          Subtract
        </button>
      </div>
    </div>
  );
}

export default App; 