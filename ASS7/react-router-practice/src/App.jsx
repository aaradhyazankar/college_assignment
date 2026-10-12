
import { BrowserRouter, Routes, Route, Link } from 'react-router';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <h1>React Router Practice</h1>

        <nav>
          <Link to="/">Home</Link>
          {' | '}
          <Link to="/about">About</Link>
          {' | '}
          <Link to="/contact">Contact</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
