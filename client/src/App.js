import React, { Component } from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <div className="App">

          <Navbar />
      <Routes>  
        <Route exact path="/" element={<Landing/>} /> 
        <Route exact path="/register" element={<Register/>} />
        <Route exact path="/login" element={<Login/>} />  
      </Routes>
      <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
