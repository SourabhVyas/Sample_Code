import { React, useState } from "react";
import axios from "axios";

export default function Search() {
  const [keywords, setKeywords] = useState();

  function typing(e) {
    console.log(e.target.value);
    setKeywords(e.target.value);
    search();
  }

  function search() {
    let url = "http://localhost:8000/search/";
    axios.post(url, { keywords: keywords }).then((response) => {
      console.log(response.data);
    });
  }

  return (
    <>
      <input onChange={typing} type="text" />
      <button onClick={search}>Search</button>
    </>
  );
}
