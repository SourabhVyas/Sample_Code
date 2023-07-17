import { React, useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { SERVER_URL } from "../Constants";

import Loading from "./Loading";

export default function ScroolWriter(props) {
  const [textContent, setTextContent] = useState("");
  const [attachment, setAttachment] = useState({ type: "none" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ref = useRef(null);

  function typing(e) {
    setTextContent(e.target.value);
  }

  function createScrool() {
    setLoading(true);
    let baseURL = SERVER_URL + "/scrool/createScrool/";
    let headers = {
      "X-CSRFToken": sessionStorage.getItem("loginId"),
      "content-type": "multipart/form-data",
    };
    let data_packet;
    if (attachment) {
      data_packet = {
        author: sessionStorage.getItem("userHandle"),
        loginId: sessionStorage.getItem("loginId"),
        textContent: textContent,
        replyTo: props.replyTo,
        attachment: attachment,
        attachment_name: attachment.name,
      };
    } else {
      data_packet = {
        author: sessionStorage.getItem("userHandle"),
        loginId: sessionStorage.getItem("loginId"),
        textContent: textContent,
        replyTo: props.replyTo,
      };
    }

    axios
      .post(baseURL, data_packet, {
        headers: headers,
      })
      .then((response) => {
        if (props.scroolList) {
          let scrool = response.data;
          let scroolList = props.scroolList.slice();
          scroolList.unshift(scrool);
          props.setScroolList(scroolList);
          props.close(false);
        } else {
          props.close(false);
        }
      });
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
    document.addEventListener("mousedown", (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        props.close(false);
      }
    });
  }, []);

  return (
    <div ref={ref} className="scroolwriter">
      <div className="display-image">
        <img src={sessionStorage.getItem("profilePic")} alt="avatar" />
      </div>
      <div
        className="scrool-edit"
        onClick={() => {
          document.getElementsByClassName("scrool-textarea")[0].focus();
        }}
      >
        <textarea
          autoFocus
          className="scrool-textarea"
          placeholder="What's on your mind ..."
          onChange={(e) => {
            typing(e);
          }}
        />
        {attachment && attachment.type.match("image/*") && (
          <img
            className="scrool-media"
            src={URL.createObjectURL(attachment)}
            alt="image_name"
          />
        )}
        {attachment && attachment.type.match("video/*") && (
          <video
            className="scrool-media"
            src={URL.createObjectURL(attachment)}
            controls
          />
        )}
      </div>
      <div className="scroolwriter-footer"></div>
      <div className="scroolwriter-footer">
        {attachment.type !== "none" ? (
          <div className="remove-file" title="Remove Attachment">
            <svg
              onClick={() => {
                setAttachment({ type: "none" });
              }}
              viewBox="0 -960 960 960"
            >
              <path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
            </svg>
          </div>
        ) : (
          <>
            <label className="add-file">
              <input
                type="file"
                hidden
                onChange={(e) => {
                  setAttachment(e.target.files[0]);
                }}
              />
              <svg viewBox="0 -960 960 960">
                <path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm56-97h489L578-473 446-302l-93-127-117 152Zm-56 97v-600 600Z" />
              </svg>
            </label>
          </>
        )}

        <div className="finalize-changes">
          {loading ? (
            <>
              <Loading />
            </>
          ) : (
            <>
              <div
                onClick={() => {
                  props.close(false);
                }}
                className="close-scroolwriter"
              >
                cancel
              </div>
              <div className="create-scrool-button" onClick={createScrool}>
                {props.replyTo ? "Reply" : "Post"}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
