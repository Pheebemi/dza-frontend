'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Link from 'next/link';

const samplePhrases = [
  { jenjo: 'Səko!', english: 'Hello / Greetings' },
  { jenjo: 'Ba wu bɨ tang', english: "Come let's eat" },
  { jenjo: 'Fi tswebi və Fangwa', english: 'God loves the world' },
  { jenjo: 'Mɨng', english: 'Water' },
];

export default function HomePage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Hero */}
      <Box
        component="section"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'primary.main',
          color: 'white',
          textAlign: 'center',
          px: 3,
          py: 10,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="overline"
            sx={{ color: 'secondary.main', letterSpacing: '0.15em', fontWeight: 600 }}
          >
            Taraba State, Nigeria
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 700, mt: 1, mb: 1 }}>
            Mwambwi
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
            Learn Jenjo
          </Typography>
          <Typography variant="body1" sx={{ color: '#a5d6a7', mb: 5 }}>
            The language of the Dza people · ~100,000 speakers
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'center' }}>
            <Button variant="contained" color="secondary" size="large" component={Link} href="/chat" sx={{ px: 4 }}>
              Start Chatting
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              href="/learn"
              sx={{
                px: 4,
                borderColor: 'white',
                color: 'white',
                '&:hover': { bgcolor: 'white', color: 'primary.main', borderColor: 'white' },
              }}
            >
              Learn Basics
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Sample phrases */}
      <Box component="section" sx={{ bgcolor: '#FFFDE7', py: 7, px: 3 }}>
        <Container maxWidth="sm">
          <Typography variant="h6" color="primary" sx={{ textAlign: 'center', fontWeight: 700, mb: 3 }}>
            A taste of Jenjo
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            {samplePhrases.map((p) => (
              <Card key={p.jenjo} variant="outlined">
                <CardContent sx={{ pb: '12px !important' }}>
                  <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700 }}>
                    {p.jenjo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {p.english}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'primary.main', color: '#a5d6a7', textAlign: 'center', py: 2 }}>
        <Typography variant="caption">
          Built to preserve the Dza language · Taraba State, Nigeria
        </Typography>
      </Box>
    </Box>
  );
}
