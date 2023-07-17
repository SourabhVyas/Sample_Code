import { React, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import ProfileScroolList from "./ProfileScroolList";
import Home from "./Home";
import MainScrool from "./MainScrool";
import Explore from "./Explore";

export default function ScroolPage() {
  const [writer, setWriter] = useState(false);
  let active = "explore";

  if (
    window.location.pathname.split("/")[1] ===
    "@" + sessionStorage.getItem("userHandle")
  ) {
    active = window.location.pathname.split("/")[2];
  }

  const navigate = useNavigate();

  function home() {
    navigate("../@" + sessionStorage.getItem("userHandle") + "/home");
  }
  function profile() {
    navigate("../@" + sessionStorage.getItem("userHandle") + "/scrools");
    navigate(0);
  }
  function explore() {
    navigate("../@" + sessionStorage.getItem("userHandle") + "/explore");
  }

  return (
    <div className="column-container">
      <div className="sidebar">
        <div className="navigation">
          <ul>
            <li
              id="nav-home"
              onClick={home}
              className={active === "home" ? "active" : null}
            >
              <svg viewBox="0 -960 960 960">
                <path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z" />
              </svg>
              Home
            </li>
            <li
              id="nav-profile"
              onClick={profile}
              className={active === "scrools" ? "active" : null}
            >
              <svg viewBox="0 -960 960 960">
                <path d="M480-481q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM160-160v-94q0-38 19-65t49-41q67-30 128.5-45T480-420q62 0 123 15.5T731-360q31 14 50 41t19 65v94H160Z" />
              </svg>
              Profile
            </li>
            <li
              id="nav-explore"
              onClick={explore}
              className={active === "explore" ? "active" : null}
            >
              <svg viewBox="0 -960 960 960">
                <path d="M796-121 533-384q-30 26-69.959 40.5T378-329q-108.162 0-183.081-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l264 262-44 44ZM377-389q81.25 0 138.125-57.5T572-585q0-81-56.875-138.5T377-781q-82.083 0-139.542 57.5Q180-666 180-585t57.458 138.5Q294.917-389 377-389Z" />
              </svg>
              Explore
            </li>
          </ul>
        </div>
        {sessionStorage.getItem("userHandle") && (
          <>
            <button
              className="add-scrool-button"
              onClick={() => {
                setWriter(!writer);
              }}
            >
              Create
            </button>
          </>
        )}
      </div>
      <div className="scrool-region">
        <Routes>
          <Route path="" element={<Navigate to="scrools" />} />
          <Route
            path="home"
            element={<Home writer={writer} setWriter={setWriter} />}
          />
          <Route
            path="scrools"
            element={
              <ProfileScroolList writer={writer} setWriter={setWriter} />
            }
          />
          <Route path="scrools/:sid" element={<MainScrool />} />
          <Route path="explore" element={<Explore />} />
        </Routes>

        <div className="scrool-end">•</div>
      </div>
      <div className="feeds">
        <Explore />
      </div>
    </div>
  );
}
