import React from "react";
import { createRoot } from "react-dom/client";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import PersonIcon from "@mui/icons-material/Person";

const App: React.FC<{}> = () => {
  return (
    <List>
      <ListItem component="a" href="https://github.com/sh-cho/open-via-menlo">
        <ListItemButton>
          <ListItemIcon>
            <GitHubIcon />
          </ListItemIcon>
          <ListItemText primary="Repository" />
        </ListItemButton>
      </ListItem>
      <ListItem component="a" href="https://github.com/sh-cho">
        <ListItemButton>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Author" />
        </ListItemButton>
      </ListItem>
    </List>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
