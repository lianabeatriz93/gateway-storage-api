import { Button, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { IGatewayModel } from "../../models/models";
import DialogComponent from "../Dialog/Dialog";

export interface IGatewayDialogProps {
  onSave: (value: IGatewayModel) => unknown;
  open: boolean;
  onClose: () => unknown;
  gateway: IGatewayModel | null;
}

const GatewayDialog = (props: IGatewayDialogProps) => {
  const { gateway, open, onClose, onSave } = props;

  const [gatewayEdit, setGatewayEdit] = useState<IGatewayModel>({
    ipAddress: "",
    name: "",
    peripherals: [],
    serialId: "",
  } as IGatewayModel);

  useEffect(() => {
    if (gateway) setGatewayEdit({ ...gateway });
    else
      setGatewayEdit({
        ipAddress: "",
        name: "",
        peripherals: [],
        serialId: "",
      } as IGatewayModel);
  }, [gateway]);

  const onChangeProp = (
    value: any,
    prop: "ipAddress" | "name" | "peripherals" | "serialId"
  ) => {
    setGatewayEdit({ ...gatewayEdit, [prop]: value });
  };

  const onSaveClick = () => {
    if (!!gatewayEdit.name && !!gatewayEdit.ipAddress) {
      onSave(gatewayEdit);
    }
  };

  const renderInputs = () => {
    return (
      <Grid container>
        <Grid item xs={12} padding={1}>
          <TextField
            label="Serial id"
            value={gatewayEdit.serialId}
            fullWidth
            required
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} padding={1}>
          <TextField
            label="Name"
            value={gatewayEdit.name}
            fullWidth
            required
            error={!gatewayEdit.name}
            onChange={(value) => onChangeProp(value.target.value, "name")}
          />
        </Grid>
        <Grid item xs={12} padding={1}>
          <TextField
            label="Ip Address"
            value={gatewayEdit.ipAddress}
            fullWidth
            required
            error={!gatewayEdit.ipAddress}
            onChange={(value) => onChangeProp(value.target.value, "ipAddress")}
          />
        </Grid>
      </Grid>
    );
  };

  const render = () => {
    return (
      <DialogComponent
        title="Edit gateway properties"
        open={open}
        onClose={onClose}
        persistent={true}
        actions={[
          <Button key="confirmBtn-1" onClick={onClose}>
            {"Cancel"}
          </Button>,
          <Button key="confirmBtn-2" onClick={onSaveClick}>
            {"Save"}
          </Button>,
        ]}
        maxWidth="sm"
      >
        {renderInputs()}
      </DialogComponent>
    );
  };

  return render();
};

export default GatewayDialog;
