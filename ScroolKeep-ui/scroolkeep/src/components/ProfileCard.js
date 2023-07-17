import { React, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { SERVER_URL } from "../Constants";

export default function Scrool(props) {
  const [followers, setFollowers] = useState([]);
  const [follows, setFollows] = useState([]);
  const [following, setFollowing] = useState(false);
  const [authorInfo, setAuthorInfo] = useState({});
  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState();
  const [bannerPic, setBannerPic] = useState();
  const [profilePicURL, setProfilePicURL] = useState();
  const [bannerPicURL, setBannerPicURL] = useState();
  const [bio, setBio] = useState("");
  const [edit, setEdit] = useState(false);
  

  const authorHandle = window.location.pathname.split("/")[1].substring(1);

  const navigate = useNavigate();

  function follow() {
    let baseURL = SERVER_URL + "/author/addFollow";
    let headers = {
      "X-CSRFToken": sessionStorage.getItem("loginId"),
    };

    setFollowing(!following);
    let tempFollowers = followers;
    if (following) {
      tempFollowers.splice(
        tempFollowers.indexOf(sessionStorage.getItem("userHandle"), 1)
      );
    } else {
      tempFollowers.push(sessionStorage.getItem("userHandle"));
    }

    setFollowers(tempFollowers);

    axios
      .post(
        baseURL,
        {
          author: authorHandle,
          loginId: sessionStorage.getItem("loginId"),
          user: sessionStorage.getItem("userHandle"),
        },
        {
          headers: headers,
        }
      )
      .then((response) => {});
  }

  function updateAuthorInfo() {
    let baseURL = SERVER_URL + "/author/updateAuthorInfo";
    let headers = {
      "X-CSRFToken": sessionStorage.getItem("loginId"),
      "content-type": "multipart/form-data",
    };

    axios
      .post(
        baseURL,
        {
          displayName: displayName,
          bio: bio,
          profilePic: profilePic,
          bannerPic: bannerPic,
          loginId: sessionStorage.getItem("loginId"),
          user: sessionStorage.getItem("userHandle"),
        },
        {
          headers: headers,
        }
      )
      .then((response) => {
        navigate(0);
      });
  }

  function getAuthorInfo() {
    let baseUrl = SERVER_URL + "/author/authorInfo";
    let params = { author: props.authorHandle };
    axios.get(baseUrl, { params: params }).then((response) => {
      setFollowers(response.data.followers);
      setFollows(response.data.follows);
      setAuthorInfo(response.data.authorInfo);
      setDisplayName(response.data.authorInfo.displayName);
      setBio(response.data.authorInfo.bio);
      setBannerPicURL(response.data.authorInfo.bannerPic);
      setProfilePicURL(response.data.authorInfo.profilePic);
      setFollowing(
        response.data.followers.includes(sessionStorage.getItem("userHandle"))
      );
    });
  }

  useEffect(() => {
    getAuthorInfo();
    //setInterval(() => {getFollows()}, 10*1000);
  }, []);

  if (edit) {
    return (
      <div className="edit-profile-card">
        <div className="banner">
          <label>
            <input
              hidden
              type="file"
              onChange={(e) => {
                setBannerPic(e.target.files[0]);
                setBannerPicURL(URL.createObjectURL(e.target.files[0]));
              }}
            />
            <img src={"" + bannerPicURL} alt="banner" />
          </label>
        </div>
        <div className="row-1">
          <div className="profile-pic">
            <label>
              <input
                hidden
                type="file"
                onChange={(e) => {
                  setProfilePic(e.target.files[0]);
                  setProfilePicURL(URL.createObjectURL(e.target.files[0]));
                }}
              />
              <img src={"" + profilePicURL} alt="profile" />
            </label>
          </div>
          <div className="finalize">
            <div></div>
            <button className="update-button" onClick={updateAuthorInfo}>
              <svg viewBox="0 -960 960 960">
                <path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z" />
              </svg>
            </button>
            {/* <button
              className="cancel-button"
              onClick={() => {
                setEdit(false);
              }}
            >
              <svg viewBox="0 -960 960 960">
                <path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
              </svg>
            </button> */}
          </div>
        </div>
        <div className="row-2">
          <input
            autoFocus
            type="text"
            className="name"
            onChange={(e) => {
              setDisplayName(e.target.value);
            }}
            placeholder="display name"
            value={displayName}
          />
        </div>
        <div className="row-3">
          <input
            type="text"
            className="bio"
            onChange={(e) => {
              setBio(e.target.value);
            }}
            placeholder="bio"
            value={bio}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="profile-card">
        {authorInfo.handle && (
          <>
            <div className="banner">
              <img src={"" + authorInfo.bannerPic} alt="banner" />
            </div>
            <div className="row-1">
              <div className="profile-pic">
                <img src={"" + authorInfo.profilePic} alt="profile" />
              </div>
              {sessionStorage.getItem("userHandle") !== authorInfo.handle ? (
                <div
                  onClick={follow}
                  className={following ? "following" : "follow"}
                >
                  {following ? "Following" : "Follow"}
                </div>
              ) : (
                <div
                  onClick={() => {
                    setEdit(true);
                  }}
                  className="edit-profile-card-button"
                >
                  <svg viewBox="0 -960 960 960">
                    <path d="M794-666 666-794l42-42q17-17 42.5-16.5T793-835l43 43q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="row-2">
              <div className="name">{authorInfo.displayName}</div>
              <div className="handle">@{authorInfo.handle}</div>
            </div>
            <div className="row-3">
              <div className="bio">{authorInfo.bio}</div>
            </div>
            <div className="row-4">
              <div className="follows">
                <div className="count">{follows.length}</div> Following
              </div>
              <div className="followers">
                <div className="count">{followers.length}</div> Followers
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}
