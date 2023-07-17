import { React, useState, useEffect } from "react";
import axios from "axios";

import Scrool from "./Scrool";
import ProfileCard from "./ProfileCard";
import { SERVER_URL } from "../Constants";
import ScroolWriter from "./ScroolWriter";
import Loading from "./Loading";

export default function ProfileScroolList(props) {
  const [scrools, setScrools] = useState([]);
  const [loading, setLoading] = useState(true);

  function getScrools() {
    let baseURL =
      SERVER_URL +
      "/scrool/" +
      window.location.pathname.split("/")[1].slice(1) +
      "/profile";

    axios.get(baseURL).then((response) => {
      if (response.data.documents) {
        setScrools(response.data.documents);
        setLoading(false);
      }
    });
  }

  useEffect(() => {
    getScrools();
  }, []);

  return (
    <>
      {loading && <Loading />}
      <ProfileCard
        authorHandle={window.location.pathname.split("/")[1].slice(1)}
      />
      {props.writer && (
        <>
          <ScroolWriter
            close={props.setWriter}
            scroolList={scrools}
            setScroolList={setScrools}
          />
        </>
      )}
      {scrools.map((scrool) => {
        return <Scrool scrool={scrool} key={scrool.id} />;
      })}
    </>
  );
}
