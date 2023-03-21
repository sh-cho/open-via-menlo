import React, { useEffect, useState, useCallback } from "react";
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

const App: React.FC<{}> = () => {
  const [excludeUrlPatterns, setExcludeUrlPatterns] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { excludeUrlPatterns } = await chrome.storage.sync.get(
          "excludeUrlPatterns"
        );
        console.log(`#️⃣ excludeUrlPatterns get: ${excludeUrlPatterns}`);
        setExcludeUrlPatterns(excludeUrlPatterns.join("\n"));
      } catch (e) {
        console.log(`#️⃣ excludeUrlPatterns get error: ${e}`);
        await chrome.storage.sync.set({ excludeUrlPatterns: "" });
        setExcludeUrlPatterns("");
      }
    })();
  }, []);

  const saveToStorage = _.debounce(async (_val: string) => {
    const patterns = _val.split("\n").filter((pattern) => pattern.length > 0);
    console.log(`#️⃣ excludeUrlPatterns set: ${patterns}`);
    await chrome.storage.sync.set({ excludeUrlPatterns: patterns });
  }, 250);

  // XXX: why this is working ?
  const debouceRequest = useCallback(
    (value: string) => saveToStorage(value),
    []
  );

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    debouceRequest(event.target.value);
    setExcludeUrlPatterns(event.target.value);
  };

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
            label="(Optional) Auto-replace Exclude URL patterns (glob)"
            fullWidth
            multiline
            minRows={4}
            helperText="➡️ If URL of current tab matches for any pattern, auto-replace is disabled. / glob patterns, one per line. / ex. http?://*.kakaocorp.com/*"
            value={excludeUrlPatterns}
            onChange={handleChange}
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
