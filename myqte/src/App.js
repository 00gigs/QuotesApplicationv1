import "./App.css";
import React from "react";
import QuoteBox from "./components/QuoteBox";
import Navbar from "./components/Navbar";
import { Routes, Route } from 'react-router-dom';
import Community from './components/Community'
import Create from "./components/Create";
import Myqoutes from "./components/Myqoutes";
import Profile from "./components/Profile";
import GoatQuotes from "./components/GoatQuotes";
import Authpage from "./components/Authpage";
import Login from "./components/Login";
function App() {
  return (
    <div className="text-black bg-[#f1dfb8d3]">
      <Navbar />
    <Routes>
      <Route path="/" element={ <QuoteBox />}/>
      <Route path="/forum" element={<Community/>}/>
      <Route path="/quote-creator" element={ <Create />}/>
      <Route path="/my-quotes" element={ <Myqoutes />}/>
      <Route path="/GoatQuotes" element={ <GoatQuotes />}/>
      <Route path="/Profile" element={ <Profile/>}/>
      <Route path="/Authpage" element={ <Authpage/>}/>
      <Route path="/Login" element={<Login/>}/>
    </Routes>
    </div>


  );
}

export default App;
