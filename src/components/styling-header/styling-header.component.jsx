import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Icons
import { faBold } from "@fortawesome/free-solid-svg-icons";
import { faItalic } from "@fortawesome/free-solid-svg-icons";
import { faUnderline } from "@fortawesome/free-solid-svg-icons";
import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import { faAlignRight } from "@fortawesome/free-solid-svg-icons";
import { faAlignCenter } from "@fortawesome/free-solid-svg-icons";
import { faAlignJustify } from "@fortawesome/free-solid-svg-icons";

import "./styling-header.styles.css";

const StylingHeader = ({
  onBoldClick,
  onItalicClick,
  onUnderlineClick,
  undoEditorState,
  redoEditorState,
  saveContents,
  onChangeHandler,
  convertToPdf,
  setTextAlign,
  savedAt,
  styles,
}) => (
  <div className="toolbar">
    <div onClick={convertToPdf}>
      <FontAwesomeIcon icon={faFilePdf} />
    </div>

    <div onClick={saveContents}>
      <FontAwesomeIcon icon={faSave} />
    </div>
    <span style={{ width: "100px", fontSize: "10px", padding: "3px" }}>
      {savedAt}
    </span>
    <input type="file" accept=".json" name="file" onChange={onChangeHandler} />
    <div onMouseDown={undoEditorState}>
      <FontAwesomeIcon icon={faUndo} />
    </div>
    <div onMouseDown={redoEditorState}>
      <FontAwesomeIcon icon={faRedo} />
    </div>
    <div onMouseDown={onBoldClick} data-item="bold">
      <FontAwesomeIcon
        icon={faBold}
        className={styles.isBold ? "active" : ""}
      />
    </div>
    <div onMouseDown={onItalicClick} data-item="italic">
      <FontAwesomeIcon
        icon={faItalic}
        className={styles.isItalic ? "active" : ""}
      />
    </div>
    <div onMouseDown={onUnderlineClick} data-item="underline">
      <FontAwesomeIcon
        icon={faUnderline}
        className={styles.isUnderline ? "active" : ""}
      />
    </div>
    <div onClick={(e) => setTextAlign(e, "left")}>
      <FontAwesomeIcon
        icon={faAlignLeft}
        className={styles.textAlign === "left" ? "active" : ""}
      />
    </div>
    <div onClick={(e) => setTextAlign(e, "center")}>
      <FontAwesomeIcon
        icon={faAlignCenter}
        className={styles.textAlign === "center" ? "active" : ""}
      />
    </div>
    <div onClick={(e) => setTextAlign(e, "right")}>
      <FontAwesomeIcon
        icon={faAlignRight}
        className={styles.textAlign === "right" ? "active" : ""}
      />
    </div>
    <div onClick={(e) => setTextAlign(e, "justify")}>
      <FontAwesomeIcon
        icon={faAlignJustify}
        className={styles.textAlign === "justify" ? "active" : ""}
      />
    </div>
  </div>
);

export default StylingHeader;
