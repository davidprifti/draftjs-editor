import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles({
  root: {
    width: 200,
  },
});

export default function ContinuousSlider({ setEditorZoom }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setEditorZoom(newValue);
  };

  return (
    <div className={classes.root}>
      <Slider
        min={0.4}
        max={2}
        step={0.1}
        value={value}
        defaultValue={1}
        onChange={handleChange}
        aria-labelledby="continuous-slider"
        style={{
          color: "rgb(84, 110, 230)",
          marginBottom: 0,
          paddingBottom: 0,
        }}
        valueLabelDisplay="auto"
      />
    </div>
  );
}
