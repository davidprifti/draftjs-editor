import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";

import "./add-media.styles.css";

const AddMedia = ({ type, editorState, addMedia, setEditorState }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [input, setInput] = useState("");

  return (
    <div className="toolbar">
      <div onMouseDown={() => setShowDropdown(!showDropdown)}>
        <FontAwesomeIcon icon={type === "image" ? faImage : faVideo} />
      </div>

      {showDropdown ? (
        <div className="add-image-option">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder="Add a link"
          />
          <button
            onClick={() => {
              type === "image"
                ? setEditorState(addMedia(editorState, input))
                : setEditorState(addMedia(editorState, { src: input }));
              setInput("");
              setShowDropdown(false);
            }}
          >
            Add
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default AddMedia;
