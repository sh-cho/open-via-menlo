import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Switch,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  Button,
  Stack,
  Box,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import "./popup.css";

const App: React.FC<{}> = () => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { autoReplace } = await chrome.storage.sync.get("autoReplace");
        console.log(`💬 autoReplace get: ${autoReplace}`);
        setChecked(autoReplace);
      } catch (e) {
        console.log(`💬 autoReplace get error: ${e}`);
        await Promise.all([
          chrome.storage.sync.set({ autoReplace: false }),
          chrome.action.setBadgeText({ text: "" }),
        ]);

        setChecked(false);
      }
    })();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    console.log(`💬 autoReplace set: ${checked}`);
    chrome.storage.sync.set({ autoReplace: checked });
    chrome.action.setBadgeText({ text: checked ? "ON" : "" });
    setChecked(checked);
  };

  const clearStorage = () => {
    console.log(`💬 clear storage`);
    chrome.storage.sync.clear();
  };

  return (
    <Box>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={checked}
              onChange={handleChange}
              aria-describedby="switch-helper-text"
            />
          }
          label="Automatically replace all links"
        />
        <FormHelperText id="switch-helper-text">
          ⚠️ Experimental. Refresh page after change.
        </FormHelperText>
      </FormGroup>
      <Stack direction="row" justifyContent="end">
        <Button
          variant="outlined"
          size="small"
          startIcon={<SettingsIcon />}
          onClick={() => {
            chrome.runtime.openOptionsPage();
          }}
        >
          Options
        </Button>
      </Stack>
    </Box>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
