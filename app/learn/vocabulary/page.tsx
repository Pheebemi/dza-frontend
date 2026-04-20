'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import Navbar from '@/components/Navbar';
import { getVocabulary } from '@/lib/api';

const CATEGORIES = [
  'body_parts', 'animals', 'nature', 'food', 'people',
  'colors', 'verbs', 'adjectives', 'places', 'abstract', 'religious',
];

interface VocabEntry {
  jenjo?: string;
  dza?: string;
  english?: string;
  meaning?: string;
  word?: string;
}

export default function VocabularyPage() {
  const [category, setCategory] = useState('body_parts');
  const [data, setData] = useState<VocabEntry[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setData([]);
    getVocabulary(category)
      .then((res) => setData(Array.isArray(res) ? res : []))
      .catch(console.error);
  }, [category]);

  const filtered = data.filter((entry) => {
    const jenjo = entry.jenjo || entry.dza || entry.word || '';
    const eng = entry.english || entry.meaning || '';
    const q = search.toLowerCase();
    return jenjo.toLowerCase().includes(q) || eng.toLowerCase().includes(q);
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="md" sx={{ flex: 1, py: 4, px: 2 }}>
        <Typography variant="h5" color="primary" fontWeight={700} mb={2}>
          Vocabulary
        </Typography>

        {/* Category chips */}
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, mb: 2 }}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat.replace('_', ' ')}
              onClick={() => setCategory(cat)}
              color={category === cat ? 'primary' : 'default'}
              variant={category === cat ? 'filled' : 'outlined'}
              sx={{ flexShrink: 0 }}
            />
          ))}
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search words..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />

        {data.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress color="primary" />
          </Box>
        )}

        <div className="grid grid-cols-2 gap-3">
          {filtered.map((entry, i) => (
            <Card key={i} variant="outlined">
              <CardContent sx={{ pb: '12px !important' }}>
                <Typography variant="subtitle1" color="primary" fontWeight={700}>
                  {entry.jenjo || entry.dza || entry.word}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  {entry.english || entry.meaning}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && data.length > 0 && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography color="text.secondary">No results for &quot;{search}&quot;</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
