import { React, useState, useEffect } from "react";
import axios from "axios";
import Scrool from "./Scrool";
import ScroolWriter from "./ScroolWriter";
import { useNavigate } from "react-router-dom";

import { SERVER_URL } from "../Constants";
import Loading from "./Loading";

export default function Home(props) {
  const [scrools, setScrools] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  function getScrools() {
    let baseURL = SERVER_URL + "/scrool/home/";
    let headers = {
      "X-CSRFToken": sessionStorage.getItem("loginId"),
    };
    axios
      .post(
        baseURL,
        {
          user: sessionStorage.getItem("userHandle"),
          loginId: sessionStorage.getItem("loginId"),
        },
        { headers: headers }
      )
      .then((response) => {
        if (response.data.status === "success") {
          setScrools(response.data.documents);
          setLoading(false);
        }
      });
  }

  function openSearch() {
    navigate("../explore/search");
  }

  useEffect(() => {
    getScrools();
  }, []);

  return (
    <>
      {loading && <Loading />}
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
        return (
          <Scrool
            scroolList={scrools}
            setScroolList={setScrools}
            scrool={scrool}
            key={scrool.id}
          />
        );
      })}
    </>
  );
}
