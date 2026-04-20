'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{ color: 'secondary.main', fontWeight: 700, textDecoration: 'none', flexGrow: 1 }}
        >
          Mwambwi
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component={Link}
            href="/chat"
            variant={pathname === '/chat' ? 'contained' : 'text'}
            color="secondary"
            size="small"
          >
            Chat
          </Button>
          <Button
            component={Link}
            href="/learn"
            variant={pathname.startsWith('/learn') ? 'contained' : 'text'}
            color="secondary"
            size="small"
          >
            Learn
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
