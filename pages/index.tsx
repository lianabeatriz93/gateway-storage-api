import type { NextPage } from "next";
import { Grid } from "@mui/material";
import React from "react";
import ListGateways from "../components/GatewaysList/ListGateways";
import ScrollButton from "../components/ScrollButton/ScrollButton";

const HomePage: NextPage = (props: any) => {
  return (
    <Grid
      sx={{
        backgroundColor: "white",
        overflowY: "auto",
      }}
    >
      <ListGateways />
      <ScrollButton />
    </Grid>
  );
};

export default HomePage;
