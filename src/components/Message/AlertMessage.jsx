import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";

const AlertMessage = ({ message, severity = "success" }) => {
  const [open, setOpen] = React.useState(true);

  if (!message) return null;

  return (
    <Box
      sx={{
        display: "inline-block",   // 👈 size based on content
        maxWidth: "100%",
      }}
    >
      <Collapse in={open}>
        <Alert
          severity={severity}
          sx={{
            display: "inline-flex", // 👈 shrink to content
            alignItems: "center",
          }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setOpen(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default AlertMessage;