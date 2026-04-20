'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const sections = [
  { href: '/learn/alphabet', title: 'Alphabet', desc: '38 letters of the Jenjo script', icon: '🔤' },
  { href: '/learn/vocabulary', title: 'Vocabulary', desc: 'Words by category: body, animals, food & more', icon: '📖' },
  { href: '/learn/phrases', title: 'Phrases', desc: 'Common expressions and greetings', icon: '💬' },
  { href: '/learn/numbers', title: 'Numbers', desc: 'Count 1–20 in Jenjo', icon: '🔢' },
];

export default function LearnPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ flex: 1, py: 4, px: 2 }}>
        <Typography variant="h5" color="primary" fontWeight={700} mb={0.5}>
          Learn Jenjo
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Pick a topic to start learning
        </Typography>
        <div className="grid grid-cols-2 gap-4">
          {sections.map((s) => (
            <Card key={s.href} elevation={1}>
              <CardActionArea component={Link} href={s.href} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h4" component="span" display="block" mb={1}>
                    {s.icon}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" fontWeight={700}>
                    {s.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {s.desc}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </div>
      </Container>
    </Box>
  );
}
