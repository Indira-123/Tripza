import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TrendingPlaces from "./components/TrendingPlaces";
import ExplorePlaces from "./components/ExplorePlaces";
import {
  Landing,
  Signup,
  Login,
  Agencies,
  Profile,
  Hotels,
  Contribute,
  Reviews,
  Placeinfo
} from "./pages";
import { useState } from "react";
function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/agencies" element={<Agencies />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contribute" element={<Contribute />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reviews" element={<Reviews/>} />
          <Route path="/placeinfo" element={<Placeinfo />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
