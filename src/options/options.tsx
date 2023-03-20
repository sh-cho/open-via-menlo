import React from "react";
import { createRoot } from "react-dom/client";
import {
  AppBar,
  Box,
  CssBaseline,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

const App: React.FC<{}> = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { sm: "block" } }}
          >
            open-via-menlo option
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "80ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="exclude-url-patterns"
            label="(Optional) Exclude URL patterns"
            multiline
            minRows={4}
            helperText="➡️ glob patterns, one per line. (ex. https://*.example.com/*)"
          />
        </Box>
        {/* Add Some links */}
      </Box>
    </Box>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
