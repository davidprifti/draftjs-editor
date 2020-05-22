import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./dropdown-media.styles.css";

const DropdownMedia = ({
  editorState,
  setEditorState,
  styles,
  otherStyles,
  setLabel,
  options,
  currentOption,
  styleOption,
  icon,
  style,
}) => {
  const [isShowingDropdownMenu, setisShowingDropdownMenu] = useState(false);

  const setOption = (e, value) => {
    e.preventDefault();
    const newEditorState = styles[styleOption].remove(editorState);
    setEditorState(styles[styleOption].add(newEditorState, value));
    setisShowingDropdownMenu(false);
  };

  const menuOptions = options.map((option) => (
    <div
      style={styleOption === "fontFamily" ? { fontFamily: option } : {}}
      key={`font-${option}`}
      className="dropdown-option"
      onMouseDown={(e) => {
        setOption(e, `${styleOption === "fontSize" ? `${option}px` : option}`);
        setLabel(option);
      }}
    >
      {option}
    </div>
  ));

  return (
    <div>
      <div className="menu-dropdown">
        <FontAwesomeIcon icon={icon} />
        <select
          onMouseDown={(e) => {
            e.preventDefault();
            setisShowingDropdownMenu(!isShowingDropdownMenu);
          }}
        >
          <option>{currentOption}</option>
        </select>
        {isShowingDropdownMenu ? (
          <div className="dropdown-menu" style={{ ...style }}>
            {menuOptions}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DropdownMedia;
