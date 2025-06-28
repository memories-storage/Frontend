import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context';
import Header from './components/layout/Header';
import Home from './pages/Home';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Header />
          <main id="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Add more routes here as you create more pages */}
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
