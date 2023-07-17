import Authentication from "./components/Authentication";
import ScroolPage from "./components/ScroolPage";
import ScroolPageMobile from "./components/ScroolPageMobile";
import Explore from "./components/Explore";

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import { React, useState, useEffect } from "react";

import "./styles/styles.sass";

function App() {
  const navigate = useNavigate();
  const [screenWidth, getDimension] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => {
      getDimension(window.innerWidth);
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, [screenWidth]);

  function login() {
    navigate("/@" + sessionStorage.getItem("userHandle") + "/home");
  }

  return (
    <>
      <Routes>
        <Route path="" element={<Navigate to="auth" />} />
        <Route path="auth" element={<Authentication login={login} />} />
        {screenWidth >= 960 ? (
          <Route path=":uid/*" element={<ScroolPage />} />
        ) : (
          <Route path=":uid/*" element={<ScroolPageMobile />} />
        )}

        <Route path="explore" element={<Explore />} />
      </Routes>
    </>
  );
}

export default App;
