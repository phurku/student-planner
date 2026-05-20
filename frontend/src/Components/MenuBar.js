import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';

function MenuBar({ drawerOpen, toggleDrawer }) {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    toggleDrawer(false)({ type: 'click' });
  };

  return (
    <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
      <div
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List className='drwaer-list'>
          <ListItem button onClick={() => handleNavigation('/account-details')}>
            <ListItemText primary="Account Details" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/settings')}>
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/signin')}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
}

export default MenuBar;