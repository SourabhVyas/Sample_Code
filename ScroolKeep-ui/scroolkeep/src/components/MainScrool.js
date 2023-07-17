import { React, useState, useEffect } from "react";
import axios from "axios";

import Scrool from "./Scrool";
import { SERVER_URL } from "../Constants";
import Loading from "./Loading";

export default function MainScrool(props) {
  const [scrool, setScrool] = useState({});
  const [replies, setReplies] = useState([]);

  function getScrools() {
    let baseURL = SERVER_URL + "/scrool" + window.location.pathname;

    axios.get(baseURL).then((response) => {
      if (response.data.scrool) {
        setScrool(response.data.scrool);
        setReplies(response.data.replies);
      }
    });
  }

  useEffect(() => {
    getScrools();
  }, []);

  return (
    <>
      {scrool.id ? (
        <Scrool
          scroolList={replies}
          setScroolList={setReplies}
          scrool={scrool}
          main={true}
        />
      ) : (
        <Loading />
      )}
      {replies.map((reply) => {
        return <Scrool scrool={reply} key={reply.id} />;
      })}
    </>
  );
}
