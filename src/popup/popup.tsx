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
import { updateBadgeText } from "../utils/helpers";
import "./popup.css";

const App: React.FC<{}> = () => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { autoReplace } = await chrome.storage.sync.get("autoReplace");
        console.log(`🎈 autoReplace get: ${autoReplace}`);
        setChecked(autoReplace);
      } catch (e) {
        console.log(`🎈 autoReplace get error: ${e}`);
        await Promise.all([
          chrome.storage.sync.set({ autoReplace: false }),
          updateBadgeText(window.location.href, false),
        ]);

        setChecked(false);
      }
    })();
  }, []);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    console.log(`🎈 autoReplace set: ${checked}`);

    await chrome.storage.sync.set({ autoReplace: checked });
    setChecked(checked);

    try {
      const activeTabs: chrome.tabs.Tab[] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      }); // active: 열린 탭

      console.log(`🎈 activeTabs: ${JSON.stringify(activeTabs)}`);

      // TODO: multiple windows ..
      const tab = activeTabs[0];
      if (!tab.url || !tab.id || !tab.url.match(String.raw`https?://*`)) {
        return;
      }

      // XXX: how can I send with chrome.tabs.sendMessage? I think this is the problem
      await chrome.runtime.sendMessage({
        url: tab.url,
        on: checked,
      });
    } catch (e) {
      console.log(`🎈 sendMessage error: ${e}`);
    }
  };

  const clearStorage = () => {
    console.log(`🎈 clear storage`);
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
