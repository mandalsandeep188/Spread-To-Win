import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./screens/Home";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Home />
      <ToastContainer />
    </div>
  );
}

export default App;
