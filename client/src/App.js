import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./component/layout/Navbar";
import Footer from "./component/layout/Footer";
import Landing from "./component/layout/Landing";
import "./App.css";
import Register from "./component/auth/Register";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Landing />
          <Route exact path="/" component={Landing} />
          <div className="container">
            <Route exact path = "/register" component = {Register}/>
            <Route exact path = "/login" component = {Login}/>
          </div>

          <Footer />
        </div>
      </Router>
    );
  }
}
export default App;
