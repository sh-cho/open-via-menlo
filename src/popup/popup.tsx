import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
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
        label="Automatically replace all anchor tags to go through menlo"
      />
      {/* <br /> */}
      <Button variant="outlined" onClick={clearStorage}>
        DEBUG - clear storage
      </Button>
    </FormGroup>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
