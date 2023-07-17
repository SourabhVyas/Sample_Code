import { React, useState } from "react";

import Login from "./authentication/Login";
import Register from "./authentication/Register";

export default function Authentication(props) {
  const [isLoginForm, setisLoginForm] = useState(true);

  return (
    <>
      {isLoginForm ? (
        <Login login={props.login} setisLoginForm={setisLoginForm} />
      ) : (
        <Register login={props.login} setisLoginForm={setisLoginForm} />
      )}
    </>
  );
}
