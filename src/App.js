import React from 'react';
import Todo from './components/Todo';
import 'bootstrap/dist/css/bootstrap.css'; 

function App() {
  return (
    <div>
      <div className="nav-scroller bg-white shadow-sm p-2 mb-4">
        <nav className="nav nav-underline">
          <a className="nav-link active" href="/">Dashboard</a>
          <a className="nav-link" href="/">
            Friends
            <span className="badge badge-pill bg-light align-text-bottom">27</span>
          </a>
          <a className="nav-link" href="/">Explore</a>
          <a className="nav-link" href="/">Suggestions</a>
        </nav>
      </div>
      <Todo />
    </div>
  );
}

export default App;
