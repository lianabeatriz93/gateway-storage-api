import { Button, Grid, MenuItem, TextField } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { IPeripheralModel, PeripheralEnum } from "../../models/models";
import DialogComponent from "../Dialog/Dialog";

export interface IPeripheralDialogProps {
  onSave: (value: IPeripheralModel) => unknown;
  open: boolean;
  onClose: () => unknown;
  peripheral: IPeripheralModel | null;
}

const PeripheralDialog = (props: IPeripheralDialogProps) => {
  const { peripheral, open, onClose, onSave } = props;

  const [peripheralEdit, setPeripheralEdit] = useState<IPeripheralModel>({
    uid: 0,
    date: new Date(),
    status: PeripheralEnum.offline,
    vendor: "",
    gateway_id: "",
  } as IPeripheralModel);

  useEffect(() => {
    if (peripheral) setPeripheralEdit({ ...peripheral });
    else
      setPeripheralEdit({
        uid: 0,
        date: new Date(),
        status: PeripheralEnum.offline,
        vendor: "",
        gateway_id: "",
      } as IPeripheralModel);
  }, [peripheral]);

  const onChangeProp = (
    value: any,
    prop: "date" | "status" | "uid" | "vendor"
  ) => {
    setPeripheralEdit({ ...peripheralEdit, [prop]: value });
  };

  const onSaveClick = () => {
    if (
      !!peripheralEdit.date &&
      !!peripheralEdit.status &&
      !!peripheralEdit.uid &&
      !!peripheralEdit.vendor
    ) {
      onSave(peripheralEdit);
    }
  };

  const renderInputs = () => {
    return (
      <Grid container>
        <Grid item xs={12} md={6} padding={1}>
          <TextField
            label="UID"
            value={peripheralEdit.uid}
            fullWidth
            type="number"
            onChange={(value) => onChangeProp(value.target.value, "uid")}
            required
            error={!peripheralEdit.uid}
            InputProps={{
              readOnly: !!peripheralEdit._id,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} padding={1}>
          <TextField
            label="Vendor"
            value={peripheralEdit.vendor}
            fullWidth
            required
            error={!peripheralEdit.vendor}
            onChange={(value) => onChangeProp(value.target.value, "vendor")}
          />
        </Grid>
        <Grid item xs={12} md={6} padding={1}>
          <TextField
            label="Date"
            value={dayjs(peripheralEdit.date).format("YYYY-MM-DD")}
            fullWidth
            type="date"
            required
            error={!peripheralEdit.date}
            onChange={(value) =>
              onChangeProp(
                new Date(dayjs(value.target.value).format("MM/DD/YYYY")),
                "date"
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6} padding={1}>
          <TextField
            select
            label="Status"
            value={peripheralEdit.status}
            fullWidth
            required
            error={!peripheralEdit.status}
            onChange={(value) => onChangeProp(value.target.value, "status")}
          >
            <MenuItem key="offline" value="offline">
              offline
            </MenuItem>
            <MenuItem key="online" value="online">
              online
            </MenuItem>
            <MenuItem></MenuItem>
          </TextField>
        </Grid>
      </Grid>
    );
  };

  const render = () => {
    return (
      <DialogComponent
        title="Add peripheralEdit"
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

export default PeripheralDialog;
