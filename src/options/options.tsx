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
import _ from "lodash";

const handleOnChange = _.debounce(
  async (event: React.ChangeEvent<HTMLInputElement>) => {
    const patterns = event.target.value
      .split("\n")
      .filter((pattern) => pattern.length > 0);
    console.log(`💬 excludeUrlPatterns set: ${patterns}`);
    await chrome.storage.sync.set({ excludeUrlPatterns: patterns });
  },
  250
);

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
      <Box component="main" sx={{ p: 3, width: 1 }}>
        <Toolbar />
        <Box component="form" noValidate autoComplete="off">
          <TextField
            id="exclude-url-patterns"
            label="(Optional) Exclude URL patterns"
            fullWidth
            multiline
            minRows={4}
            helperText="➡️ If current url is matched, auto-replace is skipped. / glob patterns, one per line. (ex. https://*.example.com/*)"
            onChange={handleOnChange}
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
