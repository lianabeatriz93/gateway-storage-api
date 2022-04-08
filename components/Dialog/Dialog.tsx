import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Grid,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef } from "react";

export interface IDialogComponentProps {
  title: string;
  open: boolean;
  onClose: () => unknown;
  actions?: React.ReactElement[];
  children?: React.ReactElement;
  maxWidth: DialogProps["maxWidth"];
  persistent?: boolean;
}

const DialogComponent = (props: IDialogComponentProps) => {
  const { title, open, onClose, actions, maxWidth, children, persistent } =
    props;

  const descriptionElementRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        // descriptionElement.focus();
      }
    }
  }, [open]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const renderActionButtons = () => {
    if (actions) {
      return actions.map((item, index) => {
        return <Grid key={`dialo-btns-${index}`}>{item}</Grid>;
      });
    }
    return [];
  };

  return (
    <Dialog
      open={open}
      onClose={!!persistent ? () => null : handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth={maxWidth}
      fullWidth={true}
    >
      <DialogTitle id="scroll-dialog-title">
        <Grid>{title}</Grid>
      </DialogTitle>
      <Box component="form">
        <DialogContent dividers={true}>
          <Grid
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {children ? children : <></>}
          </Grid>
        </DialogContent>
        <DialogActions>{renderActionButtons()}</DialogActions>
      </Box>
    </Dialog>
  );
};

export default DialogComponent;
