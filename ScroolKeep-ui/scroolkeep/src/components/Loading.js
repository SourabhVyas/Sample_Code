import React from "react";
import "../styles/utils/loading.sass";

export default function Loading() {
  return (
    <div className="loading">
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
