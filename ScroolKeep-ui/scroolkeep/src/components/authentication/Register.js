import { React, useEffect, useState } from "react";
import axios from "axios";

import { SERVER_URL } from "../../Constants";

export default function Register(props) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userHandle, setUserHandle] = useState("");
  const [live, setLiveButton] = useState(false);

  const [screenWidth, getDimension] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => {
      getDimension(window.innerWidth);
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, [screenWidth]);

  const [step, setStep] = useState(1);

  function checkForm() {
    setLiveButton(false);
    if (step === 1) {
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const validateEmail = String(email).toLowerCase().match(emailRegex);
      if (password.length > 6 && validateEmail) {
        setLiveButton(true);
      } else {
        setLiveButton(false);
      }
    } else if (step === 2) {
      if (displayName.length < 5) {
        setLiveButton(false);
      } else {
        setLiveButton(true);
      }
    } else if (step === 3) {
      if (userHandle.length < 5) {
        setLiveButton(false);
      } else {
        setLiveButton(true);
      }
    }
  }

  function handleRegister() {
    let baseURL = SERVER_URL + "/auth/register/";
    axios
      .post(baseURL, {
        email: email,
        password: password,
        handle: userHandle,
        displayName: displayName,
      })
      .then((response) => {
        props.setisLoginForm(true);
        props.login();
      });
  }

  useEffect(() => {
    checkForm();
  });

  return (
    <div className="register">
      {step === 1 && (
        <>
          <input
            type="email"
            className="email-input"
            placeholder="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="text"
            className="password-input"
            value={password}
            placeholder="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <div
            className={live ? "next-button live" : "next-button"}
            onClick={() => {
              if (live) {
                setStep(step + 1);
              }
            }}
          >
            <p>Next</p>
            <svg viewBox="0 -960 960 960">
              <path d="m304-82-56-57 343-343-343-343 56-57 400 400L304-82Z" />
            </svg>
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <input
            type="text"
            value={displayName}
            className="display-name-input"
            placeholder="display name"
            onChange={(e) => {
              setDisplayName(e.target.value);
            }}
          />
          <div></div>
          <div>
            <div
              className="previous-button live"
              onClick={() => {
                setStep(step - 1);
              }}
            >
              <svg viewBox="0 -960 960 960">
                <path d="M655-80 255-480l400-400 56 57-343 343 343 343-56 57Z" />
              </svg>
              <p>previous</p>
            </div>
            <div
              className={live ? "next-button live" : "next-button"}
              onClick={() => {
                if (live) {
                  setStep(step + 1);
                }
              }}
            >
              <p>Next</p>
              <svg viewBox="0 -960 960 960">
                <path d="m304-82-56-57 343-343-343-343 56-57 400 400L304-82Z" />
              </svg>
            </div>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <input
            type="text"
            value={userHandle}
            className="handle-input"
            placeholder="user handle"
            onChange={(e) => {
              setUserHandle(e.target.value);
            }}
          />
          <div>
            {live && screenWidth<600 && (
              <button
                className="register-button"
                onClick={() => {
                  handleRegister(email, password);
                }}
              >
                Register
              </button>
            )}
          </div>
          <div>
            <div
              className="previous-button live"
              onClick={() => {
                setStep(step - 1);
              }}
            >
              <svg viewBox="0 -960 960 960">
                <path d="M655-80 255-480l400-400 56 57-343 343 343 343-56 57Z" />
              </svg>
              <p>previous</p>
            </div>
            {live && screenWidth>600 && (
              <button
                className="register-button"
                onClick={() => {
                  handleRegister(email, password);
                }}
              >
                Register
              </button>
            )}
          </div>
        </>
      )}
      <div
        className="signin-button"
        onClick={() => {
          props.setisLoginForm(true);
        }}
      >
        Already have an account
      </div>
    </div>
  );
}
