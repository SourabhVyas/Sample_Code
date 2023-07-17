import { React, useState } from "react";
import axios from "axios";

import {SERVER_URL} from "../Constants";


export default function Search(props) {
  const [keywords, setKeywords] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  function suggest(keywords) {
    let baseUrl = SERVER_URL + "/explore/suggest";
    let params = { keywords: keywords };
    axios.get(baseUrl, { params: params }).then((response) => {
      setSuggestions(response.data);
    });
  }

  function typing(e) {
    setKeywords(e.target.value);
    if (e.target.value) {
      suggest(e.target.value);
    } else {
      setSuggestions([]);
    }
  }

  function search() {
    let baseUrl = SERVER_URL + "/explore/search";
    let params = { keywords: keywords };
    if (keywords.length > 0) {
      axios.get(baseUrl, { params: params }).then((response) => {});
    }
  }

  return (
    <div className="search-component">
      <div className="search-input">
        <input
          placeholder="Search ..."
          type="text"
          onChange={(e) => {
            typing(e);
          }}
        />
      </div>

      <div className="search-button" onClick={search}>
        <svg viewBox="0 -960 960 960">
          <path d="M796-121 533-384q-30 26-69.959 40.5T378-329q-108.162 0-183.081-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l264 262-44 44ZM377-389q81.25 0 138.125-57.5T572-585q0-81-56.875-138.5T377-781q-82.083 0-139.542 57.5Q180-666 180-585t57.458 138.5Q294.917-389 377-389Z" />
        </svg>
      </div>
      {suggestions.length > 0 && (
        <ul className="search-suggestions">
          {suggestions.map((suggestion) => {
            return (
              <li key={suggestion.handle}>
                <a href={ "../../@" + suggestion.handle} >
                  {suggestion.displayName}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
