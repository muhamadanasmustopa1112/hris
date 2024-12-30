import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Typography } from '@mui/material';
import { IconBellRinging, IconMenu } from '@tabler/icons-react';
import Cookies from 'js-cookie';
import Profile from './Profile';

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  background: theme.palette.background.paper,
  justifyContent: 'center',
  backdropFilter: 'blur(4px)',
  borderBottom: `2px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('lg')]: {
    minHeight: '70px',
  },
}));

const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  width: '100%',
  color: theme.palette.text.secondary,
  padding: theme.spacing(1, 2),
}));

const Header = ({ toggleMobileSidebar }: ItemType) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      setUser(JSON.parse(userCookie).name);
    }
  }, []);

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: 'none',
              xs: 'inline',
            },
            '&:hover': {
              backgroundColor: theme => theme.palette.action.hover,
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        <IconButton
          size="large"
          aria-label="show 11 new notifications"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="true"
          sx={{
            '&:hover': {
              backgroundColor: theme => theme.palette.action.hover,
            },
          }}
        >
          <Badge variant="dot" color="primary">
            <IconBellRinging size="21" stroke="1.5" />
          </Badge>
        </IconButton>

        <Typography
          variant="h6"
          align="center"
          gutterBottom
          style={{ marginLeft: "20px" }}
        >
          {user ? `Selamat Datang, ${user}` : 'Selamat Datang'}
        </Typography>
        <Box flexGrow={1} />

        <Stack spacing={1} direction="row" alignItems="center">
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};
export default Header;
