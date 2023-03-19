import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Typography, Switch, FormGroup, FormControlLabel } from "@mui/material";
import "./popup.css";

const App: React.FC<{}> = () => {
  const [checked, setChecked] = useState(true);

  useEffect(() => {
    chrome.storage.sync
      .get("autoReplace")
      .then((result) => {
        console.log(`💬 autoReplace get: ${result.autoReplace}`);
        setChecked(result.autoReplace);
      })
      .catch((error) => {
        console.log(`💬 autoReplace get error: ${error}`);
        chrome.storage.sync.set({ autoReplace: true });
        setChecked(true);
      });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`💬 autoReplace set: ${event.target.checked}`);
    chrome.storage.sync.set({ autoReplace: event.target.checked });
    setChecked(event.target.checked);
  };

  const clearStorage = () => {
    console.log(`💬 clear storage`);
    chrome.storage.sync.clear();
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={<Switch checked={checked} onChange={handleChange} />}
        label="(Experimental) Automatically replace all links"
      />
      <Typography variant="subtitle1" align="right">
        ⚠️ Note: Refresh page after change
      </Typography>

      {/* <Button variant="outlined" onClick={clearStorage}>
        DEBUG - clear storage
      </Button> */}
    </FormGroup>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
