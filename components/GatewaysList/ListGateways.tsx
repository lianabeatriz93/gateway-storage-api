import { Button, Grid, Typography } from "@mui/material";
import { DoorFront, Add, Delete, Edit, Cable } from "@mui/icons-material";
import ListComponent from "../List/List";
import { IItem } from "../List/models";
import { useEffect, useState } from "react";
import { IGatewayModel } from "../../models/models";
import { GatewayService } from "../../services/GatewayService";
import ListItemComponent from "../List/ListItem/ListItem";
import { useRouter } from "next/router";
import DialogComponent from "../Dialog/Dialog";
import NotifyComponent from "../Notify/Notify";
import GatewayDialog from "../GatewayDialog/GatewayDialog";
import LoaderComponent from "../Loader/Loader";

const ListGateways = () => {
  const navigate = useRouter();
  const [gateways, setGateways] = useState<IGatewayModel[]>([]);
  const [gatewaySelected, setGatewaySelected] = useState<IGatewayModel | null>(
    null
  );
  const [showEditGatewayDialog, setShowEditGatewayDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [messageNotify, setMessageNotify] = useState("");
  const [typeNotify, setTypeNotify] = useState<"success" | "error">("success");
  const [openNotify, setOpenNotify] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllGateways();
  }, []);

  const loadAllGateways = async () => {
    setLoading(true);
    const result = await GatewayService.getGateways();
    if (result.data.success) {
      setGateways(result.data.result);
    } else {
      showNotification(result.data.message, "error");
    }
    setLoading(false);
  };
  const editGatewayPeripherals = (item: IItem | null) => {
    if (item) {
      navigate.push(`/gateway/${item._id}`);
    }
  };
  const deleteGateway = (item: IItem | null) => {
    if (item) {
      setGatewaySelected(item as IGatewayModel);
      setShowConfirmDialog(true);
    }
  };

  const onDelete = async (status: boolean) => {
    if (status && gatewaySelected && gatewaySelected._id) {
      setLoading(true);
      const result = await GatewayService.deleteGateway({
        _id: gatewaySelected._id,
      });
      if (result.data.success) {
        await loadAllGateways();
        showNotification("Gateway deleted successfully", "success");
      } else {
        showNotification(result.data.message, "error");
      }
      setLoading(false);
    }
    setShowConfirmDialog(false);
  };

  const editGateway = (item: IItem | null) => {
    if (item) {
      setGatewaySelected(item as IGatewayModel);
      setShowEditGatewayDialog(true);
    }
  };

  const onEdit = async (gateway: IGatewayModel) => {
    setLoading(true);
    const result = await GatewayService.putGateway({
      ...gateway,
      peripherals: [],
    });
    if (result.data.success) {
      await loadAllGateways();
      showNotification("Gateway edited successfully", "success");
      setShowEditGatewayDialog(false);
    } else {
      showNotification(result.data.message, "error");
    }
    setLoading(false);
  };

  const showNotification = (err: string, type: "success" | "error") => {
    setMessageNotify(err);
    setTypeNotify(type);
    setOpenNotify(true);
  };

  const getItemBody = (item: IItem, sx?: any) => {
    let peripheral = "";
    if (typeof item.peripherals === "string") peripheral = item.peripherals;
    else peripheral = `${(item.peripherals || []).length}`;
    const style = sx ? sx : {};
    return (
      <Grid container>
        <Grid item xs={6} md={3}>
          <Typography sx={style}>{item.serialId || "Serial Id"}</Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography sx={style}>{item.name || "Name"}</Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography sx={style}>{item.ipAddress || "IP"}</Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography sx={style}>{peripheral || "No. Peripherals"}</Typography>
        </Grid>
      </Grid>
    );
  };

  const getHeaderBody = () => {
    const item = {
      ipAddress: "IP Address",
      name: "Name",
      serialId: "Serial Id",
      peripherals: "No. Peripherals",
    };
    return (
      <Grid>
        <ListItemComponent
          item={item}
          getItemBody={(item) => getItemBody(item, { fontWeight: 600 })}
          buttons={[
            { icon: <Edit />, label: "", hide: true },
            { icon: <Edit />, label: "", hide: true },
            { icon: <Edit />, label: "", hide: true },
          ]}
        />

        <NotifyComponent
          message={messageNotify}
          open={openNotify}
          type={typeNotify}
          onClose={() => setOpenNotify(false)}
        />
      </Grid>
    );
  };

  const render = () => {
    return (
      <Grid sx={{ height: "100%", overflowY: "auto" }}>
        <ListComponent
          items={gateways}
          labels={{ headerTitle: "Gateways" }}
          icon={<DoorFront />}
          headerButtons={[
            {
              icon: <Add />,
              label: "Add Gateway",
              onClick: () => {
                navigate.push("/gateway/new");
              },
            },
          ]}
          itemButtons={[
            {
              icon: <Edit />,
              tooltip: "Edit gateway properties",
              onClick: (item) => editGateway(item),
            },
            {
              icon: <Cable />,
              tooltip: "Edit gateway peripherals",
              onClick: (item) => editGatewayPeripherals(item),
            },
            {
              icon: <Delete />,
              tooltip: "Delete gateway",
              onClick: (item) => deleteGateway(item),
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
        <GatewayDialog
          open={showEditGatewayDialog}
          onClose={() => setShowEditGatewayDialog(false)}
          onSave={onEdit}
          gateway={gatewaySelected}
        />
        <LoaderComponent loading={loading} />
      </Grid>
    );
  };

  return render();
};

export default ListGateways;
