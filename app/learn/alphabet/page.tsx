'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import ButtonBase from '@mui/material/ButtonBase';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Navbar from '@/components/Navbar';
import { getAlphabet } from '@/lib/api';

interface AlphabetEntry {
  letter?: string;
  character?: string;
  example?: string;
  example_word?: string;
  meaning?: string;
  english?: string;
}

export default function AlphabetPage() {
  const [data, setData] = useState<AlphabetEntry[]>([]);
  const [selected, setSelected] = useState<AlphabetEntry | null>(null);

  useEffect(() => {
    getAlphabet().then(setData).catch(console.error);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="md" sx={{ flex: 1, py: 4, px: 2 }}>
        <Typography variant="h5" color="primary" fontWeight={700} mb={3}>
          Jenjo Alphabet
        </Typography>

        {data.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        )}

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {data.map((entry, i) => {
            const letter = entry.letter || entry.character || '?';
            return (
              <ButtonBase
                key={i}
                onClick={() => setSelected(entry)}
                component={Paper}
                elevation={1}
                sx={{
                  borderRadius: 3,
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  width: '100%',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 4 },
                }}
              >
                <Typography variant="h5" color="primary" fontWeight={700}>
                  {letter}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {entry.example || entry.example_word || ''}
                </Typography>
              </ButtonBase>
            );
          })}
        </div>
      </Container>

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
          <Typography variant="h2" component="div" color="primary" fontWeight={700}>
            {selected?.letter || selected?.character}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          {(selected?.example || selected?.example_word) && (
            <Typography variant="h6" mt={1}>
              {selected?.example || selected?.example_word}
            </Typography>
          )}
          {(selected?.meaning || selected?.english) && (
            <Typography variant="body2" color="text.secondary" mt={1}>
              {selected?.meaning || selected?.english}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button variant="contained" onClick={() => setSelected(null)} sx={{ minWidth: 120 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
