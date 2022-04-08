import { KeyboardArrowUpTwoTone } from "@mui/icons-material";
import { Grow, IconButton } from "@mui/material";
import React from "react";
import { useOnTopScreen } from "../utils";

const ScrollButton = () => {
  const onTop = useOnTopScreen(100);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Grow in={onTop === false}>
      <IconButton
        sx={{
          position: "fixed",
          zIndex: 999,
          left: "50px",
          bottom: "50px",
          width: "40px",
          height: "40px",
          color: "white",
          backgroundColor: "rgba(0,0,0,0.4)",
          ":hover": {
            backgroundColor: "rgba(0,0,0,0.7)",
          },
        }}
        onClick={scrollToTop}
      >
        <KeyboardArrowUpTwoTone fontSize="medium" />
      </IconButton>
    </Grow>
  );
};

export default ScrollButton;
