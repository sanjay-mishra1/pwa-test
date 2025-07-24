// src/Counter.js
import React, { useState } from 'react';

function Counter(props) {
  // 1. State: `count` is a state variable, `setCount` is the function to update it.
  //    Initial state is 0.
  const [count, setCount] = useState(0);

  // 2. Event Handling: Function to increment the count
  const increment = () => {
    setCount(count + 1);
  };

  // 3. Event Handling: Function to decrement the count
  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px', borderRadius: '8px' }}>
      <h2>{props.title}</h2> {/* 4. Props: Accessing the title passed from App.js */}
      <p>Current Count: {count}</p>
      <button onClick={increment} style={{ marginRight: '10px', padding: '10px 15px', cursor: 'pointer' }}>Increment</button>
      <button onClick={decrement} style={{ padding: '10px 15px', cursor: 'pointer' }}>Decrement</button>
      <p style={{ marginTop: '15px', fontSize: '0.9em', color: '#666' }}>
        This counter demonstrates <strong>state</strong>, <strong>event handling</strong>, and <strong>props</strong>.
      </p>
    </div>
  );
}

export default Counter;