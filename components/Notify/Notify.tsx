import { Alert, Snackbar } from "@mui/material";

export interface INotifyComponentProps {
  open: boolean;
  onClose: () => unknown;
  message: string;
  type: "success" | "error";
}

const NotifyComponent = (props: INotifyComponentProps) => {
  const { message, open, onClose, type } = props;
  const render = () => {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={6000}
        onClose={onClose}
      >
        <Alert
          onClose={onClose}
          severity={type || "success"}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    );
  };

  return render();
};

export default NotifyComponent;
