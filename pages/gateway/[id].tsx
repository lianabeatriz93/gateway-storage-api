import type { NextPage } from "next";
import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GatewayService } from "../../services/GatewayService";
import { IGatewayModel } from "../../models/models";
import GatewayDetails from "../../components/GatewayDetails/GatewayDetails";
import ScrollButton from "../../components/ScrollButton/ScrollButton";

const HomePage: NextPage = (props: any) => {
  const router = useRouter();
  const { id } = router.query;
  const [gateway, setGateway] = useState<IGatewayModel | null>(null);
  useEffect(() => {
    const loadData = async () => {
      if (id !== "new") {
        const result = await GatewayService.getGatewayDetail({
          _id: id as string,
        });
        if (result.data.success) {
          setGateway(result.data.result);
        }
      } else {
        setGateway({
          ipAddress: "",
          name: "",
          peripherals: [],
          serialId: "",
        });
      }
    };
    loadData();
  }, [id]);
  return (
    <Grid
      sx={{
        backgroundColor: "white",
        overflowY: "auto",
      }}
    >
      <GatewayDetails gateway={gateway} />
      <ScrollButton />
    </Grid>
  );
};

export default HomePage;
