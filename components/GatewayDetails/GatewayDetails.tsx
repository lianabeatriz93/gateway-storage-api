import { ArrowBack, Save } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IGatewayModel } from "../../models/models";
import { GatewayService } from "../../services/GatewayService";
import ListPeripherals from "../PeripheralsList/ListPeripherals";
import NotifyComponent from "../Notify/Notify";
import LoaderComponent from "../Loader/Loader";

export interface IGatewayDetailsProps {
  gateway: IGatewayModel | null;
}

const GatewayDetails = (props: IGatewayDetailsProps) => {
  const navigate = useRouter();
  const { gateway } = props;
  const [gatewayState, setGatewayState] = useState<IGatewayModel | null>(null);
  const [messageNotify, setMessageNotify] = useState("");
  const [openNotify, setOpenNotify] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setGatewayState(gateway);
  }, [gateway]);

  const onChangeProp = (
    value: any,
    prop: "serialId" | "name" | "ipAddress" | "peripherals"
  ) => {
    if (!!gatewayState) {
      setGatewayState({ ...gatewayState, [prop]: value });
    }
  };

  const saveGateway = async () => {
    if (!!gatewayState) {
      if (
        gatewayState.serialId &&
        gatewayState.name &&
        gatewayState.ipAddress
      ) {
        setLoading(true);
        const result = await GatewayService.postGateway(gatewayState);
        if (result.data.success) {
          navigate.push("/");
        } else {
          showNotification(result.data.message);
        }
        setLoading(false);
      }
    }
  };

  const showNotification = (err: string) => {
    setMessageNotify(err);
    setOpenNotify(true);
  };

  const getFieldComponents = () => {
    const readOnly = !!gatewayState?._id;
    return readOnly ? (
      <Typography variant="h6" sx={{ paddingBottom: 1 }}>
        {`[${gatewayState.serialId}] ${gatewayState.name}  IP: ${gatewayState.ipAddress}`}
      </Typography>
    ) : (
      <Grid container>
        <Grid item xs={12} md={4} paddingX={1}>
          <TextField
            label="Serial Id"
            value={gatewayState?.serialId}
            fullWidth
            InputProps={{
              readOnly: readOnly,
            }}
            required
            error={!gatewayState?.serialId}
            onChange={(value) => onChangeProp(value.target.value, "serialId")}
          />
        </Grid>
        <Grid item xs={12} md={4} paddingX={1}>
          <TextField
            label="Name"
            value={gatewayState?.name}
            fullWidth
            InputProps={{
              readOnly: readOnly,
            }}
            required
            error={!gatewayState?.name}
            onChange={(value) => onChangeProp(value.target.value, "name")}
          />
        </Grid>
        <Grid item xs={12} md={4} paddingX={1}>
          <TextField
            label="Ip Address"
            value={gatewayState?.ipAddress}
            fullWidth
            InputProps={{
              readOnly: readOnly,
            }}
            required
            error={!gatewayState?.ipAddress}
            onChange={(value) => onChangeProp(value.target.value, "ipAddress")}
          />
        </Grid>
      </Grid>
    );
  };

  const render = () => {
    return !!gatewayState ? (
      <Grid sx={{ height: "100%" }}>
        <Card
          variant="outlined"
          sx={{ height: "100%", borderColor: "transparent" }}
        >
          <CardHeader
            title={
              gatewayState._id
                ? "Edit peripheral of gateway:"
                : "Create gateway"
            }
            action={
              <Grid>
                <Tooltip title="Go back">
                  <IconButton onClick={() => navigate.push("/")}>
                    <ArrowBack color="primary" />
                  </IconButton>
                </Tooltip>
                {!gatewayState._id ? (
                  <Tooltip title="Save gateway">
                    <IconButton onClick={saveGateway}>
                      <Save color="primary" />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </Grid>
            }
          />
          <CardContent>
            {getFieldComponents()}
            <Grid item padding={1} xs={12} sx={{ width: "100%" }}>
              <ListPeripherals
                gatewayId={gatewayState._id || ""}
                peripherals={gatewayState.peripherals || []}
                onChange={onChangeProp}
              />
            </Grid>
          </CardContent>
        </Card>
        <NotifyComponent
          message={messageNotify}
          open={openNotify}
          type="error"
          onClose={() => setOpenNotify(false)}
        />
        <LoaderComponent loading={loading} />
      </Grid>
    ) : (
      <></>
    );
  };

  return render();
};

export default GatewayDetails;
