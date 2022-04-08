import { Add, Cable, Delete, Edit } from "@mui/icons-material";
import { Button, Grid, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { IPeripheralModel } from "../../models/models";
import { GatewayService } from "../../services/GatewayService";
import DialogComponent from "../Dialog/Dialog";
import ListComponent from "../List/List";
import ListItemComponent from "../List/ListItem/ListItem";
import { IItem } from "../List/models";
import LoaderComponent from "../Loader/Loader";
import NotifyComponent from "../Notify/Notify";
import PeripheralDialog from "../PeripheralDialog/PeripheralDialog";

export interface IListPeripheralsProps {
  gatewayId: string;
  peripherals: IPeripheralModel[];
  onChange: (value: IPeripheralModel[], prop: "peripherals") => unknown;
}

const ListPeripherals = (props: IListPeripheralsProps) => {
  const { gatewayId, peripherals, onChange } = props;
  const [showAddPeripheralDialog, setShowAddPeripheralDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [peripheralSelected, setPeripheralSelected] =
    useState<IPeripheralModel | null>(null);
  const [messageNotify, setMessageNotify] = useState("");
  const [typeNotify, setTypeNotify] = useState<"success" | "error">("success");
  const [openNotify, setOpenNotify] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDelete = async (status: boolean) => {
    if (status) {
      if (peripheralSelected && !!gatewayId) {
        setLoading(true);
        const result = await GatewayService.deletePeripheralGateway({
          _id: peripheralSelected._id,
        });
        setLoading(false);
        if (!result.data.success) {
          showNotification(result.data.message, "error");
          return;
        } else {
          showNotification("Peripheral deleted successfully", "success");
        }
      }

      onChange(
        peripherals.filter((item) => item !== peripheralSelected),
        "peripherals"
      );
    }
    setShowConfirmDialog(false);
  };

  const deletePeripheral = (item: IItem | null) => {
    if (item) {
      setPeripheralSelected(item as IPeripheralModel);
      setShowConfirmDialog(true);
    }
  };

  const editPeripheral = (item: IItem | null) => {
    if (item) {
      setPeripheralSelected(item as IPeripheralModel);
      setShowAddPeripheralDialog(true);
    }
  };

  const onSave = async (peripheralInput: IPeripheralModel) => {
    if (!!gatewayId) {
      setLoading(true);
      const result = peripheralSelected
        ? await GatewayService.putPeripheralGateway(peripheralInput)
        : await GatewayService.postPeripheralGateway(
            { _id: gatewayId },
            peripheralInput
          );
      setLoading(false);
      if (!result.data.success) {
        showNotification(result.data.message, "error");
        return;
      } else {
        onChange(result.data.result?.peripherals || [], "peripherals");
        showNotification("Peripheral saved successfully", "success");
      }
    } else {
      let peripheralsList: IPeripheralModel[];
      if (!peripheralSelected) {
        peripheralsList = peripherals
          .map((item) => ({ ...item }))
          .concat(peripheralInput);
      } else {
        peripheralsList = peripherals.map((item) =>
          item === peripheralSelected ? peripheralInput : item
        );
      }
      onChange(peripheralsList, "peripherals");
    }

    setShowAddPeripheralDialog(false);
  };

  const addPeripheral = () => {
    setPeripheralSelected(null);
    setShowAddPeripheralDialog(true);
  };

  const showNotification = (err: string, type: "success" | "error") => {
    setMessageNotify(err);
    setTypeNotify(type);
    setOpenNotify(true);
  };

  const getItemBody = (item: IItem, sx?: any) => {
    const style = sx ? sx : {};
    const dateStr = item.date ? dayjs(item.date).format("DD-MM-YYYY") : "Date";
    return (
      <Grid container>
        <Grid item xs={6} md={3}>
          <Typography sx={style}>{item.uid || "UID"}</Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography sx={style}>{item.vendor || "Vendor"}</Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography sx={style}>{item.status || "Status"}</Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography sx={style}>{dateStr}</Typography>
        </Grid>
      </Grid>
    );
  };

  const getHeaderBody = () => {
    const item = {
      date: "",
      status: "Status",
      vendor: "Vendor",
      uid: "UID",
    };
    return (
      <Grid>
        <ListItemComponent
          item={item}
          getItemBody={(item) => getItemBody(item, { fontWeight: 600 })}
          buttons={[
            { icon: <Edit />, label: "", hide: true },
            { icon: <Edit />, label: "", hide: true },
          ]}
        />
      </Grid>
    );
  };

  const render = () => {
    return (
      <Grid sx={{ height: "100%" }}>
        <ListComponent
          items={peripherals || []}
          labels={{ headerTitle: "Peripherals" }}
          icon={<Cable />}
          headerButtons={[
            {
              icon: <Add />,
              tooltip: "Add Peripheral",
              onClick: () => addPeripheral(),
            },
          ]}
          itemButtons={[
            {
              icon: <Edit />,
              tooltip: "Edit peripheral",
              onClick: (item) => editPeripheral(item),
            },
            {
              icon: <Delete />,
              tooltip: "Delete peripheral",
              onClick: (item) => deletePeripheral(item),
            },
          ]}
          getItemBody={getItemBody}
          headerItem={getHeaderBody()}
        />
        <DialogComponent
          title="Confirm dialog"
          open={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          persistent={true}
          actions={[
            <Button key="confirmBtn-1" onClick={() => onDelete(false)}>
              {"Cancel"}
            </Button>,
            <Button key="confirmBtn-2" onClick={() => onDelete(true)}>
              {"Confirm"}
            </Button>,
          ]}
          maxWidth="sm"
        >
          <Typography>
            Are you sure you want to delete selected item?
          </Typography>
        </DialogComponent>
        <PeripheralDialog
          peripheral={peripheralSelected}
          onSave={onSave}
          open={showAddPeripheralDialog}
          onClose={() => setShowAddPeripheralDialog(false)}
        />
        <NotifyComponent
          message={messageNotify}
          open={openNotify}
          type={typeNotify}
          onClose={() => setOpenNotify(false)}
        />
        <LoaderComponent loading={loading} />
      </Grid>
    );
  };

  return render();
};

export default ListPeripherals;
