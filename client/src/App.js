// import logo from './logo.svg';
import './styles/theme.css';
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Main from './pages/Main';
import Register from './pages/Register';
import Login from './pages/Login';
import SetupProfile from './pages/SetupProfile';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/l" element={<Login />} />
        <Route path="/r" element={<Register />} />
        <Route path="/r/profile" element={<SetupProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
