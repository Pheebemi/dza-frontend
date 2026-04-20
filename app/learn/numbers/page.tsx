'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Navbar from '@/components/Navbar';
import { getNumbers } from '@/lib/api';

interface NumberEntry {
  number?: number;
  numeral?: number;
  value?: number;
  jenjo?: string;
  dza?: string;
  word?: string;
  note?: string;
  pattern?: string;
}

export default function NumbersPage() {
  const [numbers, setNumbers] = useState<NumberEntry[]>([]);

  useEffect(() => {
    getNumbers()
      .then((res) => {
        if (Array.isArray(res)) {
          setNumbers(res);
        } else if (res.cardinal) {
          setNumbers(res.cardinal);
        } else {
          setNumbers(Object.values(res).find(Array.isArray) as NumberEntry[] ?? []);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="md" sx={{ flex: 1, py: 4, px: 2 }}>
        <Typography variant="h5" color="primary" sx={{ fontWeight: 700, mb: 0.5 }}>
          Numbers
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Note: 6 = &quot;sibling of 1&quot;, 7 = &quot;sibling of 2&quot;, etc.
        </Typography>

        {numbers.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {numbers.map((entry, i) => {
            const num = entry.number ?? entry.numeral ?? entry.value ?? i + 1;
            const word = entry.jenjo || entry.dza || entry.word || '—';
            const note = entry.note || entry.pattern;
            return (
              <Card key={i} elevation={1} sx={{ textAlign: 'center' }}>
                <CardContent>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'secondary.main',
                      width: 48,
                      height: 48,
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      mx: 'auto',
                      mb: 1.5,
                    }}
                  >
                    {num}
                  </Avatar>
                  <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700 }}>
                    {word}
                  </Typography>
                  {note && (
                    <Typography variant="caption" color="text.secondary">
                      {note}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </Box>
  );
}
