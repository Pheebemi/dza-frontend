'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Navbar from '@/components/Navbar';
import { getPhrases } from '@/lib/api';

interface Phrase {
  jenjo?: string;
  dza?: string;
  phrase?: string;
  english?: string;
  translation?: string;
  category?: string;
  context?: string;
}

export default function PhrasesPage() {
  const [phrases, setPhrases] = useState<Phrase[]>([]);

  useEffect(() => {
    getPhrases()
      .then((res) => setPhrases(Array.isArray(res) ? res : []))
      .catch(console.error);
  }, []);

  const grouped = phrases.reduce<Record<string, Phrase[]>>((acc, p) => {
    const cat = p.category || p.context || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ flex: 1, py: 4, px: 2 }}>
        <Typography variant="h5" color="primary" fontWeight={700} mb={3}>
          Common Phrases
        </Typography>

        {phrases.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        )}

        {Object.entries(grouped).map(([cat, items]) => (
          <Box key={cat} mb={4}>
            <Chip
              label={cat.toUpperCase()}
              color="primary"
              size="small"
              sx={{ mb: 1.5, letterSpacing: '0.07em', fontWeight: 600 }}
            />
            <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <List disablePadding>
                {items.map((p, i) => (
                  <Box key={i}>
                    <ListItem sx={{ py: 1.5, px: 2 }}>
                      <ListItemText
                        primary={p.jenjo || p.dza || p.phrase}
                        secondary={p.english || p.translation}
                        slotProps={{
                          primary: { style: { color: '#1B5E20', fontWeight: 700 } },
                          secondary: { style: { fontSize: '0.875rem' } },
                        }}
                      />
                    </ListItem>
                    {i < items.length - 1 && <Divider component="li" />}
                  </Box>
                ))}
              </List>
            </Paper>
          </Box>
        ))}
      </Container>
    </Box>
  );
}
