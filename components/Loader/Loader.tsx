import { Backdrop, Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

export interface ILoaderProps {
  loading?: boolean;
}

const LoaderComponent = (props: ILoaderProps) => {
  const { loading } = props;
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    setLoadingState(!!loading);
  }, [loading]);
  return !!loadingState ? (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading || false}
    >
      <CircularProgress />
    </Backdrop>
  ) : (
    <></>
  );
};

export default LoaderComponent;
