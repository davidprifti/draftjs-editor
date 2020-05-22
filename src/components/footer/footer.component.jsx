import React from "react";
import { countWords } from "../../utils/countWords";

import "./footer.styles.css";
import ContinuousSlider from "../continous-slider/continous-slider.component";
import Loading from "../loading/loading.component";

const Footer = ({ editorState, setEditorZoom, isSavingJSON, isSavingPDF }) => (
  <footer className="footer">
    <div>
      <span className="footer-word-count">{`Word count: ${countWords(
        editorState.getCurrentContent().getPlainText("")
      )}`}</span>
    </div>

    {isSavingJSON || isSavingPDF ? <Loading /> : null}

    <div className="footer-slider">
      <span style={{ fontSize: "10px", marginTop: "7px", marginRight: "10px" }}>
        Page Zoom:
      </span>
      <ContinuousSlider setEditorZoom={setEditorZoom} />
    </div>
  </footer>
);

export default Footer;
