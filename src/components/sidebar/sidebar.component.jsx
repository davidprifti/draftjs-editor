import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sidebarButtons } from "./sidebar-buttons";
import { addEmptyBlock } from "../../utils/add-block";

const useStyles = makeStyles({
  list: {
    width: 350,
  },
  fullList: {
    width: "auto",
  },
});

export default function SwipeableTemporaryDrawer({
  editorState,
  setEditorState,
}) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (side, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  const sideList = (side) => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List>
        {sidebarButtons.map((button, index) => (
          <ListItem
            button
            key={index}
            style={{ borderBottom: "1px solid #f0f0f0" }}
            onMouseDown={() =>
              setEditorState(
                addEmptyBlock(
                  button.type,
                  button.text,
                  editorState,
                  button.styles
                )
              )
            }
          >
            <div style={{ width: "100px" }}>
              <p style={{ fontSize: "10px" }}>{button.type} </p>
            </div>
            <button.tag style={{ display: "block" }}>
              {button.displayText}
            </button.tag>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <div
        onClick={toggleDrawer("right", true)}
        style={{
          position: "fixed",
          top: "11px",
          right: "20px",
          zIndex: "1001",
          cursor: "pointer",
        }}
        className="toolbar"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>
      <SwipeableDrawer
        anchor="right"
        open={state.right}
        onClose={toggleDrawer("right", false)}
        onOpen={toggleDrawer("right", true)}
      >
        {sideList("right")}
      </SwipeableDrawer>
    </div>
  );
}
