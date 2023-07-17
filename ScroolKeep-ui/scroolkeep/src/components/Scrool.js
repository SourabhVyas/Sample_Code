import { React, useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import ScroolWriter from "./ScroolWriter";
import { SERVER_URL, CLIENT_URL } from "../Constants";
import Loading from "./Loading";

export default function Scrool(props) {
  const [writer, setWriter] = useState(false);
  const [likes, setLikes] = useState(0);
  const [replies, setReplies] = useState(0);
  const [menu, setMenu] = useState(false);
  const [likeStatus, setLikeStatus] = useState(false);
  const [scroolId, setScroolId] = useState();
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();
  const timerRef = useRef(null);

  const handle = sessionStorage.getItem("userHandle");

  function switchWriter() {
    setWriter(!writer);
  }

  function deleteScrool() {
    let baseURL = SERVER_URL + "/scrool/deleteScrool/";
    let headers = {
      "X-CSRFToken": sessionStorage.getItem("loginId"),
    };
    axios
      .post(
        baseURL,
        {
          scroolId: scroolId,
          author: handle,
          loginId: sessionStorage.getItem("loginId"),
        },
        {
          headers: headers,
        }
      )
      .then((response) => {
        navigate("../home");
      });
  }

  function likeScrool() {
    if (sessionStorage.getItem("loginId")) {
      if (likeStatus) {
        setLikes(likes - 1);
      } else {
        setLikes(likes + 1);
      }
      setLikeStatus(!likeStatus);
      let baseURL = SERVER_URL + "/scrool/likeScrool/";
      let headers = {
        "X-CSRFToken": sessionStorage.getItem("loginId"),
      };
      axios
        .post(
          baseURL,
          {
            scroolId: scroolId,
            user: sessionStorage.getItem("userHandle"),
            loginId: sessionStorage.getItem("loginId"),
          },
          {
            headers: headers,
          }
        )
        .then((response) => {});
    } else {
    }
  }

  function getImpressionStat() {
    if (scroolId) {
      let baseUrl = SERVER_URL + "/scrool/impressionStat";
      let params = {
        user: sessionStorage.getItem("userHandle"),
        loginId: sessionStorage.getItem("loginId"),
        scroolId: scroolId,
      };
      axios.get(baseUrl, { params: params }).then((response) => {
        setLikes(response.data.numLikes);
        setReplies(response.data.numReplies);
        setLikeStatus(response.data.likeStatus);
      });
    }
  }

  function convertTime(time) {
    time = time.match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? "am" : "pm";
      time[0] = +time[0] % 12 || 12;
    }
    time = time.join("");
    time =
      time.substring(0, time.length - 6) +
      " " +
      time.substring(time.length - 2, time.length);
    return time;
  }

  function getDate(timestamp) {
    let date = new Date(timestamp * 1000);
    let time = convertTime(date.toLocaleTimeString());
    date = date.toDateString().substring(3);
    date =
      date.substring(0, date.length - 5) +
      ", " +
      date.substring(date.length - 4, date.length);
    return time + " • " + date; //Alt 0149
  }

  function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + "y";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + "m";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + "d";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + "h";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + "min";
    }
    return Math.floor(seconds) + "sec";
  }

  function openScroolList() {
    navigate("../../@" + props.scrool.author + "/scrools/" + props.scrool.id);
    navigate(0);
  }

  function openProfile() {
    navigate("../../@" + props.scrool.author + "/scrools/");
    navigate(0);
  }

  function share() {
    let url = CLIENT_URL + "/@" + props.scrool.author + "/scrools/" + scroolId;
    navigator.clipboard.writeText(url);
    setCopied(true);
    timerRef.current = setTimeout(() => setCopied(false), 5000);
  }

  useEffect(() => {
    setScroolId(props.scrool.id);
  }, [props.scrool]);

  useEffect(() => {
    getImpressionStat();
  }, [scroolId]);

  useEffect(() => {
    getImpressionStat();
  }, [writer]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  if (props.scrool) {
    const creationDateTime = new Date(props.scrool.createdAt * 1000);
    const creationDate = getDate(props.scrool.createdAt);
    const timeAgo = timeSince(creationDateTime);

    if (props.main) {
      return (
        <div className="main-scrool">
          <div className="scrool-header">
            <div className="scrool-author-pic">
              <img src={props.scrool.authorProfilePic} alt="avatar" />
            </div>
            <div className="author">
              <div onClick={openProfile} className="scrool-display-name">
                {props.scrool.authorDisplayName}
              </div>
              <div onClick={openProfile} className="scrool-author-handle">
                @{props.scrool.author}
              </div>
            </div>

            {handle === props.scrool.author && (
              <div className="menu-container">
                <div>
                  {menu && (
                    <ul className="menu">
                      <li className="scrool-delete" onClick={deleteScrool}>
                        <svg viewBox="0 -960 960 960">
                          <path d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z" />
                        </svg>
                        Delete
                      </li>
                    </ul>
                  )}
                </div>
                <div
                  className="menu-toggle"
                  onClick={() => {
                    setMenu(!menu);
                  }}
                >
                  <svg viewBox="0 -960 960 960">
                    <path d="M207.858-432Q188-432 174-446.142q-14-14.141-14-34Q160-500 174.142-514q14.141-14 34-14Q228-528 242-513.858q14 14.141 14 34Q256-460 241.858-446q-14.141 14-34 14Zm272 0Q460-432 446-446.142q-14-14.141-14-34Q432-500 446.142-514q14.141-14 34-14Q500-528 514-513.858q14 14.141 14 34Q528-460 513.858-446q-14.141 14-34 14Zm272 0Q732-432 718-446.142q-14-14.141-14-34Q704-500 718.142-514q14.141-14 34-14Q772-528 786-513.858q14 14.141 14 34Q800-460 785.858-446q-14.141 14-34 14Z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          <div className="scrool-body">
            <p className="scrool-content">{props.scrool.content}</p>
            {props.scrool.attachment_type === "image/png" && (
              <img
                className="scrool-media"
                src={props.scrool.attachment_url}
                alt="image_name"
              />
            )}
            {props.scrool.attachment_type === "video/mp4" && (
              <video
                className="scrool-media"
                style={{ maxWidth: "500px" }}
                src={props.scrool.attachment_url}
                controls
              />
            )}
          </div>

          <div className="scrool-footer">
            <div className="scrool-footer-row-1">
              <time
                dateTime={creationDateTime}
                className="scrool-light-font scrool-datetime"
              >
                {creationDate}
              </time>
            </div>
            <div className="scrool-footer-row-n">
              <div className="scrool-reply-stat">
                {replies + " "}
                <p className="scrool-light-font">Replies</p>
              </div>
              <div className="scrool-like-stat">
                {likes + " "}
                <p className="scrool-light-font">Likes</p>
              </div>
            </div>
            <div className="scrool-footer-row-n">
              <div className="scrool-reply-icon" onClick={switchWriter}>
                <svg viewBox="0 -960 960 960">
                  <path d="M140-240q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h680q24 0 42 18t18 42v740L720-240H140Z" />
                </svg>
              </div>
              <div className="scrool-like-icon" onClick={likeScrool}>
                <svg
                  className={likeStatus === true ? "liked" : null}
                  viewBox="0 -960 960 960"
                >
                  <path d="m480-121-41-37q-106-97-175-167.5t-110-126Q113-507 96.5-552T80-643q0-90 60.5-150.5T290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.5T880-643q0 46-16.5 91T806-451.5q-41 55.5-110 126T521-158l-41 37Z" />
                </svg>
              </div>
              {copied ? (
                <div className="share-message">Link Copied</div>
              ) : (
                <div className="scrool-share-icon" onClick={share}>
                  <svg viewBox="0 -960 960 960">
                    <path d="M727-80q-47.5 0-80.75-33.346Q613-146.693 613-194.331q0-6.669 1.5-16.312T619-228L316-404q-15 17-37 27.5T234-366q-47.5 0-80.75-33.25T120-480q0-47.5 33.25-80.75T234-594q23 0 44 9t38 26l303-174q-3-7.071-4.5-15.911Q613-757.75 613-766q0-47.5 33.25-80.75T727-880q47.5 0 80.75 33.25T841-766q0 47.5-33.25 80.75T727-652q-23.354 0-44.677-7.5T646-684L343-516q2 8 3.5 18.5t1.5 17.741q0 7.242-1.5 15Q345-457 343-449l303 172q15-14 35-22.5t46-8.5q47.5 0 80.75 33.25T841-194q0 47.5-33.25 80.75T727-80Z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {writer && (
            <>
              <ScroolWriter
                close={setWriter}
                scroolList={props.scroolList}
                setScroolList={props.setScroolList}
                replyTo={props.scrool.id}
              />
            </>
          )}
        </div>
      );
    } else {
      return (
        <>
          <div className="scrool-container">
            <div></div>
            <div onClick={openProfile} className="scrool-author-pic">
              <img src={props.scrool.authorProfilePic} alt="avatar" />
            </div>
            <div>
              <div className="scrool-header">
                <div className="author">
                  <div onClick={openProfile} className="scrool-display-name">
                    {props.scrool.authorDisplayName}
                  </div>
                  <div onClick={openProfile} className="scrool-author-handle">
                    @{props.scrool.author}
                  </div>
                  <div className="scrool-time-ago">•</div>
                  <time dateTime={creationDateTime} className="scrool-time-ago">
                    {timeAgo}
                  </time>
                </div>
                {handle === props.scrool.author && (
                  <div className="menu-container">
                    <div>
                      {menu && (
                        <ul className="menu">
                          <li className="scrool-delete">
                            <div onClick={deleteScrool()}>
                              <svg viewBox="0 -960 960 960">
                                <path d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z" />
                              </svg>
                              Delete
                            </div>
                          </li>
                        </ul>
                      )}
                    </div>
                    {/* <div
                      className="menu-toggle"
                      onClick={() => {
                        setMenu(!menu);
                      }}
                    >
                      <svg viewBox="0 -960 960 960">
                        <path d="M207.858-432Q188-432 174-446.142q-14-14.141-14-34Q160-500 174.142-514q14.141-14 34-14Q228-528 242-513.858q14 14.141 14 34Q256-460 241.858-446q-14.141 14-34 14Zm272 0Q460-432 446-446.142q-14-14.141-14-34Q432-500 446.142-514q14.141-14 34-14Q500-528 514-513.858q14 14.141 14 34Q528-460 513.858-446q-14.141 14-34 14Zm272 0Q732-432 718-446.142q-14-14.141-14-34Q704-500 718.142-514q14.141-14 34-14Q772-528 786-513.858q14 14.141 14 34Q800-460 785.858-446q-14.141 14-34 14Z" />
                      </svg>
                    </div> */}
                  </div>
                )}
              </div>
              <div className="scrool-body" onClick={openScroolList}>
                <p className="scrool-content">{props.scrool.content}</p>
                {props.scrool.attachment_type === "image/png" && (
                  <img
                    className="scrool-media"
                    src={props.scrool.attachment_url}
                    alt="image_name"
                  />
                )}
                {props.scrool.attachment_type === "video/mp4" && (
                  <video
                    className="scrool-media"
                    style={{ maxWidth: "500px" }}
                    src={props.scrool.attachment_url}
                    controls
                  />
                )}
              </div>

              <div className="scrool-footer">
                <div className="scrool-footer-row-n">
                  <div className="scrool-reply">
                    <div className="scrool-reply-icon" onClick={switchWriter}>
                      <svg viewBox="0 -960 960 960">
                        <path d="M140-240q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h680q24 0 42 18t18 42v740L720-240H140Z" />
                      </svg>
                    </div>
                    <div className="scrool-reply-stat">{replies + " "}</div>
                  </div>
                  <div className="scrool-like">
                    <div className="scrool-like-icon" onClick={likeScrool}>
                      <svg
                        className={likeStatus === true ? "liked" : null}
                        viewBox="0 -960 960 960"
                      >
                        <path d="m480-121-41-37q-106-97-175-167.5t-110-126Q113-507 96.5-552T80-643q0-90 60.5-150.5T290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.5T880-643q0 46-16.5 91T806-451.5q-41 55.5-110 126T521-158l-41 37Z" />
                      </svg>
                    </div>

                    <div className="scrool-like-stat">{likes + " "}</div>
                  </div>
                  <div className="scrool-share">
                    {copied ? (
                      <div className="share-message">Link Copied</div>
                    ) : (
                      <div className="scrool-share-icon" onClick={share}>
                        <svg viewBox="0 -960 960 960">
                          <path d="M727-80q-47.5 0-80.75-33.346Q613-146.693 613-194.331q0-6.669 1.5-16.312T619-228L316-404q-15 17-37 27.5T234-366q-47.5 0-80.75-33.25T120-480q0-47.5 33.25-80.75T234-594q23 0 44 9t38 26l303-174q-3-7.071-4.5-15.911Q613-757.75 613-766q0-47.5 33.25-80.75T727-880q47.5 0 80.75 33.25T841-766q0 47.5-33.25 80.75T727-652q-23.354 0-44.677-7.5T646-684L343-516q2 8 3.5 18.5t1.5 17.741q0 7.242-1.5 15Q345-457 343-449l303 172q15-14 35-22.5t46-8.5q47.5 0 80.75 33.25T841-194q0 47.5-33.25 80.75T727-80Z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {writer && (
            <>
              <ScroolWriter
                close={setWriter}
                scroolList={props.scroolList}
                setScroolList={props.setScroolList}
                replyTo={props.scrool.id}
              />
            </>
          )}
        </>
      );
    }
  } else {
    return (<Loading />)
  }
}
