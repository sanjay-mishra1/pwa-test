// src/App.js
import React from 'react';
import './App.css'; // Keep original App.css for basic styling
import Counter from './Counter'; // Import our new Counter component
import PWAInstall from './PWAInstall';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Showcase App</h1>
        <p>Exploring fundamental React concepts.</p>
      </header>
      <main>
        {/* 1. Component Usage: Using our Counter component */}
        {/* 2. Props: Passing a 'title' prop to the Counter component */}
        <Counter title="Simple Counter" />
        <Counter title="Another Counter Instance" /> {/* Demonstrating multiple instances */}

        <div style={{ border: '1px solid #eee', padding: '20px', margin: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <h2>Basic Text Display</h2>
          <p>This is a simple paragraph rendered directly in the App component.</p>
          <p>It shows how easily you can display content.</p>
        </div>

        <div style={{ border: '1px solid #eee', padding: '20px', margin: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <h2>List Rendering Example</h2>
          <ul>
            {['Item 1', 'Item 2', 'Item 3'].map((item, index) => (
              <li key={index}>{item}</li> // Key prop is important for lists
            ))}
          </ul>
          <p>This demonstrates rendering a list of items using the `map` function.</p>
        </div>

      </main>
      <footer>
        <p>&copy; 2025 React Showcase</p>
        <PWAInstall />
      </footer>
    </div>
  );
}

export default App;