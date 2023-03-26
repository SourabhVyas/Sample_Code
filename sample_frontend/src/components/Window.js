import NoteList from "./NoteList";
import Authentication from "./Authentication";
import Search from "./Search";


import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

export default function Window(props) {
  const [user, setUser] = useState({
    userId: "",
  });

  const navigate = useNavigate();

  function handleRoutes(route) {
    navigate(route);
  }

  return (
    <>
      <Routes>
        <Route path="" element={<Navigate to="auth" />} />
        <Route
          path="auth"
          element={
            <Authentication setUser={setUser} setWindow={handleRoutes} />
          }
        ></Route>
        <Route path="notes" element={<NoteList user={user} />} />
        <Route path="search" element={<Search />} />
      </Routes>
    </>
  );
}
