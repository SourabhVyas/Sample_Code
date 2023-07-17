import { React, useState } from "react";
import axios from "axios";

import { SERVER_URL } from "../../Constants";

export default function Authentication(props) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  function handleLogin() {
    let baseURL = SERVER_URL + "/auth/login/";

    axios
      .post(baseURL, {
        email: email,
        password: password,
      })
      .then((response) => {
        if ("error" in response.data) {
          if (response.data.error.message === "EMAIL_NOT_FOUND") {
            props.setisLoginForm(false);
          } else if (response.data.error.message === "INVALID_EMAIL") {
            alert("invalid email address");
          }
        } else {
          sessionStorage.setItem("displayName", response.data.displayName);
          sessionStorage.setItem("userHandle", response.data.userHandle);
          sessionStorage.setItem("loginId", response.data.loginId);
          sessionStorage.setItem("profilePic", response.data.profilePic);
          props.login();
        }
      });
  }

  return (
    <div className="login">
      <input
        className="email-input"
        type="text"
        placeholder="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <input
        className="password-input"
        type="text"
        placeholder="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button
        className="login-button"
        onClick={() => {
          handleLogin(email, password);
        }}
      >
        Login
      </button>
      <button
        className="signup-button"
        onClick={() => {
          props.setisLoginForm(false);
        }}
      >
        Create new account
      </button>
    </div>
  );
}
