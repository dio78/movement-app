import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Skeleton from "./Skeleton/Skeleton"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<Skeleton />} />
      </Routes>
    </div>
  );
}

function Home() {
  return (
    <>
      <main>
      <h1>Welcome to React Router!</h1>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
      </main>
      <nav>
        <Link to="/about">Skeleton</Link>
      </nav>
    </>
  );
}

function About() {
  return (
    <>
      <main>
        <h2>Who are we?</h2>
        <p>
          That feels like an existential question, don't you
          think?
        </p>
      </main>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  );
}

export default App