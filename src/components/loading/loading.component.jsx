import React from "react";

import "./loading.styles.css";

const Loading = () => (
  <div style={{ marginLeft: "40%" }}>
    <div className="lds-dual-ring" style={{ zoom: 0.18 }}></div>
    <span className="pulse">Saving...</span>
  </div>
);

export default Loading;
