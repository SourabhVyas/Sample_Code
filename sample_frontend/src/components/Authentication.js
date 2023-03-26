import { React, useState } from "react";
import axios from "axios";

export default function Authentication(props) {
  // Login = Ture, Register=False
  const [isLoginForm, setisLoginForm] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  function handleLogin(username, password) {
    let baseURL = "http://localhost:8000/authentication/login/";
    axios
      .post(baseURL, {
        username: username,
        password: password,
      })
      .then((response) => {
        if (response.data === "Register") {
          setisLoginForm(false);
        } else if (response.data !== "invalid request format") {
          let user = response.data;
          axios
            .get("http://localhost:8000/authentication/csrf/")
            .then((res) => {
              user["_csrf"] = res.data.csrfToken;
              console.log(user);
              props.setUser(user);
              props.setWindow("notes/");
            });
        }
      });
  }

  function handleRegister(username, password, email, mobile) {
    let baseURL = "http://localhost:8000/authentication/register/";
    axios
      .post(baseURL, {
        username: username,
        password: password,
        mobile: mobile,
        email: email,
      })
      .then((response) => {
        console.log(response.data);
        setisLoginForm(true);
      });
  }

  if (isLoginForm) {
    return (
      <div>
        <input
          placeholder="username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          placeholder="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          onClick={() => {
            handleLogin(username, password);
          }}
        >
          Login
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <input
          placeholder="username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          placeholder="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input
          placeholder="Mobile No."
          onChange={(e) => {
            setMobile(e.target.value);
          }}
        />
        <input
          placeholder="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <button
          onClick={() => {
            handleRegister(username, password, email, mobile);
          }}
        >
          Register
        </button>
      </div>
    );
  }
}
